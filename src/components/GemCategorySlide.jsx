import { useState } from 'react'
import PageShell from '../core/PageShell'
import { useT } from '../i18n/useT'
import { GEM_CATEGORY_BY_ID } from '../data/gems'

/**
 * Category gem slide - one long slide listing every repo in the
 * category, each as a self-contained block with tagline + body +
 * why + install + url.
 *
 * Used by P_Gem* category pages - pass categoryId + pageIndex.
 */

function CopyButton({ text }) {
  const t = useT()
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
      className={`font-mono text-[10px] tracking-[2px] uppercase font-semibold px-3 py-1.5 transition-all cursor-pointer ${
        copied ? 'bg-yellow-300 text-black' : 'bg-qa-teal text-black hover:shadow-[0_0_18px_rgba(0,229,204,0.4)]'
      }`}
      style={copied ? { backgroundColor: '#FEED00' } : {}}
    >
      {copied ? '✓ ' + t('copied', 'скопировано', 'скопійовано') : t('copy install', 'копировать', 'копіювати')}
    </button>
  )
}

function ItemBlock({ item, index }) {
  const t = useT()
  return (
    <article className="border border-border bg-surface/30 rounded-[2px] overflow-hidden hover:border-qa-teal/30 transition-colors">

      {/* Header */}
      <header className="flex items-baseline gap-3 px-5 pt-5 pb-3 border-b border-border">
        <div className="font-display italic text-[28px] leading-none text-qa-teal/40 shrink-0">
          {String(index + 1).padStart(2, '0')}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-3 flex-wrap">
            <h3 className="font-display italic text-[24px] text-white leading-tight">
              {item.name}
            </h3>
            <span className="font-mono text-[10px] tracking-[1.5px] uppercase text-text-dim">
              {item.author}
            </span>
            {item.stars && (
              <span className="font-mono text-[10px] tracking-[1.5px] uppercase text-qa-teal">
                ✦ {item.stars}
              </span>
            )}
          </div>
          <p className="text-[14px] text-text-secondary italic leading-relaxed mt-1">
            {t(item.tagline_en, item.tagline_ru, item.tagline_uk)}
          </p>
        </div>
        <a
          href={item.url}
          target="_blank"
          rel="noopener"
          className="font-mono text-[10px] tracking-[1.5px] uppercase text-text-dim hover:text-qa-teal transition-colors shrink-0"
        >
          github →
        </a>
      </header>

      {/* Screenshot — links to source repo, falls back to no-render if
          image hasn't been captured yet. */}
      {item.image && (
        <a
          href={item.url}
          target="_blank"
          rel="noopener"
          className="block border-b border-border bg-black"
        >
          <img
            src={item.image}
            alt={`${item.name} repo screenshot`}
            loading="lazy"
            className="w-full h-[220px] object-cover object-top opacity-85 hover:opacity-100 transition-opacity"
          />
        </a>
      )}

      {/* Body */}
      <div className="px-5 py-4 space-y-4">

        {/* What it is */}
        <div>
          <div className="font-mono text-[9px] tracking-[2px] uppercase text-qa-teal mb-2">
            ◆ {t('What it is', 'Что это', 'Що це')}
          </div>
          <p className="text-[13.5px] text-text-body leading-[1.65]">
            {t(item.body_en, item.body_ru, item.body_uk)}
          </p>
        </div>

        {/* Why it matters */}
        <div className="bg-qa-teal/[0.04] border-l-2 border-qa-teal pl-4 py-2">
          <div className="font-mono text-[9px] tracking-[2px] uppercase text-qa-teal mb-1.5">
            {t('Why it matters', 'Зачем это', 'Навіщо це')}
          </div>
          <p className="text-[13.5px] text-text-body italic leading-[1.65] font-display">
            {t(item.why_en, item.why_ru, item.why_uk)}
          </p>
        </div>

        {/* Install */}
        <div className="border border-qa-teal/20">
          <div className="flex items-center justify-between gap-2 bg-qa-teal/[0.06] px-3 py-1.5 border-b border-qa-teal/20">
            <span className="font-mono text-[9px] tracking-[2px] uppercase text-qa-teal">
              ⌘ {t('install', 'установка', 'встановлення')}
            </span>
            <CopyButton text={t(item.install_en, item.install_ru, item.install_uk)} />
          </div>
          <pre className="bg-black px-3 py-2.5 text-[12px] font-mono text-text-body whitespace-pre-wrap leading-[1.65]">
{t(item.install_en, item.install_ru, item.install_uk)}
          </pre>
        </div>

      </div>
    </article>
  )
}

export default function GemCategorySlide({ categoryId, pageIndex }) {
  const t = useT()
  const category = GEM_CATEGORY_BY_ID[categoryId]
  if (!category) return null

  return (
    <PageShell pageIndex={pageIndex}>
      <div className="space-y-6">

        {/* Category hero */}
        <div>
          <p className="font-mono text-[10.5px] tracking-[3px] uppercase text-qa-teal mb-2">
            ◆ {category.eyebrow}
          </p>
          <h2 className="font-display italic text-[clamp(28px,4vw,38px)] text-white leading-[1.05] mb-4">
            {category.name}
          </h2>
          <p className="text-[15px] text-text-body leading-[1.75] max-w-3xl">
            {t(category.intro_en, category.intro_ru, category.intro_uk)}
          </p>
        </div>

        {/* Items list */}
        <div className="space-y-5">
          {category.items.map((item, i) => (
            <ItemBlock key={item.name} item={item} index={i} />
          ))}
        </div>

      </div>
    </PageShell>
  )
}
