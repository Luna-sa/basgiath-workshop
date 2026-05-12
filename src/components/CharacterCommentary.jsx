import { useState } from 'react'
import { motion } from 'motion/react'
import { useWorkshopStore } from '../store/workshopStore'
import { useLocale } from '../i18n/store'
import { CHARACTERS, pickCharacter } from '../data/characters'
import { getCharacterComment } from '../data/character-comments'

/**
 * Persona whisper - floating bottom-right card with the chosen
 * Empyrean character's voice on this slide.
 *
 * Visual: round photo avatar (from /characters/*.webp) with a
 * character-coloured border, persona name in mono caps, then the
 * whisper line in italic display. Fade-in on slide change, auto-
 * fade-out after 12s of inactivity (still readable on hover).
 *
 * Renders nothing when:
 *   - no character chosen
 *   - chosen character is 'self'
 *   - no commentary defined yet for this slide
 */

// Persona accent colours - kept in sync with arena dragon palette.
const CHAR_HEX = {
  violet:   '#9D6BFF',
  xaden:    '#FF8C2A',
  rhiannon: '#14B8C7',
  ridoc:    '#FF9E5E',
  liam:     '#10C98C',
  imogen:   '#E53E48',
}

export default function CharacterCommentary({ slideKey, position = 'inline' }) {
  const lang = useLocale(s => s.lang)
  const characterId = useWorkshopStore(s => s.user.characterId)
  // `dismissed` is keyed per (slideKey, characterId) so closing on one
  // slide doesn't silence the character on the next.
  const [dismissedKey, setDismissedKey] = useState('')
  const currentKey = `${slideKey}:${characterId}`
  const isDismissed = dismissedKey === currentKey

  if (!characterId || characterId === 'self') return null
  const characterRaw = CHARACTERS.find(c => c.id === characterId)
  if (!characterRaw) return null
  const character = pickCharacter(characterRaw, lang)
  if (!character) return null

  const line = getCharacterComment(slideKey, characterId, lang)
  if (!line) return null

  const color = CHAR_HEX[characterId] || '#00E5CC'
  const colorAlpha20 = color + '33'   // 20% alpha
  const colorAlpha08 = color + '14'   // 8% alpha
  // The whisper is written from the archetype's voice (Liam, Violet,
  // Ridoc...). Label it with their name so the participant immediately
  // sees who's talking — not with a generic "your dragon" or a stale
  // bond-ritual name that doesn't belong to the speaker.
  const speakerName = character.name

  if (position === 'inline') {
    return (
      <div
        className="border-l-2 pl-4 py-2 my-4 max-w-2xl"
        style={{ borderColor: colorAlpha20 }}
      >
        <div className="flex items-start gap-3">
          <Avatar character={character} color={color} />
          <div>
            <div className="font-mono text-[10px] tracking-[2px] uppercase mb-0.5" style={{ color }}>
              {speakerName}
            </div>
            <p className="font-display italic text-[15px] text-text-body leading-relaxed">
              {line}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // position === 'fixed' - floating top-left (top-right is ProgressBar/locale toggle)
  if (isDismissed) return null
  return (
    <motion.div
      key={currentKey}
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="fixed top-20 left-5 z-40 max-w-[300px] backdrop-blur-md"
      style={{
        background: `linear-gradient(135deg, ${colorAlpha08}, rgba(15,15,15,0.85))`,
        border: `1px solid ${colorAlpha20}`,
        boxShadow: `0 0 24px ${color}22`,
        padding: '12px 14px',
      }}
    >
      <button
        onClick={() => setDismissedKey(currentKey)}
        className="absolute top-1 right-1.5 w-5 h-5 flex items-center justify-center text-text-dim hover:text-white text-[11px] font-mono opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
        aria-label="dismiss"
      >
        ✕
      </button>
      <div className="flex items-start gap-3">
        <Avatar character={character} color={color} />
        <div className="flex-1 pr-3">
          <div className="font-mono text-[10px] tracking-[2.5px] uppercase mb-1" style={{ color }}>
            {speakerName}
          </div>
          <p className="font-display italic text-[13.5px] leading-relaxed text-text-body">
            {line}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

function Avatar({ character, color }) {
  if (character.image) {
    return (
      <div
        className="w-12 h-12 rounded-full overflow-hidden shrink-0"
        style={{
          border: `2px solid ${color}`,
          boxShadow: `0 0 12px ${color}55`,
        }}
      >
        <img
          src={character.image}
          alt={character.name}
          className={`w-full h-full object-cover ${character.imagePosition || ''}`}
        />
      </div>
    )
  }
  return (
    <div
      className="w-12 h-12 rounded-full flex items-center justify-center text-[20px] shrink-0"
      style={{
        border: `2px solid ${color}`,
        backgroundColor: color + '12',
      }}
    >
      {character.emoji || '✦'}
    </div>
  )
}
