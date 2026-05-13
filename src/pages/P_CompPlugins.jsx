import ComponentDeepDive from '../components/ComponentDeepDive'
import { asset } from "../lib/asset"

export default function P_CompPlugins() {
  return <ComponentDeepDive pageIndex={12} data={DATA} />
}

const DATA = {
  eyebrow: 'COMPONENT · 07 · companions',
  heroBanner: asset('/hero/companion-plugins.jpg'),
  name: 'Plugins',
  path: '~/.claude/plugins/',
  tagline_en: "Bundles of commands + agents + skills + hooks + MCP servers shared as one unit. Install one plugin - gain an entire stack tuned by someone who already solved the problem.",
  tagline_ru: "Пакеты commands + agents + skills + hooks + MCP-серверов, общающиеся как одна единица. Установил один плагин - получил целый stack, настроенный кем-то кто уже решил задачу.",
  tagline_uk: "Пакети commands + agents + skills + hooks + MCP-серверів, що шерять як одну одиницю. Встановив один плагін - отримав цілий stack, налаштований кимось, хто вже розвʼязав задачу.",
  stats: [
    { value: '/plugin', label: 'in-app browser' },
    { value: 'one click', label: 'install' },
    { value: 'meta', label: 'category' },
  ],
  what_en: "A plugin is a packaged stack - multiple commands + multiple agents + multiple skills + maybe hooks + maybe MCP server config, all distributed together. Install via the `/plugin` command inside Claude Code (browse marketplace and click), or by cloning the plugin's git repo into ~/.claude/plugins/. The plugin's individual pieces land in the right subfolders (commands/ agents/ skills/) and are available as if you wrote them yourself. Famous plugins: obra/superpowers (one meta-skill that orchestrates 30 others), Anthropic's official skills bundle, digital-marketing-pro (115 commands for marketing workflows).",
  what_ru: 'Плагин - это упакованный stack: несколько commands + несколько agents + несколько skills + опционально hooks + опционально MCP-конфиг, всё распространяется вместе. Установка через `/plugin` команду внутри Claude Code (browse marketplace и клик), или git clone репо плагина в ~/.claude/plugins/. Отдельные куски плагина попадают в правильные подпапки (commands/ agents/ skills/) и доступны так, как если бы ты их сам написал. Известные плагины: obra/superpowers (один мета-скилл который оркестрирует 30 других), официальный skills bundle Anthropic, digital-marketing-pro (115 команд для marketing workflow).',
  what_uk: 'Плагін - це запакований stack: кілька commands + кілька agents + кілька skills + опціонально hooks + опціонально MCP-конфіг, все поширюється разом. Встановлення через `/plugin` команду усередині Claude Code (browse marketplace і клік), або git clone репо плагіна в ~/.claude/plugins/. Окремі шматки плагіна потрапляють у правильні підтеки (commands/ agents/ skills/) і доступні так, наче ти їх сам написав. Відомі плагіни: obra/superpowers (один мета-скілл який оркеструє 30 інших), офіційний skills bundle Anthropic, digital-marketing-pro (115 команд для marketing workflow).',
  structure: `~/.claude/plugins/
├── superpowers/                  ← obra/superpowers (meta)
│   ├── plugin.json               ← manifest
│   ├── commands/
│   │   └── route-intent.md
│   ├── skills/
│   │   └── orchestrator/SKILL.md
│   └── README.md
├── digital-marketing-pro/        ← 115 marketing commands
│   ├── plugin.json
│   └── commands/
│       ├── analyze-campaign.md
│       ├── write-email.md
│       ├── ... (113 more)
└── anthropic-claude-skills/      ← Anthropic's official bundle
    └── skills/
        ├── pdf-handling/
        ├── excel-handling/
        └── web-research/`,
  anatomy: [
    {
      field: 'plugin.json',
      desc_en: 'Manifest at the root of the plugin folder. Declares name, version, description, components contained.',
      desc_ru: 'Манифест в корне папки плагина. Объявляет name, version, description, компоненты внутри.',
      desc_uk: 'Маніфест у корені теки плагіна. Оголошує name, version, description, компоненти всередині.',
    },
    {
      field: 'commands/',
      desc_en: 'Plugin\'s commands. Each .md file becomes a /slash-command exactly like your personal ones.',
      desc_ru: "Commands плагина. Каждый .md-файл становится /slash-command-ом точно как твои личные.",
      desc_uk: "Commands плагіна. Кожен .md-файл стає /slash-command-ом точно як твої власні.",
    },
    {
      field: 'agents/',
      desc_en: 'Plugin\'s subagents. Each becomes spawnable via Task tool just like your personal agents.',
      desc_ru: 'Agents плагина. Каждый становится spawnable через Task tool, как твои личные.',
      desc_uk: 'Agents плагіна. Кожен стає spawnable через Task tool, як твої власні.',
    },
    {
      field: 'skills/',
      desc_en: 'Plugin\'s skills. Each folder is a separate skill with its own SKILL.md.',
      desc_ru: 'Skills плагина. Каждая папка - отдельный skill с собственным SKILL.md.',
      desc_uk: 'Skills плагіна. Кожна тека - окремий skill з власним SKILL.md.',
    },
    {
      field: 'hooks / mcp',
      desc_en: 'Optional. Plugins can ship hooks (merged into settings.json) and MCP server configs (merged into mcp_servers.json).',
      desc_ru: 'Опционально. Плагины могут поставлять hooks (мерджатся в settings.json) и MCP-конфиг (мерджится в mcp_servers.json).',
      desc_uk: 'Опціонально. Плагіни можуть постачати hooks (мерджаться у settings.json) і MCP-конфіг (мерджиться у mcp_servers.json).',
    },
  ],
  example_label: 'plugin install / browse / list',
  example: `# Inside Claude Code, browse marketplace + install:
/plugin
  → opens an interactive picker
  → search "design", "qa", "marketing", "writing"
  → tab-select → enter to install
  → Claude Code restarts the relevant subsystems

# Or install from raw GitHub:
gh repo clone obra/superpowers ~/.claude/plugins/superpowers
# Then restart Claude Code so the new commands/skills register.

# List what's installed:
ls ~/.claude/plugins/
superpowers/  digital-marketing-pro/  anthropic-claude-skills/

# A plugin.json looks like:
{
  "name": "superpowers",
  "version": "1.3.0",
  "description": "Skills-of-skills meta-framework.",
  "components": {
    "skills": ["orchestrator"],
    "commands": ["route-intent"]
  }
}`,
  when: [
    {
      en: 'When someone has already solved your problem at a higher level than one command - onboard their plugin, get 20+ pieces of work for free.',
      ru: 'Когда кто-то уже решил твою задачу на уровне выше одной команды - подключи его плагин, получи 20+ кусков работы бесплатно.',
      uk: 'Коли хтось уже розвʼязав твою задачу на рівні вище однієї команди - підключи його плагін, отримай 20+ шматків роботи безкоштовно.',
    },
    {
      en: 'When you want a coherent stack for a domain - design (taste + impeccable + open-design), QA (test-generator + bug-triager + security-scanner), marketing (the 115-command bundle).',
      ru: 'Когда нужен когерентный stack для домена - design (taste + impeccable + open-design), QA (test-generator + bug-triager + security-scanner), marketing (115-command бандл).',
      uk: 'Коли потрібен когерентний stack для домену - design (taste + impeccable + open-design), QA (test-generator + bug-triager + security-scanner), marketing (115-command бандл).',
    },
    {
      en: 'When you build your own collection of commands + skills - package them as a plugin, share with the team, version it like real software.',
      ru: 'Когда собрал свой набор commands + skills - упакуй как плагин, поделись с командой, версионируй как настоящий софт.',
      uk: 'Коли зібрав свій набір commands + skills - упакуй як плагін, поділись з командою, версіонуй як справжній софт.',
    },
  ],
}
