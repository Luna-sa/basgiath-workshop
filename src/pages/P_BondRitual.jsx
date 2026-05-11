import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useWorkshopStore } from '../store/workshopStore'
import { useT } from '../i18n/useT'
import { useLocale } from '../i18n/store'
import { BOND_QUESTIONS, BOND_QUESTION_IDS } from '../data/dragons/questions'
import { buildDragonPrompt } from '../data/dragons/prompt-builder'
import { generateDragonImage } from '../api/workshopBackend'
import VoiceTextInput from '../components/VoiceTextInput'

const STORAGE_KEY = 'bond-ritual-answers'

function loadInitialAnswers() {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) || {}) : {}
  } catch { return {} }
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
              {lang === 'ru' ? opt.ru : opt.en}
            </div>
          </button>
        )
      })}
    </div>
  )
}

function QuestionField({ question, value, onChange, lang }) {
  const label = lang === 'ru' ? question.label_ru : question.label_en
  const hint = lang === 'ru' ? question.hint_ru : question.hint_en
  const placeholder = lang === 'ru' ? question.placeholder_ru : question.placeholder_en

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

  const [answers, setAnswers] = useState(loadInitialAnswers)
  const [stepIdx, setStepIdx] = useState(0)
  const [stage, setStage] = useState('questions') // questions | generating | preview
  const [imageB64, setImageB64] = useState(null)
  const [usedPrompt, setUsedPrompt] = useState(null)
  const [modelUsed, setModelUsed] = useState(null)
  const [genError, setGenError] = useState(null)
  const [generations, setGenerations] = useState(0)

  const totalSteps = BOND_QUESTIONS.length

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(answers)) } catch {}
  }, [answers])

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
    setStage('generating')
    setGenError(null)
    try {
      const prompt = buildDragonPrompt(answers)
      const res = await generateDragonImage({ prompt })
      setImageB64(res.image_b64)
      setUsedPrompt(prompt)
      setModelUsed(res.model)
      setGenerations(n => n + 1)
      setStage('preview')
    } catch (e) {
      setGenError(e.message || 'generation failed')
      setStage('questions')
    }
  }

  const handleRegenerate = () => {
    setStage('questions') // reuse same answers
    // Trigger again on next tick to avoid double-state mess
    setTimeout(handleGenerate, 0)
  }

  const handleSeal = () => {
    // Sprint 2.1 will upload to Supabase Storage + insert into dragons table.
    // For now: persist locally and announce.
    const draft = {
      nickname: nickname || 'anon',
      answers,
      prompt: usedPrompt,
      image_b64: imageB64,
      sealed_at: new Date().toISOString(),
    }
    try { window.localStorage.setItem('bond-ritual-sealed', JSON.stringify(draft)) } catch {}
    window.alert(t(
      'Sealed locally. Aerie / voting comes in the next sprint.',
      'Запечатано локально. Aerie и голосование — в следующем спринте.',
      'Запечатано локально. Aerie і голосування — у наступному спринті.'
    ))
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

              <div className="flex items-center justify-between gap-3 flex-wrap pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={handleRegenerate}
                  className="border border-qa-teal/40 text-qa-teal px-5 py-2.5 font-mono text-[11px] tracking-[2px] uppercase font-semibold hover:bg-qa-teal/10 transition-all cursor-pointer"
                >
                  ⟲ {t('Regenerate', 'Перегенерить', 'Перегенерувати')}
                </button>
                <p className="font-mono text-[10px] text-text-dim">
                  {generations} {t('attempt(s)', 'попыток', 'спроб')}
                </p>
                <button
                  type="button"
                  onClick={handleSeal}
                  className="bg-qa-teal text-black px-7 py-3 font-mono text-[12px] tracking-[3px] uppercase font-semibold hover:shadow-[0_0_24px_rgba(0,229,204,0.4)] transition-all cursor-pointer animate-pulse-teal"
                >
                  ✦ {t('Seal & Share', 'Запечатать и поделиться', 'Запечатати і поділитись')}
                </button>
              </div>
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
