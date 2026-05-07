import PageShell from '../core/PageShell'
import { useT } from '../i18n/useT'

const PARTS = [
  {
    n: '01',
    name: 'CLAUDE.md',
    role: 'spine',
    summary_en: "A markdown file Claude reads at every start. Describes you, your rules, your project context.",
    summary_ru: 'Markdown файл который Claude читает при каждом старте. Описывает тебя, твои правила, контекст проекта.',
    detail_en: 'Hierarchy: ~/.claude/CLAUDE.md (everywhere) → project/CLAUDE.md (this repo) → subdir/CLAUDE.md. Lower overrides upper.',
    detail_ru: 'Иерархия: ~/.claude/CLAUDE.md (везде) → project/CLAUDE.md (этот репо) → subdir/CLAUDE.md. Нижние перебивают верхние.',
  },
  {
    n: '02',
    name: 'Skills',
    role: 'wings',
    summary_en: 'Reusable abilities Claude installs and gains. Like extensions for the brain.',
    summary_ru: 'Многоразовые навыки которые Claude получает. Как расширения для мозга.',
    detail_en: 'Examples: Excalidraw (drawing), git skill (workflows), writing-skills (style). Browse and install via /plugin marketplace.',
    detail_ru: 'Примеры: Excalidraw (рисование), git skill (workflow), writing-skills (стиль). Найти и установить через /plugin marketplace.',
  },
  {
    n: '03',
    name: 'Agents',
    role: 'claws',
    summary_en: 'Specialised mini-Claudes for specific roles. They run in parallel, return results.',
    summary_ru: 'Специализированные мини-Claude под конкретные роли. Работают параллельно, возвращают результат.',
    detail_en: 'Examples: code-reviewer, qa-tester, security-scanner, docs-writer. You delegate, they execute, main session stays clean.',
    detail_ru: 'Примеры: code-reviewer, qa-tester, security-scanner, docs-writer. Делегируешь — работают — main session чистая.',
  },
  {
    n: '04',
    name: 'MCP',
    role: 'eyes',
    summary_en: "Model Context Protocol — Claude's connection to the outside world. Browsers, APIs, databases, services.",
    summary_ru: 'Model Context Protocol — связь Claude с внешним миром. Браузеры, API, базы данных, сервисы.',
    detail_en: 'Playwright (browser test), GitHub (PR/issues), Confluence/Notion (docs), Atlassian (Jira), filesystem (any folder).',
    detail_ru: 'Playwright (браузер-тест), GitHub (PR/issues), Confluence/Notion (доки), Atlassian (Jira), filesystem (любая папка).',
  },
  {
    n: '05',
    name: 'Hooks',
    role: 'reflexes',
    summary_en: 'Auto-trigger commands on events. Pre-commit, post-edit, on-error — Claude reacts without being asked.',
    summary_ru: 'Авто-триггер команд на события. Pre-commit, post-edit, on-error — Claude реагирует без просьбы.',
    detail_en: 'Examples: branch-guard (block commits to main), auto-format (run prettier on save), notify-on-stop (sound when ready).',
    detail_ru: 'Примеры: branch-guard (блокирует commit в main), auto-format (prettier при сохранении), notify-on-stop (звук когда готово).',
  },
  {
    n: '06',
    name: 'Plugins',
    role: 'companions',
    summary_en: 'Bundles of skills + agents + hooks shared across teams. Install one — gain a whole stack.',
    summary_ru: 'Пакеты skills + agents + hooks для команд. Один install — целый стек.',
    detail_en: 'Browse the marketplace with /plugin. Examples: superpowers (meta-skills), digital-marketing-pro (115 commands).',
    detail_ru: 'Marketplace через /plugin. Примеры: superpowers (мета-скиллы), digital-marketing-pro (115 команд).',
  },
]

export default function P05_TalkEvolution() {
  const t = useT()
  return (
    <PageShell pageIndex={5}>
      <div className="space-y-6">

        <p className="text-[15px] text-text-body leading-relaxed max-w-3xl">
          {t(
            "Claude Code — не одна программа. Это шесть слоёв, складывающихся в напарника. Если знаешь все шесть — у тебя инструмент. Если используешь — у тебя команда.",
            "Claude Code — не одна программа. Это шесть слоёв, складывающихся в напарника. Если знаешь все шесть — у тебя инструмент. Если используешь — у тебя команда."
          )}
        </p>

        {/* Six parts */}
        <div className="grid md:grid-cols-2 gap-3">
          {PARTS.map(p => (
            <div
              key={p.n}
              className="p-4 border border-border bg-surface/40 hover:border-qa-teal/40 transition-colors"
            >
              <div className="flex items-baseline gap-3 mb-2">
                <span className="font-mono text-[11px] tracking-[2px] text-qa-teal">{p.n}</span>
                <span className="font-display italic text-xl text-white">{p.name}</span>
                <span className="font-mono text-[10px] tracking-[1.5px] uppercase text-text-dim ml-auto">{p.role}</span>
              </div>
              <p className="text-[13px] text-text-body leading-relaxed mb-2">
                {t(p.summary_en, p.summary_ru)}
              </p>
              <p className="text-[12px] text-text-dim leading-relaxed italic">
                {t(p.detail_en, p.detail_ru)}
              </p>
            </div>
          ))}
        </div>

        {/* Where it all lives */}
        <div className="border border-qa-teal/20 bg-qa-teal/[0.03] p-5">
          <div className="font-mono text-[10px] tracking-[2px] uppercase text-qa-teal mb-3">
            ◆ {t('Where the dragon lives on disk', 'Где живёт дракон на диске')}
          </div>
          <pre className="font-mono text-[12px] text-text-body leading-relaxed whitespace-pre-wrap">{`~/.claude/
├── CLAUDE.md          # spine — your global rules + persona
├── settings.json      # permissions, env, hooks config
├── commands/          # your custom /slash-commands
├── agents/            # your subagents
├── skills/            # installed skills (auto-loaded)
└── plugins/           # installed plugins
mcp_servers.json       # MCP connections (browser, GitHub, ...)`}</pre>
        </div>

      </div>
    </PageShell>
  )
}
