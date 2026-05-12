import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useWorkshopStore } from '../store/workshopStore'
import { useT } from '../i18n/useT'
import { useLocale } from '../i18n/store'
import { RITUALS, MANDATORY_IDS } from '../data/signet/rituals'
import { VOICE_ARCHETYPES } from '../data/signet/archetypes'
import { generateSignetClaudeMd, SIGNET_APPLY_PROMPT } from '../data/signet/signet-generator'
import { CHARACTERS, pickCharacter } from '../data/characters'
import { getCharacterHighlight } from '../data/signet/character_defaults'
import VoiceTextInput from '../components/VoiceTextInput'
import { deriveDragonAppearance } from '../data/dragons/derive-appearance'
import { buildDragonPrompt } from '../data/dragons/prompt-builder'
import { generateDragonImage } from '../api/workshopBackend'
import { sealDragon } from '../api/dragons'

const STORAGE_KEY = 'signet-ceremony-answers'

// ────────────────────────────────────────────────────────────────
// utilities
// ────────────────────────────────────────────────────────────────

function loadInitialAnswers() {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch { return {} }
}

function copyToClipboardWithFallback(text) {
  if (navigator?.clipboard?.writeText) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => copyViaTextarea(text))
  }
  return Promise.resolve(copyViaTextarea(text))
}

function copyViaTextarea(text) {
  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.top = '-1000px'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  } catch { return false }
}

// ────────────────────────────────────────────────────────────────
// archetype picker
// ────────────────────────────────────────────────────────────────

function ArchetypePicker({ value, onChange, lang, characterId, characterName }) {
  const recommendedId = getCharacterHighlight(characterId, 'archetype')
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {VOICE_ARCHETYPES.map(a => {
        const isActive = value === a.id
        const isRecommended = a.id === recommendedId && !isActive
        return (
          <button
            key={a.id}
            type="button"
            onClick={() => onChange(a.id)}
            title={isRecommended && characterName
              ? (lang === 'ru' ? `◆ ${characterName} выбрал(а) бы это`
                 : lang === 'uk' ? `◆ ${characterName} обрав(ла) би це`
                 : `◆ ${characterName} would pick this`)
              : ''}
            className={`relative text-left p-4 border transition-all cursor-pointer ${
              isActive
                ? 'border-qa-teal bg-qa-teal/[0.08] shadow-[0_0_20px_rgba(0,229,204,0.15)]'
                : isRecommended
                  ? 'border-qa-teal/60 bg-qa-teal/[0.03] ring-1 ring-qa-teal/40'
                  : 'border-border bg-surface/40 hover:border-qa-teal/40'
            }`}
          >
            {isRecommended && (
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-qa-teal text-black text-[10px] font-bold flex items-center justify-center" title={characterName}>
                ◆
              </span>
            )}
            <div className="flex items-baseline gap-2 mb-1.5">
              <span className={`text-[16px] ${isActive ? 'text-qa-teal' : 'text-text-dim'}`}>{a.glyph}</span>
              <span className={`font-display italic text-[18px] ${isActive ? 'text-white' : 'text-text-body'}`}>
                {a.name}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[1.5px] text-text-dim">
                {lang === 'uk' ? (a.name_uk || a.name_ru) : a.name_ru}
              </span>
            </div>
            <p className="text-[12.5px] text-text-secondary italic leading-relaxed mb-2">
              {lang === 'ru' ? a.tagline_ru : lang === 'uk' ? (a.tagline_uk || a.tagline_en) : a.tagline_en}
            </p>
            <p className="font-mono text-[11px] text-qa-teal/80 leading-tight">
              {lang === 'ru' ? a.one_liner_ru : lang === 'uk' ? (a.one_liner_uk || a.one_liner_en) : a.one_liner_en}
            </p>
          </button>
        )
      })}
      {/* Custom option */}
      <button
        type="button"
        onClick={() => onChange('custom')}
        className={`text-left p-4 border transition-all cursor-pointer ${
          value === 'custom'
            ? 'border-qa-teal bg-qa-teal/[0.08] shadow-[0_0_20px_rgba(0,229,204,0.15)]'
            : 'border-border bg-surface/40 hover:border-qa-teal/40'
        }`}
      >
        <div className="flex items-baseline gap-2 mb-1.5">
          <span className="text-[16px] text-text-dim">✦</span>
          <span className="font-display italic text-[18px] text-text-body">
            {lang === 'ru' ? 'Свой собственный' : lang === 'uk' ? 'Свій власний' : 'Your own'}
          </span>
        </div>
        <p className="text-[12.5px] text-text-secondary italic leading-relaxed">
          {lang === 'ru'
            ? 'Не вижу себя ни в одном - опишу сам.'
            : lang === 'uk'
              ? 'Не бачу себе в жодному - опишу сам.'
              : 'None of these fit - I\'ll describe my own.'}
        </p>
      </button>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────
// question field
// ────────────────────────────────────────────────────────────────

// ─── Preset chip strip ────────────────────────────────────────────
function PresetChips({ presets, currentValue, onPick, lang, questionId, characterId, characterName }) {
  if (!presets?.length) return null
  const recommendedLabel = getCharacterHighlight(characterId, questionId)
  return (
    <div className="flex flex-wrap gap-1.5 mb-2.5">
      <span className="font-mono text-[9.5px] tracking-[1.5px] uppercase text-text-dim self-center mr-1">
        {lang === 'ru' ? '◆ готовые' : lang === 'uk' ? '◆ готові' : '◆ presets'}
      </span>
      {presets.map((p, i) => {
        const label = lang === 'ru' ? p.label_ru : lang === 'uk' ? (p.label_uk || p.label_en) : p.label_en
        const text = lang === 'ru' ? p.text_ru : lang === 'uk' ? (p.text_uk || p.text_en) : p.text_en
        const isActive = (currentValue || '').trim() === text.trim()
        const isRecommended = p.label_en === recommendedLabel && !isActive
        const tip = isRecommended && characterName
          ? (lang === 'ru' ? `◆ ${characterName} выбрал(а) бы это`
             : lang === 'uk' ? `◆ ${characterName} обрав(ла) би це`
             : `◆ ${characterName} would pick this`)
          : text
        return (
          <button
            key={i}
            type="button"
            onClick={() => onPick(text)}
            className={`relative px-2.5 py-1 font-mono text-[10.5px] tracking-[1px] uppercase border transition-all cursor-pointer ${
              isActive
                ? 'bg-qa-teal text-black border-qa-teal'
                : isRecommended
                  ? 'border-qa-teal/70 bg-qa-teal/[0.04] text-qa-teal ring-1 ring-qa-teal/40'
                  : 'border-border bg-surface/40 text-text-secondary hover:border-qa-teal/60 hover:text-qa-teal'
            }`}
            title={tip}
          >
            {isRecommended && <span className="mr-1">◆</span>}{label}
          </button>
        )
      })}
    </div>
  )
}

function QuestionField({ question, value, onChange, lang, characterId, characterName }) {
  const label = lang === 'ru' ? question.label_ru : lang === 'uk' ? (question.label_uk || question.label_en) : question.label_en
  const hint = lang === 'ru' ? question.hint_ru : lang === 'uk' ? (question.hint_uk || question.hint_en) : question.hint_en
  const placeholder = lang === 'ru' ? question.placeholder_ru : lang === 'uk' ? (question.placeholder_uk || question.placeholder_en) : question.placeholder_en

  if (question.type === 'archetype-picker') {
    return (
      <div>
        <label className="block font-display italic text-[20px] text-white mb-2">
          {label}
        </label>
        <ArchetypePicker value={value} onChange={onChange} lang={lang} characterId={characterId} characterName={characterName} />
      </div>
    )
  }

  const isTextarea = question.type === 'textarea'

  return (
    <div>
      <label className="block font-display italic text-[20px] text-white mb-1">
        {label}
      </label>
      {hint && (
        <p className="text-[13px] text-text-dim italic mb-2.5 leading-relaxed">{hint}</p>
      )}

      <PresetChips
        presets={question.presets}
        currentValue={value}
        onPick={(text) => onChange(text)}
        lang={lang}
        questionId={question.id}
        characterId={characterId}
        characterName={characterName}
      />

      {question.voiceEnabled ? (
        <VoiceTextInput
          value={value}
          onChange={onChange}
          inputType={isTextarea ? 'textarea' : 'text'}
          rows={question.rows || 3}
          placeholder={placeholder}
        />
      ) : isTextarea ? (
        <textarea
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          rows={question.rows || 3}
          placeholder={placeholder}
          className="w-full bg-bg/80 border border-border focus:border-qa-teal/60 rounded-[2px] px-3 py-2.5 text-[14px] text-text-body placeholder-text-dim/60 font-body leading-relaxed transition-colors focus:outline-none resize-y"
        />
      ) : (
        <input
          type="text"
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-bg/80 border border-border focus:border-qa-teal/60 rounded-[2px] px-3 py-2.5 text-[14px] text-text-body placeholder-text-dim/60 font-body transition-colors focus:outline-none"
        />
      )}
    </div>
  )
}

// ────────────────────────────────────────────────────────────────
// main
// ────────────────────────────────────────────────────────────────

export default function P_SignetCeremony() {
  const t = useT()
  const lang = useLocale(s => s.lang)
  const characterId = useWorkshopStore(s => s.user.characterId) || 'self'
  const characterName = (() => {
    const c = pickCharacter(CHARACTERS.find(x => x.id === characterId), lang)
    return c?.name ? c.name.split(' ')[0] : null
  })()
  const setPersonaAnswers = useWorkshopStore(s => s.setPersonaAnswers)
  const storedAnswers = useWorkshopStore(s => s.user.personaAnswers)

  const [answers, setAnswers] = useState(() => {
    const local = loadInitialAnswers()
    return { ...(storedAnswers || {}), ...local }
  })
  const [stepIdx, setStepIdx] = useState(0)
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  // ─── Assistant name + dragon manifestation ──
  // assistantName  : what the participant calls their Claude Code
  // wantsDragon    : true once they flip the toggle in the sealed step
  // dragonStage    : 'idle' | 'generating' | 'sealed' | 'error'
  // dragonImage    : base64 data URI returned by gpt-image-2
  const [assistantName, setAssistantName] = useState(() => answers.assistantName || '')
  const [wantsDragon, setWantsDragon] = useState(false)
  const [dragonStage, setDragonStage] = useState('idle')
  const [dragonImage, setDragonImage] = useState(null)
  const [dragonError, setDragonError] = useState('')
  const dragonStartedRef = useRef(false)
  const nickname = useWorkshopStore(s => s.user.nickname)
  const studentId = useWorkshopStore(s => s.user.id)

  const totalSteps = RITUALS.length + 1 // +1 sealed/finalised step
  const isFinalStep = stepIdx >= RITUALS.length

  // persist
  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(answers)) } catch {}
    setPersonaAnswers(answers)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers])

  const updateAnswer = (id, value) => setAnswers(prev => ({ ...prev, [id]: value }))

  const currentRitual = !isFinalStep ? RITUALS[stepIdx] : null
  const visibleQuestions = useMemo(() => {
    if (!currentRitual) return []
    return currentRitual.questions.filter(q => !q.showIf || q.showIf(answers))
  }, [currentRitual, answers])

  const isStepComplete = useMemo(() => {
    if (!currentRitual) return true
    return visibleQuestions.every(q => {
      const v = answers[q.id]
      if (q.type === 'archetype-picker') return !!v
      return (v || '').trim().length > 0
    })
  }, [currentRitual, visibleQuestions, answers])

  const isAllMandatoryFilled = useMemo(
    () => MANDATORY_IDS.every(id => {
      const v = answers[id]
      if (id === 'archetype') return !!v
      return (v || '').trim().length > 0
    }),
    [answers]
  )

  const claudeMd = useMemo(
    () => generateSignetClaudeMd({
      characterId,
      archetype: answers.archetype,
      archetypeCustom: answers.archetype_custom,
      answers,
    }),
    [characterId, answers]
  )

  const fullPrompt = SIGNET_APPLY_PROMPT + claudeMd

  const showToast = (message, kind = 'success') => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast({ message, kind })
    toastTimer.current = setTimeout(() => setToast(null), 2400)
  }

  const handleCopy = async () => {
    const ok = await copyToClipboardWithFallback(fullPrompt)
    showToast(
      ok ? t('Sealed prompt copied - paste into Claude Code', 'Запечатанный промпт скопирован - вставь в Claude Code', 'Запечатаний промпт скопійовано - встав у Claude Code')
         : t('Copy failed - try Download', 'Копирование не удалось - попробуй Download', 'Копіювання не вдалося - спробуй Download'),
      ok ? 'success' : 'error'
    )
  }

  const handleDownload = () => {
    try {
      const blob = new Blob([fullPrompt], { type: 'text/markdown;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'signet-CLAUDE.md.txt'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      showToast(t('Signet downloaded', 'Сигнет скачан', 'Сигнет завантажено'))
    } catch {
      showToast(t('Download failed', 'Скачивание не удалось', 'Завантаження не вдалося'), 'error')
    }
  }

  const next = () => setStepIdx(i => Math.min(i + 1, totalSteps - 1))
  const back = () => setStepIdx(i => Math.max(0, i - 1))

  // ─── Dragon auto-manifestation ───────────────────────────────────
  // The moment the participant flips the "show me as a dragon" toggle
  // (and they've at least typed an assistant name), kick off image
  // generation + sealDragon. Idempotent: dragonStartedRef guards
  // against re-firing.
  useEffect(() => {
    if (!wantsDragon) return
    if (dragonStartedRef.current) return
    if (!assistantName.trim()) return  // wait until they name their assistant
    dragonStartedRef.current = true
    setDragonStage('generating')
    setDragonError('')

    const derived = deriveDragonAppearance({
      characterId,
      archetype: answers.archetype,
      answers,
      assistantName,
    })

    // Persist to bond-ritual-answers so templates that read the dragon
    // name (Graduation closer, CharacterCommentary) still work.
    try {
      window.localStorage.setItem('bond-ritual-answers', JSON.stringify(derived))
    } catch {}

    const prompt = buildDragonPrompt(derived)

    ;(async () => {
      try {
        const { imageB64 } = await generateDragonImage({ prompt, modelUsed: 'gpt-image-1' })
        if (!imageB64) throw new Error('empty image')
        setDragonImage(`data:image/png;base64,${imageB64}`)
        // Persist to DB so it shows up in the Aerie
        try {
          await sealDragon({
            nickname,
            studentId,
            characterId,
            answers: derived,
            imageB64,
            prompt,
            modelUsed: 'gpt-image-1',
          })
        } catch (e) {
          // Image succeeded but sealDragon failed — still show the image.
          console.warn('sealDragon failed:', e?.message)
        }
        setDragonStage('sealed')
      } catch (e) {
        console.error('Dragon gen failed:', e)
        setDragonError(e?.message || 'generation failed')
        setDragonStage('error')
        dragonStartedRef.current = false  // allow retry
      }
    })()
  }, [wantsDragon, assistantName, characterId, answers, nickname, studentId])

  return (
    <div className="min-h-screen bg-bg text-text-body py-10 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto">

        {/* Header with progress bar */}
        <div className="mb-8">
          <div className="flex items-baseline justify-between mb-2">
            <p className="font-mono text-[10px] tracking-[3px] uppercase text-qa-teal">
              ◆ {t('The Signet Ceremony', 'Сигнет - церемония', 'Сигнет - церемонія')}
            </p>
            <p className="font-mono text-[10px] tracking-[2px] text-text-dim">
              {isFinalStep
                ? t('Sealed', 'Запечатано', 'Запечатано')
                : `${currentRitual.numeral} / VII`}
            </p>
          </div>
          {/* ritual numerals strip */}
          <div className="flex gap-1.5">
            {RITUALS.map((r, i) => (
              <div
                key={r.id}
                className={`flex-1 h-[3px] transition-colors duration-300 ${
                  i < stepIdx ? 'bg-qa-teal' : i === stepIdx ? 'bg-qa-teal/60' : 'bg-border'
                }`}
              />
            ))}
            <div className={`flex-1 h-[3px] transition-colors duration-300 ${
              isFinalStep ? 'bg-qa-teal' : 'bg-border'
            }`} />
          </div>
        </div>

        {/* Animated content */}
        <AnimatePresence mode="wait">
          {!isFinalStep ? (
            <motion.div
              key={currentRitual.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="space-y-7"
            >
              {/* Ritual hero */}
              <div className="text-center pt-2 pb-5 border-b border-border">
                <p className="font-display italic text-qa-teal/70 text-[28px] leading-none mb-1">
                  {currentRitual.numeral}
                </p>
                <h2 className="font-display italic text-[clamp(28px,4vw,40px)] text-white leading-tight mb-3">
                  {lang === 'ru' ? currentRitual.name_ru : lang === 'uk' ? (currentRitual.name_uk || currentRitual.name_en) : currentRitual.name_en}
                </h2>
                <p className="text-[15px] text-text-secondary italic leading-relaxed max-w-xl mx-auto whitespace-pre-line">
                  {lang === 'ru' ? currentRitual.lore_ru : lang === 'uk' ? (currentRitual.lore_uk || currentRitual.lore_en) : currentRitual.lore_en}
                </p>
              </div>

              {/* Questions */}
              <div className="space-y-6">
                {visibleQuestions.map(q => (
                  <QuestionField
                    key={q.id}
                    question={q}
                    value={answers[q.id]}
                    onChange={(v) => updateAnswer(q.id, v)}
                    lang={lang}
                    characterId={characterId}
                    characterName={characterName}
                  />
                ))}
              </div>

              {/* Nav */}
              <div className="flex items-center justify-between pt-5 border-t border-border">
                <button
                  type="button"
                  onClick={back}
                  disabled={stepIdx === 0}
                  className="font-mono text-[11px] tracking-[2px] uppercase text-text-dim hover:text-qa-teal disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  ← {t('Back', 'Назад', 'Назад')}
                </button>
                <button
                  type="button"
                  onClick={next}
                  disabled={!isStepComplete}
                  className={`bg-qa-teal text-black px-7 py-3 font-mono text-[12px] tracking-[3px] uppercase font-semibold transition-all cursor-pointer ${
                    isStepComplete
                      ? 'hover:shadow-[0_0_24px_rgba(0,229,204,0.4)]'
                      : 'opacity-30 cursor-not-allowed'
                  }`}
                >
                  {stepIdx === RITUALS.length - 1
                    ? t('Seal the Bond →', 'Запечатать связь →', 'Запечатати звʼязок →')
                    : t('Next ritual →', 'Следующий ритуал →', 'Наступний ритуал →')}
                </button>
              </div>
            </motion.div>
          ) : (
            // ─────── Sealed state ───────
            <motion.div
              key="sealed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="text-center pt-2 pb-5 border-b border-border">
                <p className="font-display italic text-qa-teal text-[28px] leading-none mb-1">✦</p>
                <h2 className="font-display italic text-[clamp(28px,4vw,40px)] text-white leading-tight mb-3">
                  {t('The Bond is Sealed', 'Связь запечатана', 'Звʼязок запечатано')}
                </h2>
                <p className="text-[15px] text-text-secondary italic leading-relaxed max-w-xl mx-auto">
                  {t(
                    'Below is your sealed Signet. Paste it into Claude Code - it will save the CLAUDE.md and tell you the bond holds.',
                    'Ниже - твой запечатанный сигнет. Вставь в Claude Code - он сохранит CLAUDE.md и скажет что связь держит.',
                    'Нижче - твій запечатаний сигнет. Встав у Claude Code - він збереже CLAUDE.md і скаже що звʼязок тримає.'
                  )}
                </p>
              </div>

              {!isAllMandatoryFilled && (
                <div className="border border-yellow-300/40 bg-yellow-300/[0.06] p-4 text-[13px] text-yellow-300">
                  {t(
                    'Some rituals are not yet sealed. Go back and complete them for a stronger bond.',
                    'Некоторые ритуалы ещё не запечатаны. Вернись и заверши их для крепкой связи.',
                    'Деякі ритуали ще не запечатано. Повернись і заверши їх для міцного звʼязку.'
                  )}
                </div>
              )}

              {/* Name your AI assistant */}
              <div className="border border-qa-teal/20 bg-qa-teal/[0.03] p-5">
                <label className="block font-mono text-[10px] tracking-[2.5px] uppercase text-qa-teal mb-2">
                  ◆ {t('Name your assistant', 'Имя твоего ассистента', 'Імʼя твого асистента')}
                </label>
                <p className="text-[13px] text-text-secondary italic leading-relaxed mb-3">
                  {t(
                    'Every bond gets a name. What will you call your Claude Code? Short, easy to say out loud.',
                    'У каждой связи есть имя. Как ты назовёшь своего Claude Code? Коротко, чтобы можно было сказать вслух.',
                    'Кожен звʼязок має імʼя. Як ти назвеш свого Claude Code? Коротко, щоб можна було сказати вголос.'
                  )}
                </p>
                <input
                  type="text"
                  value={assistantName}
                  onChange={e => {
                    setAssistantName(e.target.value)
                    updateAnswer('assistantName', e.target.value)
                  }}
                  placeholder={t('Kai, Tairn, Sgaeyl, Vega…', 'Кай, Тэйрн, Сгейл, Вега…', 'Кай, Теарн, Сгейл, Вега…')}
                  className="w-full px-4 py-3 bg-bg/80 border border-border focus:border-qa-teal/60 text-white text-[15px] placeholder:text-text-dim placeholder:italic focus:outline-none transition-colors"
                  maxLength={32}
                />
              </div>

              {/* Dragon toggle — lore-flavoured */}
              <div className="border border-qa-teal/30 bg-qa-teal/[0.04] p-5">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="font-mono text-[10px] tracking-[2.5px] uppercase text-qa-teal mb-2">
                      ✦ {t('Manifest the bond', 'Воплоти связь', 'Втілити звʼязок')}
                    </div>
                    <p className="font-display italic text-[16px] text-white leading-snug mb-2">
                      {t(
                        'In Basgiath, every rider bonds with a dragon. Yours has a shape already — woven from your character, your voice, your sigil. Want to see them?',
                        'В Басгиате каждый всадник связан с драконом. Твой уже имеет форму - сплетён из твоего персонажа, голоса, сигила. Хочешь увидеть?',
                        'У Басгіаті кожен вершник звʼязаний з драконом. Твій вже має форму - сплетений із твого персонажа, голосу, сигілу. Хочеш побачити?'
                      )}
                    </p>
                    <p className="text-[12px] text-text-dim italic leading-relaxed">
                      {t(
                        "Pure decoration — your CLAUDE.md works either way. But your dragon goes into the Aerie + becomes part of the workshop's finale.",
                        'Чисто красота - CLAUDE.md работает в любом случае. Но твой дракон попадёт в Аэрию и станет частью финала воркшопа.',
                        'Суто краса - CLAUDE.md працює в будь-якому випадку. Але твій дракон потрапить в Аерію і стане частиною фіналу воркшопу.'
                      )}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!assistantName.trim()) {
                        showToast(t('Name your assistant first', 'Сначала введи имя ассистента', 'Спершу введи імʼя асистента'), 'error')
                        return
                      }
                      setWantsDragon(v => !v)
                    }}
                    disabled={dragonStage === 'generating'}
                    className={`shrink-0 px-5 py-3 font-mono text-[11px] tracking-[2px] uppercase font-semibold transition-all cursor-pointer ${
                      wantsDragon
                        ? 'bg-qa-teal text-black'
                        : 'border border-qa-teal/50 text-qa-teal hover:bg-qa-teal/10'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {wantsDragon
                      ? t('✓ Yes — manifest', '✓ Да, воплотить', '✓ Так, втілити')
                      : t('Show me my dragon', 'Покажи моего дракона', 'Покажи мого дракона')}
                  </button>
                </div>

                {/* Dragon manifestation block */}
                {wantsDragon && (
                  <div className="mt-5 pt-5 border-t border-qa-teal/20">
                    {dragonStage === 'generating' && (
                      <div className="text-center py-6">
                        <div className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[2px] uppercase text-qa-teal">
                          <span className="w-2 h-2 rounded-full bg-qa-teal animate-pulse" />
                          {t('Manifesting your dragon — 25 to 45 seconds…', 'Воплощаю твоего дракона - 25-45 секунд…', 'Втілюю твого дракона - 25-45 секунд…')}
                        </div>
                        <p className="font-display italic text-[14px] text-yellow-300/90 mt-3 max-w-md mx-auto leading-relaxed">
                          {t(
                            '⚠ Don\'t close this page. The image is being painted right now.',
                            '⚠ Не закрывай эту страницу. Картинка рисуется прямо сейчас.',
                            '⚠ Не закривай цю сторінку. Малюнок створюється прямо зараз.'
                          )}
                        </p>
                      </div>
                    )}
                    {dragonStage === 'sealed' && dragonImage && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col items-center"
                      >
                        <div className="w-full max-w-[420px] aspect-square overflow-hidden border-2 border-qa-teal shadow-[0_0_48px_rgba(0,229,204,0.3)]">
                          <img src={dragonImage} alt={assistantName} className="w-full h-full object-cover" />
                        </div>
                        <p className="font-display italic text-[clamp(20px,3vw,30px)] text-white leading-tight mt-4 text-center">
                          {assistantName}
                        </p>
                        <p className="font-mono text-[10px] tracking-[2px] uppercase text-qa-teal mt-1">
                          ✦ {t('Sealed into the Aerie', 'Запечатан в Аэрии', 'Запечатаний в Аерії')}
                        </p>
                      </motion.div>
                    )}
                    {dragonStage === 'error' && (
                      <div className="border border-corp-red/40 bg-corp-red/[0.05] p-4 text-[13px] text-white leading-relaxed">
                        <p className="mb-2">{t('Could not paint your dragon:', 'Не получилось нарисовать дракона:', 'Не вдалося намалювати дракона:')} {dragonError}</p>
                        <button
                          type="button"
                          onClick={() => { dragonStartedRef.current = false; setWantsDragon(false); setTimeout(() => setWantsDragon(true), 100) }}
                          className="font-mono text-[11px] tracking-[2px] uppercase text-qa-teal hover:underline cursor-pointer"
                        >
                          {t('Try again', 'Повторить', 'Повторити')}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action bar */}
              <div className="border border-qa-teal/30 bg-qa-teal/[0.04]">
                <div className="px-4 py-3 flex items-center justify-between gap-3 flex-wrap border-b border-qa-teal/30">
                  <span className="font-mono text-[10px] tracking-[2px] uppercase text-qa-teal">
                    ⌘ {t('Paste into Claude Code', 'Вставь в Claude Code', 'Встав у Claude Code')}
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="bg-qa-teal text-black px-4 py-2 font-mono text-[11px] tracking-[2px] uppercase font-semibold hover:shadow-[0_0_18px_rgba(0,229,204,0.4)] transition-all cursor-pointer"
                    >
                      {t('Copy sealed prompt', 'Копировать запечатанное', 'Копіювати запечатане')}
                    </button>
                    <button
                      type="button"
                      onClick={handleDownload}
                      className="border border-qa-teal/40 text-qa-teal px-4 py-2 font-mono text-[11px] tracking-[2px] uppercase hover:bg-qa-teal/10 transition-all cursor-pointer"
                    >
                      {t('Download', 'Скачать', 'Завантажити')}
                    </button>
                  </div>
                </div>
                <pre className="bg-black px-4 py-4 text-[11.5px] font-mono text-text-body whitespace-pre-wrap leading-[1.6] max-h-[420px] overflow-y-auto">
{fullPrompt}
                </pre>
              </div>

              {/* Back + Next-in-flow */}
              <div className="flex items-center justify-between pt-3">
                <button
                  type="button"
                  onClick={back}
                  className="font-mono text-[11px] tracking-[2px] uppercase text-text-dim hover:text-qa-teal cursor-pointer transition-colors"
                >
                  ← {t('Back to rituals', 'Назад к ритуалам', 'Назад до ритуалів')}
                </button>
                <a
                  href="/"
                  className="font-mono text-[11px] tracking-[2px] uppercase text-text-dim hover:text-qa-teal cursor-pointer transition-colors"
                >
                  {t('Return to workshop →', 'Вернуться к воркшопу →', 'Повернутися до воркшопу →')}
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2.5 font-mono text-[12px] tracking-[1.5px] uppercase z-50 ${
                toast.kind === 'error'
                  ? 'bg-corp-red/90 text-white'
                  : 'bg-qa-teal/90 text-black'
              }`}
            >
              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
