import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useWorkshopStore } from '../store/workshopStore'
import { useT } from '../i18n/useT'
import { useLocale } from '../i18n/store'
import { BOND_QUESTIONS, BOND_QUESTION_IDS } from '../data/dragons/questions'
import { buildDragonPrompt } from '../data/dragons/prompt-builder'
import { generateDragonImage } from '../api/workshopBackend'
import { sealDragon } from '../api/dragons'
import { assignRiderClass } from '../api/workshopBackend'
import VoiceTextInput from '../components/VoiceTextInput'
import { renderSigilCard, downloadBlob } from '../utils/sigilCard'

const STORAGE_KEY = 'bond-ritual-answers'
const SESSION_KEY = 'bond-ritual-session'
// Minimum seconds between consecutive generate calls — prevents
// thirty-clicks-on-Re-roll from burning the OpenAI rate-limit.
const REROLL_COOLDOWN_MS = 8000
// Hard ceiling on a single generate request. If OpenAI hangs past
// this, surface the error instead of leaving the user stranded.
const GENERATE_TIMEOUT_MS = 180000 // 3 minutes

function loadInitialAnswers() {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) || {}) : {}
  } catch { return {} }
}

// Persist stage / imageB64 / riderClass so a refresh in the middle
// of the preview doesn't kick the user back to question 1 and lose
// the image they just waited 30+ seconds for.
function loadSession() {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) || {}) : {}
  } catch { return {} }
}
function saveSession(patch) {
  if (typeof window === 'undefined') return
  try {
    const prev = loadSession()
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify({ ...prev, ...patch }))
  } catch {}
}
function clearSession() {
  try { window.sessionStorage.removeItem(SESSION_KEY) } catch {}
}

// Promise.race wrapper for a hard timeout on fetch-style calls.
function withTimeout(promise, ms, label = 'request') {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(
      () => reject(new Error(`${label} timed out after ${Math.round(ms / 1000)}s — try Re-roll`)),
      ms
    )),
  ])
}

// ─── Cards picker (used for breath / size / wings / eyes) ─────────
function CardsPicker({ question, value, onChange, lang }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {question.options.map(opt => {
        const isActive = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`text-left p-4 border transition-all cursor-pointer ${
              isActive
                ? 'border-qa-teal bg-qa-teal/[0.10] shadow-[0_0_20px_rgba(0,229,204,0.15)]'
                : 'border-border bg-surface/40 hover:border-qa-teal/40'
            }`}
          >
            <div className="text-[26px] mb-1.5" style={opt.color ? { color: opt.color } : {}}>{opt.glyph}</div>
            <div className={`font-display italic text-[16px] leading-tight ${isActive ? 'text-white' : 'text-text-body'}`}>
              {lang === 'ru' ? opt.ru : lang === 'uk' ? (opt.uk || opt.en) : opt.en}
            </div>
          </button>
        )
      })}
    </div>
  )
}

function QuestionField({ question, value, onChange, lang }) {
  const label = lang === 'ru' ? question.label_ru : lang === 'uk' ? (question.label_uk || question.label_en) : question.label_en
  const hint = lang === 'ru' ? question.hint_ru : lang === 'uk' ? (question.hint_uk || question.hint_en) : question.hint_en
  const placeholder = lang === 'ru' ? question.placeholder_ru : lang === 'uk' ? (question.placeholder_uk || question.placeholder_en) : question.placeholder_en

  return (
    <div>
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-qa-teal text-[18px] leading-none">{question.icon || '◆'}</span>
        <label className="block font-display italic text-[22px] text-white">{label}</label>
      </div>
      {hint && (
        <p className="text-[13px] text-text-dim italic mb-3 leading-relaxed">{hint}</p>
      )}

      {question.type === 'cards' ? (
        <CardsPicker question={question} value={value} onChange={onChange} lang={lang} />
      ) : question.voiceEnabled ? (
        <VoiceTextInput
          value={value}
          onChange={onChange}
          inputType={question.type === 'textarea' ? 'textarea' : 'text'}
          rows={question.rows || 2}
          placeholder={placeholder}
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

// ─── Main ──────────────────────────────────────────────────────────
export default function P_BondRitual() {
  const t = useT()
  const lang = useLocale(s => s.lang)
  const nickname = useWorkshopStore(s => s.user.nickname)
  const studentId = useWorkshopStore(s => s.user.id)
  const characterId = useWorkshopStore(s => s.user.characterId)

  // Hydrate session-state from sessionStorage so a refresh in
  // mid-flow doesn't kick the user back to step 1 / lose their image.
  const _session = useMemo(() => loadSession(), [])

  const [answers, setAnswers] = useState(loadInitialAnswers)
  const [stepIdx, setStepIdx] = useState(_session.stepIdx ?? 0)
  const [stage, setStage] = useState(_session.stage || 'questions') // questions | generating | preview | sealing | sealed
  const [imageB64, setImageB64] = useState(_session.imageB64 || null)
  const [usedPrompt, setUsedPrompt] = useState(_session.usedPrompt || null)
  const [modelUsed, setModelUsed] = useState(_session.modelUsed || null)
  const [genError, setGenError] = useState(null)
  const [sealError, setSealError] = useState(null)
  const [generations, setGenerations] = useState(_session.generations ?? 0)
  const [riderClass, setRiderClass] = useState(_session.riderClass || null)
  const [classLoading, setClassLoading] = useState(false)
  const [editedPrompt, setEditedPrompt] = useState(_session.editedPrompt ?? null)
  const [showPromptEditor, setShowPromptEditor] = useState(false)
  const lastGenerateAtRef = useRef(_session.lastGenerateAt || 0)

  // If we hydrated mid-generate (refresh while waiting), kick the
  // user back to questions — the in-flight request was lost.
  useEffect(() => {
    if (stage === 'generating') setStage('questions')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const totalSteps = BOND_QUESTIONS.length

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(answers)) } catch {}
  }, [answers])

  // Persist session-state on changes so refresh restores progress
  useEffect(() => {
    saveSession({
      stepIdx, stage, imageB64, usedPrompt, modelUsed,
      generations, riderClass, editedPrompt,
      lastGenerateAt: lastGenerateAtRef.current,
    })
  }, [stepIdx, stage, imageB64, usedPrompt, modelUsed, generations, riderClass, editedPrompt])

  const updateAnswer = (id, value) => setAnswers(prev => ({ ...prev, [id]: value }))

  const currentQuestion = stage === 'questions' ? BOND_QUESTIONS[stepIdx] : null
  const isQuestionFilled = useMemo(() => {
    if (!currentQuestion) return true
    const v = answers[currentQuestion.id]
    if (currentQuestion.type === 'cards') return !!v
    return (v || '').trim().length > 0
  }, [currentQuestion, answers])

  const allFilled = useMemo(
    () => BOND_QUESTION_IDS.every(id => {
      const v = answers[id]
      const q = BOND_QUESTIONS.find(x => x.id === id)
      if (q.type === 'cards') return !!v
      return (v || '').trim().length > 0
    }),
    [answers]
  )

  const next = () => setStepIdx(i => Math.min(i + 1, totalSteps - 1))
  const back = () => setStepIdx(i => Math.max(0, i - 1))

  const handleGenerate = async () => {
    if (!allFilled) return

    // Throttle: refuse re-rolls fired within REROLL_COOLDOWN_MS of the
    // last one. Protects the OpenAI rate limit + the user's wallet.
    const now = Date.now()
    const elapsed = now - lastGenerateAtRef.current
    if (lastGenerateAtRef.current > 0 && elapsed < REROLL_COOLDOWN_MS) {
      const wait = Math.ceil((REROLL_COOLDOWN_MS - elapsed) / 1000)
      setGenError(t(
        `Wait ${wait}s before re-rolling — the queue is still busy.`,
        `Подожди ${wait} сек перед регенерацией — очередь занята.`,
        `Зачекай ${wait} сек перед регенерацією — черга зайнята.`
      ))
      return
    }
    lastGenerateAtRef.current = now

    setStage('generating')
    setGenError(null)
    try {
      const prompt = (editedPrompt ?? buildDragonPrompt(answers))
      const res = await withTimeout(
        generateDragonImage({ prompt }),
        GENERATE_TIMEOUT_MS,
        t('dragon generation', 'генерация дракона', 'генерація дракона'),
      )
      setImageB64(res.image_b64)
      setUsedPrompt(prompt)
      setModelUsed(res.model)
      setGenerations(n => n + 1)
      setStage('preview')

      // Fire-and-forget Rider Class assignment (in parallel — UI shows
      // a loading skeleton in the meantime). Only run on first generation
      // so re-rolls don't keep churning the class.
      if (!riderClass) {
        setClassLoading(true)
        try {
          // Read Signet answers from localStorage so we don't tightly
          // couple — Signet Ceremony is on a separate route.
          let signet = {}
          try {
            const raw = window.localStorage.getItem('signet-ceremony-answers')
            if (raw) signet = JSON.parse(raw) || {}
          } catch {}
          const rc = await assignRiderClass({ signet, dragon: answers })
          setRiderClass(rc)
        } catch {
          // Class assignment is bonus content — silently skip on failure.
        } finally {
          setClassLoading(false)
        }
      }
    } catch (e) {
      // Friendlier message for the rate-limit case — the backend already
      // retried 3× under the hood, so this only fires when the OpenAI
      // queue is genuinely overwhelmed.
      const raw = e?.message || 'generation failed'
      const isRate = /rate limit|RATE_LIMITED|429/.test(raw)
      setGenError(isRate
        ? t(
            'A lot of riders pressed Manifest at once. Wait 30-60 seconds and Re-roll — the queue drains fast.',
            'Много всадников нажали Manifest одновременно. Подожди 30-60 секунд и попробуй ещё раз — очередь рассасывается быстро.',
            'Багато вершників натиснули Manifest одночасно. Зачекай 30-60 секунд і спробуй ще раз — черга швидко розсмокчеться.'
          )
        : raw)
      setStage('questions')
    }
  }

  const handleRegenerate = () => {
    setStage('questions') // reuse same answers
    // Trigger again on next tick to avoid double-state mess
    setTimeout(handleGenerate, 0)
  }

  const handleDownloadSigil = async () => {
    if (!imageB64) return
    try {
      const blob = await renderSigilCard({
        imageUrl: `data:image/png;base64,${imageB64}`,
        name: (answers.name || 'Unnamed').trim(),
        nickname: nickname || 'anon',
        motto: (answers.motto || '').trim(),
        riderClass: riderClass?.class_name || null,
        epithet: riderClass?.epithet || null,
        date: new Date(),
        url: 'basgiath-workshop.onrender.com',
      })
      const filename = `sigil-${(answers.name || 'dragon').toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`
      downloadBlob(blob, filename)
    } catch (e) {
      setSealError(e.message || 'Sigil render failed')
    }
  }

  const handleSeal = async () => {
    if (!nickname) {
      setSealError(t(
        'You need to sign into the workshop first (nickname required).',
        'Сначала войди в воркшоп (нужен ник).',
        'Спочатку увійди у воркшоп (потрібен нік).'
      ))
      return
    }
    setStage('sealing')
    setSealError(null)
    try {
      await sealDragon({
        nickname,
        characterId,
        answers,
        imageB64,
        prompt: usedPrompt,
        modelUsed,
        studentId,
      })
      // Don't auto-redirect — facilitator opens the Aerie collectively
      // on the next slide. Just confirm the seal and stay on the page.
      setStage('sealed')
      // Clear the persisted session so the next page-open is fresh.
      // The Sigil card download still works because imageB64 stays in
      // React state for the current page lifetime.
      clearSession()
    } catch (e) {
      setSealError(e.message || 'Sealing failed — check Supabase migration')
      setStage('preview')
    }
  }

  // ─── Render ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-bg text-text-body py-10 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-baseline justify-between mb-2">
            <p className="font-mono text-[10px] tracking-[3px] uppercase text-qa-teal">
              ◆ {t('The Bond Ritual', 'Ритуал Связывания', 'Ритуал Звʼязування')}
            </p>
            <p className="font-mono text-[10px] tracking-[2px] text-text-dim">
              {stage === 'questions' ? `${stepIdx + 1} / ${totalSteps}` :
                stage === 'generating' ? t('manifesting...', 'проявляется...', 'проявляється...') :
                t('manifested', 'проявлен', 'проявлений')}
            </p>
          </div>
          <div className="flex gap-1.5">
            {BOND_QUESTIONS.map((q, i) => (
              <div
                key={q.id}
                className={`flex-1 h-[3px] transition-colors duration-300 ${
                  stage !== 'questions' || i < stepIdx ? 'bg-qa-teal' : i === stepIdx ? 'bg-qa-teal/60' : 'bg-border'
                }`}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">

          {/* ── Questions stage ── */}
          {stage === 'questions' && currentQuestion && (
            <motion.div
              key={`q-${currentQuestion.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <QuestionField
                question={currentQuestion}
                value={answers[currentQuestion.id]}
                onChange={v => updateAnswer(currentQuestion.id, v)}
                lang={lang}
              />

              {genError && (
                <div className="border border-corp-red/40 bg-corp-red/[0.06] p-3 text-[12.5px] text-corp-red">
                  {genError}
                </div>
              )}

              <div className="flex items-center justify-between pt-5 border-t border-border">
                <button
                  type="button"
                  onClick={back}
                  disabled={stepIdx === 0}
                  className="font-mono text-[11px] tracking-[2px] uppercase text-text-dim hover:text-qa-teal disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  ← {t('Back', 'Назад', 'Назад')}
                </button>

                {stepIdx === totalSteps - 1 ? (
                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={!allFilled}
                    className={`bg-qa-teal text-black px-7 py-3 font-mono text-[12px] tracking-[3px] uppercase font-semibold transition-all cursor-pointer ${
                      allFilled ? 'hover:shadow-[0_0_24px_rgba(0,229,204,0.4)] animate-pulse-teal' : 'opacity-30 cursor-not-allowed'
                    }`}
                  >
                    {t('Manifest →', 'Проявить →', 'Проявити →')}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={next}
                    disabled={!isQuestionFilled}
                    className={`bg-qa-teal text-black px-7 py-3 font-mono text-[12px] tracking-[3px] uppercase font-semibold transition-all cursor-pointer ${
                      isQuestionFilled ? 'hover:shadow-[0_0_24px_rgba(0,229,204,0.4)]' : 'opacity-30 cursor-not-allowed'
                    }`}
                  >
                    {t('Next →', 'Дальше →', 'Далі →')}
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* ── Generating stage ── */}
          {stage === 'generating' && (
            <motion.div
              key="generating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="font-display italic text-[28px] text-qa-teal mb-3 animate-pulse">✦</div>
              <h2 className="font-display italic text-[clamp(28px,4vw,40px)] text-white leading-tight mb-3">
                {t('Your dragon is manifesting.', 'Твой дракон проявляется.', 'Твій дракон проявляється.')}
              </h2>
              <p className="text-[15px] text-text-secondary italic leading-relaxed max-w-md mx-auto">
                {t(
                  'This takes around thirty seconds. The bond is forming through the answers you gave.',
                  'Это занимает около тридцати секунд. Связь формируется через ответы которые ты дала.',
                  'Це займає близько тридцяти секунд. Звʼязок формується через відповіді які ти дала.'
                )}
              </p>
              <div className="mt-8 flex justify-center gap-2">
                {[0,1,2].map(i => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-full bg-qa-teal animate-pulse"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Sealed stage — confirmation, no auto-redirect ── */}
          {stage === 'sealed' && (
            <motion.div
              key="sealed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center py-12 space-y-6"
            >
              <div className="font-display italic text-[clamp(28px,4vw,40px)] text-qa-teal leading-none">
                ✦
              </div>
              <h2 className="font-display italic text-[clamp(32px,5vw,48px)] text-white leading-tight">
                {t('Your dragon is sealed.', 'Твой дракон запечатан.', 'Твій дракон запечатаний.')}
              </h2>
              <p className="text-[16px] text-text-secondary italic leading-relaxed max-w-lg mx-auto">
                {t(
                  'They\'re waiting in the Aerie. The facilitator will open it for voting when everyone is ready.',
                  'Он ждёт в Аэрии. Фасилитатор откроет её для голосования когда все будут готовы.',
                  'Він чекає в Аерії. Фасилітатор відкриє її для голосування, коли всі будуть готові.'
                )}
              </p>

              {/* Dragon mini-card */}
              {imageB64 && (
                <div className="max-w-md mx-auto border border-qa-teal/30 bg-bg/40 overflow-hidden">
                  <div className="aspect-square">
                    <img
                      src={`data:image/png;base64,${imageB64}`}
                      alt={answers.name || 'dragon'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3 text-center">
                    <div className="font-display italic text-[22px] text-white">{answers.name || '—'}</div>
                    {answers.motto && (
                      <p className="text-[12px] text-text-secondary italic mt-1">"{answers.motto}"</p>
                    )}
                  </div>
                </div>
              )}

              {/* Action row */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleDownloadSigil}
                  className="border border-qa-teal/40 text-qa-teal px-5 py-2.5 font-mono text-[11px] tracking-[2px] uppercase font-semibold hover:bg-qa-teal/10 transition-all cursor-pointer"
                >
                  ⬇ {t('Sigil card', 'Сигил-карточка', 'Сигіл-картка')}
                </button>
                <a
                  href="/?page=aerie"
                  target="_blank"
                  rel="noopener"
                  className="font-mono text-[11px] tracking-[2px] uppercase text-text-dim hover:text-qa-teal transition-colors"
                >
                  {t('Sneak peek the Aerie →', 'Заглянуть в Аэрию →', 'Зазирнути в Аерію →')}
                </a>
              </div>

              <p className="text-[12px] text-text-dim italic pt-2">
                {t(
                  'Stay on the workshop slide. The Aerie opens next.',
                  'Оставайся на слайде воркшопа. Аэрия откроется следующей.',
                  'Лишайся на слайді воркшопу. Аерія відкриється наступною.'
                )}
              </p>
            </motion.div>
          )}

          {/* ── Preview stage ── */}
          {stage === 'preview' && imageB64 && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-5"
            >
              <div className="border border-qa-teal/40 bg-black overflow-hidden">
                <img
                  src={`data:image/png;base64,${imageB64}`}
                  alt={`${answers.name || 'dragon'} portrait`}
                  className="w-full block"
                />
              </div>

              <div className="border border-border bg-surface/40 p-5">
                <div className="flex items-baseline gap-3 mb-2 flex-wrap">
                  <p className="font-mono text-[10px] tracking-[2px] uppercase text-qa-teal">◆ {t('Your bonded', 'Твой bonded', 'Твій bonded')}</p>
                  <span className="font-mono text-[10px] text-text-dim">{modelUsed}</span>
                </div>
                <h2 className="font-display italic text-[clamp(28px,4vw,38px)] text-white leading-tight mb-2">
                  {answers.name || '—'}
                </h2>
                <p className="text-[14px] text-text-secondary italic leading-relaxed mb-3">
                  {answers.motto && `"${answers.motto}"`}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-[12.5px] text-text-body font-mono">
                  <Stat label={t('Scale', 'Чешуя', 'Луска')} value={answers.scale} />
                  <Stat label={t('Breath', 'Дыхание', 'Подих')} value={answers.breath} />
                  <Stat label={t('Size', 'Размер', 'Розмір')} value={answers.size} />
                  <Stat label={t('Wings', 'Крылья', 'Крила')} value={answers.wings} />
                  <Stat label={t('Eyes', 'Глаза', 'Очі')} value={answers.eyes} />
                  <Stat label={t('Signet', 'Сигнет', 'Сигнет')} value={answers.signet} />
                </div>
              </div>

              {/* Manual prompt editor — for advanced users */}
              <div className="border border-border bg-surface/30 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowPromptEditor(v => !v)}
                  className="w-full px-4 py-2.5 text-left font-mono text-[10.5px] tracking-[2px] uppercase text-text-dim hover:text-qa-teal flex items-center justify-between transition-colors"
                >
                  <span>
                    ✎ {showPromptEditor
                      ? t('Hide prompt', 'Скрыть промпт', 'Сховати промпт')
                      : t('Show / edit prompt', 'Показать / править промпт', 'Показати / правити промпт')}
                  </span>
                  <span className="text-text-dim">{showPromptEditor ? '▲' : '▼'}</span>
                </button>
                {showPromptEditor && (
                  <div className="border-t border-border px-4 py-4 space-y-3">
                    <p className="text-[12px] text-text-dim italic leading-relaxed">
                      {t(
                        'Tune the prompt before re-rolling. Reset to auto returns to the answer-based prompt.',
                        'Подправь промпт перед перегенерацией. Reset to auto вернёт авто-промпт из ответов.',
                        'Підправ промпт перед перегенерацією. Reset to auto поверне авто-промпт з відповідей.'
                      )}
                    </p>
                    <textarea
                      value={editedPrompt ?? usedPrompt ?? buildDragonPrompt(answers)}
                      onChange={e => setEditedPrompt(e.target.value)}
                      rows={10}
                      className="w-full bg-black border border-border focus:border-qa-teal/60 rounded-[2px] px-3 py-2.5 text-[12px] text-text-body font-mono leading-relaxed transition-colors focus:outline-none resize-y"
                    />
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setEditedPrompt(null)}
                        className="font-mono text-[10px] tracking-[1.5px] uppercase text-text-dim hover:text-qa-teal cursor-pointer"
                      >
                        ⟲ {t('Reset to auto', 'Сбросить на авто', 'Скинути на авто')}
                      </button>
                      <button
                        type="button"
                        onClick={handleRegenerate}
                        className="ml-auto bg-qa-teal text-black px-5 py-2 font-mono text-[10.5px] tracking-[2px] uppercase font-semibold hover:shadow-[0_0_18px_rgba(0,229,204,0.4)] transition-all cursor-pointer"
                      >
                        ⟲ {t('Regenerate with this prompt', 'Перегенерь с этим промптом', 'Перегенеруй з цим промптом')}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Rider Class — The Choosing */}
              {(classLoading || riderClass) && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="border border-qa-teal/40 bg-gradient-to-br from-qa-teal/[0.06] to-transparent p-5"
                >
                  <p className="font-mono text-[10px] tracking-[3px] uppercase text-qa-teal mb-3">
                    ✦ {t('The Choosing — your rider class', 'Выбор — твой класс всадника', 'Вибір — твій клас вершника')}
                  </p>
                  {classLoading ? (
                    <p className="font-display italic text-[20px] text-text-dim animate-pulse">
                      {t('The dragon weighs you…', 'Дракон взвешивает тебя…', 'Дракон зважує тебе…')}
                    </p>
                  ) : (
                    <>
                      <h3 className="font-display italic text-[clamp(28px,4vw,36px)] text-white leading-tight mb-1.5">
                        {riderClass.class_name}
                      </h3>
                      {riderClass.epithet && (
                        <p className="text-[15px] text-qa-teal italic leading-relaxed mb-2">
                          "{riderClass.epithet}"
                        </p>
                      )}
                      <p className="text-[13px] text-text-secondary leading-relaxed">
                        {riderClass.reason || riderClass.class_meaning}
                      </p>
                    </>
                  )}
                </motion.div>
              )}

              {sealError && (
                <div className="border border-corp-red/40 bg-corp-red/[0.06] p-3 text-[13px] text-corp-red">
                  ⚠ {sealError}
                </div>
              )}

              <div className="flex items-center justify-between gap-3 flex-wrap pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={handleRegenerate}
                  className="border border-qa-teal/40 text-qa-teal px-5 py-2.5 font-mono text-[11px] tracking-[2px] uppercase font-semibold hover:bg-qa-teal/10 transition-all cursor-pointer"
                >
                  ⟲ {t('Regenerate', 'Перегенерить', 'Перегенерувати')}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadSigil}
                  disabled={!imageB64 || stage === 'sealing'}
                  className="border border-qa-teal/40 text-qa-teal px-5 py-2.5 font-mono text-[11px] tracking-[2px] uppercase font-semibold hover:bg-qa-teal/10 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ⬇ {t('Sigil card', 'Сигил-карточка', 'Сигіл-картка')}
                </button>
                <button
                  type="button"
                  onClick={handleSeal}
                  disabled={stage === 'sealing'}
                  className={`bg-qa-teal text-black px-7 py-3 font-mono text-[12px] tracking-[3px] uppercase font-semibold transition-all cursor-pointer ${
                    stage === 'sealing'
                      ? 'opacity-60 cursor-wait'
                      : 'hover:shadow-[0_0_24px_rgba(0,229,204,0.4)] animate-pulse-teal'
                  }`}
                >
                  {stage === 'sealing'
                    ? t('Sealing...', 'Запечатываю...', 'Запечатую...')
                    : `✦ ${t('Seal & Share', 'Запечатать и поделиться', 'Запечатати і поділитись')}`}
                </button>
              </div>
              <p className="font-mono text-[10px] text-text-dim text-center pt-1">
                {generations} {t('attempt(s)', 'попыток', 'спроб')}
              </p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  if (!value) return null
  return (
    <div>
      <div className="text-[9px] tracking-[1.5px] uppercase text-text-dim mb-0.5">{label}</div>
      <div className="text-[13px] text-text-body truncate">{value}</div>
    </div>
  )
}
