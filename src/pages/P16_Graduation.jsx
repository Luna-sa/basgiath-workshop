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
        {/* Hero card — portrait + stats */}
        <div className="overflow-hidden border" style={{ borderColor: persona.accentBorder }}>
          {/* Portrait — always rendered, fallback bg if no image */}
          <div className="relative h-64 sm:h-72 overflow-hidden bg-surface">
            {character?.image ? (
              <img
                src={character.image}
                alt={name || ''}
                className={`w-full h-full object-cover ${character?.imagePosition || 'object-center'}`}
                loading="eager"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-6xl">{character?.emoji || '🐉'}</span>
              </div>
            )}
            {/* Thin gradient at bottom only */}
            <div className="absolute bottom-0 left-0 right-0 h-[35%] bg-gradient-to-t from-[#0A0A0A] to-transparent" />
            {/* Name on bottom edge */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
              <div className="font-display text-xl text-white drop-shadow-lg">{name}</div>
              <div className="font-mono text-[12px] tracking-[3px] uppercase drop-shadow-lg" style={{ color: persona.accent }}>
                {character?.title}
              </div>
            </div>
          </div>
          {/* Stats below photo */}
          <div className="p-5 text-center" style={{ backgroundColor: persona.accentLight }}>
            <div className="font-display text-4xl font-bold mb-3" style={{ color: persona.accent }}>{xp} XP</div>
            <div className="flex justify-center gap-3 flex-wrap">
              {badges.map(id => {
                const b = BADGES.find(x => x.id === id)
                return (
                  <div key={id} className="flex flex-col items-center gap-1">
                    <span className="text-xl">{b?.emoji}</span>
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
