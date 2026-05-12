/**
 * Hidden Dragons registry.
 *
 * Each entry = one tiny dragon (silhouette PNG) hidden somewhere on a
 * slide. PageShell renders matching dragons by narrativeKey via an
 * absolute overlay INSIDE the content frame (so they scroll with the
 * content rather than sticking to the viewport).
 *
 * Coords are relative to the 960px-wide content frame. Picked to land
 * in margins, gaps between cards, and decorative whitespace — not the
 * predictable corners of the viewport.
 *
 * Audit notes (2026-05-12):
 *   - Every main-flow slide now has at least one dragon (was missing
 *     on landing / registration / leaderboard / graduation / resources)
 *   - Opacity bumped from 0.32-0.48 to 0.55-0.68 so silhouettes read
 *     against dark card backgrounds
 *   - Sizes bumped from 22-24px to 28-32px for visibility
 *   - p_pixel-cluster removed (Pixel Agents gem deleted from flow)
 *
 * Variants:
 *   - regular: +40 XP, opacity 0.55-0.68, size 28-32px
 *   - golden:  +500 XP, opacity 0.50, hidden on Champions slide
 */
export const HIDDEN_DRAGONS = [
  // ── Pre-workshop / setup
  { id: 'p00-landing-mist', slideKey: 'landing',
    position: { top: 540, left: 760 }, size: 30, opacity: 0.60, rotation: -10, variant: 'regular', xpReward: 40 },
  { id: 'p01-parapet-corner', slideKey: 'character_select',
    position: { top: 480, left: 880 }, size: 30, opacity: 0.62, rotation: -12, variant: 'regular', xpReward: 40 },
  { id: 'p02-registration-glyph', slideKey: 'registration',
    position: { top: 560, left: 60 }, size: 28, opacity: 0.58, rotation: 10, variant: 'regular', xpReward: 40 },
  { id: 'p03-prework-glyph', slideKey: 'prework',
    position: { top: 440, left: 700 }, size: 28, opacity: 0.58, rotation: 8, variant: 'regular', xpReward: 40 },

  // ── Talk track
  { id: 'p04-talkintro-title', slideKey: 'talk_intro',
    position: { top: 380, left: 820 }, size: 30, opacity: 0.62, rotation: -8, variant: 'regular', xpReward: 40 },
  { id: 'p05-evolution-arrow', slideKey: 'talk_evolution',
    position: { top: 540, left: 60 }, size: 30, opacity: 0.65, rotation: 12, variant: 'regular', xpReward: 40 },
  { id: 'p06-install-corner', slideKey: 'install',
    position: { top: 600, left: 840 }, size: 28, opacity: 0.60, rotation: 0, variant: 'regular', xpReward: 40 },
  { id: 'p_modes-hotkey', slideKey: 'talk_modes',
    position: { top: 660, left: 80 }, size: 30, opacity: 0.62, rotation: -6, variant: 'regular', xpReward: 40 },
  { id: 'p07-eco-incantation', slideKey: 'talk_ecosystem',
    position: { top: 380, left: 860 }, size: 30, opacity: 0.65, rotation: 4, variant: 'regular', xpReward: 40 },
  { id: 'p07-eco-familiar', slideKey: 'talk_ecosystem',
    position: { top: 760, left: 120 }, size: 28, opacity: 0.58, rotation: -10, variant: 'regular', xpReward: 40 },
  { id: 'p_power-quote', slideKey: 'talk_power_moves',
    position: { top: 540, left: 880 }, size: 30, opacity: 0.62, rotation: 0, variant: 'regular', xpReward: 40 },

  // ── Persona / signet / bond
  { id: 'p_persona-frame', slideKey: 'persona_builder',
    position: { top: 720, left: 60 }, size: 28, opacity: 0.58, rotation: 8, variant: 'regular', xpReward: 40 },
  { id: 'p_signet-voice', slideKey: 'signet_ceremony',
    position: { top: 420, left: 820 }, size: 30, opacity: 0.65, rotation: -4, variant: 'regular', xpReward: 40 },
  { id: 'p_bond-fog', slideKey: 'bond_ritual',
    position: { top: 540, left: 60 }, size: 28, opacity: 0.55, rotation: 14, variant: 'regular', xpReward: 40 },

  // ── Hidden Gems block
  { id: 'p_gems-toc', slideKey: 'hidden_gems',
    position: { top: 500, left: 60 }, size: 30, opacity: 0.65, rotation: 6, variant: 'regular', xpReward: 40 },
  { id: 'p_mempalace-marble', slideKey: 'gem_mempalace',
    position: { top: 380, left: 880 }, size: 30, opacity: 0.62, rotation: -12, variant: 'regular', xpReward: 40 },
  { id: 'p_suzu-glyph', slideKey: 'gem_suzu_mcp',
    position: { top: 540, left: 60 }, size: 28, opacity: 0.58, rotation: -6, variant: 'regular', xpReward: 40 },
  { id: 'p_toolsearch-loop', slideKey: 'gem_tool_search',
    position: { top: 580, left: 860 }, size: 30, opacity: 0.62, rotation: 10, variant: 'regular', xpReward: 40 },
  { id: 'p_quinn-orb', slideKey: 'gem_quinn_jinx',
    position: { top: 520, left: 80 }, size: 30, opacity: 0.65, rotation: 4, variant: 'regular', xpReward: 40 },
  { id: 'p_channels-icon', slideKey: 'gem_channels',
    position: { top: 540, left: 860 }, size: 28, opacity: 0.58, rotation: 0, variant: 'regular', xpReward: 40 },

  // ── Bonus gem categories
  { id: 'p_design-skills-corner', slideKey: 'gem_design_skills',
    position: { top: 620, left: 880 }, size: 30, opacity: 0.62, rotation: -8, variant: 'regular', xpReward: 40 },
  { id: 'p_browser-trio-icon', slideKey: 'gem_browser_automation',
    position: { top: 540, left: 60 }, size: 28, opacity: 0.58, rotation: 12, variant: 'regular', xpReward: 40 },
  { id: 'p_smart-helpers-glow', slideKey: 'gem_smart_helpers',
    position: { top: 700, left: 860 }, size: 30, opacity: 0.62, rotation: 6, variant: 'regular', xpReward: 40 },
  { id: 'p_marketplace-forge', slideKey: 'gem_skills_marketplace',
    position: { top: 580, left: 80 }, size: 28, opacity: 0.58, rotation: -4, variant: 'regular', xpReward: 40 },

  // ── Aerie / Arena / Finale
  { id: 'p_aerie-grid', slideKey: 'aerie',
    position: { top: 480, left: 860 }, size: 30, opacity: 0.62, rotation: -8, variant: 'regular', xpReward: 40 },
  { id: 'p_arenaintro-api', slideKey: 'arena',
    position: { top: 620, left: 80 }, size: 30, opacity: 0.65, rotation: -4, variant: 'regular', xpReward: 40 },
  { id: 'p_leaderboard-pedestal', slideKey: 'leaderboard',
    position: { top: 460, left: 880 }, size: 28, opacity: 0.55, rotation: 4, variant: 'regular', xpReward: 40 },
  { id: 'p_graduation-ribbon', slideKey: 'graduation',
    position: { top: 540, left: 60 }, size: 30, opacity: 0.60, rotation: -10, variant: 'regular', xpReward: 40 },
  { id: 'p_resources-stack', slideKey: 'resources',
    position: { top: 640, left: 860 }, size: 28, opacity: 0.58, rotation: 8, variant: 'regular', xpReward: 40 },

  // ── Final — Golden Wyrmling on Champions slide
  { id: 'golden-wyrmling', slideKey: 'champions',
    position: { top: 640, left: 540 }, size: 32, opacity: 0.50, rotation: 0, variant: 'golden', xpReward: 500 },
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
