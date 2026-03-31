import { useWorkshopStore } from '../store/workshopStore'
import { CHARACTERS } from '../data/characters'
import PageShell from '../core/PageShell'

export default function P04_WaitingRoom() {
  const user = useWorkshopStore(s => s.user)
  const xp = useWorkshopStore(s => s.xp)
  const character = CHARACTERS.find(c => c.id === user.characterId)

  return (
    <PageShell pageIndex={4}>
      <div className="text-center space-y-8">
        {/* Character badge */}
        {character && (
          <div className="inline-block p-6 border border-qa-teal/20 bg-qa-teal/[0.03]">
            <div className="text-4xl mb-3">{character.emoji}</div>
            <div className="font-display text-lg text-white">{user.name || 'Кадет'}</div>
            <div className="font-mono text-[11px] text-qa-teal tracking-[2px] uppercase mt-1">
              {character.title} · {xp} XP
            </div>
          </div>
        )}

        {/* Status */}
        <div className="flex items-center justify-center gap-3 p-4 border border-border bg-surface/30 max-w-md mx-auto">
          <span className="w-2 h-2 rounded-full bg-ember animate-pulse" />
          <span className="font-mono text-[11px] text-text-dim tracking-wider">
            Ожидание начала воркшопа...
          </span>
        </div>

        {/* What you've done */}
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

        {/* Hint */}
        <p className="text-xs text-text-dim max-w-sm mx-auto">
          Фасилитатор откроет следующий этап, когда все участники будут готовы.
          Не закрывай эту страницу.
        </p>
      </div>
    </PageShell>
  )
}
