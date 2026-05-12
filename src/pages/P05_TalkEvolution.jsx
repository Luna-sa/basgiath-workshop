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

        {/* Three layers — visual stack. One brand colour (teal),
            tonal contrast on borders to separate the three. Italic
            stays only on the hero rule above. Removed: glowing
            decoration dots, "layer · 0N" tier labels, italic on
            card prose. */}
        <div className="space-y-3">

          {/* GLOBAL — primary layer, full teal border */}
          <div className="border-l-2 border-qa-teal bg-qa-teal/[0.04] p-5">
            <div className="flex items-baseline gap-3 mb-3 flex-wrap">
              <span className="font-display text-[26px] text-white">Global</span>
              <code className="font-mono text-[11px] text-text-dim">~/.claude/</code>
            </div>
            <p className="text-[13px] text-text-secondary mb-3 max-w-2xl">
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

          {/* PROJECT — secondary, muted teal */}
          <div className="border-l-2 border-qa-teal/40 bg-qa-teal/[0.02] p-5">
            <div className="flex items-baseline gap-3 mb-3 flex-wrap">
              <span className="font-display text-[26px] text-white">Project</span>
              <code className="font-mono text-[11px] text-text-dim">{'<project>/.claude/'}</code>
            </div>
            <p className="text-[13px] text-text-secondary mb-3 max-w-2xl">
              {t(
                'Lives next to one codebase. Overrides the global layer. Travels with the repo when you commit it.',
                'Живёт рядом с одним кодбейзом. Перебивает глобальный слой. Едет с репо если коммитишь.',
                'Живе поруч з однією кодбазою. Перебиває глобальний шар. Їде з репо, якщо комітиш.'
              )}
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 text-[12px] font-mono">
              <CompChip name="CLAUDE.md" desc="project context" />
              <CompChip name="commands/" desc="repo-only commands" />
              <CompChip name="settings.json" desc="repo hooks · perms" />
            </div>
          </div>

          {/* RUNTIME — tertiary, plain border. Pink only on the
              two chips that have something fundamentally different
              about them (they're processes, not files). */}
          <div className="border-l-2 border-border bg-surface/30 p-5">
            <div className="flex items-baseline gap-3 mb-3 flex-wrap">
              <span className="font-display text-[26px] text-white">Runtime</span>
              <code className="font-mono text-[11px] text-text-dim">{'(during a session)'}</code>
            </div>
            <p className="text-[13px] text-text-secondary mb-3 max-w-2xl">
              {t(
                "Spun up when Claude starts. The bridges to the outside world and the reflexes that fire on events.",
                'Поднимается когда Claude стартует. Мосты к внешнему миру и рефлексы которые срабатывают на события.',
                'Піднімається коли Claude стартує. Мости до зовнішнього світу і рефлекси, які спрацьовують на події.'
              )}
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 text-[12px] font-mono">
              <CompChip name="MCP servers" desc="outside-world links" />
              <CompChip name="Hooks" desc="event triggers" />
            </div>
          </div>

        </div>

      </div>
    </PageShell>
  )
}

function CompChip({ name, desc }) {
  return (
    <div className="px-3 py-2 border border-border bg-black/30">
      <div className="text-qa-teal font-semibold">{name}</div>
      <div className="text-[10px] text-text-dim mt-0.5 font-sans">{desc}</div>
    </div>
  )
}
