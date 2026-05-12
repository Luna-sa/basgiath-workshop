import PageShell from '../core/PageShell'
import { useT } from '../i18n/useT'

/**
 * Architecture overview — three layers of Claude Code on disk.
 * GLOBAL is what you carry across every project. PROJECT is what
 * lives next to one codebase. RUNTIME is what Claude reaches for
 * during a session.
 *
 * Detail slides for each component (CLAUDE.md, Commands, Agents,
 * Skills, MCP, Hooks, Plugins) follow this slide in the flow.
 */
export default function P05_TalkEvolution() {
  const t = useT()
  return (
    <PageShell pageIndex={5}>
      <div className="space-y-6">

        {/* Hero rule — the one mental model the rest of the slide
            illustrates. "Deeper wins" is what makes the layer model
            useful; the three colour cards below are just where the
            layers actually live. */}
        <div className="border-l-2 border-qa-teal pl-5 py-1 max-w-3xl">
          <p className="font-display italic text-[clamp(20px,2.6vw,28px)] text-white leading-tight mb-2">
            {t(
              'When two layers say different things, the deeper one wins.',
              'Когда два слоя противоречат - побеждает глубже.',
              'Коли два шари суперечать - перемагає глибший.'
            )}
          </p>
          <p className="text-[14px] text-text-secondary leading-[1.6]">
            {t(
              'Project beats global. Subdirectory beats project. Runtime decisions beat both. Seven moving parts on three layers — here is where each one lives.',
              'Проект побеждает глобальный. Поддиректория - проект. Runtime - оба. Семь компонентов на трёх уровнях - вот где живёт каждый.',
              'Проєкт перемагає глобальний. Піддиректорія - проєкт. Runtime - обидва. Сім компонентів на трьох рівнях - ось де живе кожен.'
            )}
          </p>
        </div>

        {/* Three layers — visual stack */}
        <div className="space-y-3">

          {/* GLOBAL */}
          <div className="relative border-l-4 border-qa-teal bg-qa-teal/[0.04] p-5">
            <div className="absolute -left-[2px] top-5 w-2 h-2 rounded-full bg-qa-teal shadow-[0_0_12px_rgba(0,229,204,0.7)]" />
            <div className="flex items-baseline gap-3 mb-3">
              <span className="font-mono text-[10px] tracking-[3px] uppercase text-qa-teal">layer · 01</span>
              <span className="font-display italic text-[24px] text-white">Global</span>
              <code className="font-mono text-[11px] text-text-dim">~/.claude/</code>
            </div>
            <p className="text-[13px] text-text-secondary italic mb-3">
              {t(
                'Lives in your home folder. Travels with you across every project, every machine where you log in.',
                'Живёт в твоей домашней папке. Едет с тобой в каждый проект и на каждую машину куда ты залогинен(а).',
                'Живе у твоїй домашній теці. Їде з тобою в кожен проєкт і на кожну машину, куди залогінений(а).'
              )}
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 text-[12px] font-mono">
              <CompChip name="CLAUDE.md" desc="spine · your persona" />
              <CompChip name="commands/" desc="/slash commands" />
              <CompChip name="agents/" desc="subagents" />
              <CompChip name="skills/" desc="installable abilities" />
              <CompChip name="plugins/" desc="bundles" />
              <CompChip name="settings.json" desc="permissions · hooks" />
            </div>
          </div>

          {/* PROJECT */}
          <div className="relative border-l-4 border-yellow-300/70 bg-yellow-300/[0.04] p-5">
            <div className="absolute -left-[2px] top-5 w-2 h-2 rounded-full bg-yellow-300 shadow-[0_0_12px_rgba(254,237,0,0.7)]" />
            <div className="flex items-baseline gap-3 mb-3">
              <span className="font-mono text-[10px] tracking-[3px] uppercase text-yellow-300/90">layer · 02</span>
              <span className="font-display italic text-[24px] text-white">Project</span>
              <code className="font-mono text-[11px] text-text-dim">{'<project>/.claude/'}</code>
            </div>
            <p className="text-[13px] text-text-secondary italic mb-3">
              {t(
                'Lives next to one codebase. Overrides the global layer. Travels with the repo when you commit it.',
                'Живёт рядом с одним кодбейзом. Перебивает глобальный слой. Едет с репо если коммитишь.',
                'Живе поруч з однією кодбазою. Перебиває глобальний шар. Їде з репо, якщо комітиш.'
              )}
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 text-[12px] font-mono">
              <CompChip name="CLAUDE.md" desc="project context" tone="yellow" />
              <CompChip name="commands/" desc="repo-only commands" tone="yellow" />
              <CompChip name="settings.json" desc="repo hooks · perms" tone="yellow" />
            </div>
          </div>

          {/* RUNTIME */}
          <div className="relative border-l-4 border-corp-pink/70 bg-corp-pink/[0.04] p-5">
            <div className="absolute -left-[2px] top-5 w-2 h-2 rounded-full bg-corp-pink shadow-[0_0_12px_rgba(255,101,190,0.7)]" />
            <div className="flex items-baseline gap-3 mb-3">
              <span className="font-mono text-[10px] tracking-[3px] uppercase text-corp-pink/90">layer · 03</span>
              <span className="font-display italic text-[24px] text-white">Runtime</span>
              <code className="font-mono text-[11px] text-text-dim">{'(during a session)'}</code>
            </div>
            <p className="text-[13px] text-text-secondary italic mb-3">
              {t(
                "Spun up when Claude starts. The bridges to the outside world and the reflexes that fire on events.",
                'Поднимается когда Claude стартует. Мосты к внешнему миру и рефлексы которые срабатывают на события.',
                'Піднімається коли Claude стартує. Мости до зовнішнього світу і рефлекси, які спрацьовують на події.'
              )}
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 text-[12px] font-mono">
              <CompChip name="MCP servers" desc="outside-world links" tone="pink" />
              <CompChip name="Hooks" desc="event triggers" tone="pink" />
            </div>
          </div>

        </div>

      </div>
    </PageShell>
  )
}

function CompChip({ name, desc, tone = 'teal' }) {
  const palette = {
    teal: { border: 'border-qa-teal/30', name: 'text-qa-teal' },
    yellow: { border: 'border-yellow-300/30', name: 'text-yellow-300' },
    pink: { border: 'border-corp-pink/30', name: 'text-corp-pink' },
  }[tone] || { border: 'border-border', name: 'text-white' }
  return (
    <div className={`px-3 py-2 border ${palette.border} bg-black/30`}>
      <div className={`${palette.name} font-semibold`}>{name}</div>
      <div className="text-[10px] text-text-dim mt-0.5">{desc}</div>
    </div>
  )
}
