/**
 * Hidden Dragons registry.
 *
 * Each entry = one tiny dragon (🐉 emoji) hidden somewhere on a slide.
 * PageShell renders matching dragons by narrativeKey via fixed-position
 * overlay. The coordinates below are picked so the dragon lands INSIDE
 * the slide content (between cards, inside code blocks, near tables) —
 * NOT in the predictable corners of the viewport.
 *
 * Content area in a typical 1400×900 viewport: x ≈ 220-1180, y ≈ 90-840.
 * Pick coords inside that box, varied per slide.
 *
 * Variants:
 *   - regular: +40 XP, opacity 0.45-0.55, size 22-26px
 *   - golden:  +500 XP, opacity 0.32, hidden on Champions slide
 */
export const HIDDEN_DRAGONS = [
  // ── Intro / setup
  { id: 'p01-parapet-corner', slideKey: 'character_select',
    position: { top: 480, left: 920 }, size: 24, opacity: 0.45, rotation: -12, variant: 'regular', xpReward: 40 },
  { id: 'p03-prework-glyph', slideKey: 'prework',
    position: { top: 440, right: 380 }, size: 22, opacity: 0.42, rotation: 8, variant: 'regular', xpReward: 40 },

  // ── Talk track
  { id: 'p04-talkintro-title', slideKey: 'talk_intro',
    position: { top: 460, left: 760 }, size: 24, opacity: 0.45, rotation: -8, variant: 'regular', xpReward: 40 },
  { id: 'p05-evolution-arrow', slideKey: 'talk_evolution',
    position: { top: 540, left: 340 }, size: 24, opacity: 0.48, rotation: 12, variant: 'regular', xpReward: 40 },
  { id: 'p06-install-corner', slideKey: 'install',
    position: { top: 600, left: 520 }, size: 22, opacity: 0.42, rotation: 0, variant: 'regular', xpReward: 40 },
  { id: 'p_modes-hotkey', slideKey: 'talk_modes',
    position: { top: 660, left: 380 }, size: 24, opacity: 0.45, rotation: -6, variant: 'regular', xpReward: 40 },
  { id: 'p07-eco-incantation', slideKey: 'talk_ecosystem',
    position: { top: 480, left: 780 }, size: 24, opacity: 0.48, rotation: 4, variant: 'regular', xpReward: 40 },
  { id: 'p07-eco-familiar', slideKey: 'talk_ecosystem',
    position: { top: 760, left: 420 }, size: 22, opacity: 0.40, rotation: -10, variant: 'regular', xpReward: 40 },
  { id: 'p_power-quote', slideKey: 'talk_power_moves',
    position: { top: 540, left: 700 }, size: 24, opacity: 0.45, rotation: 0, variant: 'regular', xpReward: 40 },

  // ── Persona / signet / bond
  { id: 'p_persona-frame', slideKey: 'persona_builder',
    position: { top: 720, right: 380 }, size: 22, opacity: 0.42, rotation: 8, variant: 'regular', xpReward: 40 },
  { id: 'p_signet-voice', slideKey: 'signet_ceremony',
    position: { top: 420, left: 620 }, size: 24, opacity: 0.48, rotation: -4, variant: 'regular', xpReward: 40 },
  { id: 'p_bond-fog', slideKey: 'bond_ritual',
    position: { top: 540, left: 360 }, size: 22, opacity: 0.40, rotation: 14, variant: 'regular', xpReward: 40 },

  // ── Aerie / gems
  { id: 'p_aerie-grid', slideKey: 'aerie',
    position: { top: 480, left: 720 }, size: 24, opacity: 0.45, rotation: -8, variant: 'regular', xpReward: 40 },
  { id: 'p_gems-toc', slideKey: 'hidden_gems',
    position: { top: 500, left: 340 }, size: 24, opacity: 0.48, rotation: 6, variant: 'regular', xpReward: 40 },
  { id: 'p_channels-icon', slideKey: 'gem_channels',
    position: { top: 540, left: 700 }, size: 22, opacity: 0.42, rotation: 0, variant: 'regular', xpReward: 40 },
  { id: 'p_mempalace-marble', slideKey: 'gem_mempalace',
    position: { top: 460, left: 800 }, size: 24, opacity: 0.45, rotation: -12, variant: 'regular', xpReward: 40 },
  { id: 'p_pixel-cluster', slideKey: 'gem_pixel_agents',
    position: { top: 600, left: 380 }, size: 22, opacity: 0.40, rotation: 8, variant: 'regular', xpReward: 40 },
  { id: 'p_quinn-orb', slideKey: 'gem_quinn_jinx',
    position: { top: 520, left: 760 }, size: 24, opacity: 0.48, rotation: 4, variant: 'regular', xpReward: 40 },
  { id: 'p_suzu-glyph', slideKey: 'gem_suzu_mcp',
    position: { top: 540, left: 360 }, size: 22, opacity: 0.42, rotation: -6, variant: 'regular', xpReward: 40 },
  { id: 'p_toolsearch-loop', slideKey: 'gem_tool_search',
    position: { top: 580, left: 780 }, size: 24, opacity: 0.45, rotation: 10, variant: 'regular', xpReward: 40 },

  // ── Arena
  { id: 'p_arenaintro-api', slideKey: 'arena',
    position: { top: 620, left: 740 }, size: 24, opacity: 0.48, rotation: -4, variant: 'regular', xpReward: 40 },

  // ── Final — Golden Wyrmling on Champions slide
  { id: 'golden-wyrmling', slideKey: 'champions',
    position: { top: 640, left: 540 }, size: 22, opacity: 0.32, rotation: 0, variant: 'golden', xpReward: 500 },
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
