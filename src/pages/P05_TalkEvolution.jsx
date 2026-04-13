import { useState } from 'react'
import PageShell from '../core/PageShell'

const LEVELS = [
  {
    level: 1, badge: '🪶', title: 'Кадет', subtitle: 'Базовый чат',
    color: '#888888',
    desc: 'Пишешь вопрос — получаешь ответ. Каждый раз с нуля, без контекста.',
    tools: [
      { name: 'Текстовый чат', desc: '"Исправь баг", "что делает этот код" — и всё' },
      { name: 'Tab-автодополнение', desc: 'AI подсказывает следующую строку' },
    ],
    example: '"Напиши тест для validateEmail"',
    limit: 'AI не знает твой проект. Каждый раз заново.',
  },
  {
    level: 2, badge: '🐉', title: 'Наездник', subtitle: 'Конфиги + команды',
    color: '#00E5CC', current: true,
    desc: 'AI запоминает контекст. Один раз настроил — дальше он знает, кто ты.',
    tools: [
      { name: 'CLAUDE.md', desc: 'Файл с инструкциями. AI читает при каждом запуске' },
      { name: 'Slash-команды', desc: '/bug-report — одно слово вместо абзаца промпта' },
      { name: '@file, @codebase', desc: 'Указываешь AI на конкретный файл или весь проект' },
    ],
    example: '/bug-report Логин принимает пустой пароль',
    limit: 'AI только читает и отвечает. Не может открыть браузер.',
  },
  {
    level: 3, badge: '⚔️', title: 'Боец', subtitle: 'Plan mode + skills',
    color: '#E85D26',
    desc: 'AI сначала думает, потом делает. Составляет план — ты одобряешь.',
    tools: [
      { name: 'Plan Mode', desc: 'Анализ → план → твоё одобрение → выполнение' },
      { name: 'Skills', desc: 'AI сам определяет тип задачи и включает нужный workflow' },
      { name: 'Multi-file', desc: 'Меняет несколько файлов сразу. Видишь diff перед принятием' },
    ],
    example: '"Разбей auth на сервисы, добавь валидацию и тесты"',
    limit: 'Работает только с файлами. Не выходит за пределы проекта.',
  },
  {
    level: 4, badge: '👑', title: 'Командир', subtitle: 'MCP + агенты',
    color: '#FF65BE',
    desc: 'AI выходит за пределы кода. Открывает браузер, тестирует API, создаёт issues.',
    tools: [
      { name: 'MCP серверы', desc: 'Playwright — тестирует сайт. Fetch — API. Sentry — мониторинг' },
      { name: 'Hooks', desc: 'Автоматические правила. "Перед коммитом — линтер"' },
      { name: 'Sub-agents', desc: 'qa-reviewer ревьюит, security-scanner ищет уязвимости' },
    ],
    example: '"Открой staging, протестируй регистрацию, запиши баги в Jira"',
    limit: 'Каждую задачу запускаешь вручную.',
  },
  {
    level: 5, badge: '🏛️', title: 'Архитектор', subtitle: 'Оркестрация',
    color: '#00E5CC',
    desc: 'AI работает автономно. Параллельные агенты, расписание, CI/CD.',
    tools: [
      { name: 'Agent Teams', desc: 'Несколько AI параллельно: пишет, тестирует, ревьюит' },
      { name: 'Headless', desc: 'AI в CI/CD: авто-ревью на каждый PR' },
      { name: 'Automations', desc: '"Каждую ночь проверяй PR, утром отчёт в Slack"' },
    ],
    example: '"5 агентов: каждый фиксит по багу из бэклога"',
    limit: '',
  },
]

export default function P05_TalkEvolution() {
  const [expanded, setExpanded] = useState(2)

  return (
    <PageShell pageIndex={5}>
      <div className="space-y-3">
        {LEVELS.map(lvl => (
          <button key={lvl.level} onClick={() => setExpanded(expanded === lvl.level ? null : lvl.level)}
            className={`w-full text-left border transition-all cursor-pointer overflow-hidden ${
              lvl.current ? 'border-qa-teal/40 bg-qa-teal/[0.05]' : 'border-border bg-surface/30 hover:bg-surface/50'
            }`}>

            {/* Header — always visible */}
            <div className="flex items-center gap-4 p-4">
              <span className="text-2xl shrink-0">{lvl.badge}</span>
              <div className="flex-1 min-w-0">
                <div className="font-display text-[20px] leading-tight" style={{ color: lvl.color }}>
                  Lv {lvl.level}: {lvl.title}
                </div>
                <div className="text-[14px] text-text-dim mt-0.5">{lvl.subtitle}</div>
              </div>
              {lvl.current && <span className="font-mono text-[12px] text-qa-teal border border-qa-teal/20 px-3 py-1 shrink-0">Сегодня</span>}
              <span className={`text-text-dim text-base transition-transform shrink-0 ${expanded === lvl.level ? 'rotate-180' : ''}`}>▾</span>
            </div>

            {/* Expanded — full detail */}
            {expanded === lvl.level && (
              <div className="px-4 pb-5 border-t border-border/50 pt-4 space-y-4" onClick={e => e.stopPropagation()}>
                <p className="text-[16px] text-text-body leading-relaxed">{lvl.desc}</p>

                {/* Tools */}
                <div className="space-y-2">
                  {lvl.tools.map((tool, i) => (
                    <div key={i} className="p-3 bg-[#141414] border border-[#2E2E2E] rounded-lg">
                      <div className="text-[16px] text-white font-medium mb-1">{tool.name}</div>
                      <div className="text-[14px] text-text-secondary leading-relaxed">{tool.desc}</div>
                    </div>
                  ))}
                </div>

                {/* Example */}
                <div className="p-3 bg-[#141414] border border-[#2E2E2E] rounded-lg">
                  <div className="font-mono text-[12px] text-text-dim uppercase tracking-wider mb-1">Пример</div>
                  <code className="font-mono text-[16px] leading-relaxed" style={{ color: lvl.color }}>{lvl.example}</code>
                </div>

                {/* Limitation */}
                {lvl.limit && (
                  <p className="text-[14px] text-text-dim italic px-1">
                    <span className="text-corp-red not-italic font-mono text-[12px] uppercase">Ограничение:</span>{' '}{lvl.limit}
                  </p>
                )}
              </div>
            )}
          </button>
        ))}

        <div className="mt-4 p-4 border border-qa-teal/15 bg-qa-teal/[0.03] text-center">
          <p className="text-[16px] text-text-secondary">
            <span className="text-qa-teal font-mono">Сегодня:</span> Lv 1 → Lv 2, начало Lv 4.
            <span className="text-text-dim"> Следующие воркшопы: Lv 3–5.</span>
          </p>
        </div>
      </div>
    </PageShell>
  )
}
