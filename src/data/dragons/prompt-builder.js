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

// User's sigil text → visual marking on the dragon's hide.
//
// The participant's literal sigil sentence can be a paragraph of preset
// concatenations or a long vow — neither belongs in a visual prompt.
// Instead, we scan for theme keywords and pick a curated visual that
// fits the *mood* of what they typed. The result is always a short,
// well-formed visual sentence that the image model can render cleanly.
const SIGNET_VISUALS = [
  {
    match: /(library|book|study|read|3am|3 ?am|night|owl|scholar|тиш|книг|ноч|библ|вечір|вечер)/i,
    visual: 'a delicate etched glyph along the upper flank — scholarly knotwork, faintly luminescent where light catches the engraving',
  },
  {
    match: /(workshop|forge|hammer|sawdust|smith|craft|build|hand|мастер|куз|труд|майстер)/i,
    visual: 'a hammered brand-mark on the shoulder — deep, irregular, the kind of stamp left by an old forge anvil',
  },
  {
    match: /(bonfire|hearth|spark|cabin|warm|огон|пламя|искра|тепл|вогни)/i,
    visual: 'an ember-warmed brand on the lower jaw — coal-coloured but still carrying faint heat-glow where the metal once touched',
  },
  {
    match: /(coffee|morning|silence|quiet|still|cup|кофе|утро|тишин|спокой|кава|ранок)/i,
    visual: 'a thin curling glyph etched into the throat — like steam rising from a held cup at dawn',
  },
  {
    match: /(mountain|ridge|peak|dawn|sunrise|cliff|highland|coast|sea|ocean|skye|гор|пик|утёс|вершин|море|узбережж)/i,
    visual: 'a weathered tribal scar along the flank — wind-carved lines like a sigil cut by the high coastal cliffs',
  },
  {
    match: /(highland|gàidhlig|gaelic|peat|moor|celt|knot|шотланд|вереск|кельт)/i,
    visual: 'a knotwork sigil twisting along one shoulder — looped Pictish stonework lines weathered into the scale',
  },
  {
    match: /(blade|sword|dagger|edge|hunt|strike|hawk|клинок|меч|нож|охот|удар)/i,
    visual: 'a thin angular slash mark across the chest plate — like a duel-scar the dragon never let heal',
  },
  {
    match: /(star|sky|moon|constellation|comet|звезд|небо|луна|комет|зорі|місяць)/i,
    visual: 'a constellation of small etched marks along the spine ridge — like a star map burned into the scale',
  },
  {
    match: /(river|water|tide|flow|wave|вода|река|поток|волн|річк)/i,
    visual: 'flowing wave-line patterns etched along one flank — water-carved depth, dark on dark',
  },
  {
    match: /(forest|tree|root|leaf|pine|moss|лес|дерев|корн|лист|листок|сосн)/i,
    visual: 'branching root-glyph along the haunch — like bark-grain pressed into the hide',
  },
]

// Multi-theme aware. Each SIGNET_VISUALS entry already names its own
// body part (flank, shoulder, jaw, throat, spine, haunch, chest) so
// combining 2-3 markings produces a coherent multi-mark dragon. Cap
// at 3 to avoid visual chaos — a dragon plastered with 6 different
// markings looks like a tattoo parlor sample sheet.
function inferSignetFromText(sigilText = '') {
  const s = String(sigilText || '').toLowerCase()
  const matches = []
  for (const rule of SIGNET_VISUALS) {
    if (rule.match.test(s)) {
      matches.push(rule.visual)
      if (matches.length >= 3) break
    }
  }
  if (matches.length === 0) {
    return 'a single ancient etched rune across one flank, weathered into the scale until almost part of the hide'
  }
  if (matches.length === 1) return matches[0]
  // Two markings: A and B. Three markings: A, B, and C.
  if (matches.length === 2) return `${matches[0]}, and ${matches[1]}`
  return `${matches[0]}, ${matches[1]}, and ${matches[2]}`
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

export function buildDragonPrompt(answers = {}) {
  // The prompt is built ENTIRELY from derived visual signals — no
  // user free-form text lands here verbatim. Scale colour comes from
  // the character archetype, breath/wings/eyes from voice archetype
  // + tone, signet glyph from a keyword scan of the user's sigil
  // theme, pose from a keyword scan of the user's vow theme. This
  // means a participant can type a 2000-word vow and the image
  // generation still produces a clean, on-aesthetic dragon — the
  // long text lives in CLAUDE.md (where it belongs), and only the
  // semantic intent reaches the image model.
  const scale = (answers.scale || '').trim() || 'storm-grey scales with hints of bronze along the spine'
  const breed = inferBreedFromScale(scale)
  const breath = resolveVisual(answers.breath, BREATH_VISUALS, BREATH_VISUALS.fire)
  const signet = inferSignetFromText(answers.signet)
  const size = SIZE_VISUALS[answers.size] || SIZE_VISUALS.mid
  const wings = resolveVisual(answers.wings, WING_VISUALS, WING_VISUALS.membranous)
  const eyes = resolveVisual(answers.eyes, EYE_VISUALS, EYE_VISUALS.gold)
  const pose = inferPoseFromMotto(answers.motto)

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
    ``,
    `Cinematography: silhouette-forward, dark, moody. Heavy 35mm film grain, thick atmospheric haze, single distant rim-light. Low contrast, analog softness, NOT sharp. Desaturated cool world (charcoal, slate, deep greys) with the dragon's hue as the only readable colour in the frame.`,
    ``,
    `NO text, NO logos, NO watermark, NO humans, NO cartoon, NO anime, NO smooth digital painting, NO bright saturated colour pop, NO clinical CGI sharpness, NO 8K hero-shot. Muted-but-recognisable colour, not pure grey, not pure silhouette.`,
  ]

  return parts.join('\n')
}
