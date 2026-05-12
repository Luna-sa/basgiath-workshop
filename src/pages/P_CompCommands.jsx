import ComponentDeepDive from '../components/ComponentDeepDive'

export default function P_CompCommands() {
  return <ComponentDeepDive pageIndex={7} data={DATA} />
}

const DATA = {
  eyebrow: 'COMPONENT · 02 · muscle memory',
  name: 'Commands',
  path: '~/.claude/commands/  ·  <project>/.claude/commands/',
  tagline_en: 'Slash commands - your custom shortcuts. One file per command. /command-name in the prompt and Claude follows the instructions inside.',
  tagline_ru: 'Слэш-команды - твои кастомные шорткаты. Один файл на команду. /command-name в промпте, и Claude идёт по инструкции внутри.',
  tagline_uk: 'Слеш-команди - твої кастомні шорткати. Один файл на команду. /command-name у промпті, і Claude іде за інструкцією всередині.',
  stats: [
    { value: '.md', label: 'file format' },
    { value: '$ARGUMENTS', label: 'placeholder' },
    { value: 'unlimited', label: 'commands per scope' },
  ],
  what_en: "A command is just a markdown file in .claude/commands/ named after the command. /bug-report → bug-report.md. The file content IS the prompt Claude runs when you invoke the command. Pass arguments and Claude sees them as $ARGUMENTS - write the file so the placeholder makes sense. Two scopes: global commands in ~/.claude/commands/ are everywhere; project-only in <project>/.claude/commands/ travel with the repo. If you run a workflow more than twice a week, write the command. You stop typing the same prompt over and over, the team stops asking how you generate X.",
  what_ru: 'Команда - это просто markdown файл в .claude/commands/, названный как команда. /bug-report → bug-report.md. Содержимое файла - это промпт который Claude запускает когда ты вызываешь команду. Передаёшь аргументы - Claude видит их как $ARGUMENTS, файл пиши так чтобы placeholder имел смысл. Два scope-а: глобальные в ~/.claude/commands/ работают везде; project-only в <project>/.claude/commands/ едут с репо. Команды - самый высокорычажный способ зафиксировать повторяющийся workflow.',
  what_uk: 'Команда - це просто markdown-файл у .claude/commands/, названий як команда. /bug-report → bug-report.md. Вміст файлу - це промпт, який Claude запускає коли ти викликаєш команду. Передаєш аргументи - Claude бачить їх як $ARGUMENTS, файл пиши так, щоб placeholder мав сенс. Два scope-и: глобальні в ~/.claude/commands/ працюють всюди; project-only у <project>/.claude/commands/ їдуть з репо. Команди - найвищий важіль, щоб зафіксувати повторюваний workflow.',
  structure: `~/.claude/commands/
├── bug-report.md       ← /bug-report "user cant save form"
├── test-cases.md       ← /test-cases "login screen"
├── review.md           ← /review (no args)
├── api-test.md         ← /api-test "POST /users"
└── checklist.md        ← /checklist "release v2.4"

<project>/.claude/commands/
└── deploy-staging.md   ← /deploy-staging  (only in this repo)`,
  anatomy: [
    {
      field: 'Filename',
      desc_en: 'The command name. /test-cases ⇒ test-cases.md. Lowercase, hyphenated.',
      desc_ru: 'Имя команды. /test-cases ⇒ test-cases.md. Нижний регистр, через дефис.',
      desc_uk: 'Імʼя команди. /test-cases ⇒ test-cases.md. Нижній регістр, через дефіс.',
    },
    {
      field: 'Body',
      desc_en: 'Markdown prose. Claude runs this verbatim as the prompt.',
      desc_ru: 'Markdown-проза. Claude запускает это дословно как промпт.',
      desc_uk: 'Markdown-проза. Claude запускає це дослівно як промпт.',
    },
    {
      field: '$ARGUMENTS',
      desc_en: "Placeholder. Whatever the user types after the command lands here. Reference it inline anywhere in the body.",
      desc_ru: 'Placeholder. Что юзер написал после команды - попадает сюда. Ссылайся в любом месте в теле.',
      desc_uk: 'Placeholder. Що юзер написав після команди - потрапляє сюди. Посилайся в будь-якому місці тіла.',
    },
    {
      field: 'Frontmatter (optional)',
      desc_en: 'YAML at the top for: allowed-tools, description. Most commands skip it.',
      desc_ru: 'YAML наверху для: allowed-tools, description. Большинство команд это пропускают.',
      desc_uk: 'YAML нагорі для: allowed-tools, description. Більшість команд це пропускають.',
    },
  ],
  example_label: '~/.claude/commands/bug-report.md',
  example: `---
description: Generate a professional QA bug report from a description.
---

You are writing a QA bug report.

User input: $ARGUMENTS

Produce a bug report with these sections, in this order:

1. **Title** - short, specific, no exclamation marks.
2. **Severity** - one of: Critical / Major / Minor.
3. **Steps to reproduce** - numbered, plain language, one action per step.
4. **Expected** - one sentence.
5. **Actual** - one sentence + the exact error text if visible.
6. **Environment** - OS, browser, app version, user role.
7. **Reproducibility** - Always / Sometimes / Once.
8. **Additional checks worth doing** - 2-3 follow-ups that might surface
   related issues.

Use plain language. No "boundary mutation". Just "empty input" or
"50K characters". Write so a developer who has never seen this code
can reproduce the bug from your report alone.`,
  when: [
    {
      en: 'Any workflow you run twice a week. Cost is 5 minutes to write the file. After that you just type /the-command.',
      ru: 'Любой workflow что запускаешь дважды в неделю. Цена - 5 минут на файл. Дальше просто /команда.',
      uk: 'Будь-який workflow, що запускаєш двічі на тиждень. Ціна - 5 хвилин на файл. Далі просто /команда.',
    },
    {
      en: 'When you need the SAME structured output every time - bug reports, test cases, API specs, retros.',
      ru: 'Когда нужен ОДИН И ТОТ ЖЕ структурный output каждый раз - bug-репорты, test-кейсы, API-спеки, ретро.',
      uk: 'Коли потрібен ОДИН І ТОЙ САМИЙ структурний output щоразу - bug-репорти, test-кейси, API-спеки, ретро.',
    },
    {
      en: "When a teammate keeps asking you \"how do you generate X\" - write a command, share the file, they get the same result.",
      ru: 'Когда коллега постоянно спрашивает «как ты генеришь X» - напиши команду, поделись файлом, у него тот же результат.',
      uk: 'Коли колега постійно питає «як ти генериш X» - напиши команду, поділись файлом, він отримає той самий результат.',
    },
  ],
}
