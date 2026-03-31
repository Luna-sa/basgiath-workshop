import PageShell from '../core/PageShell'
import NarrativeBlock from '../components/NarrativeBlock'
import { NARRATIVE } from '../data/narrative'

export default function P05_Opening() {
  return (
    <PageShell pageIndex={5}>
      <div className="space-y-8">
        <NarrativeBlock text={NARRATIVE.opening.text} speed={30} />
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: '🐉', title: 'Связать дракона', desc: 'Создать CLAUDE.md' },
            { icon: '⚔️', title: 'Освоить приёмы', desc: 'Slash-команды для QA' },
            { icon: '🎯', title: 'Совершить полёт', desc: 'Практика на реальном коде' },
          ].map(item => (
            <div key={item.title} className="p-5 border border-border bg-surface/30 text-center">
              <div className="text-2xl mb-3">{item.icon}</div>
              <h3 className="font-display text-sm text-white mb-1">{item.title}</h3>
              <p className="text-xs text-text-dim">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  )
}
