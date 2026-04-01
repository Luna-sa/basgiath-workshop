import { useMemo } from 'react'
import { useWorkshopStore } from './workshopStore'
import { PERSONA } from '../data/characterPersona'

const DEFAULT_PERSONA = PERSONA.violet

function applyAccentCSS(p) {
  document.documentElement.style.setProperty('--char-accent', p.accent)
  document.documentElement.style.setProperty('--char-accent-light', p.accentLight)
  document.documentElement.style.setProperty('--char-accent-border', p.accentBorder)
}

export function usePersona() {
  const characterId = useWorkshopStore(s => s.user.characterId)

  const persona = useMemo(() => {
    const p = characterId ? PERSONA[characterId] : null
    const result = p || DEFAULT_PERSONA
    applyAccentCSS(result)
    return result
  }, [characterId])

  return persona
}

export function getRandomSuccess(persona) {
  const msgs = persona.voice.success
  return msgs[Math.floor(Math.random() * msgs.length)]
}
