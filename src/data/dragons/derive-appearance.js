// Derive dragon appearance from the chosen Threshing character.
//
// The dragon is 100% character-locked — every Empyrean archetype has
// a canon dragon profile drawn from Fourth Wing lore. The participant
// doesn't directly type dragon traits; their CHARACTER pick decides
// everything visual.
//
// The free-form text they enter during the Signet Ceremony (vow,
// sigil, tone, etc.) drives the CLAUDE.md output — NOT the image.
// That separation keeps image generation deterministic and on-aesthetic,
// while the working-voice CLAUDE.md still feels deeply personalised.

// ── Visual vocabulary ────────────────────────────────────────────
const BREATH = {
  fire:      'jets of golden-orange flame curling around its jaws, embers drifting upward on heat currents, faint scorch marks on the lower jaw scales',
  lightning: 'crackling pale-blue lightning arcs spilling from between its teeth, the air around its head sharp with ozone shimmer',
  shadow:    'tendrils of true black mist coiling around its head, swallowing light, faint violet edges where the shadow touches air',
  sound:     'visible concentric sonic rings rippling the air around its open jaws, fine dust caught in the wave pattern',
  mist:      'cold silver vapor pouring from its nostrils, clinging to its scales like dew, breath made manifest in the cold',
  frost:     'crystalline ice rime forming on its lower jaw, frost-breath catching the side-light, frozen condensation along the throat',
}

const WINGS = {
  membranous: 'wide membranous wings stretched between long bone-finger struts, the membrane semi-translucent against backlight, fine veined patterns visible, edges scarred from battle',
  feathered:  "enormous feathered wings — extremely rare in Navarre, only the Gold Feathertail breed — primary feathers longer than a man, layered like an eagle's but oversized, the colour matching the dragon's hide",
  serrated:   'sail-like wings with deeply serrated trailing edges, leathery hide-membrane scarred and weathered, individual rip-tears visible from past combat',
}

const EYES = {
  gold:     'molten gold eyes with deep vertical slit pupils, the iris with fine internal fire-flecks',
  green:    'storm-green eyes the colour of lichen on wet stone, vertical slit pupils dilated',
  amethyst: 'deep amethyst eyes with violet-purple iris, vertical pupils contracted',
  silver:   'mercury-silver eyes, the iris catching ambient light like polished metal',
  ember:    'ember-red eyes burning from within like coal, faint heat-shimmer around the iris',
  blue:     'pale ice-blue eyes the colour of glacier water, vertical slit pupils, the iris with internal crystalline structure',
}

const SIZE = {
  small: 'lithe and compact, roughly the size of a destrier, built for speed and high-altitude turns — wings disproportionately large relative to body',
  mid:   "a warrior's build, the size of a small longhouse, dense with muscle along the shoulders and haunches",
  large: 'massive and ancient, the size of a galleon, scales weathered by centuries of war and weather, deep battle-scars across the chest plates',
}

// ── Character → canon dragon profile ─────────────────────────────
//
// Each profile references the visual vocabulary by key. The values
// resolve at derive time so the rest of the pipeline gets a fully-
// rendered visual block per field.
//
// All seven Empyrean archetypes plus a neutral "default" used for the
// "self" character (workshops where the participant didn't pick an
// in-lore identity).
const CHARACTER_DRAGON = {
  violet: {
    scale:  'pearl-white scales with silver edge-shimmer, the colour of dawn over Basgiath stone',
    breed:  'a Pale Swordtail-line dragon, extraordinarily rare colouration — pearl-and-bone scales with faint silver edge-shimmer, sword-shaped tail-tip',
    size:   'small',
    breath: 'lightning',
    wings:  'feathered',
    eyes:   'amethyst',
    signet: 'a single etched lightning-fork rune along the upper flank, ancient and weathered into the scale until almost part of the hide',
    pose:   'mid-flight against a wide storm-grey sky, wings catching dramatic backlight at full extension, head turned slightly toward the viewer, body in three-quarter perspective, wisps of cloud breaking around the wing membrane',
  },
  xaden: {
    scale:  'midnight-black scales with deep blue undertones along the spine, like obsidian washed in ocean',
    breed:  "a Blue Daggertail breed — deep midnight-blue scales with darker veining, bladed tail-tip, the breed of Sgaeyl, Xaden's bonded mount",
    size:   'large',
    breath: 'shadow',
    wings:  'serrated',
    eyes:   'amethyst',
    signet: 'a shadow-etched crescent over one shoulder — the marking flickers along the edge where light meets dark, the brand of an oath that cost everything to keep',
    pose:   'standing on a windswept Aerie ridge at the edge of the cloud-line, head lowered toward the viewer in three-quarter angle, gaze unblinking and watchful, wings folded tight against the body, tail wrapped around the perching stone',
  },
  rhiannon: {
    scale:  'warm brown earth-tone scales with bronze edges, weathered like worked leather',
    breed:  "a Brown Swordtail breed — warm earth-tone scales with bronze edges, sword-shaped flat blade tail-tip, Navarre's most common war-line",
    size:   'mid',
    breath: 'fire',
    wings:  'serrated',
    eyes:   'gold',
    signet: 'a hammered brand-mark on the shoulder — deep, irregular, the kind of stamp left by an old forge anvil, weathered into the scale',
    pose:   'wings half-spread protectively over the space below, body lowered into a crouch, head turned toward the viewer with eyes locked, the protective curve of the wings forming a sheltering arc',
  },
  ridoc: {
    scale:  'moss-green scales with darker mottling along the haunches, the colour of pine forest after rain',
    breed:  'a Green Clubtail breed — moss-and-pine scales with darker mottling along the spine, heavy blunted club-tail tip, mountain-line dragons',
    size:   'mid',
    breath: 'lightning',
    wings:  'membranous',
    eyes:   'silver',
    signet: 'thin angular slash marks across the chest plate — duel-scars the dragon never let heal, each one a story the rider can recite',
    pose:   'mid-flight against a wide storm-grey sky, wings catching dramatic backlight at full extension, head turned slightly toward the viewer with the suggestion of a smirk in the jaw line',
  },
  liam: {
    scale:  'ember-orange scales with deeper copper veining, the colour of sunset on snow',
    breed:  'an Orange Clubtail breed — sunset-orange scales with deeper copper veining, heavy blunted club-tail',
    size:   'large',
    breath: 'fire',
    wings:  'membranous',
    eyes:   'ember',
    signet: 'an ember-warmed brand on the lower jaw — coal-coloured but still carrying faint heat-glow where the metal once touched',
    pose:   'mid-roar on a storm-lit Navarre ridge — neck arched skyward, jaws parted, claws extended, wings flared wide and angled forward, caught at the edge of a downbeat with stone shards kicking up beneath the rear claws',
  },
  imogen: {
    scale:  'crimson-red scales with rust-iron undertones, the colour of dried blood on steel',
    breed:  'a Red Daggertail breed — angular bladed tail tip the shape of a heavy double-edged dagger, the most aggressive war-line of Navarre',
    size:   'small',
    breath: 'lightning',
    wings:  'membranous',
    eyes:   'ember',
    signet: 'a thin angular slash mark across the chest plate — sharp as the edge it remembers, the brand of an oath kept in blood',
    pose:   'mid-roar on a storm-lit ridge — neck arched skyward, jaws parted, claws extended, wings flared wide, caught at the edge of a downbeat',
  },
  // ── Neutral default for 'self' or unknown character ─────────────
  default: {
    scale:  'storm-grey scales with hints of bronze along the spine, weathered by long flight',
    breed:  'a battle-tested Navarrean war-dragon, breed-line uncertain, bladed or clubbed tail',
    size:   'mid',
    breath: 'fire',
    wings:  'membranous',
    eyes:   'gold',
    signet: 'a single ancient etched rune across one flank, weathered into the scale until almost part of the hide',
    pose:   'standing on a windswept Aerie ridge at the edge of the cloud-line, head lifted in three-quarter view, wings folded but ready, presence absolute and unmoving, the world muted around its scaled mass',
  },
}

/**
 * Build the fully-resolved dragon visual profile from the chosen
 * Empyrean character. The text fields from the Signet Ceremony
 * (vow, sigil, tone, etc.) are NOT consulted — they live in
 * CLAUDE.md, not in the image prompt.
 *
 * @param {object} params
 * @param {string} params.characterId  Empyrean character id (violet | xaden | rhiannon | ridoc | liam | imogen | self | ...)
 * @param {string} params.assistantName User-typed name for their dragon
 *
 * @returns {object} Fully-resolved visual profile — every field is a
 *   complete visual sentence ready to drop into the prompt.
 */
export function deriveDragonAppearance({ characterId, assistantName } = {}) {
  const profile = CHARACTER_DRAGON[characterId] || CHARACTER_DRAGON.default
  return {
    scale:  profile.scale,
    breed:  profile.breed,
    size:   SIZE[profile.size],
    breath: BREATH[profile.breath],
    wings:  WINGS[profile.wings],
    eyes:   EYES[profile.eyes],
    signet: profile.signet,
    pose:   profile.pose,
    name:   (assistantName || '').trim() || 'Unnamed',
  }
}
