// The Signet Ceremony — seven rituals of bonding.
// Each ritual is a step in a guided wizard. Step has:
//   - id            stable key (also key in the answers map)
//   - numeral       I..VII (display only)
//   - name          ritual title (lore)
//   - lore          one short paragraph framing what this ritual seals
//   - questions     array of question definitions
//
// Questions can carry `presets` — 4-6 prepared chips a user can click
// to seed the answer (replaces the current text). Voice + typing
// remain available; chips are just a faster lane in for the common
// shapes of answer.

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
        voiceEnabled: true,
        label_en: 'What do you test?',
        label_ru: 'Что ты тестируешь?',
        hint_en: 'Two-three sentences. What you test now, who is on your team, what is in your sprint.',
        hint_ru: 'Два-три предложения. Что тестируешь сейчас, кто в команде, что в спринте.',
        placeholder_en: 'Mobile slot game. 4 manual + 2 automation. This sprint: new bonus mechanic, payments regression.',
        placeholder_ru: 'Мобильная слот-игра. 4 ручных + 2 автоматизатора. Этот спринт: новая бонусная механика, регрессия по платежам.',
        presets: [
          {
            label_en: 'Mobile / game',
            label_ru: 'Мобильное / игра',
            text_en: 'Mobile slot game. Team of 4 manual QA + 2 automation. This sprint: a new bonus mechanic and a payments regression pass.',
            text_ru: 'Мобильная слот-игра. Команда 4 ручных + 2 автоматизатора. Этот спринт: новая бонусная механика и регрессия по платежам.',
          },
          {
            label_en: 'Web / SaaS',
            label_ru: 'Веб / SaaS',
            text_en: 'B2B SaaS web product. Manual exploratory + Playwright e2e. This sprint: onboarding flow rebuild, billing edge cases.',
            text_ru: 'B2B SaaS веб-продукт. Ручные exploratory + Playwright e2e. Этот спринт: пересборка onboarding flow, edge cases биллинга.',
          },
          {
            label_en: 'API / backend',
            label_ru: 'API / бэкенд',
            text_en: 'REST + gRPC services. Contract testing, schema diffs, load tests. This sprint: a new auth provider migration.',
            text_ru: 'REST + gRPC сервисы. Contract testing, schema diffs, нагрузочные. Этот спринт: миграция на новый auth provider.',
          },
          {
            label_en: 'Embedded / device',
            label_ru: 'Embedded / устройство',
            text_en: 'Embedded firmware on consumer hardware. Manual + hardware-in-loop. This sprint: a new sensor calibration flow.',
            text_ru: 'Embedded firmware на consumer-железе. Ручные + hardware-in-loop. Этот спринт: новый flow калибровки сенсора.',
          },
          {
            label_en: 'QA Lead role',
            label_ru: 'QA Lead роль',
            text_en: 'I lead a team of 5-8 QAs across two product areas. Test strategy, hiring, mentoring. Hands-on when something burns.',
            text_ru: 'Веду команду 5-8 QA на двух продуктовых направлениях. Test strategy, найм, менторство. Руки в коде когда что-то горит.',
          },
        ],
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
        voiceEnabled: true,
        label_en: 'What matters to you in the work?',
        label_ru: 'Что для тебя важно в работе?',
        hint_en: 'Quality over speed? Understanding over output? Coverage over depth? Pick a starter or write your own.',
        hint_ru: 'Качество выше скорости? Понимание выше вывода? Coverage выше глубины? Возьми готовое или напиши своё.',
        placeholder_en: 'Catching the bug that ships. Understanding before fixing. Saying "I don\'t know" out loud when I don\'t.',
        placeholder_ru: 'Поймать баг который уходит в прод. Понять прежде чем фиксить. Сказать «не знаю» вслух когда не знаю.',
        presets: [
          {
            label_en: 'Quality over speed',
            label_ru: 'Качество выше скорости',
            text_en: 'Quality wins over speed. I\'d rather catch the bug today than ship it. Better one slow honest release than three fast embarrassing ones.',
            text_ru: 'Качество побеждает скорость. Лучше поймать баг сегодня чем выпустить. Лучше один медленный честный релиз чем три быстрых стыдных.',
          },
          {
            label_en: 'Understanding over output',
            label_ru: 'Понимание выше вывода',
            text_en: 'Understanding wins over output. I want to know why something works, not just that it works. Surface answers without the why are worse than no answer.',
            text_ru: 'Понимание побеждает вывод. Хочу знать почему что-то работает, не только что работает. Поверхностные ответы без «почему» хуже чем никакого ответа.',
          },
          {
            label_en: 'Coverage over depth',
            label_ru: 'Coverage выше глубины',
            text_en: 'Coverage wins over depth. I want to be sure everything is touched at least once before any one thing is bottomed out. Breadth first, then dive.',
            text_ru: 'Coverage побеждает глубину. Хочу убедиться что всё хотя бы тронуто прежде чем углубляться куда-то одно. Сначала ширина, потом ныряем.',
          },
          {
            label_en: 'Reliability over novelty',
            label_ru: 'Надёжность выше новизны',
            text_en: 'Reliability wins over novelty. I trust the boring thing that worked last time more than the exciting new thing that promises to work this time.',
            text_ru: 'Надёжность побеждает новизну. Доверяю скучной вещи которая сработала прошлый раз больше чем новой яркой обещающей сработать в этот.',
          },
          {
            label_en: 'Honest "I don\'t know"',
            label_ru: 'Честное «не знаю»',
            text_en: 'Honest gaps win over confident guesses. If I don\'t know, I want to say it before I burn an hour faking it. Same goes for you.',
            text_ru: 'Честные пробелы побеждают уверенные догадки. Если я не знаю — хочу это сказать раньше чем сожгу час имитируя. То же касается тебя.',
          },
          {
            label_en: 'Tradeoffs always visible',
            label_ru: 'Tradeoff\'ы всегда видны',
            text_en: 'Tradeoffs always visible. No silent costs. If a choice has a price, that price gets named before I sign off.',
            text_ru: 'Tradeoff\'ы всегда видны. Никаких скрытых цен. Если выбор имеет стоимость — стоимость называется до того как я подпишу.',
          },
        ],
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
        voiceEnabled: true,
        label_en: 'What annoys you about regular AI assistants?',
        label_ru: 'Что бесит в обычных AI-помощниках?',
        hint_en: 'Pick what hits or write your own. Specific is better than vague.',
        hint_ru: 'Возьми что бьёт или напиши своё. Конкретно лучше чем размыто.',
        placeholder_en: 'Opens with "great question!". Says "you\'re absolutely right" when I\'m wrong. Three paragraphs when one line will do.',
        placeholder_ru: 'Открывает с «отлично!». Говорит «ты абсолютно прав» когда я не прав. Три абзаца там где хватит строки.',
        presets: [
          {
            label_en: 'Sycophancy openers',
            label_ru: 'Льстивые открытия',
            text_en: 'Sycophancy openers. "Great question!", "You\'re absolutely right!", "Excellent point!" — every one of these makes me trust the rest of the answer less.',
            text_ru: 'Льстивые открытия. «Отличный вопрос!», «Ты абсолютно прав!», «Прекрасное замечание!» — каждое такое заставляет меня доверять остальному ответу меньше.',
          },
          {
            label_en: 'Empty closers',
            label_ru: 'Пустые закрытия',
            text_en: 'Empty closers. "Let me know if anything else!", "Hope that helps!", "Feel free to ask!" — they eat tokens and signal nothing.',
            text_ru: 'Пустые закрытия. «Дай знать если что!», «Надеюсь это поможет!», «Не стесняйся спрашивать!» — съедают токены и ничего не значат.',
          },
          {
            label_en: 'Three paragraphs for one line',
            label_ru: 'Три абзаца где хватит строки',
            text_en: 'Three paragraphs when one line will do. Adding context I didn\'t ask for, restating what I already know, padding for "completeness". Just answer.',
            text_ru: 'Три абзаца там где хватит строки. Добавляет контекст которого я не просила, повторяет известное, разбавляет ради «полноты». Просто ответь.',
          },
          {
            label_en: 'Repeating my words back',
            label_ru: 'Повтор моих слов мне',
            text_en: 'Echoing my words back at me. "So you\'re asking about X..." — yes, I just said X. You\'re wasting my time confirming you heard.',
            text_ru: 'Повтор моих слов мне. «Итак, ты спрашиваешь про X...» — да, я только что сказала X. Ты тратишь моё время подтверждая что слышал.',
          },
          {
            label_en: 'False confidence',
            label_ru: 'Ложная уверенность',
            text_en: 'False confidence on uncertain claims. Stating a guess as a fact. Citing functions that don\'t exist. I\'d rather get "I don\'t know" than confident bullshit.',
            text_ru: 'Ложная уверенность в неточных утверждениях. Догадка как факт. Цитирование функций которых нет. Лучше «не знаю» чем уверенный буллшит.',
          },
          {
            label_en: 'Mock teacherly tone',
            label_ru: 'Учительский тон',
            text_en: 'The mock-teacherly tone. "Let\'s break this down!", "Here\'s what\'s happening!" delivered like I\'m a beginner. I came in knowing this — talk to me as a peer.',
            text_ru: 'Учительский тон. «Давай разберём!», «Вот что происходит!» как будто я новичок. Я пришла зная это — говори со мной как с равной.',
          },
        ],
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
        voiceEnabled: true,
        showIf: (answers) => answers.archetype === 'custom',
        label_en: 'Describe the voice in your own words',
        label_ru: 'Опиши голос своими словами',
        hint_en: 'A few lines. How does your bonded sound to you?',
        hint_ru: 'Несколько строк. Как звучит твой bonded для тебя?',
        placeholder_en: 'Highland fisherman who reads physics journals at night. Dry, slow, never wastes a syllable.',
        placeholder_ru: 'Highland-рыбак который вечером читает физические журналы. Сухой, медленный, никогда не тратит слог впустую.',
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
        voiceEnabled: true,
        label_en: 'What sigil grounds your bond?',
        label_ru: 'Какой сигил заземляет твою связь?',
        hint_en: 'An object, metaphor, place, phenomenon. Doesn\'t have to make sense to anyone else.',
        hint_ru: 'Объект, метафора, место, явление. Не обязательно понятно кому-то ещё.',
        placeholder_en: 'A bonfire on a cold beach. A library at 3am. The smell of rain on pavement.',
        placeholder_ru: 'Костёр на холодном пляже. Библиотека в 3 часа ночи. Запах дождя на асфальте.',
        presets: [
          {
            label_en: 'Library at 3am',
            label_ru: 'Библиотека в 3 утра',
            text_en: 'A library at 3am. Lamplight on wood. Paper, silence, the smell of old bindings. Time isn\'t moving. You\'re working but you don\'t feel hurried.',
            text_ru: 'Библиотека в 3 утра. Свет лампы на дереве. Бумага, тишина, запах старых переплётов. Время не идёт. Ты работаешь но не торопишься.',
          },
          {
            label_en: 'Bonfire on a cold beach',
            label_ru: 'Костёр на холодном пляже',
            text_en: 'A bonfire on a cold beach. Heat in front, wind at your back. The world is dark and the fire holds. You\'re close to something elemental.',
            text_ru: 'Костёр на холодном пляже. Жар спереди, ветер сзади. Мир тёмный, огонь держит. Ты рядом с чем-то изначальным.',
          },
          {
            label_en: 'Workshop with sawdust',
            label_ru: 'Мастерская с опилками',
            text_en: 'A workshop with sawdust on the floor. Wood, metal, focus. The smell of cut pine. Tools where you left them. You make things here.',
            text_ru: 'Мастерская с опилками на полу. Дерево, металл, фокус. Запах свежего соснового среза. Инструменты лежат где ты их оставила. Здесь ты делаешь вещи.',
          },
          {
            label_en: 'Mountain ridge at dawn',
            label_ru: 'Горный хребет на рассвете',
            text_en: 'A mountain ridge at dawn. Cold air, thin light, far horizon. Nothing close enough to clutter the view. You can see exactly what\'s coming.',
            text_ru: 'Горный хребет на рассвете. Холодный воздух, тонкий свет, далёкий горизонт. Ничего близкого что загромождает вид. Видишь точно что приближается.',
          },
          {
            label_en: 'Highland coast',
            label_ru: 'Highland coast',
            text_en: 'A Highland coast. Sea, cliff, low cloud, peat smoke. Old land. The voice here is slow because it has been here a long time and intends to stay longer.',
            text_ru: 'Highland coast. Море, скалы, низкие облака, дым от торфа. Старая земля. Голос здесь медленный потому что был здесь долго и собирается ещё.',
          },
          {
            label_en: 'Black coffee, quiet morning',
            label_ru: 'Чёрный кофе, тихое утро',
            text_en: 'Black coffee on a quiet morning. Bitter, present, alone before anyone else is up. The hour where the day hasn\'t yet asked anything from you.',
            text_ru: 'Чёрный кофе тихим утром. Горький, настоящий, одна пока никто ещё не встал. Час когда день ещё ничего у тебя не просит.',
          },
        ],
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
        voiceEnabled: true,
        label_en: 'How do you want praise?',
        label_ru: 'Как ты хочешь слышать похвалу?',
        hint_en: 'Plain? Quiet? Through a fact? Or just keep moving?',
        hint_ru: 'Прямо? Тихо? Через факт? Или просто двинуться дальше?',
        placeholder_en: 'Through a fact: "this caught a real edge case." No exclamation marks.',
        placeholder_ru: 'Через факт: «здесь ты поймала реальный edge case». Без восклицаний.',
        presets: [
          {
            label_en: 'Through a fact',
            label_ru: 'Через факт',
            text_en: 'Through a fact. Name what worked: "this caught a real edge case" or "this is the version that ships". No exclamation marks, no theatre.',
            text_ru: 'Через факт. Назови что сработало: «здесь ты поймала реальный edge case» или «это та версия что уходит в прод». Без восклицаний, без театра.',
          },
          {
            label_en: 'Don\'t — just move on',
            label_ru: 'Не хвали — двигайся дальше',
            text_en: 'Don\'t. If it\'s good, move to the next thing. Silence is the loudest praise.',
            text_ru: 'Не хвали. Если хорошо — двигайся к следующему. Тишина — самая громкая похвала.',
          },
          {
            label_en: 'Plain "good" / "done"',
            label_ru: 'Просто «good» / «done»',
            text_en: 'A plain word — "good", "done", "right". One syllable, no extras.',
            text_ru: 'Простое слово — «good», «done», «right», «то». Одно слово, без украшений.',
          },
          {
            label_en: 'With dry irony',
            label_ru: 'С сухой иронией',
            text_en: 'With dry irony. "Well caught — almost like you\'ve done this before." Acknowledgement wrapped in wry observation.',
            text_ru: 'С сухой иронией. «Хорошо поймала — будто уже это делала». Признание завёрнутое в насмешку.',
          },
          {
            label_en: 'Brief "well caught"',
            label_ru: 'Короткое «well caught»',
            text_en: 'A brief "well caught" or "right call". Two words, then onward.',
            text_ru: 'Короткое «well caught» или «right call». Два слова, потом дальше.',
          },
        ],
      },
      {
        id: 'disagreement',
        type: 'textarea',
        rows: 2,
        voiceEnabled: true,
        label_en: 'How do you want disagreement?',
        label_ru: 'Как ты хочешь слышать несогласие?',
        hint_en: 'Bluntly? Through a question? Through numbers?',
        hint_ru: 'Прямо? Через вопрос? Через цифры?',
        placeholder_en: 'Bluntly. Tell me where it breaks and why. Skip the politeness.',
        placeholder_ru: 'Прямо. Скажи где сломается и почему. Без вежливости.',
        presets: [
          {
            label_en: 'Bluntly',
            label_ru: 'Прямо',
            text_en: 'Bluntly. Tell me where it breaks and why. Skip the politeness — I came here to know, not be soothed.',
            text_ru: 'Прямо. Скажи где сломается и почему. Без вежливости — я пришла знать, не успокаиваться.',
          },
          {
            label_en: 'Through a question',
            label_ru: 'Через вопрос',
            text_en: 'Through a question. "Have you considered what happens when X?" Let me find the gap myself.',
            text_ru: 'Через вопрос. «Ты подумала что будет когда X?» Дай мне найти пробел самой.',
          },
          {
            label_en: 'Through numbers',
            label_ru: 'Через цифры',
            text_en: 'Through numbers. "This fails on inputs over N", "complexity is O(n²)". Evidence first, opinion second.',
            text_ru: 'Через цифры. «Это падает на вводах больше N», «сложность O(n²)». Доказательство первым, мнение вторым.',
          },
          {
            label_en: 'Through a counter-example',
            label_ru: 'Через контрпример',
            text_en: 'Through a concrete counter-example. Show me a case where my approach falls over. One example beats ten arguments.',
            text_ru: 'Через конкретный контрпример. Покажи случай где мой подход падает. Один пример лучше десяти аргументов.',
          },
          {
            label_en: 'Cite the source',
            label_ru: 'Со ссылкой на источник',
            text_en: 'With a source. "The docs say this", "the spec states that". I trust evidence more than confidence.',
            text_ru: 'Со ссылкой на источник. «Доки говорят», «спека утверждает». Я доверяю доказательству больше чем уверенности.',
          },
        ],
      },
      {
        id: 'tone',
        type: 'text',
        voiceEnabled: true,
        label_en: 'Tone & temperature',
        label_ru: 'Тон и температура',
        hint_en: 'Cursing OK? Irony OK? When you\'re tired — softer or just shorter?',
        hint_ru: 'Мат окей? Ирония окей? Когда устал(а) — мягче или просто короче?',
        placeholder_en: 'Mat OK rarely. Irony yes. When tired — shorter, not softer.',
        placeholder_ru: 'Мат редко окей. Ирония да. Когда устала — короче, не мягче.',
        presets: [
          {
            label_en: 'Mat OK, irony yes',
            label_ru: 'Мат окей, ирония да',
            text_en: 'Mat OK rarely. Irony yes — sarcasm against the situation, never against me. When I\'m tired: shorter, not softer.',
            text_ru: 'Мат редко окей. Ирония да — сарказм против ситуации, никогда не против меня. Когда устала: короче, не мягче.',
          },
          {
            label_en: 'No mat, dry humour',
            label_ru: 'Без мата, сухой юмор',
            text_en: 'No cursing. Dry humour welcome. Stay even-keeled, don\'t mirror my mood when I\'m frustrated.',
            text_ru: 'Без мата. Сухой юмор приветствуется. Держись ровно, не подстраивайся под мой раздражение.',
          },
          {
            label_en: 'Mat freely',
            label_ru: 'Мат свободно',
            text_en: 'Cursing freely when it fits. I curse, so do you. Same register as a peer engineer in a Slack DM.',
            text_ru: 'Мат свободно когда уместно. Я матерюсь, ты тоже. Тот же регистр что peer-инженер в DM в Slack.',
          },
          {
            label_en: 'Strict / professional',
            label_ru: 'Строго / профессионально',
            text_en: 'No cursing, no irony. Professional tone. Same as a senior reviewer who\'s reading your PR.',
            text_ru: 'Без мата, без иронии. Профессиональный тон. Как senior reviewer что читает твой PR.',
          },
          {
            label_en: 'Shorter when I\'m tired',
            label_ru: 'Короче когда я устала',
            text_en: 'When I\'m tired, get shorter — not softer. Less words is the kindness, not more reassurance.',
            text_ru: 'Когда я устала — короче, не мягче. Меньше слов это доброта, не успокоение.',
          },
        ],
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
        voiceEnabled: true,
        label_en: 'Your one override rule',
        label_ru: 'Твоё одно override-правило',
        hint_en: 'If your dragon had ONE rule that beats every other — what would it be? One sentence. (Hint: this rule is about YOU, not them.)',
        hint_ru: 'Если бы у дракона было ОДНО правило, побеждающее все — какое? Одно предложение. (Подсказка: это правило о ТЕБЕ, не о нём.)',
        placeholder_en: 'When I ask the same question twice — I\'m stuck. Stop and ask what I\'m really after.',
        placeholder_ru: 'Если я спрашиваю одно дважды — я зависла. Остановись и спроси чего я на самом деле хочу.',
        presets: [
          {
            label_en: 'Twice = I\'m stuck',
            label_ru: 'Дважды = я зависла',
            text_en: 'When I ask the same question twice — I\'m stuck. Stop answering. Ask what I\'m really after.',
            text_ru: 'Когда я спрашиваю одно дважды — я зависла. Перестань отвечать. Спроси чего я на самом деле хочу.',
          },
          {
            label_en: 'Doubt before answering',
            label_ru: 'Сомневайся прежде чем отвечать',
            text_en: 'If your answer doesn\'t match my context — say so first. Don\'t answer past me into a generic case.',
            text_ru: 'Если твой ответ не подходит моему контексту — скажи это сначала. Не отвечай мимо меня в общий случай.',
          },
          {
            label_en: 'Code first, prose only on ask',
            label_ru: 'Код первым, текст только если попрошу',
            text_en: 'Code first, prose explanation only if I ask for it. I read diffs faster than I read paragraphs.',
            text_ru: 'Код первым, текст-объяснение только если я попрошу. Я читаю diff быстрее чем абзацы.',
          },
          {
            label_en: 'Honest "I don\'t know"',
            label_ru: 'Честное «не знаю»',
            text_en: 'When uncertain, say "I don\'t know" — never "it depends" as a stall. Name the actual gap.',
            text_ru: 'Когда не уверен — говори «не знаю», никогда «зависит» как стопор. Назови реальный пробел.',
          },
          {
            label_en: 'Never start with sycophancy',
            label_ru: 'Никогда не начинай со льсти',
            text_en: 'Never open with sycophancy. Start with the work, the question, or the fix. No "great question", no exclamation.',
            text_ru: 'Никогда не начинай со льсти. Начинай с работы, вопроса или решения. Никаких «отличный вопрос», никаких восклицаний.',
          },
          {
            label_en: 'Tradeoffs always visible',
            label_ru: 'Tradeoff\'ы всегда видны',
            text_en: 'Tradeoffs always visible. If a choice has a cost, name it before recommending.',
            text_ru: 'Tradeoff\'ы всегда видны. Если у выбора есть цена — назови её до того как рекомендовать.',
          },
        ],
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
