// Gem data — shared between Hidden Gems intro slide and per-gem deep-dive
// slides. Each gem gets a deep-dive slide with: tagline → what it is →
// why it matters → who it's for → install prompt.

export const GEMS = [
  {
    id: 'pixel-agents',
    eyebrow: 'visual fun',
    name: 'Pixel Agents',
    tagline_en: 'Your subagents become pixel workers in a tiny office.',
    tagline_ru: 'Твои subagents становятся пиксельными работниками в крошечном офисе.',
    tagline_uk: 'Твої subagents стають піксельними працівниками у крихітному офісі.',
    pullQuote_en: 'A glance and you know what every agent is doing.',
    pullQuote_ru: 'Взглянул — и знаешь чем занят каждый агент.',
    pullQuote_uk: 'Глянув — і знаєш, чим зайнятий кожен агент.',
    stats: [
      { value: 'VS Code', label: 'extension' },
      { value: '∞', label: 'parallel agents' },
      { value: 'Fast Co.', label: 'feature, Feb \'26' },
    ],

    body_en: `pablodelucca/pixel-agents — a VS Code extension that
visualises Claude Code's subagent activity as a tiny pixel-art office.

Every time Claude spawns a subagent (via Task tool, parallel research,
review-while-you-code, etc.), a pixel character walks across the office
floor, sits at a desk, and starts typing. A second agent is reading a
file? You see them flipping through pages. Waiting on a permission
prompt? They tap their foot impatiently. Done with the task? They get
up and walk off.

The status bar shows what each agent is doing in plain text in parallel,
so the pixel art is the at-a-glance layer and the text is the precision
layer. Featured in Fast Company in February 2026 as "the charming
pixel-art game that solves one of AI coding's most annoying UX
problems".`,
    body_ru: `pablodelucca/pixel-agents — расширение для VS Code, которое
визуализирует работу subagent-ов Claude Code как крошечный пиксельный
офис.

Каждый раз когда Claude спавнит subagent (через Task tool, параллельные
исследования, review-while-you-code и так далее) — пиксельный персонаж
проходит по офису, садится за стол, начинает печатать. Второй агент
читает файл? Видишь как он листает страницы. Ждёт разрешения? Нетерпеливо
постукивает ногой. Закончил? Встаёт и уходит.

Статус-бар параллельно показывает что каждый агент делает простым
текстом — пиксельный офис это at-a-glance слой, текст — precision слой.
Fast Company в феврале 2026 написали про него: «charming pixel-art game
which solves one of AI coding's most annoying UX problems».`,
    body_uk: `pablodelucca/pixel-agents — розширення для VS Code, яке
візуалізує роботу subagents Claude Code як крихітний піксельний офіс.

Щоразу, коли Claude спавнить subagent (через Task tool, паралельні
дослідження, review-while-you-code тощо), піксельний персонаж іде
офісом, сідає за стіл і починає друкувати. Другий агент читає файл?
Бачиш, як він гортає сторінки. Чекає на дозвіл? Нетерпляче тупотить
ногою. Закінчив? Встає і йде.

Статус-бар паралельно показує, що робить кожен агент простим текстом -
піксельний офіс це at-a-glance шар, текст — precision шар. Fast Company
у лютому 2026 написали про нього: «charming pixel-art game which solves
one of AI coding's most annoying UX problems».`,

    why_en: `Subagents are the most powerful and the most opaque part of
Claude Code. Run a parallel review and you stare at a single "Working..."
spinner with no idea who's doing what. Pixel Agents turns that black
box into ambient awareness — a glance and you know "oh, three agents
running, one's stuck on permission, two are reading docs". Reduces
the urge to interrupt prematurely.`,
    why_ru: `Subagent-ы — самая мощная и самая непрозрачная часть Claude
Code. Запускаешь параллельный review — смотришь на один «Working...»
spinner и не знаешь кто что делает. Pixel Agents превращает чёрный
ящик в ambient awareness — взглянул и видишь «ок, три агента работают,
один застрял на разрешении, два читают доки». Убирает желание прервать
раньше времени.`,
    why_uk: `Subagents — найпотужніша і найнепрозоріша частина Claude
Code. Запускаєш паралельний review — дивишся на один «Working...»
spinner і не знаєш, хто що робить. Pixel Agents перетворює чорний ящик
на ambient awareness — глянув і бачиш «ок, три агенти працюють, один
застряг на дозволі, два читають доки». Прибирає бажання перервати
зарано.`,

    use_cases_en: [
      'Long parallel reviews where you walk away — pixel art tells you when something needs attention without you switching focus.',
      'Demo-ing Claude Code to teammates — visual makes "what is an agent" click instantly.',
      'Background autopilot loops — quick visual confirmation that work is actually happening.',
    ],
    use_cases_ru: [
      'Длинные параллельные review когда отходишь — пиксели показывают что нужно внимание, без переключения фокуса.',
      'Демо Claude Code коллегам — визуальное мгновенно объясняет «что такое агент».',
      'Фоновые autopilot-циклы — быстрое визуальное подтверждение что работа реально идёт.',
    ],
    use_cases_uk: [
      'Довгі паралельні review, коли відходиш — пікселі показують, що потребує уваги, без перемикання фокусу.',
      'Демо Claude Code колегам — візуалка миттєво пояснює «що таке агент».',
      'Фонові autopilot-цикли — швидке візуальне підтвердження, що робота реально йде.',
    ],

    install_en: `Install Pixel Agents from VS Code Marketplace:
1. Open VS Code → Extensions tab
2. Search "Pixel Agents"
3. Install → reload window
4. Run any Claude Code task that spawns subagents`,
    install_ru: `Установка Pixel Agents:
1. VS Code → Extensions
2. Поиск "Pixel Agents"
3. Install → reload window
4. Запусти любую задачу в Claude Code которая спавнит subagents`,
    url: 'https://github.com/pablodelucca/pixel-agents',
  },

  {
    id: 'mempalace',
    eyebrow: 'persistent memory',
    name: 'MemPalace',
    tagline_en: 'Open-source memory layer co-authored by Milla Jovovich.',
    tagline_ru: 'Open-source AI-память. Соавтор — актриса Милла Йовович.',
    tagline_uk: 'Open-source AI-памʼять. Співавтор — акторка Мілла Йовович.',
    pullQuote_en: 'Beats the paid clouds, runs entirely on your laptop.',
    pullQuote_ru: 'Обходит платные облака. Работает целиком на твоём ноуте.',
    pullQuote_uk: 'Обходить платні хмари. Працює цілком на твоєму ноуті.',
    stats: [
      { value: '96.6%', label: 'LongMemEval', accent: true },
      { value: '85%', label: 'Mem0' },
      { value: '82%', label: 'Zep' },
    ],

    body_en: `mempalace/mempalace — a free, fully local memory system
for Claude Code released April 2026. Replaces the proprietary memory
backends (Mem0, Zep, OpenAI memory) with a markdown-first MCP server
you run on your own machine.

Memory is stored as plain markdown files organised into "halls" and
"rooms" — yes, the literal classical memory-palace metaphor. Each fact
you teach Claude becomes a markdown drawer in a room you can browse
in any text editor. Vector search runs through Chroma, metadata
through SQLite, embeddings through Ollama or a built-in mini-model
(no API key, no cloud round-trip).

The benchmark numbers are the headline: **96.6% on LongMemEval** —
LongMemEval being the standard test for "can your AI remember things
across long conversations". Mem0 sits around 85%, Zep around 82%.
That's a meaningful jump.

The story-hook everyone shares: **Milla Jovovich** (yes, that one —
Resident Evil, The Fifth Element) is listed as co-author on the repo.
She actually writes commits. Turns out she's been a Linux user for
twenty years and has been quietly shipping open-source for a while.`,
    body_ru: `mempalace/mempalace — бесплатная, полностью локальная
система памяти для Claude Code, вышла апрель 2026. Заменяет проприетарные
memory-backend-ы (Mem0, Zep, OpenAI memory) на markdown-first MCP-сервер
который ты запускаешь у себя.

Память хранится как обычные markdown-файлы, организованные в «залы» и
«комнаты» — да, буквально классическая метафора memory palace. Каждый
факт, который ты учишь Claude, становится markdown-drawer-ом в комнате
которую можно открыть в любом текстовом редакторе. Vector search через
Chroma, метаданные через SQLite, embeddings через Ollama или встроенную
мини-модель (без API ключа, без cloud round-trip).

Цифры benchmark — главный заголовок: **96.6% на LongMemEval** —
LongMemEval это стандартный тест на «умеет ли твой AI помнить через
длинные разговоры». Mem0 — около 85%, Zep — около 82%. Это заметный
скачок.

История которую все пересылают: **Милла Йовович** (да-да, та самая —
Resident Evil, Fifth Element) числится соавтором репозитория. Реально
пишет коммиты. Оказывается, она 20 лет на Linux и тихо контрибьютит
в опенсорс.`,
    body_uk: `mempalace/mempalace — безкоштовна, повністю локальна
система памʼяті для Claude Code, вийшла у квітні 2026. Замінює
пропрієтарні memory-backend-и (Mem0, Zep, OpenAI memory) на
markdown-first MCP-сервер, який ти запускаєш у себе.

Памʼять зберігається як звичайні markdown-файли, організовані у «зали»
та «кімнати» — так, буквально класична метафора memory palace. Кожен
факт, який ти вчиш Claude, стає markdown-drawer-ом у кімнаті, яку
можна відкрити у будь-якому текстовому редакторі. Vector search через
Chroma, метадані через SQLite, embeddings через Ollama або вбудовану
міні-модель (без API-ключа, без cloud round-trip).

Цифри benchmark — головний заголовок: **96.6% на LongMemEval** -
LongMemEval це стандартний тест на «чи вміє твій AI памʼятати крізь
довгі розмови». Mem0 — близько 85%, Zep — близько 82%. Це помітний
стрибок.

Історія, яку всі пересилають: **Мілла Йовович** (так-так, та сама -
Resident Evil, Fifth Element) числиться співавтором репозиторію.
Реально пише коміти. Виявляється, вона 20 років на Linux і тихо
контрибʼютить в опенсорс.`,

    why_en: `Claude Code without memory is a smart amnesiac. Every
session you start from zero — explain who you are, what you're working
on, what conventions matter. Memory layers fix this, but Mem0 and Zep
are paid clouds with your data leaving your laptop. MemPalace gives
you the same quality (better, actually) with files you own, on a
machine you control. And it works through MCP, so any MCP-aware client
can read it — not just Claude.`,
    why_ru: `Claude Code без памяти — умный амнезик. Каждая сессия
начинается с нуля — объясняешь кто ты, над чем работаешь, какие
конвенции важны. Memory-слои это решают, но Mem0 и Zep — платные облака,
твои данные уходят с ноута. MemPalace даёт то же качество (лучше, по
факту) на твоих файлах, на твоей машине. И работает через MCP — то есть
любой MCP-клиент может читать, не только Claude.`,
    why_uk: `Claude Code без памʼяті — розумний амнезик. Кожна сесія
починається з нуля — пояснюєш, хто ти, над чим працюєш, які конвенції
важливі. Memory-шари це вирішують, але Mem0 і Zep — платні хмари, твої
дані йдуть з ноута. MemPalace дає ту саму якість (краще, по факту) на
твоїх файлах, на твоїй машині. І працює через MCP — тобто будь-який
MCP-клієнт може читати, не лише Claude.`,

    use_cases_en: [
      'Cross-project memory — Claude remembers your CLAUDE.md style, naming conventions, and "we always X never Y" rules.',
      'Long-running creative projects (novels, courses, branding) — facts about characters/style/voice persist across months.',
      'Personal knowledge ledger — drop in observations, retrieve them later by semantic search instead of grep.',
    ],
    use_cases_ru: [
      'Cross-project память — Claude помнит твой CLAUDE.md стиль, naming conventions, правила «всегда X, никогда Y».',
      'Длинные творческие проекты (романы, курсы, брендинг) — факты про персонажей/стиль/голос держатся месяцами.',
      'Личный knowledge ledger — кидаешь наблюдения, достаёшь по semantic search вместо grep.',
    ],
    use_cases_uk: [
      'Cross-project памʼять — Claude памʼятає твій CLAUDE.md стиль, naming conventions, правила «завжди X, ніколи Y».',
      'Довгі творчі проєкти (романи, курси, брендинг) — факти про персонажів/стиль/голос тримаються місяцями.',
      'Особистий knowledge ledger — кидаєш спостереження, дістаєш через semantic search замість grep.',
    ],

    install_en: `Install MemPalace via Claude Code (let it set up Chroma + Ollama):

I want to install MemPalace as an MCP-native memory system for Claude Code.

1. Clone https://github.com/mempalace/mempalace into ~/dev/mempalace
2. Read its README and follow the install steps for my OS (macOS / Linux / Windows).
3. Make sure Ollama is installed and the embedding model from the README is pulled.
4. Add the MCP server entry to my ~/.claude/mcp_servers.json.
5. After setup, run a quick "store fact" + "recall fact" smoke test through Claude.
6. Tell me to restart Claude Code so MCP loads.`,
    install_ru: `Установить MemPalace через Claude Code (он сам поднимет Chroma + Ollama):

Хочу поставить MemPalace как MCP-native AI-память для Claude Code.

1. Клонируй https://github.com/mempalace/mempalace в ~/dev/mempalace
2. Прочитай README и пройди по установке для моей OS (macOS / Linux / Windows).
3. Убедись что Ollama стоит и embedding-модель из README скачана.
4. Добавь MCP-сервер в ~/.claude/mcp_servers.json.
5. После установки запусти быстрый smoke-тест: «запиши факт» + «вспомни факт».
6. Напомни перезапустить Claude Code чтобы MCP подхватился.`,
    url: 'https://github.com/mempalace/mempalace',
  },

  {
    id: 'suzu-mcp',
    eyebrow: 'completion sounds',
    name: 'suzu-mcp',
    tagline_en: 'A Spotify track plays every time Claude finishes a task.',
    tagline_ru: 'Spotify-трек играет каждый раз когда Claude закончил задачу.',
    tagline_uk: 'Spotify-трек грає щоразу, коли Claude закінчив задачу.',
    pullQuote_en: 'A bell that marks the moment of attention.',
    pullQuote_ru: 'Колокольчик, который отмечает момент внимания.',
    pullQuote_uk: 'Дзвіночок, який позначає момент уваги.',
    stats: [
      { value: '🔔', label: 'suzu (鈴)' },
      { value: '∞', label: 'tracks per event' },
      { value: 'on-Stop', label: 'hook trigger' },
    ],

    body_en: `denar90/suzu-mcp — a Claude Code MCP server named after
the Japanese ritual bell (suzu, 鈴) used in Shinto shrines to mark
the moment of attention. The metaphor fits: when your dragon finishes
a task, you get a tiny acoustic punctuation mark.

How it actually works: suzu hooks into Claude's task-completion event
and triggers Spotify (via your personal Spotify Developer credentials)
to play a track of your choice. Could be the Half-Life "scientist
mumbling", the Mass Effect "Galaxy at war" sting, the Nintendo
"item-get" jingle, the first three seconds of Strauss's "Also sprach
Zarathustra" — anything that's on Spotify and short enough not to
distract.

You're free to assign **different tracks to different Claude actions**:
one sound for "task complete", another for "test passed", another for
"PR merged". Pair it with hooks (the on-Stop event) and you get a
fully customised acoustic feedback loop.`,
    body_ru: `denar90/suzu-mcp — MCP-сервер для Claude Code, назван
в честь японского ритуального колокольчика (suzu, 鈴), которым в
синтоистских святилищах отмечают момент внимания. Метафора в точку:
когда твой дракон закончил задачу — получаешь крошечный акустический
знак препинания.

Как реально работает: suzu хукается в task-completion event Claude и
триггерит Spotify (через твои персональные Spotify Developer
credentials) проиграть трек на твой выбор. Может быть mumbling
учёного из Half-Life, Galaxy-at-war sting из Mass Effect, item-get
jingle из Nintendo, первые три секунды «Also sprach Zarathustra»
Штрауса — что угодно что есть в Spotify и достаточно короткое чтобы
не отвлекать.

Можно назначить **разные треки на разные действия Claude**: один звук
на «задача готова», другой на «тесты прошли», третий на «PR смержен».
Combo с hooks (event on-Stop) — полностью кастомный acoustic feedback
loop.`,
    body_uk: `denar90/suzu-mcp — MCP-сервер для Claude Code, названий на
честь японського ритуального дзвіночка (suzu, 鈴), яким у синтоїстських
святилищах позначають момент уваги. Метафора влучна: коли твій дракон
закінчив задачу — отримуєш крихітний акустичний розділовий знак.

Як реально працює: suzu чіпляється до task-completion event Claude і
триґерить Spotify (через твої персональні Spotify Developer credentials)
програти трек на твій вибір. Може бути mumbling вченого з Half-Life,
Galaxy-at-war sting з Mass Effect, item-get jingle з Nintendo, перші
три секунди «Also sprach Zarathustra» Штрауса — будь-що, що є в Spotify
і достатньо коротке, щоб не відволікати.

Можна призначити **різні треки на різні дії Claude**: один звук на
«задача готова», інший на «тести пройшли», третій на «PR змержено».
Combo з hooks (event on-Stop) — повністю кастомний acoustic feedback
loop.`,

    why_en: `Claude tasks can run for 30 seconds or 30 minutes. You
can't keep eyes on the terminal that whole time, so you switch tabs,
forget, come back ten minutes later. suzu fixes this with the cheapest
possible attention-grab — a sound. It also adds a tiny endorphin
release per task because your brain hears "win". Sounds silly. Works
disproportionately well.`,
    why_ru: `Задачи Claude бегут от 30 секунд до 30 минут. Глаза в
терминале всё это время держать не получается — переключаешься,
забываешь, возвращаешься через десять минут. suzu решает это самым
дешёвым attention-grab — звуком. Плюс добавляет маленький endorphin-hit
на каждую задачу потому что мозг слышит «win». Звучит глупо.
Срабатывает непропорционально хорошо.`,
    why_uk: `Задачі Claude біжать від 30 секунд до 30 хвилин. Очі в
терміналі весь цей час тримати не виходить — перемикаєшся, забуваєш,
повертаєшся через десять хвилин. suzu вирішує це найдешевшим
attention-grab — звуком. Плюс додає маленький endorphin-hit на кожну
задачу, бо мозок чує «win». Звучить тупо. Спрацьовує непропорційно
добре.`,

    use_cases_en: [
      'Long autopilot runs — kick off, walk to make coffee, sound calls you back the second it finishes.',
      'Multiple Claude windows in parallel — different track per window so you know which one finished.',
      'Pure delight — assign a chord progression you love to "merge complete" and feel actively glad about closing tasks.',
    ],
    use_cases_ru: [
      'Длинные autopilot-прогоны — запустила, пошла за кофе, звук зовёт обратно как только закончилось.',
      'Несколько окон Claude параллельно — разный трек на окно, понятно какое закончило.',
      'Чистое удовольствие — назначь любимую гармонию на «merge complete» и реально радуйся закрытию задач.',
    ],
    use_cases_uk: [
      'Довгі autopilot-прогони — запустила, пішла за кавою, звук кличе назад, щойно закінчилося.',
      'Декілька вікон Claude паралельно — різний трек на вікно, зрозуміло, яке закінчило.',
      'Чисте задоволення — признач улюблену гармонію на «merge complete» і реально радій закриттю задач.',
    ],

    install_en: `Install suzu-mcp via Claude Code:

Install denar90/suzu-mcp from https://github.com/denar90/suzu-mcp

1. Read its README to find install steps + Spotify auth flow
2. Set up Spotify Developer credentials (need a personal app + redirect URI)
3. Add the MCP server entry to ~/.claude/mcp_servers.json
4. Configure my "completion track" — pick something short and recognisable
5. Test it: ask Claude to "list 3 files in this directory" and see if Spotify plays`,
    install_ru: `Установить suzu-mcp через Claude Code:

Установи denar90/suzu-mcp с https://github.com/denar90/suzu-mcp

1. Прочитай README — там install steps + Spotify auth flow
2. Заведи Spotify Developer credentials (нужно персональное app + redirect URI)
3. Добавь MCP-сервер в ~/.claude/mcp_servers.json
4. Настрой completion-трек — выбери что-то короткое и узнаваемое
5. Тест: попроси Claude «list 3 files» и посмотри играет ли Spotify`,
    url: 'https://github.com/denar90/suzu-mcp',
  },

  {
    id: 'tool-search',
    eyebrow: 'undocumented flag',
    name: 'ENABLE_TOOL_SEARCH',
    tagline_en: '85% context savings with one settings.json line. Lazy-loads MCP tools.',
    tagline_ru: '85% контекста обратно одной строкой в settings.json. Lazy-load MCP-тулзы.',
    tagline_uk: '85% контексту назад одним рядком у settings.json. Lazy-load MCP-тулзи.',
    pullQuote_en: 'One env flag. Eighty-five percent of your context back.',
    pullQuote_ru: 'Один env-флаг. Восемьдесят пять процентов контекста назад.',
    pullQuote_uk: 'Один env-прапорець. Вісімдесят пʼять відсотків контексту назад.',
    stats: [
      { value: '77K', label: 'tokens · OFF' },
      { value: '8.7K', label: 'tokens · ON', accent: true },
      { value: '−85%', label: 'overhead' },
    ],

    body_en: `One environment flag with disproportionate impact:

\`\`\`json
{ "env": { "ENABLE_TOOL_SEARCH": "true" } }
\`\`\`

Drop it into \`~/.claude/settings.json\`, restart Claude Code,
done.

What it actually changes: by default, Claude loads the schema of
**every** MCP tool you have configured into the system prompt at the
start of every turn. With 50+ tools (filesystem, playwright, render,
mongodb, github, notion, mempalace, etc.) that overhead averages
**~77,000 tokens per turn** — every single back-and-forth.

With ENABLE_TOOL_SEARCH on, the system flips to lazy-load. Claude
sees a small index of tool names + one-line descriptions. When it
needs a specific tool, it fetches that one schema on demand. Total
overhead drops to **~8,700 tokens** — roughly 85% reduction. Same
capabilities, much more headroom for actual work.

Anthropic announced it officially **January 14, 2026**, but it's still
absent from most "getting started" docs and onboarding flows. So
people install 30 MCP servers, hit context-pressure surprisingly fast,
and never know there's a single-line fix.`,
    body_ru: `Один env-флаг с непропорциональным эффектом:

\`\`\`json
{ "env": { "ENABLE_TOOL_SEARCH": "true" } }
\`\`\`

Кладёшь в \`~/.claude/settings.json\`, рестартуешь Claude Code,
готово.

Что реально меняется: по дефолту Claude грузит схему **каждого**
MCP-тула который у тебя сконфигурен в system prompt в начале каждого
turn. С 50+ тулзами (filesystem, playwright, render, mongodb, github,
notion, mempalace и так далее) overhead в среднем **~77,000 токенов
на turn** — каждый обмен.

С ENABLE_TOOL_SEARCH включённым система переключается на lazy-load.
Claude видит маленький индекс — названия тулз + однострочные описания.
Когда нужен конкретный тул — забирает только его схему по требованию.
Общий overhead падает до **~8,700 токенов** — примерно 85% снижение.
Те же возможности, гораздо больше места под реальную работу.

Anthropic анонсировали официально **14 января 2026**, но до сих пор
отсутствует в большинстве «getting started» доков и onboarding-флоу.
Поэтому люди ставят 30 MCP-серверов, неожиданно быстро упираются в
context pressure и не знают что есть однострочный фикс.`,
    body_uk: `Один env-прапорець із непропорційним ефектом:

\`\`\`json
{ "env": { "ENABLE_TOOL_SEARCH": "true" } }
\`\`\`

Кладеш у \`~/.claude/settings.json\`, рестартуєш Claude Code, готово.

Що реально змінюється: за замовчуванням Claude вантажить схему
**кожного** MCP-тула, який у тебе сконфігуровано, у system prompt на
початку кожного turn. З 50+ тулзами (filesystem, playwright, render,
mongodb, github, notion, mempalace тощо) overhead у середньому
**~77,000 токенів на turn** — кожен обмін.

З увімкненим ENABLE_TOOL_SEARCH система перемикається на lazy-load.
Claude бачить маленький індекс — назви тулз + однорядкові описи. Коли
потрібен конкретний тул — забирає лише його схему за вимогою. Загальний
overhead падає до **~8,700 токенів** — приблизно 85% зниження. Ті самі
можливості, набагато більше місця під реальну роботу.

Anthropic анонсували офіційно **14 січня 2026**, але досі відсутній у
більшості «getting started» доків і onboarding-флоу. Тому люди ставлять
30 MCP-серверів, несподівано швидко впираються в context pressure і не
знають, що є однорядковий фікс.`,

    why_en: `If your sessions hit "context too long" warnings or just
feel slower than they should, this is the first thing to check. 85%
saved overhead means longer conversations before /clear, more room for
actual code/text in context, and noticeably faster responses (less
tokens to process per turn). For QA workflows specifically — where
you're often juggling test data, screenshots, and tool output — the
extra headroom is the difference between "Claude got confused" and
"Claude held the whole context".`,
    why_ru: `Если сессии бьют «context too long» или просто кажутся
медленнее чем должны — это первое что проверить. 85% сэкономленного
overhead — это более длинные разговоры до /clear, больше места под
реальный код/текст в контексте и заметно быстрее ответы (меньше токенов
обрабатывать на turn). Для QA-workflow specifically — где жонглируешь
test data, скриншотами и tool output — этот headroom это разница
между «Claude запутался» и «Claude держит весь контекст».`,
    why_uk: `Якщо сесії бʼють «context too long» або просто здаються
повільнішими, ніж мають бути — це перше, що перевірити. 85%
зекономленого overhead — це довші розмови до /clear, більше місця під
реальний код/текст у контексті і помітно швидші відповіді (менше
токенів обробляти на turn). Для QA-workflow specifically — де
жонглюєш test data, скриншотами і tool output — цей headroom це
різниця між «Claude заплутався» і «Claude тримає весь контекст».`,

    use_cases_en: [
      'Heavy MCP setups (10+ servers) — pretty much mandatory.',
      'Long-running planning sessions where /clear would break flow.',
      'Anyone hitting "context approaching limit" warnings — try this before splitting work.',
    ],
    use_cases_ru: [
      'Тяжёлые MCP-настройки (10+ серверов) — практически обязательно.',
      'Длинные planning-сессии где /clear ломает flow.',
      'Любой кто видит «context approaching limit» — попробуй это до того как дробить работу.',
    ],
    use_cases_uk: [
      'Важкі MCP-конфігурації (10+ серверів) — практично обовʼязково.',
      'Довгі planning-сесії, де /clear ламає flow.',
      'Будь-хто, хто бачить «context approaching limit» — спробуй це до того, як дробити роботу.',
    ],

    install_en: `Open ~/.claude/settings.json (create if missing).
If an "env" block already exists — merge, don't overwrite.

{
  "env": {
    "ENABLE_TOOL_SEARCH": "true"
  }
}

Save. Restart Claude Code (kill the process + start fresh).

Verify: in a new session, run /status — context usage should be
visibly lower than before (8-15k tokens instead of 77k+).`,
    install_ru: `Открой ~/.claude/settings.json (создай если нет).
Если блок "env" уже есть — слей, не перетирай.

{
  "env": {
    "ENABLE_TOOL_SEARCH": "true"
  }
}

Сохрани. Перезапусти Claude Code (убей процесс + старт заново).

Проверь: в новой сессии запусти /status — контекст должен
заметно упасть (8-15k токенов вместо 77k+).`,
    install_uk: `Відкрий ~/.claude/settings.json (створи якщо нема).
Якщо блок "env" вже є — злий, не перетирай.

{
  "env": {
    "ENABLE_TOOL_SEARCH": "true"
  }
}

Збережи. Перезапусти Claude Code (вбий процес + запусти заново).

Перевір: у новій сесії запусти /status — контекст має помітно
впасти (8-15k токенів замість 77k+).`,
    url: 'https://paddo.dev/blog/claude-code-hidden-mcp-flag/',
  },

  {
    id: 'quinn-jinx',
    eyebrow: 'qa personas',
    name: 'Quinn + Jinx (qa-test skill)',
    tagline_en: 'Two QA personas baked into a skill. Quinn checks success criteria. Jinx breaks things.',
    tagline_ru: 'Две QA-персоны в одном skill. Quinn проверяет success criteria. Jinx ломает всё.',
    tagline_uk: 'Дві QA-персони в одному skill. Quinn перевіряє success criteria. Jinx ламає все.',
    pullQuote_en: 'A careful tester paired with a chaos tester. The gap between them is the find.',
    pullQuote_ru: 'Аккуратный тестировщик и хаос-тестировщик в паре. Разрыв между ними — и есть находка.',
    pullQuote_uk: 'Акуратний тестувальник і хаос-тестувальник у парі. Розрив між ними — і є знахідка.',
    stats: [
      { value: 'Quinn', label: 'methodical · acceptance' },
      { value: 'Jinx', label: 'chaos · edge cases' },
      { value: 'pair', label: 'adversarial' },
    ],

    body_en: `adampaulwalker/qa-test — a Claude Code skill that ships
with two named personas you can summon, swap between, or run side by
side. Each has a different testing philosophy hard-baked into the
prompt:

**Quinn — methodical tester.**
Walks through acceptance criteria one by one. Cross-references the
spec. Produces structured test reports with pass/fail per criterion,
evidence (which file/line/screenshot proved it), and severity
classification. Useful for the work that gets signed off.

**Jinx — chaos tester.**
Doesn't trust the spec. Assumes the dev forgot something. Tries
unicode emoji in number fields, 50,000-character strings, double-clicks
on submit, race conditions, browser back-button mid-flow, expired
tokens, network kill mid-upload. Finds the bugs Quinn would never
look at because Quinn was reading the requirement.

The pair works because they disagree on what "tested" means. Quinn
says "all criteria met → ship it". Jinx says "I haven't broken it
hard enough yet → don't ship". When you run both on a feature,
the gaps between their reports are usually the most interesting
finds.`,
    body_ru: `adampaulwalker/qa-test — Claude Code skill, который
поставляется с двумя именованными персонажами. Можешь вызывать одного,
переключаться, или запускать бок о бок. У каждого своя философия
тестирования, зашитая в prompt:

**Quinn — методический тестировщик.**
Идёт по acceptance criteria по пунктам. Сверяется со спецификацией.
Выдаёт структурированный test report с pass/fail на критерий,
evidence (какой файл/строка/скриншот это доказали) и severity
classification. Это та работа, которую подписывают на ship.

**Jinx — chaos tester.**
Не доверяет спеке. Считает что dev забыл что-то. Пробует unicode
emoji в числовых полях, строки на 50000 символов, double-click на
submit, race conditions, browser back-button по середине flow,
протухшие токены, network kill по середине upload. Находит баги
которые Quinn никогда не посмотрит потому что Quinn читает
requirement.

Пара работает потому что они расходятся в определении «протестировано».
Quinn говорит «все критерии выполнены → ship». Jinx говорит «я ещё
недостаточно сломал → не ship». Когда запускаешь обоих — gap между
их отчётами обычно самое интересное.`,
    body_uk: `adampaulwalker/qa-test — Claude Code skill, який
постачається з двома іменованими персонажами. Можеш викликати одного,
перемикатися або запускати пліч-о-пліч. У кожного своя філософія
тестування, зашита в prompt:

**Quinn — методичний тестувальник.**
Іде по acceptance criteria по пунктах. Звіряється зі специфікацією.
Видає структурований test report з pass/fail на критерій, evidence
(який файл/рядок/скриншот це довели) і severity classification. Це та
робота, яку підписують на ship.

**Jinx — chaos tester.**
Не довіряє спеці. Вважає, що dev щось забув. Пробує unicode emoji у
числових полях, рядки на 50000 символів, double-click на submit, race
conditions, browser back-button посередині flow, протухлі токени,
network kill посередині upload. Знаходить баги, які Quinn ніколи не
подивиться, бо Quinn читає requirement.

Пара працює, бо вони розходяться у визначенні «протестовано». Quinn
каже «усі критерії виконано — ship». Jinx каже «я ще недостатньо
зламав — не ship». Коли запускаєш обох — gap між їхніми звітами
зазвичай найцікавіше.`,

    why_en: `Most AI testing skills do one thing — usually "generate
test cases from a spec". Quinn+Jinx makes the testing AI **adversarial
to itself**. The methodical pass and the chaotic pass have different
biases, so running both catches things a single persona would miss.
This is what real human QA teams do — pair a careful tester with an
"oh let me try this weird thing" tester. The skill captures that
dynamic.`,
    why_ru: `Большинство AI-тестинг-скиллов делают одну вещь — обычно
«генерируй тест-кейсы из спеки». Quinn+Jinx делает testing AI
**adversarial к самому себе**. Методичный проход и хаотичный проход
имеют разные bias-ы, поэтому два прохода ловят то что один пропустил
бы. Так и работают живые QA-команды — пара аккуратного тестировщика и
«ой я попробую вот эту дичь» тестировщика. Skill захватывает эту
динамику.`,
    why_uk: `Більшість AI-тестинг-скілів роблять одну річ — зазвичай
«генеруй тест-кейси зі спеки». Quinn+Jinx робить testing AI
**adversarial до самого себе**. Методичний прохід і хаотичний прохід
мають різні bias-и, тому два проходи ловлять те, що один пропустив би.
Так і працюють живі QA-команди — пара акуратного тестувальника і «ой я
спробую оцю дичину» тестувальника. Skill захоплює цю динаміку.`,

    use_cases_en: [
      'Pre-release sign-off — Quinn does the formal pass against acceptance criteria.',
      'Exploratory testing of legacy features — Jinx finds the cobwebs nobody documented.',
      'Code review on test PRs — Quinn checks coverage, Jinx asks "what edge cases did the test author also miss?"',
    ],
    use_cases_ru: [
      'Pre-release sign-off — Quinn делает формальный проход по acceptance criteria.',
      'Exploratory testing legacy-фич — Jinx находит паутину которую никто не задокументировал.',
      'Code review на test PR — Quinn проверяет coverage, Jinx спрашивает «какие edge cases автор теста тоже пропустил?»',
    ],
    use_cases_uk: [
      'Pre-release sign-off — Quinn робить формальний прохід по acceptance criteria.',
      'Exploratory testing legacy-фіч — Jinx знаходить павутину, яку ніхто не задокументував.',
      'Code review на test PR — Quinn перевіряє coverage, Jinx запитує «які edge cases автор тесту теж пропустив?»',
    ],

    install_en: `Install qa-test skill via Claude Code:

Install the qa-test skill from https://github.com/adampaulwalker/qa-test

1. Clone the repo into ~/.claude/skills/qa-test/
2. Make sure SKILL.md is at the top of that folder
3. Restart Claude Code so the skill auto-loads
4. Try it: "/skill qa-test as Quinn — review this PR"
5. Then: "/skill qa-test as Jinx — try to break this feature"`,
    install_ru: `Установить qa-test skill через Claude Code:

Установи qa-test skill из https://github.com/adampaulwalker/qa-test

1. Клонируй репо в ~/.claude/skills/qa-test/
2. Проверь что SKILL.md лежит в корне той папки
3. Перезапусти Claude Code чтобы skill подхватился
4. Тест: «/skill qa-test as Quinn — review this PR»
5. Потом: «/skill qa-test as Jinx — try to break this feature»`,
    url: 'https://github.com/adampaulwalker/qa-test',
  },

  {
    id: 'channels',
    eyebrow: 'remote control',
    name: 'Claude Code Channels',
    tagline_en: 'Drive Claude Code from a Telegram, Discord, or iMessage chat.',
    tagline_ru: 'Управляй Claude Code прямо из Telegram, Discord или iMessage чата.',
    tagline_uk: 'Керуй Claude Code прямо з Telegram, Discord або iMessage чату.',
    pullQuote_en: 'Your night-time autopilot, checkable from bed.',
    pullQuote_ru: 'Твой ночной autopilot — проверяешь прямо из кровати.',
    pullQuote_uk: 'Твій нічний autopilot — перевіряєш прямо з ліжка.',
    stats: [
      { value: 'TG', label: 'telegram' },
      { value: 'DC', label: 'discord' },
      { value: 'iM', label: 'imessage' },
    ],

    body_en: `Anthropic-native channels — research preview shipped in
**March 2026**, with iMessage support added a week later. The idea is
deceptively simple: Claude Code keeps running on your laptop, and you
chat with it from anywhere via the messaging app you already use.

The setup is one-time: register a Telegram bot via @BotFather (or
hook up Discord/iMessage with the corresponding tokens), drop the
config into ~/.claude/settings.json, and now Claude Code is reachable
from your phone.

Real-life rhythm changes a lot. You leave a long autopilot running
overnight or during a meeting, then check on it from a 10-second phone
glance: "what did you change?", "summarise the diff", "any errors in
the test run?". You can also fire off new tasks from the bus —
"refactor the auth module while I'm in transit, I'll review tonight".
The laptop becomes the worker, the phone becomes the foreman.

It's still a research preview, so expect rough edges. But the moment
you've checked your night-time autopilot from bed before sleep,
you're not going back.`,
    body_ru: `Anthropic-нативные каналы — research preview вышел
**март 2026**, поддержку iMessage добавили неделю спустя. Идея
обманчиво простая: Claude Code продолжает работать у тебя на ноуте,
а ты общаешься с ним откуда угодно через мессенджер которым ты уже
пользуешься.

Setup разовый: регистрируешь Telegram-бота через @BotFather (или
подключаешь Discord/iMessage с соответствующими токенами), кладёшь
конфиг в ~/.claude/settings.json — и теперь Claude Code доступен
с телефона.

Ритм жизни меняется сильно. Оставляешь длинный autopilot ночью или
во время совещания, потом проверяешь за 10 секунд с телефона: «что
ты изменил?», «суммируй diff», «были ошибки в тестах?». Можно и
кидать новые задачи из автобуса — «отрефактори auth-модуль пока я
еду, вечером пойду смотреть». Ноут становится работягой, телефон —
бригадиром.

Это всё ещё research preview, шероховатости есть. Но тот момент
когда ты проверила ночной autopilot из кровати перед сном — назад
уже не вернёшься.`,
    body_uk: `Anthropic-нативні канали — research preview вийшов
**березень 2026**, підтримку iMessage додали тиждень потому. Ідея
оманливо проста: Claude Code продовжує працювати у тебе на ноуті, а ти
спілкуєшся з ним звідки завгодно через месенджер, яким уже користуєшся.

Setup разовий: реєструєш Telegram-бота через @BotFather (або
підʼєднуєш Discord/iMessage з відповідними токенами), кладеш конфіг у
~/.claude/settings.json — і тепер Claude Code доступний з телефона.

Ритм життя змінюється сильно. Залишаєш довгий autopilot уночі або під
час наради, потім перевіряєш за 10 секунд з телефона: «що ти змінив?»,
«сумуй diff», «чи були помилки у тестах?». Можна й кидати нові задачі
з автобуса — «відрефактори auth-модуль поки я їду, увечері подивлюся».
Ноут стає роботягою, телефон — бригадиром.

Це досі research preview, шорсткості є. Але той момент, коли ти
перевірила нічний autopilot з ліжка перед сном — назад уже не
повернешся.`,

    why_en: `The biggest unspoken constraint of Claude Code is "must be
at the laptop". Long-running tasks (refactors, test generation,
research) want to run while you do other things, but if you're not at
the keyboard you can't check on them. Channels remove that constraint.
For people with kids, gym time, commutes, or just life — this is a
real quality-of-life jump.`,
    why_ru: `Самое большое негласное ограничение Claude Code — «должен
сидеть за ноутом». Длинные задачи (рефакторы, генерация тестов,
research) хотят бежать пока ты делаешь другое, но если тебя нет за
клавой — проверить не можешь. Channels это ограничение убирают. Для
людей с детьми, спортом, дорогой на работу или просто жизнью — реальный
quality-of-life jump.`,
    why_uk: `Найбільше негласне обмеження Claude Code — «маєш сидіти за
ноутом». Довгі задачі (рефактори, генерація тестів, research) хочуть
бігти, поки ти робиш інше, але якщо тебе нема за клавою — перевірити
не можеш. Channels це обмеження прибирають. Для людей із дітьми,
спортом, дорогою на роботу чи просто життям — реальний quality-of-life
jump.`,

    use_cases_en: [
      'Overnight autopilot review — wake up, check the bot summary on phone before getting out of bed.',
      'Out-of-office triage — quick "what broke?" answers without opening laptop.',
      'Pair-programming with yourself across contexts — kick off task on laptop, refine prompts from phone during coffee break.',
    ],
    use_cases_ru: [
      'Ночные autopilot-ревью — просыпаешься, проверяешь summary бота на телефоне до того как встать с кровати.',
      'Out-of-office triage — быстрые ответы «что сломалось?» без открытия ноута.',
      'Pair-programming с самой собой через контексты — запустила задачу на ноуте, дотачиваешь prompts с телефона за кофе.',
    ],
    use_cases_uk: [
      'Нічні autopilot-ревʼю — прокидаєшся, перевіряєш summary бота на телефоні до того, як встати з ліжка.',
      'Out-of-office triage — швидкі відповіді «що зламалося?» без відкривання ноута.',
      'Pair-programming із самою собою через контексти — запустила задачу на ноуті, доточуєш prompts з телефона за кавою.',
    ],

    install_en: `Set up Claude Code Channels:

Set up Claude Code Channels for Telegram (or Discord, or iMessage if I'm on macOS).

1. Read the official guide at https://code.claude.com/docs/en/channels
2. Walk me through creating a Telegram bot via @BotFather and getting the token
3. Add the channel config to my ~/.claude/settings.json (or wherever the docs say)
4. Restart Claude Code, send a test message from my phone, confirm it gets a reply
5. Tell me what commands the channel actually understands`,
    install_ru: `Поставить Claude Code Channels:

Настрой Claude Code Channels для Telegram (или Discord, или iMessage если macOS).

1. Прочитай официальный гайд на https://code.claude.com/docs/en/channels
2. Проведи меня через создание Telegram-бота через @BotFather и получение токена
3. Добавь конфиг канала в ~/.claude/settings.json (или куда говорит дока)
4. Перезапусти Claude Code, пошли тестовое сообщение с телефона, подтверди что ответ пришёл
5. Расскажи какие команды канал реально понимает`,
    url: 'https://code.claude.com/docs/en/channels',
  },

]

export const GEM_BY_ID = Object.fromEntries(GEMS.map(g => [g.id, g]))

// ═══════════════════════════════════════════════════════════════════
// GEM CATEGORIES — thematic group slides covering multiple repos at
// once. Each entry renders as one long slide listing every item in
// the category, with tagline + body + why + install + url per item.
// ═══════════════════════════════════════════════════════════════════

export const GEM_CATEGORIES = [
  // ── 1. DESIGN SKILLS ───────────────────────────────────────────
  {
    id: 'design-skills',
    eyebrow: 'design taste for AI',
    name: 'Design skills for AI',
    intro_en: 'AI writes generic UI by default — same purple gradients, same boxy cards, same forgettable typography. These four skills give Claude actual design taste: how to extract a design DNA from any URL, how to apply layout / motion / typographic discipline, how to fix the most common AI mistakes one click at a time, and how to run a full local design studio.',
    intro_ru: 'AI по дефолту пишет generic UI — те же фиолетовые градиенты, те же кубические карточки, та же забываемая типографика. Четыре skills ниже дают Claude настоящий дизайнерский вкус: вытащить design DNA с любого URL, применить layout / motion / типографическую дисциплину, починить типовые AI-ошибки в один клик, и запустить целую дизайн-студию локально.',
    intro_uk: 'AI за замовчуванням пише generic UI — ті ж фіолетові градієнти, ті ж кубічні картки, та ж забутна типографіка. Чотири skills нижче дають Claude справжній дизайнерський смак: витягти design DNA з будь-якого URL, застосувати layout / motion / типографічну дисципліну, полагодити типові AI-помилки за один клік, і запустити цілу дизайн-студію локально.',
    items: [
      {
        name: 'taste-skill',
        author: 'LeonxInx',
        stars: null,
        url: 'https://github.com/LeonxInx/taste-skill',
        tagline_en: 'Layout, typography, color, motion: what separates good from generic.',
        tagline_ru: 'Layout, типографика, цвет, motion — то что отделяет хорошее от generic.',
        tagline_uk: 'Layout, типографіка, колір, motion — те що відокремлює хороше від generic.',
        body_en: 'High-Agency Frontend skill that teaches Claude design taste through worked examples. Walks through real layouts (typography hierarchy, motion principles, color rhythm) so when you ask for "a landing page" you get something with proportions and breath, not stacked Tailwind boxes.',
        body_ru: 'High-Agency Frontend skill который учит Claude дизайнерскому вкусу через worked examples. Проходит по реальным layout-ам (типографическая иерархия, motion-принципы, цветовой ритм) — попросишь «лендинг», получишь что-то с пропорциями и воздухом, а не стопку Tailwind-боксов.',
        body_uk: 'High-Agency Frontend skill який вчить Claude дизайнерському смаку через worked examples. Проходить по реальних layout-ах (типографічна ієрархія, motion-принципи, кольоровий ритм) — попросиш «лендинг», отримаєш щось із пропорціями і повітрям, а не стопку Tailwind-боксів.',
        why_en: 'Most Claude-generated UI looks samey because the model has zero aesthetic ground truth. This skill gives it concrete reference points (golden ratio, optical balance, the way good fonts breathe). For a QA building internal tools — the difference between "looks like an internal tool" and "looks intentional".',
        why_ru: 'Большинство Claude-UI выглядит samey потому что модель не имеет эстетической ground truth. Этот skill даёт ей конкретные точки опоры (золотое сечение, оптический баланс, как дышат хорошие шрифты). Для QA, который строит внутренние тулзы — разница между «выглядит как внутренняя тулза» и «выглядит продуманно».',
        why_uk: 'Більшість Claude-UI виглядає samey бо модель не має естетичної ground truth. Цей skill дає їй конкретні точки опори (золотий перетин, оптичний баланс, як дихають хороші шрифти). Для QA, що будує внутрішні тулзи — різниця між «виглядає як внутрішня тулза» і «виглядає продумано».',
        install_en: 'npx skills add LeonxInx/taste-skill',
        install_ru: 'npx skills add LeonxInx/taste-skill',
        install_uk: 'npx skills add LeonxInx/taste-skill',
      },
      {
        name: 'design-extract',
        author: 'Manavarya09',
        stars: '2k',
        url: 'https://github.com/Manavarya09/design-extract',
        tagline_en: 'URL → full design system. Tokens, typography, motion, components — extracted.',
        tagline_ru: 'URL → полная design-система. Токены, типографика, motion, компоненты — извлекаются.',
        tagline_uk: 'URL → повна design-система. Токени, типографіка, motion, компоненти — витягуються.',
        body_en: 'Headless-browser skill that reads any website the way a developer reads a stylesheet. Point it at a URL → it pulls layout grid, type scale, color tokens, spacing system, interaction states, motion language, brand voice. Output is a design.json (or Tailwind config) you can paste into your project.',
        body_ru: 'Headless-browser skill который читает любой сайт так как разработчик читает stylesheet. Указываешь URL → вытягивает layout grid, type scale, color-токены, spacing system, interaction-states, motion language, brand voice. Выход — design.json (или Tailwind config) для вставки в твой проект.',
        body_uk: 'Headless-browser skill який читає будь-який сайт так, як розробник читає stylesheet. Вказуєш URL → витягує layout grid, type scale, color-токени, spacing system, interaction-states, motion language, brand voice. Вихід — design.json (або Tailwind config) для вставки у твій проєкт.',
        why_en: 'Reverse-engineering competitor UIs used to take a day of DevTools + screenshots. Now it is one prompt. For QA: feed it your own product → spot inconsistencies (eight different spacing values you did not know existed).',
        why_ru: 'Раньше реверс-инжиниринг конкурентного UI занимал день DevTools + скриншоты. Теперь — один промпт. Для QA: скорми свой собственный продукт → вылезут несоответствия (восемь разных значений spacing о которых ты не знал(а)).',
        why_uk: 'Раніше реверс-інжиніринг конкурентного UI займав день DevTools + скриншоти. Тепер — один промпт. Для QA: згодуй свій власний продукт → вилізуть невідповідності (вісім різних значень spacing про які ти не знав(ла)).',
        install_en: 'gh repo clone Manavarya09/design-extract && cd design-extract && npm i',
        install_ru: 'gh repo clone Manavarya09/design-extract && cd design-extract && npm i',
        install_uk: 'gh repo clone Manavarya09/design-extract && cd design-extract && npm i',
      },
      {
        name: 'impeccable',
        author: 'pbakaus',
        stars: '24.6k',
        url: 'https://github.com/pbakaus/impeccable',
        tagline_en: '23 commands that fix AI slop in your UI — live, side-by-side editing.',
        tagline_ru: '23 команды которые правят AI-халтуру в UI — live, бок-о-бок редактирование.',
        tagline_uk: '23 команди які правлять AI-халтуру в UI — live, поруч редагування.',
        body_en: 'Front-end design skill with 23 specific commands targeting the most common AI mistakes — "purple gradient everywhere", "cards on cards on cards", typographic stiffness, motion clichés. Opens the page, you click on a component, dial variants in real time (before/after gallery shipped in v3).',
        body_ru: '23 конкретные команды против типовых AI-ошибок — «фиолетовый градиент везде», «карточки на карточках на карточках», типографическая жёсткость, motion-клише. Открываешь страницу, кликаешь на компонент, крутишь варианты в реальном времени (before/after галерея в v3).',
        body_uk: '23 конкретні команди проти типових AI-помилок — «фіолетовий градієнт всюди», «картки на картках на картках», типографічна жорсткість, motion-кліше. Відкриваєш сторінку, клацаєш на компонент, крутиш варіанти в реальному часі (before/after галерея у v3).',
        why_en: 'Half the time you can spot "AI wrote this" within two seconds. Impeccable names that smell and gives Claude a checklist to avoid it. For QA reviewing AI-drafted UI in a PR: paste the URL → get a concrete list of likely smells before you click through manually.',
        why_ru: 'В половине случаев «AI написал это» видно за две секунды. Impeccable называет этот запах и даёт Claude чеклист как не делать так. Для QA-ревью AI-набросанного UI в PR: вставил URL → получил список вероятных smells до того как кликать руками.',
        why_uk: 'У половині випадків «AI написав це» видно за дві секунди. Impeccable називає цей запах і дає Claude чекліст як не робити так. Для QA-рев\'ю AI-накиданого UI у PR: встав URL → отримав список ймовірних smells до того як клацати руками.',
        install_en: 'npx skills add pbakaus/impeccable',
        install_ru: 'npx skills add pbakaus/impeccable',
        install_uk: 'npx skills add pbakaus/impeccable',
      },
      {
        name: 'open-design',
        author: 'nexu-io',
        stars: '19.1k',
        url: 'https://github.com/nexu-io/open-design',
        tagline_en: 'Open-source Claude Design clone. 31 skills, 71 design systems, runs locally.',
        tagline_ru: 'Open-source клон Claude Design. 31 skill, 71 дизайн-система, локально.',
        tagline_uk: 'Open-source клон Claude Design. 31 skill, 71 дизайн-система, локально.',
        body_en: 'Apache-2.0 design studio that runs alongside Claude Code (or Cursor, Codex). 31 design skills + 71 design systems built-in. Exports HTML, PDF, PPTX, MP4 (yes — animated mockup recordings). No usage limits, no cloud. The "designer that already lives on your laptop" tagline is accurate.',
        body_ru: 'Apache-2.0 design-студия которая работает рядом с Claude Code (или Cursor, Codex). 31 design-skill + 71 дизайн-система встроены. Экспорт HTML/PDF/PPTX/MP4 (да — записи анимированных моков). Лимитов нет, облако не нужно. Тэглайн «дизайнер который уже живёт у тебя на ноуте» — это правда.',
        body_uk: 'Apache-2.0 design-студія яка працює поруч з Claude Code (або Cursor, Codex). 31 design-skill + 71 дизайн-система вбудовані. Експорт HTML/PDF/PPTX/MP4 (так — записи анімованих моків). Лімітів нема, хмара не потрібна. Теглайн «дизайнер який вже живе у тебе на ноуті» — це правда.',
        why_en: 'Anthropic\'s hosted Claude Design product is great but you pay per use and it lives in a browser. open-design gives you the same skill catalog locally — unlimited, off-network, integrated with Claude Code so design lives next to your tests, not in a separate tab.',
        why_ru: 'Хостед-продукт Anthropic Claude Design — хороший, но платный per-use и живёт в браузере. open-design даёт тебе тот же каталог skills локально — без лимитов, off-network, интегрировано с Claude Code чтобы дизайн жил рядом с тестами а не в отдельной вкладке.',
        why_uk: 'Хостед-продукт Anthropic Claude Design — хороший, але платний per-use і живе у браузері. open-design дає тобі той же каталог skills локально — без лімітів, off-network, інтегровано з Claude Code щоб дизайн жив поруч з тестами а не в окремій вкладці.',
        install_en: 'npx skills add nexu-io/open-design\nopen-design init',
        install_ru: 'npx skills add nexu-io/open-design\nopen-design init',
        install_uk: 'npx skills add nexu-io/open-design\nopen-design init',
      },
    ],
  },

  // ── 2. BROWSER AUTOMATION ──────────────────────────────────────
  {
    id: 'browser-automation',
    eyebrow: 'browsers as agent surface',
    name: 'Browser automation for agents',
    intro_en: 'When you want an agent to actually click, fill forms, and scrape pages — Playwright is overkill and brittle. These three repos package browser control in three different sizes: a 12MB Go binary you start instantly, a self-healing Playwright wrapper that rewrites its own script when the site changes, and a Rust-native CLI built for AI agent throughput.',
    intro_ru: 'Когда нужно чтобы агент реально кликал, заполнял формы, парсил страницы — Playwright избыточен и хрупок. Три репо ниже упаковывают browser-control в трёх размерах: 12MB Go-бинарник который стартует мгновенно, self-healing Playwright-обёртка которая переписывает свой скрипт когда сайт меняется, и Rust-native CLI заточенный под throughput AI-агентов.',
    intro_uk: 'Коли треба щоб агент реально клацав, заповнював форми, парсив сторінки — Playwright надлишковий і крихкий. Три репо нижче пакують browser-control у трьох розмірах: 12MB Go-бінарник який стартує миттєво, self-healing Playwright-обгортка яка переписує свій скрипт коли сайт міняється, і Rust-native CLI заточений під throughput AI-агентів.',
    items: [
      {
        name: 'agent-browser',
        author: 'vercel-labs',
        stars: '321k installs',
        url: 'https://github.com/vercel-labs/agent-browser',
        tagline_en: 'Native Rust CLI for browser automation, built for AI agents.',
        tagline_ru: 'Native Rust CLI для browser automation, заточен под AI-агентов.',
        tagline_uk: 'Native Rust CLI для browser automation, заточений під AI-агентів.',
        body_en: 'Bundled Chrome-for-Testing + Rust orchestration. One npm install gives you a binary that launches Chrome with a clean profile, exposes click/fill/screenshot/extract via a stable CLI, and exits cleanly. No node_modules bloat, no Playwright version pinning, just `agent-browser do "fill form X then submit"`.',
        body_ru: 'Bundle Chrome-for-Testing + Rust оркестрация. npm install даёт тебе бинарник который запускает Chrome с чистым профилем, выставляет click/fill/screenshot/extract через стабильный CLI, и чисто завершается. Без node_modules-балласта, без пиннинга версий Playwright — просто `agent-browser do "заполни форму X и submit"`.',
        body_uk: 'Bundle Chrome-for-Testing + Rust оркестрація. npm install дає тобі бінарник який запускає Chrome з чистим профілем, виставляє click/fill/screenshot/extract через стабільний CLI, і чисто завершується. Без node_modules-баласту, без пінінгу версій Playwright — просто `agent-browser do "заповни форму X і submit"`.',
        why_en: 'For QA automation: you have probably written the same "spin up headless Chrome, navigate, click, screenshot" Playwright boilerplate fifteen times. agent-browser is that scaffold as one binary. For exploratory testing — Claude can drive it directly without you babysitting the protocol.',
        why_ru: 'Для QA-автоматизации: ты уже наверное писал(а) тот же «подними headless Chrome, navigate, click, screenshot» Playwright-boilerplate пятнадцать раз. agent-browser — этот скаффолд одним бинарником. Для exploratory тестинга — Claude может водить им напрямую без бэбиситтинга протокола.',
        why_uk: 'Для QA-автоматизації: ти вже мабуть писав(ла) той же «підніми headless Chrome, navigate, click, screenshot» Playwright-boilerplate п\'ятнадцять разів. agent-browser — цей скафолд одним бінарником. Для exploratory тестингу — Claude може водити ним напряму без бебіситингу протоколу.',
        install_en: 'npm install -g agent-browser\nagent-browser install  # downloads Chrome-for-Testing',
        install_ru: 'npm install -g agent-browser\nagent-browser install  # скачает Chrome-for-Testing',
        install_uk: 'npm install -g agent-browser\nagent-browser install  # завантажить Chrome-for-Testing',
      },
      {
        name: 'browser-harness',
        author: 'browser-use',
        stars: '10k',
        url: 'https://github.com/browser-use/browser-harness',
        tagline_en: 'Playwright that heals itself when the page changes.',
        tagline_ru: 'Playwright который чинит себя сам когда страница меняется.',
        tagline_uk: 'Playwright який лагодить себе сам коли сторінка міняється.',
        body_en: 'Agent that rewrites its own skill file after every run. Tries Amazon (or any flow), logs what worked, what failed because the selector changed, and patches the script. Next run: the script is healed. Over time, your automation becomes more resilient by use, not by editing.',
        body_ru: 'Агент который переписывает свой собственный skill-файл после каждого запуска. Пробует Amazon (или любой flow), логирует что сработало, что упало из-за изменившегося селектора, патчит скрипт. Следующий запуск — скрипт уже починен. Со временем твоя автоматизация становится устойчивее от использования, а не от ручных правок.',
        body_uk: 'Агент який переписує свій власний skill-файл після кожного запуску. Пробує Amazon (або будь-який flow), логує що спрацювало, що впало через селектор який змінився, патчить скрипт. Наступний запуск — скрипт вже полагоджений. З часом твоя автоматизація стає стійкішою від використання, а не від ручних правок.',
        why_en: 'Every QA who has maintained Playwright suites knows the pain: a sprint update rebrands the header, selectors break, you spend Thursday patching tests. browser-harness flips that — broken runs are signals, the harness self-edits. Maintenance cost trends down over time, not up.',
        why_ru: 'Каждый QA который поддерживает Playwright-suites знает боль: спринт перебрендил хедер, селекторы упали, ты в четверг патчишь тесты. browser-harness переворачивает это — сломанные runs это сигналы, harness сам редактирует. Стоимость поддержки идёт вниз со временем, а не вверх.',
        why_uk: 'Кожен QA який підтримує Playwright-suites знає біль: спринт перебрендив хедер, селектори впали, ти у четвер патчиш тести. browser-harness перевертає це — зламані runs це сигнали, harness сам редагує. Вартість підтримки йде вниз з часом, а не вгору.',
        install_en: 'pip install browser-harness\nharness init my-flow.yaml',
        install_ru: 'pip install browser-harness\nharness init my-flow.yaml',
        install_uk: 'pip install browser-harness\nharness init my-flow.yaml',
      },
      {
        name: 'PinchTab',
        author: 'pinchtab',
        stars: '8.9k',
        url: 'https://github.com/pinchtab/pinchtab',
        tagline_en: 'HTTP server controlling Chrome. 12MB Go binary, multiple isolated tabs.',
        tagline_ru: 'HTTP-сервер для управления Chrome. 12MB Go-бинарник, несколько изолированных вкладок.',
        tagline_uk: 'HTTP-сервер для управління Chrome. 12MB Go-бінарник, кілька ізольованих вкладок.',
        body_en: 'Launches Chrome, exposes click/fill/extract over a tiny HTTP API. Any agent or curl can drive it — low token cost compared to Playwright JSON dumps. Multiple isolated browser instances run simultaneously for parallel scraping or parallel test runs.',
        body_ru: 'Запускает Chrome, выставляет click/fill/extract через крошечный HTTP API. Любой агент или curl может им управлять — low token cost по сравнению с Playwright JSON-дампами. Несколько изолированных экземпляров браузера работают параллельно для параллельного скрапа или параллельных test runs.',
        body_uk: 'Запускає Chrome, виставляє click/fill/extract через крихітний HTTP API. Будь-який агент або curl може ним керувати — low token cost порівняно з Playwright JSON-дампами. Кілька ізольованих екземплярів браузера працюють паралельно для паралельного скрапу або паралельних test runs.',
        why_en: 'When you want one agent driving many tabs (parallel exploratory testing, scraping ten URLs at once), Playwright\'s per-context cost hurts. PinchTab is built for fan-out — agent issues curls, browser responds. For QA: parallel cross-environment smoke tests with one command.',
        why_ru: 'Когда хочешь чтобы один агент водил несколько вкладок (parallel exploratory testing, скрап десяти URL одновременно), per-context cost Playwright больно бьёт. PinchTab построен под fan-out — агент шлёт curl, браузер отвечает. Для QA: параллельные cross-environment smoke-тесты одной командой.',
        why_uk: 'Коли хочеш щоб один агент водив кілька вкладок (parallel exploratory testing, скрап десяти URL одночасно), per-context cost Playwright боляче бʼє. PinchTab побудований під fan-out — агент шле curl, браузер відповідає. Для QA: паралельні cross-environment smoke-тести однією командою.',
        install_en: 'go install github.com/pinchtab/pinchtab@latest\npinchtab serve',
        install_ru: 'go install github.com/pinchtab/pinchtab@latest\npinchtab serve',
        install_uk: 'go install github.com/pinchtab/pinchtab@latest\npinchtab serve',
      },
    ],
  },

  // ── 3. SMART HELPERS ───────────────────────────────────────────
  {
    id: 'smart-helpers',
    eyebrow: 'efficiency multipliers',
    name: 'Smart Claude helpers',
    intro_en: 'Four utility repos that make Claude faster, cheaper, or smarter without changing what you ask it to do. One maps any codebase into a teachable graph. One wraps any program in an agent-native CLI. One literally cuts your token bill 22-87% by making Claude talk less. One brings n8n workflow validation into MCP so Claude can author and update flows safely.',
    intro_ru: 'Четыре utility-репо которые делают Claude быстрее, дешевле или умнее без изменения того что ты у него просишь. Одно строит понимаемую карту любой codebase. Одно оборачивает любую программу в agent-native CLI. Одно режет твой токен-счёт на 22-87% заставляя Claude говорить меньше. Одно приносит n8n-workflow валидацию в MCP — Claude может писать и обновлять flows безопасно.',
    intro_uk: 'Чотири utility-репо які роблять Claude швидшим, дешевшим або розумнішим без зміни того що ти у нього просиш. Одне будує зрозумілу карту будь-якої codebase. Одне обгортає будь-яку програму в agent-native CLI. Одне ріже твій токен-рахунок на 22-87% змушуючи Claude говорити менше. Одне приносить n8n-workflow валідацію в MCP — Claude може писати і оновлювати flows безпечно.',
    items: [
      {
        name: 'Understand-Anything',
        author: 'Lum1104',
        stars: '10.5k',
        url: 'https://github.com/Lum1104/Understand-Anything',
        tagline_en: 'Claude Code plugin: any project → interactive dependency map.',
        tagline_ru: 'Claude Code плагин: любой проект → интерактивная карта зависимостей.',
        tagline_uk: 'Claude Code плагін: будь-який проєкт → інтерактивна карта залежностей.',
        body_en: 'Scan → Map → Teach pipeline. Reads your codebase, builds a graph of files / functions / classes with plain-language explanations of what each piece does and why. Works with Claude Code, Codex, Cursor, Copilot, Gemini CLI. Includes guided tours, semantic search, diff impact analysis.',
        body_ru: 'Pipeline Scan → Map → Teach. Читает codebase, строит граф файлов / функций / классов с обычно-языковыми объяснениями что делает каждый кусок и зачем. Работает с Claude Code, Codex, Cursor, Copilot, Gemini CLI. Включает guided tours, semantic search, анализ diff-impact.',
        body_uk: 'Pipeline Scan → Map → Teach. Читає codebase, будує граф файлів / функцій / класів з звично-мовними поясненнями що робить кожен шматок і навіщо. Працює з Claude Code, Codex, Cursor, Copilot, Gemini CLI. Включає guided tours, semantic search, аналіз diff-impact.',
        why_en: 'For QA dropped into an unfamiliar service: instead of reading 40 files to figure out the auth flow, open the map, ask "where does session validation happen and what writes to it". Five minutes instead of an afternoon. Diff impact: "what test files should I rerun after this PR?" — answered automatically.',
        why_ru: 'Для QA, который попал в незнакомый сервис: вместо чтения 40 файлов чтобы понять auth flow, открой карту, спроси «где происходит валидация сессии и кто в неё пишет». Пять минут вместо полдня. Diff impact: «какие тесты перезапустить после этого PR?» — отвечается автоматически.',
        why_uk: 'Для QA, який потрапив у незнайомий сервіс: замість читання 40 файлів щоб зрозуміти auth flow, відкрий карту, спитай «де відбувається валідація сесії і хто в неї пише». Пʼять хвилин замість пів дня. Diff impact: «які тести перезапустити після цього PR?» — відповідається автоматично.',
        install_en: 'gh repo clone Lum1104/Understand-Anything\ncd Understand-Anything && pip install -e .',
        install_ru: 'gh repo clone Lum1104/Understand-Anything\ncd Understand-Anything && pip install -e .',
        install_uk: 'gh repo clone Lum1104/Understand-Anything\ncd Understand-Anything && pip install -e .',
      },
      {
        name: 'CLI-Anything',
        author: 'HKUDS',
        stars: '33.2k',
        url: 'https://github.com/HKUDS/CLI-Anything',
        tagline_en: 'Auto-generates an agent-native CLI for any program — so AI can drive it.',
        tagline_ru: 'Авто-генерация agent-native CLI для любой программы — чтобы ей мог управлять AI.',
        tagline_uk: 'Авто-генерація agent-native CLI для будь-якої програми — щоб нею міг керувати AI.',
        body_en: '68 ready CLIs across 30 categories. Empower-yourself mode: pip install one CLI and use it. Empower-agents mode: install many in one skill so OpenClaw / Nanobot / Claude Code / Codex / Antigravity can call them as tools. Also available on ClawHub, SkillHub, SkillHub.cn marketplaces.',
        body_ru: '68 готовых CLI в 30 категориях. Empower-yourself: pip install одного CLI и пользуйся. Empower-agents: install много в одном skill — OpenClaw / Nanobot / Claude Code / Codex / Antigravity вызывают как tools. Также доступно на ClawHub, SkillHub, SkillHub.cn маркетплейсах.',
        body_uk: '68 готових CLI у 30 категоріях. Empower-yourself: pip install одного CLI і користуйся. Empower-agents: install багато в одному skill — OpenClaw / Nanobot / Claude Code / Codex / Antigravity викликають як tools. Також доступно на ClawHub, SkillHub, SkillHub.cn маркетплейсах.',
        why_en: 'Want Claude to use your team\'s internal admin tool that only has a web UI? Wrap it. Want it to use your custom CI script? Wrap it. CLI-Anything is the "make every program an agent target" shortcut — turning whatever opaque GUI tool blocks your test pipeline into something the agent can drive.',
        why_ru: 'Хочешь чтобы Claude использовал внутренний admin-тул команды у которого только web-UI? Оберни. Свой кастомный CI-скрипт? Оберни. CLI-Anything — shortcut «сделать каждую программу agent-target» — превращает любой непрозрачный GUI-тул что блокирует test pipeline в то чем агент может водить.',
        why_uk: 'Хочеш щоб Claude використовував внутрішній admin-тул команди у якого тільки web-UI? Обгорни. Свій кастомний CI-скрипт? Обгорни. CLI-Anything — shortcut «зробити кожну програму agent-target» — перетворює будь-який непрозорий GUI-тул що блокує test pipeline на те чим агент може водити.',
        install_en: 'pip install cli-anything-hub\ncli-hub list  # browse 68 CLIs',
        install_ru: 'pip install cli-anything-hub\ncli-hub list  # 68 CLI на выбор',
        install_uk: 'pip install cli-anything-hub\ncli-hub list  # 68 CLI на вибір',
      },
      {
        name: 'caveman',
        author: 'juliusbrussee',
        stars: null,
        url: 'https://github.com/juliusbrussee/caveman',
        tagline_en: 'Cuts tokens 22-87% — Claude answers shorter without losing accuracy.',
        tagline_ru: 'Режет токены на 22-87% — Claude отвечает короче без потери точности.',
        tagline_uk: 'Ріже токени на 22-87% — Claude відповідає коротше без втрати точності.',
        body_en: '"Why use many word when fewer word do." A system prompt + style guide that strips Claude of conversational filler ("Sure! I\'d be happy to..."), filler-explanations, and politeness layering. The model still answers — just in fewer tokens. Side-by-side examples in the repo show 69 → 19 tokens for a real refactor question.',
        body_ru: '«Зачем много слова когда меньше слова». System prompt + style guide который снимает с Claude conversational filler («Конечно! Я с радостью...»), filler-объяснения, politeness-слои. Модель отвечает — просто меньшим числом токенов. Side-by-side примеры в репо показывают 69 → 19 токенов на реальном refactor-вопросе.',
        body_uk: '«Навіщо багато слова коли менше слова». System prompt + style guide який знімає з Claude conversational filler («Звичайно! Я з радістю...»), filler-пояснення, politeness-шари. Модель відповідає — просто меншою кількістю токенів. Side-by-side приклади у репо показують 69 → 19 токенів на реальному refactor-питанні.',
        why_en: 'For teams on the API tier where token bill matters: a 22% reduction across normal coding flows is real money over a quarter. For QA running autopilots overnight: shorter answers = less context to scroll = faster sanity-check in the morning.',
        why_ru: 'Для команд на API-tier где токен-счёт важен: 22% reduction по обычным coding-flows — реальные деньги за квартал. Для QA-autopilot ночью: короче ответы = меньше контекста проматывать = быстрее sanity-check утром.',
        why_uk: 'Для команд на API-tier де токен-рахунок важливий: 22% reduction по звичайних coding-flows — реальні гроші за квартал. Для QA-autopilot вночі: коротше відповіді = менше контексту прокручувати = швидше sanity-check вранці.',
        install_en: 'Drop caveman.md from the repo into ~/.claude/skills/\nThen reference: "use the caveman style"',
        install_ru: 'Положи caveman.md из репо в ~/.claude/skills/\nПотом ссылайся: «use the caveman style»',
        install_uk: 'Поклади caveman.md з репо у ~/.claude/skills/\nПотім посилайся: «use the caveman style»',
      },
      {
        name: 'n8n-mcp',
        author: 'czlonkowski',
        stars: '1k',
        url: 'https://github.com/czlonkowski/n8n-mcp',
        tagline_en: 'TypeScript-first n8n MCP. Validates types before sending JSON.',
        tagline_ru: 'TypeScript-first n8n MCP. Валидирует типы до отправки JSON.',
        tagline_uk: 'TypeScript-first n8n MCP. Валідує типи до відправки JSON.',
        body_en: 'Other n8n MCP servers emit raw JSON and hope for the best. This one models every node\'s shape in TypeScript first → validates the workflow against the schema → only then converts to JSON and populates the n8n instance. Failed validations come back with the exact field that did not match, not "500 Internal Error".',
        body_ru: 'Другие n8n MCP-серверы выдают сырой JSON и надеются на лучшее. Этот сначала моделирует каждую ноду в TypeScript → валидирует workflow по схеме → только потом конвертит в JSON и populate в n8n instance. Failed validations возвращают конкретное поле что не сошлось, а не «500 Internal Error».',
        body_uk: 'Інші n8n MCP-сервери видають сирий JSON і сподіваються на краще. Цей спершу моделює кожну ноду в TypeScript → валідує workflow за схемою → тільки потім конвертить у JSON і populate в n8n instance. Failed validations повертають конкретне поле що не зійшлося, а не «500 Internal Error».',
        why_en: 'For anyone using n8n in a QA pipeline (release automation, test-data spin-up, slack notifications) — letting Claude author flows used to mean a third of generated JSONs were silently broken. With this MCP the failure is immediate and locatable. Production-safe.',
        why_ru: 'Для тех кто использует n8n в QA-pipeline (release-автоматизация, test-data spin-up, slack-нотификации) — раньше дать Claude писать flows означало что треть сгенерированных JSON-ов тихо ломались. С этим MCP failure мгновенный и локализуемый. Production-safe.',
        why_uk: 'Для тих хто використовує n8n у QA-pipeline (release-автоматизація, test-data spin-up, slack-нотифікації) — раніше дати Claude писати flows означало що третина згенерованих JSON-ів тихо ламалися. З цим MCP failure миттєвий і локалізуємий. Production-safe.',
        install_en: 'npx @czlonkowski/n8n-mcp\n# Add to ~/.claude/mcp_servers.json',
        install_ru: 'npx @czlonkowski/n8n-mcp\n# Добавить в ~/.claude/mcp_servers.json',
        install_uk: 'npx @czlonkowski/n8n-mcp\n# Додати у ~/.claude/mcp_servers.json',
      },
    ],
  },

  // ── 4. SKILLS MARKETPLACE ──────────────────────────────────────
  {
    id: 'skills-marketplace',
    eyebrow: 'where skills live',
    name: 'Where to find skills',
    intro_en: 'Skills are reusable instruction bundles Claude can load on demand — like plugins, but author-friendly markdown. Once you understand the shape, you stop building everything from scratch. Below is the map: official directories, community hubs, the superpowers framework, and how to read a skill manifest at a glance.',
    intro_ru: 'Skills — переиспользуемые instruction-bundle которые Claude может подключать on demand — как плагины, но author-friendly markdown. Когда понимаешь форму — перестаёшь писать всё с нуля. Ниже карта: официальные директории, community-хабы, superpowers framework, и как читать skill manifest с одного взгляда.',
    intro_uk: 'Skills — перевикористовувані instruction-bundle які Claude може підключати on demand — як плагіни, але author-friendly markdown. Коли розумієш форму — перестаєш писати все з нуля. Нижче карта: офіційні директорії, community-хаби, superpowers framework, і як читати skill manifest з одного погляду.',
    items: [
      {
        name: 'skills.sh',
        author: 'community registry',
        stars: 'directory',
        url: 'https://skills.sh',
        tagline_en: 'The community-curated skills directory. Search, browse, copy install.',
        tagline_ru: 'Community-curated директория skills. Поиск, обзор, copy-install.',
        tagline_uk: 'Community-curated директорія skills. Пошук, огляд, copy-install.',
        body_en: 'A searchable registry of Claude skills with categories (design, browser, qa, data, infra, agents). Each entry shows install command, author, last update, and a one-line description. The closest thing to "npm for Claude" right now. Most repos in this workshop (taste-skill, impeccable, open-design, qa-test) are listed here too.',
        body_ru: 'Поисковая directория Claude skills с категориями (design, browser, qa, data, infra, agents). Каждая запись показывает install-команду, автора, последний апдейт и one-line описание. Самое близкое к «npm для Claude» сейчас. Большинство репо из этого воркшопа (taste-skill, impeccable, open-design, qa-test) тут тоже есть.',
        body_uk: 'Пошукова директорія Claude skills з категоріями (design, browser, qa, data, infra, agents). Кожна запис показує install-команду, автора, останній апдейт і one-line опис. Найближче до «npm для Claude» зараз. Більшість репо з цього воркшопу (taste-skill, impeccable, open-design, qa-test) тут теж є.',
        why_en: 'When you wonder "is there already a skill for X" — this is the first place to look before writing one yourself. Saves the 2-hour rabbit-hole of reinventing what exists.',
        why_ru: 'Когда задумаешься «есть ли уже skill на X» — это первое место куда смотреть до того как писать самостоятельно. Спасает 2-часовую rabbit-hole «изобретать существующее».',
        why_uk: 'Коли задумаєшся «чи є вже skill на X» — це перше місце куди дивитися до того як писати самостійно. Рятує 2-годинну rabbit-hole «винаходити існуюче».',
        install_en: 'Open https://skills.sh → search "qa" / "design" / "browser"\nOr install directly: npx skills add author/skill-name',
        install_ru: 'Открой https://skills.sh → поиск «qa» / «design» / «browser»\nИли установка напрямую: npx skills add author/skill-name',
        install_uk: 'Відкрий https://skills.sh → пошук «qa» / «design» / «browser»\nАбо встановлення напряму: npx skills add author/skill-name',
      },
      {
        name: 'anthropics/anthropic-skills',
        author: 'Anthropic',
        stars: 'official',
        url: 'https://github.com/anthropics/anthropic-skills',
        tagline_en: 'Anthropic\'s official skills repo. The reference templates.',
        tagline_ru: 'Официальный skills-репо от Anthropic. Эталонные шаблоны.',
        tagline_uk: 'Офіційний skills-репо від Anthropic. Еталонні шаблони.',
        body_en: 'Anthropic\'s curated examples — pdf-handling, excel-handling, web-research, image-creation. Read these first if you want to author a skill: the format, the manifest, the trigger conventions are all there. Updated as Claude\'s capabilities evolve.',
        body_ru: 'Anthropic-курированные примеры — pdf-handling, excel-handling, web-research, image-creation. Прочитай эти первыми если хочешь писать свой skill: формат, manifest, trigger-конвенции — всё тут. Обновляются по мере evolution возможностей Claude.',
        body_uk: 'Anthropic-куровані приклади — pdf-handling, excel-handling, web-research, image-creation. Прочитай ці першими якщо хочеш писати свій skill: формат, manifest, trigger-конвенції — все тут. Оновлюються в міру evolution можливостей Claude.',
        why_en: 'Reverse-engineering an Anthropic skill teaches more than reading the docs. The manifest fields, the trigger-phrase choices, the way auxiliary scripts get invoked — all visible side-by-side with working examples.',
        why_ru: 'Реверс-инжиниринг Anthropic-skill учит больше чем чтение docs. Поля манифеста, trigger-фразы, как auxiliary-скрипты вызываются — всё видно side-by-side с рабочими примерами.',
        why_uk: 'Реверс-інжиніринг Anthropic-skill вчить більше ніж читання docs. Поля маніфесту, trigger-фрази, як auxiliary-скрипти викликаються — все видно side-by-side з робочими прикладами.',
        install_en: 'gh repo clone anthropics/anthropic-skills\n# Browse skills/ directory — each subfolder is one skill',
        install_ru: 'gh repo clone anthropics/anthropic-skills\n# Смотри директорию skills/ — каждая под-папка это один skill',
        install_uk: 'gh repo clone anthropics/anthropic-skills\n# Дивись директорію skills/ — кожна під-папка це один skill',
      },
      {
        name: 'obra/superpowers',
        author: 'Jesse Vincent (obra)',
        stars: 'framework',
        url: 'https://github.com/obra/superpowers',
        tagline_en: 'Skills-of-skills meta-framework. One skill that orchestrates the rest.',
        tagline_ru: 'Skills-of-skills meta-фреймворк. Один skill оркеструет остальные.',
        tagline_uk: 'Skills-of-skills meta-фреймворк. Один skill оркеструє решту.',
        body_en: 'Instead of activating 30 skills manually, superpowers is one meta-skill that watches your message, decides which sub-skills to load, chains them. "Plan a release for the auth service" might trigger: code-mapping → test-impact → release-notes → PR-template. You only said one thing.',
        body_ru: 'Вместо активации 30 skills вручную — superpowers это один мета-skill который смотрит на твоё сообщение, решает какие sub-skills подключить, цепляет их. «Запланируй релиз auth-сервиса» может triggerнуть: code-mapping → test-impact → release-notes → PR-template. Ты сказал одну фразу.',
        body_uk: 'Замість активації 30 skills вручну — superpowers це один мета-skill який дивиться на твоє повідомлення, вирішує які sub-skills підключити, чіпляє їх. «Заплануй реліз auth-сервісу» може trigger-нути: code-mapping → test-impact → release-notes → PR-template. Ти сказав одну фразу.',
        why_en: 'Most people install lots of skills, forget which trigger phrase activates which, end up using two of thirty. superpowers solves the "I forgot what I installed" problem by routing intent → relevant skills automatically. The skill that makes other skills usable.',
        why_ru: 'Большинство ставит много skills, забывает какая trigger-фраза какую активирует, использует два из тридцати. superpowers решает проблему «я забыл что поставил» — routing intent → relevant skills автоматически. Skill который делает остальные skills usable.',
        why_uk: 'Більшість ставить багато skills, забуває яка trigger-фраза яку активує, використовує два з тридцяти. superpowers вирішує проблему «я забув що поставив» — routing intent → relevant skills автоматично. Skill який робить решту skills usable.',
        install_en: 'gh repo clone obra/superpowers ~/.claude/skills/superpowers\n# Restart Claude Code',
        install_ru: 'gh repo clone obra/superpowers ~/.claude/skills/superpowers\n# Перезапусти Claude Code',
        install_uk: 'gh repo clone obra/superpowers ~/.claude/skills/superpowers\n# Перезапусти Claude Code',
      },
      {
        name: 'awesome-claude-code',
        author: 'community list',
        stars: 'curated',
        url: 'https://github.com/hesreallyhim/awesome-claude-code',
        tagline_en: 'The "awesome list" for Claude Code — skills, agents, MCP, tutorials.',
        tagline_ru: '«awesome list» для Claude Code — skills, agents, MCP, туториалы.',
        tagline_uk: '«awesome list» для Claude Code — skills, agents, MCP, туторіали.',
        body_en: 'Hand-curated index of everything Claude Code adjacent — skills, agents, MCP servers, plugins, tutorials, talks, articles. Updated frequently by the community. The "I have an evening and want to see what is new" reading list.',
        body_ru: 'Hand-curated индекс всего что около Claude Code — skills, agents, MCP-серверы, плагины, туториалы, talks, статьи. Обновляется community часто. List для «у меня свободный вечер и я хочу посмотреть что нового».',
        body_uk: 'Hand-curated індекс усього що навколо Claude Code — skills, agents, MCP-сервери, плагіни, туторіали, talks, статті. Оновлюється community часто. List для «у мене вільний вечір і я хочу подивитися що нового».',
        why_en: 'Skills.sh is searchable; this list is editorialized — community marks "must-try" vs "interesting" vs "experimental". Better when you want curation, not discovery.',
        why_ru: 'Skills.sh — поисковая; этот list — editorialized — community помечает «must-try» vs «interesting» vs «experimental». Лучше когда хочется кураторства, не discovery.',
        why_uk: 'Skills.sh — пошукова; цей list — editorialized — community помічає «must-try» vs «interesting» vs «experimental». Краще коли хочеться кураторства, не discovery.',
        install_en: 'Browse https://github.com/hesreallyhim/awesome-claude-code\nStar it — get updates via GitHub feed',
        install_ru: 'Смотри https://github.com/hesreallyhim/awesome-claude-code\nStar — получай апдейты в GitHub-feed',
        install_uk: 'Дивись https://github.com/hesreallyhim/awesome-claude-code\nStar — отримуй апдейти в GitHub-feed',
      },
    ],
  },
]

export const GEM_CATEGORY_BY_ID = Object.fromEntries(GEM_CATEGORIES.map(c => [c.id, c]))
