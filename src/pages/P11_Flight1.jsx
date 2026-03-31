import { useState, useEffect } from 'react'
import { useWorkshopStore } from '../store/workshopStore'
import PageShell from '../core/PageShell'

export default function P11_Flight1() {
  const submitTask = useWorkshopStore(s => s.submitTask)
  const taskSubmissions = useWorkshopStore(s => s.taskSubmissions)
  const completePage = useWorkshopStore(s => s.completePage)
  const submitted = !!taskSubmissions[11]
  const [timeLeft, setTimeLeft] = useState(420)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (!started || submitted) return
    const interval = setInterval(() => setTimeLeft(p => p <= 1 ? (clearInterval(interval), 0) : p - 1), 1000)
    return () => clearInterval(interval)
  }, [started, submitted])

  const mins = Math.floor(timeLeft / 60), secs = timeLeft % 60
  const color = timeLeft > 120 ? 'text-qa-teal' : timeLeft > 60 ? 'text-ember' : 'text-corp-red'

  const handleSubmit = () => { submitTask(11, { type: 'self-report', durationSeconds: 420 - timeLeft }); completePage(11) }

  return (
    <PageShell pageIndex={11}>
      <div className="space-y-6">
        <div className="text-center">
          <div className={`font-mono text-4xl font-bold ${color} transition-colors`}>{String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}</div>
          <div className="font-mono text-[12px] text-text-dim tracking-wider uppercase mt-1">{submitted ? 'Выполнено' : started ? 'Осталось' : '7 минут'}</div>
        </div>
        <div className="p-6 border border-border border-l-[3px] border-l-qa-teal bg-surface/50 text-left">
          <div className="font-mono text-[11px] tracking-[2px] uppercase text-qa-teal mb-3">Задание</div>
          <p className="text-sm text-text-body mb-2">Открой тестовый проект в своём редакторе. Запусти:</p>
          <a href="/sample-project.zip" download className="inline-block mb-3 font-mono text-[12px] text-qa-teal border border-qa-teal/20 px-3 py-1.5 hover:bg-qa-teal/10 transition-colors">↓ Скачать sample-project.zip</a>
          <div className="p-3 bg-black border border-border font-mono text-sm text-qa-teal mb-4">/test-cases Страница регистрации с полями: имя, email, пароль, подтверждение пароля</div>
          <p className="text-xs text-text-dim">Сколько тест-кейсов? Покрыты ли positive, negative, boundary, edge?</p>
        </div>
        {!started && !submitted ? (
          <div className="text-center"><button onClick={() => setStarted(true)} className="px-10 py-4 bg-qa-teal text-black font-body text-[15px] font-semibold tracking-[1px] rounded-[2px] hover:bg-qa-teal-soft transition-all cursor-pointer">Начать →</button></div>
        ) : submitted ? (
          <div className="text-center p-6 border border-forest/30 bg-forest/[0.05]"><p className="text-forest font-display">✓ Задание выполнено</p></div>
        ) : (
          <div className="text-center"><button onClick={handleSubmit} className="px-8 py-4 border-2 border-qa-teal/40 text-qa-teal font-body text-[15px] font-semibold rounded-[2px] hover:bg-qa-teal/10 transition-all cursor-pointer">✓ Выполнил(а)</button></div>
        )}
      </div>
    </PageShell>
  )
}
