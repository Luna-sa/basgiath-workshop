import PageShell from '../core/PageShell'

export default function P00_Landing() {
  return (
    <PageShell pageIndex={0}>
      <div className="space-y-5">
        {/* Stats */}
        <div className="flex items-center justify-center gap-8 sm:gap-12">
          {[
            { value: '60', unit: 'мин', label: 'Воркшоп' },
            { value: '3', unit: '', label: 'Артефакта' },
            { value: '0₽', unit: '', label: 'Cursor path' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="font-display text-xl sm:text-2xl text-white">
                {s.value}<span className="text-text-dim text-base">{s.unit}</span>
              </div>
              <div className="font-mono text-[11px] text-text-dim tracking-[2px] uppercase">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Three artifacts */}
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { num: '01', title: 'Связь с драконом', desc: 'CLAUDE.md — инструкция для AI', icon: '🐉' },
            { num: '02', title: 'Боевые приёмы', desc: '/bug-report и /test-cases', icon: '⚔️' },
            { num: '03', title: 'Первый полёт', desc: 'Практика на реальном коде', icon: '🎯' },
          ].map(a => (
            <div key={a.num} className="p-4 border border-border bg-surface/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-[11px] text-qa-teal tracking-wider">{a.num}</span>
                <div className="flex-1 h-px bg-border" />
                <span className="text-base">{a.icon}</span>
              </div>
              <h3 className="font-display text-sm text-white mb-0.5">{a.title}</h3>
              <p className="text-xs text-text-secondary">{a.desc}</p>
            </div>
          ))}
        </div>

        {/* About */}
        <div className="p-4 border border-border border-l-[3px] border-l-qa-teal bg-surface/30">
          <div className="font-mono text-[11px] tracking-[2px] uppercase text-qa-teal mb-2">
            Что тебя ждёт
          </div>
          <p className="text-sm text-text-body leading-relaxed">
            За 60 минут ты настроишь AI-агента (Claude Code или Cursor), создашь CLAUDE.md,
            напишешь slash-команды для QA и применишь их на коде с настоящими багами.
            Без опыта программирования.
          </p>
        </div>
      </div>
    </PageShell>
  )
}
