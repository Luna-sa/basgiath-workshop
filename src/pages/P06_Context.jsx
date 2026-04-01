import { useState } from 'react'
import PageShell from '../core/PageShell'

const LEVELS = [
  {
    level: 1,
    badge: '🪶',
    title: 'Кадет',
    subtitle: 'Только пришёл',
    lore: 'Ты пересёк Парапет. Ты жив. Но ты ещё ничего не умеешь.',
    tools: [
      { name: 'Базовый чат', desc: 'Просто пишешь вопрос AI — «исправь этот баг», «что делает этот код»' },
      { name: 'Tab-автодополнение', desc: 'AI подсказывает следующую строку. Нажал Tab — принял' },
    ],
    example: '"Напиши тест для этой функции"',
    color: 'text-text-dim',
    border: 'border-border',
  },
  {
    level: 2,
    badge: '🐉',
    title: 'Наездник',
    subtitle: 'Связался с драконом',
    lore: 'Связь установлена. Дракон знает, кто ты. Он понимает контекст.',
    tools: [
      { name: 'CLAUDE.md / .cursorrules', desc: 'AI читает файл-инструкцию при каждом запуске. Знает проект, роль, стандарты' },
      { name: 'Slash-команды', desc: '/bug-report, /test-cases — одна команда вместо длинного промпта' },
      { name: '@-mentions', desc: '@file, @codebase, @web — указываешь AI на конкретный контекст' },
    ],
    example: '/bug-report login page crashes when clicking submit',
    color: 'text-qa-teal',
    border: 'border-qa-teal/30',
    current: true,
  },
  {
    level: 3,
    badge: '⚔️',
    title: 'Боец',
    subtitle: 'Освоил приёмы',
    lore: 'Ты не просто летаешь — ты сражаешься. Твои техники отточены.',
    tools: [
      { name: 'Plan Mode', desc: 'AI сначала думает, потом действует. Составляет план, ты одобряешь' },
      { name: 'Skills (авто-активация)', desc: 'AI сам распознаёт тип задачи и применяет нужный workflow' },
      { name: 'Composer / Multi-file', desc: 'Изменения сразу в нескольких файлах одним промптом' },
    ],
    example: '"Отрефактори auth модуль, разбей на сервисы, добавь тесты"',
    color: 'text-ember',
    border: 'border-ember/30',
  },
  {
    level: 4,
    badge: '👑',
    title: 'Командир',
    subtitle: 'Управляет крылом',
    lore: 'Твой дракон подключён к внешнему миру. Он видит, действует, автоматизирует.',
    tools: [
      { name: 'MCP серверы', desc: 'AI открывает браузер, тестирует API, читает базы данных, создаёт issues' },
      { name: 'Hooks', desc: 'Автоматические правила: «перед коммитом — проверь линтер», «после edit — формат»' },
      { name: 'Sub-agents', desc: 'AI делегирует подзадачи специализированным агентам' },
    ],
    example: '"Открой сайт, протестируй регистрацию, запиши все баги в Jira"',
    color: 'text-personal-pink',
    border: 'border-personal-pink/30',
  },
  {
    level: 5,
    badge: '🏛️',
    title: 'Архитектор',
    subtitle: 'Проектирует систему',
    lore: 'Ты больше не один наездник. Ты управляешь армией.',
    tools: [
      { name: 'Agent Teams', desc: 'Несколько AI работают параллельно: один пишет код, другой тестирует, третий ревьюит' },
      { name: 'Headless / CI-CD', desc: 'AI работает автономно в пайплайне: авто-фикс, авто-тест, авто-деплой' },
      { name: 'Automations', desc: 'Расписание: «каждую ночь ревьюй все PR, утром отчёт в Slack»' },
    ],
    example: '"Запусти 5 агентов: каждый фиксит по одному багу из бэклога"',
    color: 'text-qa-teal',
    border: 'border-qa-teal/50',
  },
]

export default function P06_Context() {
  const [expanded, setExpanded] = useState(2) // Level 2 expanded by default (current workshop level)

  return (
    <PageShell pageIndex={6}>
      <div className="space-y-6">
        {/* Before/After — compact */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border border-border border-l-[3px] border-l-corp-red bg-surface/50">
            <div className="font-mono text-[11px] tracking-[2px] uppercase text-corp-red mb-2">Без AI-экосистемы</div>
            <ul className="space-y-1.5 text-text-secondary text-xs">
              {['Copy-paste каждый раз', 'Нет контекста проекта', 'Всё руками', 'Один инструмент'].map((t, i) => (
                <li key={i} className="flex gap-2"><span className="text-corp-red/60">✕</span>{t}</li>
              ))}
            </ul>
          </div>
          <div className="p-4 border border-border border-l-[3px] border-l-qa-teal bg-qa-teal/[0.03]">
            <div className="font-mono text-[11px] tracking-[2px] uppercase text-qa-teal mb-2">С экосистемой</div>
            <ul className="space-y-1.5 text-text-body text-xs">
              {['AI знает контекст', 'Команды за секунды', 'Автоматизация', 'Целая армия'].map((t, i) => (
                <li key={i} className="flex gap-2"><span className="text-qa-teal">✓</span>{t}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Evolution Path */}
        <div>
          <div className="font-mono text-[12px] tracking-[2px] uppercase text-text-dim mb-4 text-center">
            Эволюция наездника
          </div>

          <div className="space-y-2">
            {LEVELS.map((lvl) => (
              <button
                key={lvl.level}
                onClick={() => setExpanded(expanded === lvl.level ? null : lvl.level)}
                className={`w-full text-left border transition-all cursor-pointer ${
                  lvl.current
                    ? `${lvl.border} bg-qa-teal/[0.05]`
                    : `${lvl.border} bg-surface/30 hover:bg-surface/50`
                }`}
              >
                {/* Header — always visible */}
                <div className="flex items-center gap-3 p-3">
                  {/* Level badge */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xl">{lvl.badge}</span>
                    <div>
                      <div className={`font-display text-[15px] ${lvl.color}`}>
                        Lv {lvl.level}: {lvl.title}
                      </div>
                      <div className="font-mono text-[10px] text-text-dim tracking-wider">{lvl.subtitle}</div>
                    </div>
                  </div>

                  {/* Current marker */}
                  {lvl.current && (
                    <span className="ml-auto font-mono text-[10px] text-qa-teal border border-qa-teal/20 px-2 py-0.5 shrink-0">
                      Сегодня
                    </span>
                  )}

                  {/* Progress line to next level */}
                  {!lvl.current && lvl.level <= 2 && (
                    <span className="ml-auto font-mono text-[10px] text-forest shrink-0">✓</span>
                  )}

                  <span className={`text-text-dim text-sm transition-transform shrink-0 ${expanded === lvl.level ? 'rotate-180' : ''}`}>
                    ▾
                  </span>
                </div>

                {/* Expanded content */}
                {expanded === lvl.level && (
                  <div className="px-3 pb-4 border-t border-border/50 pt-3" onClick={e => e.stopPropagation()}>
                    <p className="font-display italic text-text-secondary text-sm mb-3">{lvl.lore}</p>

                    <div className="space-y-2 mb-3">
                      {lvl.tools.map((tool, i) => (
                        <div key={i} className="flex gap-2">
                          <span className={`font-mono text-[11px] shrink-0 mt-0.5 ${lvl.color}`}>›</span>
                          <div>
                            <span className="text-xs text-white font-medium">{tool.name}</span>
                            <span className="text-xs text-text-secondary"> — {tool.desc}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-2 bg-black/50 border border-border/50">
                      <div className="font-mono text-[10px] text-text-dim mb-1">Пример промпта:</div>
                      <code className="font-mono text-[12px] text-qa-teal">{lvl.example}</code>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Workshop scope indicator */}
          <div className="mt-4 p-3 border border-qa-teal/15 bg-qa-teal/[0.03] text-center">
            <p className="text-xs text-text-secondary">
              <span className="text-qa-teal font-mono text-[11px]">Сегодня:</span> Lv 1 → Lv 2 (+ начало Lv 4 с MCP).
              <span className="text-text-dim"> Следующие воркшопы: Lv 3–5.</span>
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
