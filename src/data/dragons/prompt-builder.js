// Build the gpt-image-2 prompt from Bond Ritual answers.
//
// Goal: cinematic still that looks like a frame from a real fantasy
// epic — Fourth Wing / House of the Dragon / Game of Thrones. Dragon
// must read as photographic, not illustrated.

const BREATH_VISUALS = {
  fire:      'golden flame curling around its jaws, embers drifting upward',
  lightning: 'crackling blue-white arcs spilling from between its teeth',
  shadow:    'tendrils of black mist coiling around its head, swallowing light',
  sound:     'visible sonic rings rippling the air around its open jaws',
  mist:      'cold silver mist pouring from its nostrils, clinging to its scales',
  frost:     'crystalline ice rime forming around its mouth, frost-breath catching the light',
}

const SIZE_VISUALS = {
  small: 'lithe and compact, the size of a destrier, built for speed',
  mid:   'a warrior\'s build, the size of a small house, dense with muscle',
  large: 'massive and ancient, the size of a galleon, scales weathered by centuries',
}

const WING_VISUALS = {
  membranous: 'wide membranous wings stretched between bone-like fingers, light filtering through translucent skin',
  feathered:  'enormous feathered wings, primaries longer than a man, layered like an eagle\'s',
  serrated:   'sail-like wings with serrated trailing edges, leathery and battle-scarred',
}

const EYE_VISUALS = {
  gold:     'molten gold eyes with vertical slit pupils',
  green:    'storm-green eyes',
  amethyst: 'deep amethyst eyes',
  silver:   'mercury-silver eyes',
  ember:    'ember-red eyes burning from within',
  blue:     'ice-blue eyes',
}

/** Pose / mood inferred from motto sentiment. */
function inferPoseFromMotto(motto = '') {
  const m = motto.toLowerCase()
  // ferocity signals
  if (/(strike|kill|hunt|tear|burn|destroy|first|fast|wild|feral|никогда не оставлю|бью|убью|сожгу|уничт)/i.test(m)) {
    return 'mid-roar, claws extended, wings flared, caught at the edge of flight on a storm-lit ridge'
  }
  // patience signals
  if (/(patient|wait|last|silence|still|stand|guard|жду|молчу|стою|защи|терпение)/i.test(m)) {
    return 'settling on a high stone outcrop, head lowered toward the viewer, gaze unblinking and watchful'
  }
  // loyalty / protection
  if (/(protect|shield|loyal|family|bond|together|защи|связ|вмест)/i.test(m)) {
    return 'wings half-spread protectively over something unseen below, eyes locked on the horizon'
  }
  // mystery / freedom
  if (/(free|sky|wind|never|forever|свобод|небо|никогда|вечно)/i.test(m)) {
    return 'mid-flight against a wide sky, wings catching backlight, head turned slightly toward the viewer'
  }
  // default — noble watchful stillness
  return 'standing on a windswept ridge, head lifted, wings folded, presence absolute'
}

export function buildDragonPrompt(answers = {}) {
  const scale = (answers.scale || '').trim() || 'storm-grey scales with hints of bronze'
  const breath = BREATH_VISUALS[answers.breath] || BREATH_VISUALS.fire
  const signet = (answers.signet || '').trim() || 'a single etched rune across its flank'
  const size = SIZE_VISUALS[answers.size] || SIZE_VISUALS.mid
  const wings = WING_VISUALS[answers.wings] || WING_VISUALS.membranous
  const eyes = EYE_VISUALS[answers.eyes] || EYE_VISUALS.gold
  const motto = (answers.motto || '').trim()
  const pose = inferPoseFromMotto(motto)

  const parts = [
    `A cinematic film still from a dark fantasy epic, visual language of "Fourth Wing" and "House of the Dragon".`,
    ``,
    `A photoreal dragon — ${size}, ${scale}. ${wings}. ${eyes}.`,
    `${breath}.`,
    `${signet}.`,
    ``,
    `Composition: ${pose}.`,
    motto ? `The dragon's bearing carries the meaning: "${motto}".` : '',
    ``,
    `Cinematography: Arri Alexa, anamorphic 2.39:1, shallow depth of field, dramatic side-lit storm light, professional colour grade. Atmospheric haze. Visible breath in the cold air. Real photographic grain. Individual scales catch the light. Wing membrane semi-translucent against backlight. 8K, hyperdetailed.`,
    ``,
    `Critical: photoreal, not illustrated. No text. No logos. No captions. No UI elements. No watermark. No human characters in frame. The dragon fills the frame, three-quarter view.`,
  ].filter(Boolean)

  return parts.join('\n')
}
