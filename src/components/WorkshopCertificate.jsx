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
  const head = (nickname || 'rider').replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 3) || 'CCW'
  return `CCW·2026·${head}${tail}`
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
              Claude Code <em style={{ color: '#00E5CC', fontStyle: 'italic', fontWeight: 500 }}>Workshop</em>
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
            — Cohort · {new Date(sealedAt).getFullYear()}
          </div>
          <div style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontStyle: 'italic',
            fontSize: 26,
            color: '#FFFFFF',
            lineHeight: 1.1,
            fontWeight: 400,
          }}>
            Certificate<br />of Completion
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
              // No crossOrigin attribute — the dragon arrives as a
              // base64 data URI which has no CORS semantics; setting
              // crossOrigin can make Chromium silently fail to decode
              // it and the portrait shows the monogram fallback even
              // though the data is right there.
              <img
                src={dragonImageUrl}
                alt={dragonName}
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

          {/* Curved caption — workshop pillars on the rim. Provides
              context for outside viewers ("what did this person
              actually learn?") via the topic list. */}
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
                  — CLAUDE.MD · COMMANDS · AGENTS · SKILLS · MCP · HOOKS · PLUGINS ·&nbsp;
                </textPath>
              </text>
            </svg>
          </div>

          {/* Caption under the portrait — frames the dragon as the
              AI persona output, so LinkedIn viewers who don't know
              the workshop don't wonder why there's a dragon on a
              tech training certificate. */}
          <div style={{
            position: 'absolute', bottom: -4, left: 0, right: 0, textAlign: 'center',
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: '#888888',
            lineHeight: 1.4,
          }}>
            — AI assistant identity<br />
            <span style={{ fontStyle: 'italic', color: '#00E5CC', textTransform: 'none', letterSpacing: 0.5, fontSize: 10 }}>
              {dragonName}
            </span>
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
            {/* Auto-scale the headline so first + last names of any
                realistic length fit on one line without breaking the
                grid. Buckets calibrated against a ~720px column at
                italic Playfair Display ~0.55em per character. */}
            {(() => {
              const len = displayedRider.length
              const nameFontSize =
                len <= 14 ? 78 :
                len <= 20 ? 64 :
                len <= 28 ? 52 :
                len <= 36 ? 42 :
                36
              return (
                <h1 style={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontStyle: 'italic', fontWeight: 400,
                  fontSize: nameFontSize,
                  lineHeight: 0.95,
                  color: '#FFFFFF', letterSpacing: '-0.02em',
                  display: 'inline-block', paddingBottom: 12, margin: 0,
                  whiteSpace: 'nowrap',
                }}>
                  {displayedRider}
                </h1>
              )
            })()}
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
            has successfully completed —
          </p>

          <p style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: 22, lineHeight: 1.3, color: '#FFFFFF', fontWeight: 500,
            marginBottom: 28, maxWidth: 560,
          }}>
the <em style={{ color: '#00E5CC', fontStyle: 'italic', fontWeight: 500 }}>Claude Code Workshop — Basics</em>, a hands-on training within <em style={{ color: '#FFFFFF', fontStyle: 'italic' }}>QA Clan</em>. Covered CLAUDE.md, slash commands, sub-agents, skills, MCP servers, hooks and plugins. Personal AI assistant built.
          </p>

          {/* Stats grid removed per request — the body copy already
              names the curriculum, so the numeric tiles were redundant
              and pulled the eye toward "course-completion brag"
              energy that doesn't fit the editorial tone. */}
        </div>
      </div>

      {/* FOOTER: tutor | credential ID */}
      <footer
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '32px 80px 24px', zIndex: 5,
          display: 'grid', gridTemplateColumns: '1fr auto', gap: 60, alignItems: 'end',
        }}
      >
        {/* Tutor block — avatar + name + handles, left-aligned. The
            faux-QR / seal block was removed because the code wasn't
            scannable; an invalid QR weakens credibility. */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, paddingBottom: 4 }}>
          {/* Tutor avatar — round photo, teal hairline. Sized ~30%
              smaller than the original 84px so the tutor block reads
              as supporting, not co-equal, with the dragon portrait. */}
          <div style={{
            width: 58, height: 58, borderRadius: '50%', overflow: 'hidden',
            border: '1.5px solid #00E5CC',
            boxShadow: '0 0 0 1px rgba(0,229,204,0.15), 0 6px 18px rgba(0,0,0,0.45)',
            flexShrink: 0,
          }}>
            <img
              src={`${import.meta.env.BASE_URL}brand/anastasia-avatar.jpg`}
              alt="Anastasiia Babanina"
              crossOrigin="anonymous"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Tutor column — restrained editorial layout, no fake
              calligraphic signature. Avatar + name + role + handles
              reads as legitimate credentialing without theatre. */}
          <div style={{ textAlign: 'left' }}>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 9, letterSpacing: 2.5, textTransform: 'uppercase', color: '#888888', marginBottom: 4,
            }}>
              Tutor
            </div>
            <div style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 20, color: '#FFFFFF', fontWeight: 500, lineHeight: 1.1 }}>
              Anastasiia <em style={{ fontStyle: 'italic', color: '#00E5CC' }}>Babanina</em>
            </div>
            <div style={{ width: 180, height: 1, background: '#00E5CC', opacity: 0.5, margin: '8px 0' }} />
            <div style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 9.5, letterSpacing: 1.5, color: '#00E5CC', lineHeight: 1.5,
            }}>
              {TUTOR_LINKEDIN}
            </div>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 9, letterSpacing: 1.5, color: '#888888', marginTop: 2,
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
