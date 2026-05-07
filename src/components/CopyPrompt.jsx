import { useRef, useState } from 'react'

/**
 * CopyPrompt — reusable copy-to-clipboard prompt card.
 *
 * Pattern matches the bb-deck CopyPrompt:
 *  - Hidden body lives in DOM (clip-rect 0) so copy reads textContent
 *  - "Copy" button extracts via ref.current.textContent
 *  - "Peek" button toggles a <pre> preview below the row
 *  - `featured` adds a stronger qa-teal border + pink-ish glow for hero prompts
 *
 * Props:
 *   name      — short prompt name (the user-facing title of the card)
 *   desc      — one-line description
 *   featured  — boolean, applies hero styling
 *   children  — the actual prompt body (string or nodes). Copied verbatim.
 */
export default function CopyPrompt({ name, desc, featured = false, children }) {
  const codeRef = useRef(null)
  const [copied, setCopied] = useState(false)
  const [peeking, setPeeking] = useState(false)

  const handleCopy = async () => {
    const text = codeRef.current?.textContent || ''
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // Fallback for older browsers / restricted contexts
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  const containerCls = featured
    ? 'border-2 border-qa-teal bg-qa-teal/[0.04] shadow-[0_0_32px_rgba(0,229,204,0.10)]'
    : 'border border-border bg-surface/40 hover:border-qa-teal/40 transition-colors'

  return (
    <div className={`rounded-[2px] ${containerCls}`}>
      {/* Top row */}
      <div className="flex items-start gap-4 p-5 sm:p-6">
        {/* Glyph */}
        <div
          className={`shrink-0 w-10 h-10 grid place-items-center rounded-[2px] font-mono text-[18px] ${
            featured
              ? 'bg-qa-teal/15 text-qa-teal border border-qa-teal/40'
              : 'bg-bg text-text-secondary border border-border'
          }`}
          aria-hidden="true"
        >
          ⌘
        </div>

        {/* Title + desc */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            {featured && (
              <span className="font-mono text-[10px] tracking-[2px] uppercase text-qa-teal">
                · Featured ·
              </span>
            )}
          </div>
          <div className="font-display text-[18px] sm:text-[20px] text-white leading-tight mb-1">
            {name}
          </div>
          {desc && (
            <p className="text-[13px] text-text-secondary leading-relaxed">{desc}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setPeeking(p => !p)}
            className="font-mono text-[11px] tracking-[2px] uppercase text-text-secondary hover:text-qa-teal transition-colors px-3 py-2 border border-border rounded-[2px] cursor-pointer"
            aria-expanded={peeking}
          >
            {peeking ? '▴ Hide' : '▾ Peek'}
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className={`font-mono text-[11px] tracking-[2px] uppercase font-semibold px-4 py-2 rounded-[2px] transition-all cursor-pointer ${
              copied
                ? 'bg-qa-teal text-black scale-[1.02] shadow-[0_0_24px_rgba(0,229,204,0.45)]'
                : 'bg-qa-teal/90 text-black hover:bg-qa-teal hover:shadow-[0_0_18px_rgba(0,229,204,0.25)]'
            }`}
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Peek preview — only rendered when toggled */}
      {peeking && (
        <div className="border-t border-border bg-black/40">
          <pre className="px-5 sm:px-6 py-4 overflow-x-auto max-h-[420px] overflow-y-auto">
            <code className="font-mono text-[12px] text-text-body leading-relaxed whitespace-pre-wrap break-words">
              {children}
            </code>
          </pre>
        </div>
      )}

      {/* Hidden but in DOM — source of truth for clipboard */}
      <div
        ref={codeRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0,0,0,0)',
          whiteSpace: 'pre',
          border: 0,
        }}
      >
        {children}
      </div>
    </div>
  )
}
