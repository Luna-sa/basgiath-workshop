/**
 * Hidden Dragons registry.
 *
 * Each entry = one dragon clickable on one slide. PageShell renders
 * the dragon(s) matching its narrativeKey automatically — no slide
 * file needs to know about us.
 *
 * Variants:
 *   - regular: +40 XP, opacity ~0.18, sizes 16-22px
 *   - golden:  +500 XP, opacity ~0.08, only on Champions slide
 *
 * `position` is viewport-relative (fixed positioning). Use one of
 * top/bottom + left/right. Pick non-obvious spots: corners, between
 * controls, inside decorative glyphs, under header dividers.
 */
export const HIDDEN_DRAGONS = [
  // ── Intro / setup
  { id: 'p01-parapet-corner', slideKey: 'character_select',
    position: { top: 120, right: 56 }, size: 18, opacity: 0.18, rotation: -12, variant: 'regular', xpReward: 40 },
  { id: 'p03-prework-glyph', slideKey: 'prework',
    position: { bottom: 140, left: 80 }, size: 16, opacity: 0.15, rotation: 8, variant: 'regular', xpReward: 40 },

  // ── Talk track
  { id: 'p04-talkintro-title', slideKey: 'talk_intro',
    position: { top: 100, left: 60 }, size: 18, opacity: 0.16, rotation: -8, variant: 'regular', xpReward: 40 },
  { id: 'p05-evolution-arrow', slideKey: 'talk_evolution',
    position: { top: 200, right: 100 }, size: 18, opacity: 0.18, rotation: 12, variant: 'regular', xpReward: 40 },
  { id: 'p06-install-corner', slideKey: 'install',
    position: { bottom: 200, right: 90 }, size: 16, opacity: 0.15, rotation: 0, variant: 'regular', xpReward: 40 },
  { id: 'p_modes-hotkey', slideKey: 'talk_modes',
    position: { top: 240, left: 50 }, size: 18, opacity: 0.16, rotation: -6, variant: 'regular', xpReward: 40 },
  { id: 'p07-eco-incantation', slideKey: 'talk_ecosystem',
    position: { top: 160, right: 70 }, size: 18, opacity: 0.18, rotation: 4, variant: 'regular', xpReward: 40 },
  { id: 'p07-eco-familiar', slideKey: 'talk_ecosystem',
    position: { bottom: 180, left: 100 }, size: 16, opacity: 0.14, rotation: -10, variant: 'regular', xpReward: 40 },
  { id: 'p_power-quote', slideKey: 'talk_power_moves',
    position: { top: 180, left: 80 }, size: 18, opacity: 0.17, rotation: 0, variant: 'regular', xpReward: 40 },

  // ── Persona / signet / bond
  { id: 'p_persona-frame', slideKey: 'persona_builder',
    position: { bottom: 160, right: 120 }, size: 16, opacity: 0.16, rotation: 8, variant: 'regular', xpReward: 40 },
  { id: 'p_signet-voice', slideKey: 'signet_ceremony',
    position: { top: 220, right: 80 }, size: 18, opacity: 0.18, rotation: -4, variant: 'regular', xpReward: 40 },
  { id: 'p_bond-fog', slideKey: 'bond_ritual',
    position: { top: 140, left: 90 }, size: 16, opacity: 0.13, rotation: 14, variant: 'regular', xpReward: 40 },

  // ── Aerie / gems
  { id: 'p_aerie-grid', slideKey: 'aerie',
    position: { bottom: 200, right: 100 }, size: 18, opacity: 0.16, rotation: -8, variant: 'regular', xpReward: 40 },
  { id: 'p_gems-toc', slideKey: 'hidden_gems',
    position: { top: 180, right: 80 }, size: 18, opacity: 0.18, rotation: 6, variant: 'regular', xpReward: 40 },
  { id: 'p_channels-icon', slideKey: 'gem_channels',
    position: { bottom: 180, left: 60 }, size: 16, opacity: 0.15, rotation: 0, variant: 'regular', xpReward: 40 },
  { id: 'p_mempalace-marble', slideKey: 'gem_mempalace',
    position: { top: 210, left: 100 }, size: 18, opacity: 0.17, rotation: -12, variant: 'regular', xpReward: 40 },
  { id: 'p_pixel-cluster', slideKey: 'gem_pixel_agents',
    position: { bottom: 160, right: 80 }, size: 16, opacity: 0.14, rotation: 8, variant: 'regular', xpReward: 40 },
  { id: 'p_quinn-orb', slideKey: 'gem_quinn_jinx',
    position: { top: 150, left: 70 }, size: 18, opacity: 0.18, rotation: 4, variant: 'regular', xpReward: 40 },
  { id: 'p_suzu-glyph', slideKey: 'gem_suzu_mcp',
    position: { bottom: 200, right: 110 }, size: 16, opacity: 0.15, rotation: -6, variant: 'regular', xpReward: 40 },
  { id: 'p_toolsearch-loop', slideKey: 'gem_tool_search',
    position: { top: 240, right: 90 }, size: 18, opacity: 0.16, rotation: 10, variant: 'regular', xpReward: 40 },

  // ── Arena
  { id: 'p_arenaintro-api', slideKey: 'arena',
    position: { top: 200, right: 60 }, size: 18, opacity: 0.17, rotation: -4, variant: 'regular', xpReward: 40 },

  // ── Final — Golden Wyrmling on Champions slide (Phase H wires it)
  { id: 'golden-wyrmling', slideKey: 'champions',
    position: { bottom: 280, right: 240 }, size: 14, opacity: 0.08, rotation: 0, variant: 'golden', xpReward: 500 },
]

export const TOTAL_DRAGONS = HIDDEN_DRAGONS.length

export function findDragonById(id) {
  return HIDDEN_DRAGONS.find(d => d.id === id) || null
}

export function findDragonsBySlide(slideKey) {
  return HIDDEN_DRAGONS.filter(d => d.slideKey === slideKey)
}

export function xpForDragon(id) {
  const d = findDragonById(id)
  return d ? d.xpReward : 0
}
