import PageShell from '../core/PageShell'
import { useT } from '../i18n/useT'

const MODES = [
  {
    name: 'Plan',
    key: 'Shift + Tab',
    role_en: 'Think before you act',
    role_ru: 'Думай прежде чем делать',
    role_uk: 'Думай перш ніж робити',
    when_en: 'Complex tasks. Anything you\'d want a senior to check before starting. Claude proposes a plan; you approve before any file changes happen.',
    when_ru: 'Сложные задачи. Всё что хочешь чтобы сеньор проверил перед стартом. Claude предлагает план; ты одобряешь до того как тронут файлы.',
    when_uk: 'Складні задачі. Усе що хочеш аби сеньйор перевірив перед стартом. Claude пропонує план; ти схвалюєш до того як зачеплять файли.',
    color: 'var(--color-qa-teal)',
  },
  {
    name: 'Auto',
    key: 'default',
    role_en: 'Sandbox-safe actions run; risky actions confirm',
    role_ru: 'Безопасные действия идут; рискованные — подтверждаешь',
    role_uk: 'Безпечні дії йдуть; ризиковані — підтверджуєш',
    when_en: 'Current default since spring 2026. Safe reads + edits in trusted paths auto-approved; destructive ops (rm, push, delete) ask first. Best balance of speed + safety.',
    when_ru: 'Дефолт с весны 2026. Безопасные чтения + изменения в trusted-путях идут автоматом; деструктивное (rm, push, удаление) спросит. Лучший баланс скорости и безопасности.',
    when_uk: 'Дефолт з весни 2026. Безпечні читання + зміни у trusted-шляхах ідуть автоматом; деструктивне (rm, push, видалення) спитає. Найкращий баланс швидкості та безпеки.',
    color: 'var(--color-qa-teal)',
  },
  {
    name: 'Edit',
    key: 'Shift + Tab',
    role_en: 'Confirm every file change before it lands',
    role_ru: 'Подтверждаешь каждое изменение файла',
    role_uk: 'Підтверджуєш кожну зміну файлу',
    when_en: 'Strict mode. You see every diff and accept or reject. Slower, but unbeatable if you need to learn the codebase or review by hand.',
    when_ru: 'Строгий режим. Видишь каждый diff и одобряешь/отклоняешь. Медленнее, но незаменимо когда учишь кодбазу или ревьюишь руками.',
    when_uk: 'Суворий режим. Бачиш кожен diff і схвалюєш/відхиляєш. Повільніше, але незамінне коли вчиш кодбазу або ревʼюєш руками.',
    color: 'var(--color-qa-teal)',
  },
  {
    name: 'Yolo',
    key: '--dangerously-skip-permissions',
    role_en: 'Run without confirmation',
    role_ru: 'Пробежать без подтверждений',
    role_uk: 'Пробігти без підтверджень',
    when_en: 'When you fully trust the task. Long autopilots, batch refactors, overnight scripts. Branch off main first — no safety net.',
    when_ru: 'Когда полностью доверяешь задаче. Долгие autopilot, batch refactor, ночные скрипты. Сначала branch off main — страховки нет.',
    when_uk: 'Коли повністю довіряєш задачі. Довгі autopilot, batch refactor, нічні скрипти. Спочатку branch off main — страховки нема.',
    color: 'var(--color-corp-red)',
  },
]

const HOTKEYS = [
  { key: 'Shift + Tab', what_en: 'Cycle modes (Auto → Plan → Edit → Auto)', what_ru: 'Переключение режимов (Auto → Plan → Edit → Auto)', what_uk: 'Перемикання режимів (Auto → Plan → Edit → Auto)' },
  { key: 'Esc', what_en: 'Interrupt Claude mid-action', what_ru: 'Прервать Claude посреди действия', what_uk: 'Перервати Claude посеред дії' },
  { key: 'Ctrl + G', what_en: 'Open the plan in $EDITOR (vim/nano/code)', what_ru: 'Открыть план в $EDITOR (vim/nano/code)', what_uk: 'Відкрити план у $EDITOR (vim/nano/code)' },
  { key: 'Cmd + L', what_en: 'Clear terminal screen (does NOT clear context)', what_ru: 'Очистить экран (НЕ очищает контекст)', what_uk: 'Очистити екран (НЕ очищає контекст)' },
  { key: '/clear', what_en: 'Clear conversation context (CLAUDE.md stays)', what_ru: 'Очистить контекст разговора (CLAUDE.md остаётся)', what_uk: 'Очистити контекст розмови (CLAUDE.md залишається)' },
  { key: '/compact', what_en: 'Summarize older context to free tokens', what_ru: 'Свернуть старый контекст чтобы освободить токены', what_uk: 'Згорнути старий контекст аби звільнити токени' },
  { key: '/help', what_en: 'List all available slash commands', what_ru: 'Список всех slash-команд', what_uk: 'Список усіх slash-команд' },
  { key: '/plugin', what_en: 'Browse and install plugins / skills', what_ru: 'Найти и поставить plugins / skills', what_uk: 'Знайти і поставити plugins / skills' },
]

export default function P_TalkModes() {
  const t = useT()
  return (
    <PageShell pageIndex={6}>
      <div className="space-y-6">

        <p className="text-[15px] text-text-body leading-relaxed max-w-3xl">
          {t(
            'Four working modes and a handful of hotkeys — that\'s the entire control surface of Claude Code. Get fluent with Shift+Tab and /clear, the rest grows on you.',
            'Четыре рабочих режима и горстка хоткеев — это вся «механика управления» Claude Code. Освой Shift+Tab и /clear, остальное прорастёт.',
            'Чотири робочих режими і жменя хоткеїв — це вся «механіка управління» Claude Code. Освій Shift+Tab і /clear, решта проросте.'
          )}
        </p>

        {/* Modes */}
        <div>
          <p className="font-mono text-[11px] tracking-[3px] uppercase text-text-dim mb-3">
            ◆ {t('Four modes', 'Четыре режима', 'Чотири режими')}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {MODES.map(m => {
              const isDefault = m.key === 'default'
              return (
                <div
                  key={m.name}
                  className={`p-4 border bg-surface/40 ${
                    isDefault ? 'border-qa-teal/60 bg-qa-teal/[0.04]' : 'border-border'
                  }`}
                >
                  <div className="flex items-baseline justify-between mb-2 flex-wrap gap-1">
                    <span className="font-display italic text-2xl text-white">{m.name}</span>
                    {isDefault && (
                      <span className="font-mono text-[9px] tracking-[2px] uppercase text-qa-teal">default</span>
                    )}
                  </div>
                  <div className="font-mono text-[10px] tracking-[1.5px] uppercase mb-3" style={{ color: m.color }}>
                    {m.key}
                  </div>
                  <p className="text-[14px] text-text-body italic mb-2" style={{ color: m.color }}>
                    {t(m.role_en, m.role_ru, m.role_uk)}
                  </p>
                  <p className="text-[12px] text-text-secondary leading-relaxed">
                    {t(m.when_en, m.when_ru, m.when_uk)}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* When to use which mode */}
        <div>
          <p className="font-mono text-[11px] tracking-[3px] uppercase text-text-dim mb-3">
            ◆ {t('When to use which mode', 'Когда какой режим', 'Коли який режим')}
          </p>
          <div className="border border-border">
            {[
              { task_en: 'Writing a test plan for a new feature', task_ru: 'Пишешь тест-план для новой фичи', task_uk: 'Пишеш тест-план для нової фічі', mode: 'Plan' },
              { task_en: 'Editing test data, fixtures, helper files', task_ru: 'Правишь тестовые данные, фикстуры, хелперы', task_uk: 'Правиш тестові дані, фікстури, хелпери', mode: 'Auto' },
              { task_en: 'Refactoring shared fixtures across many tests', task_ru: 'Рефакторишь общие фикстуры по многим тестам', task_uk: 'Рефакториш спільні фікстури по багатьох тестах', mode: 'Edit' },
              { task_en: 'Overnight bulk-rename of 200 files on a branch', task_ru: 'Ночной массовый rename 200 файлов в ветке', task_uk: 'Нічний масовий rename 200 файлів у гілці', mode: 'Yolo' },
            ].map((row, i) => (
              <div key={row.task_en} className={`flex items-baseline gap-4 p-3 ${i % 2 === 0 ? 'bg-surface/30' : 'bg-bg/40'}`}>
                <span className="text-[13px] text-text-body flex-1">{t(row.task_en, row.task_ru, row.task_uk)}</span>
                <code className="font-mono text-[12px] text-qa-teal min-w-[60px] text-right">{row.mode}</code>
              </div>
            ))}
          </div>
        </div>

        {/* Hotkeys + commands */}
        <div>
          <p className="font-mono text-[11px] tracking-[3px] uppercase text-text-dim mb-3">
            ◆ {t('Hotkeys & built-in commands', 'Хоткеи и встроенные команды', 'Хоткеї та вбудовані команди')}
          </p>
          <div className="mb-3 text-[12px] text-text-secondary italic">
            {t(
              'Right now: open Claude Code, hit Shift+Tab twice, watch the indicator change.',
              'Прямо сейчас: открой Claude Code, нажми Shift+Tab дважды, посмотри как меняется индикатор.',
              'Прямо зараз: відкрий Claude Code, натисни Shift+Tab двічі, подивись як змінюється індикатор.'
            )}
          </div>
          <div className="border border-border">
            {HOTKEYS.map((h, i) => (
              <div
                key={h.key}
                className={`flex items-baseline gap-4 p-3 ${
                  i % 2 === 0 ? 'bg-surface/30' : 'bg-bg/40'
                }`}
              >
                <code className="font-mono text-[13px] text-qa-teal min-w-[170px]">{h.key}</code>
                <span className="text-[13px] text-text-body">{t(h.what_en, h.what_ru, h.what_uk)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tip */}
        <div className="border border-qa-teal/20 bg-qa-teal/[0.03] p-4">
          <p className="text-[13px] text-text-body leading-relaxed">
            <span className="font-mono text-[10px] tracking-[2px] uppercase text-qa-teal mr-2">tip</span>
            {t(
              'For anything complex — Shift+Tab to Plan first. Read the plan, fix what\'s off, Shift+Tab back to Auto, execute. This is the basic hygiene.',
              'Перед сложным запросом — Shift+Tab → Plan → проверь план, исправь что не так, Shift+Tab обратно → Auto, исполняй. Это основная гигиена.',
              'Перед складним запитом — Shift+Tab → Plan → перевір план, виправ що не так, Shift+Tab назад → Auto, виконуй. Це основна гігієна.'
            )}
          </p>
        </div>

      </div>
    </PageShell>
  )
}
