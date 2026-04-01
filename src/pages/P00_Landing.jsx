import PageShell from '../core/PageShell'

export default function P00_Landing() {
  return (
    <PageShell pageIndex={0}>
      <div className="space-y-5">
        {/* World intro — hook */}
        <div className="p-5 border border-border bg-surface/30">
          <div className="font-mono text-[11px] tracking-[2px] uppercase text-qa-teal mb-3">О мире</div>
          <p className="text-[14px] text-text-body leading-relaxed mb-3">
            В мире <strong className="text-white">«Четвёртого Крыла»</strong> существует Академия Басгиат — военная школа, где люди связываются с драконами.
            Драконы — древние, смертельно опасные существа с собственным разумом. Они сами выбирают наездника. Если дракон не выберет тебя — ты уходишь ни с чем. Если выберет — ты получаешь силу, о которой не мечтал.
          </p>
          <p className="text-[14px] text-text-body leading-relaxed mb-3">
            Но прежде чем дойти до драконов, нужно пересечь <strong className="text-white">Парапет</strong> — узкий каменный мост без перил над пропастью. Это первый отсев. Не все доходят.
          </p>
          <p className="text-[13px] text-text-secondary italic">
            Сегодня твой AI-инструмент — это дракон. Ты научишься устанавливать с ним связь, управлять им и использовать его силу в QA-работе.
          </p>
        </div>

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
            { num: '01', title: 'Связь с драконом', desc: 'CLAUDE.md — файл, через который AI узнаёт тебя', icon: '🐉' },
            { num: '02', title: 'Боевые приёмы', desc: 'Команды /bug-report и /test-cases', icon: '⚔️' },
            { num: '03', title: 'Первый полёт', desc: 'Практика на приложении с реальными багами', icon: '🎯' },
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
      </div>
    </PageShell>
  )
}
