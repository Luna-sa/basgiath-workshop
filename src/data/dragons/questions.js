// Bond Ritual — questions used to define your dragon. Answers feed
// the gpt-image-2 prompt builder + the on-screen Dragon Card.
//
// Seven steps total; the last one is the dragon's name, which we
// suggest from Claude (server-side) or let the user write.

export const BOND_QUESTIONS = [
  // 01 — scale colour / material
  {
    id: 'scale',
    type: 'textarea',
    rows: 2,
    voiceEnabled: true,
    icon: '◐',
    label_en: 'What colour are your dragon\'s scales?',
    label_ru: 'Какого цвета чешуя твоего дракона?',
    label_uk: 'Якого кольору луска твого дракона?',
    hint_en: 'Free-form — colour, material, how light hits it.',
    hint_ru: 'Свободно — цвет, материал, как ловит свет.',
    hint_uk: 'Вільно — колір, матеріал, як ловить світло.',
    placeholder_en: 'Pearl-white catching dawn. Obsidian smoke. Storm-grey with copper embers along the spine.',
    placeholder_ru: 'Жемчужно-белый ловящий рассвет. Обсидиановый дым. Грозово-серый с медными искрами вдоль хребта.',
    placeholder_uk: 'Перлинно-білий що ловить світанок. Обсидіановий дим. Грозово-сірий з мідними іскрами по хребту.',
  },

  // 02 — breath weapon
  {
    id: 'breath',
    type: 'cards',
    icon: '◉',
    label_en: 'What does your dragon breathe?',
    label_ru: 'Чем дышит твой дракон?',
    label_uk: 'Чим дихає твій дракон?',
    options: [
      { value: 'fire',      en: 'Fire',      ru: 'Огонь',         glyph: '🔥' },
      { value: 'lightning', en: 'Lightning', ru: 'Молния',        glyph: '⚡' },
      { value: 'shadow',    en: 'Shadow',    ru: 'Тень',          glyph: '🌑' },
      { value: 'sound',     en: 'Sound',     ru: 'Звук',          glyph: '🎵' },
      { value: 'mist',      en: 'Mist',      ru: 'Туман',         glyph: '🌫' },
      { value: 'frost',     en: 'Frost',     ru: 'Лёд',           glyph: '❄' },
    ],
  },

  // 03 — signet (mark on hide)
  {
    id: 'signet',
    type: 'textarea',
    rows: 2,
    voiceEnabled: true,
    icon: '✦',
    label_en: 'What signet is marked on its hide?',
    label_ru: 'Какой сигил отпечатан на его шкуре?',
    label_uk: 'Який сигіл відбито на його шкірі?',
    hint_en: 'A geometric rune, an animal, a letter, a constellation — yours alone.',
    hint_ru: 'Геометрическая руна, зверь, буква, созвездие — только твой.',
    hint_uk: 'Геометрична руна, звір, літера, сузірʼя — лише твій.',
    placeholder_en: 'A seven-pointed star wreathed in flame, across the left flank.',
    placeholder_ru: 'Семиконечная звезда в венке огня, на левом боку.',
    placeholder_uk: 'Семикутна зірка у вінку вогню, на лівому боці.',
  },

  // 04 — size
  {
    id: 'size',
    type: 'cards',
    icon: '◇',
    label_en: 'How massive is your dragon?',
    label_ru: 'Насколько крупен твой дракон?',
    label_uk: 'Наскільки великий твій дракон?',
    options: [
      { value: 'small',  en: 'Small & agile',     ru: 'Малый и быстрый',   glyph: '⚡' },
      { value: 'mid',    en: 'Mid · warrior',     ru: 'Средний · воин',    glyph: '⚔' },
      { value: 'large',  en: 'Massive · ancient', ru: 'Огромный · древний',glyph: '◢' },
    ],
  },

  // 05 — wing shape
  {
    id: 'wings',
    type: 'cards',
    icon: '◑',
    label_en: 'Wing shape?',
    label_ru: 'Форма крыльев?',
    label_uk: 'Форма крил?',
    options: [
      { value: 'membranous', en: 'Membranous · bat-like', ru: 'Перепончатые · как у летучей мыши', glyph: '𓅓' },
      { value: 'feathered',  en: 'Feathered',             ru: 'Перьевые',                          glyph: '𓅂' },
      { value: 'serrated',   en: 'Serrated · sail-like',  ru: 'Зазубренные · парусные',            glyph: '𓁹' },
    ],
  },

  // 06 — eye colour
  {
    id: 'eyes',
    type: 'cards',
    icon: '◓',
    label_en: 'Eye colour?',
    label_ru: 'Цвет глаз?',
    label_uk: 'Колір очей?',
    options: [
      { value: 'gold',    en: 'Molten gold',    ru: 'Расплавленное золото',  glyph: '◉', color: '#E0A82E' },
      { value: 'green',   en: 'Storm green',    ru: 'Зелень грозы',          glyph: '◉', color: '#3FAF6A' },
      { value: 'amethyst',en: 'Amethyst',       ru: 'Аметист',               glyph: '◉', color: '#9B5DE5' },
      { value: 'silver',  en: 'Silver',         ru: 'Серебро',               glyph: '◉', color: '#C0C5CB' },
      { value: 'ember',   en: 'Ember red',      ru: 'Уголь',                 glyph: '◉', color: '#E85D26' },
      { value: 'blue',    en: 'Ice blue',       ru: 'Лёд',                   glyph: '◉', color: '#5DC4E5' },
    ],
  },

  // 07 — temperament + motto (free text feeds prompt mood)
  {
    id: 'motto',
    type: 'textarea',
    rows: 2,
    voiceEnabled: true,
    icon: '𓂀',
    label_en: 'Your dragon\'s motto, in one line',
    label_ru: 'Девиз твоего дракона, в одну строку',
    label_uk: 'Девіз твого дракона, в один рядок',
    hint_en: 'A short creed in their voice — calm and patient, or feral and fast. The motto sets their stance in the portrait.',
    hint_ru: 'Короткий клич их голосом — спокойно и терпеливо или дико и быстро. Девиз задаёт позу в портрете.',
    hint_uk: 'Короткий клич їх голосом — спокійно та терпляче чи дико та швидко. Девіз задає позу в портреті.',
    placeholder_en: 'I do not strike first — but I strike last.',
    placeholder_ru: 'Я не бью первой — но я бью последней.',
    placeholder_uk: 'Я не бʼю першою — але бʼю останньою.',
  },

  // 08 — name (after the rest)
  {
    id: 'name',
    type: 'text',
    voiceEnabled: true,
    icon: '✦',
    label_en: 'Their name',
    label_ru: 'Их имя',
    label_uk: 'Їхнє імʼя',
    hint_en: 'Names come last in Empyrean lore — only after everything else is sealed.',
    hint_ru: 'Имена приходят последними в лоре Empyrean — только когда всё остальное запечатано.',
    hint_uk: 'Імена приходять останніми у лорі Empyrean — лише коли все інше запечатано.',
    placeholder_en: 'Tairn, Sgaeyl, Andarna, Feirge...',
    placeholder_ru: 'Тэйрн, Сгайл, Андарна, Фейрге...',
    placeholder_uk: 'Тейрн, Сгайл, Андарна, Фейрге...',
  },
]

export const BOND_QUESTION_IDS = BOND_QUESTIONS.map(q => q.id)
