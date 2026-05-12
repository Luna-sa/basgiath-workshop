// Derive dragon appearance from Signet Ceremony answers.
//
// The participant never directly picks dragon traits. Their character
// archetype (chosen at Threshing), their voice archetype (chosen in
// Signet), and their text answers (tone, sigil, vow) decide everything.
//
// Returns the same shape as the deprecated bond-ritual-answers so the
// existing prompt-builder + sealDragon API keep working unchanged.

// ── Character → scale colour + breed material + size ──────────────
const CHARACTER_APPEARANCE = {
  violet: {
    scale: 'pearl-white scales with silver edge-shimmer, the colour of dawn over Basgiath stone',
    size: 'small',
  },
  xaden: {
    scale: 'midnight-black scales with deep blue undertones along the spine, like obsidian washed in ocean',
    size: 'large',
  },
  rhiannon: {
    scale: 'warm brown earth-tone scales with bronze edges, weathered like worked leather',
    size: 'mid',
  },
  ridoc: {
    scale: 'moss-green scales with darker mottling along the haunches, the colour of pine forest after rain',
    size: 'mid',
  },
  liam: {
    scale: 'ember-orange scales with deeper copper veining, the colour of sunset on snow',
    size: 'large',
  },
  imogen: {
    scale: 'crimson-red scales with rust-iron undertones, the colour of dried blood on steel',
    size: 'small',
  },
  // Fallback for 'self' or unknown
  default: {
    scale: 'storm-grey scales with hints of bronze along the spine, weathered by long flight',
    size: 'mid',
  },
}

// ── Voice archetype → breath + wing shape ─────────────────────────
const ARCHETYPE_TO_BREATH = {
  mentor: 'mist',           // warm, patient, calming
  comrade: 'fire',          // direct, open, alive
  strategist: 'frost',      // cool, precise
  'forge-master': 'fire',   // productive heat
  bard: 'sound',            // vivid, voiced
  sentry: 'shadow',         // vigilant, protective
  'co-conspirator': 'lightning', // sharp, subversive
  custom: 'fire',
}

const ARCHETYPE_TO_WINGS = {
  mentor: 'membranous',         // expressive, organic
  comrade: 'serrated',          // battle-worn, used
  strategist: 'feathered',      // precise, layered
  'forge-master': 'serrated',   // hammered look
  bard: 'membranous',           // theatrical, dramatic
  sentry: 'feathered',          // dense, defensive
  'co-conspirator': 'membranous', // sleek
  custom: 'membranous',
}

// ── Tone preference → eye colour ──────────────────────────────────
const TONE_TO_EYES = [
  { match: /(blunt|mat freely|mat ok)/i,         eyes: 'ember' },
  { match: /(no mat|dry humour|dry irony)/i,     eyes: 'silver' },
  { match: /(strict|professional)/i,             eyes: 'green' },
  { match: /(warm|patient|gentle)/i,             eyes: 'gold' },
  { match: /(serious|focused|sharp)/i,           eyes: 'amethyst' },
  { match: /(cool|calm|cold)/i,                  eyes: 'blue' },
]

function pickEyesFromTone(tone) {
  const t = String(tone || '').toLowerCase()
  for (const rule of TONE_TO_EYES) {
    if (rule.match.test(t)) return rule.eyes
  }
  return 'gold'  // default — warmth/curiosity
}

/**
 * Build a dragon-appearance object from the Signet answers + character.
 *
 * @param {object} params
 * @param {string} params.characterId  Empyrean character id (violet | xaden | …)
 * @param {string} params.archetype    Voice archetype id (mentor | comrade | …)
 * @param {object} params.answers      Signet answers: { name, work, vow,
 *                                     sigil, praise, disagreement, tone, ... }
 * @param {string} params.assistantName User-typed name for their Claude Code
 *                                     assistant. Becomes the dragon's name.
 *
 * @returns {object} Same shape as the deprecated bond-ritual-answers:
 *   { scale, breath, signet, size, wings, eyes, motto, name }
 */
export function deriveDragonAppearance({ characterId, archetype, answers = {}, assistantName }) {
  const appearance = CHARACTER_APPEARANCE[characterId] || CHARACTER_APPEARANCE.default
  const breath = ARCHETYPE_TO_BREATH[archetype] || 'fire'
  const wings = ARCHETYPE_TO_WINGS[archetype] || 'membranous'
  const eyes = pickEyesFromTone(answers.tone)

  // Sigil from Signet directly becomes the marking on the dragon's hide.
  // Vow becomes the motto (inferPoseFromMotto reads it as pose driver).
  const signet = (answers.sigil || '').trim()
    || 'a single etched rune marking across one flank, ancient and weathered'
  const motto = (answers.vow || '').trim()

  const name = (assistantName || '').trim() || 'Unnamed'

  return {
    scale: appearance.scale,
    size: appearance.size,
    breath,           // single value (legacy bond ritual used array; prompt-builder accepts both)
    wings,
    eyes,
    signet,
    motto,
    name,
  }
}
