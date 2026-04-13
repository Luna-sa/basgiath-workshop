import PageShell from '../core/PageShell'

export default function P00_Landing() {
  return (
    <PageShell pageIndex={0}>
      <div className="space-y-8">
        {/* World intro */}
        <div className="p-6 border border-[#2E2E2E] bg-[#141414] rounded-lg">
          <div className="font-mono text-[13px] tracking-[3px] uppercase text-qa-teal mb-4">О мире</div>
          <p className="text-[18px] text-text-body leading-relaxed mb-3">
            <strong className="text-white">«Четвёртое Крыло»</strong> — книга про военную академию, где люди связываются с драконами.
            Драконы разумные и опасные. Они сами решают, с кем связываться.
          </p>
          <p className="text-[18px] text-text-body leading-relaxed mb-3">
            До драконов нужно дойти. Сначала — <strong className="text-white">Парапет</strong>. Каменный мост без перил над пропастью. Первый отсев.
          </p>
          <p className="text-[16px] text-text-secondary italic">
            Сегодня AI — ваш дракон. Вы настроите полную QA-экосистему и научитесь ей пользоваться.
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 sm:gap-12">
          {[
            { value: '7', label: 'Команд' },
            { value: '4', label: 'Агента' },
            { value: '3', label: 'MCP' },
            { value: '60', unit: 'мин', label: 'Воркшоп' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="font-display text-3xl sm:text-4xl text-white">
                {s.value}<span className="text-text-dim text-lg">{s.unit || ''}</span>
              </div>
              <div className="font-mono text-[13px] text-text-dim tracking-[2px] uppercase mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* What you get */}
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { icon: '🐉', title: 'QA-экосистема', desc: 'CLAUDE.md + 7 команд + 4 агента — одной командой' },
            { icon: '🌐', title: 'MCP суперсила', desc: 'AI сам тестирует сайт, API и читает документацию' },
            { icon: '🎯', title: 'Практика на багах', desc: 'Тестовое приложение с 36 дефектами + AI-ревью' },
            { icon: '🏆', title: 'Соревнование', desc: 'Таймеры, очки, лидерборд, подиум победителей' },
          ].map(a => (
            <div key={a.title} className="p-5 border border-[#2E2E2E] bg-[#141414] rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{a.icon}</span>
                <h3 className="font-display text-[18px] text-white">{a.title}</h3>
              </div>
              <p className="text-[15px] text-text-secondary leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  )
}
