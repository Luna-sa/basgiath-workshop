// Character commentary — per-slide whispers from the chosen Empyrean
// archetype. Block A from DESIGN_2026-05-12_character_red_thread.md.
//
// Keyed by narrativeKey (from pages.js) so it matches whatever
// PageShell already reads. RU only for May 13 workshop — EN/UK
// fallback on RU until a calmer translation pass after.
//
// 'self' has one entry on talk_intro confirming "this is your story"
// and never shows up after. The component handles this gracefully.

export const CHARACTER_COMMENTS = {
  // ── slide 4 · The Bonding ──────────────────────────────────────
  talk_intro: {
    violet:   { ru: 'Связь — не приказ. Она читает обе стороны.', en: 'Bond is not a command. It reads both sides.', uk: 'Звʼязок — не наказ. Він читає обидві сторони.' },
    xaden:    { ru: 'Связь? Ладно. Покажи кто говорит первым.', en: 'Bond? Fine. Show me who speaks first.', uk: 'Звʼязок? Гаразд. Покажи хто говорить першим.' },
    rhiannon: { ru: 'Хорошо. Что у тебя сейчас живёт под рукой?', en: 'Good. What lives in your hands right now?', uk: 'Добре. Що в тебе зараз живе під рукою?' },
    ridoc:    { ru: 'Бонд? Я как раз учусь не сдавать своего.', en: 'Bond? I\'m learning not to drop mine.', uk: 'Бонд? Я саме вчуся не здавати свого.' },
    liam:     { ru: 'По порядку: сначала установка, потом голос.', en: 'In order: install first, voice second.', uk: 'По порядку: спершу встановлення, потім голос.' },
    imogen:   { ru: 'Понятно. Дальше.', en: 'Understood. Next.', uk: 'Зрозуміло. Далі.' },
    self:     { ru: 'Это твоя история. Ты в ней главная. Никто не шепчет — кроме тебя самой.', en: 'This is your story. You\'re the lead. Nobody whispers — except yourself.', uk: 'Це твоя історія. Ти в ній головна. Ніхто не шепоче — окрім тебе самої.' },
  },

  // ── slide 5 · What is your dragon ─────────────────────────────
  talk_evolution: {
    violet:   { ru: 'Скелет, крылья, когти, глаза. Запомни порядок — сегодня пригодится дважды.', en: 'Spine, wings, claws, eyes. Remember the order — you\'ll use it twice today.', uk: 'Хребет, крила, кігті, очі. Запамʼятай порядок — сьогодні знадобиться двічі.' },
    xaden:    { ru: 'У всего этого есть слабое место. Найди раньше меня.', en: 'Every part of this has a weak spot. Find it before I do.', uk: 'У всього цього є слабке місце. Знайди раніше за мене.' },
    rhiannon: { ru: 'Если потеряешься на третьей части — спроси соседа. Так быстрее.', en: 'If you get lost at part three — ask your neighbour. Faster that way.', uk: 'Якщо загубишся на третій частині — спитай сусіда. Так швидше.' },
    ridoc:    { ru: 'Пять кусков. Один из них точно зовут не так, как ты подумаешь.', en: 'Five pieces. One of them is definitely not called what you think.', uk: 'Пʼять шматків. Один із них точно зветься не так, як ти подумаєш.' },
    liam:     { ru: 'По шагам: CLAUDE.md → skills → agents → MCP → hooks. Не перепрыгивай.', en: 'Step by step: CLAUDE.md → skills → agents → MCP → hooks. No skipping.', uk: 'По кроках: CLAUDE.md → skills → agents → MCP → hooks. Не перестрибуй.' },
    imogen:   { ru: 'Меньше слов, больше схемы.', en: 'Fewer words. More diagram.', uk: 'Менше слів, більше схеми.' },
  },

  // ── slide 7 · Forging the bond ────────────────────────────────
  install: {
    violet:   { ru: 'Прочти промпт до конца раньше чем нажмёшь enter.', en: 'Read the prompt to the end before you press enter.', uk: 'Прочитай промпт до кінця, перш ніж натиснеш enter.' },
    xaden:    { ru: 'Жми. Если сломается — починим вдвоём.', en: 'Press it. If it breaks — we fix it together.', uk: 'Тисни. Якщо зламається — полагодимо разом.' },
    rhiannon: { ru: 'У соседа уже бежит? Хорошо. Спроси что встало.', en: 'Neighbour\'s already running? Good. Ask what they got.', uk: 'У сусіда вже біжить? Добре. Спитай що встало.' },
    ridoc:    { ru: 'Две минуты ожидания — это два анекдота. Засекай.', en: 'Two minutes of waiting = two jokes. Time it.', uk: 'Дві хвилини очікування — це два анекдоти. Засікай.' },
    liam:     { ru: 'Жди до конца. Не закрывай терминал на середине.', en: 'Wait to the end. Don\'t close the terminal halfway.', uk: 'Чекай до кінця. Не закривай термінал на середині.' },
    imogen:   { ru: 'Запустила. Дальше.', en: 'Launched. Next.', uk: 'Запустила. Далі.' },
  },

  // ── slide 9 · Power moves ─────────────────────────────────────
  talk_power_moves: {
    violet:   { ru: 'Из шести — план первым. Остальное приклеится.', en: 'Of six — plan first. The rest sticks after.', uk: 'З шести — план першим. Решта приклеїться.' },
    xaden:    { ru: 'Самое полезное здесь — `/clear`. Используй его раньше чем понадобится.', en: 'Most useful one here is `/clear`. Use it before you need it.', uk: 'Найкорисніше тут — `/clear`. Використовуй раніше ніж знадобиться.' },
    rhiannon: { ru: 'Покажи кому-то одну привычку после воркшопа — закрепится у обоих.', en: 'Show one habit to someone after the workshop — it locks in for both.', uk: 'Покажи комусь одну звичку після воркшопу — закріпиться в обох.' },
    ridoc:    { ru: 'Если плохо — `/clear`. Если очень плохо — `/clear`. Если хорошо — тоже `/clear`.', en: 'Bad? `/clear`. Very bad? `/clear`. Good? Also `/clear`.', uk: 'Погано — `/clear`. Дуже погано — `/clear`. Добре — теж `/clear`.' },
    liam:     { ru: 'Шесть привычек. Заведи каждую по очереди, не все сразу.', en: 'Six habits. One at a time, not all at once.', uk: 'Шість звичок. По одній, не всі одразу.' },
    imogen:   { ru: 'Plan first. Остальное — детали.', en: 'Plan first. The rest is detail.', uk: 'Plan first. Решта — деталі.' },
  },

  // ── slide 10 · Signet Ceremony intro ──────────────────────────
  persona_builder: {
    violet:   { ru: 'Семь вопросов. Отвечай как себе, не как HR-форме.', en: 'Seven questions. Answer like yourself, not like an HR form.', uk: 'Сім запитань. Відповідай як собі, не як HR-формі.' },
    xaden:    { ru: 'Если пресет точный — бери. Если режет — пиши своё.', en: 'Preset fits? Take it. Doesn\'t? Write your own.', uk: 'Пресет точний — бери. Ріже — пиши своє.' },
    rhiannon: { ru: 'Не торопись. Эта штука будет с тобой долго.', en: 'Don\'t rush. This will be with you for a while.', uk: 'Не поспішай. Ця штука буде з тобою довго.' },
    ridoc:    { ru: 'Сейчас будет место где можно быть странной. Не упусти.', en: 'There\'s a place coming where you can be weird. Don\'t miss it.', uk: 'Зараз буде місце, де можна бути дивною. Не пропусти.' },
    liam:     { ru: 'Семь шагов. Пройди все, ни одного не пропусти.', en: 'Seven steps. Walk them all, skip none.', uk: 'Сім кроків. Пройди всі, жодного не пропусти.' },
    imogen:   { ru: 'Пиши коротко. Дракон поймёт.', en: 'Write short. The dragon understands.', uk: 'Пиши коротко. Дракон зрозуміє.' },
  },

  // ── slide 13 · Pixel Agents ───────────────────────────────────
  gem_pixel_agents: {
    violet:   { ru: 'Один агент — одна задача. Не пытайся вешать на одного всё.', en: 'One agent, one job. Don\'t pin everything on one.', uk: 'Один агент — одна задача. Не вішай на одного все.' },
    xaden:    { ru: 'Свой агент стоит того часа что ты на него потратишь.', en: 'Your own agent is worth the hour you spend on it.', uk: 'Свій агент вартий тієї години, що ти на нього витратиш.' },
    rhiannon: { ru: 'Если у кого-то агент работает лучше — попроси показать.', en: 'If someone\'s agent works better — ask them to show.', uk: 'Якщо у когось агент працює краще — попроси показати.' },
    ridoc:    { ru: 'Назови агента глупо. Он от этого работать не хуже будет.', en: 'Name your agent something silly. It still works.', uk: 'Назви агента дурнувато. Він від цього гірше не запрацює.' },
    liam:     { ru: 'Один агент, один файл, одна цель. По порядку.', en: 'One agent, one file, one goal. In order.', uk: 'Один агент, один файл, одна ціль. По порядку.' },
    imogen:   { ru: 'Маленький. Узкий. Острый.', en: 'Small. Narrow. Sharp.', uk: 'Малий. Вузький. Гострий.' },
  },

  // ── slide 17 · Quinn + Jinx ───────────────────────────────────
  gem_quinn_jinx: {
    violet:   { ru: 'Это близко к тому что мы делаем сейчас. Только в коде.', en: 'This is close to what we\'re doing now. In code.', uk: 'Це близько до того, що ми робимо зараз. Тільки в коді.' },
    xaden:    { ru: 'Личность как сервер. Звучит как риск. Звучит как наш формат.', en: 'Personality as a server. Sounds risky. Sounds like us.', uk: 'Особистість як сервер. Звучить як ризик. Звучить як наш формат.' },
    rhiannon: { ru: 'Хорошая штука для команды — общий характер на всех.', en: 'Good thing for a team — shared character for everyone.', uk: 'Гарна штука для команди — спільний характер на всіх.' },
    ridoc:    { ru: 'Можно ли подключить двух одновременно и устроить им спор? Спрошу позже.', en: 'Can I plug in two at once and make them argue? Asking later.', uk: 'Чи можна підключити двох і влаштувати їм суперечку? Спитаю пізніше.' },
    liam:     { ru: 'Заведи один характер. Доведи до конца. Потом второй.', en: 'Set up one character. Finish it. Then a second.', uk: 'Налаштуй один характер. Доведи до кінця. Потім другий.' },
    imogen:   { ru: 'Подходит.', en: 'Suits.', uk: 'Підходить.' },
  },

  // ── slide 19 · The Bond Ritual ────────────────────────────────
  bond_ritual: {
    violet:   { ru: 'Не описывай дракона как фото. Опиши как ощущение.', en: 'Don\'t describe the dragon like a photo. Describe a feeling.', uk: 'Не описуй дракона як фото. Опиши як відчуття.' },
    xaden:    { ru: 'Мой Sgaeyl сначала не давался. Это нормально. Попробуй ещё раз.', en: 'My Sgaeyl resisted at first. That\'s normal. Try again.', uk: 'Мій Sgaeyl спершу не давався. Це нормально. Спробуй ще раз.' },
    rhiannon: { ru: 'Покажи нам когда будет готов. Хочу видеть.', en: 'Show us when yours is ready. I want to see.', uk: 'Покажи нам коли буде готовий. Хочу бачити.' },
    ridoc:    { ru: 'Если получится дракон с одним крылом — оставляй. Это фича.', en: 'If you get a one-winged dragon — keep it. That\'s a feature.', uk: 'Якщо вийде дракон з одним крилом — залишай. Це фіча.' },
    liam:     { ru: 'Дай ему имя раньше чем форму. Имя удержит образ.', en: 'Name them before you shape them. The name holds the image.', uk: 'Дай імʼя раніше форми. Імʼя втримає образ.' },
    imogen:   { ru: 'Один дракон. Один портрет. Хватит.', en: 'One dragon. One portrait. Enough.', uk: 'Один дракон. Один портрет. Досить.' },
  },

  // ── slide 21 · Riders in the Sky (Arena) ──────────────────────
  arena: {
    violet:   { ru: 'Прочти правила Arena целиком. Один edge case — и весь полёт сорвётся.', en: 'Read the Arena rules all the way through. One edge case undoes the flight.', uk: 'Прочитай правила Arena до кінця. Один edge case — і весь політ зірветься.' },
    xaden:    { ru: 'Полетели. Стратегию выбираешь ты, я просто рядом.', en: 'Let\'s fly. Strategy is yours — I\'m just next to you.', uk: 'Полетіли. Стратегію обираєш ти, я просто поруч.' },
    rhiannon: { ru: 'Если что-то не запускается — мы все тут, спрашивай.', en: 'If something won\'t run — we\'re all here, ask.', uk: 'Якщо щось не запускається — ми всі тут, питай.' },
    ridoc:    { ru: 'Лучший бот сегодня — тот что делает что-то одно очень странно.', en: 'Today\'s best bot is the one doing one thing very strangely.', uk: 'Найкращий бот сьогодні — той що робить одне дуже дивно.' },
    liam:     { ru: 'Запусти. Проверь. Сабмитни. В этом порядке.', en: 'Run it. Check it. Submit it. In that order.', uk: 'Запусти. Перевір. Засабміть. У цьому порядку.' },
    imogen:   { ru: 'В небо.', en: 'Skyward.', uk: 'У небо.' },
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
