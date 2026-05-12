import ComponentDeepDive from '../components/ComponentDeepDive'

export default function P_CompAgents() {
  return <ComponentDeepDive pageIndex={8} data={DATA} />
}

const DATA = {
  eyebrow: 'COMPONENT · 03 · claws',
  name: 'Agents',
  path: '~/.claude/agents/  ·  <project>/.claude/agents/',
  tagline_en: 'Specialised mini-Claudes for one job each. They run in parallel with their own context, return a result, and disappear. Main session stays clean.',
  tagline_ru: 'Специализированные мини-Claude под одну задачу каждый. Работают параллельно, со своим контекстом, возвращают результат и исчезают. Main session остаётся чистой.',
  tagline_uk: 'Спеціалізовані міні-Claude під одну задачу кожен. Працюють паралельно, зі своїм контекстом, повертають результат і зникають. Main session залишається чистою.',
  stats: [
    { value: '.md', label: 'file format' },
    { value: 'parallel', label: 'execution' },
    { value: 'own context', label: 'isolation' },
  ],
  what_en: 'An agent is a subagent — a separate Claude instance with its own system prompt, its own tools, its own context window. You invoke it via the Task tool: "spawn a code-reviewer on these three files". It runs in parallel with the main session, can read files and search the web, and returns a single message at the end. The main session never sees the agent\'s intermediate steps — only the final answer. Use this to keep your main context lean.',
  what_ru: 'Агент - это subagent: отдельный инстанс Claude со своим system-промптом, своими инструментами, своим контекстным окном. Вызываешь через Task tool: «spawn code-reviewer на эти три файла». Работает параллельно с main session, может читать файлы и искать в вебе, возвращает одно сообщение в конце. Main session никогда не видит промежуточных шагов агента - только финальный ответ. Используй это чтобы держать main context чистым.',
  what_uk: 'Агент - це subagent: окремий інстанс Claude зі своїм system-промптом, своїми інструментами, своїм контекстним вікном. Викликаєш через Task tool: «spawn code-reviewer на ці три файли». Працює паралельно з main session, може читати файли і шукати в вебі, повертає одне повідомлення в кінці. Main session ніколи не бачить проміжних кроків агента - тільки фінальну відповідь. Використовуй це щоб тримати main context чистим.',
  structure: `~/.claude/agents/
├── code-reviewer.md        ← spawn for PR-style code reviews
├── test-generator.md       ← spawn to write tests for a file
├── security-scanner.md     ← spawn to look for vulns
├── docs-writer.md          ← spawn to draft documentation
└── bug-triager.md          ← spawn to read logs and rank severity

# Agents are independent Claudes — parallel work, isolated context,
# main session sees only their final answer.`,
  anatomy: [
    {
      field: 'name',
      desc_en: 'YAML key. How the main Claude calls the agent via Task tool.',
      desc_ru: 'YAML-ключ. Как main Claude вызывает агента через Task tool.',
      desc_uk: 'YAML-ключ. Як main Claude викликає агента через Task tool.',
    },
    {
      field: 'description',
      desc_en: 'One sentence. The main Claude reads this to decide WHEN to spawn this agent.',
      desc_ru: 'Одно предложение. Main Claude читает это чтобы решить КОГДА спавнить агента.',
      desc_uk: 'Одне речення. Main Claude читає це щоб вирішити КОЛИ спавнити агента.',
    },
    {
      field: 'tools',
      desc_en: 'List of tools the agent is allowed to use. Read-only? Add Write? Bash? Limit aggressively.',
      desc_ru: 'Список инструментов которые агенту разрешены. Только Read? Добавить Write? Bash? Ограничивай агрессивно.',
      desc_uk: 'Список інструментів дозволених агенту. Тільки Read? Додати Write? Bash? Обмежуй агресивно.',
    },
    {
      field: 'system prompt',
      desc_en: 'The body of the file. Becomes the agent\'s personality and rules — separate from your CLAUDE.md.',
      desc_ru: 'Тело файла. Становится личностью и правилами агента - отдельно от твоего CLAUDE.md.',
      desc_uk: 'Тіло файлу. Стає особистістю і правилами агента - окремо від твого CLAUDE.md.',
    },
  ],
  example_label: '~/.claude/agents/code-reviewer.md',
  example: `---
name: code-reviewer
description: |
  Use proactively after any non-trivial code change. Reviews diff
  for QA-relevant issues: missing edge cases, error handling gaps,
  testability, security basics.
tools: Read, Grep, Glob, Bash
---

You are a code review agent for a QA-focused team.

Read the changed files (use Read + git diff via Bash if needed).
Then produce a review with these sections:

## Issues (by severity)
| Sev | File:Line | Issue | Suggested fix |
|-----|-----------|-------|---------------|
| ... |    ...    |  ...  |      ...      |

## Missing test coverage
List concrete scenarios not covered by existing tests:
- Edge cases (null, empty, Unicode, very large input)
- Error paths (network down, malformed response)
- Concurrency (race conditions, ordering)

## Approve / Request changes
One word.

Be concrete. Never say "consider reviewing this" — point at a file
and a line. No filler. No "great work overall".`,
  when: [
    {
      en: 'When a sub-task needs lots of context — reading 20 files for code review, scanning a whole codebase for security issues. Offload to keep main session lean.',
      ru: 'Когда подзадача требует много контекста - читать 20 файлов на code review, сканировать весь кодбейз на security. Делегируй чтобы main session не раздувался.',
      uk: 'Коли підзадача потребує багато контексту - читати 20 файлів на code review, сканувати всю кодбазу на security. Делегуй щоб main session не роздувався.',
    },
    {
      en: 'When you want truly parallel work — spawn 3 agents on 3 different files simultaneously, get 3 answers back at once.',
      ru: 'Когда нужна реально параллельная работа - спавн 3 агента на 3 разных файла одновременно, получи 3 ответа разом.',
      uk: 'Коли потрібна реально паралельна робота - спавн 3 агенти на 3 різних файли одночасно, отримай 3 відповіді одразу.',
    },
    {
      en: "When the sub-task has a DIFFERENT mindset from yours — code review is hostile-skeptical, your main session is constructive. Different system prompt, different agent.",
      ru: 'Когда подзадача требует ДРУГОГО mindset - code review это враждебно-скептический, main session - конструктивный. Разный system-промпт, разный агент.',
      uk: 'Коли підзадача потребує ІНШОГО mindset - code review це вороже-скептичний, main session - конструктивний. Різний system-промпт, різний агент.',
    },
  ],
}
