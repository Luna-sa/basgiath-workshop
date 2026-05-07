import { useState } from 'react'
import PageShell from '../core/PageShell'
import { useT } from '../i18n/useT'

/**
 * Hidden Gems — show-and-tell page for cool community projects and
 * lesser-known Claude Code features. Each gem has a 1-line "what it
 * is", a "why interesting" hook, and a copyable autopilot install
 * prompt the user can paste into Claude Code on the spot.
 */

const GEMS = [
  {
    id: 'pixel-agents',
    eyebrow: 'visual fun',
    name: 'Pixel Agents',
    tagline_en: 'Your subagents become pixel workers in a tiny office.',
    tagline_ru: 'Твои subagents превращаются в пиксельных работников в крошечном офисе.',
    body_en: `pablodelucca/pixel-agents — VS Code extension. When Claude
spawns a subagent, a pixel character walks across the office, sits
at a desk, and starts typing. Status bar shows what each agent is
doing right now. Reading a file? You see them flipping pages.
Waiting for permission? They tap their foot.

Featured in Fast Company as "the charming pixel-art game that solves
one of AI coding's most annoying UX problems".`,
    body_ru: `pablodelucca/pixel-agents — расширение для VS Code.
Когда Claude спавнит subagent — пиксельный персонаж проходит по
офису, садится за стол, начинает печатать. Статус-бар показывает
что каждый агент делает прямо сейчас. Читает файл? Видишь как он
листает страницы. Ждёт разрешения? Постукивает ногой.

Fast Company про него — «charming pixel-art game which solves one
of AI coding's most annoying UX problems».`,
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
    body_en: `mempalace/mempalace — free MCP-native memory system
released April 2026. Hits 96.6% on LongMemEval against Mem0 ~85%
and Zep ~82%. Stores facts as markdown files in halls + rooms (yes,
"memory palace" literally), Chroma + SQLite under the hood, runs
fully local with Ollama embeddings.

The story-hook: Milla Jovovich (yes, that one — Resident Evil) is
listed as co-author on the repo. She actually writes commits.`,
    body_ru: `mempalace/mempalace — бесплатная AI-память на MCP,
вышла апрель 2026. 96.6% на LongMemEval — против Mem0 ~85% и Zep
~82%. Хранит факты как markdown в "залах" и "комнатах" (буквально
memory palace), под капотом Chroma + SQLite, полностью локально
через Ollama embeddings.

История: Милла Йовович (да-да, та самая, Resident Evil) — соавтор
репозитория. Реально пишет коммиты.`,
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
5. После установки запусти быстрый smoke-тест: "запиши факт" + "вспомни факт".
6. Напомни перезапустить Claude Code чтобы MCP подхватился.`,
    url: 'https://github.com/mempalace/mempalace',
  },

  {
    id: 'suzu-mcp',
    eyebrow: 'completion sounds',
    name: 'suzu-mcp',
    tagline_en: 'A Spotify track plays every time Claude finishes a task.',
    tagline_ru: 'Spotify-трек играет каждый раз когда Claude закончил задачу.',
    body_en: `denar90/suzu-mcp — named after the Japanese ritual bell
(suzu). When Claude Code completes a task, it triggers Spotify to
play your chosen track. Quiet little radost — you start hearing
your "done" theme like a notification.

Pair with hooks (on-Stop event) for a fully customised feedback loop.`,
    body_ru: `denar90/suzu-mcp — назван в честь японского ритуального
колокольчика (suzu). Когда Claude Code заканчивает задачу — триггерит
Spotify проиграть твой выбранный трек. Тихая радость — начинаешь
слышать свою "done" мелодию как нотификацию.

Combine with hooks (event on-Stop) для полностью кастомного feedback-loop.`,
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
5. Тест: попроси Claude "list 3 files" и посмотри играет ли Spotify`,
    url: 'https://github.com/denar90/suzu-mcp',
  },

  {
    id: 'tool-search',
    eyebrow: 'undocumented flag',
    name: 'ENABLE_TOOL_SEARCH',
    tagline_en: '85% context savings with one settings.json line. Lazy-loads MCP tools.',
    tagline_ru: '85% контекста обратно одной строкой в settings.json. Lazy-load MCP-тулзы.',
    body_en: `Add to ~/.claude/settings.json:
{ "env": { "ENABLE_TOOL_SEARCH": "true" } }

With 50+ MCP tools loaded the default token overhead per turn is
about 77K. Switch on tool-search and Claude only loads tools when
it actually needs them — total drops to ~8.7K. That's 85% saved
context, every turn.

Anthropic announced it officially January 14, 2026. It's still
absent from most "getting started" docs, so it feels like
an insider trick.`,
    body_ru: `Добавить в ~/.claude/settings.json:
{ "env": { "ENABLE_TOOL_SEARCH": "true" } }

С 50+ MCP-тулзами обычный overhead — около 77K токенов на оборот.
Включаешь tool-search, Claude грузит тулзы только когда они нужны —
overhead падает до ~8.7K. **85% контекста обратно**, каждый ход.

Anthropic анонсировали 14 января 2026. До сих пор отсутствует в
большинстве "getting started" доков — поэтому ощущается как insider-фишка.`,
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
    body_en: `adampaulwalker/qa-test — a Claude Code skill with two
named personas:

— Quinn — methodical, walks through success criteria one by one,
  produces structured test reports.
— Jinx — chaos tester, breaks things on purpose, finds edge cases
  Quinn would never look at.

Activate one or the other depending on what mood the work needs.
Adversarial pair for exploratory testing.`,
    body_ru: `adampaulwalker/qa-test — Claude Code skill с двумя
персонажами:

— Quinn — методичный, идёт по success criteria по пунктам,
  выдаёт структурированный отчёт.
— Jinx — chaos tester, специально ломает, находит edge cases
  которые Quinn никогда не увидит.

Активируешь одну или другую в зависимости от настроя работы.
Adversarial-пара для exploratory testing.`,
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
4. Тест: "/skill qa-test as Quinn — review this PR"
5. Потом: "/skill qa-test as Jinx — try to break this feature"`,
    url: 'https://github.com/adampaulwalker/qa-test',
  },

  {
    id: 'channels',
    eyebrow: 'remote control',
    name: 'Claude Code Channels',
    tagline_en: 'Drive Claude Code from a Telegram or Discord chat.',
    tagline_ru: 'Управляй Claude Code прямо из Telegram или Discord чата.',
    body_en: `Anthropic-native channels (research preview, March 2026,
iMessage added a week later). You leave Claude Code running on your
laptop, then chat with it from your phone. "Run the test suite
again", "summarise the diff", "what did you change in the auth
module last night?"

Your night-time autopilots become checkable from a 10-second phone
glance. Real game-changer for after-hours work.`,
    body_ru: `Anthropic-нативные каналы (research preview, март 2026,
iMessage добавили неделю спустя). Оставляешь Claude Code работать
на ноуте, дальше общаешься с ним с телефона. «Запусти тесты ещё
раз», «суммируй diff», «что ты ночью изменила в auth-модуле?»

Ночные autopilot'ы становятся проверяемыми за 10 секунд с телефона.
Реальный game-changer для after-hours работы.`,
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
    body_en: `Built-in output style. Activate with /output-style learning.

Claude stops solving everything for you. Instead it explains what
it would do, then drops TODO(human) markers in the code where you
should write the next step yourself. Optional commentary on why.

Useful for QA → dev transition, or for anyone who notices they're
just hitting Tab on Claude's autocomplete without thinking.`,
    body_ru: `Встроенный output style. Активируешь через /output-style learning.

Claude перестаёт решать всё за тебя. Вместо этого объясняет что
он бы сделал, и роняет TODO(human) маркеры в коде где ты должна
сама написать следующий шаг. Опционально — комментарий почему.

Полезно для QA → dev перехода, или когда замечаешь что просто
жмёшь Tab на автокомплите Claude не думая.`,
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

function CopyButton({ text, label }) {
  const [copied, setCopied] = useState(false)
  const handle = async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handle}
      className={`font-mono text-[11px] tracking-[2px] uppercase font-semibold px-3 py-2 transition-all cursor-pointer ${
        copied
          ? 'bg-yellow-300 text-black'
          : 'bg-qa-teal text-black hover:shadow-[0_0_18px_rgba(0,229,204,0.4)]'
      }`}
      style={copied ? { backgroundColor: '#FEED00' } : {}}
    >
      {copied ? '✓ copied' : label}
    </button>
  )
}

function Gem({ gem, t }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="border border-border bg-surface/40 hover:border-qa-teal/40 transition-colors">
      <div className="p-4">
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <div>
            <p className="font-mono text-[10px] tracking-[2px] uppercase text-qa-teal mb-1">◆ {gem.eyebrow}</p>
            <h3 className="font-display italic text-xl text-white">{gem.name}</h3>
          </div>
          <a
            href={gem.url}
            target="_blank"
            rel="noopener"
            className="font-mono text-[10px] tracking-[1.5px] uppercase text-text-dim hover:text-qa-teal transition-colors"
          >
            github →
          </a>
        </div>
        <p className="text-[14px] text-text-body italic mt-3 leading-relaxed">
          {t(gem.tagline_en, gem.tagline_ru)}
        </p>
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 font-mono text-[10px] tracking-[2px] uppercase text-text-dim hover:text-qa-teal cursor-pointer"
        >
          {expanded ? '▴ hide details' : '▾ details + install'}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-border px-4 py-4 bg-bg/40">
          <pre className="text-[13px] text-text-body whitespace-pre-wrap font-body leading-relaxed mb-4">
{t(gem.body_en, gem.body_ru)}
          </pre>

          <div className="border-t border-border/40 pt-4">
            <div className="flex items-center justify-between gap-3 mb-3">
              <span className="font-mono text-[10px] tracking-[2px] uppercase text-qa-teal">⌘ install · paste into Claude Code</span>
              <CopyButton
                text={t(gem.install_en, gem.install_ru)}
                label={t('Copy', 'Копировать')}
              />
            </div>
            <pre className="bg-black border border-border p-3 text-[11.5px] font-mono text-text-body whitespace-pre-wrap leading-relaxed max-h-[260px] overflow-y-auto">
{t(gem.install_en, gem.install_ru)}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}

export default function P_HiddenGems() {
  const t = useT()
  return (
    <PageShell pageIndex={12}>
      <div className="space-y-6">
        <p className="text-[15px] text-text-body leading-relaxed max-w-3xl">
          {t(
            'Семь штук, про которые знают далеко не все. Часть — встроена в Claude Code и не задокументирована. Часть — community-проекты которые поднимают воркфлоу или просто радуют.',
            'Семь штук, про которые знают далеко не все. Часть — встроена в Claude Code и не задокументирована. Часть — community-проекты которые поднимают воркфлоу или просто радуют.'
          )}
        </p>

        <p className="text-[12px] text-text-dim italic">
          {t(
            'Для каждой — кнопка copy с готовым autopilot-промптом. Вставляешь в Claude Code и он сам ставит. На воркшопе попробуем парочку вместе.',
            'Для каждой — кнопка copy с готовым autopilot-промптом. Вставляешь в Claude Code и он сам ставит. На воркшопе попробуем парочку вместе.'
          )}
        </p>

        <div className="grid md:grid-cols-2 gap-3">
          {GEMS.map(g => <Gem key={g.id} gem={g} t={t} />)}
        </div>

        <p className="text-[12px] text-text-dim italic text-center pt-3">
          {t(
            'Полный buffet 88 фишек — в RESEARCH_2026-05-08_cool_stuff.md.',
            'Полный buffet 88 фишек — в RESEARCH_2026-05-08_cool_stuff.md.'
          )}
        </p>
      </div>
    </PageShell>
  )
}
