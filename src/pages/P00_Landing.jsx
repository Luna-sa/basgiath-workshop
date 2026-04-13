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
            Сегодня AI — ваш дракон. Вы настроите полную QA-экосистему и научитесь ей пользоваться.
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-6 sm:gap-10">
          {[
            { value: '7', label: 'Команд' },
            { value: '4', label: 'Агента' },
            { value: '3', label: 'MCP' },
            { value: '60', unit: 'мин', label: 'Воркшоп' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="font-display text-xl sm:text-2xl text-white">
                {s.value}<span className="text-text-dim text-base">{s.unit || ''}</span>
              </div>
              <div className="font-mono text-[10px] text-text-dim tracking-[2px] uppercase">{s.label}</div>
            </div>
          ))}
        </div>

        {/* What you get */}
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { icon: '🐉', title: 'QA-экосистема', desc: 'CLAUDE.md + 7 команд + 4 агента — одной командой' },
            { icon: '🌐', title: 'MCP суперсила', desc: 'AI сам тестирует сайт, API и читает документацию' },
            { icon: '🎯', title: 'Практика на багах', desc: 'Тестовое приложение с 36 дефектами + AI-ревью' },
            { icon: '🏆', title: 'Соревнование', desc: 'Таймеры, очки, лидерборд, подиум победителей' },
          ].map(a => (
            <div key={a.title} className="p-4 border border-border bg-surface/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{a.icon}</span>
                <h3 className="font-display text-sm text-white">{a.title}</h3>
              </div>
              <p className="text-xs text-text-secondary">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  )
}
