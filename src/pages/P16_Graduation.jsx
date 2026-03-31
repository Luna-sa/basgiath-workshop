import { useWorkshopStore } from '../store/workshopStore'
import { BADGES } from '../data/badges'
import PageShell from '../core/PageShell'

export default function P16_Graduation() {
  const xp = useWorkshopStore(s => s.xp)
  const badges = useWorkshopStore(s => s.badges)
  const name = useWorkshopStore(s => s.user.name)

  return (
    <PageShell pageIndex={16}>
      <div className="space-y-10">
        <div className="text-center p-8 border border-qa-teal/30 bg-qa-teal/[0.05]">
          <div className="font-display text-5xl text-qa-teal font-bold mb-1">{xp} XP</div>
          <div className="font-display text-lg text-white">{name}</div>
          <div className="flex justify-center gap-2 mt-4">
            {badges.map(id => { const b = BADGES.find(x => x.id === id); return <span key={id} className="text-2xl" title={b?.name}>{b?.emoji}</span> })}
          </div>
        </div>

        <div>
          <div className="font-mono text-[12px] tracking-[2px] uppercase text-text-dim mb-4">Домашнее задание</div>
          <div className="space-y-2">
            {['Добавь ещё 5 команд из полного документа', 'Адаптируй CLAUDE.md под реальный проект', 'Попробуй /bug-report на реальном баге', 'Установи 1-2 MCP-сервера'].map((h, i) => (
              <div key={i} className="flex gap-3 p-3 border border-border bg-surface/30">
                <span className="font-mono text-[12px] text-qa-teal shrink-0">{i + 1}.</span>
                <span className="text-sm text-text-body">{h}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="font-mono text-[12px] tracking-[2px] uppercase text-text-dim mb-4">Серия</div>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { n: 'I', t: 'Отбор', d: 'Настройка экосистемы', done: true },
              { n: 'II', t: 'Сигнет', d: 'Кастомизация под проект' },
              { n: 'III', t: 'Тактика', d: 'MCP, Hooks, интеграции' },
              { n: 'IV', t: 'Военные игры', d: 'Хакатон' },
            ].map(w => (
              <div key={w.n} className={`p-4 border ${w.done ? 'border-qa-teal/30 bg-qa-teal/[0.03] border-l-[3px] border-l-qa-teal' : 'border-border bg-surface/30'}`}>
                <span className="font-display text-xl text-text-dim italic">{w.n}</span>
                <h3 className="font-display text-sm text-white">{w.t}</h3>
                <p className="text-xs text-text-dim">{w.d}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center p-6 border border-border bg-surface/30">
          <p className="font-display italic text-base text-text-primary">«Это был только Отбор. Увидимся на следующем построении.»</p>
        </div>
      </div>
    </PageShell>
  )
}
