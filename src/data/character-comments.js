// Character commentary - per-slide whispers from the chosen Empyrean
// archetype. Block A from DESIGN_2026-05-12_character_red_thread.md.
//
// Keyed by narrativeKey (from pages.js) so it matches whatever
// PageShell already reads. All 25 slides × 6 characters × {ru, en, uk}.
//
// 'self' has one entry on talk_intro confirming "this is your story"
// and never shows up after. The component handles this gracefully.
//
// Voice rules (do not break):
//   - 1-2 sentences, ≤ 18 words in EN
//   - In-character first, slide-literal second
//   - Italic-display register: a quote, not a directive
//   - No corporate, no "you can ...", no "let's ..."
//   - No em-dashes; hyphens only
//   - «ёлочки» in RU/UK quotes; ʼ apostrophe in UK compounds

export const CHARACTER_COMMENTS = {
  // ── slide 0 · Basgiath Academy (landing) ──────────────────────
  landing: {
    violet:   { ru: 'Прежде чем войти - прочти что написано над дверью. Дважды.', en: 'Before you step in - read what\'s above the door. Twice.', uk: 'Перш ніж зайти - прочитай що написано над дверима. Двічі.' },
    xaden:    { ru: 'Академия. Хорошо. Внутри интереснее.', en: 'Academy. Fine. It\'s more interesting inside.', uk: 'Академія. Добре. Усередині цікавіше.' },
    rhiannon: { ru: 'Заходим вместе. Тут никто не идёт один.', en: 'We go in together. Nobody walks this alone.', uk: 'Заходимо разом. Тут ніхто не йде сам.' },
    ridoc:    { ru: 'Если над входом ничего страшного - это подозрительно.', en: 'If there\'s nothing scary above the gate - that\'s suspicious.', uk: 'Якщо над входом нічого страшного - це підозріло.' },
    liam:     { ru: 'Один шаг. Потом следующий. Так доходят.', en: 'One step. Then the next. That\'s how you arrive.', uk: 'Один крок. Потім наступний. Так доходять.' },
    imogen:   { ru: 'Внутрь.', en: 'In.', uk: 'Усередину.' },
  },

  // ── slide 1 · Threshing (character_select) ────────────────────
  character_select: {
    violet:   { ru: 'Выбирай того, кто думает как ты в худший день. Не в лучший.', en: 'Choose the one who thinks like you on your worst day. Not your best.', uk: 'Обирай того, хто думає як ти у найгірший день. Не в найкращий.' },
    xaden:    { ru: 'Бери того что страшно брать. Обычно это правильный.', en: 'Take the one that scares you to take. Usually right.', uk: 'Бери того, кого страшно брати. Зазвичай правильний.' },
    rhiannon: { ru: 'Не у всех будет тот же что у тебя. Так интереснее.', en: 'Not everyone will share yours. That\'s the fun part.', uk: 'Не у всіх буде той самий, що в тебе. Так цікавіше.' },
    ridoc:    { ru: 'Можно выбрать всех? Нет? Жаль. Тогда самого странного.', en: 'Can I pick all of them? No? Pity. The weirdest one then.', uk: 'Можна обрати всіх? Ні? Шкода. Тоді найдивнішого.' },
    liam:     { ru: 'Выбери один раз. Дальше не передумывай.', en: 'Pick once. Don\'t flip after.', uk: 'Обери раз. Далі не передумуй.' },
    imogen:   { ru: 'Меня.', en: 'Me.', uk: 'Мене.' },
  },

  // ── slide 2 · Cross the Parapet (registration) ────────────────
  registration: {
    violet:   { ru: 'Каждое поле - это твоё слово. Не пиши того что не выдержишь повторить.', en: 'Each field is a word you give. Don\'t write what you can\'t repeat.', uk: 'Кожне поле - це твоє слово. Не пиши того, що не витримаєш повторити.' },
    xaden:    { ru: 'Имя, почта, дальше. Парапет короче чем кажется.', en: 'Name, email, next. The parapet is shorter than it looks.', uk: 'Імʼя, пошта, далі. Парапет коротший ніж здається.' },
    rhiannon: { ru: 'Если ошибёшься в поле - просто заново. Никто не считает.', en: 'If you miss a field - just again. Nobody\'s counting.', uk: 'Якщо помилишся у полі - просто знову. Ніхто не лічить.' },
    ridoc:    { ru: 'Поле «имя» - можно вписать кличку дракона? Я бы так и сделал.', en: 'In the name field - can I put my dragon\'s nickname? I would.', uk: 'У полі «імʼя» - можна вписати кличку дракона? Я би так і зробив.' },
    liam:     { ru: 'Имя. Почта. Согласие. По одному, не пропуская.', en: 'Name. Email. Consent. One at a time, skip none.', uk: 'Імʼя. Пошта. Згода. По одному, нічого не пропускаючи.' },
    imogen:   { ru: 'Заполнено.', en: 'Filled.', uk: 'Заповнено.' },
  },

  // ── slide 3 · The Parapet (prework) ───────────────────────────
  prework: {
    violet:   { ru: 'Список не для галочки. Один пропущенный пункт - и ветер сдует на середине.', en: 'The list isn\'t a checkbox. One skipped item and the wind takes you mid-way.', uk: 'Список не для галочки. Один пропущений пункт - і вітер знесе посередині.' },
    xaden:    { ru: 'Node установлен, terminal жив? Хорошо. Идём.', en: 'Node installed, terminal alive? Good. We go.', uk: 'Node встановлено, термінал живий? Добре. Йдемо.' },
    rhiannon: { ru: 'Если у кого-то что-то не встало - кричи в чат. Поможем до старта.', en: 'If something didn\'t install for someone - shout in chat. We fix it before start.', uk: 'Якщо у когось щось не встало - кричи в чат. Поможемо до старту.' },
    ridoc:    { ru: 'Чек-лист до парапета. Чек-лист после парапета. Чек-лист про чек-листы.', en: 'Checklist before parapet. Checklist after. Checklist about checklists.', uk: 'Чек-лист до парапету. Чек-лист після. Чек-лист про чек-листи.' },
    liam:     { ru: 'Каждый пункт - галочка. Потом следующий. Не одновременно.', en: 'Each item - tick it. Then the next. Not in parallel.', uk: 'Кожен пункт - галочка. Потім наступний. Не одночасно.' },
    imogen:   { ru: 'Готов(а).', en: 'Ready.', uk: 'Готов(а).' },
  },

  // ── slide 4 · The Bonding ──────────────────────────────────────
  talk_intro: {
    violet:   { ru: 'Связь - не приказ. Она читает обе стороны.', en: 'Bond is not a command. It reads both sides.', uk: 'Звʼязок - не наказ. Він читає обидві сторони.' },
    xaden:    { ru: 'Связь? Ладно. Покажи кто говорит первым.', en: 'Bond? Fine. Show me who speaks first.', uk: 'Звʼязок? Гаразд. Покажи хто говорить першим.' },
    rhiannon: { ru: 'Хорошо. Что у тебя сейчас живёт под рукой?', en: 'Good. What lives in your hands right now?', uk: 'Добре. Що в тебе зараз живе під рукою?' },
    ridoc:    { ru: 'Бонд? Я как раз учусь не сдавать своего.', en: 'Bond? I\'m learning not to drop mine.', uk: 'Бонд? Я саме вчуся не здавати свого.' },
    liam:     { ru: 'По порядку: сначала установка, потом голос.', en: 'In order: install first, voice second.', uk: 'По порядку: спершу встановлення, потім голос.' },
    imogen:   { ru: 'Понятно. Дальше.', en: 'Understood. Next.', uk: 'Зрозуміло. Далі.' },
    self:     { ru: 'Это твоя история. Ты в ней главный персонаж. Никто не шепчет - кроме тебя.', en: 'This is your story. You\'re the lead. Nobody whispers - except yourself.', uk: 'Це твоя історія. Ти в ній головний персонаж. Ніхто не шепоче - окрім тебе.' },
  },

  // ── slide 5 · What is your dragon ─────────────────────────────
  talk_evolution: {
    violet:   { ru: 'Скелет, крылья, когти, глаза. Запомни порядок - сегодня пригодится дважды.', en: 'Spine, wings, claws, eyes. Remember the order - you\'ll use it twice today.', uk: 'Хребет, крила, кігті, очі. Запамʼятай порядок - сьогодні знадобиться двічі.' },
    xaden:    { ru: 'У всего этого есть слабое место. Найди раньше меня.', en: 'Every part of this has a weak spot. Find it before I do.', uk: 'У всього цього є слабке місце. Знайди раніше за мене.' },
    rhiannon: { ru: 'Если потеряешься на третьей части - спроси соседа. Так быстрее.', en: 'If you get lost at part three - ask your neighbour. Faster that way.', uk: 'Якщо загубишся на третій частині - спитай сусіда. Так швидше.' },
    ridoc:    { ru: 'Пять кусков. Один из них точно зовут не так, как ты подумаешь.', en: 'Five pieces. One of them is definitely not called what you think.', uk: 'Пʼять шматків. Один із них точно зветься не так, як ти подумаєш.' },
    liam:     { ru: 'По шагам: CLAUDE.md → skills → agents → MCP → hooks. Не перепрыгивай.', en: 'Step by step: CLAUDE.md → skills → agents → MCP → hooks. No skipping.', uk: 'По кроках: CLAUDE.md → skills → agents → MCP → hooks. Не перестрибуй.' },
    imogen:   { ru: 'Меньше слов, больше схемы.', en: 'Fewer words. More diagram.', uk: 'Менше слів, більше схеми.' },
  },

  // ── slide 6 · Three modes, eight keys ─────────────────────────
  talk_modes: {
    violet:   { ru: 'Plan - читать. Edit - писать. Auto - не смотреть. Не путай порядок.', en: 'Plan reads. Edit writes. Auto stops watching. Don\'t mix order.', uk: 'Plan - читати. Edit - писати. Auto - не дивитись. Не плутай порядок.' },
    xaden:    { ru: 'Yolo - мой режим. Не для всех. Не сейчас.', en: 'Yolo is my mode. Not for everyone. Not now.', uk: 'Yolo - мій режим. Не для всіх. Не зараз.' },
    rhiannon: { ru: 'Восемь хоткеев - запомнишь по одному в день. Никто не учит все сразу.', en: 'Eight hotkeys - one a day. Nobody learns all at once.', uk: 'Вісім хоткеїв - по одному на день. Ніхто не вчить усі одразу.' },
    ridoc:    { ru: 'Шифт-таб - моя любимая. Включает «а что если».', en: 'Shift-tab is my favourite. Turns on the «what if».', uk: 'Шифт-таб - моя улюблена. Вмикає «а що як».' },
    liam:     { ru: 'Plan, потом Edit. Yolo трогаем когда всё остальное привычно.', en: 'Plan first, then Edit. Yolo only when the rest is habit.', uk: 'Plan, потім Edit. Yolo - коли решта вже звичка.' },
    imogen:   { ru: 'Esc. Tab. Enter. Хватит.', en: 'Esc. Tab. Enter. Enough.', uk: 'Esc. Tab. Enter. Досить.' },
  },

  // ── slide 7 · Forging the bond ────────────────────────────────
  install: {
    violet:   { ru: 'Прочти промпт до конца раньше чем нажмёшь enter.', en: 'Read the prompt to the end before you press enter.', uk: 'Прочитай промпт до кінця, перш ніж натиснеш enter.' },
    xaden:    { ru: 'Жми. Если сломается - починим вдвоём.', en: 'Press it. If it breaks - we fix it together.', uk: 'Тисни. Якщо зламається - полагодимо разом.' },
    rhiannon: { ru: 'У соседа уже бежит? Хорошо. Спроси что встало.', en: 'Neighbour\'s already running? Good. Ask what they got.', uk: 'У сусіда вже біжить? Добре. Спитай що встало.' },
    ridoc:    { ru: 'Две минуты ожидания - это два анекдота. Засекай.', en: 'Two minutes of waiting = two jokes. Time it.', uk: 'Дві хвилини очікування - це два анекдоти. Засікай.' },
    liam:     { ru: 'Жди до конца. Не закрывай терминал на середине.', en: 'Wait to the end. Don\'t close the terminal halfway.', uk: 'Чекай до кінця. Не закривай термінал на середині.' },
    imogen:   { ru: 'Запущено. Дальше.', en: 'Launched. Next.', uk: 'Запущено. Далі.' },
  },

  // ── slide 8 · The QA Grimoire ─────────────────────────────────
  talk_ecosystem: {
    violet:   { ru: 'Заклинания, фамильяры, проводники. Названия игривые - суть строгая.', en: 'Incantations, familiars, conduits. The names play; the substance doesn\'t.', uk: 'Закляття, фамільяри, провідники. Назви грайливі - суть сувора.' },
    xaden:    { ru: 'Гримуар? Подходит. У всякого хорошего ритуала есть страница для крови.', en: 'Grimoire? Fits. Every good ritual has a page for blood.', uk: 'Гримуар? Підходить. У всякого доброго ритуалу є сторінка для крові.' },
    rhiannon: { ru: 'У кого какие заклинания работают - запоминай. Потом обменяемся.', en: 'Note whose incantations work. We\'ll trade later.', uk: 'У кого які закляття працюють - запамʼятовуй. Потім обміняємось.' },
    ridoc:    { ru: 'Если фамильяр выглядит как сова - я ему уже доверяю.', en: 'If the familiar looks like an owl - I already trust it.', uk: 'Якщо фамільяр виглядає як сова - я йому вже довіряю.' },
    liam:     { ru: 'Сначала одно заклинание. Освой. Потом следующее.', en: 'One incantation first. Own it. Then the next.', uk: 'Спершу одне закляття. Освой. Потім наступне.' },
    imogen:   { ru: 'Заклинание. Цель. Тишина.', en: 'Incantation. Target. Silence.', uk: 'Закляття. Ціль. Тиша.' },
  },

  // ── slide 9 · Power moves ─────────────────────────────────────
  talk_power_moves: {
    violet:   { ru: 'Из шести - план первым. Остальное приклеится.', en: 'Of six - plan first. The rest sticks after.', uk: 'З шести - план першим. Решта приклеїться.' },
    xaden:    { ru: 'Самое полезное здесь - `/clear`. Используй его раньше чем понадобится.', en: 'Most useful one here is `/clear`. Use it before you need it.', uk: 'Найкорисніше тут - `/clear`. Використовуй раніше ніж знадобиться.' },
    rhiannon: { ru: 'Покажи кому-то одну привычку после воркшопа - закрепится у обоих.', en: 'Show one habit to someone after the workshop - it locks in for both.', uk: 'Покажи комусь одну звичку після воркшопу - закріпиться в обох.' },
    ridoc:    { ru: 'Если плохо - `/clear`. Если очень плохо - `/clear`. Если хорошо - тоже `/clear`.', en: 'Bad? `/clear`. Very bad? `/clear`. Good? Also `/clear`.', uk: 'Погано - `/clear`. Дуже погано - `/clear`. Добре - теж `/clear`.' },
    liam:     { ru: 'Шесть привычек. Заведи каждую по очереди, не все сразу.', en: 'Six habits. One at a time, not all at once.', uk: 'Шість звичок. По одній, не всі одразу.' },
    imogen:   { ru: 'Plan first. Остальное - детали.', en: 'Plan first. The rest is detail.', uk: 'Plan first. Решта - деталі.' },
  },

  // ── slide 10 · Signet Ceremony intro ──────────────────────────
  persona_builder: {
    violet:   { ru: 'Семь вопросов. Отвечай как себе, не как HR-форме.', en: 'Seven questions. Answer like yourself, not like an HR form.', uk: 'Сім запитань. Відповідай як собі, не як HR-формі.' },
    xaden:    { ru: 'Если пресет точный - бери. Если режет - пиши своё.', en: 'Preset fits? Take it. Doesn\'t? Write your own.', uk: 'Пресет точний - бери. Ріже - пиши своє.' },
    rhiannon: { ru: 'Не торопись. Эта штука будет с тобой долго.', en: 'Don\'t rush. This will be with you for a while.', uk: 'Не поспішай. Ця штука буде з тобою довго.' },
    ridoc:    { ru: 'Сейчас будет место где можно быть странным(ой). Не упусти.', en: 'There\'s a place coming where you can be weird. Don\'t miss it.', uk: 'Зараз буде місце, де можна бути дивним(ою). Не пропусти.' },
    liam:     { ru: 'Семь шагов. Пройди все, ни одного не пропусти.', en: 'Seven steps. Walk them all, skip none.', uk: 'Сім кроків. Пройди всі, жодного не пропусти.' },
    imogen:   { ru: 'Пиши коротко. Дракон поймёт.', en: 'Write short. The dragon understands.', uk: 'Пиши коротко. Дракон зрозуміє.' },
  },

  // ── slide 11 · Riders' arts (talk_mcp) ────────────────────────
  talk_mcp: {
    violet:   { ru: 'MCP - это руки дракона до чужих библиотек. Не вешай лишних рук.', en: 'MCP is your dragon\'s reach into other libraries. Don\'t hang spare arms.', uk: 'MCP - це руки дракона до чужих бібліотек. Не вішай зайвих рук.' },
    xaden:    { ru: 'Любая внешняя штука - дверь. Двери бывают и для врага.', en: 'Every outside hook is a door. Doors work both ways.', uk: 'Будь-яка зовнішня штука - двері. Двері працюють в обидва боки.' },
    rhiannon: { ru: 'У кого какие MCP стоят - покажите друг другу после блока.', en: 'Whose MCPs are running what - show each other after the block.', uk: 'У кого які MCP стоять - покажіть одне одному після блоку.' },
    ridoc:    { ru: 'Если в названии MCP больше дефисов чем букв - беру.', en: 'If an MCP name has more dashes than letters - I take it.', uk: 'Якщо в назві MCP більше дефісів ніж літер - беру.' },
    liam:     { ru: 'Один MCP. Проверь что работает. Потом следующий.', en: 'One MCP. Verify it runs. Then the next.', uk: 'Один MCP. Перевір що працює. Потім наступний.' },
    imogen:   { ru: 'Берёшь то что режет. Остальное мусор.', en: 'Take what cuts. The rest is clutter.', uk: 'Береш те, що ріже. Решта - сміття.' },
  },

  // ── slide 12 · Hidden gems intro ──────────────────────────────
  hidden_gems: {
    violet:   { ru: 'Шесть штук от сообщества. Не каждая твоя - но одна точно.', en: 'Six community things. Not all yours - but one definitely is.', uk: 'Шість штук від спільноти. Не всі твої - але одна точно.' },
    xaden:    { ru: 'Самые острые штуки делают не в офисах. Эти - оттуда.', en: 'The sharpest things aren\'t made in offices. These are.', uk: 'Найгостріші штуки роблять не в офісах. Ці - звідти.' },
    rhiannon: { ru: 'Сообщество - это шесть незнакомцев которые сделали что-то для тебя.', en: 'Community is six strangers who built something for you.', uk: 'Спільнота - це шестеро незнайомців, які зробили щось для тебе.' },
    ridoc:    { ru: 'Гемы - это секретное меню. Заказывай.', en: 'Gems are the secret menu. Order from it.', uk: 'Геми - це секретне меню. Замовляй.' },
    liam:     { ru: 'Пять. Открывай по одному. Не глотай всё.', en: 'Five. Open one by one. Don\'t swallow them all.', uk: 'Пʼять. Відкривай по одному. Не ковтай усе.' },
    imogen:   { ru: 'Пять. Возьму одну.', en: 'Five. I\'ll take one.', uk: 'Пʼять. Візьму одну.' },
  },

  // ── slide 14 · MemPalace ──────────────────────────────────────
  gem_mempalace: {
    violet:   { ru: 'Память - не свалка. Что не нужно через месяц - не клади.', en: 'Memory isn\'t a dump. What you won\'t need in a month - don\'t store.', uk: 'Памʼять - не звалище. Що не потрібно через місяць - не клади.' },
    xaden:    { ru: 'Долгая память делает связь опаснее. И вернее.', en: 'Long memory makes the bond riskier. And truer.', uk: 'Довга памʼять робить звʼязок небезпечнішим. І вірнішим.' },
    rhiannon: { ru: 'То что один раз сказал - вернётся в нужный момент. Если положишь.', en: 'What you said once will return when needed. If you store it.', uk: 'Те що сказав раз - повернеться у потрібну мить. Якщо покладеш.' },
    ridoc:    { ru: 'Мой палац памяти - бар. Помнит всё, наливает по запросу.', en: 'My memory palace is a pub. Remembers everything, pours on request.', uk: 'Мій палац памʼяті - бар. Памʼятає все, наливає на запит.' },
    liam:     { ru: 'Запиши факт. Один раз. Не повторяй на каждой странице.', en: 'Write the fact once. Don\'t repeat it on every page.', uk: 'Запиши факт. Раз. Не повторюй на кожній сторінці.' },
    imogen:   { ru: 'Помню. Молчу.', en: 'I remember. I keep quiet.', uk: 'Памʼятаю. Мовчу.' },
  },

  // ── slide 15 · suzu-mcp ───────────────────────────────────────
  gem_suzu_mcp: {
    violet:   { ru: 'Маленький MCP с конкретной задачей. Это и есть правильная форма.', en: 'A small MCP with one clear job. That\'s the right shape.', uk: 'Маленький MCP з конкретною задачею. Це і є правильна форма.' },
    xaden:    { ru: 'Малое всегда быстрее большого. Этот - малое.', en: 'Small always beats big on speed. This one\'s small.', uk: 'Мале завжди швидше за велике. Цей - мале.' },
    rhiannon: { ru: 'Чужой автор делает - можно сказать спасибо в issues. Это редкое.', en: 'Someone else built it - go say thanks in issues. That\'s rare.', uk: 'Хтось зробив - подякуй в issues. Це рідко.' },
    ridoc:    { ru: 'suzu - звучит как имя дракона. Уже хорошо.', en: '«suzu» sounds like a dragon name. Already good.', uk: '«suzu» звучить як імʼя дракона. Уже добре.' },
    liam:     { ru: 'Поставь. Прочти README. Потом тыкай.', en: 'Install. Read README. Then poke it.', uk: 'Встанови. Прочитай README. Потім тицяй.' },
    imogen:   { ru: 'Малый. Беру.', en: 'Small. Mine.', uk: 'Малий. Беру.' },
  },

  // ── slide 16 · ENABLE_TOOL_SEARCH ─────────────────────────────
  gem_tool_search: {
    violet:   { ru: 'Один флаг меняет как дракон выбирает оружие. Не игнорь.', en: 'One flag changes how the dragon picks its weapon. Don\'t ignore.', uk: 'Один прапорець змінює як дракон обирає зброю. Не ігноруй.' },
    xaden:    { ru: 'Флаг включён - больше когтей. Ну да.', en: 'Flag on - more claws. Yeah.', uk: 'Прапорець увімкнено - більше кігтів. Звісно.' },
    rhiannon: { ru: 'У кого включено - тот находит инструмент быстрее. Поделись.', en: 'Whoever flips it on finds tools faster. Pass it on.', uk: 'У кого ввімкнено - той знаходить інструмент швидше. Поділись.' },
    ridoc:    { ru: 'Назвали ENABLE_TOOL_SEARCH. Назвали бы НАЙДИ_МНЕ_ЧТО_НИБУДЬ - честнее.', en: 'They called it ENABLE_TOOL_SEARCH. «FIND_ME_SOMETHING» would be honest.', uk: 'Назвали ENABLE_TOOL_SEARCH. «ЗНАЙДИ_ЩОСЬ» - чесніше.' },
    liam:     { ru: 'Включи. Перезапусти. Проверь что дракон видит. По шагам.', en: 'Turn on. Restart. Check the dragon sees it. Steps.', uk: 'Увімкни. Перезапусти. Перевір що дракон бачить. По кроках.' },
    imogen:   { ru: 'On.', en: 'On.', uk: 'Увімк.' },
  },

  // ── slide 17 · Quinn + Jinx ───────────────────────────────────
  gem_quinn_jinx: {
    violet:   { ru: 'Это близко к тому что мы делаем сейчас. Только в коде.', en: 'This is close to what we\'re doing now. In code.', uk: 'Це близько до того, що ми робимо зараз. Тільки в коді.' },
    xaden:    { ru: 'Личность как сервер. Звучит как риск. Звучит как наш формат.', en: 'Personality as a server. Sounds risky. Sounds like us.', uk: 'Особистість як сервер. Звучить як ризик. Звучить як наш формат.' },
    rhiannon: { ru: 'Хорошая штука для команды - общий характер на всех.', en: 'Good thing for a team - shared character for everyone.', uk: 'Гарна штука для команди - спільний характер на всіх.' },
    ridoc:    { ru: 'Можно ли подключить двух одновременно и устроить им спор? Спрошу позже.', en: 'Can I plug in two at once and make them argue? Asking later.', uk: 'Чи можна підключити двох і влаштувати їм суперечку? Спитаю пізніше.' },
    liam:     { ru: 'Заведи один характер. Доведи до конца. Потом второй.', en: 'Set up one character. Finish it. Then a second.', uk: 'Налаштуй один характер. Доведи до кінця. Потім другий.' },
    imogen:   { ru: 'Подходит.', en: 'Suits.', uk: 'Підходить.' },
  },

  // ── slide 18 · Claude Code Channels ───────────────────────────
  gem_channels: {
    violet:   { ru: 'Каналы - это разделение голоса по задачам. Не смешивай в один.', en: 'Channels split voice by job. Don\'t blend them into one.', uk: 'Канали - це поділ голосу за задачами. Не змішуй в один.' },
    xaden:    { ru: 'Несколько каналов - больше фронтов. Я люблю фронт.', en: 'Many channels - many fronts. I like fronts.', uk: 'Кілька каналів - більше фронтів. Я люблю фронт.' },
    rhiannon: { ru: 'Канал для общего, канал для тихого. У всех уже так с друзьями.', en: 'A channel for loud, a channel for quiet. We do that with friends already.', uk: 'Канал для гучного, канал для тихого. Уже так робимо з друзями.' },
    ridoc:    { ru: 'Хочу канал «спросить глупое». Подпишусь сразу.', en: 'I want a «dumb questions» channel. I\'m subscribing first.', uk: 'Хочу канал «дурне питання». Підпишусь одразу.' },
    liam:     { ru: 'Один канал на цель. Не больше. Иначе теряется.', en: 'One channel per goal. No more. Or it scatters.', uk: 'Один канал на ціль. Не більше. Інакше губиться.' },
    imogen:   { ru: 'Канал. Цель. Закрыла.', en: 'Channel. Goal. Closed.', uk: 'Канал. Ціль. Закрила.' },
  },

  // ── slide 19 · The Bond Ritual ────────────────────────────────
  bond_ritual: {
    violet:   { ru: 'Не описывай дракона как фото. Опиши как ощущение.', en: 'Don\'t describe the dragon like a photo. Describe a feeling.', uk: 'Не описуй дракона як фото. Опиши як відчуття.' },
    xaden:    { ru: 'Мой Sgaeyl сначала не давался. Это нормально. Попробуй ещё раз.', en: 'My Sgaeyl resisted at first. That\'s normal. Try again.', uk: 'Мій Sgaeyl спершу не давався. Це нормально. Спробуй ще раз.' },
    rhiannon: { ru: 'Покажи нам когда будет готов. Хочу видеть.', en: 'Show us when yours is ready. I want to see.', uk: 'Покажи нам коли буде готовий. Хочу бачити.' },
    ridoc:    { ru: 'Если получится дракон с одним крылом - оставляй. Это фича.', en: 'If you get a one-winged dragon - keep it. That\'s a feature.', uk: 'Якщо вийде дракон з одним крилом - залишай. Це фіча.' },
    liam:     { ru: 'Дай ему имя раньше чем форму. Имя удержит образ.', en: 'Name them before you shape them. The name holds the image.', uk: 'Дай імʼя раніше форми. Імʼя втримає образ.' },
    imogen:   { ru: 'Один дракон. Один портрет. Хватит.', en: 'One dragon. One portrait. Enough.', uk: 'Один дракон. Один портрет. Досить.' },
  },

  // ── slide 20 · The Aerie ──────────────────────────────────────
  aerie: {
    violet:   { ru: 'Голосуй за того кого читаешь дольше всего. Глаз не лжёт.', en: 'Vote for the one you keep reading. The eye doesn\'t lie.', uk: 'Голосуй за того, кого читаєш найдовше. Око не бреше.' },
    xaden:    { ru: 'Самый опасный дракон сегодня - не самый красивый. Запомни.', en: 'The most dangerous dragon today isn\'t the prettiest. Note.', uk: 'Найнебезпечніший дракон сьогодні - не найкращий на вигляд. Запамʼятай.' },
    rhiannon: { ru: 'Голосуем честно. За чужого тоже можно - не обязательно за своего.', en: 'Vote honest. For someone else\'s is fine - not always yours.', uk: 'Голосуємо чесно. За чужого теж можна - не обовʼязково свого.' },
    ridoc:    { ru: 'Голосуй за того что бы взял в бар. Я серьёзно.', en: 'Vote for the one you\'d take to a pub. Seriously.', uk: 'Голосуй за того, кого взяв би в бар. Серйозно.' },
    liam:     { ru: 'Посмотри всех. Потом голосуй. Не за первого.', en: 'Look at all of them. Then vote. Not the first.', uk: 'Поглянь усіх. Потім голосуй. Не за першого.' },
    imogen:   { ru: 'Этот.', en: 'That one.', uk: 'Цей.' },
  },

  // ── slide 21 · Riders in the Sky (Arena) ──────────────────────
  arena: {
    violet:   { ru: 'Прочти правила Arena целиком. Один edge case - и весь полёт сорвётся.', en: 'Read the Arena rules all the way through. One edge case undoes the flight.', uk: 'Прочитай правила Arena до кінця. Один edge case - і весь політ зірветься.' },
    xaden:    { ru: 'Полетели. Стратегию выбираешь ты, я просто рядом.', en: 'Let\'s fly. Strategy is yours - I\'m just next to you.', uk: 'Полетіли. Стратегію обираєш ти, я просто поруч.' },
    rhiannon: { ru: 'Если что-то не запускается - мы все тут, спрашивай.', en: 'If something won\'t run - we\'re all here, ask.', uk: 'Якщо щось не запускається - ми всі тут, питай.' },
    ridoc:    { ru: 'Лучший бот сегодня - тот что делает что-то одно очень странно.', en: 'Today\'s best bot is the one doing one thing very strangely.', uk: 'Найкращий бот сьогодні - той що робить одне дуже дивно.' },
    liam:     { ru: 'Запусти. Проверь. Сабмитни. В этом порядке.', en: 'Run it. Check it. Submit it. In that order.', uk: 'Запусти. Перевір. Засабміть. У цьому порядку.' },
    imogen:   { ru: 'В небо.', en: 'Skyward.', uk: 'У небо.' },
  },

  // ── slide 22 · Signets honoured (leaderboard) ─────────────────
  leaderboard: {
    violet:   { ru: 'Цифры показывают что произошло. Не кто чего стоит.', en: 'Numbers show what happened. Not who is worth what.', uk: 'Цифри показують що сталося. Не хто чого вартий.' },
    xaden:    { ru: 'Я бы пересмотрел тех кто на втором. Они опаснее первых.', en: 'I\'d watch the ones in second. More dangerous than first.', uk: 'Я би придивився до тих, що другі. Небезпечніші за перших.' },
    rhiannon: { ru: 'Имена сверху - запомни. С ними ещё поработаешь.', en: 'Names at the top - remember them. You\'ll work with them again.', uk: 'Імена згори - запамʼятай. Ще працюватимеш з ними.' },
    ridoc:    { ru: 'Если я внизу - это стратегия. Если сверху - случайность.', en: 'If I\'m at the bottom - strategy. At the top - accident.', uk: 'Якщо я знизу - стратегія. Згори - випадковість.' },
    liam:     { ru: 'Сравнивай только с собой час назад. Так честнее.', en: 'Compare only to yourself an hour ago. Fairer.', uk: 'Порівнюй лише з собою годину тому. Чесніше.' },
    imogen:   { ru: 'Ок.', en: 'Ok.', uk: 'Гаразд.' },
  },

  // ── slide 23 · First flight (graduation) ──────────────────────
  graduation: {
    violet:   { ru: 'Самое важное сегодня - не последний слайд. Тот что ты дочитываешь молча.', en: 'Today\'s big moment isn\'t the last slide. It\'s the one you read in silence.', uk: 'Найважливіше сьогодні - не останній слайд. Той, що ти дочитуєш мовчки.' },
    xaden:    { ru: 'Окно открыто. Полетишь без меня. Я уже рядом.', en: 'Window\'s open. You fly. I\'m beside.', uk: 'Вікно відкрите. Полетиш без мене. Я вже поруч.' },
    rhiannon: { ru: 'Унеси одну вещь. Расскажи о ней кому-то на этой неделе.', en: 'Take one thing with you. Tell someone about it this week.', uk: 'Забери одну річ. Розкажи про неї комусь цього тижня.' },
    ridoc:    { ru: 'Первый полёт - всегда косой. Это и есть первый.', en: 'First flight is always crooked. That\'s what makes it first.', uk: 'Перший політ - завжди косий. Тому й перший.' },
    liam:     { ru: 'Сделано. Закрепи. Через неделю повтори.', en: 'Done. Lock it. Repeat in a week.', uk: 'Зроблено. Закріпи. Через тиждень повтори.' },
    imogen:   { ru: 'Готов(а) летать.', en: 'Ready to fly.', uk: 'Готов(а) летіти.' },
  },

  // ── slide 24 · Bonded (resources) ─────────────────────────────
  resources: {
    violet:   { ru: 'Сохрани только то к чему вернёшься во вторник. Остальное - шум.', en: 'Save only what you\'ll reach for Tuesday. The rest is noise.', uk: 'Збережи тільки те, до чого повернешся у вівторок. Решта - шум.' },
    xaden:    { ru: 'Забирай всё. Разберёшь когда понадобится.', en: 'Take it all. Sort when needed.', uk: 'Забирай усе. Розбереш коли знадобиться.' },
    rhiannon: { ru: 'Поделись ссылкой с одним другом. Так возвращаются вместе.', en: 'Share a link with one friend. That\'s how you come back together.', uk: 'Поділись посиланням з одним другом. Так повертаються разом.' },
    ridoc:    { ru: 'Закладку «прочитать позже» открывают только драконы. Я проверял.', en: 'Only dragons open the «read later» tab. I checked.', uk: 'Закладку «прочитати пізніше» відкривають лише дракони. Я перевіряв.' },
    liam:     { ru: 'Скачай. Положи в одну папку. Назови понятно.', en: 'Download. One folder. Name it clearly.', uk: 'Скачай. Одна тека. Назви зрозуміло.' },
    imogen:   { ru: 'Беру. Иду.', en: 'Taking. Going.', uk: 'Беру. Йду.' },
  },

  // ── slide 25 · Three Champions (final reveal) ─────────────────
  champions: {
    violet:   { ru: 'Трое - не случайность. Каждый прошёл тот же путь что и ты. Запомни лица.', en: 'Three - not luck. Each walked what you walked. Remember the faces.', uk: 'Троє - не випадковість. Кожен пройшов той самий шлях, що й ти. Запамʼятай обличчя.' },
    xaden:    { ru: 'Они там не потому что лучшие. Потому что не сошли.', en: 'They\'re there not because best. Because they didn\'t step off.', uk: 'Вони там не бо найкращі. Бо не зійшли.' },
    rhiannon: { ru: 'Подойди к одному из них после. Скажи спасибо в глаза.', en: 'Walk up to one after. Say thanks face to face.', uk: 'Підійди до одного з них після. Скажи дякую в очі.' },
    ridoc:    { ru: 'Трое чемпионов и я в баре. Картинка года.', en: 'Three champions and me in a pub. Image of the year.', uk: 'Троє чемпіонів і я в барі. Картина року.' },
    liam:     { ru: 'Посмотри. Запомни. Возвращайся к этим именам через месяц.', en: 'Look. Note. Come back to these names in a month.', uk: 'Поглянь. Запамʼятай. Повернись до цих імен за місяць.' },
    imogen:   { ru: 'Троє. Достойно.', en: 'Three. Worthy.', uk: 'Троє. Гідно.' },
  },

  // ── Bonus gem categories
  gem_design_skills: {
    violet:   { ru: 'Не все четыре сразу. Возьми один, дай ему неделю осесть. Потом следующий.', en: 'Not all four at once. Take one, give it a week to settle. Then the next.', uk: 'Не всі чотири одразу. Візьми один, дай йому тиждень осісти. Потім наступний.' },
    xaden:    { ru: 'Поставь impeccable первым. Сразу увидишь сколько халтуры у тебя в проде.', en: 'Install impeccable first. You\'ll see how much slop is in your prod right now.', uk: 'Постав impeccable першим. Одразу побачиш скільки халтури у тебе в проді.' },
    rhiannon: { ru: 'Покажи дизайнеру design-extract. У вас будет один общий язык на следующем стендапе.', en: 'Show design-extract to a designer. You\'ll share one language at the next standup.', uk: 'Покажи design-extract дизайнеру. У вас буде одна мова на наступному стендапі.' },
    ridoc:    { ru: 'open-design + четыре стола в баре = вечер где все спорят про motion.', en: 'open-design + four pub tables = an evening where everyone argues about motion.', uk: 'open-design + чотири столи в барі = вечір де всі сперечаються про motion.' },
    liam:     { ru: 'Один skill, один проект, одна неделя. Не перескакивай.', en: 'One skill, one project, one week. No leaps.', uk: 'Один skill, один проєкт, один тиждень. Не перестрибуй.' },
    imogen:   { ru: 'taste-skill. Хватит.', en: 'taste-skill. Enough.', uk: 'taste-skill. Досить.' },
  },
  gem_browser_automation: {
    violet:   { ru: 'Три инструмента - не выбирай по моде. Возьми тот что подходит твоему случаю.', en: 'Three tools - don\'t pick by hype. Pick the one fitting your case.', uk: 'Три інструменти - не обирай за модою. Візьми той що підходить твоєму випадку.' },
    xaden:    { ru: 'PinchTab - 12MB бинарник. Запускается быстрее чем ты доберёшься до браузера.', en: 'PinchTab - 12MB binary. Boots faster than you can reach your browser.', uk: 'PinchTab - 12MB бінарник. Запускається швидше ніж ти дійдеш до браузера.' },
    rhiannon: { ru: 'У соседа Playwright уже падает? Покажи browser-harness. Он лечится сам.', en: 'Neighbour\'s Playwright failing? Show them browser-harness. It heals itself.', uk: 'У сусіда Playwright уже падає? Покажи browser-harness. Він лікується сам.' },
    ridoc:    { ru: 'agent-browser - это когда твоему боту нужны руки, а не глаза.', en: 'agent-browser - for when your bot needs hands, not eyes.', uk: 'agent-browser - це коли твоєму боту потрібні руки, а не очі.' },
    liam:     { ru: 'Сначала agent-browser - простой. Потом PinchTab если нужна параллельность.', en: 'agent-browser first - simple. Then PinchTab if you need parallel.', uk: 'Спершу agent-browser - простий. Потім PinchTab якщо треба паралельність.' },
    imogen:   { ru: 'Один сайт. Три попытки. Хватит.', en: 'One site. Three tries. Enough.', uk: 'Один сайт. Три спроби. Досить.' },
  },
  gem_smart_helpers: {
    violet:   { ru: 'Understand-Anything первым. Карту проекта стоит увидеть до того как тронешь файл.', en: 'Understand-Anything first. See the project map before you touch a file.', uk: 'Understand-Anything першим. Побач мапу проєкту перш ніж торкнешся файлу.' },
    xaden:    { ru: 'caveman режет токены на 22-87%. Поставь сегодня - сэкономишь до квартала.', en: 'caveman cuts tokens 22-87%. Install today - save through the quarter.', uk: 'caveman ріже токени на 22-87%. Постав сьогодні - заощадиш до кварталу.' },
    rhiannon: { ru: 'CLI-Anything - покажи на стендапе. Команда поймёт за тридцать секунд.', en: 'CLI-Anything - demo at standup. The team will get it in thirty seconds.', uk: 'CLI-Anything - покажи на стендапі. Команда зрозуміє за тридцять секунд.' },
    ridoc:    { ru: 'n8n-mcp - наконец-то Claude перестанет валить workflows тихо.', en: 'n8n-mcp - finally Claude stops failing workflows silently.', uk: 'n8n-mcp - нарешті Claude перестане валити workflows тихо.' },
    liam:     { ru: 'Четыре утилиты, по одной в день. К пятнице будет рутина.', en: 'Four utilities, one a day. By Friday it\'s a routine.', uk: 'Чотири утиліти, по одній на день. До пʼятниці буде рутина.' },
    imogen:   { ru: 'caveman. Дальше.', en: 'caveman. Next.', uk: 'caveman. Далі.' },
  },
  gem_skills_marketplace: {
    violet:   { ru: 'skills.sh - перед тем как писать свой skill, поищи там. Половину работы кто-то уже сделал.', en: 'skills.sh - before authoring a skill, search there. Half the work is done.', uk: 'skills.sh - перш ніж писати свій skill, пошукай там. Половину роботи хтось уже зробив.' },
    xaden:    { ru: 'anthropic-skills - реверс-инжинирь их. Так быстрее чем читать доки.', en: 'anthropic-skills - reverse-engineer them. Faster than reading docs.', uk: 'anthropic-skills - реверс-інжинір їх. Швидше ніж читати доки.' },
    rhiannon: { ru: 'awesome-claude-code - подпишись на repo. Star → апдейты прилетают сами.', en: 'awesome-claude-code - subscribe to the repo. Star → updates land on you.', uk: 'awesome-claude-code - підпишись на repo. Star → апдейти прилітають самі.' },
    ridoc:    { ru: 'superpowers - skill который оркеструет skills. Skill-инцепция. Я в восторге.', en: 'superpowers - a skill that orchestrates skills. Skill-inception. I love it.', uk: 'superpowers - skill який оркеструє skills. Skill-інцепція. Я в захваті.' },
    liam:     { ru: 'Сначала skills.sh. Потом anthropic-skills. Потом superpowers. По порядку.', en: 'skills.sh first. Then anthropic-skills. Then superpowers. In order.', uk: 'Спершу skills.sh. Потім anthropic-skills. Потім superpowers. По порядку.' },
    imogen:   { ru: 'skills.sh. Иди.', en: 'skills.sh. Go.', uk: 'skills.sh. Іди.' },
  },
}

/**
 * Resolve the commentary line for a slide + character + locale.
 * Returns string or null if no commentary is defined for this
 * combination. Safe to call without guards.
 */
export function getCharacterComment(slideKey, characterId, lang = 'ru') {
  if (!slideKey || !characterId) return null
  const slide = CHARACTER_COMMENTS[slideKey]
  if (!slide) return null
  const character = slide[characterId]
  if (!character) return null
  return character[lang] || character.ru || character.en || null
}
