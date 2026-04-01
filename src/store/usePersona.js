import { useMemo } from 'react'
import { useWorkshopStore } from './workshopStore'
import { PERSONA } from '../data/characterPersona'

const DEFAULT_PERSONA = PERSONA.violet

/**
 * Hook that returns the current character's personalization config.
 * Updates CSS accent variables when character changes.
 */
export function usePersona() {
  const characterId = useWorkshopStore(s => s.user.characterId)

  const persona = useMemo(() => {
    const p = characterId ? PERSONA[characterId] : null
    if (p) {
      // Set CSS accent variables globally
      document.documentElement.style.setProperty('--char-accent', p.accent)
      document.documentElement.style.setProperty('--char-accent-light', p.accentLight)
      document.documentElement.style.setProperty('--char-accent-border', p.accentBorder)
    }
    return p || DEFAULT_PERSONA
  }, [characterId])

  return persona
}

/**
 * Get a random success message for the current character.
 */
export function getRandomSuccess(persona) {
  const msgs = persona.voice.success
  return msgs[Math.floor(Math.random() * msgs.length)]
}
