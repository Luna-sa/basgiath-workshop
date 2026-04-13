import PageShell from '../core/PageShell'

export default function P04_TalkIntro() {
  return (
    <PageShell pageIndex={4}>
      <div className="space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 border border-border border-l-[3px] border-l-corp-red bg-surface/50">
            <div className="font-mono text-[12px] tracking-[2px] uppercase text-corp-red mb-3">Без AI</div>
            <ul className="space-y-2 text-text-secondary text-sm">
              {['Copy-paste в ChatGPT каждый раз', 'AI не знает проект', 'Баг-репорты руками', 'Тест-кейсы руками', 'Ревью кода — глазами'].map((t, i) => (
                <li key={i} className="flex gap-2"><span className="text-corp-red/60">✕</span>{t}</li>
              ))}
            </ul>
          </div>
          <div className="p-5 border border-border border-l-[3px] border-l-qa-teal bg-qa-teal/[0.03]">
            <div className="font-mono text-[12px] tracking-[2px] uppercase text-qa-teal mb-3">С QA-экосистемой</div>
            <ul className="space-y-2 text-text-body text-sm">
              {['7 команд — любой отчёт за секунды', '4 агента — ревью, тесты, безопасность, триаж', 'MCP — AI сам тестирует сайт', 'CLAUDE.md — AI знает твой контекст', 'Одна установка — работает каждый день'].map((t, i) => (
                <li key={i} className="flex gap-2"><span className="text-qa-teal">✓</span>{t}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="p-4 border border-border bg-surface/30 text-center">
          <p className="text-sm text-text-secondary">Через 5 минут вы установите всё это одной командой.</p>
        </div>
      </div>
    </PageShell>
  )
}
