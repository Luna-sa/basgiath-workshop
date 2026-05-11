import { useWorkshopStore } from '../store/workshopStore'
import { CHARACTERS, pickCharacter } from '../data/characters'
import { useT } from '../i18n/useT'
import { useLocale } from '../i18n/store'
import PageShell from '../core/PageShell'

export default function P01_CharacterSelect() {
  const t = useT()
  const lang = useLocale(s => s.lang)
  const characterId = useWorkshopStore(s => s.user.characterId)
  const selectCharacter = useWorkshopStore(s => s.selectCharacter)

  return (
    <PageShell pageIndex={1}>
      {/* Lore context */}
      <div className="mb-5 p-4 border border-border bg-surface/30 text-[13px] text-text-secondary leading-relaxed">
        <p className="mb-2">
          {t(
            <>In <strong className="text-white">Fourth Wing</strong>, cadets are split into wings and squads.
              <strong className="text-white"> Violet</strong> — fragile, dismissed by everyone, until she became one of the strongest.
              <strong className="text-white"> Xaden</strong> — son of an executed rebel; nobody trusts him but everyone obeys.
              <strong className="text-white"> Rhiannon</strong> — the one people run to when everything goes sideways.</>,
            <>В <strong className="text-white">«Четвёртом Крыле»</strong> кадеты разбиты на крылья и отряды.
              <strong className="text-white"> Вайолет</strong> — хрупкая, её никто не воспринимал всерьёз, пока она не стала одной из сильнейших.
              <strong className="text-white"> Ксаден</strong> — сын казнённого мятежника; ему не доверяют, но подчиняются.
              <strong className="text-white"> Рианнон</strong> — к ней бегут, когда всё летит к чертям.</>,
            <>У <strong className="text-white">«Четвертому Крилі»</strong> кадетів розбито на крила і загони.
              <strong className="text-white"> Вайолет</strong> — крихка, її ніхто не сприймав усерйоз, доки вона не стала однією з найсильніших.
              <strong className="text-white"> Ксаден</strong> — син страченого бунтівника; йому не довіряють, але йому підкоряються.
              <strong className="text-white"> Ріаннон</strong> — до неї біжать, коли все летить шкереберть.</>
          )}
        </p>
        <p className="text-text-dim italic text-[12px]">
          {t(
            'Haven\'t read it? Pick by the style description. You can read it later.',
            'Не читал(а)? Выбирай по описанию стиля. А потом, может, и прочитаешь.',
            'Не читав(ла)? Обирай за описом стилю. А потім, може, і прочитаєш.'
          )}
        </p>
      </div>

      {/* Character grid — 2 columns, photo dominant */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {CHARACTERS.map(raw => {
          const c = pickCharacter(raw, lang)
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
              <div className="relative aspect-[3/4] overflow-hidden bg-bg">
                {c.image ? (
                  <img
                    src={c.image}
                    alt={c.name}
                    className={`w-full h-full object-cover transition-transform duration-500 ${c.imagePosition || 'object-top'} ${
                      isSelected ? 'scale-105' : 'group-hover:scale-[1.02]'
                    }`}
                  />
                ) : (
                  // 'Это я' option — no portrait, big glyph instead
                  <div className="w-full h-full flex items-center justify-center text-[80px] text-qa-teal/70 bg-gradient-to-br from-surface to-bg">
                    {c.emoji}
                  </div>
                )}

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
            ✦ {pickCharacter(CHARACTERS.find(c => c.id === characterId), lang)?.name}
          </p>
        </div>
      )}
    </PageShell>
  )
}
