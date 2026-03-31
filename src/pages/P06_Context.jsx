import PageShell from '../core/PageShell'

export default function P06_Context() {
  return (
    <PageShell pageIndex={6}>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 border border-border border-l-[3px] border-l-corp-red bg-surface/50">
          <div className="font-mono text-[11px] tracking-[2px] uppercase text-corp-red mb-4">Scribes — Без AI</div>
          <ul className="space-y-3 text-text-secondary text-sm">
            {['Copy-paste в ChatGPT заново', 'AI не знает проект', 'Промпт с нуля каждый раз', 'Всё вручную'].map((t, i) => (
              <li key={i} className="flex gap-3"><span className="text-corp-red/60 shrink-0">✕</span>{t}</li>
            ))}
          </ul>
        </div>
        <div className="p-6 border border-border border-l-[3px] border-l-qa-teal bg-qa-teal/[0.03]">
          <div className="font-mono text-[11px] tracking-[2px] uppercase text-qa-teal mb-4">Riders — С AI-агентом</div>
          <ul className="space-y-3 text-text-body text-sm">
            {['AI знает роль, проект, стандарты', '/bug-report за секунды', '/test-cases — 25 кейсов', 'Ревью на баги и edge cases'].map((t, i) => (
              <li key={i} className="flex gap-3"><span className="text-qa-teal shrink-0">✓</span>{t}</li>
            ))}
          </ul>
        </div>
      </div>
    </PageShell>
  )
}
