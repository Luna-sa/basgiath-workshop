// Empyrean / Fourth Wing wrap — page titles in lore vocabulary,
// italic subtitles that set tone, body text that does the actual
// QA work in plain language. Lore lives at the edges; the work
// underneath is real.
export const NARRATIVE = {
  landing: {
    title: 'Академия Басгиат',
    subtitle: '«A dragon without its rider is a tragedy. A rider without their dragon is dead.»',
    text: 'Военная академия, где люди связываются с драконами. Чтобы попасть в Квадрант Наездников, сначала нужно пересечь Парапет — каменный мост без перил над пропастью. Не все доходят. Сегодня твой дракон — Claude Code.',
  },
  character_select: {
    title: 'Threshing',
    subtitle: 'The dragon chooses the rider.',
    text: 'У каждого кадета свой способ выживать. Кто-то берёт стратегией, кто-то дерзостью, кто-то тащит за собой весь отряд. Выбери персонажа, чей стиль тебе ближе — он станет твоим напарником на воркшопе и дальше.',
  },
  registration: {
    title: 'Cross the Parapet',
    subtitle: 'Your name on the rolls.',
    text: 'В Басгиат анонимов не берут. Имя на бейдже, ник для входа на воркшоп, и подтверждение что Claude Code установлен.',
  },
  prework: {
    title: 'Parapet',
    subtitle: 'Cross before the bonding can begin.',
    text: 'Первая проверка — не на силу, а на готовность. Установи Claude Code и убедись что `claude --version` отдаёт версию. Без этого на воркшопе делать нечего.',
  },
  talk_intro: {
    title: 'The Bonding',
    subtitle: 'You don\'t use AI. You bond with one.',
    text: 'Сегодня ты не будешь «использовать AI». Ты соберёшь себе напарника с характером, ритуалами и голосом. Полтора часа, дальше — твой.',
  },
  talk_evolution: {
    title: 'What is your dragon',
    subtitle: 'Spine, wings, claws, eyes — the anatomy of Claude Code.',
    text: 'Claude Code это не один файл и не одна команда. Это система: CLAUDE.md (память про тебя), skills и agents (специализированные помощники), MCP-серверы (руки и глаза), hooks (рефлексы). Разберём по частям, увидим как одно срабатывает с другим.',
  },
  talk_modes: {
    title: 'Three modes, eight keys',
    subtitle: 'The grammar of riding.',
    text: 'Three working modes (Plan / Edit / Yolo) and a small set of hotkeys cover 90% of how you control Claude. Master Shift+Tab and /clear; the rest grows on you.',
  },
  install: {
    title: 'Forging the bond',
    subtitle: 'One prompt, one ecosystem.',
    text: 'Один промпт — и у тебя полная QA-экосистема: 7 команд, 4 агента, 3 MCP-сервера и настроенный CLAUDE.md. Скопируй промпт в Claude Code и подожди пару минут пока всё встанет.',
  },
  talk_power_moves: {
    title: 'Power moves',
    subtitle: 'Six habits that 5x your dragon.',
    text: 'Plan first, ask for the source, drag and drop, give the full error, /clear when context is full, and run sub-agents in parallel. These are the habits that separate users from riders.',
  },
  talk_ecosystem: {
    title: 'What flew in',
    subtitle: 'Look at what just bonded.',
    text: 'Разберём по частям: что делает каждая команда, зачем нужны агенты, как MCP-серверы дают AI доступ к браузеру и API.',
  },
  persona_builder: {
    title: 'The Signet Ceremony',
    subtitle: 'Seven rituals of bonding.',
    text: 'Семь ритуалов: Порог Имён, Обет, Запретное, Голос Связи, Сигил, Ежедневный Ритуал, Запечатывание. Каждый запечатывает кусочек голоса твоего bonded. В конце — твой персональный CLAUDE.md и Claude Code, который встречает тебя в этой связи.',
  },
  practice_tc: {
    title: 'Threshing the spec',
    subtitle: 'Match cases to features. Show your reading.',
    text: 'Открой sample-project и запусти /test-cases на форме регистрации. Посмотри что сгенерирует AI — и сравни с тем, что видишь сам.',
  },
  practice_br: {
    title: 'Gauntlet',
    subtitle: 'Climb the tiers. Find what others miss.',
    text: 'Найди баг в sample-project и оформи через /bug-report. В приложении специально заложены дефекты разной глубины — твоя задача их вытащить.',
  },
  talk_mcp: {
    title: 'Riders\' arts',
    subtitle: 'What a bonded rider can do.',
    text: 'MCP — это то, что превращает чат-бота в агента. Без MCP AI только отвечает на вопросы. С MCP — открывает браузер, тестирует API, создаёт issues. Покажу живьём.',
  },
  practice_mcp: {
    title: 'First flight',
    subtitle: 'Let the dragon fly.',
    text: 'Попроси AI открыть sample-project в браузере и протестировать регистрацию — пустые поля, невалидный email, пароль «1». Смотри как он работает.',
  },
  hidden_gems: {
    title: 'Hidden gems',
    subtitle: 'Things most riders don\'t know.',
    text: 'Семь штук — встроенные фичи Claude Code и community-проекты, которые либо радуют, либо реально меняют workflow. Идём по одной за слайд, у каждой — autopilot prompt: copy → paste в Claude → он сам ставит.',
  },
  gem_pixel_agents: {
    title: 'Pixel Agents',
    subtitle: 'Subagents, made visible.',
    text: 'VS Code расширение, которое визуализирует subagent-ы Claude Code как пиксельный офис. Превращает чёрный ящик параллельной работы в ambient awareness.',
  },
  gem_mempalace: {
    title: 'MemPalace',
    subtitle: 'Memory palace, literally.',
    text: 'Open-source MCP-память на markdown-файлах. 96.6% на LongMemEval, локально, без облака. Соавтор — Милла Йовович.',
  },
  gem_suzu_mcp: {
    title: 'suzu-mcp',
    subtitle: 'A bell when the dragon lands.',
    text: 'Spotify-трек играет каждый раз когда Claude закончил задачу. Имя — от японского ритуального колокольчика, который отмечает момент внимания.',
  },
  gem_tool_search: {
    title: 'ENABLE_TOOL_SEARCH',
    subtitle: 'One line, 85% context back.',
    text: 'Один env-флаг в settings.json. Lazy-load MCP-тулз вместо предзагрузки всей кучи. Overhead падает с 77K токенов до 8.7K каждый turn.',
  },
  gem_quinn_jinx: {
    title: 'Quinn + Jinx',
    subtitle: 'A methodical pair and a chaos pair.',
    text: 'Skill с двумя QA-персонажами. Quinn идёт по acceptance criteria. Jinx ломает специально. Adversarial-пара для exploratory testing.',
  },
  gem_channels: {
    title: 'Claude Code Channels',
    subtitle: 'Drive your dragon from your phone.',
    text: 'Anthropic-нативные каналы для Telegram / Discord / iMessage. Claude Code на ноуте, ты — в любом мессенджере. Проверять ночные autopilot-ы из кровати.',
  },
  arena: {
    title: 'Riders in the Sky',
    subtitle: 'Each rider writes how their dragon flies.',
    text: 'Каждый участник пишет behavior своего дракона через Claude Code. На финал — все 6 ботов на проекторе сражаются за звёзды. Кто собрал больше — тот и победил небо.',
  },
  quiz: {
    title: 'Battle Brief',
    subtitle: 'The commanders check what stuck.',
    text: 'Каждую неделю в Басгиат брифинг — командиры проверяют что кадеты усвоили. Не экзамен — разведка.',
  },
  wargames: {
    title: 'War Games',
    subtitle: 'Once a year the wings clash.',
    text: 'Раз в год крылья сражаются друг с другом. Покажи что у тебя получилось — лучшее submission на голосование зрителей.',
  },
  leaderboard: {
    title: 'Signets honoured',
    subtitle: 'Who took the sky.',
    text: 'Кто набрал больше, кто был быстрее, кто нашёл самый жирный баг.',
  },
  resources: {
    title: 'Bonded',
    subtitle: 'You walked in a cadet. You leave a rider.',
    text: 'Всё что собрали сегодня — autopilot-промпты, master setup, готовые handouts — здесь. Закрепи закладкой, возвращайся в любой день со своим ником.',
  },
  graduation: {
    title: 'First flight',
    subtitle: 'Take it home, rider.',
    text: 'Час назад кто-то из вас впервые открыл терминал. Сейчас у вас полная QA-экосистема — 7 команд, 4 агента, 3 MCP-сервера и AI-напарник с характером. Это был только Отбор.',
  },
}
