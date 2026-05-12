/**
 * WorkshopCertificate — editorial-style Certificate of Attendance
 * for the Basgiath Claude Code workshop. Single source of truth for
 * both on-page preview and PNG export via html-to-image.
 *
 * Dimensions: 1120×792 (A4 landscape at 96dpi, prints to A4). Scaled
 * down responsively on the preview, exported at 1× for sharp output.
 *
 * The structure mirrors the AI.NASTASIA course cert (two-column
 * grid: portrait circle on the left, hero text + stats on the
 * right, QR + signature + cred-ID footer). Theming is rebuilt for
 * the Basgiath clan: dark ink-on-black, teal/pink stripes, dragon
 * portrait instead of headshot, runic § watermark.
 */

import { forwardRef } from 'react'

const TUTOR_LINKEDIN = 'linkedin.com/in/ainastasia'
const TUTOR_INSTAGRAM = 'ai.nastasia'
const WORKSHOP_URL = 'course.ainastasia.ai/workshop'

function shortDate(date) {
  const d = date instanceof Date ? date : new Date(date)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

function makeCertId(nickname, sealedAt) {
  // Stable 6-char identifier — uppercased nickname slice + timestamp tail.
  const tail = String(sealedAt || Date.now()).slice(-4)
  const head = (nickname || 'rider').replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 3) || 'BSG'
  return `BSG·2026·${head}${tail}`
}

const WorkshopCertificate = forwardRef(function WorkshopCertificate(
  {
    dragonImageUrl,
    dragonName = 'Unnamed',
    riderName = '',
    nickname = 'rider',
    sealedAt = Date.now(),
    sealedInAerie = false,
  },
  ref,
) {
  const dateStr = shortDate(sealedAt)
  const credentialId = makeCertId(nickname, sealedAt)
  const displayedRider = (riderName && riderName.trim()) || `@${nickname}`

  return (
    <article
      ref={ref}
      style={{
        width: 1120,
        height: 792,
        position: 'relative',
        overflow: 'hidden',
        background: '#0A0A0A',
        color: '#DCDCDC',
        fontFamily: '"Inter", -apple-system, sans-serif',
        boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 10px 30px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(0,229,204,0.08)',
      }}
    >
      {/* Top brand stripe — teal · pink · ink */}
      <div
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 5,
          background: 'linear-gradient(90deg, #00E5CC 0%, #00E5CC 35%, #FF65BE 35%, #FF65BE 45%, #FFFFFF 45%, #FFFFFF 100%)',
          zIndex: 10,
        }}
      />

      {/* Big watermark glyph — dragon-rune */}
      <div
        style={{
          position: 'absolute', top: -80, right: -60,
          fontFamily: '"Playfair Display", Georgia, serif',
          fontStyle: 'italic',
          fontSize: 660,
          lineHeight: 0.75,
          color: 'rgba(0,229,204,0.05)',
          pointerEvents: 'none',
          zIndex: 1,
          fontWeight: 400,
        }}
      >
        §
      </div>

      {/* Subtle grid texture — lab-notebook nod */}
      <div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          opacity: 0.4,
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.025) 1px, transparent 1px),' +
            'linear-gradient(to bottom, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Corner lab markers */}
      {[
        { top: 32, left: 32 },
        { top: 32, right: 32 },
        { bottom: 60, left: 32 },
        { bottom: 60, right: 32 },
      ].map((pos, i) => (
        <div key={i} style={{ position: 'absolute', width: 16, height: 16, zIndex: 5, ...pos }}>
          <span style={{ position: 'absolute', top: 7, left: 0, width: 16, height: 1, background: '#FFFFFF', opacity: 0.5 }} />
          <span style={{ position: 'absolute', top: 0, left: 7, width: 1, height: 16, background: '#FFFFFF', opacity: 0.5 }} />
        </div>
      ))}

      {/* HEADER: brand · label */}
      <header
        style={{
          position: 'absolute', top: 56, left: 80, right: 80, zIndex: 5,
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <span style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 36, color: '#00E5CC', lineHeight: 1, fontWeight: 400 }}>
            §
          </span>
          <div>
            <div style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 17, color: '#FFFFFF', letterSpacing: 0.5 }}>
              BASGIATH <em style={{ color: '#00E5CC', fontStyle: 'italic', fontWeight: 500 }}>QA Academy</em>
            </div>
            <span style={{
              display: 'block',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: '#888888', marginTop: 4,
            }}>
              — Claude Code · practical workshop · {dateStr}
            </span>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: '#888888', marginBottom: 6 }}>
            — Riders Quadrant · {new Date(sealedAt).getFullYear()}
          </div>
          <div style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontStyle: 'italic',
            fontSize: 26,
            color: '#FFFFFF',
            lineHeight: 1.1,
            fontWeight: 400,
          }}>
            Certificate<br />of Attendance
          </div>
        </div>
      </header>

      {/* MAIN: portrait | hero */}
      <div
        style={{
          position: 'absolute', top: 170, left: 80, right: 80, bottom: 180, zIndex: 5,
          display: 'grid', gridTemplateColumns: '320px 1fr', gap: 64, alignItems: 'center',
        }}
      >
        {/* ── PORTRAIT ── */}
        <div style={{ position: 'relative', width: 320, height: 320, margin: '0 auto' }}>
          {/* Circular dragon portrait */}
          <div style={{
            width: 280, height: 280, borderRadius: '50%', margin: '20px auto',
            position: 'relative',
            background: '#111111',
            border: '1px solid rgba(0,229,204,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
            boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5), 0 8px 24px rgba(0,229,204,0.10)',
          }}>
            {dragonImageUrl ? (
              <img
                src={dragonImageUrl}
                alt={dragonName}
                crossOrigin="anonymous"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontStyle: 'italic',
                fontSize: 140,
                color: '#00E5CC',
                lineHeight: 1,
                letterSpacing: '-0.06em',
                opacity: 0.85,
              }}>
                {(nickname || 'B').slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>

          {/* Frame brackets */}
          <div style={{ position: 'absolute', top: 20, left: 20, width: 280, height: 280, pointerEvents: 'none' }}>
            {[
              { top: 0, left: 0, borderRight: 'none', borderBottom: 'none' },
              { top: 0, right: 0, borderLeft: 'none', borderBottom: 'none' },
              { bottom: 0, left: 0, borderRight: 'none', borderTop: 'none' },
              { bottom: 0, right: 0, borderLeft: 'none', borderTop: 'none' },
            ].map((b, i) => (
              <span key={i} style={{
                position: 'absolute', width: 28, height: 28, border: '2px solid #FFFFFF',
                ...b,
              }} />
            ))}
          </div>

          {/* Curved caption — workshop pillars on the rim */}
          <div style={{
            position: 'absolute', top: -6, left: -6,
            width: 'calc(100% + 12px)', height: 'calc(100% + 12px)',
            pointerEvents: 'none',
          }}>
            <svg viewBox="0 0 332 332" width="100%" height="100%">
              <defs>
                <path id="circlePath" d="M 166,166 m -150,0 a 150,150 0 1,1 300,0 a 150,150 0 1,1 -300,0" />
              </defs>
              <text style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: 4, fill: '#888888', textTransform: 'uppercase' }}>
                <textPath href="#circlePath" startOffset="6%">
                  — CLAUDE.MD · COMMANDS · AGENTS · SKILLS · MCP · HOOKS · PLUGINS · BONDED ·&nbsp;
                </textPath>
              </text>
            </svg>
          </div>

          {/* Sealed-in-Aerie stamp (optional) */}
          {sealedInAerie && (
            <div style={{ position: 'absolute', bottom: -20, right: -30, width: 120, height: 120, transform: 'rotate(-14deg)', zIndex: 3 }}>
              <svg viewBox="0 0 120 120" width="100%" height="100%">
                <circle cx="60" cy="60" r="56" fill="none" stroke="#FF65BE" strokeWidth="1.5" />
                <circle cx="60" cy="60" r="48" fill="none" stroke="#FF65BE" strokeWidth="1.5" />
                <defs>
                  <path id="stampPath" d="M 60,60 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
                </defs>
                <text fontSize="9" letterSpacing="2.2" fill="#FF65BE" textTransform="uppercase">
                  <textPath href="#stampPath" startOffset="4%">
                    · SEALED IN AERIE ·&nbsp;
                  </textPath>
                </text>
                <text x="60" y="54" textAnchor="middle" fontFamily='"Playfair Display"' fontStyle="italic" fontSize="18" fontWeight="500" fill="#FF65BE">aerie</text>
                <text x="60" y="74" textAnchor="middle" fontFamily='"Playfair Display"' fontStyle="italic" fontSize="18" fontWeight="500" fill="#FF65BE">favourite</text>
              </svg>
            </div>
          )}
        </div>

        {/* ── HERO TEXT ── */}
        <div style={{ position: 'relative' }}>
          <p style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', color: '#888888',
            marginBottom: 22, display: 'inline-flex', alignItems: 'center', gap: 12,
          }}>
            <span style={{ display: 'inline-block', width: 28, height: 1, background: '#00E5CC' }} />
            This is to certify that
          </p>

          <div style={{ position: 'relative', marginBottom: 8 }}>
            <h1 style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontStyle: 'italic', fontWeight: 400, fontSize: 78, lineHeight: 0.95,
              color: '#FFFFFF', letterSpacing: '-0.02em',
              display: 'inline-block', paddingBottom: 12, margin: 0,
            }}>
              {displayedRider}
            </h1>
            {/* Hand-drawn teal underline */}
            <svg
              viewBox="0 0 600 22" preserveAspectRatio="none"
              style={{ position: 'absolute', left: 0, bottom: -6, width: '100%', height: 22, pointerEvents: 'none' }}
            >
              <path d="M 6 14 Q 60 4, 140 10 T 290 8 Q 380 12, 460 8 T 594 10" stroke="#00E5CC" strokeWidth="3" fill="none" strokeLinecap="round" />
            </svg>
          </div>

          <p style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontStyle: 'italic', fontSize: 17, color: '#A8A8A8', lineHeight: 1.5,
            marginTop: 28, marginBottom: 6, maxWidth: 560,
          }}>
            crossed the Parapet and walked the full ritual of —
          </p>

          <p style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: 22, lineHeight: 1.3, color: '#FFFFFF', fontWeight: 500,
            marginBottom: 28, maxWidth: 560,
          }}>
            <em style={{ color: '#00E5CC', fontStyle: 'italic', fontWeight: 500 }}>Basgiath QA Academy</em> — a Claude Code workshop for QA engineers. Sealed a bonded dragon: <em style={{ color: '#FFFFFF', fontStyle: 'italic' }}>{dragonName}</em>.
          </p>

          {/* Stats grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0,
            borderTop: '1px solid rgba(255,255,255,0.10)', borderBottom: '1px solid rgba(255,255,255,0.10)',
            maxWidth: 600,
          }}>
            {[
              { num: '7', sub: '/7', label: 'Slash\ncommands', color: '#FFFFFF' },
              { num: '4', sub: '', label: 'Sub-agents\nwielded', color: '#00E5CC', italic: true },
              { num: '3', sub: '/3', label: 'MCP\nservers', color: '#FFFFFF' },
              { num: '1', sub: '', label: 'Dragon\nsealed', color: '#FF65BE' },
            ].map((s, i) => (
              <div key={i} style={{
                padding: i === 0 ? '18px 16px 18px 0' : '18px 16px 18px 20px',
                borderRight: i < 3 ? '1px solid rgba(255,255,255,0.10)' : 'none',
              }}>
                <div style={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontStyle: s.italic ? 'italic' : 'normal',
                  fontWeight: 400, fontSize: 34, lineHeight: 1,
                  color: s.color, letterSpacing: '-0.02em', marginBottom: 6,
                }}>
                  {s.num}{s.sub && <span style={{ fontSize: 20, color: '#666' }}>{s.sub}</span>}
                </div>
                <div style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 9, letterSpacing: 2.5, textTransform: 'uppercase', color: '#888888',
                  lineHeight: 1.3, whiteSpace: 'pre-line',
                }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER: seal | signature | credential ID */}
      <footer
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '32px 80px 24px', zIndex: 5,
          display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: 40, alignItems: 'end',
        }}
      >
        {/* Decorative seal — runic stamp, no URL */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
          <div style={{ width: 84, height: 84, background: '#FFFFFF', padding: 6, position: 'relative' }}>
            {/* Stylised faux-QR — visual badge only. Actual verify lives at workshop URL. */}
            <svg viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
              <rect width="72" height="72" fill="#FFFFFF" />
              <g fill="#0A0A0A">
                <rect x="0" y="0" width="20" height="20" />
                <rect x="52" y="0" width="20" height="20" />
                <rect x="0" y="52" width="20" height="20" />
              </g>
              <g fill="#FFFFFF">
                <rect x="4" y="4" width="12" height="12" />
                <rect x="56" y="4" width="12" height="12" />
                <rect x="4" y="56" width="12" height="12" />
              </g>
              <g fill="#0A0A0A">
                <rect x="7" y="7" width="6" height="6" />
                <rect x="59" y="7" width="6" height="6" />
                <rect x="7" y="59" width="6" height="6" />
                {[24, 28, 32, 40, 44, 48].map(x => <rect key={`a${x}`} x={x} y="4" width="2" height="2" />)}
                {[24, 36, 44].map(x => <rect key={`b${x}`} x={x} y="8" width="2" height="2" />)}
                {[28, 32, 40, 48].map(x => <rect key={`c${x}`} x={x} y="12" width="2" height="2" />)}
                {[4, 12, 24, 32, 40, 52, 60, 68].map(x => <rect key={`d${x}`} x={x} y="24" width="2" height="2" />)}
                {[8, 16, 28, 44, 56, 64].map(x => <rect key={`e${x}`} x={x} y="28" width="2" height="2" />)}
                {[4, 20, 32, 40, 52, 60].map(x => <rect key={`f${x}`} x={x} y="32" width="2" height="2" />)}
                {[12, 24, 36, 48, 56, 68].map(x => <rect key={`g${x}`} x={x} y="36" width="2" height="2" />)}
                {[4, 16, 28, 40, 44, 60].map(x => <rect key={`h${x}`} x={x} y="40" width="2" height="2" />)}
                {[8, 20, 32, 52, 64].map(x => <rect key={`i${x}`} x={x} y="44" width="2" height="2" />)}
                {[24, 36, 44, 56].map(x => <rect key={`j${x}`} x={x} y="48" width="2" height="2" />)}
                {[24, 32, 40, 48, 60, 68].map(x => <rect key={`k${x}`} x={x} y="56" width="2" height="2" />)}
                {[28, 44, 56].map(x => <rect key={`l${x}`} x={x} y="60" width="2" height="2" />)}
                {[24, 36, 48, 64].map(x => <rect key={`m${x}`} x={x} y="64" width="2" height="2" />)}
                {[32, 40, 52, 60].map(x => <rect key={`n${x}`} x={x} y="68" width="2" height="2" />)}
              </g>
            </svg>
          </div>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 8, letterSpacing: 2, textTransform: 'uppercase', color: '#888888', lineHeight: 1.5,
          }}>
            — Bonded Rider<br />
            <strong style={{ color: '#FFFFFF' }}>Basgiath QA Academy</strong>
          </div>
        </div>

        {/* Signature block — avatar + signature/name/handle stack */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, paddingBottom: 4 }}>
          {/* Tutor avatar — round photo, teal hairline. */}
          <div style={{
            width: 84, height: 84, borderRadius: '50%', overflow: 'hidden',
            border: '1.5px solid #00E5CC',
            boxShadow: '0 0 0 1px rgba(0,229,204,0.15), 0 6px 18px rgba(0,0,0,0.45)',
            flexShrink: 0,
          }}>
            <img
              src="/brand/anastasia-avatar.jpg"
              alt="Anastasiia Babanina"
              crossOrigin="anonymous"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Signature column */}
          <div style={{ textAlign: 'left' }}>
            <svg viewBox="0 0 220 50" width="200" height="44" style={{ display: 'block', marginBottom: 2 }}>
              <path
                d="M 10 38 Q 14 24, 24 24 Q 30 24, 32 36 Q 34 20, 42 16 Q 50 12, 54 26 Q 56 40, 48 42
                   M 58 28 Q 64 18, 70 28 Q 74 36, 68 40
                   M 78 18 Q 78 34, 88 34 Q 94 34, 94 24 Q 94 14, 88 14
                   M 98 22 Q 102 14, 108 22 Q 110 28, 108 30 Q 106 32, 102 28
                   M 114 14 Q 114 36, 120 34
                   M 124 22 Q 124 34, 130 34 Q 138 32, 136 20 Q 132 16, 126 20
                   M 140 14 L 140 36 M 140 22 Q 148 20, 152 24 Q 154 34, 146 36
                   M 158 22 Q 158 34, 164 34 Q 170 30, 170 22
                   M 174 14 Q 174 36, 182 32
                   M 186 24 Q 196 18, 204 26 Q 206 34, 196 38"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div style={{ width: 200, height: 1, background: '#FFFFFF', opacity: 0.3, marginBottom: 8 }} />
            <div style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 17, color: '#FFFFFF', fontWeight: 500 }}>
              Anastasiia <em style={{ fontStyle: 'italic', color: '#00E5CC' }}>Babanina</em>
            </div>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 9, letterSpacing: 2.5, textTransform: 'uppercase', color: '#888888', marginTop: 4,
            }}>
              — Tutor · {TUTOR_LINKEDIN}
            </div>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 8.5, letterSpacing: 2, textTransform: 'uppercase', color: '#666666', marginTop: 2,
            }}>
              ig: {TUTOR_INSTAGRAM}
            </div>
          </div>
        </div>

        {/* Credential ID */}
        <div style={{ textAlign: 'right', fontFamily: '"JetBrains Mono", monospace' }}>
          <div style={{ fontSize: 8, letterSpacing: 3, textTransform: 'uppercase', color: '#888888', marginBottom: 6 }}>
            — Credential ID
          </div>
          <div style={{ fontSize: 15, letterSpacing: 3, color: '#FFFFFF', fontWeight: 600, marginBottom: 8 }}>
            {credentialId}
          </div>
          <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: '#888888', lineHeight: 1.5 }}>
            Issued · {dateStr}<br />
            Warsaw, PL · In force 3 years
          </div>
        </div>
      </footer>

      {/* Bottom three-colour stripe */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 4,
        background: 'linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 55%, #FF65BE 55%, #FF65BE 65%, #00E5CC 65%, #00E5CC 100%)',
        zIndex: 10,
      }} />
    </article>
  )
})

export default WorkshopCertificate
