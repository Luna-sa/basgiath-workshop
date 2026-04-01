import { useState } from 'react'
import { useWorkshopStore } from '../store/workshopStore'
import { CHARACTERS } from '../data/characters'
import PageShell from '../core/PageShell'

export default function P01_CharacterSelect() {
  const characterId = useWorkshopStore(s => s.user.characterId)
  const selectCharacter = useWorkshopStore(s => s.selectCharacter)
  const [expanded, setExpanded] = useState(null)

  const handleClick = (id) => {
    selectCharacter(id === characterId ? null : id)
    setExpanded(id === expanded ? null : id)
  }

  return (
    <PageShell pageIndex={1}>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {CHARACTERS.map(c => {
          const isSelected = characterId === c.id
          const isExpanded = expanded === c.id

          return (
            <div key={c.id} className="flex flex-col">
              {/* Portrait card */}
              <button
                onClick={() => handleClick(c.id)}
                className={`relative overflow-hidden cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? 'ring-2 ring-qa-teal shadow-[0_0_24px_rgba(0,229,204,0.15)]'
                    : 'hover:ring-1 hover:ring-qa-teal/30'
                }`}
              >
                {/* Photo */}
                <div className="relative aspect-[3/4]">
                  <img
                    src={c.image}
                    alt={c.name}
                    className="w-full h-full object-cover object-top"
                  />

                  {/* Dark gradient overlay at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                  {/* Selected checkmark */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-7 h-7 bg-qa-teal flex items-center justify-center">
                      <span className="text-black text-sm font-bold">✓</span>
                    </div>
                  )}

                  {/* Name + title overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="font-display text-base sm:text-lg text-white leading-tight">{c.name}</h3>
                    <div className="font-mono text-[11px] tracking-[2px] uppercase text-qa-teal mt-0.5">{c.title}</div>
                  </div>
                </div>
              </button>

              {/* Expanded info — shows below the card */}
              {isExpanded && (
                <div className="p-3 border border-t-0 border-qa-teal/20 bg-qa-teal/[0.03] text-sm space-y-2">
                  <div className="font-mono text-[11px] text-text-secondary">
                    🐉 {c.dragon}
                  </div>
                  <p className="text-text-body text-[13px] font-medium">{c.trait}</p>
                  <p className="text-text-secondary text-[12px] italic leading-relaxed">
                    «{c.match}»
                  </p>
                  <div className="pt-2 border-t border-border">
                    <span className="font-mono text-[10px] text-text-dim tracking-[2px] uppercase">Стиль:</span>
                    <p className="text-[12px] text-text-secondary mt-0.5">{c.style}</p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {characterId && (
        <div className="text-center mt-5 p-3 border border-qa-teal/20 bg-qa-teal/[0.03]">
          <p className="text-sm text-qa-teal">
            ✦ {CHARACTERS.find(c => c.id === characterId)?.name}
          </p>
        </div>
      )}
    </PageShell>
  )
}
