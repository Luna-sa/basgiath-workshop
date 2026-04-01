import PageShell from '../core/PageShell'

export default function P00_Landing() {
  return (
    <PageShell pageIndex={0}>
      <div className="space-y-5">
        {/* World intro */}
        <div className="p-5 border border-border bg-surface/30">
          <div className="font-mono text-[11px] tracking-[2px] uppercase text-qa-teal mb-3">О мире</div>
          <p className="text-[14px] text-text-body leading-relaxed mb-3">
            <strong className="text-white">«Четвёртое Крыло»</strong> — книга про военную академию, где люди связываются с драконами.
            Драконы разумные и опасные. Они сами решают, с кем связываться. Не выбрал — уходишь ни с чем. Выбрал — получаешь силу, к которой не был готов.
          </p>
          <p className="text-[14px] text-text-body leading-relaxed mb-3">
            Но до драконов ещё нужно дойти. Сначала — <strong className="text-white">Парапет</strong>. Каменный мост без перил, под которым ничего кроме пропасти. Первый отсев.
          </p>
          <p className="text-[13px] text-text-secondary italic">
            Сегодня AI-инструмент — это ваш дракон. Вы научитесь с ним работать и применять в QA.
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

        {/* What we'll build */}
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { num: '01', title: 'Связь с драконом', desc: 'CLAUDE.md — файл, через который AI узнаёт тебя', icon: '🐉' },
            { num: '02', title: 'Боевые приёмы', desc: 'Команды /bug-report и /test-cases', icon: '⚔️' },
            { num: '03', title: 'Первый полёт', desc: 'Практика на приложении с заложенными багами', icon: '🎯' },
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
