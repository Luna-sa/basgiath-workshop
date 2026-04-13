import { useState, useEffect } from 'react'
import { useWorkshopStore } from '../store/workshopStore'
import { usePersona } from '../store/usePersona'
import PageShell from '../core/PageShell'
import SubmissionReview from '../components/SubmissionReview'

export default function P08_PracticeTC() {
  const taskSubmissions = useWorkshopStore(s => s.taskSubmissions)
  const completePage = useWorkshopStore(s => s.completePage)
  const roundEnded = useWorkshopStore(s => s.roundEnded)
  const persona = usePersona()
  const submitted = !!taskSubmissions[8]
  const [timeLeft, setTimeLeft] = useState(420)
  const [started, setStarted] = useState(false)
  const [showReview, setShowReview] = useState(false)

  useEffect(() => {
    if (!started || submitted || roundEnded) return
    const interval = setInterval(() => setTimeLeft(p => p <= 1 ? (clearInterval(interval), 0) : p - 1), 1000)
    return () => clearInterval(interval)
  }, [started, submitted, roundEnded])

  const mins = Math.floor(timeLeft / 60), secs = timeLeft % 60
  const color = timeLeft > 120 ? 'text-qa-teal' : timeLeft > 60 ? 'text-ember' : 'text-corp-red'

  return (
    <PageShell pageIndex={8}>
      <div className="space-y-5">
        <div className="text-center">
          <div className={`font-mono text-3xl font-bold ${color} transition-colors ${timeLeft <= 30 && timeLeft > 0 && started ? 'animate-pulse' : ''}`}>{String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}</div>
          <div className="font-mono text-[12px] text-text-dim tracking-wider uppercase mt-1">
            {submitted ? 'Выполнено' : timeLeft <= 30 && timeLeft > 0 && started ? '⚠️ Время заканчивается!' : started ? 'Осталось' : '7 минут'}
          </div>
        </div>

        <div className="p-5 border border-border border-l-[3px] border-l-qa-teal bg-surface/50 text-left">
          <div className="font-mono text-[11px] tracking-[2px] uppercase text-qa-teal mb-3">Задание</div>
          <p className="text-sm text-text-body mb-3">Открой Nexus Academy и запусти свою новую команду:</p>
          <a href="/sample-project/index.html" target="_blank" className="inline-flex items-center gap-2 mb-3 font-mono text-[13px] text-black bg-qa-teal px-4 py-2 hover:bg-qa-teal-soft transition-colors">↗ Nexus Academy</a>
          <div className="p-3 bg-black border border-border mb-3">
            <code className="font-mono text-[12px] text-qa-teal">/test-cases Форма регистрации: имя, email, пароль, подтверждение, дата рождения, квадрант</code>
          </div>
          <div className="p-3 border bg-surface/30" style={{ borderColor: persona.accentBorder }}>
            <p className="text-xs text-text-secondary">
              <span className="font-mono text-[11px] uppercase" style={{ color: persona.accent }}>Подход</span>{' '}— {persona.approach.testStrategy}
            </p>
          </div>
        </div>

        {!started && !submitted ? (
          <div className="text-center"><button onClick={() => setStarted(true)} className="px-10 py-4 text-black font-body text-[15px] font-semibold tracking-[1px] rounded-[2px] transition-all cursor-pointer" style={{ backgroundColor: persona.accent }}>Начать →</button></div>
        ) : submitted ? (
          <div className="text-center p-5 border border-forest/30 bg-forest/[0.05]"><p className="text-forest font-display">{persona.voice.success[0]}</p></div>
        ) : showReview ? (
          <SubmissionReview type="test-cases" pageIndex={8} roundId="round-1" onComplete={() => completePage(8)} />
        ) : (
          <div className="space-y-3">
            <button onClick={() => setShowReview(true)} className="w-full px-6 py-4 text-black font-body text-[14px] font-semibold rounded-[2px] transition-all cursor-pointer" style={{ backgroundColor: persona.accent }}>Вставить результат на AI-ревью</button>
            <button onClick={() => { useWorkshopStore.getState().submitTask(8, { type: 'self-report' }); completePage(8) }} className="w-full px-6 py-3 text-text-dim text-[13px] border border-border hover:border-text-dim transition-colors cursor-pointer">Пропустить ревью</button>
          </div>
        )}
      </div>
    </PageShell>
  )
}
