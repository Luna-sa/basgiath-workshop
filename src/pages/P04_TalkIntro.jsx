import PageShell from '../core/PageShell'

export default function P04_TalkIntro() {
  return (
    <PageShell pageIndex={4}>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Without AI */}
        <div className="p-6 sm:p-8 border border-border border-l-[4px] border-l-corp-red bg-surface/50 hover:bg-surface/70 transition-colors">
          <div className="font-mono text-[14px] tracking-[3px] uppercase text-corp-red mb-6">Без AI</div>
          <ul className="space-y-4">
            {[
              'Copy-paste в ChatGPT каждый раз',
              'AI не знает твой проект',
              'Баг-репорты руками',
              'Тест-кейсы руками',
              'Ревью кода — только глазами',
            ].map((t, i) => (
              <li key={i} className="flex gap-3 text-[18px] text-text-secondary">
                <span className="text-corp-red/60 shrink-0">✕</span>{t}
              </li>
            ))}
          </ul>
        </div>

        {/* With ecosystem */}
        <div className="p-6 sm:p-8 border border-border border-l-[4px] border-l-qa-teal bg-qa-teal/[0.03] hover:bg-qa-teal/[0.06] transition-colors">
          <div className="font-mono text-[14px] tracking-[3px] uppercase text-qa-teal mb-6">С QA-экосистемой</div>
          <ul className="space-y-4">
            {[
              '7 команд — отчёт за секунды',
              '4 агента — ревью, тесты, безопасность',
              'MCP — AI сам тестирует сайт',
              'CLAUDE.md — AI знает контекст',
              'Одна установка на всё',
            ].map((t, i) => (
              <li key={i} className="flex gap-3 text-[18px] text-text-body">
                <span className="text-qa-teal shrink-0">✓</span>{t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-[20px] text-text-secondary">
          Через 5 минут вы установите всё это <strong className="text-white">одной командой</strong>.
        </p>
      </div>
    </PageShell>
  )
}
