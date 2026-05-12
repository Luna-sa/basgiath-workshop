// Build the gpt-image-2 prompt from Bond Ritual answers.
//
// Goal: cinematic still that looks like a frame from a real fantasy
// epic - Fourth Wing / House of the Dragon adaptation. Dragon must
// read as photographic, not illustrated. Dragon's chosen scale colour
// is the hero of the frame; the world around it is muted, cool, moody.
//
// Style anchors:
//   - Fourth Wing canon dragon breeds (Daggertail / Morningstartail / Clubtail / Swordtail / Feathertail)
//   - "Reign of Fire" weathered photoreal dragon look
//   - "House of the Dragon" Targaryen mount cinematography
//   - "Game of Thrones" Drogon at Daenerys's side scale
//
// Colour rule:
//   - The dragon's scale colour is rendered with deep saturation and
//     pigment depth.
//   - The world around (sky, stone, mist, atmosphere) is desaturated
//     cool greys, slate blues, charcoal - almost mono - so the dragon
//     reads as the single chromatic anchor of the frame.

const BREATH_VISUALS = {
  fire:      'jets of golden-orange flame curling around its jaws, embers drifting upward on heat currents, faint scorch marks on the lower jaw scales',
  lightning: 'crackling pale-blue lightning arcs spilling from between its teeth, the air around its head sharp with ozone shimmer',
  shadow:    'tendrils of true black mist coiling around its head, swallowing light, faint violet edges where the shadow touches air',
  sound:     'visible concentric sonic rings rippling the air around its open jaws, fine dust caught in the wave pattern',
  mist:      'cold silver vapor pouring from its nostrils, clinging to its scales like dew, breath made manifest in the cold',
  frost:     'crystalline ice rime forming on its lower jaw, frost-breath catching the side-light, frozen condensation along the throat',
}

const SIZE_VISUALS = {
  small: 'lithe and compact, roughly the size of a destrier, built for speed and high-altitude turns - wings disproportionately large relative to body',
  mid:   "a warrior's build, the size of a small longhouse, dense with muscle along the shoulders and haunches",
  large: 'massive and ancient, the size of a galleon, scales weathered by centuries of war and weather, deep battle-scars across the chest plates',
}

const WING_VISUALS = {
  membranous: 'wide membranous wings stretched between long bone-finger struts, the membrane semi-translucent against backlight, fine veined patterns visible, edges scarred from battle',
  feathered:  'enormous feathered wings - extremely rare in Navarre, only the Gold Feathertail breed - primary feathers longer than a man, layered like an eagle\'s but oversized, the colour matching the dragon\'s hide',
  serrated:   'sail-like wings with deeply serrated trailing edges, leathery hide-membrane scarred and weathered, individual rip-tears visible from past combat',
}

const EYE_VISUALS = {
  gold:     'molten gold eyes with deep vertical slit pupils, the iris with fine internal fire-flecks',
  green:    'storm-green eyes the colour of lichen on wet stone, vertical slit pupils dilated',
  amethyst: 'deep amethyst eyes with violet-purple iris, vertical pupils contracted',
  silver:   'mercury-silver eyes, the iris catching ambient light like polished metal',
  ember:    'ember-red eyes burning from within like coal, faint heat-shimmer around the iris',
  blue:     'pale ice-blue eyes the colour of glacier water, vertical slit pupils, the iris with internal crystalline structure',
}

// Infer Fourth Wing canon breed from scale colour text.
// Falls through to a generic "battle-tested" dragon if no match.
function inferBreedFromScale(scaleText = '') {
  const s = (scaleText || '').toLowerCase()
  if (/red|crimson|blood|scarlet|rust|ember|coal-red|алый|кров|крас/i.test(s)) {
    return 'a Red Daggertail breed - angular bladed tail tip the shape of a heavy double-edged dagger, the most aggressive war-line of Navarre'
  }
  if (/black|obsidian|onyx|coal|tar|jet|чёрн|обсидиан/i.test(s)) {
    return "a Black Morningstartail breed - spiked club-tail like a medieval morning-star, the breed of Tairn, Violet's bonded mount"
  }
  if (/blue|midnight|sapphire|cobalt|ocean|deep-water|син|голуб/i.test(s)) {
    return "a Blue Daggertail breed - deep midnight-blue scales with darker veining, bladed tail-tip, the breed of Sgaeyl, Xaden's bonded mount"
  }
  if (/green|moss|pine|forest|emerald|lichen|зелён|изумруд/i.test(s)) {
    return 'a Green Clubtail breed - moss-and-pine scales with darker mottling along the spine, heavy blunted club-tail tip, mountain-line dragons'
  }
  if (/brown|earth|umber|bronze|tan|leather|коричн|бронз/i.test(s)) {
    return "a Brown Swordtail breed - warm earth-tone scales with bronze edges, sword-shaped flat blade tail-tip, Navarre's most common war-line"
  }
  if (/gold|amber|honey|brass|copper|золот|медн|янтар/i.test(s)) {
    return "a Gold Feathertail breed - the rarest line in Empyrean memory, golden feather-like overlapping scales instead of pure plate scales, the breed of Andarna"
  }
  if (/white|pearl|bone|ash|silver|snow|бел|перлам|сереб/i.test(s)) {
    return 'a Pale Swordtail-line dragon, extraordinarily rare colouration - pearl-and-bone scales with faint silver edge-shimmer, sword-shaped tail-tip'
  }
  if (/steel|grey|gray|slate|storm|gunmetal|сер|сталь|сланц/i.test(s)) {
    return 'a Steel Swordtail breed - gunmetal-grey scales with hard slate-blue undertones, sword-shaped tail-tip, the colour of weathered Navarre stone'
  }
  if (/orange|copper|rust|sunset|flame|оранж|закат/i.test(s)) {
    return 'an Orange Clubtail breed - sunset-orange scales with deeper copper veining, heavy blunted club-tail'
  }
  return "a battle-tested Navarrean war-dragon, breed-line uncertain, bladed or clubbed tail"
}

/** Pose / mood inferred from motto sentiment. */
function inferPoseFromMotto(motto = '') {
  const m = motto.toLowerCase()
  // ferocity signals
  if (/(strike|kill|hunt|tear|burn|destroy|first|fast|wild|feral|никогда не оставлю|бью|убью|сожгу|уничт|нападу)/i.test(m)) {
    return 'mid-roar on a storm-lit Navarre ridge - neck arched skyward, jaws parted, claws extended, wings flared wide and angled forward, caught at the edge of a downbeat with stone shards kicking up beneath the rear claws'
  }
  // patience signals
  if (/(patient|wait|last|silence|still|stand|guard|жду|молчу|стою|защи|терпение|охран)/i.test(m)) {
    return 'settled on a high stone outcrop above the cloud-line, head lowered toward the viewer in three-quarter angle, gaze unblinking and watchful, wings folded tight against the body, tail wrapped around the perching stone'
  }
  // loyalty / protection
  if (/(protect|shield|loyal|family|bond|together|защи|связ|вмест|оборон)/i.test(m)) {
    return 'wings half-spread protectively over the space below, body lowered into a crouch, head turned toward the viewer with eyes locked, the protective curve of the wings forming a sheltering arc'
  }
  // mystery / freedom
  if (/(free|sky|wind|never|forever|свобод|небо|никогда|вечно|вольн)/i.test(m)) {
    return 'mid-flight against a wide storm-grey sky, wings catching dramatic backlight at full extension, head turned slightly toward the viewer, body in three-quarter perspective, wisps of cloud breaking around the wing membrane'
  }
  // default - noble watchful stillness
  return 'standing on a windswept Aerie ridge at the edge of the cloud-line, head lifted in three-quarter view, wings folded but ready, presence absolute and unmoving, the world muted around its scaled mass'
}

// Resolve a single value or an array of values against a lookup map.
// Multi-select questions (breath / wings / eyes) hand us an array;
// join their visual descriptions with " AND " so the model sees
// them as a single combined trait (e.g. fire AND lightning).
function resolveVisual(value, map, fallback) {
  if (Array.isArray(value)) {
    const parts = value.map(v => map[v]).filter(Boolean)
    if (parts.length === 0) return fallback
    if (parts.length === 1) return parts[0]
    return parts.join(' AND ')
  }
  return map[value] || fallback
}

// Hard cap on free-form user text that lands directly in the prompt.
// Multi-select presets can produce 400+ char paragraphs for sigil/motto,
// and the static prompt scaffolding already eats ~2.5k chars — we must
// keep total under the model's 4000-char limit.
const MAX_FREEFORM = 200

function capText(str, max = MAX_FREEFORM) {
  const s = String(str || '').trim().replace(/\s+/g, ' ')
  if (s.length <= max) return s
  return s.slice(0, max - 1).replace(/\s+\S*$/, '') + '…'
}

export function buildDragonPrompt(answers = {}) {
  const scaleRaw = capText(answers.scale, 160) || 'storm-grey scales with hints of bronze along the spine'
  const breed = inferBreedFromScale(scaleRaw)
  const breath = resolveVisual(answers.breath, BREATH_VISUALS, BREATH_VISUALS.fire)
  const signet = capText(answers.signet) || 'a single etched rune marking across one flank, ancient and weathered'
  const size = SIZE_VISUALS[answers.size] || SIZE_VISUALS.mid
  const wings = resolveVisual(answers.wings, WING_VISUALS, WING_VISUALS.membranous)
  const eyes = resolveVisual(answers.eyes, EYE_VISUALS, EYE_VISUALS.gold)
  const motto = capText(answers.motto)
  const pose = inferPoseFromMotto(motto)

  // Tight prompt: ~2300 chars of scaffolding leaves ~1700 for user
  // text + breed/wing/eye blocks. Total stays under the 4000-char
  // limit even with verbose presets selected.
  const parts = [
    `A cinematic film still from a dark-fantasy epic — "Fourth Wing", "House of the Dragon", "Reign of Fire" visual language. Photoreal practical-effects dragon. NOT illustrated, NOT painted, NOT anime, NOT D&D mini.`,
    ``,
    `Dragon: ${breed}. ${size}.`,
    ``,
    `Scale and hide: ${scaleRaw}. The dragon's chosen colour stays muted but clearly readable on lit planes (spine ridge, wing edge, jaw, haunch) — pigmented but desaturated. World around it is grainy charcoal-slate atmosphere; scales dissolve into haze at the edges, hue lives in the rim-light. Fourth Wing book-cover plate energy.`,
    ``,
    `Wings: ${wings}.`,
    `Eyes: ${eyes}. Iris hyper-detailed, pupil deep, world reflected in the corneal curve.`,
    `Breath: ${breath}.`,
    `Marking: ${signet}. Integrated into the scale pattern, weathered to match the surrounding hide.`,
    ``,
    `Composition: ${pose}.`,
    motto ? `The dragon's bearing carries the rider's vow: "${motto}".` : '',
    ``,
    `Cinematography: silhouette-forward, dark, moody. Heavy 35mm film grain, thick atmospheric haze, single distant rim-light. Low contrast, analog softness, NOT sharp. Desaturated cool world (charcoal, slate, deep greys) with the dragon's hue as the only readable colour in the frame.`,
    ``,
    `NO text, NO logos, NO watermark, NO humans, NO cartoon, NO anime, NO smooth digital painting, NO bright saturated colour pop, NO clinical CGI sharpness, NO 8K hero-shot. Muted-but-recognisable colour, not pure grey, not pure silhouette.`,
  ].filter(Boolean)

  let out = parts.join('\n')

  // Hard safety belt — even with all caps applied, exotic preset
  // combinations could theoretically blow the budget. Trim from the
  // end on the last paragraph (the negatives block) which carries
  // the least unique signal.
  const LIMIT = 3900
  if (out.length > LIMIT) {
    out = out.slice(0, LIMIT - 1).replace(/\s+\S*$/, '') + '…'
  }
  return out
}
