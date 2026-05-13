import ComponentDeepDive from '../components/ComponentDeepDive'
import { asset } from "../lib/asset"

export default function P_CompMCP() {
  return <ComponentDeepDive pageIndex={10} data={DATA} />
}

const DATA = {
  eyebrow: 'COMPONENT · 05 · eyes',
  heroBanner: asset('/hero/eyes-mcp.jpg'),
  name: 'MCP',
  path: '~/.claude/mcp_servers.json',
  tagline_en: "Model Context Protocol - Claude's bridges to the outside world. Browsers, GitHub, Notion, your filesystem, your database. Each MCP server gives Claude a new set of tools to call.",
  tagline_ru: "Model Context Protocol - мосты Claude к внешнему миру. Браузеры, GitHub, Notion, твоя файловая система, твоя база. Каждый MCP-сервер даёт Claude новый набор инструментов.",
  tagline_uk: "Model Context Protocol - мости Claude до зовнішнього світу. Браузери, GitHub, Notion, твоя файлова система, твоя база. Кожен MCP-сервер дає Claude новий набір інструментів.",
  stats: [
    { value: 'JSON', label: 'config' },
    { value: 'open spec', label: 'protocol' },
    { value: 'restart', label: 'to load' },
  ],
  what_en: "MCP is an open protocol - Anthropic publishes the spec, anyone writes a server. A server exposes tools (functions Claude can call) and resources (data Claude can read). You list servers in mcp_servers.json. On Claude Code start, each server spins up as a child process; its tools become available to Claude with names like `mcp__playwright__navigate`. Restart Claude Code after editing the config - servers load at startup, not on demand. Popular MCP servers: Playwright (browser), Fetch (any HTTP), Context7 (live library docs), Filesystem (any folder), GitHub (PRs/issues), Notion, Slack.",
  what_ru: 'MCP - это открытый протокол. Anthropic публикует spec, любой пишет сервер. Сервер выставляет tools (функции которые Claude может вызывать) и resources (данные которые Claude может читать). Серверы перечисляешь в mcp_servers.json. На старте Claude Code каждый сервер поднимается как дочерний процесс; его tools становятся доступны Claude с именами `mcp__playwright__navigate`. После редактирования config - перезапускай Claude Code, серверы поднимаются при старте, не on-demand. Популярные MCP-серверы: Playwright (браузер), Fetch (любой HTTP), Context7 (актуальные доки библиотек), Filesystem (любая папка), GitHub (PR/issues), Notion, Slack.',
  what_uk: 'MCP - це відкритий протокол. Anthropic публікує spec, будь-хто пише сервер. Сервер виставляє tools (функції, які Claude може викликати) і resources (дані, які Claude може читати). Сервери перелічуєш у mcp_servers.json. На старті Claude Code кожен сервер піднімається як дочірній процес; його tools стають доступні Claude з іменами `mcp__playwright__navigate`. Після редагування config - перезапускай Claude Code, сервери піднімаються на старті, не on-demand. Популярні MCP-сервери: Playwright (браузер), Fetch (будь-який HTTP), Context7 (актуальні доки бібліотек), Filesystem (будь-яка тека), GitHub (PR/issues), Notion, Slack.',
  structure: `~/.claude/mcp_servers.json     # global - every project sees these
<project>/mcp_servers.json    # project-local - only this codebase

# On Claude Code start:
#   1. Read mcp_servers.json
#   2. Spawn each server as a child process
#   3. Discover its tools
#   4. Expose them in the session

# Verify after install:
$ claude mcp list
NAME           STATUS    TOOLS
playwright     ✓ ready   navigate, click, screenshot, fill, ...
fetch          ✓ ready   fetch, post
context7       ✓ ready   resolve-library-id, query-docs`,
  anatomy: [
    {
      field: 'mcpServers',
      desc_en: 'Top-level object. One entry per server, keyed by the name you choose.',
      desc_ru: 'Top-level object. Одна запись на сервер, ключ - имя которое ты выбираешь.',
      desc_uk: 'Top-level object. Один запис на сервер, ключ - імʼя, яке ти обираєш.',
    },
    {
      field: 'command',
      desc_en: 'How to launch the server. Usually `npx -y @vendor/server`, or `python -m server`, or a binary path.',
      desc_ru: 'Как запускать сервер. Обычно `npx -y @vendor/server`, или `python -m server`, или путь к бинарю.',
      desc_uk: 'Як запускати сервер. Зазвичай `npx -y @vendor/server`, або `python -m server`, або шлях до бінарника.',
    },
    {
      field: 'args',
      desc_en: 'Array of CLI args passed to the command. Lets you pass paths, flags, env-config switches.',
      desc_ru: 'Массив CLI-аргументов для command. Позволяет передать пути, флаги, env-конфигурационные switch-и.',
      desc_uk: 'Масив CLI-аргументів для command. Дозволяє передати шляхи, прапори, env-конфігураційні switch-і.',
    },
    {
      field: 'env',
      desc_en: 'Environment variables for the server process. API keys, tokens, secrets live here.',
      desc_ru: 'Переменные окружения для процесса сервера. API-ключи, токены, секреты живут здесь.',
      desc_uk: 'Змінні оточення для процесу сервера. API-ключі, токени, секрети живуть тут.',
    },
  ],
  example_label: '~/.claude/mcp_servers.json',
  example: `{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    },
    "fetch": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-fetch"]
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxx..."
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y", "@modelcontextprotocol/server-filesystem",
        "/Users/me/projects/work-app"
      ]
    }
  }
}

# After editing this file:
# 1. Save it
# 2. Quit Claude Code (Ctrl+D or "exit")
# 3. Reopen - \`claude\`
# 4. Verify: \`claude mcp list\``,
  when: [
    {
      en: 'When you want Claude to ACT on the outside world - open a browser, hit an API, read your filesystem, post to Slack.',
      ru: 'Когда хочешь чтобы Claude ДЕЙСТВОВАЛ во внешнем мире - открыл браузер, ударил по API, прочитал твою файловую систему, запостил в Slack.',
      uk: 'Коли хочеш щоб Claude ДІЯВ у зовнішньому світі - відкрив браузер, вдарив по API, прочитав твою файлову систему, запостив у Slack.',
    },
    {
      en: 'When you need LIVE data - current library docs (Context7), current PR state (GitHub), current page content (Playwright). Beats Claude\'s training-cutoff knowledge every time.',
      ru: 'Когда нужны ЖИВЫЕ данные - актуальные доки библиотек (Context7), актуальное состояние PR (GitHub), актуальный контент страницы (Playwright). Бьёт training-cutoff знание Claude каждый раз.',
      uk: 'Коли потрібні ЖИВІ дані - актуальні доки бібліотек (Context7), актуальний стан PR (GitHub), актуальний контент сторінки (Playwright). Бʼє training-cutoff знання Claude щоразу.',
    },
    {
      en: "When you want Claude to integrate with your tools - your Notion, your Slack, your Jira. Read AND write, through the server's allowed tools.",
      ru: 'Когда хочешь чтобы Claude интегрировался с твоими тулзами - твой Notion, твой Slack, твой Jira. Read И write, через разрешённые tools сервера.',
      uk: 'Коли хочеш щоб Claude інтегрувався з твоїми тулзами - твій Notion, твій Slack, твій Jira. Read І write, через дозволені tools сервера.',
    },
  ],
}
