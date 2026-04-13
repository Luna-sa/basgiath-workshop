import { useState } from 'react'
import PageShell from '../core/PageShell'

const LEVELS = [
  { level: 1, badge: '🪶', title: 'Кадет', subtitle: 'Базовый чат', tools: ['Просто пишешь вопрос AI', 'Tab-автодополнение'], color: 'text-text-dim', border: 'border-border' },
  { level: 2, badge: '🐉', title: 'Наездник', subtitle: 'Конфиги и команды', tools: ['CLAUDE.md — AI знает контекст', 'Slash-команды — шорткаты', '@-mentions — указываешь на файлы'], color: 'text-qa-teal', border: 'border-qa-teal/30', current: true },
  { level: 3, badge: '⚔️', title: 'Боец', subtitle: 'Plan mode и skills', tools: ['AI думает перед действием', 'Skills — auto-workflows', 'Multi-file изменения'], color: 'text-ember', border: 'border-ember/30' },
  { level: 4, badge: '👑', title: 'Командир', subtitle: 'MCP и агенты', tools: ['AI открывает браузер и тестирует', 'Hooks — автоматические правила', 'Sub-agents делегируют подзадачи'], color: 'text-personal-pink', border: 'border-personal-pink/30' },
  { level: 5, badge: '🏛️', title: 'Архитектор', subtitle: 'Оркестрация', tools: ['Agent Teams — параллельная работа', 'Headless — AI работает автономно', 'Automations — расписание задач'], color: 'text-qa-teal', border: 'border-qa-teal/50' },
]

export default function P05_TalkEvolution() {
  const [expanded, setExpanded] = useState(2)

  return (
    <PageShell pageIndex={5}>
      <div className="space-y-2">
        {LEVELS.map(lvl => (
          <button key={lvl.level} onClick={() => setExpanded(expanded === lvl.level ? null : lvl.level)}
            className={`w-full text-left border transition-all cursor-pointer ${lvl.current ? `${lvl.border} bg-qa-teal/[0.05]` : `${lvl.border} bg-surface/30`}`}>
            <div className="flex items-center gap-3 p-3">
              <span className="text-xl">{lvl.badge}</span>
              <div>
                <div className={`font-display text-[15px] ${lvl.color}`}>Lv {lvl.level}: {lvl.title}</div>
                <div className="font-mono text-[11px] text-text-dim">{lvl.subtitle}</div>
              </div>
              {lvl.current && <span className="ml-auto font-mono text-[11px] text-qa-teal border border-qa-teal/20 px-2 py-0.5">Сегодня</span>}
              <span className={`text-text-dim text-sm transition-transform ${expanded === lvl.level ? 'rotate-180' : ''}`}>▾</span>
            </div>
            {expanded === lvl.level && (
              <div className="px-3 pb-3 border-t border-border/50 pt-2" onClick={e => e.stopPropagation()}>
                {lvl.tools.map((t, i) => (
                  <div key={i} className="flex gap-2 mb-1">
                    <span className={`font-mono text-[11px] shrink-0 mt-0.5 ${lvl.color}`}>›</span>
                    <span className="text-xs text-text-secondary">{t}</span>
                  </div>
                ))}
              </div>
            )}
          </button>
        ))}
        <div className="mt-3 p-3 border border-qa-teal/15 bg-qa-teal/[0.03] text-center">
          <p className="text-xs text-text-secondary">
            <span className="text-qa-teal font-mono text-[11px]">Сегодня:</span> Lv 1 → Lv 2, начало Lv 4 с MCP
          </p>
        </div>
      </div>
    </PageShell>
  )
}
