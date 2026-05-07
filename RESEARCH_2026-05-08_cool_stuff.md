# RESEARCH 2026-05-08 — Cool Stuff Buffet for Playtika QA Workshop

**Цель**: 40-60 наводок, из которых Анастасия выберет 5-10 для упоминания на сцене. Не "10 полированных" — широкий захват по 8 трекам. Каждый item: имя, ссылка, чем интересен, **Show on screen?** verdict, тег категории.

Categories: `qa-tool` / `mcp` / `agent` / `hook` / `hidden-feature` / `fun` / `community` / `meta`.

Show on screen verdict logic: **yes** = визуально цепляет за 30 секунд без подготовки. **maybe** = красиво если есть скриншот/демка готовая. **no** = только тезис голосом, шоу не получится.

---

## Track 1 — QA-specific Claude Code resources

### 1.1 anthropics/skills (official)
**URL**: https://github.com/anthropics/skills
**1-line**: Официальный репо Anthropic с 17 production skills — PDF, Excel, PPTX, DOCX, frontend-design и др.
**Why interesting**: фундаментальная карта "что Anthropic считает skill-ом" — формат SKILL.md + YAML frontmatter с октября 2025 как открытый стандарт. Под капотом у Claude.ai и Claude Code тот же формат.
**Show on screen?** **yes** — открыть xlsx/SKILL.md, показать как 200 строк markdown превращают Claude в Excel-инженера. Понятно за 20 секунд.
**Tag**: `qa-tool` / `meta`

### 1.2 obra/superpowers (Jesse Vincent)
**URL**: https://github.com/obra/superpowers
**1-line**: "Software development methodology" как набор composable skills — TDD, systematic-debugging, verification-before-completion активируются автоматически.
**Why interesting**: meta-подход — не "вот тебе тул", а "вот тебе процесс". /brainstorm, /write-plan, /execute-plan, skills-search для discovery, SessionStart context injection. Автор — Jesse Vincent (Prime Radiant).
**Show on screen?** **maybe** — README длинный, но если открыть skills/test-driven-development/SKILL.md — видно ad-hoc'ный коучинг прямо в инструкциях.
**Tag**: `qa-tool` / `meta`

### 1.3 lackeyjb/playwright-skill
**URL**: https://github.com/lackeyjb/playwright-skill
**1-line**: Skill для Claude Code, который пишет и сразу выполняет любую Playwright-автоматизацию on-the-fly с скриншотами и консолью.
**Why interesting**: точно ложится в QA-контекст Playtika — "мне нужно проверить flow логина": Claude пишет код, гоняет, возвращает скрин и баг-репорт.
**Show on screen?** **yes** — демо самое наглядное на воркшопе.
**Tag**: `qa-tool`

### 1.4 yusuftayman/playwright-cli-agents
**URL**: https://github.com/yusuftayman/playwright-cli-agents
**1-line**: Claude Code агенты + skills для генерации E2E тестов с Page Object Model паттерном.
**Why interesting**: показывает не просто "сгенерируй тест", а "создай тест в нашей архитектуре" — критично для команд с существующим test framework.
**Show on screen?** **maybe** — структура файлов говорит сама за себя.
**Tag**: `qa-tool`

### 1.5 adampaulwalker/qa-test ("Quinn + Jinx")
**URL**: https://github.com/adampaulwalker/qa-test
**1-line**: Skill с двумя personas — Quinn (методичный QA по success criteria) и Jinx (chaos tester ломает всё).
**Why interesting**: разговор Насти про personas/архетипы ложится сюда идеально. Adversarial mode для exploratory testing.
**Show on screen?** **yes** — название Quinn/Jinx цепляет, можно прочитать описание personas вслух.
**Tag**: `qa-tool` / `agent`

### 1.6 benngaihk/claude-test-site-skill
**URL**: https://github.com/benngaihk/claude-test-site-skill
**1-line**: AI-driven exploratory web testing — Claude сам ходит по сайту, скриншотит, ищет баги визуально.
**Why interesting**: чистый exploratory mode, без сценариев. Для smoke-теста новой фичи или нового билда — именно это и хочется.
**Show on screen?** **yes** — у автора в README часто есть GIF.
**Tag**: `qa-tool`

### 1.7 airowe/claude-a11y-skill
**URL**: https://github.com/airowe/claude-a11y-skill
**1-line**: Skill для accessibility-аудитов через axe-core + jsx-a11y eslint plugin.
**Why interesting**: a11y — слабое место gaming-тестирования (Playtika работает в нескольких регионах с regulatory requirements). Auto-audit в pipeline.
**Show on screen?** **no** — текстовый skill, не визуально.
**Tag**: `qa-tool`

### 1.8 Community-Access/accessibility-agents
**URL**: https://github.com/Community-Access/accessibility-agents
**1-line**: 11 специализированных агентов под WCAG 2.2 AA для предотвращения генерации недоступного кода.
**Why interesting**: специализация — отдельный агент на screen reader, отдельный на keyboard navigation, отдельный на color contrast. Параллель к "vibe-coding accessibility gap".
**Show on screen?** **no** — список агентов, не зрелищно.
**Tag**: `qa-tool` / `agent`

### 1.9 transilienceai/communitytools
**URL**: https://github.com/transilienceai/communitytools
**1-line**: 26 skills + 3 tool integrations для penetration testing, bug bounty и security research.
**Why interesting**: security testing на стыке QA. Полезно показать что AI agents уже используют для red teaming.
**Show on screen?** **maybe** — список тематический, можно открыть конкретный skill.
**Tag**: `qa-tool`

### 1.10 qdhenry/Claude-Command-Suite
**URL**: https://github.com/qdhenry/Claude-Command-Suite
**1-line**: 216+ slash commands, 12 skills, 54 агента — code review, testing, deployment, GitHub-Linear синхронизация.
**Why interesting**: масштаб впечатляет, и QA-релевантные команды (code review + test) сразу видны.
**Show on screen?** **yes** — README с табличкой сразу даёт WAU.
**Tag**: `qa-tool` / `agent`

### 1.11 wshobson/agents
**URL**: https://github.com/wshobson/agents
**1-line**: 76+ production-ready subagents — backend-architect, frontend-developer, ui-ux-designer, mobile-developer и т.д.
**Why interesting**: модель-аутентичность важна — агенты сконфигурированы на разные модели Claude по сложности задачи (cost-aware orchestration).
**Show on screen?** **maybe** — открыть один файл (например docs-architect.md) и показать как описан subagent — формат важнее списка.
**Tag**: `agent`

### 1.12 VoltAgent/awesome-claude-code-subagents
**URL**: https://github.com/VoltAgent/awesome-claude-code-subagents
**1-line**: 100+ субагентов сгруппированных по use-case'ам.
**Why interesting**: агрегатор агрегаторов — подходит чтобы показать "размер экосистемы" за 5 секунд скролла.
**Show on screen?** **yes** — скролл README впечатляет.
**Tag**: `agent` / `community`

### 1.13 jeremylongshore/claude-code-plugins-plus-skills
**URL**: https://github.com/jeremylongshore/claude-code-plugins-plus-skills
**1-line**: 425 plugins + 2,810 skills + 200 агентов через ccpi CLI package manager.
**Why interesting**: масштаб становится absurd — на воркшопе для QA это иллюстрация "вы не отстали, экосистема просто взорвалась".
**Show on screen?** **yes** — цифры в README сразу сделают эффект.
**Tag**: `community`

### 1.14 rohitg00/awesome-claude-code-toolkit
**URL**: https://github.com/rohitg00/awesome-claude-code-toolkit
**1-line**: 135 агентов, 35 skills (+ 400,000 через SkillKit), 42 commands, 176+ plugins, 20 hooks, 15 rules.
**Why interesting**: один из самых полных toolkit-ов. Цифра "400k skills" впечатляет.
**Show on screen?** **maybe**.
**Tag**: `community` / `meta`

### 1.15 hesreallyhim/awesome-claude-code
**URL**: https://github.com/hesreallyhim/awesome-claude-code
**1-line**: Главный awesome-list для всего Claude Code: skills, hooks, slash-commands, orchestrators, plugins.
**Why interesting**: это та закладка, которую QA должен сделать после воркшопа. Канонический entry point.
**Show on screen?** **yes** — но как закрытие, "вот куда идти дальше".
**Tag**: `community`

### 1.16 testdino — "Quinn AI QA Engineer" workflow
**URL**: https://testdino.com/blog/playwright-skill-claude-code
**1-line**: Practical case study — Claude Code сгенерировал 82 E2E теста для e-commerce за один прогон.
**Why interesting**: это не репо, а статья с цифрами. Хорошо для слайда "что это даёт в реальной работе".
**Show on screen?** **maybe** — выдержка с цифрами на слайде.
**Tag**: `qa-tool`

### 1.17 alexop.dev — "AI QA Engineer with Claude Code + Playwright MCP"
**URL**: https://alexop.dev/posts/automated-qa-claude-code-agent-browser-cli-github-actions/
**1-line**: Туториал — как поставить Claude Code как QA-тестера в GitHub Actions, который тестирует приложение на каждый PR и пишет баг-репорт.
**Why interesting**: ровно то что Playtika может внедрить за неделю — AI QA в CI.
**Show on screen?** **maybe** — слайд с pipeline diagram.
**Tag**: `qa-tool`

---

## Track 2 — MCP servers worth knowing about

### 2.1 microsoft/playwright-mcp
**URL**: https://github.com/microsoft/playwright-mcp
**1-line**: Официальный Playwright MCP — Claude управляет Chromium/Firefox/WebKit через accessibility tree, не скриншоты.
**Why interesting**: 27,900 stars, zero vision model. "Самый трансформативный MCP для веб-разработки" по консенсусу 2026. Без него QA на Claude — не QA.
**Show on screen?** **yes** — обязательно. Подключить, открыть playtika.com, попросить "найди форму регистрации и опиши доступность".
**Tag**: `mcp` / `qa-tool`

### 2.2 browser-use/browser-use
**URL**: https://github.com/browser-use/browser-use
**1-line**: Open-source альтернатива Browserbase — LLM получает full autonomous browser control с re-reasoning на каждом шаге.
**Why interesting**: для exploratory testing где Playwright — overkill. Persistent agent sessions.
**Show on screen?** **maybe** — сложнее запустить чем Playwright MCP.
**Tag**: `mcp` / `qa-tool`

### 2.3 Browserbase MCP
**URL**: https://www.browserbase.com/
**1-line**: Hosted browser infrastructure — natural-language actions, cloud scaling, без локального Chrome.
**Why interesting**: для QA в распределённой команде — браузер живёт в облаке, работает с залогиненной сессией. Stagehand натуральный язык vs точный код Playwright.
**Show on screen?** **no** — требует API ключи и сетап.
**Tag**: `mcp`

### 2.4 Sentry MCP
**URL**: https://github.com/getsentry/sentry-mcp
**1-line**: Тянет stack traces, breadcrumbs и project health прямо в контекст Claude. С AI-powered Seer диагностикой.
**Why interesting**: для QA-leads — расследование production incidents без переключения окон. "Покажи мне топ-5 ошибок за вечер" + объяснение.
**Show on screen?** **yes** — если у Playtika есть Sentry, демо локальный.
**Tag**: `mcp` / `qa-tool`

### 2.5 Datadog MCP
**URL**: https://docs.datadoghq.com/integrations/mcp/
**1-line**: Метрики, логи, трейсы — Claude слайсит сквозь сервисы для post-mortem'ов.
**Why interesting**: "почему медленно в проде" на естественном языке. Опять же — для QA-leads.
**Show on screen?** **no** — требует Datadog account.
**Tag**: `mcp`

### 2.6 GitHub MCP (official)
**URL**: https://github.com/github/github-mcp-server
**1-line**: Issues, PRs, code search, releases — всё через Claude.
**Why interesting**: базовый, но не упомянуть — преступление. "Claude, проверь все мои PR за неделю на failing tests".
**Show on screen?** **yes** — самый универсально полезный.
**Tag**: `mcp`

### 2.7 Atlassian MCP (Jira + Confluence + Compass)
**URL**: https://www.atlassian.com/blog/announcements/remote-mcp-server
**1-line**: Официальный, GA с февраля 2026. OAuth, чтение и запись.
**Why interesting**: Playtika почти наверняка на Jira. Sprint planning, ticket creation, Confluence search через Claude.
**Show on screen?** **yes** — высокая практическая ценность для аудитории.
**Tag**: `mcp` / `qa-tool`

### 2.8 Linear MCP
**URL**: https://linear.app/changelog/mcp
**1-line**: То же что Jira, но красивее. Issues, cycles, projects.
**Why interesting**: если кто-то в зале ушёл с Jira — Linear-MCP знакомо ласкает.
**Show on screen?** **maybe**.
**Tag**: `mcp`

### 2.9 monday.com MCP
**URL**: https://monday.com/developers/mcp
**1-line**: Boards, items, columns, dashboards.
**Why interesting**: упомянуть факт что monday.com уже среди nine launch partners для Interactive Claude Apps (Jan 2026).
**Show on screen?** **no**.
**Tag**: `mcp`

### 2.10 Notion MCP
**URL**: https://github.com/makenotion/notion-mcp-server
**1-line**: Доступ к страницам, базам, поиску.
**Why interesting**: для team docs и QA wiki. "Claude, найди в Notion раздел про регрессионные сценарии для login flow".
**Show on screen?** **maybe**.
**Tag**: `mcp`

### 2.11 cloudflare/mcp
**URL**: https://github.com/cloudflare/mcp
**1-line**: Token-efficient MCP для всего Cloudflare API — 2500 endpoints в 1k токенов через Code Mode.
**Why interesting**: technical curiosity — как сжать API в 1k токенов. Для devops-side QA.
**Show on screen?** **no**.
**Tag**: `mcp`

### 2.12 Vercel MCP
**URL**: https://vercel.com/docs/mcp
**1-line**: Builds, env vars, logs, projects.
**Why interesting**: Frontend-heavy QA workflow — мониторинг preview deploys.
**Show on screen?** **maybe**.
**Tag**: `mcp`

### 2.13 Spotify MCP — `marcelmarais/spotify-mcp-server`
**URL**: https://github.com/marcelmarais/spotify-mcp-server
**1-line**: Lightweight MCP для контроля Spotify — поиск, плейлисты, playback.
**Why interesting**: чистый "fun" — показать что Claude может ставить focus-музыку под задачу. WAU-эффект гарантирован.
**Show on screen?** **yes** — "Claude, поставь что-нибудь под debugging" → играет музыка → зал смеётся.
**Tag**: `mcp` / `fun`

### 2.14 denar90/suzu-mcp
**URL**: https://github.com/denar90/suzu-mcp
**1-line**: Spotify-треки как notification sounds для Claude Code completion. Назван в честь японского ритуального колокольчика.
**Why interesting**: "Claude закончил работу — играет твой любимый трек". Чистая радость инженерии.
**Show on screen?** **yes** — поставить на демку.
**Tag**: `mcp` / `fun` / `hook`

### 2.15 Figma MCP (official Dev Mode)
**URL**: https://www.figma.com/dev-mode/mcp
**1-line**: Live structure выделенного слоя — hierarchy, auto-layout, variants, text styles, tokens.
**Why interesting**: design-to-code без скриншотов. Для QA — проверка соответствия Figma-макетам.
**Show on screen?** **yes** — взять кусок Figma frame, попросить Claude описать какие токены/variants → код.
**Tag**: `mcp`

### 2.16 GLips/Figma-Context-MCP
**URL**: https://github.com/GLips/Figma-Context-MCP
**1-line**: 15K stars community-альтернатива — design context для агентов чтобы делать one-shot implementation.
**Why interesting**: до официального Dev Mode был стандартом, до сих пор проще для read-only сценариев.
**Show on screen?** **maybe**.
**Tag**: `mcp`

### 2.17 yctimlin/mcp_excalidraw
**URL**: https://github.com/yctimlin/mcp_excalidraw
**1-line**: Programmatic control Excalidraw — Claude рисует архитектурные диаграммы и UX flow charts из структурированных данных.
**Why interesting**: WAU момент — попросить "нарисуй мне state machine для нашего checkout flow" и получить готовую Excalidraw-диаграмму.
**Show on screen?** **yes** — обязательно.
**Tag**: `mcp` / `fun`

### 2.18 korotovsky/slack-mcp-server
**URL**: https://github.com/korotovsky/slack-mcp-server
**1-line**: "The most powerful MCP Slack Server" — без permission requirements, поддержка Apps, GovSlack, DMs, Group DMs, smart history fetch.
**Why interesting**: для team comms — Claude мониторит каналы, отвечает на ментионы, синхронизирован с обсуждениями.
**Show on screen?** **maybe**.
**Tag**: `mcp`

### 2.19 Discord/Telegram MCP via Claude Code Channels
**URL**: https://code.claude.com/docs/en/channels (research preview)
**1-line**: Anthropic-нативные каналы — управляешь Claude Code из Telegram или Discord чата. Запущено март 2026, потом iMessage.
**Why interesting**: "оставил Claude работать ночью, контролирую с телефона из Telegram" — для девопс-side QA mind-blowing.
**Show on screen?** **yes** — скриншот чата с Claude Code.
**Tag**: `mcp` / `hidden-feature`

### 2.20 doobidoo/mcp-memory-service
**URL**: https://github.com/doobidoo/mcp-memory-service
**1-line**: Open-source persistent memory для AI agent pipelines — REST API + knowledge graph + autonomous consolidation.
**Why interesting**: совместим с LangGraph, CrewAI, AutoGen и Claude. Не привязан к одному фреймворку.
**Show on screen?** **no**.
**Tag**: `mcp`

### 2.21 MemPalace
**URL**: https://github.com/mempalace/mempalace
**1-line**: Free MCP-native memory system. Создан Миллой Йовович (актриса!) и Ben Sigman. Виральный апрель 2026.
**Why interesting**: 96.6% LongMemEval (не 100% как утверждали изначально) против Mem0 ~85% и Zep ~82%. И — Милла Йовович пишет код. WAU-история готовая.
**Show on screen?** **yes** — сама история про Миллу как соавтора репо это уже слайд.
**Tag**: `mcp` / `fun`

### 2.22 zilliztech/memsearch
**URL**: https://github.com/zilliztech/memsearch
**1-line**: Persistent unified memory layer для AI agents — Markdown + Milvus.
**Why interesting**: Markdown-first storage важен — память git-friendly, можно ревьюить вручную.
**Show on screen?** **no**.
**Tag**: `mcp`

### 2.23 punkpeye/awesome-mcp-servers
**URL**: https://github.com/punkpeye/awesome-mcp-servers
**1-line**: Главный awesome-list для всех MCP — десятки категорий.
**Why interesting**: после воркшопа QA пойдёт сюда искать всё.
**Show on screen?** **yes** — финальный slide "что дальше".
**Tag**: `community`

### 2.24 TensorBlock/awesome-mcp-servers
**URL**: https://github.com/TensorBlock/awesome-mcp-servers
**1-line**: Альтернативный awesome-list, разбит по docs/communication--messaging.md, cloud-platforms, и т.д.
**Why interesting**: лучше структурирован чем punkpeye для целевого поиска.
**Show on screen?** **maybe**.
**Tag**: `community`

---

## Track 3 — Cool agents and orchestrators

### 3.1 smtg-ai/claude-squad
**URL**: https://github.com/smtg-ai/claude-squad
**1-line**: Terminal app — менеджер мультипл AI агентов (Claude Code, Codex, Aider, Gemini) в tmux + git worktrees.
**Why interesting**: ~6.9k stars. "Самый быстрый путь от 0 до 5 параллельных агентов". Tmux-сессии, изоляция через worktrees.
**Show on screen?** **yes** — TUI красивый, легко показать.
**Tag**: `agent`

### 3.2 ruvnet/ruflo (formerly claude-flow)
**URL**: https://github.com/ruvnet/ruflo
**1-line**: 100+ специализированных агентов через swarm topologies, queens-coordinators, vector memory, multi-model failover.
**Why interesting**: "agents don't just run, they collaborate". Federated comms, enterprise security. Claude → Ruflo история name-change'а — "rUv loves Rust, flow states".
**Show on screen?** **maybe** — README впечатляет, но live-демо сложно.
**Tag**: `agent`

### 3.3 pablodelucca/pixel-agents
**URL**: https://github.com/pablodelucca/pixel-agents
**1-line**: VS Code extension — агенты как пиксельные персонажи в офисе. Печатают когда пишут код, читают когда ищут файлы, ждут когда нужно подтверждение.
**Why interesting**: visual delight. Покрытие в Fast Company "this charming pixel art game solves one of AI coding's most annoying UX problems".
**Show on screen?** **YES** — это и есть jaw-dropper. Один скрин и зал ваш.
**Tag**: `agent` / `fun`

### 3.4 paulrobello/claude-office
**URL**: https://github.com/paulrobello/claude-office
**1-line**: Standalone real-time pixel art office. "Boss" character (main agent) спавнит "employees" (subagents).
**Why interesting**: то же что pixel-agents, но без VS Code зависимости. Tauri + Rust.
**Show on screen?** **yes**.
**Tag**: `agent` / `fun`

### 3.5 Outworked
**URL**: https://agent-wars.com/news/2026-03-24-outworked-open-source-pixel-art-office-ui-for-orchestrating-claude-code-agents
**1-line**: Open-source Electron desktop app — Claude Code в 8-bit офисе, каждый агент = employee со столом, sprite'ом, личностью.
**Why interesting**: orchestrator + visualization в одном. Inter-agent communication через message bus.
**Show on screen?** **yes** — наследник Pixel Agents но более полная штука.
**Tag**: `agent` / `fun`

### 3.6 block/goose
**URL**: https://github.com/block/goose
**1-line**: Open-source AI agent — CLI + desktop app, MCP integration, любой LLM.
**Why interesting**: альтернатива Claude Code когда нужен другой LLM провайдер. Полезно знать что есть.
**Show on screen?** **maybe** — UI красивый, но нужно подготовить.
**Tag**: `agent`

### 3.7 Aider
**URL**: https://github.com/Aider-AI/aider
**1-line**: Старейший terminal AI coding tool. 13,100+ commits, 93 releases, стабильно высокий SWE-bench.
**Why interesting**: исторический контекст — до Claude Code был Aider. Все хорошие практики (git-friendly, repo map) пошли отсюда.
**Show on screen?** **maybe** — для исторического слайда.
**Tag**: `agent`

### 3.8 OpenCode
**URL**: https://github.com/sst/opencode
**1-line**: Open-source terminal coding agent — претендент на трон Claude Code, поддержка любого LLM.
**Why interesting**: для QA в company-environments где Claude Code заблокирован policy — OpenCode альтернатива.
**Show on screen?** **maybe**.
**Tag**: `agent`

### 3.9 musistudio/claude-code-router
**URL**: https://github.com/musistudio/claude-code-router
**1-line**: Middleware — Claude Code хранит UX, но запросы маршрутизируются на DeepSeek, Gemini, Groq, Ollama и т.д.
**Why interesting**: для QA-leads которым нужно cost-control. Cheap models на routine, Opus на сложное.
**Show on screen?** **no** — конфиг-инструмент.
**Tag**: `agent`

### 3.10 kaitranntt/ccs (CC Switch)
**URL**: https://github.com/kaitranntt/ccs
**1-line**: Visual dashboard для переключения между Claude / Gemini / Copilot / OpenRouter (300+ моделей) через CLIProxyAPI.
**Why interesting**: один shortcut переключает провайдера прямо в Claude Code сессии.
**Show on screen?** **no**.
**Tag**: `agent`

---

## Track 4 — Hooks and automation

### 4.1 disler/claude-code-hooks-mastery
**URL**: https://github.com/disler/claude-code-hooks-mastery
**1-line**: Каноничный repo по Claude Code hooks — 13 lifecycle events, рабочие примеры, deterministic AI workflow patterns.
**Why interesting**: главный учебник по hooks. Всё остальное черпает примеры отсюда.
**Show on screen?** **yes** — открыть .claude/hooks/ структуру.
**Tag**: `hook`

### 4.2 sirmalloc/ccstatusline
**URL**: https://github.com/sirmalloc/ccstatusline
**1-line**: Powerline статусная строка для Claude Code — model, branch, token usage, session duration, compaction count, block timer.
**Why interesting**: визуально красивая, и token-counter всегда видный — меняет привычку к /compact.
**Show on screen?** **yes** — скрин terminal'а с Powerline.
**Tag**: `hook`

### 4.3 ccusage statusline
**URL**: https://ccusage.com/guide/statusline
**1-line**: Статусная строка с usage analysis — сколько денег ты сжёг сегодня и за месяц.
**Why interesting**: financial discipline. Прямо в строке статуса видно "сегодня $4.20 на этом проекте".
**Show on screen?** **yes**.
**Tag**: `hook`

### 4.4 ChanMeng666/claude-code-audio-hooks
**URL**: https://github.com/ChanMeng666/claude-code-audio-hooks
**1-line**: Audio notification system — 26 hook events, 2 audio themes, rate-limit alerts, webhooks, TTS читает Claude'ов финальный месседж.
**Why interesting**: TTS speaks **actual final message** (truncated to 200 chars) — не "Task completed", а суть.
**Show on screen?** **yes** — звук работает на воркшопе мгновенно.
**Tag**: `hook` / `fun`

### 4.5 ZeldOcarina/claude-code-voice-notifications
**URL**: https://github.com/ZeldOcarina/claude-code-voice-notifications
**1-line**: Intelligent voice notifications via ElevenLabs — Claude говорит твоим голосом или Morgan Freeman'овским когда закончил.
**Why interesting**: ElevenLabs voices premium-фичи. Можно сделать "Claude закончил голосом твоей мамы".
**Show on screen?** **yes** — заиграет → зал в восторге.
**Tag**: `hook` / `fun`

### 4.6 Tiimie1/claude-bell
**URL**: https://github.com/Tiimie1/claude-bell
**1-line**: Pure Go, zero dependencies — просто chimes когда задачи закончены, нужно внимание, или хит context limit.
**Why interesting**: minimalism — не нужны API keys, не нужны Python зависимости.
**Show on screen?** **maybe**.
**Tag**: `hook`

### 4.7 husniadil/cc-hooks
**URL**: https://github.com/husniadil/cc-hooks
**1-line**: Audio feedback с TTS announcements + sound effects + contextual AI messages, multi-language.
**Why interesting**: мульти-провайдер — может говорить через ElevenLabs, OpenAI или local TTS.
**Show on screen?** **maybe**.
**Tag**: `hook`

### 4.8 SessionStart context auto-loader pattern
**URL**: https://claudefa.st/blog/tools/hooks/session-lifecycle-hooks
**1-line**: SessionStart hook загружает git status, recent commits, open issues при каждом старте.
**Why interesting**: нет команды "загрузи контекст" — всё уже загружено. Меняет ощущение Claude как "знает мой проект".
**Show on screen?** **yes** — конфиг settings.json + первый startup.
**Tag**: `hook`

### 4.9 PreToolUse guard pattern (branch-guard, secrets-scanner)
**URL**: https://code.claude.com/docs/en/hooks
**1-line**: Хук возвращает exit code 2 — Claude Code откажется выполнять операцию. Нативный механизм блокировки.
**Why interesting**: можно блочить deploy в main, блочить commit'ы с секретами, блочить rm -rf — всё на уровне hook'ов.
**Show on screen?** **yes** — простой пример guard-script.sh.
**Tag**: `hook`

### 4.10 Multi-level notification (Michael Swann gist)
**URL**: https://gist.github.com/michael-swann-rp/6112d64456b49ec606d7fdbe1e2bd310
**1-line**: Полная связка terminal bell + tab title + sound + desktop notification.
**Why interesting**: не один уровень оповещений, а лесенка. Tab меняет иконку — видно периферическим зрением.
**Show on screen?** **maybe**.
**Tag**: `hook`

---

## Track 5 — Cool one-off projects

### 5.1 a16z-infra/ai-town
**URL**: https://github.com/a16z-infra/ai-town
**1-line**: Виртуальный городок где AI-персонажи живут, общаются, социализируются. MIT-licensed starter kit.
**Why interesting**: основан на статье "Generative Agents: Interactive Simulacra of Human Behavior" (Stanford). JS/TS вместо Python — большинство симуляторов на Python.
**Show on screen?** **yes** — convex.dev/ai-town хост готовая демка, открывается мгновенно.
**Tag**: `fun`

### 5.2 karpathy/nanochat
**URL**: https://github.com/karpathy/nanochat
**1-line**: ChatGPT за $100 compute. 8000 строк PyTorch end-to-end pipeline — pretraining, finetuning, inference.
**Why interesting**: запущен октябрь 2025. Karpathy в феврале 2026 опубликовал "Beating GPT-2 for <<$100: the nanochat journey". Для технической аудитории — это икра.
**Show on screen?** **yes** — README + одна цифра $100 = слайд.
**Tag**: `fun` / `meta`

### 5.3 karpathy/nanoGPT
**URL**: https://github.com/karpathy/nanoGPT
**1-line**: Простейший repo для training/finetuning средних GPT'шек. Каноничный учебник.
**Why interesting**: до nanochat был это. Парный мини-курс на YouTube.
**Show on screen?** **yes** — code минималистичный.
**Tag**: `fun`

### 5.4 karpathy/build-nanogpt
**URL**: https://github.com/karpathy/build-nanogpt
**1-line**: Видео-лекция на 4 часа + код — как построить nanoGPT с нуля.
**Why interesting**: аудитория QA не пишет ML, но Karpathy делает математику доступной. Закладка на потом.
**Show on screen?** **no**.
**Tag**: `fun`

### 5.5 Decart Oasis
**URL**: https://oasis-model.github.io/
**1-line**: Real-time playable Minecraft, генерируемый AI-моделью покадрово — 20 fps, frame-by-frame на keyboard input.
**Why interesting**: первый "experiential, realtime, open-world AI model". 100x faster than SOTA. Намёк на Etched chip — 4K gameplay в будущем.
**Show on screen?** **YES** — playable demo прямо в браузере, jaw-dropper уровня "тоже самое что AlphaGo в 2016".
**Tag**: `fun`

### 5.6 etched-ai/open-oasis
**URL**: https://github.com/etched-ai/open-oasis
**1-line**: Open-source inference script для Oasis 500M.
**Why interesting**: можно посмотреть как это устроено внутри.
**Show on screen?** **no**.
**Tag**: `fun`

### 5.7 Suno + DAW (Suno Studio)
**URL**: https://suno.com/
**1-line**: Text-to-song с лучшим vocal synthesis + полноценный DAW. $250M raise при $2.45B valuation.
**Why interesting**: 87% музыкантов уже использовали AI (LANDR survey, 1200+ artists). Можно сделать "QA team theme song" за минуту.
**Show on screen?** **yes** — сгенерить песню "Bug Hunt Anthem" под воркшоп → играет.
**Tag**: `fun`

### 5.8 ACE-Step (open-source Suno alternative)
**URL**: https://github.com/ace-step/ACE-Step
**1-line**: Suno-уровень простоты + полная кастомизация и privacy. Local generation на consumer GPUs.
**Why interesting**: для тех кому Suno cloud-only не подходит.
**Show on screen?** **no**.
**Tag**: `fun`

### 5.9 ggml-org/llama.cpp
**URL**: https://github.com/ggml-org/llama.cpp
**1-line**: LLM inference в C/C++. Двигатель под Ollama, LM Studio и большинством local-LLM tools.
**Why interesting**: фундамент. Q4_K_M quantization → 7B модель влезает в 4-6GB VRAM. На M2 Pro 16GB можно.
**Show on screen?** **maybe** — Repository впечатляет статистикой.
**Tag**: `fun` / `meta`

### 5.10 ollama
**URL**: https://github.com/ollama/ollama
**1-line**: One-command local LLM runner. `ollama run llama3` — и пошло.
**Why interesting**: 70B Q4_K_M даёт 20-30 tokens/sec на Apple Silicon. Privacy-first для QA данных которые нельзя отправлять в облако.
**Show on screen?** **yes** — `ollama run` команда впечатляет.
**Tag**: `fun`

### 5.11 LM Studio
**URL**: https://lmstudio.ai/
**1-line**: GUI поверх llama.cpp — встроенный hub для моделей, чат прямо в приложении.
**Why interesting**: для тех кому страшно в терминале. M2 Pro 16GB → 7B model легко.
**Show on screen?** **yes** — GUI красивый.
**Tag**: `fun`

### 5.12 Voice mode — VoiceMode MCP (local Whisper + Kokoro)
**URL**: https://gist.github.com/jlmalone/02d09aeb4e09890a8a9e7c2333a18377
**1-line**: Полностью локальная voice mode для Claude Code на macOS — Whisper STT + Kokoro TTS, без API ключей.
**Why interesting**: privacy-first speech. `claude mcp add --scope user voicemode -- uvx --refresh --with webrtcvad --with "setuptools<71" voice-mode`.
**Show on screen?** **yes** — проговорить команду голосом → Claude отвечает.
**Tag**: `hidden-feature` / `fun`

### 5.13 ElevenLabs Cookbook — low-latency voice assistant
**URL**: https://platform.claude.com/cookbook/third-party-elevenlabs-low-latency-stt-claude-tts
**1-line**: Официальный Anthropic cookbook — STT через ElevenLabs, ответ Claude, TTS обратно.
**Why interesting**: production-grade voice loop за час.
**Show on screen?** **maybe**.
**Tag**: `fun`

### 5.14 JWitcoff/Claude_Chat
**URL**: https://github.com/JWitcoff/Claude_Chat
**1-line**: Voice-enabled chat interface для Claude Code через ElevenLabs Pro.
**Why interesting**: sprint-based development pattern — один проект, один спринт, одна сессия с голосом.
**Show on screen?** **no**.
**Tag**: `fun`

### 5.15 charm.land (Charmbracelet — gum, glamour, lipgloss, bubbletea)
**URL**: https://charm.land/
**1-line**: Toolkit для красивых TUI — стилизованные input'ы, меню, confirmations, spinners, tables.
**Why interesting**: эстетика терминала. Все красивые TUI на Go (lazygit и др.) построены на этих библиотеках.
**Show on screen?** **yes** — `gum` demo.
**Tag**: `fun`

### 5.16 lazygit
**URL**: https://github.com/jesseduffield/lazygit
**1-line**: Terminal UI для git — staging, branching, rebasing мышью без вспоминания команд.
**Why interesting**: must-have для QA которые делают git-операции но не любят CLI.
**Show on screen?** **yes** — открыл в репо, сделал stage/commit за 5 секунд.
**Tag**: `fun`

### 5.17 k9s
**URL**: https://github.com/derailed/k9s
**1-line**: Kubernetes TUI — real-time мониторинг кластера + interactive команды.
**Why interesting**: для QA которые проверяют production deploys.
**Show on screen?** **yes** — TUI красивый.
**Tag**: `fun`

### 5.18 atuin
**URL**: https://github.com/atuinsh/atuin
**1-line**: Sync, search и backup shell history. Между машинами.
**Why interesting**: "что я набирал на Linux-десктопе три недели назад" → доступно на macbook'е.
**Show on screen?** **maybe**.
**Tag**: `fun`

### 5.19 mcfly
**URL**: https://github.com/cantino/mcfly
**1-line**: Context-aware fuzzy search shell history. Замена Ctrl+R.
**Why interesting**: ML-based ranking — частые команды в текущей директории всплывают первыми.
**Show on screen?** **maybe**.
**Tag**: `fun`

### 5.20 warp.dev
**URL**: https://www.warp.dev/
**1-line**: AI-нативный терминал — built-in agent, blocks вместо текста, multiplayer прямо в окне.
**Why interesting**: альтернатива iTerm. Warp Agent работает рядом с Claude Code.
**Show on screen?** **yes** — UI впечатляет.
**Tag**: `fun`

### 5.21 fartscroll.js (The Onion)
**URL**: https://github.com/theonion/fartscroll.js
**1-line**: jQuery plugin — играет fart sounds когда скроллишь страницу.
**Why interesting**: pure programmer humor. От реального The Onion eng team.
**Show on screen?** **maybe** — для лёгкости момента.
**Tag**: `fun`

### 5.22 vapor.js
**URL**: https://github.com/vapor-js/vapor.js
**1-line**: "World's smallest JavaScript library" — 0 lines of code.
**Why interesting**: 100% test coverage. Бессмертная шутка.
**Show on screen?** **maybe**.
**Tag**: `fun`

### 5.23 pipes.sh
**URL**: https://github.com/pipeseroni/pipes.sh
**1-line**: Animated pipes screensaver в терминале. Bash one-liner.
**Why interesting**: цельная nostalgia + красиво. Запускать на проекторе на перерыве.
**Show on screen?** **yes** — ставится в фон во время кофе-брейка.
**Tag**: `fun`

### 5.24 cbonsai (bonsai.sh)
**URL**: https://gitlab.com/jallbrit/cbonsai
**1-line**: Procedurally generated bonsai trees в терминале. Меняется в реальном времени.
**Why interesting**: calmer fun, Zen-эстетика терминала.
**Show on screen?** **yes** — фон между демками.
**Tag**: `fun`

---

## Track 6 — Hidden Claude Code features

### 6.1 Output Styles (Explanatory + Learning + Custom)
**URL**: https://code.claude.com/docs/en/output-styles
**1-line**: `/config` → Output Style. Explanatory даёт educational "Insights" между задачами, Learning ставит TODO(human) маркеры в код чтобы ты сам дописал.
**Why interesting**: для onboarding и обучения junior-QA — Learning mode превращает Claude в коуча. Custom styles в `~/.claude/output-styles/` — markdown с frontmatter.
**Show on screen?** **yes** — переключить на Learning live и попросить Claude помочь решить задачу.
**Tag**: `hidden-feature`

### 6.2 ENABLE_TOOL_SEARCH (lazy-load MCP)
**URL**: https://paddo.dev/blog/claude-code-hidden-mcp-flag/
**1-line**: `~/.claude/settings.json` → `{ "env": { "ENABLE_TOOL_SEARCH": "true" } }`. Tools грузятся on-demand, не на старте.
**Why interesting**: 77K → 8.7K токенов overhead с 50+ MCP tools. **85% reduction**. Anthropic объявили официально 14 января 2026.
**Show on screen?** **yes** — числовой эффект сильный.
**Tag**: `hidden-feature`

### 6.3 Worktree mode (`claude --worktree`)
**URL**: https://code.claude.com/docs/en/worktrees
**1-line**: `claude --worktree feature-auth` создаёт изолированный git worktree и стартует сессию там. Параллельные задачи без конфликтов.
**Why interesting**: subagents можно запускать с `isolation: worktree` frontmatter. Auto-cleanup если изменений нет.
**Show on screen?** **yes** — простая команда даёт впечатляющий результат.
**Tag**: `hidden-feature`

### 6.4 Headless mode + stream-json output
**URL**: https://backgroundclaude.com/blog/stream-json
**1-line**: `claude -p "..." --output-format stream-json` — newline-delimited JSON events для CI/CD, overnight batches, dashboards.
**Why interesting**: third format — `system/api_retry` event'ы отличают "Claude думает" от "rate-limit".
**Show on screen?** **yes** — кусок JSON-вывода.
**Tag**: `hidden-feature`

### 6.5 Recursive @-imports в CLAUDE.md
**URL**: https://code.claude.com/docs/en/memory
**1-line**: `@path/to/import` синтаксис в CLAUDE.md — рекурсивно до **5 уровней** глубины.
**Why interesting**: модульная конфигурация. Imported файлы тихо обрезаются на 2000 строках.
**Show on screen?** **maybe** — пример CLAUDE.md с импортами.
**Tag**: `hidden-feature`

### 6.6 1M context (Opus 4.7 / 4.6 / Sonnet 4.6)
**URL**: https://claude.com/blog/1m-context-ga
**1-line**: 1M токенов контекст GA. Max/Team/Enterprise — Opus автоматически апгрейдится на 1M без конфигов.
**Why interesting**: до 600 images/PDF pages в одном request. Codebase + Datadog logs + Sentry traces вместе.
**Show on screen?** **yes** — слайд с цифрой 1,000,000.
**Tag**: `hidden-feature`

### 6.7 Ctrl+O — toggle thinking blocks
**URL**: https://code.claude.com/docs/en/extended-thinking
**1-line**: Ctrl+O разворачивает/сворачивает все thinking blocks в сессии. Видно tool call details, execution traces, internal reasoning.
**Why interesting**: с v2.0.0 thinking не показывается в verbose mode по умолчанию. `showThinkingSummaries: true` в settings.json для steering.
**Show on screen?** **yes** — Ctrl+O live + thinking разворачивается.
**Tag**: `hidden-feature`

### 6.8 /compact с steering
**URL**: https://code.claude.com/docs/en/slash-commands
**1-line**: `/compact "сохрани только важное про auth flow"` — Claude сжимает контекст с твоими указаниями что ценить.
**Why interesting**: не просто сжатие, а guided summary. Меняет стратегию долгих сессий.
**Show on screen?** **maybe** — текстовая команда.
**Tag**: `hidden-feature`

### 6.9 /voice command (Voice Mode)
**URL**: https://techcrunch.com/2026/03/03/claude-code-rolls-out-a-voice-mode-capability/
**1-line**: `/voice` toggle. Anthropic-нативная voice. 5 голосов: Buttery, Airy, Mellow, Glassy, Rounded (через ElevenLabs).
**Why interesting**: rolled out март 2026. ~5% юзеров изначально, broader rollout.
**Show on screen?** **yes** — заговорить с Claude live.
**Tag**: `hidden-feature`

### 6.10 Plugin marketplaces + `/plugin install`
**URL**: https://code.claude.com/docs/en/discover-plugins
**1-line**: `/plugin marketplace add owner/repo` → `/plugin install commit-commands@anthropics-claude-code` → `/reload-plugins`.
**Why interesting**: ecosystem уровня браузерных extensions. Anthropic-managed: anthropics/claude-plugins-official.
**Show on screen?** **yes** — TUI plugin manager.
**Tag**: `hidden-feature`

### 6.11 Claude Code Channels (Telegram + Discord + iMessage)
**URL**: https://code.claude.com/docs/en/channels
**1-line**: Управляешь Claude Code из Telegram/Discord. Любой MCP, реализующий channel протокол, может пушить events.
**Why interesting**: research preview март 2026. Спустя неделю — iMessage support.
**Show on screen?** **yes** — скрин Telegram-чата с Claude.
**Tag**: `hidden-feature`

### 6.12 SpecStory — auto-save sessions to markdown
**URL**: https://specstory.com/claude-code
**1-line**: `specstory watch` — следит за `~/.claude/projects/` и сохраняет всё в `.specstory/history/` как timestamped markdown.
**Why interesting**: 100% private, local, git-friendly. Можно коммитить AI-сессии вместе с кодом.
**Show on screen?** **yes** — структура `.specstory/` папки.
**Tag**: `hidden-feature`

### 6.13 claude --continue / claude --resume
**URL**: https://code.claude.com/docs/en/agent-sdk/sessions
**1-line**: `-c` продолжает последнюю сессию. `-r` открывает picker всех recent sessions.
**Why interesting**: базовая команда но нифига не базовая в обнаружении.
**Show on screen?** **maybe**.
**Tag**: `hidden-feature`

### 6.14 Cmd+A paste trick (для сайтов которые Claude не может fetch'ить)
**1-line**: Открой страницу в браузере → Cmd+A → Cmd+C → paste в Claude Code. HTML с разметкой попадает целиком.
**Why interesting**: трюк когда WebFetch блокирован authenticated/internal URL. Внутренние Confluence, Jira-страницы — paste'ишь и Claude их читает.
**Show on screen?** **yes** — простой и сразу полезный трюк.
**Tag**: `hidden-feature`

### 6.15 Custom statusline в settings.json
**URL**: https://code.claude.com/docs/en/statusline
**1-line**: Любой shell-скрипт который выводит строку — становится статусной строкой. Cost, branch, context-%, что угодно.
**Why interesting**: ccstatusline — production вариант, но можно и свой.
**Show on screen?** **maybe**.
**Tag**: `hidden-feature`

---

## Track 7 — Pure entertainment

### 7.1 Pixel Agents (already in Track 3, повторно как entertainment)
**URL**: https://github.com/pablodelucca/pixel-agents
**Show on screen?** **yes** — пересмотреть в context entertainment.
**Tag**: `fun`

### 7.2 fartscroll.js
**URL**: https://github.com/theonion/fartscroll.js
**Show on screen?** **maybe**.
**Tag**: `fun`

### 7.3 pipes.sh / cbonsai / cmatrix (pre-AI ASCII-эстетика)
**1-line**: Bash one-liners создающие красоту в терминале. Запускать на проекторе для атмосферы.
**Show on screen?** **yes** — фоном на брейк.
**Tag**: `fun`

### 7.4 alichtman/awesome-programming-humor
**URL**: https://github.com/alichtman/awesome-programming-humor
**1-line**: Awesome list для funny software, subreddits, websites.
**Why interesting**: закладка для тех кому нужно убить 15 минут.
**Show on screen?** **maybe**.
**Tag**: `fun` / `community`

### 7.5 TrumpScript (the meme programming language)
**1-line**: 1000 строк pseudo-language одобренные "glorious golden combover" Трампа.
**Why interesting**: артефакт хакатона Rice University. Иллюстрация что код это и культурный объект тоже.
**Show on screen?** **maybe**.
**Tag**: `fun`

---

## Track 8 — Communities and inspiration

### 8.1 Boris Cherny (@bcherny on X)
**URL**: https://x.com/bcherny
**1-line**: Создатель Claude Code в Anthropic. 250.9K followers. Постит setup-tips и thought leadership.
**Why interesting**: "В последние 30 дней — 259 PR, 497 commits, 40k lines added, и каждая написана Claude Code + Opus 4.5". Исходник многих "недокументированных" фич.
**Show on screen?** **yes** — slide с цитатой "we don't build for the model of today, we build for the model of six months from now".
**Tag**: `community`

### 8.2 Lenny's Newsletter — Boris Cherny интервью
**URL**: https://www.lennysnewsletter.com/p/head-of-claude-code-what-happens
**1-line**: "What happens after coding is solved" — Boris в интервью с Lenny Rachitsky.
**Why interesting**: для product/engineering managers Lenny — top reference.
**Show on screen?** **no**.
**Tag**: `community`

### 8.3 Pragmatic Engineer — "Building Claude Code with Boris Cherny"
**URL**: https://newsletter.pragmaticengineer.com/p/building-claude-code-with-boris-cherny
**1-line**: Gergely Orosz взял у Бориса развёрнутое интервью.
**Why interesting**: Pragmatic Engineer — самая читаемая инженерная рассылка. Newsletter recommendation для аудитории.
**Show on screen?** **no**.
**Tag**: `community`

### 8.4 r/ClaudeAI
**URL**: https://reddit.com/r/ClaudeAI
**1-line**: Главный community subreddit для Claude и Claude Code. ~150k+ subscribers.
**Why interesting**: где обсуждаются hidden features, undocumented flags, ranting threads.
**Show on screen?** **maybe**.
**Tag**: `community`

### 8.5 r/LocalLLaMA
**URL**: https://reddit.com/r/LocalLLaMA
**1-line**: Где живут Ollama / LM Studio / llama.cpp пользователи.
**Why interesting**: для тех кто хочет local-first inference.
**Show on screen?** **no**.
**Tag**: `community`

### 8.6 Claude Code official changelog
**URL**: https://code.claude.com/docs/en/changelog
**1-line**: Самый важный bookmark — что нового в Claude Code этим месяцем.
**Why interesting**: больше нигде нельзя надёжно отследить новые флаги, hooks events, MCP capabilities.
**Show on screen?** **yes** — финальный slide "куда смотреть дальше".
**Tag**: `community`

### 8.7 anthropics/claude-code (GitHub Issues)
**URL**: https://github.com/anthropics/claude-code/issues
**1-line**: Где можно подсмотреть feature requests до их анонса.
**Why interesting**: Anthropic engineers активно отвечают, можно увидеть roadmap-direction раньше блогов.
**Show on screen?** **no**.
**Tag**: `community`

### 8.8 claudefa.st blog
**URL**: https://claudefa.st/blog/
**1-line**: Один из лучших unofficial Claude Code blog'ов — глубокие гайды по hooks, MCP, statusline.
**Why interesting**: если выбирать одну закладку про tooling — эту.
**Show on screen?** **no**.
**Tag**: `community`

### 8.9 Anthropic Engineering Blog
**URL**: https://www.anthropic.com/engineering
**1-line**: Inside-stories про то как Anthropic строит свои инструменты.
**Why interesting**: иногда выходят редкие посты-мини-руководства от core team.
**Show on screen?** **no**.
**Tag**: `community`

### 8.10 builtwithclaude.com
**URL**: https://buildwithclaude.com/
**1-line**: Plugin marketplace + showcase разных Claude Code приложений.
**Why interesting**: вдохновение что строить.
**Show on screen?** **maybe** — для slide "что люди делают".
**Tag**: `community`

### 8.11 Claude Marketplaces
**URL**: https://claudemarketplaces.com/
**1-line**: Каталог Claude Code plugins, skills, MCP serverов и marketplace directory.
**Why interesting**: альтернатива GitHub'у для discovery — отбор курируется.
**Show on screen?** **maybe**.
**Tag**: `community`

### 8.12 anthropics/claude-cookbooks
**URL**: https://github.com/anthropics/claude-cookbooks
**1-line**: Официальные cookbook'и от Anthropic — production patterns, examples.
**Why interesting**: например — built-in Skills usage cookbook. Для копи-пасты в свой проект.
**Show on screen?** **maybe**.
**Tag**: `community`

---

## Top picks для сцены — Анастасии на выбор

Если **5 минут** на "cool stuff" блок:

1. **Pixel Agents** (3.3) — 30 секунд скриншота, и зал твой. WAU гарантирован.
2. **Decart Oasis** (5.5) — playable AI-Minecraft в браузере, "будущее прямо сейчас".
3. **MemPalace** (2.21) — Милла Йовович пишет open-source AI memory. Story.
4. **Claude Code Channels** (2.19 / 6.11) — управление Claude из Telegram-чата.
5. **suzu-mcp** (2.14) — Spotify treats как notification sounds. Just radost.

Если **10 минут** — добавить:

6. **Excalidraw MCP** (2.17) — Claude рисует архитектурные диаграммы.
7. **ENABLE_TOOL_SEARCH** (6.2) — undocumented flag, 85% token savings. Insider feel.
8. **Output Styles Learning mode** (6.1) — Claude как коуч с TODO(human).
9. **claude-squad** (3.1) — multi-agent в tmux, 6.9k stars.
10. **Voice Mode + Whisper local** (5.12 / 6.9) — голос с Claude end-to-end локально.

Если воркшоп **тяжёлый QA-пласт** — Track 1: Quinn+Jinx (1.5), playwright-skill (1.3), accessibility-agents (1.8), Sentry MCP (2.4), Atlassian MCP (2.7).

---

## Подсказки по подаче

**"Did you know..."** хуки которые работают на технической аудитории:

- "Did you know что MCP теперь lazy-loaded? 85% контекста обратно в карман — вот один env var в settings.json".
- "Did you know что Claude Code в **тестовый режим** превращается одной строкой? `/output-style learning` и Claude вместо того чтобы писать код, оставляет TODO(human) тебе".
- "Did you know что Boris Cherny, создатель Claude Code, last 30 days — 100% commits написаны самим Claude Code'ом?".
- "Did you know что Милла Йовович — соавтор open-source AI memory framework? MemPalace, апрель 2026".
- "Did you know что официальный AI tester для Claude Code называется Quinn — а 'chaos tester' Jinx?".

**Что НЕ показывать на сцене**:
- Длинные конфиги settings.json — слайд пугает.
- READMEs awesome-list'ов целиком — все засыпают на 100-й строке.
- ruflo / claude-flow swarm topology — концептуально круто, но live сложно показать.
- llama.cpp source code — для QA-аудитории не зайдёт.

**Что ОБЯЗАТЕЛЬНО показать живьём (если будет время)**:
- Playwright MCP — открыть сайт + попросить Claude проверить flow.
- Pixel Agents — VS Code + 1 параллельный subagent → анимация офиса.
- /output-style learning → Claude помогает решать с TODO(human).
- Spotify MCP / suzu-mcp → музыка играет когда Claude закончил.

---

## Sources

- [VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills)
- [hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code)
- [obra/superpowers](https://github.com/obra/superpowers)
- [obra/superpowers-marketplace](https://github.com/obra/superpowers-marketplace)
- [anthropics/skills](https://github.com/anthropics/skills)
- [smtg-ai/claude-squad](https://github.com/smtg-ai/claude-squad)
- [ruvnet/ruflo (claude-flow)](https://github.com/ruvnet/ruflo)
- [pablodelucca/pixel-agents](https://github.com/pablodelucca/pixel-agents)
- [paulrobello/claude-office](https://github.com/paulrobello/claude-office)
- [Outworked launch announcement](https://agent-wars.com/news/2026-03-24-outworked-open-source-pixel-art-office-ui-for-orchestrating-claude-code-agents)
- [microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp)
- [browser-use/browser-use](https://github.com/browser-use/browser-use)
- [Browserbase MCP](https://www.browserbase.com/)
- [lackeyjb/playwright-skill](https://github.com/lackeyjb/playwright-skill)
- [yusuftayman/playwright-cli-agents](https://github.com/yusuftayman/playwright-cli-agents)
- [adampaulwalker/qa-test (Quinn + Jinx)](https://github.com/adampaulwalker/qa-test)
- [benngaihk/claude-test-site-skill](https://github.com/benngaihk/claude-test-site-skill)
- [airowe/claude-a11y-skill](https://github.com/airowe/claude-a11y-skill)
- [Community-Access/accessibility-agents](https://github.com/Community-Access/accessibility-agents)
- [transilienceai/communitytools](https://github.com/transilienceai/communitytools)
- [qdhenry/Claude-Command-Suite](https://github.com/qdhenry/Claude-Command-Suite)
- [wshobson/agents](https://github.com/wshobson/agents)
- [VoltAgent/awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents)
- [jeremylongshore/claude-code-plugins-plus-skills](https://github.com/jeremylongshore/claude-code-plugins-plus-skills)
- [rohitg00/awesome-claude-code-toolkit](https://github.com/rohitg00/awesome-claude-code-toolkit)
- [marcelmarais/spotify-mcp-server](https://github.com/marcelmarais/spotify-mcp-server)
- [denar90/suzu-mcp](https://github.com/denar90/suzu-mcp)
- [yctimlin/mcp_excalidraw](https://github.com/yctimlin/mcp_excalidraw)
- [korotovsky/slack-mcp-server](https://github.com/korotovsky/slack-mcp-server)
- [Atlassian MCP launch](https://www.atlassian.com/blog/announcements/remote-mcp-server)
- [cloudflare/mcp](https://github.com/cloudflare/mcp)
- [doobidoo/mcp-memory-service](https://github.com/doobidoo/mcp-memory-service)
- [MemPalace/mempalace](https://github.com/mempalace/mempalace)
- [zilliztech/memsearch](https://github.com/zilliztech/memsearch)
- [punkpeye/awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers)
- [TensorBlock/awesome-mcp-servers](https://github.com/TensorBlock/awesome-mcp-servers)
- [disler/claude-code-hooks-mastery](https://github.com/disler/claude-code-hooks-mastery)
- [sirmalloc/ccstatusline](https://github.com/sirmalloc/ccstatusline)
- [ChanMeng666/claude-code-audio-hooks](https://github.com/ChanMeng666/claude-code-audio-hooks)
- [ZeldOcarina/claude-code-voice-notifications](https://github.com/ZeldOcarina/claude-code-voice-notifications)
- [Tiimie1/claude-bell](https://github.com/Tiimie1/claude-bell)
- [husniadil/cc-hooks](https://github.com/husniadil/cc-hooks)
- [Hooks lifecycle reference](https://code.claude.com/docs/en/hooks)
- [Claude Code session lifecycle hooks guide](https://claudefa.st/blog/tools/hooks/session-lifecycle-hooks)
- [Statusline guide](https://claudefa.st/blog/tools/statusline-guide)
- [Multi-level notification gist](https://gist.github.com/michael-swann-rp/6112d64456b49ec606d7fdbe1e2bd310)
- [a16z-infra/ai-town](https://github.com/a16z-infra/ai-town)
- [karpathy/nanochat](https://github.com/karpathy/nanochat)
- [karpathy/nanoGPT](https://github.com/karpathy/nanoGPT)
- [karpathy/build-nanogpt](https://github.com/karpathy/build-nanogpt)
- [Decart Oasis](https://oasis-model.github.io/)
- [etched-ai/open-oasis](https://github.com/etched-ai/open-oasis)
- [Suno](https://suno.com/)
- [ACE-Step open-source](https://github.com/ace-step/ACE-Step)
- [ggml-org/llama.cpp](https://github.com/ggml-org/llama.cpp)
- [ollama/ollama](https://github.com/ollama/ollama)
- [LM Studio](https://lmstudio.ai/)
- [VoiceMode MCP setup gist](https://gist.github.com/jlmalone/02d09aeb4e09890a8a9e7c2333a18377)
- [ElevenLabs cookbook](https://platform.claude.com/cookbook/third-party-elevenlabs-low-latency-stt-claude-tts)
- [Charm.land (Charmbracelet)](https://charm.land/)
- [jesseduffield/lazygit](https://github.com/jesseduffield/lazygit)
- [derailed/k9s](https://github.com/derailed/k9s)
- [atuinsh/atuin](https://github.com/atuinsh/atuin)
- [cantino/mcfly](https://github.com/cantino/mcfly)
- [warp.dev](https://www.warp.dev/)
- [pipes.sh](https://github.com/pipeseroni/pipes.sh)
- [cbonsai](https://gitlab.com/jallbrit/cbonsai)
- [alichtman/awesome-programming-humor](https://github.com/alichtman/awesome-programming-humor)
- [Output Styles official docs](https://code.claude.com/docs/en/output-styles)
- [ENABLE_TOOL_SEARCH undocumented flag](https://paddo.dev/blog/claude-code-hidden-mcp-flag/)
- [MCP Tool Search official rollout](https://claudefa.st/blog/tools/mcp-extensions/mcp-tool-search)
- [Claude Code worktree mode](https://amux.io/guides/claude-code-headless/)
- [Stream-json output format](https://backgroundclaude.com/blog/stream-json)
- [CLAUDE.md @import recursive](https://code.claude.com/docs/en/memory)
- [1M context GA](https://claude.com/blog/1m-context-ga)
- [Extended thinking docs](https://platform.claude.com/docs/en/build-with-claude/extended-thinking)
- [Voice Mode rollout TechCrunch](https://techcrunch.com/2026/03/03/claude-code-rolls-out-a-voice-mode-capability/)
- [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official)
- [Plugin marketplace docs](https://code.claude.com/docs/en/discover-plugins)
- [Claude Code Channels](https://claudefa.st/blog/guide/development/claude-code-channels)
- [SpecStory CLI](https://specstory.com/claude-code)
- [Boris Cherny Twitter](https://x.com/bcherny)
- [Lenny Newsletter — Boris Cherny](https://www.lennysnewsletter.com/p/head-of-claude-code-what-happens)
- [Pragmatic Engineer — Boris interview](https://newsletter.pragmaticengineer.com/p/building-claude-code-with-boris-cherny)
- [r/ClaudeAI](https://reddit.com/r/ClaudeAI)
- [r/LocalLLaMA](https://reddit.com/r/LocalLLaMA)
- [Claude Code changelog](https://code.claude.com/docs/en/changelog)
- [claudefa.st](https://claudefa.st/)
- [Anthropic Engineering Blog](https://www.anthropic.com/engineering)
- [buildwithclaude.com](https://buildwithclaude.com/)
- [Claude Marketplaces](https://claudemarketplaces.com/)
- [anthropics/claude-cookbooks](https://github.com/anthropics/claude-cookbooks)
- [musistudio/claude-code-router](https://github.com/musistudio/claude-code-router)
- [kaitranntt/ccs (CC Switch)](https://github.com/kaitranntt/ccs)
- [block/goose](https://github.com/block/goose)
- [aider](https://github.com/Aider-AI/aider)
- [sst/opencode](https://github.com/sst/opencode)
- [alexop.dev — AI QA Engineer guide](https://alexop.dev/posts/automated-qa-claude-code-agent-browser-cli-github-actions/)
- [testdino — Playwright Skill case study](https://testdino.com/blog/playwright-skill-claude-code)
