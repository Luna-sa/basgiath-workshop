// Character-aware defaults for Signet Ceremony — Block C from
// DESIGN_2026-05-12_character_red_thread.md.
//
// One preset chip per ritual gets highlighted as "the answer this
// character would pick" — the user still picks freely. Highlighting
// uses the preset's `label_en` as a stable key (so reordering chips
// in rituals.js doesn't break this map).
//
// Block D: closing line on the Graduation slide, in the chosen
// character's voice.

// ─── Block C ─────────────────────────────────────────────────────

// Map: characterId → { questionId: presetLabelEn (stable key) }
// Question id 'archetype' is special — it refers to the
// VOICE_ARCHETYPE id (mentor / comrade / strategist / ...), not a
// preset chip label.
export const CHARACTER_PRESET_HIGHLIGHTS = {
  violet: {
    work:         'Web / SaaS',
    vow:          'Understanding over output',
    annoys:       'False confidence',
    archetype:    'strategist',
    sigil:        'Library at 3am',
    praise:       'Through a fact',
    disagreement: 'Through numbers',
    tone:         'No mat, dry humour',
    override:     'Tradeoffs always visible',
  },
  xaden: {
    work:         'API / backend',
    vow:          'Tradeoffs always visible',
    annoys:       'Sycophancy openers',
    archetype:    'co-conspirator',
    sigil:        'Mountain ridge at dawn',
    praise:       'With dry irony',
    disagreement: 'Bluntly',
    tone:         'Mat freely',
    override:     'Never start with sycophancy',
  },
  rhiannon: {
    work:         'QA Lead role',
    vow:          'Quality over speed',
    annoys:       'Mock teacherly tone',
    archetype:    'mentor',
    sigil:        'Workshop with sawdust',
    praise:       'Brief "well caught"',
    disagreement: 'Through a question',
    tone:         'No mat, dry humour',
    override:     'Twice = I\'m stuck',
  },
  ridoc: {
    work:         'Mobile / game',
    vow:          'Honest "I don\'t know"',
    annoys:       'Three paragraphs for one line',
    archetype:    'bard',
    sigil:        'Black coffee, quiet morning',
    praise:       'With dry irony',
    disagreement: 'Through a counter-example',
    tone:         'Mat freely',
    override:     'Code first, prose only on ask',
  },
  liam: {
    work:         'Embedded / device',
    vow:          'Reliability over novelty',
    annoys:       'Empty closers',
    archetype:    'sentry',
    sigil:        'Bonfire on a cold beach',
    praise:       'Plain "good" / "done"',
    disagreement: 'Cite the source',
    tone:         'Strict / professional',
    override:     'Doubt before answering',
  },
  imogen: {
    work:         'Web / SaaS',
    vow:          'Honest "I don\'t know"',
    annoys:       'Repeating my words back',
    archetype:    'forge-master',
    sigil:        'Highland coast',
    praise:       'Don\'t — just move on',
    disagreement: 'Bluntly',
    tone:         'Mat OK, irony yes',
    override:     'Honest "I don\'t know"',
  },
  // 'self' has no highlights — leaves the canvas clean
}

/** Resolve the highlighted preset (or archetype id) for a given character + question. */
export function getCharacterHighlight(characterId, questionId) {
  if (!characterId || characterId === 'self') return null
  return CHARACTER_PRESET_HIGHLIGHTS[characterId]?.[questionId] || null
}

// ─── Block D ─────────────────────────────────────────────────────

// Per-character closing line on the Graduation slide.
// One line each, in their voice. Base meaning: "You walked in a
// cadet. You leave a rider."
export const CHARACTER_GRADUATION_LINES = {
  violet: {
    ru: 'Ты вошла в академию через парапет. Уходишь по небу. План сработал.',
    en: 'You crossed the parapet to come in. You leave through the sky. The plan worked.',
    uk: 'Ти увійшла в академію через парапет. Виходиш небом. План спрацював.',
  },
  xaden: {
    ru: 'Воркшоп? Это была разминка. Дальше — твоё.',
    en: 'The workshop? That was the warm-up. What comes next is yours.',
    uk: 'Воркшоп? Це була розминка. Далі — твоє.',
  },
  rhiannon: {
    ru: 'Видишь? Ты не одна. Запомни кто стоял рядом.',
    en: 'See? You\'re not alone. Remember who stood next to you.',
    uk: 'Бачиш? Ти не сама. Запамʼятай хто стояв поруч.',
  },
  ridoc: {
    ru: 'Дракон у тебя нелепый. Самый красивый из всех. Поздравляю.',
    en: 'Your dragon is absurd. The most beautiful of them all. Congratulations.',
    uk: 'Твій дракон безглуздий. Найкрасивіший з усіх. Вітаю.',
  },
  liam: {
    ru: 'Парапет пройден. Дракон есть. Дальше — шаги, по одному.',
    en: 'Parapet crossed. Dragon present. From here — one step at a time.',
    uk: 'Парапет пройдено. Дракон є. Далі — кроки, по одному.',
  },
  imogen: {
    ru: 'Кадет вошла. Вершник вышла.',
    en: 'Cadet went in. Rider walked out.',
    uk: 'Кадет увійшла. Вершниця вийшла.',
  },
  self: {
    ru: 'Это была твоя история. Дальше — тоже она.',
    en: 'This was your story. What comes next is still yours.',
    uk: 'Це була твоя історія. Далі — теж вона.',
  },
}

export function getGraduationCloser(characterId, lang = 'ru') {
  if (!characterId) return null
  const lines = CHARACTER_GRADUATION_LINES[characterId]
  if (!lines) return null
  return lines[lang] || lines.ru || lines.en
}
