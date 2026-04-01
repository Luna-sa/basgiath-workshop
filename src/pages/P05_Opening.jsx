import PageShell from '../core/PageShell'
import NarrativeBlock from '../components/NarrativeBlock'
import { usePersona } from '../store/usePersona'
import { useWorkshopStore } from '../store/workshopStore'
import { NARRATIVE } from '../data/narrative'

export default function P05_Opening() {
  const persona = usePersona()
  const name = useWorkshopStore(s => s.user.name)

  return (
    <PageShell pageIndex={5}>
      <div className="space-y-6">
        {/* Personalized greeting */}
        <div className="p-5 border border-l-[3px] bg-surface/50" style={{ borderColor: persona.accentBorder, borderLeftColor: persona.accent }}>
          <div className="font-mono text-[11px] tracking-[2px] uppercase mb-2" style={{ color: persona.accent }}>
            {name ? `${name}, ` : ''}Твой путь начинается
          </div>
          <p className="font-display italic text-text-body text-base leading-relaxed">
            {persona.voice.greeting}
          </p>
        </div>

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
