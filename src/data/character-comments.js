// Character commentary — per-slide whispers from the chosen Empyrean
// archetype. Populated by the agent currently running the character
// red-thread design (DESIGN_2026-05-12_character_red_thread.md).
//
// Shape (when populated):
//   COMMENTS = {
//     [narrativeKey]: {
//       violet: { ru, uk, en },
//       xaden:  { ru, uk, en },
//       rhiannon: { ... },
//       ridoc:    { ... },
//       liam:     { ... },
//       imogen:   { ... },
//       // 'self' has no commentary — they ARE the protagonist
//     }
//   }
//
// Used by <CharacterCommentary slideKey="..." /> which reads
// store.user.characterId and emits the right line in the current
// locale. Returns null gracefully when:
//   - no slide entry yet (agent hasn't filled this one)
//   - character is 'self' or null
//   - chosen character has no line for this slide

export const CHARACTER_COMMENTS = {
  // ── Populated by Agent B once it returns ───────────────────────
  // landing: { violet: { ru: '...', uk: '...', en: '...' }, ... },
  // talk_intro: { ... },
  // talk_evolution: { ... },
  // ... etc.
}

/**
 * Resolve the commentary line for a slide + character + locale.
 * Returns string or null if no commentary is defined for this
 * combination. Safe to call without guards.
 */
export function getCharacterComment(slideKey, characterId, lang = 'ru') {
  if (!slideKey || !characterId || characterId === 'self') return null
  const slide = CHARACTER_COMMENTS[slideKey]
  if (!slide) return null
  const character = slide[characterId]
  if (!character) return null
  return character[lang] || character.ru || character.en || null
}
