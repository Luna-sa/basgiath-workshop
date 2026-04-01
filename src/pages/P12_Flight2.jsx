import { useState, useEffect } from 'react'
import { useWorkshopStore } from '../store/workshopStore'
import { usePersona } from '../store/usePersona'
import PageShell from '../core/PageShell'

export default function P12_Flight2() {
  const submitTask = useWorkshopStore(s => s.submitTask)
  const taskSubmissions = useWorkshopStore(s => s.taskSubmissions)
  const completePage = useWorkshopStore(s => s.completePage)
  const persona = usePersona()
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
          <p className="text-sm text-text-body mb-3">Найди баг в Nexus Academy и создай профессиональный отчёт:</p>
          <a href="/sample-project/index.html" target="_blank" className="inline-flex items-center gap-2 mb-4 font-mono text-[13px] text-black bg-qa-teal px-4 py-2.5 hover:bg-qa-teal-soft transition-colors">↗ Открыть Nexus Academy</a>
          <div className="space-y-2 mb-4">
            <div className="p-3 bg-black border border-border">
              <div className="font-mono text-[11px] text-text-dim mb-1">Команда</div>
              <code className="font-mono text-sm text-qa-teal">/bug-report В Nexus Academy можно залогиниться без пароля — пустые поля проходят аутентификацию</code>
            </div>
          </div>
          <p className="text-xs text-text-secondary mb-2">Подсказки — ищи баги в:</p>
          <div className="grid grid-cols-2 gap-2">
            {['Логин без данных', 'Пароль виден всем', 'Cancel = Submit', 'Удаление без подтверждения', 'Даты из будущего', 'Форматы дат разные'].map((h, i) => (
              <div key={i} className="text-xs text-text-dim p-2 border border-border bg-black/30">› {h}</div>
            ))}
          </div>
        </div>
        {/* Character approach */}
        <div className="p-3 border bg-surface/30" style={{ borderColor: persona.accentBorder }}>
          <p className="text-xs text-text-secondary">
            <span className="font-mono text-[12px] uppercase" style={{ color: persona.accent }}>Твой подход</span>{' '}— {persona.approach.bugHunting}
          </p>
        </div>
        {!started && !submitted ? (
          <div className="text-center"><button onClick={() => setStarted(true)} className="px-10 py-4 text-black font-body text-[15px] font-semibold tracking-[1px] rounded-[2px] transition-all cursor-pointer" style={{ backgroundColor: persona.accent }}>Начать охоту →</button></div>
        ) : submitted ? (
          <div className="text-center p-6 border border-forest/30 bg-forest/[0.05]"><p className="text-forest font-display">{persona.voice.successBig}</p></div>
        ) : (
          <div className="text-center"><button onClick={handleSubmit} className="px-8 py-4 border-2 font-body text-[15px] font-semibold rounded-[2px] transition-all cursor-pointer" style={{ borderColor: persona.accentBorder, color: persona.accent }}>✓ Баг найден</button></div>
        )}
      </div>
    </PageShell>
  )
}
