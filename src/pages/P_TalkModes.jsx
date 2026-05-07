import PageShell from '../core/PageShell'
import { useT } from '../i18n/useT'

const MODES = [
  {
    name: 'Plan',
    key: 'Shift + Tab',
    role_en: 'Think before you act',
    role_ru: 'Думай прежде чем делать',
    when_en: 'Complex tasks. Anything you\'d want a senior to check before starting.',
    when_ru: 'Сложные задачи. Всё что хочешь чтобы сеньор проверил перед стартом.',
    color: 'var(--color-qa-teal)',
  },
  {
    name: 'Edit',
    key: 'default',
    role_en: 'Confirm each file change before it lands',
    role_ru: 'Подтверждаешь каждое изменение файла',
    when_en: 'Most work. You see the diff, accept or reject. Safest mode.',
    when_ru: 'Большая часть работы. Видишь diff, принимаешь или отклоняешь. Самый безопасный режим.',
    color: 'var(--color-qa-teal)',
  },
  {
    name: 'Yolo',
    key: '--dangerously-skip-permissions',
    role_en: 'Run without confirmation',
    role_ru: 'Пробежать без подтверждений',
    when_en: 'When you trust the task fully. Long autopilots, batch refactors. Branch off main first.',
    when_ru: 'Когда полностью доверяешь задаче. Долгие autopilot, batch refactor. Сначала branch off main.',
    color: 'var(--color-corp-red)',
  },
]

const HOTKEYS = [
  { key: 'Shift + Tab', what_en: 'Cycle modes (Edit → Plan → Edit)', what_ru: 'Переключение режима (Edit → Plan → Edit)' },
  { key: 'Esc', what_en: 'Interrupt Claude mid-action', what_ru: 'Прервать Claude посреди действия' },
  { key: 'Ctrl + G', what_en: 'Open the plan in $EDITOR (vim/nano/code)', what_ru: 'Открыть план в $EDITOR (vim/nano/code)' },
  { key: 'Cmd + L', what_en: 'Clear terminal screen (does NOT clear context)', what_ru: 'Очистить экран (НЕ очищает контекст)' },
  { key: '/clear', what_en: 'Clear conversation context (CLAUDE.md stays)', what_ru: 'Очистить контекст разговора (CLAUDE.md остаётся)' },
  { key: '/compact', what_en: 'Summarize older context to free tokens', what_ru: 'Свернуть старый контекст чтобы освободить токены' },
  { key: '/help', what_en: 'List all available slash commands', what_ru: 'Список всех slash-команд' },
  { key: '/plugin', what_en: 'Browse and install plugins / skills', what_ru: 'Найти и поставить plugins / skills' },
]

export default function P_TalkModes() {
  const t = useT()
  return (
    <PageShell pageIndex={6}>
      <div className="space-y-6">

        <p className="text-[15px] text-text-body leading-relaxed max-w-3xl">
          {t(
            "Три режима работы и горстка хоткеев — это вся «механика управления» Claude Code. Освой Shift+Tab и /clear, остальное прорастёт.",
            "Три режима работы и горстка хоткеев — это вся «механика управления» Claude Code. Освой Shift+Tab и /clear, остальное прорастёт."
          )}
        </p>

        {/* Modes */}
        <div>
          <p className="font-mono text-[11px] tracking-[3px] uppercase text-text-dim mb-3">
            ◆ {t('Three modes', 'Три режима')}
          </p>
          <div className="grid md:grid-cols-3 gap-3">
            {MODES.map(m => (
              <div key={m.name} className="p-4 border border-border bg-surface/40">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="font-display italic text-2xl text-white">{m.name}</span>
                  <span className="font-mono text-[10px] tracking-[1.5px] uppercase" style={{ color: m.color }}>{m.key}</span>
                </div>
                <p className="text-[14px] text-text-body italic mb-2" style={{ color: m.color }}>
                  {t(m.role_en, m.role_ru)}
                </p>
                <p className="text-[12px] text-text-secondary leading-relaxed">
                  {t(m.when_en, m.when_ru)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Hotkeys + commands */}
        <div>
          <p className="font-mono text-[11px] tracking-[3px] uppercase text-text-dim mb-3">
            ◆ {t('Hotkeys & built-in commands', 'Хоткеи и встроенные команды')}
          </p>
          <div className="border border-border">
            {HOTKEYS.map((h, i) => (
              <div
                key={h.key}
                className={`flex items-baseline gap-4 p-3 ${
                  i % 2 === 0 ? 'bg-surface/30' : 'bg-bg/40'
                }`}
              >
                <code className="font-mono text-[13px] text-qa-teal min-w-[170px]">{h.key}</code>
                <span className="text-[13px] text-text-body">{t(h.what_en, h.what_ru)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tip */}
        <div className="border border-qa-teal/20 bg-qa-teal/[0.03] p-4">
          <p className="text-[13px] text-text-body leading-relaxed">
            <span className="font-mono text-[10px] tracking-[2px] uppercase text-qa-teal mr-2">tip</span>
            {t(
              "Перед сложным запросом — Shift+Tab → Plan → попроси сначала план, проверь его, потом Shift+Tab обратно → исполнение. Это основная гигиена.",
              "Перед сложным запросом — Shift+Tab → Plan → попроси сначала план, проверь его, потом Shift+Tab обратно → исполнение. Это основная гигиена."
            )}
          </p>
        </div>

      </div>
    </PageShell>
  )
}
