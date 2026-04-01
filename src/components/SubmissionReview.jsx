import { useState } from 'react'
import { usePersona } from '../store/usePersona'
import { useWorkshopStore } from '../store/workshopStore'
import { evaluateSubmission } from '../api/groq'

/**
 * Text submission + AI review component.
 * type: 'bug-report' | 'test-cases'
 * pageIndex: for XP tracking
 * onComplete: called when review is done
 */
export default function SubmissionReview({ type, pageIndex, onComplete }) {
  const persona = usePersona()
  const addXP = useWorkshopStore(s => s.addXP)
  const submitTask = useWorkshopStore(s => s.submitTask)

  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const label = type === 'bug-report' ? 'баг-репорт' : 'тест-кейсы'

  const handleSubmit = async () => {
    if (!text.trim() || loading) return
    setLoading(true)

    const evaluation = await evaluateSubmission(type, text)

    if (evaluation) {
      setResult(evaluation)
      // Award XP based on score
      const xp = evaluation.xpBonus || 10
      addXP(xp)
      submitTask(pageIndex, { type: 'ai-review', score: evaluation.score, maxScore: evaluation.maxScore })
    } else {
      // Fallback — no API or error — still give base XP
      setResult({ score: null, maxScore: 10, feedback: null, xpBonus: 15 })
      addXP(15)
      submitTask(pageIndex, { type: 'self-report' })
    }

    setSubmitted(true)
    setLoading(false)
    if (onComplete) onComplete()
  }

  // Already reviewed
  if (submitted && result) {
    return (
      <div className="space-y-4">
        {/* Score */}
        {result.score !== null && (
          <div className="text-center p-5 border" style={{ borderColor: persona.accentBorder, backgroundColor: persona.accentLight }}>
            <div className="font-display text-3xl font-bold text-white mb-1">
              {result.score}<span className="text-text-dim text-lg">/{result.maxScore}</span>
            </div>
            <div className="font-mono text-[12px] tracking-[2px] uppercase" style={{ color: persona.accent }}>
              +{result.xpBonus} XP
            </div>
          </div>
        )}

        {/* AI Feedback */}
        {result.feedback && (
          <div className="p-4 border border-border bg-surface/30">
            <div className="font-mono text-[11px] tracking-[2px] uppercase mb-3" style={{ color: persona.accent }}>
              AI-ревью
            </div>
            <div className="text-[13px] text-text-body leading-relaxed whitespace-pre-wrap">
              {result.feedback}
            </div>
          </div>
        )}

        {/* No API fallback */}
        {!result.feedback && (
          <div className="text-center p-4 border border-forest/30 bg-forest/[0.05]">
            <p className="text-sm text-forest">Результат сохранён. +{result.xpBonus} XP</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Instruction */}
      <div className="p-3 border border-border bg-surface/30">
        <p className="text-[13px] text-text-secondary">
          Вставь сюда результат — {label}, который сгенерировал твой AI-агент.
          Groq AI оценит качество и даст рекомендации.
        </p>
      </div>

      {/* Text area */}
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={`Вставь сюда ${label}...`}
        rows={8}
        className="w-full px-4 py-3 bg-bg border border-border text-text-body text-[13px] font-mono leading-relaxed resize-y focus:border-qa-teal focus:outline-none transition-colors"
        style={{ minHeight: '120px' }}
      />

      {/* Submit button */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSubmit}
          disabled={!text.trim() || loading}
          className="px-6 py-3 text-black font-body text-[14px] font-semibold tracking-[0.5px] rounded-[2px] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ backgroundColor: text.trim() && !loading ? persona.accent : '#333' }}
        >
          {loading ? 'AI оценивает...' : 'Отправить на ревью'}
        </button>

        {/* Skip option */}
        <button
          onClick={() => {
            addXP(10)
            submitTask(pageIndex, { type: 'skipped' })
            setSubmitted(true)
            setResult({ score: null, maxScore: 10, feedback: null, xpBonus: 10 })
            if (onComplete) onComplete()
          }}
          className="px-4 py-3 text-text-dim text-[13px] hover:text-text-secondary transition-colors cursor-pointer"
        >
          Пропустить ревью
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center gap-2 p-3 border border-border bg-surface/30">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: persona.accent }} />
          <span className="font-mono text-[12px] text-text-dim">Groq AI анализирует результат...</span>
        </div>
      )}
    </div>
  )
}
