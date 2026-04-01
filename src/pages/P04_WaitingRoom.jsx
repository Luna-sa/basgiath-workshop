import { useWorkshopStore } from '../store/workshopStore'
import { usePersona } from '../store/usePersona'
import { CHARACTERS } from '../data/characters'
import PageShell from '../core/PageShell'

export default function P04_WaitingRoom() {
  const user = useWorkshopStore(s => s.user)
  const xp = useWorkshopStore(s => s.xp)
  const persona = usePersona()
  const character = CHARACTERS.find(c => c.id === user.characterId)

  return (
    <PageShell pageIndex={4}>
      <div className="text-center space-y-6">
        {/* Character card with photo */}
        {character && (
          <div className="relative inline-block overflow-hidden border mx-auto" style={{ borderColor: persona.accentBorder }}>
            {/* Portrait */}
            <div className="relative w-48 h-56 sm:w-56 sm:h-64 mx-auto overflow-hidden">
              {character.image ? (
                <img src={character.image} alt={character.name}
                  className={`w-full h-full object-cover ${character.imagePosition || 'object-top'}`} />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-surface">
                  <span className="text-5xl">{character.emoji}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-transparent" />

              {/* Name overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                <div className="font-display text-lg text-white">{user.name || 'Кадет'}</div>
                <div className="font-mono text-[12px] tracking-[3px] uppercase mt-1" style={{ color: persona.accent }}>
                  {character.title} · {xp} XP
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status */}
        <div className="flex items-center justify-center gap-3 p-4 border border-border bg-surface/30 max-w-md mx-auto">
          <span className="w-2 h-2 rounded-full bg-ember animate-pulse" />
          <span className="font-mono text-[12px] text-text-dim tracking-wider">
            Ожидание начала воркшопа...
          </span>
        </div>

        {/* Readiness */}
        <div className="max-w-sm mx-auto text-left space-y-2">
          <div className="font-mono text-[12px] text-text-dim tracking-[2px] uppercase mb-3 text-center">
            Твоя готовность
          </div>
          {[
            { label: 'Персонаж выбран', done: !!user.characterId },
            { label: 'Регистрация пройдена', done: !!user.name && !!user.email },
            { label: 'Инструменты установлены', done: true },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 border border-border bg-surface/30">
              <span className={`font-mono text-[12px] ${item.done ? 'text-forest' : 'text-text-dim'}`}>
                {item.done ? '✓' : '○'}
              </span>
              <span className="text-sm text-text-body">{item.label}</span>
            </div>
          ))}
        </div>

        <p className="text-xs text-text-dim max-w-sm mx-auto">
          Фасилитатор откроет следующий этап, когда все участники будут готовы.
        </p>
      </div>
    </PageShell>
  )
}
