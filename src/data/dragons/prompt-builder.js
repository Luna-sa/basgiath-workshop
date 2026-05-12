// Build the gpt-image-2 prompt from a fully-resolved dragon visual
// profile (produced by deriveDragonAppearance). The profile is
// character-locked — see derive-appearance.js for the canon map.
//
// This builder does ZERO inference and ZERO text scanning. It just
// stitches the profile fields into a cinematic prompt block and
// sprinkles in a small amount of randomised atmosphere/minor detail
// so two participants who picked the same character don't get
// pixel-identical dragons.
//
// Style anchors:
//   - Fourth Wing canon dragon breeds (Daggertail / Morningstartail / Clubtail / Swordtail / Feathertail)
//   - "Reign of Fire" weathered photoreal dragon look
//   - "House of the Dragon" Targaryen mount cinematography

// ── Randomised atmosphere ──────────────────────────────────────
// Scene/lighting variation that doesn't fight the character's
// canonical look. Picked once per generation.
const ATMOSPHERES = [
  'storm-lit dusk over a Navarre ridge, the sky bruised with cloud',
  'pre-dawn mist clinging to the perching stone, world the colour of cold iron',
  'lightning-shot night, the dragon silhouetted between flashes',
  'aerie-cold morning, sun barely broken over the horizon, breath visible in the air',
  'wind-driven snow grain crossing the frame, the dragon unbothered by it',
  'low-cloud afternoon, shafts of grey light cutting through gaps in the overcast',
  'late autumn rain in the high passes, mist beading on the scale ridges',
  'cinder-flecked twilight, ash drifting down from a fire long behind',
]

// ── Minor detail spice ──────────────────────────────────────────
// Small per-render touches that give individuality without breaking
// the canon look. Picked independently from the atmosphere.
const MINOR_DETAILS = [
  'a single loose feather or piece of ash drifting in the foreground',
  'fine grit and dust caught in the rim-light around the head',
  'a glint of moisture along the lower jaw catching the key light',
  'shallow rake-marks across the brow ridge, old and barely visible',
  'a thin trail of breath-vapor curling from one nostril',
  'small chips of weathered stone falling from beneath the rear claws',
  'a torn wing-membrane tip with the edge slightly translucent against the sky',
  'embedded notches along the leading wing-edge from past combat',
  'a single bright catch-light in the corner of the eye that anchors the gaze',
]

function pick(arr, seed) {
  // Deterministic pick when a seed is given (for testability), else
  // a fresh Math.random pick per call. The dragon-name is a natural
  // seed source so the same rider regenerating doesn't constantly
  // get a different mood (but two different riders WILL differ).
  if (typeof seed === 'string' && seed.length) {
    let h = 0
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
    return arr[h % arr.length]
  }
  return arr[Math.floor(Math.random() * arr.length)]
}

/**
 * Build the image prompt from a resolved dragon profile.
 *
 * @param {object} profile  Output of deriveDragonAppearance — every
 *   field is already a complete visual sentence. We DO NOT do any
 *   inference or text scanning here.
 *
 * @returns {string} ~2.3k-char prompt ready for gpt-image-2.
 */
export function buildDragonPrompt(profile = {}) {
  const {
    scale  = 'storm-grey scales with hints of bronze along the spine',
    breed  = 'a battle-tested Navarrean war-dragon',
    size   = "a warrior's build, the size of a small longhouse",
    breath = 'jets of golden-orange flame curling around its jaws',
    wings  = 'wide membranous wings stretched between long bone-finger struts',
    eyes   = 'molten gold eyes with deep vertical slit pupils',
    signet = 'a single ancient etched rune across one flank',
    pose   = 'standing on a windswept Aerie ridge, head lifted',
    name   = '',
  } = profile

  // Use the dragon's name as a stable seed so a rider regenerating
  // the same dragon stays in the same atmospheric register. Two
  // different riders with different names WILL get different moods.
  const atmosphere = pick(ATMOSPHERES, name + ':atm')
  const minorDetail = pick(MINOR_DETAILS, name + ':det')

  const parts = [
    `A cinematic film still from a dark-fantasy epic — "Fourth Wing", "House of the Dragon", "Reign of Fire" visual language. Photoreal practical-effects dragon. NOT illustrated, NOT painted, NOT anime, NOT D&D mini.`,
    ``,
    `Dragon: ${breed}. ${size}.`,
    ``,
    `Scale and hide: ${scale}. The dragon's chosen colour stays muted but clearly readable on lit planes (spine ridge, wing edge, jaw, haunch) — pigmented but desaturated. World around it is grainy charcoal-slate atmosphere; scales dissolve into haze at the edges, hue lives in the rim-light. Fourth Wing book-cover plate energy.`,
    ``,
    `Wings: ${wings}.`,
    `Eyes: ${eyes}. Iris hyper-detailed, pupil deep, world reflected in the corneal curve.`,
    `Breath: ${breath}.`,
    `Marking: ${signet}. Integrated into the scale pattern, weathered to match the surrounding hide.`,
    ``,
    `Composition: ${pose}.`,
    `Atmosphere: ${atmosphere}.`,
    `Detail: ${minorDetail}.`,
    ``,
    `Cinematography: silhouette-forward, dark, moody. Heavy 35mm film grain, thick atmospheric haze, single distant rim-light. Low contrast, analog softness, NOT sharp. Desaturated cool world (charcoal, slate, deep greys) with the dragon's hue as the only readable colour in the frame.`,
    ``,
    `NO text, NO logos, NO watermark, NO humans, NO cartoon, NO anime, NO smooth digital painting, NO bright saturated colour pop, NO clinical CGI sharpness, NO 8K hero-shot. Muted-but-recognisable colour, not pure grey, not pure silhouette.`,
  ]

  return parts.join('\n')
}
