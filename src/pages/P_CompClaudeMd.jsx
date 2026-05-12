import ComponentDeepDive from '../components/ComponentDeepDive'

export default function P_CompClaudeMd() {
  return <ComponentDeepDive pageIndex={6} data={DATA} />
}

const DATA = {
  eyebrow: 'COMPONENT · 01 · spine',
  heroBanner: '/hero/spine-claudemd.jpg',
  name: 'CLAUDE.md',
  path: '~/.claude/CLAUDE.md  ·  <project>/CLAUDE.md',
  tagline_en: "The markdown file Claude reads at the start of every session. Your persona, your rules, the context of your work - in one place.",
  tagline_ru: 'Markdown-файл, который Claude читает в начале каждой сессии. Твоя персона, твои правила, контекст твоей работы - в одном месте.',
  tagline_uk: 'Markdown-файл, який Claude читає на початку кожної сесії. Твоя персона, твої правила, контекст твоєї роботи - в одному місці.',
  stats: [
    { value: 'plain md', label: 'format' },
    { value: '3 levels', label: 'hierarchy' },
    { value: 'every start', label: 'loaded' },
  ],
  what_en: 'CLAUDE.md is plain markdown - no special syntax, no YAML, no schema. Claude reads it like instructions from a teammate. The file tells Claude who you are, what you care about, how you like the work done, what to never do. Three files compose in hierarchy: ~/.claude/CLAUDE.md (you, everywhere) → project/CLAUDE.md (this codebase) → subdir/CLAUDE.md (this folder only). Deeper layer overrides upper. Most teams write the global file once, then drop a thin project file with codebase-specific context.',
  what_ru: 'CLAUDE.md - это обычный markdown. Никакого специального синтаксиса, YAML, схемы. Claude читает его как инструкцию от коллеги. Файл говорит Claude: кто ты, что для тебя важно, как делать работу, чего никогда не делать. Три файла собираются по иерархии: ~/.claude/CLAUDE.md (ты, везде) → project/CLAUDE.md (этот кодбейз) → subdir/CLAUDE.md (только эта папка). Глубже - перебивает верхнее. Большинство команд пишут глобальный один раз, потом кладут тонкий project-файл с контекстом кодбейза.',
  what_uk: 'CLAUDE.md - це звичайний markdown. Ніякого спеціального синтаксису, YAML, схеми. Claude читає його як інструкцію від колеги. Файл говорить Claude: хто ти, що для тебе важливо, як робити роботу, чого ніколи не робити. Три файли збираються за ієрархією: ~/.claude/CLAUDE.md (ти, скрізь) → project/CLAUDE.md (ця кодбаза) → subdir/CLAUDE.md (тільки ця тека). Глибше перебиває верхнє. Більшість команд пишуть глобальний один раз, потім кладуть тонкий project-файл з контекстом кодбази.',
  structure: `~/.claude/CLAUDE.md            # global - you, everywhere
~/projects/web-app/CLAUDE.md  # project - this codebase
~/projects/web-app/src/payments/CLAUDE.md   # subdir - this folder only

# Hierarchy: deeper wins.
# Claude reads ALL three on session start and merges them.`,
  anatomy: [
    {
      field: 'Voice',
      desc_en: 'Who Claude is in this session - tone, length, what to never say.',
      desc_ru: 'Кто Claude в этой сессии - тон, длина, чего никогда не говорить.',
      desc_uk: 'Хто Claude в цій сесії - тон, довжина, чого ніколи не говорити.',
    },
    {
      field: 'Project',
      desc_en: 'What this codebase is, what languages, what frameworks, what conventions.',
      desc_ru: 'Что это за кодбейз, какие языки, какие фреймворки, какие конвенции.',
      desc_uk: 'Що це за кодбаза, які мови, які фреймворки, які конвенції.',
    },
    {
      field: 'Workflow',
      desc_en: 'How you like the work done - small commits vs big PR, comments style, where tests live.',
      desc_ru: 'Как тебе нравится работать - маленькие коммиты vs большие PR, стиль комментариев, где живут тесты.',
      desc_uk: 'Як тобі подобається працювати - маленькі коміти vs великі PR, стиль коментарів, де живуть тести.',
    },
    {
      field: 'Forbidden',
      desc_en: 'Hard rules: never push to main, never delete migrations, never auto-commit secrets.',
      desc_ru: 'Жёсткие правила: никогда не пушить в main, не удалять миграции, не коммитить секреты.',
      desc_uk: 'Жорсткі правила: ніколи не пушити в main, не видаляти міграції, не комітити секрети.',
    },
    {
      field: 'Context',
      desc_en: 'Quick references - links to internal docs, runbooks, who to ping for what.',
      desc_ru: 'Быстрые ссылки - на внутренние доки, runbook-и, кому пинговать за что.',
      desc_uk: 'Швидкі посилання - на внутрішні доки, runbook-и, кому пінгувати за що.',
    },
  ],
  example_label: '~/.claude/CLAUDE.md',
  example: `# I am a QA engineer at a slot-game studio

## Voice
- I prefer short answers. Trim filler.
- No "great question!" / "let me help you with that!".
- When you disagree - say so directly.

## My work
- Mobile slot game. Manual exploratory + Playwright e2e.
- Sprint cadence: 2 weeks. Release on Thursdays.
- Bugs go to Linear (project: QA-MOBILE).

## How I like the work done
- Test cases as a table: ID, Title, Steps, Expected, Priority.
- Bug reports: Steps to reproduce, Expected, Actual, Environment.
- Use plain language. No "boundary mutation" - say "empty input".

## Never
- Never write tests without negative + edge cases.
- Never modify the production fixtures dataset.`,
  when: [
    {
      en: 'Every project, day one. One file decides how Claude talks to you for the rest of the work.',
      ru: 'Каждый проект, день первый. Один файл определяет как Claude говорит с тобой весь остаток работы.',
      uk: 'Кожен проєкт, день перший. Один файл визначає як Claude говорить з тобою решту роботи.',
    },
    {
      en: 'When Claude keeps producing output that misses your conventions - codify the convention here.',
      ru: 'Когда Claude постоянно мажет мимо твоих конвенций - закодифицируй конвенцию здесь.',
      uk: 'Коли Claude постійно мажить повз твої конвенції - закодифікуй конвенцію тут.',
    },
    {
      en: 'When you join a new repo - drop a thin project/CLAUDE.md before the first prompt.',
      ru: 'Когда заходишь в новый репо - положи тонкий project/CLAUDE.md до первого промпта.',
      uk: 'Коли заходиш у новий репо - поклади тонкий project/CLAUDE.md до першого промпта.',
    },
  ],
}
