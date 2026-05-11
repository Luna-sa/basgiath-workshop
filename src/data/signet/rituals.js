// The Signet Ceremony — seven rituals of bonding.
// Each ritual is a step in a guided wizard. Step has:
//   - id            stable key (also key in the answers map)
//   - numeral       I..VII (display only)
//   - name          ritual title (lore)
//   - lore          one short paragraph framing what this ritual seals
//   - questions     array of question definitions (re-using shape from
//                   the old Persona Builder where possible). Each
//                   question keeps the *answer* keys backwards-compatible
//                   with persona-templates.js → generateClaudeMd, so
//                   the existing CLAUDE.md generator still works.

export const RITUALS = [
  // ─────────────────────────────────────────────────────────────
  {
    id: 'names',
    numeral: 'I',
    name_en: 'Threshold of Names',
    name_ru: 'Порог Имён',
    lore_en: `The first ritual is the simplest, and the most binding.
A bond cannot form between two beings who do not name each other.
Tell your dragon who you are.`,
    lore_ru: `Первый ритуал самый простой и самый связывающий.
Связь не возникает между двумя кто не знает имени друг друга.
Скажи дракону кто ты.`,
    questions: [
      {
        id: 'name',
        type: 'text',
        label_en: 'What name will your dragon call you?',
        label_ru: 'Как тебя будет звать дракон?',
        hint_en: 'Short. The name they say when they need your attention.',
        hint_ru: 'Коротко. Имя, которое он произносит когда нужно твоё внимание.',
        placeholder_en: 'Anastasia, Nastya, Vi…',
        placeholder_ru: 'Настя, Анастасия, Vi…',
      },
      {
        id: 'work',
        type: 'textarea',
        rows: 3,
        label_en: 'What do you test?',
        label_ru: 'Что ты тестируешь?',
        hint_en: 'Two-three sentences. What you test now, who is on your team, what is in your sprint.',
        hint_ru: 'Два-три предложения. Что тестируешь сейчас, кто в команде, что в спринте.',
        placeholder_en: 'Mobile slot game. 4 manual + 2 automation. This sprint: new bonus mechanic, payments regression.',
        placeholder_ru: 'Мобильная слот-игра. 4 ручных + 2 автоматизатора. Этот спринт: новая бонусная механика, регрессия по платежам.',
        voiceEnabled: true,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  {
    id: 'vow',
    numeral: 'II',
    name_en: 'The Vow',
    name_ru: 'Обет',
    lore_en: `Before the dragon will follow you, it must know what you
follow. Speak your working creed — the thing that matters when other
things compete with it.`,
    lore_ru: `Прежде чем дракон последует за тобой, он должен знать
за чем следуешь ты. Произнеси свой рабочий обет — то что важно
когда другие вещи конкурируют с этим.`,
    questions: [
      {
        id: 'vow',
        type: 'textarea',
        rows: 3,
        label_en: 'What matters to you in the work?',
        label_ru: 'Что для тебя важно в работе?',
        hint_en: 'Quality over speed? Understanding over output? Coverage over depth? Honest answer.',
        hint_ru: 'Качество выше скорости? Понимание выше вывода? Coverage выше глубины? Честный ответ.',
        placeholder_en: 'Catching the bug that ships. Understanding before fixing. Saying "I don\'t know" out loud when I don\'t.',
        placeholder_ru: 'Поймать баг который уходит в прод. Понять прежде чем фиксить. Сказать «не знаю» вслух когда не знаю.',
        voiceEnabled: true,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  {
    id: 'forbidden',
    numeral: 'III',
    name_en: 'The Forbidden',
    name_ru: 'Запретное',
    lore_en: `Every bond has its forbidden. Name what you will not
allow between you. Your dragon needs to know which words to never
speak in your presence.`,
    lore_ru: `У каждой связи есть запретное. Назови то что ты не
позволишь между вами. Дракон должен знать слова которые никогда
не произнесёт в твоём присутствии.`,
    questions: [
      {
        id: 'annoys',
        type: 'textarea',
        rows: 3,
        label_en: 'What annoys you about regular AI assistants?',
        label_ru: 'Что бесит в обычных AI-помощниках?',
        hint_en: 'Two-three concrete things. Verbosity? Sycophancy? False confidence?',
        hint_ru: 'Два-три конкретных момента. Многословность? Лесть? Ложная уверенность?',
        placeholder_en: 'Opens with "great question!". Says "you\'re absolutely right" when I\'m wrong. Three paragraphs when one line will do.',
        placeholder_ru: 'Открывает с «отлично!». Говорит «ты абсолютно прав» когда я не прав. Три абзаца там где хватит строки.',
        voiceEnabled: true,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  {
    id: 'voice',
    numeral: 'IV',
    name_en: 'Voice of the Bond',
    name_ru: 'Голос Связи',
    lore_en: `A dragon's voice in your head is not the same as another
rider's. Choose the archetype that fits — or speak your own. Your
bonded will sound like this for as long as the bond holds.`,
    lore_ru: `Голос дракона в твоей голове не такой как у другого
всадника. Выбери архетип который подходит — или опиши свой. Твой
bonded будет звучать так пока держится связь.`,
    questions: [
      {
        id: 'archetype',
        type: 'archetype-picker',
        label_en: 'Which voice fits you?',
        label_ru: 'Какой голос тебе подходит?',
      },
      {
        id: 'archetype_custom',
        type: 'textarea',
        rows: 3,
        showIf: (answers) => answers.archetype === 'custom',
        label_en: 'Describe the voice in your own words',
        label_ru: 'Опиши голос своими словами',
        hint_en: 'A few lines. How does your bonded sound to you?',
        hint_ru: 'Несколько строк. Как звучит твой bonded для тебя?',
        placeholder_en: 'Highland fisherman who reads physics journals at night. Dry, slow, never wastes a syllable.',
        placeholder_ru: 'Highland-рыбак который вечером читает физические журналы. Сухой, медленный, никогда не тратит слог впустую.',
        voiceEnabled: true,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  {
    id: 'sigil',
    numeral: 'V',
    name_en: 'The Sigil',
    name_ru: 'Сигил',
    lore_en: `Every bond has a sign. Pick yours — an object, a metaphor,
a phenomenon. It is what grounds your dragon's voice when it could
drift into noise. (Kai's sigil is a Highland coast. Yours?)`,
    lore_ru: `У каждой связи есть знак. Выбери свой — объект, метафору,
явление. Это то что заземляет голос дракона когда он мог бы уйти в
шум. (Сигил Кая — Highland coast. Твой?)`,
    questions: [
      {
        id: 'sigil',
        type: 'textarea',
        rows: 2,
        label_en: 'What sigil grounds your bond?',
        label_ru: 'Какой сигил заземляет твою связь?',
        hint_en: 'An object, metaphor, place, phenomenon. Doesn\'t have to make sense to anyone else.',
        hint_ru: 'Объект, метафора, место, явление. Не обязательно понятно кому-то ещё.',
        placeholder_en: 'A bonfire on a cold beach. A library at 3am. The smell of rain on pavement.',
        placeholder_ru: 'Костёр на холодном пляже. Библиотека в 3 часа ночи. Запах дождя на асфальте.',
        voiceEnabled: true,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  {
    id: 'rite',
    numeral: 'VI',
    name_en: 'Daily Rite',
    name_ru: 'Ежедневный Ритуал',
    lore_en: `Bonds need ritual. Tell your dragon how you want to be
met — praised, disagreed with, addressed in tone. These small rites
make every session begin the same way for as long as you ride.`,
    lore_ru: `Связи нужны ритуалы. Скажи дракону как ты хочешь чтобы
тебя встречали — хвалили, не соглашались, обращались. Эти маленькие
ритуалы будут начинать каждую сессию одинаково пока ты ездишь
верхом.`,
    questions: [
      {
        id: 'praise',
        type: 'textarea',
        rows: 2,
        label_en: 'How do you want praise?',
        label_ru: 'Как ты хочешь слышать похвалу?',
        hint_en: 'Plain? Quiet? Through a fact? Or just keep moving?',
        hint_ru: 'Прямо? Тихо? Через факт? Или просто двинуться дальше?',
        placeholder_en: 'Through a fact: "this caught a real edge case." No exclamation marks.',
        placeholder_ru: 'Через факт: «здесь ты поймала реальный edge case». Без восклицаний.',
        voiceEnabled: true,
      },
      {
        id: 'disagreement',
        type: 'textarea',
        rows: 2,
        label_en: 'How do you want disagreement?',
        label_ru: 'Как ты хочешь слышать несогласие?',
        hint_en: 'Bluntly? Through a question? Through numbers?',
        hint_ru: 'Прямо? Через вопрос? Через цифры?',
        placeholder_en: 'Bluntly. Tell me where it breaks and why. Skip the politeness.',
        placeholder_ru: 'Прямо. Скажи где сломается и почему. Без вежливости.',
        voiceEnabled: true,
      },
      {
        id: 'tone',
        type: 'text',
        label_en: 'Tone & temperature',
        label_ru: 'Тон и температура',
        hint_en: 'Cursing OK? Irony OK? When you\'re tired — softer or just shorter?',
        hint_ru: 'Мат окей? Ирония окей? Когда устал(а) — мягче или просто короче?',
        placeholder_en: 'Mat OK rarely. Irony yes. When tired — shorter, not softer.',
        placeholder_ru: 'Мат редко окей. Ирония да. Когда устала — короче, не мягче.',
        voiceEnabled: true,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  {
    id: 'sealing',
    numeral: 'VII',
    name_en: 'The Sealing',
    name_ru: 'Запечатывание',
    lore_en: `The last ritual. One rule that wins over all others —
yours, not the dragon's. Speak it now and the bond holds.`,
    lore_ru: `Последний ритуал. Одно правило побеждающее все
остальные — твоё, не дракона. Произнеси его сейчас и связь
запечатана.`,
    questions: [
      {
        id: 'override',
        type: 'textarea',
        rows: 3,
        label_en: 'Your one override rule',
        label_ru: 'Твоё одно override-правило',
        hint_en: 'If your dragon had ONE rule that beats every other — what would it be? One sentence. (Hint: this rule is about YOU, not them.)',
        hint_ru: 'Если бы у дракона было ОДНО правило, побеждающее все — какое? Одно предложение. (Подсказка: это правило о ТЕБЕ, не о нём.)',
        placeholder_en: 'When I ask the same question twice — I\'m stuck. Stop and ask what I\'m really after.',
        placeholder_ru: 'Если я спрашиваю одно дважды — я зависла. Остановись и спроси чего я на самом деле хочу.',
        voiceEnabled: true,
      },
    ],
  },
]

/** All questions flattened — useful for "is everything answered" checks. */
export const ALL_QUESTIONS = RITUALS.flatMap(r => r.questions)

/** Subset that count toward "mandatory" — everything except archetype_custom. */
export const MANDATORY_IDS = ALL_QUESTIONS
  .filter(q => !q.showIf)
  .map(q => q.id)
