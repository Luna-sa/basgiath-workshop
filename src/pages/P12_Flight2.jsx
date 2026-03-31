import { useState, useEffect } from 'react'
import { useWorkshopStore } from '../store/workshopStore'
import PageShell from '../core/PageShell'

export default function P12_Flight2() {
  const submitTask = useWorkshopStore(s => s.submitTask)
  const taskSubmissions = useWorkshopStore(s => s.taskSubmissions)
  const completePage = useWorkshopStore(s => s.completePage)
  const submitted = !!taskSubmissions[12]
  const [timeLeft, setTimeLeft] = useState(420)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (!started || submitted) return
    const interval = setInterval(() => setTimeLeft(p => p <= 1 ? (clearInterval(interval), 0) : p - 1), 1000)
    return () => clearInterval(interval)
  }, [started, submitted])

  const mins = Math.floor(timeLeft / 60), secs = timeLeft % 60
  const color = timeLeft > 120 ? 'text-qa-teal' : timeLeft > 60 ? 'text-ember' : 'text-corp-red'

  const handleSubmit = () => { submitTask(12, { type: 'self-report', durationSeconds: 420 - timeLeft }); completePage(12) }

  return (
    <PageShell pageIndex={12}>
      <div className="space-y-6">
        <div className="text-center">
          <div className={`font-mono text-4xl font-bold ${color} transition-colors`}>{String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}</div>
          <div className="font-mono text-[12px] text-text-dim tracking-wider uppercase mt-1">{submitted ? 'Выполнено' : started ? 'Осталось' : '7 минут'}</div>
        </div>
        <div className="p-6 border border-border border-l-[3px] border-l-qa-teal bg-surface/50 text-left">
          <div className="font-mono text-[11px] tracking-[2px] uppercase text-qa-teal mb-3">Задание</div>
          <p className="text-sm text-text-body mb-3">Открой BugBank, найди баг и опиши его своему AI-агенту:</p>
          <a href="/sample-project/" target="_blank" className="inline-flex items-center gap-2 mb-4 font-mono text-[13px] text-black bg-qa-teal px-4 py-2.5 hover:bg-qa-teal-soft transition-colors">↗ Открыть BugBank</a>
          <div className="p-3 bg-black border border-border font-mono text-sm text-qa-teal mb-4">/bug-report [опиши найденный баг в BugBank]</div>
          <p className="text-xs text-text-dim">Подсказки: попробуй логин без данных, регистрацию с пустыми полями, перевод отрицательной суммы, удаление аккаунта.</p>
        </div>
        {!started && !submitted ? (
          <div className="text-center"><button onClick={() => setStarted(true)} className="px-10 py-4 bg-qa-teal text-black font-body text-[15px] font-semibold tracking-[1px] rounded-[2px] hover:bg-qa-teal-soft transition-all cursor-pointer">Начать охоту →</button></div>
        ) : submitted ? (
          <div className="text-center p-6 border border-forest/30 bg-forest/[0.05]"><p className="text-forest font-display">🎯 Баг задокументирован</p></div>
        ) : (
          <div className="text-center"><button onClick={handleSubmit} className="px-8 py-4 border-2 border-qa-teal/40 text-qa-teal font-body text-[15px] font-semibold rounded-[2px] hover:bg-qa-teal/10 transition-all cursor-pointer">✓ Баг найден</button></div>
        )}
      </div>
    </PageShell>
  )
}
