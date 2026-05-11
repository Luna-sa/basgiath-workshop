// Wire into PageRouter as the page after Practice or as a sub-route ?page=resources
//
// P_Resources — the take-home Resource Hub. Final stop of the workshop.
// Every autopilot prompt + every reference download lives here so the
// participant can come back any day, paste a prompt, and finish what
// they didn't get to during the live session.

import { useWorkshopStore } from '../store/workshopStore'
import { generateEcosystemPrompt } from '../data/ecosystem-prompt'
import CopyPrompt from '../components/CopyPrompt'
import { useT } from '../i18n/useT'

// ─────────────────────────────────────────────────────────────────────────────
// Autopilot prompts. Plain pragmatic English inside — lore is in the
// wrapping (card titles), not in the working code.
// ─────────────────────────────────────────────────────────────────────────────

const SETUP_DOCTOR_PROMPT = `Setup-Doctor for the Claude Code QA workshop.

Run a full diagnostic on my environment. Don't ask me anything yet — just check.

1. Print \`claude --version\`. If the binary is missing, tell me the install command for my OS (macOS / Windows / Linux) and stop.
2. Print \`git --version\`. If missing — tell me how to install it.
3. Print \`pwd\` and \`echo $HOME\` so we know where we are.
4. Check that \`~/.claude\` exists. If yes, list what's inside (\`ls -la ~/.claude\`). I'm looking for: \`commands/\`, \`agents/\`, \`mcp_servers.json\`, and \`CLAUDE.md\`.
5. Check network reachability: \`curl -sI https://api.anthropic.com | head -1\` and \`curl -sI https://registry.npmjs.org | head -1\`. If either fails, that's likely a corp proxy / firewall — flag it.
6. Check Node + npm: \`node --version\` and \`npm --version\`. MCP servers need npm.
7. Check disk space in $HOME: \`df -h $HOME | tail -1\`.

After each check, print one line: either "✓ OK" or "✗ broken: <reason>, fix: <one concrete action>".

At the end, give me a single short paragraph:
- What's ready.
- What's broken.
- The ONE next thing I should do.

Keep it tight. No 20-step lists. No "let me know if you need help".`

const WORKSPACE_INIT_PROMPT = `Workspace-Init for the QA workshop.

Set up my working folder. Do everything yourself, don't ask me to type commands.

1. Create \`~/qa-workshop\` if it doesn't exist. Cd into it.
2. Run \`git init\` inside (skip if .git already exists).
3. Download the sample QA project. Try in this order:
   a. \`curl -fL -o sample-project.zip https://workshop.local/handouts/sample-project.zip\`
   b. If that fails, fall back to: \`git clone https://github.com/Luna-sa/basgiath-workshop-sample.git sample-project\`
   c. If both fail, print the exact error and tell me to grab it manually from the workshop Resources page.
4. If you got the zip — unzip into \`~/qa-workshop/sample-project\` and remove the zip.
5. Print \`ls -la ~/qa-workshop/sample-project\` so I can see the contents.
6. Inside the sample project, check for a README.md and print its first 30 lines.

If anything fails — show the full error text, explain in one sentence what it means, and give me one concrete workaround (e.g. "your corp network blocks raw github clones, try the zip instead").

Finish with one line: "Ready, next step is X" or "Stuck on X, do Y".`

const MCP_INSTALLER_PROMPT = `MCP installer + diagnostic for the QA workshop.

Install three MCP servers and verify each one. Common failure mode is corporate network — handle it gracefully.

1. Playwright MCP (browser testing):
   \`claude mcp add playwright -- npx @playwright/mcp@latest\`

2. Fetch MCP (HTTP requests against APIs):
   \`claude mcp add fetch -- npx @anthropic-ai/mcp-fetch\`

3. Context7 MCP (live library documentation):
   \`claude mcp add context7 -- npx @upstash/context7-mcp@latest\`

After installing, run \`claude mcp list\` and confirm each one appears.

For each MCP server that failed to install:
- Print the FULL error text — not a summary.
- Translate the error into plain language ("npm can't reach the registry — that's almost certainly a corp proxy").
- Give me ONE workaround to try. Examples:
  - Set npm registry: \`npm config set registry https://registry.npmjs.org/\`
  - Use the corp mirror if there is one (\`npm config get registry\` to check current).
  - Pre-install the package globally with \`-g\` then re-add the MCP.
  - As last resort: install via \`mcp_servers.json\` manually and I'll paste the file.

Final block — print this verbatim, even if everything worked:

▲ IMPORTANT: MCP servers don't load until you restart Claude Code.
   Close this terminal session, open a new one, run \`claude\` again.
   Then test with: "use the playwright MCP to open https://example.com and tell me the title".

Keep the tone tight. No reassurance, no apologies. Just diagnosis and the next move.`

const APPLY_PERSONA_PROMPT = `Apply-Persona — install my generated CLAUDE.md as the global Claude Code persona.

I have a CLAUDE.md file ready. It's either:
- in my clipboard (I'll paste when you ask), or
- in ~/Downloads/ named like CLAUDE_<something>.md

Do this:

1. Check if \`~/.claude/CLAUDE.md\` already exists.
   - If YES: copy it to \`~/.claude/CLAUDE.md.backup-<YYYY-MM-DD-HHMMSS>\`. Confirm the backup path back to me.
   - If NO: just continue.

2. Make sure \`~/.claude/\` exists (\`mkdir -p ~/.claude\`).

3. Ask me ONCE: "Is your new CLAUDE.md in your clipboard, or in ~/Downloads/?"
   - If clipboard: ask me to paste it directly into chat. Then write it to \`~/.claude/CLAUDE.md\`.
   - If Downloads: list \`ls -1 ~/Downloads/CLAUDE_*.md\` and confirm which file. Copy it to \`~/.claude/CLAUDE.md\`.

4. Print the first 25 lines of \`~/.claude/CLAUDE.md\` — I want to verify it's actually MY persona and not someone else's.

5. Final block — print verbatim:

▲ Restart Claude Code now. Close the terminal, open a new one, run \`claude\`.
   When the new session starts, your persona should greet you in-character.
   If it doesn't — run the Resume-from-error prompt.

Don't lecture me about backups. Just do the work and confirm the file landed.`

const RESUME_FROM_ERROR_PROMPT = `Resume-from-error. Something broke during the QA workshop. Help me un-stick.

Don't dump a 20-item troubleshooting list on me. Walk me through it ONE step at a time.

1. Ask me ONE question: "Where did you get stuck?"
   Possible answers (let me pick one):
   - Installing Claude Code
   - Login / subscription / SSO
   - Workspace-Init (folder, sample project)
   - Ecosystem-prompt (CLAUDE.md, slash commands, agents)
   - MCP installer
   - Apply-Persona (CLAUDE.md not picking up)
   - Slash command behaving weird
   - Something else (I'll describe)

2. Ask me ONE follow-up: "What did you actually see — error text or symptom? Paste it."

3. Based on my two answers:
   - Run the relevant diagnostic commands yourself. Examples:
     * Claude Code missing → \`which claude && claude --version\`
     * MCP not loading → \`claude mcp list\` + check ~/.claude/mcp_servers.json exists
     * Persona not active → cat ~/.claude/CLAUDE.md | head -10 + ask if Claude was restarted
     * Slash command not found → ls .claude/commands/ in current project
   - Show me what you found in 3-5 lines max.
   - Give me ONE concrete next action. Not three options. One.

4. If after that one action I'm still stuck — generate a diagnostic bundle:
   \`\`\`
   echo "=== claude ===" && claude --version
   echo "=== mcp ===" && claude mcp list
   echo "=== ~/.claude ===" && ls -la ~/.claude/
   echo "=== claude.md head ===" && head -20 ~/.claude/CLAUDE.md 2>/dev/null
   echo "=== node ===" && node --version && npm --version
   \`\`\`
   Tell me to copy that output and send it to the workshop facilitator.

Tone: dry, calm, one step at a time. No "don't worry!", no "great question!". Just the next move.`

// ─────────────────────────────────────────────────────────────────────────────

const AUTOPILOTS = [
  {
    name_en: 'Cross the Parapet',
    name_ru: 'Перейти Парапет',
    name_uk: 'Перейти Парапет',
    sub: 'Setup-Doctor',
    desc_en: 'Verifies Claude Code, git, ~/.claude/, network reachability. Tells you exactly what is broken and how to fix it.',
    desc_ru: 'Проверяет Claude Code, git, ~/.claude/, доступ к сети. Говорит ровно что сломано и как починить.',
    desc_uk: 'Перевіряє Claude Code, git, ~/.claude/, доступ до мережі. Каже точно що зламано і як полагодити.',
    body: SETUP_DOCTOR_PROMPT,
  },
  {
    name_en: 'Lay your perch',
    name_ru: 'Заложить насест',
    name_uk: 'Закласти сідало',
    sub: 'Workspace-Init',
    desc_en: 'Creates ~/qa-workshop, downloads the sample project, initializes git. One paste — done.',
    desc_ru: 'Создаёт ~/qa-workshop, качает sample-проект, инициализирует git. Одна вставка — готово.',
    desc_uk: 'Створює ~/qa-workshop, качає sample-проєкт, ініціалізує git. Одна вставка — готово.',
    body: WORKSPACE_INIT_PROMPT,
  },
  {
    name_en: "Wake your dragon's senses",
    name_ru: 'Разбуди чувства дракона',
    name_uk: 'Розбуди чуття дракона',
    sub: 'MCP installer',
    desc_en: 'Installs Playwright, Fetch, Context7 MCP servers. Diagnoses corp-proxy failures. Reminds you to restart Claude Code.',
    desc_ru: 'Ставит MCP-серверы Playwright, Fetch, Context7. Диагностирует corp-proxy сбои. Напоминает перезапустить Claude Code.',
    desc_uk: 'Ставить MCP-сервери Playwright, Fetch, Context7. Діагностує corp-proxy збої. Нагадує перезапустити Claude Code.',
    body: MCP_INSTALLER_PROMPT,
  },
  {
    name_en: 'Wear your signet',
    name_ru: 'Надеть сигнет',
    name_uk: 'Вдягнути сигнет',
    sub: 'Apply-Persona',
    desc_en: 'Drops your generated CLAUDE.md into ~/.claude/CLAUDE.md, backs up the existing one, asks you to restart Claude.',
    desc_ru: 'Кладёт твой CLAUDE.md в ~/.claude/CLAUDE.md, бэкапит существующий, просит перезапустить Claude.',
    desc_uk: 'Кладе твій CLAUDE.md у ~/.claude/CLAUDE.md, бекапить існуючий, просить перезапустити Claude.',
    body: APPLY_PERSONA_PROMPT,
  },
  {
    name_en: 'Call the Healers',
    name_ru: 'Призвать Целителей',
    name_uk: 'Прикликати Цілителів',
    sub: 'Resume-from-error',
    desc_en: 'Recovery autopilot. You describe what broke, Claude diagnoses and gives ONE next action. No 20-step lists.',
    desc_ru: 'Восстановительный autopilot. Ты говоришь что сломалось, Claude диагностирует и даёт ОДНО следующее действие. Без 20-шаговых списков.',
    desc_uk: 'Відновлювальний autopilot. Ти кажеш що зламалося, Claude діагностує і дає ОДНУ наступну дію. Без 20-крокових списків.',
    body: RESUME_FROM_ERROR_PROMPT,
  },
]

const DOWNLOADS = [
  {
    title_en: 'Hidden Gems',
    title_ru: 'Hidden Gems',
    title_uk: 'Hidden Gems',
    desc_en: '22 power-user Claude Code features — skills, hooks, agents, plan mode, hotkeys, MCP tricks. The stuff that takes you from beginner to fluent.',
    desc_ru: '22 power-user-фичи Claude Code — skills, hooks, agents, plan mode, хоткеи, MCP-трюки. То что переводит из новичка во fluent.',
    desc_uk: '22 power-user-фічі Claude Code — skills, hooks, agents, plan mode, хоткеї, MCP-трюки. Те що переводить із новачка у fluent.',
    href: '/handouts/HIDDEN_GEMS.md',
    filename: 'HIDDEN_GEMS.md',
  },
  {
    title_en: 'Quick Reference',
    title_ru: 'Quick Reference',
    title_uk: 'Quick Reference',
    desc_en: 'One-page cheat sheet — slash commands, hotkeys, MCP commands, plan mode triggers. Pin it next to your monitor.',
    desc_ru: 'Cheat sheet на одной странице — slash-команды, хоткеи, MCP-команды, триггеры plan mode. Прикрепи рядом с монитором.',
    desc_uk: 'Cheat sheet на одній сторінці — slash-команди, хоткеї, MCP-команди, тригери plan mode. Причепи поруч з монітором.',
    href: '/handouts/QUICK_REFERENCE.md',
    filename: 'QUICK_REFERENCE.md',
  },
  {
    title_en: 'Sample QA project',
    title_ru: 'Sample QA проект',
    title_uk: 'Sample QA проєкт',
    desc_en: 'A small web app with intentional bugs. Use it to practice /test-cases, /bug-report, /review on real-ish code.',
    desc_ru: 'Маленькое web-приложение с намеренными багами. На нём практикуй /test-cases, /bug-report, /review на почти-настоящем коде.',
    desc_uk: 'Маленький web-додаток з навмисними багами. На ньому практикуй /test-cases, /bug-report, /review на майже-справжньому коді.',
    href: '/handouts/sample-project-readme.md',
    filename: 'sample-project-readme.md',
  },
]

const EXTERNAL_LINKS = [
  { label: 'Anthropic Claude Code documentation', href: 'https://docs.claude.com/en/docs/claude-code/overview' },
  { label: 'Anthropic prompt library', href: 'https://docs.anthropic.com/en/resources/prompt-library/library' },
  { label: 'MCP servers gallery', href: 'https://github.com/modelcontextprotocol/servers' },
  { label: 'Workshop GitHub repo (Luna-sa/basgiath-workshop)', href: 'https://github.com/Luna-sa/basgiath-workshop' },
]

// ─────────────────────────────────────────────────────────────────────────────

export default function P_Resources() {
  const t = useT()
  const user = useWorkshopStore(s => s.user)
  const ecosystemPrompt = generateEcosystemPrompt(user)

  return (
    <div className="min-h-screen px-6 py-16 sm:py-24">
      <div className="max-w-[980px] mx-auto">

        {/* ─── Hero ─── */}
        <header className="mb-20">
          <div className="font-mono text-[11px] tracking-[3px] uppercase text-qa-teal mb-5">
            · BONDED ·
          </div>
          <h1 className="font-display italic text-4xl sm:text-6xl text-white leading-[1.05] mb-5">
            {t('Take it home, rider.', 'Забери это домой, вершник.', 'Забери це додому, вершнику.')}
          </h1>
          <p className="text-[16px] sm:text-[17px] text-text-secondary leading-relaxed max-w-[640px]">
            {t(
              'Every prompt, every reference, every file you need to keep flying. Bookmark this page — your dragon waits here.',
              'Каждый промпт, каждая ссылка, каждый файл — всё чтобы продолжать летать. Сохрани страницу — твой дракон ждёт здесь.',
              'Кожен промпт, кожне посилання, кожен файл — усе щоб продовжувати літати. Збережи сторінку — твій дракон чекає тут.'
            )}
          </p>
        </header>

        {/* ─── Section 1: Master setup (featured) ─── */}
        <section className="mb-20">
          <SectionHeader
            eyebrow={t('· Master setup ·', '· Главная установка ·', '· Головна установка ·')}
            title={t('Forge your full ecosystem', 'Откуй свою экосистему', 'Викуй свою екосистему')}
            sub={t(
              'One prompt installs CLAUDE.md, 7 slash commands, 4 agents, and 3 MCP servers. Personalised to your role.',
              'Один промпт ставит CLAUDE.md, 7 slash-команд, 4 агентов и 3 MCP-сервера. Под твою роль.',
              'Один промпт ставить CLAUDE.md, 7 slash-команд, 4 агентів і 3 MCP-сервери. Під твою роль.'
            )}
          />

          <CopyPrompt
            featured
            name="QA Ecosystem Installer"
            desc={t(
              "Paste into Claude Code. Wait two minutes. You'll have the whole rig: persona, commands, agents, MCP.",
              'Вставь в Claude Code. Подожди две минуты. Получишь всю оснастку: персона, команды, агенты, MCP.',
              'Встав у Claude Code. Почекай дві хвилини. Отримаєш усю оснастку: персона, команди, агенти, MCP.'
            )}
          >
            {ecosystemPrompt}
          </CopyPrompt>

          <p className="font-mono text-[11px] text-text-dim mt-4 leading-relaxed">
            ▲ {t(
              'After it finishes — restart Claude Code so the MCP servers attach. Then verify with:',
              'После завершения — перезапусти Claude Code чтобы MCP-серверы подцепились. Затем проверь:',
              'Після завершення — перезапусти Claude Code аби MCP-сервери причепилися. Потім перевір:'
            )} ⌘ <span className="text-qa-teal">claude mcp list</span>
          </p>
        </section>

        {/* ─── Section 2: Autopilot prompts ─── */}
        <section className="mb-20">
          <SectionHeader
            eyebrow={t('· Autopilots ·', '· Автопилоты ·', '· Автопілоти ·')}
            title={t('Five prompts for every step', 'Пять промптов на каждый шаг', 'Пʼять промптів на кожен крок')}
            sub={t(
              "Each one is a self-driving instruction set. Paste, watch Claude work, move on. Use them in any order — they're independent.",
              'Каждый — самоисполняющийся набор инструкций. Вставил, посмотрел как Claude работает, пошёл дальше. Используй в любом порядке — они независимы.',
              'Кожен — самовиконуваний набір інструкцій. Вставив, подивився як Claude працює, пішов далі. Використовуй у будь-якому порядку — вони незалежні.'
            )}
          />

          <div className="grid sm:grid-cols-2 gap-4">
            {AUTOPILOTS.map(a => (
              <CopyPrompt
                key={a.sub}
                name={t(a.name_en, a.name_ru, a.name_uk)}
                desc={
                  <>
                    <span className="font-mono text-[11px] tracking-[2px] uppercase text-qa-teal">
                      {a.sub}
                    </span>
                    {' — '}
                    {t(a.desc_en, a.desc_ru, a.desc_uk)}
                  </>
                }
              >
                {a.body}
              </CopyPrompt>
            ))}
          </div>
        </section>

        {/* ─── Section 3: Reference downloads ─── */}
        <section className="mb-20">
          <SectionHeader
            eyebrow={t('· Provisions ·', '· Провизия ·', '· Провізія ·')}
            title={t('Reference downloads', 'Справочные файлы', 'Довідкові файли')}
            sub={t(
              'Three files to keep on your machine. The Hidden Gems list alone is worth printing.',
              'Три файла держать на ноуте. Один Hidden Gems-лист уже стоит распечатать.',
              'Три файли тримати на ноуті. Один Hidden Gems-список вже варто роздрукувати.'
            )}
          />

          <div className="grid sm:grid-cols-3 gap-4">
            {DOWNLOADS.map(d => (
              <a
                key={d.filename}
                href={d.href}
                download={d.filename}
                className="group block p-6 border border-border bg-surface/40 hover:border-qa-teal/60 hover:bg-qa-teal/[0.03] transition-all rounded-[2px]"
              >
                <div className="font-mono text-[10px] tracking-[2px] uppercase text-qa-teal mb-3">
                  ↓ {t('Download', 'Скачать', 'Завантажити')}
                </div>
                <div className="font-display text-[20px] text-white leading-tight mb-2">
                  {t(d.title_en, d.title_ru, d.title_uk)}
                </div>
                <p className="text-[13px] text-text-secondary leading-relaxed mb-4">
                  {t(d.desc_en, d.desc_ru, d.desc_uk)}
                </p>
                <div className="font-mono text-[11px] text-text-dim group-hover:text-qa-teal transition-colors">
                  {d.filename} →
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ─── Section 4: External references ─── */}
        <section className="mb-12">
          <SectionHeader
            eyebrow={t('· Beyond the parapet ·', '· За парапетом ·', '· За парапетом ·')}
            title={t('External references', 'Внешние ссылки', 'Зовнішні посилання')}
            sub={null}
          />

          <ul className="space-y-3 border-l border-border pl-5">
            {EXTERNAL_LINKS.map(l => (
              <li key={l.href}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14px] text-text-body hover:text-qa-teal transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="font-mono text-[11px] text-text-dim group-hover:text-qa-teal transition-colors">
                    →
                  </span>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* ─── Footer ─── */}
        <footer className="pt-12 border-t border-border">
          <p className="font-display italic text-[15px] text-text-dim text-center leading-relaxed">
            {t(
              '"The dragon doesn\'t pick the rider for comfort. He picks for what they\'ll become."',
              '«Дракон выбирает вершника не ради удобства. Он выбирает за то, кем тот станет».',
              '«Дракон обирає вершника не заради зручності. Він обирає за те, ким той стане».'
            )}
          </p>
          <p className="font-mono text-[10px] tracking-[3px] uppercase text-text-dim text-center mt-4">
            · QA Clan · Basgiath Workshop ·
          </p>
        </footer>

      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

function SectionHeader({ eyebrow, title, sub }) {
  return (
    <div className="mb-8">
      <div className="font-mono text-[11px] tracking-[3px] uppercase text-qa-teal mb-3">
        {eyebrow}
      </div>
      <h2 className="font-display italic text-2xl sm:text-3xl text-white leading-tight mb-2">
        {title}
      </h2>
      {sub && (
        <p className="text-[14px] text-text-secondary leading-relaxed max-w-[640px]">
          {sub}
        </p>
      )}
    </div>
  )
}
