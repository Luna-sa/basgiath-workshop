import { useState } from 'react'
import PageShell from '../core/PageShell'
import { useT } from '../i18n/useT'
import { GEM_BY_ID } from '../data/gems'
import { GemVisual } from './gems/Visuals'

function CopyButton({ text, label }) {
  const [copied, setCopied] = useState(false)
  const handle = async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handle}
      className={`font-mono text-[11px] tracking-[2px] uppercase font-semibold px-3 py-2 transition-all cursor-pointer ${
        copied
          ? 'bg-yellow-300 text-black'
          : 'bg-qa-teal text-black hover:shadow-[0_0_18px_rgba(0,229,204,0.4)]'
      }`}
      style={copied ? { backgroundColor: '#FEED00' } : {}}
    >
      {copied ? '✓ copied' : label}
    </button>
  )
}

/**
 * Single-gem deep-dive slide. Layout:
 *   hero (eyebrow · position + name + tagline + github link)
 *   ↓
 *   what-it-is (body)
 *   ↓
 *   why-it-matters + when-to-use (two-column panel)
 *   ↓
 *   install (copyable autopilot prompt)
 */
export default function GemSlide({ gemId, pageIndex, position }) {
  const t = useT()
  const gem = GEM_BY_ID[gemId]

  if (!gem) return null

  const useCases = t(gem.use_cases_en, gem.use_cases_ru) || []

  return (
    <PageShell pageIndex={pageIndex}>
      <div className="space-y-6">
        {/* ── Hero ─────────────────────────────────────────── */}
        <div>
          <p className="font-mono text-[11px] tracking-[3px] uppercase text-qa-teal mb-2">
            ◆ {gem.eyebrow}{position ? `  ·  ${position}` : ''}
          </p>
          <div className="flex items-baseline justify-between gap-3 flex-wrap mb-3">
            <h2 className="font-display italic text-3xl text-white leading-tight">
              {gem.name}
            </h2>
            <a
              href={gem.url}
              target="_blank"
              rel="noopener"
              className="font-mono text-[10px] tracking-[1.5px] uppercase text-text-dim hover:text-qa-teal transition-colors"
            >
              github →
            </a>
          </div>
          <p className="text-[16px] text-text-body italic leading-relaxed">
            {t(gem.tagline_en, gem.tagline_ru)}
          </p>
        </div>

        {/* ── Visual hero ──────────────────────────────────── */}
        <GemVisual gemId={gemId} />

        {/* ── What it is ───────────────────────────────────── */}
        <div className="border border-border bg-surface/40 p-5">
          <div className="font-mono text-[10px] tracking-[2px] uppercase text-text-dim mb-3">
            ◆ {t('What it is', 'Что это')}
          </div>
          <pre className="text-[14px] text-text-body whitespace-pre-wrap font-body leading-relaxed">
{t(gem.body_en, gem.body_ru)}
          </pre>
        </div>

        {/* ── Why + When ──────────────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-3">
          <div className="border border-border bg-surface/40 p-5">
            <div className="font-mono text-[10px] tracking-[2px] uppercase text-qa-teal mb-3">
              ◆ {t('Why it matters', 'Зачем это')}
            </div>
            <pre className="text-[13.5px] text-text-body whitespace-pre-wrap font-body leading-relaxed">
{t(gem.why_en, gem.why_ru)}
            </pre>
          </div>

          <div className="border border-border bg-surface/40 p-5">
            <div className="font-mono text-[10px] tracking-[2px] uppercase text-qa-teal mb-3">
              ◆ {t('When to reach for it', 'Когда брать')}
            </div>
            <ul className="text-[13.5px] text-text-body leading-relaxed space-y-2 list-none">
              {useCases.map((u, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-qa-teal flex-shrink-0">◆</span>
                  <span>{u}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Install block ───────────────────────────────── */}
        <div className="border border-qa-teal/30 bg-qa-teal/[0.04] p-5">
          <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
            <span className="font-mono text-[10px] tracking-[2px] uppercase text-qa-teal">
              ⌘ {t('install · paste into Claude Code', 'установка · вставь в Claude Code')}
            </span>
            <CopyButton
              text={t(gem.install_en, gem.install_ru)}
              label={t('Copy prompt', 'Копировать')}
            />
          </div>
          <pre className="bg-black border border-border p-3 text-[12px] font-mono text-text-body whitespace-pre-wrap leading-relaxed max-h-[280px] overflow-y-auto">
{t(gem.install_en, gem.install_ru)}
          </pre>
        </div>
      </div>
    </PageShell>
  )
}
