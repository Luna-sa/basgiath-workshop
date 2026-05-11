import { useWorkshopStore } from '../store/workshopStore'
import { useLocale } from '../i18n/store'
import { CHARACTERS, pickCharacter } from '../data/characters'
import { getCharacterComment } from '../data/character-comments'

/**
 * Small overlay that whispers a comment from the chosen Empyrean
 * character in their voice. Sits unobtrusively next to slide content
 * so participants feel their archetype companion throughout the
 * workshop, not just on the persona slides.
 *
 * Usage on a slide:
 *
 *   <CharacterCommentary slideKey="talk_intro" />
 *
 * Renders nothing when:
 *   - no character chosen
 *   - chosen character is 'self'
 *   - no commentary defined yet for this slide
 *
 * Visual: italic display font, persona accent colour, small avatar
 * dot, max-width so it doesn't fight the main content.
 */
export default function CharacterCommentary({ slideKey, position = 'inline' }) {
  const lang = useLocale(s => s.lang)
  const characterId = useWorkshopStore(s => s.user.characterId)
  if (!characterId || characterId === 'self') return null

  const character = pickCharacter(CHARACTERS.find(c => c.id === characterId), lang)
  if (!character) return null

  const line = getCharacterComment(slideKey, characterId, lang)
  if (!line) return null

  const avatarSrc = character.image
  const accent = '#00E5CC' // persona.accent could be pulled later via usePersona

  const inlineClass = position === 'inline'
    ? 'border-l-2 pl-4 py-2 my-4 max-w-2xl'
    : 'fixed bottom-6 right-6 z-30 max-w-sm border bg-bg/90 backdrop-blur p-4 shadow-[0_0_30px_rgba(0,229,204,0.18)]'

  return (
    <div
      className={inlineClass}
      style={{ borderColor: accent + '60' }}
    >
      <div className="flex items-start gap-3">
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt={character.name}
            className="w-9 h-9 rounded-full object-cover border shrink-0"
            style={{ borderColor: accent + '60' }}
          />
        ) : (
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-[16px] shrink-0 border"
            style={{ borderColor: accent + '60' }}
          >
            {character.emoji || '✦'}
          </div>
        )}
        <div>
          <div className="font-mono text-[10px] tracking-[2px] uppercase mb-0.5" style={{ color: accent }}>
            {character.name.split(' ')[0]}
          </div>
          <p className="font-display italic text-[15px] text-text-body leading-relaxed">
            {line}
          </p>
        </div>
      </div>
    </div>
  )
}
