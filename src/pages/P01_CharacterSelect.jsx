import { useWorkshopStore } from '../store/workshopStore'
import { CHARACTERS } from '../data/characters'
import PageShell from '../core/PageShell'

export default function P01_CharacterSelect() {
  const characterId = useWorkshopStore(s => s.user.characterId)
  const selectCharacter = useWorkshopStore(s => s.selectCharacter)

  return (
    <PageShell pageIndex={1}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CHARACTERS.map(c => {
          const isSelected = characterId === c.id

          return (
            <button
              key={c.id}
              onClick={() => selectCharacter(c.id === characterId ? null : c.id)}
              className={`group relative text-left overflow-hidden cursor-pointer transition-all duration-300 border ${
                isSelected
                  ? 'border-qa-teal ring-1 ring-qa-teal shadow-[0_0_30px_rgba(0,229,204,0.12)]'
                  : 'border-border hover:border-qa-teal/30'
              }`}
            >
              {/* Top: Photo + Gradient + Name */}
              <div className="relative h-48 sm:h-56 overflow-hidden">
                <img
                  src={c.image}
                  alt={c.name}
                  className={`w-full h-full object-cover transition-transform duration-500 ${c.imagePosition || 'object-top'} ${
                    isSelected ? 'scale-110' : 'group-hover:scale-[1.03]'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent" />

                {/* Selected badge */}
                {isSelected && (
                  <div className="absolute top-3 right-3 w-7 h-7 bg-qa-teal flex items-center justify-center">
                    <span className="text-black text-sm font-bold">✓</span>
                  </div>
                )}

                {/* Name overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-display text-xl text-white leading-tight">{c.name}</h3>
                  <div className="font-mono text-[11px] tracking-[3px] uppercase text-qa-teal mt-1">{c.title}</div>
                </div>
              </div>

              {/* Bottom: Full dossier */}
              <div className="p-4 bg-surface/50 space-y-3">
                {/* Dragon */}
                <div className="flex items-center gap-2">
                  <span className="text-sm">🐉</span>
                  <span className="font-mono text-[12px] text-text-secondary">{c.dragon}</span>
                </div>

                {/* Trait */}
                <p className="text-[14px] text-text-body font-medium leading-snug">{c.trait}</p>

                {/* Match quote */}
                <div className="p-3 bg-black/40 border-l-2 border-qa-teal/30">
                  <p className="text-[13px] text-text-secondary italic leading-relaxed">
                    «{c.match}»
                  </p>
                </div>

                {/* Learning style */}
                <div className="flex items-start gap-2">
                  <span className="font-mono text-[11px] text-qa-teal shrink-0 mt-0.5">Стиль:</span>
                  <span className="text-[13px] text-text-secondary">{c.style}</span>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {characterId && (
        <div className="text-center mt-5 p-3 border border-qa-teal/20 bg-qa-teal/[0.03]">
          <p className="text-base text-qa-teal">
            ✦ {CHARACTERS.find(c => c.id === characterId)?.name}
          </p>
        </div>
      )}
    </PageShell>
  )
}
