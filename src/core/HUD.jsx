import { useWorkshopStore } from '../store/workshopStore'
import { CHARACTERS } from '../data/characters'
import { BADGES } from '../data/badges'
import { usePersona } from '../store/usePersona'

export default function HUD() {
  const xp = useWorkshopStore(s => s.xp)
  const badges = useWorkshopStore(s => s.badges)
  const characterId = useWorkshopStore(s => s.user.characterId)
  const name = useWorkshopStore(s => s.user.name)
  const toggleBadgeOverlay = useWorkshopStore(s => s.toggleBadgeOverlay)
  const showBadgeOverlay = useWorkshopStore(s => s.showBadgeOverlay)
  const persona = usePersona()

  const character = CHARACTERS.find(c => c.id === characterId)

  return (
    <>
      {/* Fixed HUD — bottom left */}
      <div className="fixed bottom-4 left-4 z-50 flex items-end gap-3">
        {/* Character avatar */}
        {character && (
          <div className="flex items-center gap-2 px-3 py-2 bg-surface/90 backdrop-blur-lg border border-border rounded-[2px]">
            <span className="text-lg">{character.emoji}</span>
            <div>
              <div className="font-mono text-[11px] text-text-dim tracking-wider uppercase">
                {name || character.name.split(' ')[0]}
              </div>
              <div className="font-display text-xs text-text-primary italic">
                {character.title}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed HUD — bottom right */}
      <div className="fixed bottom-4 right-4 z-50 flex items-end gap-3">
        {/* XP Counter */}
        <div className="px-3 py-2 bg-surface/90 backdrop-blur-lg rounded-[2px]" style={{ borderColor: persona.accentBorder, borderWidth: 1, borderStyle: 'solid' }}>
          <div className="font-mono text-[11px] text-text-dim tracking-wider uppercase">XP</div>
          <div className="font-display text-lg font-bold leading-none" style={{ color: persona.accent }}>{xp}</div>
        </div>

        {/* Badges button */}
        {badges.length > 0 && (
          <button
            onClick={toggleBadgeOverlay}
            className="px-3 py-2 bg-surface/90 backdrop-blur-lg border border-border rounded-[2px] hover:border-qa-teal/25 transition-colors cursor-pointer"
          >
            <div className="font-mono text-[11px] text-text-dim tracking-wider uppercase">Бейджи</div>
            <div className="flex gap-0.5 mt-0.5">
              {badges.slice(0, 4).map(id => {
                const badge = BADGES.find(b => b.id === id)
                return <span key={id} className="text-sm">{badge?.emoji}</span>
              })}
              {badges.length > 4 && (
                <span className="font-mono text-[12px] text-text-dim">+{badges.length - 4}</span>
              )}
            </div>
          </button>
        )}
      </div>

      {/* Badge Overlay */}
      {showBadgeOverlay && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4" onClick={toggleBadgeOverlay}>
          <div className="bg-surface border border-border max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-lg text-white">
                Твои <em className="text-qa-teal italic">бейджи</em>
              </h3>
              <button onClick={toggleBadgeOverlay} className="text-text-dim hover:text-white transition-colors cursor-pointer">✕</button>
            </div>
            <div className="space-y-3">
              {BADGES.map(badge => {
                const earned = badges.includes(badge.id)
                return (
                  <div key={badge.id} className={`flex items-center gap-3 p-3 border ${
                    earned ? 'border-qa-teal/20 bg-qa-teal/[0.03]' : 'border-border opacity-40'
                  }`}>
                    <span className="text-2xl">{badge.emoji}</span>
                    <div>
                      <div className="text-sm text-text-primary">{badge.name}</div>
                      <div className="text-xs text-text-dim">{badge.description}</div>
                    </div>
                    {earned && <span className="ml-auto text-qa-teal text-sm">✦</span>}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
