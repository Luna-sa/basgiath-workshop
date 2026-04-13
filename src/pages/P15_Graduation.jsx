import { useWorkshopStore } from '../store/workshopStore'
import { usePersona } from '../store/usePersona'
import { BADGES } from '../data/badges'
import { CHARACTERS } from '../data/characters'
import PageShell from '../core/PageShell'

export default function P15_Graduation() {
  const xp = useWorkshopStore(s => s.xp)
  const badges = useWorkshopStore(s => s.badges)
  const name = useWorkshopStore(s => s.user.name)
  const characterId = useWorkshopStore(s => s.user.characterId)
  const persona = usePersona()
  const character = CHARACTERS.find(c => c.id === characterId)

  return (
    <PageShell pageIndex={15}>
      <div className="space-y-6">
        {/* Portrait + stats */}
        <div className="overflow-hidden border" style={{ borderColor: persona.accentBorder }}>
          <div className="relative h-56 overflow-hidden bg-surface">
            {character?.image ? (
              <img src={character.image} alt={name || ''} className={`w-full h-full object-cover ${character?.imagePosition || 'object-center'}`} loading="eager" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"><span className="text-6xl">{character?.emoji || '🐉'}</span></div>
            )}
            <div className="absolute bottom-0 left-0 right-0 h-[35%] bg-gradient-to-t from-[#0A0A0A] to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
              <div className="font-display text-xl text-white drop-shadow-lg">{name}</div>
              <div className="font-mono text-[12px] tracking-[3px] uppercase drop-shadow-lg" style={{ color: persona.accent }}>{character?.title}</div>
            </div>
          </div>
          <div className="p-5 text-center" style={{ backgroundColor: persona.accentLight }}>
            <div className="font-display text-4xl font-bold mb-3" style={{ color: persona.accent }}>{xp} XP</div>
            <div className="flex justify-center gap-3 flex-wrap">
              {badges.map(id => { const b = BADGES.find(x => x.id === id); return (
                <div key={id} className="flex flex-col items-center gap-1"><span className="text-xl">{b?.emoji}</span><span className="font-mono text-[9px] text-text-dim">{b?.name}</span></div>
              )})}
            </div>
          </div>
        </div>

        {/* Final words */}
        <div className="p-5 border border-l-[3px]" style={{ borderColor: persona.accentBorder, borderLeftColor: persona.accent, backgroundColor: persona.accentLight }}>
          <div className="font-mono text-[11px] tracking-[2px] uppercase mb-2" style={{ color: persona.accent }}>Финальные слова</div>
          <p className="font-display italic text-text-body text-base">«{persona.voice.finalWords}»</p>
        </div>

        {/* What you got */}
        <div>
          <div className="font-mono text-[12px] tracking-[2px] uppercase text-text-dim mb-3">Что у тебя теперь есть</div>
          <div className="grid grid-cols-2 gap-2">
            {['7 slash-команд для QA', '4 AI-агента', '3 MCP-сервера', 'Настроенный CLAUDE.md', 'Опыт AI-тестирования', 'Баг-репорт с AI-ревью'].map((h, i) => (
              <div key={i} className="flex gap-2 p-2 border border-border bg-surface/30">
                <span className="text-qa-teal text-xs">✓</span>
                <span className="text-xs text-text-body">{h}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Series */}
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            { n: 'I', t: 'Отбор', d: 'QA-экосистема', done: true },
            { n: 'II', t: 'Сигнет', d: 'Hooks, Skills, Plan mode' },
            { n: 'III', t: 'Тактика', d: 'Агенты, интеграции' },
            { n: 'IV', t: 'Военные игры', d: 'Хакатон' },
          ].map(w => (
            <div key={w.n} className={`p-3 border ${w.done ? 'border-l-[3px]' : 'border-border bg-surface/30'}`}
              style={w.done ? { borderColor: persona.accentBorder, borderLeftColor: persona.accent, backgroundColor: persona.accentLight } : {}}>
              <span className="font-display text-lg text-text-dim italic">{w.n}</span>
              <h3 className="font-display text-sm text-white">{w.t}</h3>
              <p className="text-xs text-text-dim">{w.d}</p>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  )
}
