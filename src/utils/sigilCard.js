/**
 * Render a 1080×1350 "Dragon Sigil Card" PNG for the workshop's
 * Bond Ritual. Composition:
 *
 *   ┌──────────────────────────────────┐
 *   │                                  │
 *   │      ⟨ dragon portrait ⟩         │ 1080×1080
 *   │                                  │
 *   ├──────────────────────────────────┤
 *   │  ◆ BASGIATH · 2026-05-13         │
 *   │                                  │
 *   │  {Dragon Name}    italic display │
 *   │                                  │
 *   │  rider · @{nickname}             │
 *   │  "{motto}"                       │
 *   │                                  │
 *   │  ──────────                      │
 *   │  ✦ basgiath-workshop.onrender.com│
 *   └──────────────────────────────────┘ 270h
 *
 * The returned blob is a real PNG that can be downloaded or shared
 * via Web Share API. Image source URL must be CORS-allowed (Supabase
 * Storage public buckets are by default).
 */

const W = 1080
const H = 1350
const PORTRAIT_H = 1080
const FOOTER_H = H - PORTRAIT_H // 270

const COLORS = {
  bg: '#0A0A0A',
  surface: '#111111',
  teal: '#00E5CC',
  white: '#FFFFFF',
  textBody: '#DCDCDC',
  textDim: '#888888',
  border: '#1E1E1E',
}

/** Load image with CORS-anonymous so canvas isn't tainted. */
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = (e) => reject(new Error('Image load failed: ' + (e?.message || src)))
    img.src = src
  })
}

/**
 * Render the card. Returns a Promise<Blob> (PNG).
 *
 * Args:
 *   imageUrl   — dragon portrait URL (Supabase Storage public URL)
 *   name       — dragon name
 *   nickname   — rider nickname
 *   motto      — one-line motto (rendered as italic pull quote)
 *   date       — Date object or formatted string
 *   url        — short URL shown at bottom (workshop landing)
 */
export async function renderSigilCard({
  imageUrl,
  name = 'Unnamed',
  nickname = 'anon',
  motto = '',
  riderClass = null,
  epithet = null,
  aerieFavourite = false, // when true, badges this dragon as "Aerie Favourite"
  date = new Date(),
  url = 'basgiath-workshop.onrender.com',
}) {
  if (!imageUrl) throw new Error('imageUrl required')

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  // ── Background ─────────────────────────────────────────────────
  ctx.fillStyle = COLORS.bg
  ctx.fillRect(0, 0, W, H)

  // ── Portrait (top 1080) ───────────────────────────────────────
  const img = await loadImage(imageUrl)
  // Cover-fit
  const r = Math.max(W / img.width, PORTRAIT_H / img.height)
  const sw = img.width
  const sh = img.height
  const dw = sw * r
  const dh = sh * r
  const dx = (W - dw) / 2
  const dy = (PORTRAIT_H - dh) / 2
  ctx.drawImage(img, dx, dy, dw, dh)

  // ── Subtle teal scan line between portrait and footer ─────────
  ctx.fillStyle = COLORS.teal
  ctx.fillRect(0, PORTRAIT_H, W, 3)

  // ── Footer ─────────────────────────────────────────────────────
  ctx.fillStyle = COLORS.bg
  ctx.fillRect(0, PORTRAIT_H + 3, W, FOOTER_H - 3)

  const FOOTER_X = 60

  // Eyebrow line: "◆ BASGIATH · <date>" — or AERIE FAVOURITE crown badge
  const dateStr = typeof date === 'string'
    ? date
    : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

  if (aerieFavourite) {
    // Special crown badge — teal background block with black text
    const padX = 12, padY = 6
    ctx.font = '700 16px "JetBrains Mono", monospace'
    const label = '✦ AERIE FAVOURITE · BASGIATH · ' + dateStr
    const labelW = ctx.measureText(label).width + padX * 2
    ctx.fillStyle = COLORS.teal
    ctx.fillRect(FOOTER_X, PORTRAIT_H + 22, labelW, 28)
    ctx.fillStyle = '#0A0A0A'
    ctx.textBaseline = 'top'
    ctx.fillText(label, FOOTER_X + padX, PORTRAIT_H + 30)
  } else {
    ctx.font = '600 16px "JetBrains Mono", monospace'
    ctx.fillStyle = COLORS.teal
    ctx.textBaseline = 'top'
    ctx.fillText('◆ BASGIATH ACADEMY · ' + dateStr, FOOTER_X, PORTRAIT_H + 30)
  }

  // Dragon name — display italic, large
  ctx.font = 'italic 700 64px "Playfair Display", Georgia, serif'
  ctx.fillStyle = COLORS.white
  ctx.fillText(name, FOOTER_X, PORTRAIT_H + 62)

  // Rider nickname — mono
  ctx.font = '500 18px "JetBrains Mono", monospace'
  ctx.fillStyle = COLORS.textDim
  const riderPrefix = riderClass ? `${riderClass.toLowerCase()} · ` : 'rider · '
  ctx.fillText(riderPrefix, FOOTER_X, PORTRAIT_H + 138)
  const riderLabelWidth = ctx.measureText(riderPrefix).width
  ctx.fillStyle = COLORS.teal
  ctx.fillText('@' + nickname, FOOTER_X + riderLabelWidth, PORTRAIT_H + 138)

  // Motto — italic, wraps to two lines max
  if (motto) {
    ctx.font = 'italic 500 22px "Playfair Display", Georgia, serif'
    ctx.fillStyle = COLORS.textBody
    const mottoText = '"' + motto + '"'
    const maxWidth = W - FOOTER_X * 2 - 20
    wrapText(ctx, mottoText, FOOTER_X, PORTRAIT_H + 170, maxWidth, 28, 2)
  }

  // Bottom right: workshop URL
  ctx.font = '500 14px "JetBrains Mono", monospace'
  ctx.fillStyle = COLORS.textDim
  ctx.textAlign = 'right'
  ctx.fillText('✦ ' + url, W - FOOTER_X, H - 36)
  ctx.textAlign = 'left' // reset

  // ── Output PNG blob ────────────────────────────────────────────
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => blob ? resolve(blob) : reject(new Error('toBlob failed')),
      'image/png',
      0.95,
    )
  })
}

// ─────────────────────────────────────────────────────────────────────
// Certificate-of-attendance variant for social-share.
// ─────────────────────────────────────────────────────────────────────
//
// Same canvas size (1080×1350) so file conventions match the sigil card,
// but the layout is rebuilt for LinkedIn-feed scanability:
//
//   ┌──────────────────────────────────────┐
//   │  ◆ BASGIATH QA ACADEMY ·  2026-05-13 │   header band  (0–110)
//   │  Certificate of Attendance           │   title        (110–200)
//   │                                      │
//   │       ⟨ dragon portrait, 720 ⟩       │   portrait     (200–920)
//   │                                      │
//   │  {Dragon Name}             italic    │
//   │  rider · @{nickname}                 │
//   │  ──────                              │
//   │  Tutored by                          │   tutor block  (1000–1280)
//   │  Anastasiia Babanina                 │
//   │  in/ainastasia · ig: ai.nastasia     │
//   │  ─ course.ainastasia.ai/workshop ─   │
//   └──────────────────────────────────────┘
//
// Avatar is optional — pass `tutorAvatarUrl` to render a 96px round
// portrait next to the tutor name. If the URL is missing or 404s, the
// tutor block silently renders text-only.
export async function renderCertificateCard({
  imageUrl,
  name = 'Unnamed',
  nickname = 'rider',
  date = new Date(),
  tutorName = 'Anastasiia Babanina',
  tutorLinkedin = 'linkedin.com/in/ainastasia',
  tutorInstagram = 'ai.nastasia',
  tutorAvatarUrl = null, // e.g. '/brand/anastasia-avatar.jpg'
  url = 'course.ainastasia.ai/workshop',
}) {
  if (!imageUrl) throw new Error('imageUrl required')

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  // ── Background — solid bg with subtle vertical gradient ────────
  const grad = ctx.createLinearGradient(0, 0, 0, H)
  grad.addColorStop(0, '#0B0B0B')
  grad.addColorStop(1, '#050505')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)

  // ── Decorative border, two rules at top and bottom ─────────────
  ctx.fillStyle = COLORS.teal
  ctx.fillRect(60, 60, W - 120, 2)
  ctx.fillRect(60, H - 62, W - 120, 2)
  ctx.fillStyle = COLORS.border
  ctx.fillRect(60, 66, W - 120, 1)
  ctx.fillRect(60, H - 68, W - 120, 1)

  // ── Eyebrow band: BASGIATH QA ACADEMY · DATE ───────────────────
  const dateStr = typeof date === 'string'
    ? date
    : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  ctx.font = '600 18px "JetBrains Mono", monospace'
  ctx.fillStyle = COLORS.teal
  ctx.textBaseline = 'top'
  ctx.textAlign = 'center'
  ctx.fillText('◆ BASGIATH QA ACADEMY · CLAUDE CODE WORKSHOP · ' + dateStr, W / 2, 100)

  // ── Title: Certificate of Attendance ───────────────────────────
  ctx.font = 'italic 700 56px "Playfair Display", Georgia, serif'
  ctx.fillStyle = COLORS.white
  ctx.fillText('Certificate of Attendance', W / 2, 142)

  // ── Dragon portrait — circular crop, 720px ─────────────────────
  const img = await loadImage(imageUrl)
  const PORTRAIT_SIZE = 720
  const PORTRAIT_Y = 230
  const PORTRAIT_X = (W - PORTRAIT_SIZE) / 2
  ctx.save()
  ctx.beginPath()
  ctx.rect(PORTRAIT_X, PORTRAIT_Y, PORTRAIT_SIZE, PORTRAIT_SIZE)
  ctx.clip()
  const r = Math.max(PORTRAIT_SIZE / img.width, PORTRAIT_SIZE / img.height)
  const dw = img.width * r
  const dh = img.height * r
  const dx = PORTRAIT_X + (PORTRAIT_SIZE - dw) / 2
  const dy = PORTRAIT_Y + (PORTRAIT_SIZE - dh) / 2
  ctx.drawImage(img, dx, dy, dw, dh)
  ctx.restore()
  // Teal frame on the portrait
  ctx.strokeStyle = COLORS.teal
  ctx.lineWidth = 2
  ctx.strokeRect(PORTRAIT_X, PORTRAIT_Y, PORTRAIT_SIZE, PORTRAIT_SIZE)

  // ── Dragon name + rider line ───────────────────────────────────
  ctx.font = 'italic 700 64px "Playfair Display", Georgia, serif'
  ctx.fillStyle = COLORS.white
  ctx.fillText(name, W / 2, 985)

  ctx.font = '500 20px "JetBrains Mono", monospace'
  ctx.fillStyle = COLORS.textDim
  const riderLine = 'rider · '
  const riderLineWidth = ctx.measureText(riderLine).width
  const handle = '@' + nickname
  const handleWidth = ctx.measureText(handle).width
  const totalLineWidth = riderLineWidth + handleWidth
  ctx.textAlign = 'left'
  const lineStartX = (W - totalLineWidth) / 2
  ctx.fillText(riderLine, lineStartX, 1060)
  ctx.fillStyle = COLORS.teal
  ctx.fillText(handle, lineStartX + riderLineWidth, 1060)
  ctx.textAlign = 'center'

  // Divider rule between rider and tutor
  ctx.fillStyle = COLORS.teal
  ctx.fillRect((W - 80) / 2, 1108, 80, 1)

  // ── Tutor block ────────────────────────────────────────────────
  // Optional avatar — render only if the file actually loads. We
  // try once, fall back to text-only on failure.
  let avatar = null
  if (tutorAvatarUrl) {
    try { avatar = await loadImage(tutorAvatarUrl) } catch { avatar = null }
  }

  const TUTOR_Y = 1140

  if (avatar) {
    const AVATAR_SIZE = 72
    const AVATAR_X = W / 2 - 220
    ctx.save()
    ctx.beginPath()
    ctx.arc(AVATAR_X + AVATAR_SIZE / 2, TUTOR_Y + AVATAR_SIZE / 2, AVATAR_SIZE / 2, 0, Math.PI * 2)
    ctx.clip()
    const ar = Math.max(AVATAR_SIZE / avatar.width, AVATAR_SIZE / avatar.height)
    const aw = avatar.width * ar
    const ah = avatar.height * ar
    ctx.drawImage(avatar, AVATAR_X + (AVATAR_SIZE - aw) / 2, TUTOR_Y + (AVATAR_SIZE - ah) / 2, aw, ah)
    ctx.restore()
    ctx.strokeStyle = COLORS.teal
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(AVATAR_X + AVATAR_SIZE / 2, TUTOR_Y + AVATAR_SIZE / 2, AVATAR_SIZE / 2, 0, Math.PI * 2)
    ctx.stroke()

    // Text block to the right of avatar
    ctx.textAlign = 'left'
    ctx.font = '500 14px "JetBrains Mono", monospace'
    ctx.fillStyle = COLORS.textDim
    ctx.fillText('TUTORED BY', AVATAR_X + AVATAR_SIZE + 16, TUTOR_Y + 4)
    ctx.font = 'italic 600 30px "Playfair Display", Georgia, serif'
    ctx.fillStyle = COLORS.white
    ctx.fillText(tutorName, AVATAR_X + AVATAR_SIZE + 16, TUTOR_Y + 24)
    ctx.font = '500 15px "JetBrains Mono", monospace'
    ctx.fillStyle = COLORS.teal
    ctx.fillText('in/' + tutorLinkedin.replace(/.*\//, '') + ' · ig: ' + tutorInstagram, AVATAR_X + AVATAR_SIZE + 16, TUTOR_Y + 62)
    ctx.textAlign = 'center'
  } else {
    ctx.font = '500 14px "JetBrains Mono", monospace'
    ctx.fillStyle = COLORS.textDim
    ctx.fillText('TUTORED BY', W / 2, TUTOR_Y)
    ctx.font = 'italic 600 32px "Playfair Display", Georgia, serif'
    ctx.fillStyle = COLORS.white
    ctx.fillText(tutorName, W / 2, TUTOR_Y + 22)
    ctx.font = '500 16px "JetBrains Mono", monospace'
    ctx.fillStyle = COLORS.teal
    ctx.fillText(tutorLinkedin + '  ·  ig: ' + tutorInstagram, W / 2, TUTOR_Y + 70)
  }

  // ── Bottom workshop CTA ────────────────────────────────────────
  ctx.font = '500 16px "JetBrains Mono", monospace'
  ctx.fillStyle = COLORS.textDim
  ctx.fillText('✦ ' + url + ' ✦', W / 2, H - 100)

  ctx.textAlign = 'left' // reset

  // ── Output PNG blob ─────────────────────────────────────────────
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => blob ? resolve(blob) : reject(new Error('toBlob failed')),
      'image/png',
      0.95,
    )
  })
}

/**
 * Build the English LinkedIn caption for the certificate share.
 * Returned as a plain string so the caller can copy it to clipboard.
 */
export function buildLinkedInCaption({ tutorLinkedinUrl = 'https://www.linkedin.com/in/ainastasia/' } = {}) {
  return `Completed the Claude Code Workshop Basics with QA Clan in my company.

What I'm leaving with:

- A CLAUDE.md tuned to my voice, conventions, and non-negotiables.
- Sub-agents handling parts of QA I always wanted to delegate. Test cases, bug triage, review, in parallel.
- Claude that opens browsers, hits APIs, reads live documentation. Not describing how. Doing it.
- A personal AI assistant for routine work that used to eat my mornings.

The loop changed. Small stuff runs in the background. I focus on what actually needs a human.

For any QA still copy-pasting between ChatGPT and an IDE, this workshop closes the gap.

Tutor: Anastasiia Babanina, ${tutorLinkedinUrl}

#QA #ClaudeCode #AITesting`
}

/** Trigger a file download for a blob. */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/** Word-wrap to at most maxLines lines, truncating with ellipsis. */
function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
  const words = text.split(' ')
  const lines = []
  let line = ''
  for (const w of words) {
    const test = line ? line + ' ' + w : w
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = w
      if (lines.length >= maxLines) break
    } else {
      line = test
    }
  }
  if (line && lines.length < maxLines) lines.push(line)

  // Truncate last with ellipsis if we ran out of lines
  if (lines.length === maxLines) {
    while (ctx.measureText(lines[maxLines - 1] + '…').width > maxWidth && lines[maxLines - 1].length > 1) {
      lines[maxLines - 1] = lines[maxLines - 1].slice(0, -1)
    }
    if (words.length > lines.join(' ').split(' ').length) {
      lines[maxLines - 1] += '…'
    }
  }

  lines.forEach((l, i) => ctx.fillText(l, x, y + i * lineHeight))
}
