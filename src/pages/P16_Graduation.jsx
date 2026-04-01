import { useWorkshopStore } from '../store/workshopStore'
import { usePersona } from '../store/usePersona'
import { BADGES } from '../data/badges'
import { CHARACTERS } from '../data/characters'
import PageShell from '../core/PageShell'

const homework = [
  'Добавь ещё 5 команд из полного документа',
  'Адаптируй CLAUDE.md под свой реальный проект',
  'Попробуй /bug-report на реальном баге с работы',
  'Установи 1-2 MCP-сервера (Playwright, GitHub)',
]

export default function P16_Graduation() {
  const xp = useWorkshopStore(s => s.xp)
  const badges = useWorkshopStore(s => s.badges)
  const name = useWorkshopStore(s => s.user.name)
  const characterId = useWorkshopStore(s => s.user.characterId)
  const persona = usePersona()
  const character = CHARACTERS.find(c => c.id === characterId)

  return (
    <PageShell pageIndex={16}>
      <div className="space-y-8">
        {/* Hero card — character portrait + stats */}
        <div className="relative overflow-hidden border" style={{ borderColor: persona.accentBorder }}>
          {/* Background portrait — faded, centered on face */}
          {character?.image && (
            <div className="absolute inset-0 overflow-hidden">
              <img src={character.image} alt=""
                className={`w-full h-full object-cover opacity-15 ${character.imagePosition || 'object-center'}`} />
              <div className="absolute inset-0 bg-gradient-to-b from-bg/60 via-transparent to-bg/80" />
            </div>
          )}
          <div className="relative p-6 text-center">
            <div className="font-display text-5xl font-bold mb-1" style={{ color: persona.accent }}>{xp} XP</div>
            <div className="font-display text-lg text-white">{name}</div>
            <div className="font-mono text-[12px] tracking-[3px] uppercase mt-1" style={{ color: persona.accent }}>
              {character?.title}
            </div>
            {/* Personalized badges */}
            <div className="flex justify-center gap-3 mt-4">
              {badges.map(id => {
                const b = BADGES.find(x => x.id === id)
                return (
                  <div key={id} className="flex flex-col items-center gap-1">
                    <span className="text-2xl">{b?.emoji}</span>
                    <span className="font-mono text-[9px] text-text-dim">{b?.name}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Character's final words */}
        <div className="p-5 border border-l-[3px]" style={{ borderColor: persona.accentBorder, borderLeftColor: persona.accent, backgroundColor: persona.accentLight }}>
          <div className="font-mono text-[11px] tracking-[2px] uppercase mb-2" style={{ color: persona.accent }}>
            Финальные слова
          </div>
          <p className="font-display italic text-text-body text-base leading-relaxed">
            «{persona.voice.finalWords}»
          </p>
        </div>

        {/* Homework */}
        <div>
          <div className="font-mono text-[12px] tracking-[2px] uppercase text-text-dim mb-4">Домашнее задание</div>
          <div className="space-y-2">
            {homework.map((h, i) => (
              <div key={i} className="flex gap-3 p-3 border border-border bg-surface/30">
                <span className="font-mono text-[12px] shrink-0" style={{ color: persona.accent }}>{i + 1}.</span>
                <span className="text-sm text-text-body">{h}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Series teaser */}
        <div>
          <div className="font-mono text-[12px] tracking-[2px] uppercase text-text-dim mb-4">Серия</div>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { n: 'I', t: 'Отбор', d: 'Настройка экосистемы', done: true },
              { n: 'II', t: 'Сигнет', d: 'Кастомизация под проект' },
              { n: 'III', t: 'Тактика', d: 'MCP, Hooks, интеграции' },
              { n: 'IV', t: 'Военные игры', d: 'Хакатон' },
            ].map(w => (
              <div key={w.n} className={`p-4 border ${w.done ? 'border-l-[3px]' : 'border-border bg-surface/30'}`}
                style={w.done ? { borderColor: persona.accentBorder, borderLeftColor: persona.accent, backgroundColor: persona.accentLight } : {}}>
                <span className="font-display text-xl text-text-dim italic">{w.n}</span>
                <h3 className="font-display text-sm text-white">{w.t}</h3>
                <p className="text-xs text-text-dim">{w.d}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Closing */}
        <div className="text-center p-6 border border-border bg-surface/30">
          <p className="font-display italic text-base text-text-primary">
            «{persona.voice.transition}»
          </p>
        </div>
      </div>
    </PageShell>
  )
}
