import { useState } from 'react'
import PageShell from '../core/PageShell'
import { useT } from '../i18n/useT'
import { GEM_BY_ID } from '../data/gems'
import { GemVisual } from './gems/Visuals'

// ── helpers ──────────────────────────────────────────────────────

function CopyButton({ text, label }) {
  const [copied, setCopied] = useState(false)
  const handle = async () => {
    try { await navigator.clipboard.writeText(text) }
    catch {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta); ta.select()
      document.execCommand('copy'); document.body.removeChild(ta)
    }
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handle}
      className={`font-mono text-[11px] tracking-[2px] uppercase font-semibold px-3 py-2 transition-all cursor-pointer ${
        copied ? 'bg-yellow-300 text-black' : 'bg-qa-teal text-black hover:shadow-[0_0_18px_rgba(0,229,204,0.4)]'
      }`}
      style={copied ? { backgroundColor: '#FEED00' } : {}}
    >
      {copied ? '✓ copied' : label}
    </button>
  )
}

/** Render text with **bold** → <strong>, drop forced \n inside paragraphs. */
function RichParagraph({ children }) {
  const parts = children.split(/(\*\*[^*]+\*\*)/g)
  return (
    <p className="text-[15.5px] text-text-body leading-[1.75] mb-4 last:mb-0">
      {parts.map((p, i) => {
        if (p.startsWith('**') && p.endsWith('**')) {
          return <strong key={i} className="text-white font-semibold">{p.slice(2, -2)}</strong>
        }
        return <span key={i}>{p.replace(/\n/g, ' ')}</span>
      })}
    </p>
  )
}

/** Body: split on blank lines into paragraphs, render fenced ``` blocks as <pre>. */
function GemBody({ text }) {
  // Tokenise — odd indexes are code blocks
  const tokens = text.split(/```([\s\S]*?)```/)
  return (
    <div>
      {tokens.map((t, i) => {
        if (i % 2 === 1) {
          return (
            <pre
              key={i}
              className="font-mono text-[13px] text-qa-teal bg-black border border-qa-teal/20 px-4 py-3 my-4 leading-relaxed overflow-x-auto"
            >
              {t.trim()}
            </pre>
          )
        }
        return t.split(/\n\s*\n/).map((para, j) => {
          if (!para.trim()) return null
          return <RichParagraph key={`${i}-${j}`}>{para.trim()}</RichParagraph>
        })
      })}
    </div>
  )
}

/** Stats strip — 3 columns with big values. */
function StatsStrip({ stats }) {
  if (!stats?.length) return null
  return (
    <div className="grid grid-cols-3 gap-0 border border-border bg-black/40">
      {stats.map((s, i) => (
        <div
          key={i}
          className={`px-4 py-4 text-center ${
            i < stats.length - 1 ? 'border-r border-border' : ''
          } ${s.accent ? 'bg-qa-teal/[0.06]' : ''}`}
        >
          <div className={`font-display italic text-[26px] leading-none mb-1 ${
            s.accent ? 'text-qa-teal' : 'text-white'
          }`}>
            {s.value}
          </div>
          <div className="font-mono text-[9.5px] tracking-[1.5px] uppercase text-text-dim">
            {s.label}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── main ─────────────────────────────────────────────────────────

export default function GemSlide({ gemId, pageIndex, position }) {
  const t = useT()
  const gem = GEM_BY_ID[gemId]
  if (!gem) return null

  const useCases = t(gem.use_cases_en, gem.use_cases_ru) || []
  const pullQuote = gem.pullQuote_en ? t(gem.pullQuote_en, gem.pullQuote_ru) : null
  const [posCurrent, posTotal] = (position || '').split('/').map(s => s.trim())

  return (
    <PageShell pageIndex={pageIndex}>
      <div className="space-y-8">

        {/* ═══════════════════════════════════════════════════════
            HERO
        ═══════════════════════════════════════════════════════ */}
        <div className="flex items-start gap-5">
          {/* Big position cipher */}
          {position && (
            <div className="hidden sm:flex flex-col items-center justify-center pt-1 shrink-0">
              <div className="font-display italic text-[64px] leading-none text-qa-teal/80">
                {posCurrent}
              </div>
              <div className="w-8 h-px bg-qa-teal/30 my-1.5" />
              <div className="font-mono text-[10px] tracking-[2px] text-text-dim">
                of {posTotal}
              </div>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <p className="font-mono text-[10.5px] tracking-[3px] uppercase text-qa-teal mb-2">
              ◆ {gem.eyebrow}
            </p>
            <div className="flex items-baseline justify-between gap-3 flex-wrap mb-3">
              <h2 className="font-display italic text-[clamp(28px,4.5vw,40px)] text-white leading-[1.05]">
                {gem.name}
              </h2>
              <a
                href={gem.url}
                target="_blank"
                rel="noopener"
                className="font-mono text-[10px] tracking-[1.5px] uppercase text-text-dim hover:text-qa-teal transition-colors shrink-0"
              >
                github →
              </a>
            </div>
            <p className="text-[16px] text-text-secondary italic leading-relaxed">
              {t(gem.tagline_en, gem.tagline_ru)}
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            STATS STRIP
        ═══════════════════════════════════════════════════════ */}
        <StatsStrip stats={gem.stats} />

        {/* ═══════════════════════════════════════════════════════
            PULL QUOTE
        ═══════════════════════════════════════════════════════ */}
        {pullQuote && (
          <div className="relative py-2 px-1 sm:px-6">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 text-qa-teal/30 font-display text-[80px] leading-none select-none hidden sm:block">
              ❝
            </div>
            <blockquote className="font-display italic text-[clamp(20px,2.7vw,28px)] text-white leading-[1.35] sm:pl-12 sm:pr-12">
              {pullQuote}
            </blockquote>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 text-qa-teal/30 font-display text-[80px] leading-none select-none hidden sm:block rotate-180">
              ❝
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            VISUAL
        ═══════════════════════════════════════════════════════ */}
        <GemVisual gemId={gemId} />

        {/* ═══════════════════════════════════════════════════════
            WHAT IT IS — flowing prose
        ═══════════════════════════════════════════════════════ */}
        <section>
          <header className="flex items-center gap-3 mb-4">
            <div className="font-mono text-[10px] tracking-[3px] uppercase text-qa-teal">
              ◆ {t('What it is', 'Что это')}
            </div>
            <div className="flex-1 h-px bg-border" />
          </header>
          <GemBody text={t(gem.body_en, gem.body_ru)} />
        </section>

        {/* ═══════════════════════════════════════════════════════
            WHY IT MATTERS — accent block
        ═══════════════════════════════════════════════════════ */}
        <section className="relative bg-gradient-to-br from-qa-teal/[0.07] to-transparent border-l-2 border-qa-teal pl-6 pr-5 py-5">
          <div className="absolute -left-[14px] top-5 w-6 h-6 rounded-full bg-bg border border-qa-teal flex items-center justify-center">
            <span className="text-qa-teal text-[11px]">✦</span>
          </div>
          <div className="font-mono text-[10px] tracking-[3px] uppercase text-qa-teal mb-3">
            {t('Why it matters', 'Зачем это')}
          </div>
          <div className="text-[15.5px] text-text-body italic leading-[1.7] font-display">
            {t(gem.why_en, gem.why_ru)}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            WHEN TO REACH FOR IT — numbered cards
        ═══════════════════════════════════════════════════════ */}
        <section>
          <header className="flex items-center gap-3 mb-4">
            <div className="font-mono text-[10px] tracking-[3px] uppercase text-qa-teal">
              ◆ {t('When to reach for it', 'Когда брать')}
            </div>
            <div className="flex-1 h-px bg-border" />
          </header>
          <div className="grid md:grid-cols-3 gap-3">
            {useCases.map((u, i) => {
              const colon = u.indexOf('—')
              const head = colon > -1 ? u.slice(0, colon).trim() : u
              const tail = colon > -1 ? u.slice(colon + 1).trim() : null
              return (
                <div
                  key={i}
                  className="relative border border-border bg-surface/40 p-4 hover:border-qa-teal/40 transition-colors"
                >
                  <div className="font-display italic text-[28px] leading-none text-qa-teal/60 mb-2">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="text-[13.5px] text-text-body leading-[1.55]">
                    {tail ? (
                      <>
                        <span className="text-white font-semibold">{head}</span>
                        <span className="text-text-dim"> · </span>
                        <span>{tail}</span>
                      </>
                    ) : (
                      <span>{head}</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            INSTALL — terminal block
        ═══════════════════════════════════════════════════════ */}
        <section className="border border-qa-teal/30">
          <div className="bg-qa-teal/[0.08] px-4 py-2.5 flex items-center justify-between gap-3 border-b border-qa-teal/30">
            <div className="flex items-center gap-2.5">
              <span className="text-qa-teal">⌘</span>
              <span className="font-mono text-[10px] tracking-[2.5px] uppercase text-qa-teal">
                {t('install · paste into Claude Code', 'установка · вставь в Claude Code')}
              </span>
            </div>
            <CopyButton
              text={t(gem.install_en, gem.install_ru)}
              label={t('Copy prompt', 'Копировать')}
            />
          </div>
          <pre className="bg-black px-4 py-4 text-[12.5px] font-mono text-text-body whitespace-pre-wrap leading-[1.7] max-h-[320px] overflow-y-auto">
{t(gem.install_en, gem.install_ru)}
          </pre>
        </section>

      </div>
    </PageShell>
  )
}
