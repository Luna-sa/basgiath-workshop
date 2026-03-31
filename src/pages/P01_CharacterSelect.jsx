import { useWorkshopStore } from '../store/workshopStore'
import { CHARACTERS } from '../data/characters'
import PageShell from '../core/PageShell'

export default function P01_CharacterSelect() {
  const characterId = useWorkshopStore(s => s.user.characterId)
  const selectCharacter = useWorkshopStore(s => s.selectCharacter)

  return (
    <PageShell pageIndex={1}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {CHARACTERS.map(c => (
          <button
            key={c.id}
            onClick={() => selectCharacter(c.id === characterId ? null : c.id)}
            className={`group text-left border transition-all duration-300 cursor-pointer overflow-hidden ${
              characterId === c.id
                ? 'border-qa-teal bg-qa-teal/[0.05] shadow-[0_0_24px_rgba(0,229,204,0.12)]'
                : 'border-border bg-surface/30 hover:border-qa-teal/25 hover:bg-qa-teal/[0.02]'
            }`}
          >
            {/* Character portrait placeholder */}
            <div className="relative w-full aspect-[3/4] bg-surface overflow-hidden">
              {/* Replace src with actual AI-generated portrait */}
              {c.image ? (
                <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-surface via-bg to-surface">
                  <span className="text-5xl mb-3">{c.emoji}</span>
                  <span className="font-mono text-[11px] text-text-dim tracking-[2px] uppercase">Portrait</span>
                </div>
              )}

              {/* Name overlay on image */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 pt-10">
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="font-display text-lg text-white leading-tight">{c.name}</h3>
                    <span className="font-mono text-[11px] tracking-[2px] uppercase text-qa-teal">{c.title}</span>
                  </div>
                  {characterId === c.id && (
                    <span className="text-qa-teal text-lg">✦</span>
                  )}
                </div>
              </div>

              {/* Selected overlay */}
              {characterId === c.id && (
                <div className="absolute inset-0 border-2 border-qa-teal pointer-events-none" />
              )}
            </div>

            {/* Info section */}
            <div className="p-4">
              <div className="font-mono text-[11px] text-text-secondary mb-2">
                🐉 {c.dragon}
              </div>

              <p className="text-sm text-text-body font-medium mb-2">{c.trait}</p>

              <p className="text-[13px] text-text-secondary leading-relaxed italic mb-3">
                «{c.match}»
              </p>

              <div className="pt-3 border-t border-border">
                <span className="font-mono text-[11px] text-text-secondary tracking-[2px] uppercase">Стиль обучения:</span>
                <p className="text-[13px] text-text-secondary mt-1">{c.style}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {characterId && (
        <div className="text-center mt-6 p-4 border border-qa-teal/20 bg-qa-teal/[0.03]">
          <p className="text-base text-qa-teal">
            ✦ {CHARACTERS.find(c => c.id === characterId)?.name}
          </p>
        </div>
      )}
    </PageShell>
  )
}
