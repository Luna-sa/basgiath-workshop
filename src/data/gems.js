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
    pullQuote_en: 'A glance and you know what every agent is doing.',
    pullQuote_ru: 'Взглянул — и знаешь чем занят каждый агент.',
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
    pullQuote_en: 'Beats the paid clouds, runs entirely on your laptop.',
    pullQuote_ru: 'Обходит платные облака. Работает целиком на твоём ноуте.',
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
    pullQuote_en: 'A bell that marks the moment of attention.',
    pullQuote_ru: 'Колокольчик, который отмечает момент внимания.',
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
    pullQuote_en: 'One env flag. Eighty-five percent of your context back.',
    pullQuote_ru: 'Один env-флаг. Восемьдесят пять процентов контекста назад.',
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

    install_en: `Manually edit ~/.claude/settings.json:

{
  "env": {
    "ENABLE_TOOL_SEARCH": "true"
  }
}

Restart Claude Code. That's the whole install.`,
    install_ru: `Руками отредактировать ~/.claude/settings.json:

{
  "env": {
    "ENABLE_TOOL_SEARCH": "true"
  }
}

Перезапусти Claude Code. Это вся установка.`,
    url: 'https://paddo.dev/blog/claude-code-hidden-mcp-flag/',
  },

  {
    id: 'quinn-jinx',
    eyebrow: 'qa personas',
    name: 'Quinn + Jinx (qa-test skill)',
    tagline_en: 'Two QA personas baked into a skill. Quinn checks success criteria. Jinx breaks things.',
    tagline_ru: 'Две QA-персоны в одном skill. Quinn проверяет success criteria. Jinx ломает всё.',
    pullQuote_en: 'A careful tester paired with a chaos tester. The gap between them is the find.',
    pullQuote_ru: 'Аккуратный тестировщик и хаос-тестировщик в паре. Разрыв между ними — и есть находка.',
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
    pullQuote_en: 'Your night-time autopilot, checkable from bed.',
    pullQuote_ru: 'Твой ночной autopilot — проверяешь прямо из кровати.',
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

  {
    id: 'output-style-learning',
    eyebrow: 'coach mode',
    name: '/output-style learning',
    tagline_en: 'Claude becomes a coach — leaves TODO(human) markers in code so you finish it.',
    tagline_ru: 'Claude в режиме коуча — оставляет TODO(human) маркеры чтобы ты сама дописала.',
    pullQuote_en: 'Stop tab-accepting. Start understanding.',
    pullQuote_ru: 'Перестань жать Tab. Начни понимать.',
    stats: [
      { value: '0', label: 'install steps' },
      { value: 'built-in', label: 'output style' },
      { value: 'TODO(human)', label: 'markers' },
    ],

    body_en: `Built-in Claude Code output style. Activate with
\`/output-style learning\` in any session. Switch back with
\`/output-style default\`.

What changes: Claude stops being a helpful know-it-all and starts being
a teacher. Instead of writing the whole solution and handing it to
you, it explains **what it would do** and **why**, then drops
\`TODO(human)\` markers in the code at the exact spots where the
non-trivial decisions live. You write those parts.

Concrete example. You ask "add password reset to this auth flow".
Default-mode Claude writes the whole route, controller, email
template, token generation — done in one shot, you skim and tab-accept.

Learning-mode Claude writes the scaffolding around it (route registration,
email template, JWT helpers), but at the actual token-generation step
drops a marker:

\`\`\`
// TODO(human): generate a single-use token. Consider:
// - what entropy is enough? (32 random bytes is the usual answer)
// - how long should it live? (15 min is industry standard)
// - one-time use — must be invalidated on first use
// - bonus: rate-limit per email
\`\`\`

You write the actual generation. Claude reviews when you're done.

It also works for prose, design docs, test plans — anywhere the goal
is to **learn**, not just to **finish**.`,
    body_ru: `Встроенный output style Claude Code. Активируешь
\`/output-style learning\` в любой сессии. Возвращаешься
\`/output-style default\`.

Что меняется: Claude перестаёт быть полезным всезнайкой и становится
учителем. Вместо того чтобы написать решение целиком и протянуть тебе,
он объясняет **что он бы сделал** и **почему**, потом роняет
\`TODO(human)\` маркеры в коде в тех местах где живут нетривиальные
решения. Эти куски пишешь ты.

Конкретный пример. Спрашиваешь «добавь password reset к этому auth
flow». Default-mode Claude пишет целиком — route, controller, email
template, token generation — готово в один shot, скроллишь и
tab-accept.

Learning-mode Claude пишет обвязку (регистрация route, email template,
JWT helpers), но на самом шаге генерации токена роняет маркер:

\`\`\`
// TODO(human): сгенерируй single-use token. Подумай:
// - какая entropy достаточна? (32 случайных байта — стандарт)
// - сколько он должен жить? (15 минут — industry standard)
// - one-time use — должен быть invalidated на первом использовании
// - бонус: rate-limit на email
\`\`\`

Реальную генерацию пишешь ты. Claude review-ит когда ты закончила.

Работает и для prose, design docs, test plans — везде где цель
**научиться**, а не **закончить**.`,

    why_en: `The unspoken risk of Claude Code is autocomplete-brain.
You hit Tab on every suggestion, ship, and a year later you don't
actually understand half the code in your repo. Learning mode is
the explicit antidote: you slow down at exactly the points where
slowing down builds skill, and Claude stays a coach instead of a
crutch. For QA → dev transitions, junior teammates, or yourself when
you notice the slip — this is the lever.`,
    why_ru: `Негласный риск Claude Code — autocomplete-мозг. Жмёшь
Tab на каждую подсказку, шипишь, через год не понимаешь половины
кода в собственном репо. Learning mode — явное противоядие:
тормозишь именно в тех точках где торможение строит навык, и Claude
остаётся коучем а не костылём. Для QA → dev переходов, джунов в
команде или для тебя самой когда замечаешь сдвиг — это рычаг.`,

    use_cases_en: [
      'Learning a new language/framework — Claude scaffolds, you write the parts that teach you the language.',
      'Onboarding junior engineers — they get pair-programming-with-mentor without an actual mentor blocking time.',
      'Catching yourself coasting — switch on for a week when you notice you stopped reading what Claude wrote.',
    ],
    use_cases_ru: [
      'Учишь новый язык/фреймворк — Claude делает обвязку, ты пишешь то что учит языку.',
      'Onboarding джунов — получают pair-programming-with-mentor без живого ментора, тратящего время.',
      'Ловишь себя на coasting-е — включи на неделю когда замечаешь что перестала читать что Claude написал.',
    ],

    install_en: `No install needed — built into Claude Code.

In any session run:
/output-style learning

To go back: /output-style default

For your own custom learning style — drop a markdown file into
~/.claude/output-styles/<name>.md and reference it as /output-style <name>.`,
    install_ru: `Установка не нужна — встроено в Claude Code.

В любой сессии:
/output-style learning

Вернуться обратно: /output-style default

Для своего custom стиля — клади markdown в
~/.claude/output-styles/<имя>.md и вызывай как /output-style <имя>.`,
    url: 'https://code.claude.com/docs/en/output-styles',
  },
]

export const GEM_BY_ID = Object.fromEntries(GEMS.map(g => [g.id, g]))
