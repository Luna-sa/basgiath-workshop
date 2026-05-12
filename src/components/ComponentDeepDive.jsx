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
      <div className="space-y-8">

        {/* HERO — italic is reserved for the one display element.
            Eyebrow stays mono caps; tagline is plain body, not italic.
            Path is rendered inline-below the name, not on the same
            baseline, to break the "everything on one row" cluster. */}
        <div>
          <div className="font-mono text-[10px] tracking-[3px] uppercase text-qa-teal mb-2">
            {data.eyebrow}
          </div>
          <h2 className="font-display italic text-[clamp(36px,4.5vw,48px)] text-white leading-none mb-2">
            {data.name}
          </h2>
          <code className="font-mono text-[11px] text-text-dim block mb-5">{data.path}</code>
          <p className="text-[clamp(15px,1.8vw,18px)] text-text-secondary leading-[1.6] max-w-3xl">
            {t(data.tagline_en, data.tagline_ru, data.tagline_uk)}
          </p>
        </div>

        {/* WHAT IT IS — no section glyph, just a one-word eyebrow that
            doubles as the section break. Section title now mono caps,
            understated. */}
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

        {/* WHEN TO USE — restrained list. No glyph per bullet; instead
            use a thin left rule so each item reads as a separate
            heuristic. */}
        {data.when && (
          <Section title={t('When to reach for it', 'Когда брать', 'Коли брати')}>
            <ul className="space-y-3 list-none">
              {data.when.map((line, i) => (
                <li key={i} className="border-l border-qa-teal/30 pl-4 text-[13.5px] text-text-body leading-[1.65]">
                  {t(line.en, line.ru, line.uk)}
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
        {title}
      </div>
      {children}
    </section>
  )
}
