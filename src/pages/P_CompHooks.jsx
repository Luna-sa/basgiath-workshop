import ComponentDeepDive from '../components/ComponentDeepDive'

export default function P_CompHooks() {
  return <ComponentDeepDive pageIndex={11} data={DATA} />
}

const DATA = {
  eyebrow: 'COMPONENT · 06 · reflexes',
  heroImage: '/hero/hooks-casting.jpg',
  name: 'Hooks',
  path: '~/.claude/settings.json  ·  <project>/.claude/settings.json',
  tagline_en: "Shell commands that run automatically when an event fires - pre-commit, post-tool-use, on-stop. Claude reacts without being asked.",
  tagline_ru: "Shell-команды которые запускаются автоматически когда срабатывает событие - pre-commit, post-tool-use, on-stop. Claude реагирует без просьбы.",
  tagline_uk: "Shell-команди, які запускаються автоматично коли спрацьовує подія - pre-commit, post-tool-use, on-stop. Claude реагує без прохання.",
  stats: [
    { value: 'shell', label: 'language' },
    { value: 'events', label: 'trigger' },
    { value: 'sync · async', label: 'modes' },
  ],
  what_en: "A hook is a shell command Claude Code runs at a specific moment. Define it in settings.json under a hook event - PreToolUse (before any tool fires), PostToolUse (after), Stop (when Claude finishes responding), SubagentStop, UserPromptSubmit. Stdout from the hook can talk back to Claude (write to a tool-result file, raise a warning). PreToolUse hooks can BLOCK a tool call - return non-zero exit and the tool never runs. This is how you enforce rules at the runtime layer - no commits to main, no rm -rf outside /tmp, auto-format on save, notify-on-finish.",
  what_ru: 'Hook - это shell-команда которую Claude Code запускает в конкретный момент. Определяешь в settings.json под hook-событием - PreToolUse (перед любым tool), PostToolUse (после), Stop (когда Claude закончил ответ), SubagentStop, UserPromptSubmit. Stdout хука может говорить с Claude обратно (записать в tool-result, поднять warning). PreToolUse хуки могут БЛОКИРОВАТЬ tool-call - вернёшь non-zero exit, и tool не запустится. Так enforce-ишь правила на runtime-уровне: никаких коммитов в main, никаких rm -rf вне /tmp, авто-формат при сохранении, notify-on-finish.',
  what_uk: 'Hook - це shell-команда, яку Claude Code запускає в конкретний момент. Визначаєш у settings.json під hook-подією - PreToolUse (перед будь-яким tool), PostToolUse (після), Stop (коли Claude закінчив відповідь), SubagentStop, UserPromptSubmit. Stdout хука може говорити з Claude назад (записати в tool-result, підняти warning). PreToolUse хуки можуть БЛОКУВАТИ tool-call - повернеш non-zero exit, і tool не запуститься. Так enforce-иш правила на runtime-рівні: жодних комітів у main, жодних rm -rf поза /tmp, авто-формат при збереженні, notify-on-finish.',
  structure: `~/.claude/settings.json
└── hooks:
    PreToolUse:        ← runs BEFORE a tool. Can block (exit != 0).
    PostToolUse:       ← runs AFTER a tool succeeds.
    Stop:              ← runs when Claude finishes its turn.
    SubagentStop:      ← runs when a spawned subagent finishes.
    UserPromptSubmit:  ← runs when the user submits a new prompt.

# Hook command receives a JSON payload on stdin describing the event.
# Hook stdout (or a tool-result JSON file) talks back to Claude.`,
  anatomy: [
    {
      field: 'matcher',
      desc_en: 'Pattern: which tool names (or user prompt patterns) this hook listens for. "Bash" / "Edit" / "*" / regex.',
      desc_ru: 'Паттерн: какие имена tools (или паттерны промптов) этот хук слушает. "Bash" / "Edit" / "*" / regex.',
      desc_uk: 'Патерн: які імена tools (або патерни промптів) цей хук слухає. "Bash" / "Edit" / "*" / regex.',
    },
    {
      field: 'hooks[].type',
      desc_en: '"command" for now. Future-reserved for other types.',
      desc_ru: '"command" на сейчас. Зарезервировано на будущее под другие типы.',
      desc_uk: '"command" поки що. Зарезервовано на майбутнє під інші типи.',
    },
    {
      field: 'hooks[].command',
      desc_en: 'The shell command to run. Standard POSIX, runs in your shell with the project as cwd.',
      desc_ru: 'Shell-команда для запуска. POSIX, исполняется в твоём shell, cwd = проект.',
      desc_uk: 'Shell-команда для запуску. POSIX, виконується в твоєму shell, cwd = проєкт.',
    },
    {
      field: 'stdin payload',
      desc_en: 'Hook receives a JSON object on stdin describing the event (tool name, params, prior output). Parse with `jq` or your language of choice.',
      desc_ru: 'Hook получает JSON-объект на stdin описывающий событие (имя tool-а, params, prior output). Парси через `jq` или язык на выбор.',
      desc_uk: 'Hook отримує JSON-обʼєкт на stdin, що описує подію (імʼя tool-а, params, prior output). Парси через `jq` або мову на вибір.',
    },
  ],
  example_label: '~/.claude/settings.json - block commits to main',
  example: `{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "/Users/me/.claude/hooks/branch-guard.sh"
          }
        ]
      }
    ],
    "Stop": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "afplay /System/Library/Sounds/Tink.aiff"
          }
        ]
      }
    ]
  }
}

# ~/.claude/hooks/branch-guard.sh
#!/bin/bash
PAYLOAD=$(cat)
COMMAND=$(echo "$PAYLOAD" | jq -r '.params.command // ""')

# Block any \`git commit\` or \`git push\` while on main
if echo "$COMMAND" | grep -qE 'git (commit|push)'; then
  BRANCH=$(git branch --show-current 2>/dev/null)
  if [ "$BRANCH" = "main" ] || [ "$BRANCH" = "master" ]; then
    echo "blocked: cannot commit/push directly to $BRANCH" >&2
    exit 2   # non-zero = abort the tool call
  fi
fi
exit 0`,
  when: [
    {
      en: 'When you want a guardrail that Claude can\'t talk its way past - exit-non-zero on `git push origin main`, no exceptions.',
      ru: 'Когда нужен guardrail который Claude не уговорит - exit-non-zero на `git push origin main`, без исключений.',
      uk: 'Коли потрібен guardrail який Claude не вмовить - exit-non-zero на `git push origin main`, без винятків.',
    },
    {
      en: 'When you want side-effects on events Claude does - auto-format-on-edit, run-tests-on-commit, notify-when-done.',
      ru: 'Когда хочешь side-effect-ы на события Claude - auto-format-on-edit, run-tests-on-commit, notify-when-done.',
      uk: 'Коли хочеш side-effect-и на події Claude - auto-format-on-edit, run-tests-on-commit, notify-when-done.',
    },
    {
      en: 'When you need audit logging - every Bash command, every Edit, every Write - pipe through a hook to a log file.',
      ru: 'Когда нужен audit-лог - каждый Bash, каждый Edit, каждый Write - через хук в лог-файл.',
      uk: 'Коли потрібен audit-лог - кожен Bash, кожен Edit, кожен Write - через хук у лог-файл.',
    },
  ],
}
