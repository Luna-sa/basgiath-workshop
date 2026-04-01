import { useWorkshopStore } from '../store/workshopStore'
import { CHARACTERS } from '../data/characters'
import PageShell from '../core/PageShell'

export default function P01_CharacterSelect() {
  const characterId = useWorkshopStore(s => s.user.characterId)
  const selectCharacter = useWorkshopStore(s => s.selectCharacter)

  return (
    <PageShell pageIndex={1}>
      {/* Lore context */}
      <div className="mb-5 p-4 border border-border bg-surface/30 text-[13px] text-text-secondary leading-relaxed">
        <p className="mb-2">
          В книге <strong className="text-white">«Четвёртое Крыло»</strong> кадеты делятся на крылья и отряды. У каждого свой характер, свой дракон и свой способ выживать.
          <strong className="text-white"> Вайолет</strong> — маленькая, хрупкая, но умнее всех в комнате.
          <strong className="text-white"> Ксаден</strong> — сын врага, которому никто не доверяет, но все подчиняются.
          <strong className="text-white"> Рианнон</strong> — та, к кому бежит весь отряд когда всё ломается.
        </p>
        <p className="text-text-dim italic text-[12px]">
          Не читал(а) книгу? Не страшно — выбирай по стилю. А потом, может, и прочитаешь.
        </p>
      </div>

      {/* Character grid — 2 columns, photo dominant */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {CHARACTERS.map(c => {
          const isSelected = characterId === c.id

          return (
            <button
              key={c.id}
              onClick={() => selectCharacter(c.id === characterId ? null : c.id)}
              className={`group relative text-left overflow-hidden cursor-pointer transition-all duration-300 border flex flex-col ${
                isSelected
                  ? 'border-qa-teal ring-1 ring-qa-teal shadow-[0_0_24px_rgba(0,229,204,0.12)]'
                  : 'border-border hover:border-qa-teal/30'
              }`}
            >
              {/* Portrait — large, clean, minimal overlay */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={c.image}
                  alt={c.name}
                  className={`w-full h-full object-cover transition-transform duration-500 ${c.imagePosition || 'object-top'} ${
                    isSelected ? 'scale-105' : 'group-hover:scale-[1.02]'
                  }`}
                />

                {/* Thin gradient — only at very bottom for name, keeps face visible */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/90 to-transparent" />

                {/* Selected checkmark */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-qa-teal flex items-center justify-center">
                    <span className="text-black text-xs font-bold">✓</span>
                  </div>
                )}

                {/* Name — small, at the very bottom */}
                <div className="absolute bottom-0 left-0 right-0 px-3 pb-2">
                  <h3 className="font-display text-sm sm:text-base text-white leading-tight truncate">{c.name}</h3>
                  <div className="font-mono text-[10px] tracking-[2px] uppercase text-qa-teal">{c.title}</div>
                </div>
              </div>

              {/* Compact info — only trait + match */}
              <div className="p-3 bg-surface/50 flex-1 space-y-2">
                <p className="text-[13px] text-text-body font-medium leading-snug">{c.trait}</p>
                <p className="text-[11px] text-text-dim italic leading-relaxed">«{c.match}»</p>
              </div>
            </button>
          )
        })}
      </div>

      {characterId && (
        <div className="text-center mt-4 p-3 border border-qa-teal/20 bg-qa-teal/[0.03]">
          <p className="text-sm text-qa-teal">
            ✦ {CHARACTERS.find(c => c.id === characterId)?.name}
          </p>
        </div>
      )}
    </PageShell>
  )
}
