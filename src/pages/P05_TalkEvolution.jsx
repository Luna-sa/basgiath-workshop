import { useState } from 'react'
import PageShell from '../core/PageShell'

const LEVELS = [
  {
    level: 1, badge: '🪶', title: 'Кадет', subtitle: 'Базовый чат',
    color: '#888888',
    description: 'Просто открываешь ChatGPT / Claude и пишешь вопрос текстом. Каждый раз заново, без контекста.',
    tools: [
      { name: 'Текстовый чат', desc: 'Пишешь "исправь этот баг", "что делает этот код" — получаешь ответ' },
      { name: 'Tab-автодополнение', desc: 'В Cursor/Copilot AI подсказывает следующую строку' },
    ],
    example: '"Напиши тест для функции validateEmail"',
    limitation: 'AI не знает твой проект. Каждый раз приходится объяснять контекст с нуля.',
  },
  {
    level: 2, badge: '🐉', title: 'Наездник', subtitle: 'Конфиги и команды',
    color: '#00E5CC',
    current: true,
    description: 'AI запоминает контекст через файлы. Ты один раз настраиваешь — дальше он знает, кто ты и как работаешь.',
    tools: [
      { name: 'CLAUDE.md / .cursorrules', desc: 'Файл с инструкциями: роль, стандарты, формат отчётов. AI читает его при каждом запуске' },
      { name: 'Slash-команды', desc: '/bug-report, /test-cases — одно слово вместо абзаца промпта' },
      { name: '@file, @codebase', desc: 'Указываешь AI на конкретный файл или весь проект' },
    ],
    example: '/bug-report Логин принимает пустой пароль без ошибки',
    limitation: 'AI всё ещё только читает и отвечает. Не может сам открыть браузер или отправить запрос.',
  },
  {
    level: 3, badge: '⚔️', title: 'Боец', subtitle: 'Plan mode и skills',
    color: '#E85D26',
    description: 'AI сначала думает, потом делает. Ты описываешь что нужно — он составляет план, ты одобряешь, он выполняет.',
    tools: [
      { name: 'Plan Mode', desc: 'AI анализирует задачу, находит файлы, строит план. Ты проверяешь перед выполнением' },
      { name: 'Skills (авто-активация)', desc: 'AI сам определяет тип задачи и применяет нужный workflow. Не нужно выбирать руками' },
      { name: 'Multi-file / Composer', desc: 'Изменения сразу в нескольких файлах одним промптом. Видишь diff перед принятием' },
    ],
    example: '"Отрефактори модуль авторизации: разбей на сервисы, добавь валидацию, напиши тесты"',
    limitation: 'AI работает только с файлами. Не может зайти на сайт, проверить API или создать issue.',
  },
  {
    level: 4, badge: '👑', title: 'Командир', subtitle: 'MCP, hooks, агенты',
    color: '#FF65BE',
    description: 'AI получает доступ к внешнему миру. Открывает браузер, тестирует API, создаёт issues, следит за правилами автоматически.',
    tools: [
      { name: 'MCP серверы', desc: 'Playwright — AI сам тестирует сайт. Fetch — отправляет HTTP-запросы. Sentry — мониторит ошибки' },
      { name: 'Hooks', desc: 'Автоматические правила: "перед коммитом — проверь линтер", "после edit — форматируй". AI следует им без напоминаний' },
      { name: 'Sub-agents', desc: 'AI запускает специализированных агентов для подзадач. qa-reviewer ревьюит код, security-scanner ищет уязвимости' },
    ],
    example: '"Открой staging-сайт, протестируй регистрацию невалидными данными, запиши баги в Jira"',
    limitation: 'Ты всё ещё управляешь вручную. Каждую задачу нужно запускать самому.',
  },
  {
    level: 5, badge: '🏛️', title: 'Архитектор', subtitle: 'Оркестрация',
    color: '#00E5CC',
    description: 'AI работает автономно. Несколько агентов параллельно, автоматические задачи по расписанию, интеграция в CI/CD.',
    tools: [
      { name: 'Agent Teams', desc: 'Несколько AI работают одновременно: один пишет код, другой тестирует, третий ревьюит. Спорят друг с другом' },
      { name: 'Headless / CI-CD', desc: 'AI запускается автоматически в пайплайне: при каждом PR — авто-ревью, авто-тесты, отчёт' },
      { name: 'Automations', desc: 'Расписание: "каждую ночь проверяй все открытые PR", "утром отчёт в Slack". AI работает пока ты спишь' },
    ],
    example: '"Запусти 5 агентов параллельно: каждый фиксит по одному багу из бэклога, создай PR с тестами"',
    limitation: '',
  },
]

export default function P05_TalkEvolution() {
  const [expanded, setExpanded] = useState(2)

  return (
    <PageShell pageIndex={5}>
      <div className="space-y-2">
        {LEVELS.map(lvl => (
          <button key={lvl.level} onClick={() => setExpanded(expanded === lvl.level ? null : lvl.level)}
            className={`w-full text-left border transition-all cursor-pointer overflow-hidden ${lvl.current ? 'border-qa-teal/30 bg-qa-teal/[0.05]' : 'border-border bg-surface/30 hover:bg-surface/50'}`}>

            {/* Header */}
            <div className="flex items-center gap-3 p-3">
              <span className="text-xl shrink-0">{lvl.badge}</span>
              <div className="flex-1 min-w-0">
                <div className="font-display text-[15px]" style={{ color: lvl.color }}>
                  Lv {lvl.level}: {lvl.title}
                </div>
                <div className="font-mono text-[11px] text-text-dim">{lvl.subtitle}</div>
              </div>
              {lvl.current && <span className="font-mono text-[10px] text-qa-teal border border-qa-teal/20 px-2 py-0.5 shrink-0">Сегодня</span>}
              {lvl.level <= 2 && !lvl.current && <span className="font-mono text-[10px] text-forest shrink-0">✓</span>}
              <span className={`text-text-dim text-sm transition-transform shrink-0 ${expanded === lvl.level ? 'rotate-180' : ''}`}>▾</span>
            </div>

            {/* Expanded detail */}
            {expanded === lvl.level && (
              <div className="px-3 pb-4 border-t border-border/50 pt-3 space-y-3" onClick={e => e.stopPropagation()}>
                {/* Description */}
                <p className="text-[13px] text-text-body leading-relaxed">{lvl.description}</p>

                {/* Tools */}
                <div className="space-y-2">
                  {lvl.tools.map((tool, i) => (
                    <div key={i} className="p-2.5 bg-black/30 border border-border/50">
                      <div className="text-[13px] text-white font-medium mb-0.5">{tool.name}</div>
                      <div className="text-[12px] text-text-secondary">{tool.desc}</div>
                    </div>
                  ))}
                </div>

                {/* Example prompt */}
                <div className="p-2.5 bg-black border border-border">
                  <div className="font-mono text-[10px] text-text-dim mb-1 uppercase tracking-wider">Пример</div>
                  <code className="font-mono text-[12px]" style={{ color: lvl.color }}>{lvl.example}</code>
                </div>

                {/* Limitation */}
                {lvl.limitation && (
                  <div className="p-2 border border-border/50 bg-surface/30">
                    <p className="text-[11px] text-text-dim italic">
                      <span className="text-corp-red font-mono text-[10px] uppercase not-italic">Ограничение:</span>{' '}{lvl.limitation}
                    </p>
                  </div>
                )}
              </div>
            )}
          </button>
        ))}

        <div className="mt-3 p-3 border border-qa-teal/15 bg-qa-teal/[0.03] text-center">
          <p className="text-xs text-text-secondary">
            <span className="text-qa-teal font-mono text-[11px]">Сегодня:</span> Lv 1 → Lv 2, начало Lv 4 с MCP.
            <span className="text-text-dim"> Следующие воркшопы: Lv 3–5.</span>
          </p>
        </div>
      </div>
    </PageShell>
  )
}
