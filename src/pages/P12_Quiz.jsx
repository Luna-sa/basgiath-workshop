import { useState } from 'react'
import confetti from 'canvas-confetti'
import { useWorkshopStore } from '../store/workshopStore'
import { usePersona } from '../store/usePersona'
import { QUIZ_QUESTIONS, QUIZ_BONUS_XP } from '../data/quiz'
import PageShell from '../core/PageShell'

export default function P12_Quiz() {
  const quizAnswers = useWorkshopStore(s => s.quizAnswers)
  const quizScore = useWorkshopStore(s => s.quizScore)
  const persona = usePersona()
  const submitQuizAnswer = useWorkshopStore(s => s.submitQuizAnswer)
  const finalizeQuiz = useWorkshopStore(s => s.finalizeQuiz)
  const [showResults, setShowResults] = useState(quizScore !== null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const allAnswered = QUIZ_QUESTIONS.every(q => quizAnswers[q.id])

  const handleSubmit = () => {
    if (isSubmitting || quizScore !== null) return
    setIsSubmitting(true)
    const correct = QUIZ_QUESTIONS.filter(q => quizAnswers[q.id] === q.correct).length
    finalizeQuiz(correct)
    setShowResults(true)
    // Confetti for perfect score
    if (correct === 5) {
      setTimeout(() => {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 }, colors: [persona.accent, '#00E5CC', '#F59E0B'] })
      }, 300)
    }
  }

  return (
    <PageShell pageIndex={12}>
      {!showResults ? (
        <div className="space-y-5">
          {QUIZ_QUESTIONS.map((q, i) => (
            <div key={q.id} className="p-4 border border-border bg-surface/30">
              <div className="font-mono text-[12px] tracking-wider mb-2" style={{ color: persona.accent }}>Вопрос {i + 1}/{QUIZ_QUESTIONS.length}</div>
              <p className="text-sm text-white font-medium mb-3">{q.question}</p>
              <div className="space-y-2">
                {q.options.map(opt => (
                  <button key={opt.id} onClick={() => submitQuizAnswer(q.id, opt.id)}
                    className={`w-full text-left flex gap-3 p-3 border transition-all cursor-pointer ${quizAnswers[q.id] === opt.id ? 'bg-qa-teal/[0.05]' : 'border-border hover:border-qa-teal/25'}`}
                    style={quizAnswers[q.id] === opt.id ? { borderColor: persona.accent } : {}}>
                    <span className={`font-mono text-[11px] shrink-0 w-5 h-5 flex items-center justify-center border ${quizAnswers[q.id] === opt.id ? 'text-white' : 'border-border text-text-dim'}`}
                      style={quizAnswers[q.id] === opt.id ? { borderColor: persona.accent, color: persona.accent } : {}}>{opt.id.toUpperCase()}</span>
                    <span className="text-sm text-text-body">{opt.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
          {allAnswered && (
            <div className="text-center">
              <button onClick={handleSubmit} disabled={isSubmitting} className="px-10 py-4 text-black font-body text-[15px] font-semibold tracking-[1px] rounded-[2px] transition-all cursor-pointer disabled:opacity-50" style={{ backgroundColor: persona.accent }}>
                {isSubmitting ? 'Отправляется...' : 'Отправить →'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          <div className="text-center p-6 border" style={{ borderColor: persona.accentBorder, backgroundColor: persona.accentLight }}>
            <div className="font-display text-4xl text-white mb-2">{quizScore}/5</div>
            <div className="font-mono text-[12px] tracking-wider uppercase" style={{ color: persona.accent }}>+{quizScore * 10 + (quizScore === 5 ? QUIZ_BONUS_XP : 0)} XP</div>
            {quizScore === 5 && <div className="text-sm mt-2" style={{ color: persona.accent }}>{persona.voice.successBig}</div>}
          </div>
          {QUIZ_QUESTIONS.map(q => {
            const correct = quizAnswers[q.id] === q.correct
            return (
              <div key={q.id} className={`p-3 border ${correct ? 'border-forest/30 bg-forest/[0.03]' : 'border-corp-red/30 bg-corp-red/[0.03]'}`}>
                <p className="text-sm text-white mb-1">{q.question}</p>
                <p className={`text-xs ${correct ? 'text-forest' : 'text-corp-red'}`}>{correct ? '✓ Верно' : `✕ ${q.options.find(o => o.id === q.correct)?.text}`}</p>
                <p className="text-xs text-text-dim mt-1 italic">{q.explanation}</p>
              </div>
            )
          })}
        </div>
      )}
    </PageShell>
  )
}
