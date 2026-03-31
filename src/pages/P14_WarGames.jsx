import PageShell from '../core/PageShell'

export default function P14_WarGames() {
  return (
    <PageShell pageIndex={14}>
      <div className="space-y-8 text-center">
        <div className="p-8 border border-qa-teal/20 bg-qa-teal/[0.03]">
          <div className="text-4xl mb-3">🏆</div>
          <h3 className="font-display text-xl text-white mb-2">Военные игры</h3>
          <p className="text-sm text-text-secondary max-w-md mx-auto">Добровольцы показывают результаты. Аудитория голосует.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto">
          <div className="p-5 border border-border bg-surface/30">
            <div className="font-mono text-[12px] text-qa-teal tracking-wider uppercase mb-2">Покажи</div>
            <ul className="text-xs text-text-dim space-y-1.5 text-left">
              <li>› CLAUDE.md</li><li>› Результат /bug-report</li><li>› Результат /test-cases</li><li>› Найденный баг</li>
            </ul>
          </div>
          <div className="p-5 border border-border bg-surface/30">
            <div className="font-mono text-[12px] text-ember tracking-wider uppercase mb-2">Голосуй</div>
            <ul className="text-xs text-text-dim space-y-1.5 text-left">
              <li>› Лучший баг-репорт</li><li>› Креативный CLAUDE.md</li><li>› Самый быстрый</li><li>› Народный выбор</li>
            </ul>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
