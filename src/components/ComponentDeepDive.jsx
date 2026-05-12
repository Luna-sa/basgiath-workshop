import PageShell from '../core/PageShell'
import { useT } from '../i18n/useT'

/**
 * Generic deep-dive layout for one Claude Code component
 * (CLAUDE.md, Commands, Agents, Skills, MCP, Hooks, Plugins).
 *
 * Sections:
 *   - HERO         eyebrow + name + tagline + 3 "at-a-glance" stats
 *   - WHAT IS IT   prose (1-2 paragraphs)
 *   - STRUCTURE    file path + tree
 *   - ANATOMY      bullet list of fields/components
 *   - EXAMPLE      labelled code block
 *   - WHEN TO REACH FOR IT  3-4 short bullets
 */
export default function ComponentDeepDive({ pageIndex, data }) {
  const t = useT()
  const lang = useT.lang
  // useT returns the t() function; we get locale via the helpers it
  // accepts (en, ru, uk strings). Use t() for each piece.

  return (
    <PageShell pageIndex={pageIndex}>
      <div className="space-y-6">

        {/* HERO */}
        <div>
          <div className="font-mono text-[10px] tracking-[3px] uppercase text-qa-teal mb-2">
            ◆ {data.eyebrow}
          </div>
          <div className="flex items-baseline gap-4 flex-wrap mb-3">
            <h2 className="font-display italic text-[clamp(32px,4vw,42px)] text-white leading-none">
              {data.name}
            </h2>
            <code className="font-mono text-[12px] text-text-dim">{data.path}</code>
          </div>
          <p className="font-display italic text-[clamp(16px,2vw,20px)] text-text-secondary leading-relaxed max-w-3xl">
            {t(data.tagline_en, data.tagline_ru, data.tagline_uk)}
          </p>
        </div>

        {/* STATS row */}
        {data.stats && (
          <div className="grid grid-cols-3 gap-3">
            {data.stats.map(s => (
              <div key={s.label} className="border border-border bg-surface/40 p-3 text-center">
                <div className="font-display italic text-[22px] text-qa-teal">{s.value}</div>
                <div className="font-mono text-[9.5px] tracking-[1.5px] uppercase text-text-dim mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* WHAT IS IT */}
        <Section title={t('What it is', 'Что это', 'Що це')}>
          <p className="text-[14px] text-text-body leading-[1.7]">
            {t(data.what_en, data.what_ru, data.what_uk)}
          </p>
        </Section>

        {/* STRUCTURE / TREE */}
        {data.structure && (
          <Section title={t('Where it lives', 'Где живёт', 'Де живе')}>
            <pre className="bg-black/60 border border-border px-4 py-3 text-[12px] font-mono text-text-body leading-relaxed whitespace-pre-wrap overflow-x-auto">{data.structure}</pre>
          </Section>
        )}

        {/* ANATOMY */}
        {data.anatomy && (
          <Section title={t('Anatomy', 'Анатомия', 'Анатомія')}>
            <ul className="space-y-1.5 text-[13.5px] text-text-body list-none">
              {data.anatomy.map((row, i) => (
                <li key={i} className="flex items-baseline gap-3">
                  <span className="font-mono text-[11px] text-qa-teal shrink-0 min-w-[110px]">{row.field}</span>
                  <span className="leading-relaxed">{t(row.desc_en, row.desc_ru, row.desc_uk)}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* EXAMPLE */}
        {data.example && (
          <Section title={t('Example', 'Пример', 'Приклад')}>
            <div className="border border-qa-teal/30 bg-black overflow-hidden">
              {data.example_label && (
                <div className="bg-qa-teal/[0.08] px-3 py-1.5 border-b border-qa-teal/30 font-mono text-[10px] tracking-[2px] uppercase text-qa-teal">
                  {data.example_label}
                </div>
              )}
              <pre className="px-4 py-3 text-[12px] font-mono text-text-body leading-relaxed whitespace-pre-wrap overflow-x-auto">{data.example}</pre>
            </div>
          </Section>
        )}

        {/* WHEN TO USE */}
        {data.when && (
          <Section title={t('When to reach for it', 'Когда брать', 'Коли брати')}>
            <ul className="space-y-1.5 text-[13.5px] text-text-body list-none">
              {data.when.map((line, i) => (
                <li key={i} className="flex items-baseline gap-2">
                  <span className="text-qa-teal mt-0.5 shrink-0">◇</span>
                  <span className="leading-relaxed">{t(line.en, line.ru, line.uk)}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

      </div>
    </PageShell>
  )
}

function Section({ title, children }) {
  return (
    <section>
      <div className="font-mono text-[10px] tracking-[2.5px] uppercase text-qa-teal mb-2.5">
        ◆ {title}
      </div>
      {children}
    </section>
  )
}
