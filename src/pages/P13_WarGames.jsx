import { usePersona } from '../store/usePersona'
import PageShell from '../core/PageShell'

export default function P13_WarGames() {
  const persona = usePersona()
  return (
    <PageShell pageIndex={13}>
      <div className="space-y-6 text-center">
        <div className="p-8 border" style={{ borderColor: persona.accentBorder, backgroundColor: persona.accentLight }}>
          <div className="text-4xl mb-3">🏆</div>
          <h3 className="font-display text-xl text-white mb-2">Военные игры</h3>
          <p className="text-sm text-text-secondary max-w-md mx-auto">{persona.approach.challengeFrame} Покажи свой результат.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto">
          <div className="p-5 border border-border bg-surface/30">
            <div className="font-mono text-[12px] tracking-wider uppercase mb-2" style={{ color: persona.accent }}>Покажи</div>
            <ul className="text-xs text-text-secondary space-y-1.5 text-left">
              <li>› Экосистему (7 команд + агенты)</li><li>› Результат /bug-report</li><li>› Результат /test-cases</li><li>› MCP-демо</li>
            </ul>
          </div>
          <div className="p-5 border border-border bg-surface/30">
            <div className="font-mono text-[12px] text-ember tracking-wider uppercase mb-2">Голосуй</div>
            <ul className="text-xs text-text-secondary space-y-1.5 text-left">
              <li>› Лучший баг-репорт</li><li>› Самая полная экосистема</li><li>› Самый быстрый</li><li>› Народный выбор</li>
            </ul>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
