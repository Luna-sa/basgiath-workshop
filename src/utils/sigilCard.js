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

  // Eyebrow line: "◆ BASGIATH · <date>"
  const dateStr = typeof date === 'string'
    ? date
    : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

  ctx.font = '600 16px "JetBrains Mono", monospace'
  ctx.fillStyle = COLORS.teal
  ctx.textBaseline = 'top'
  ctx.fillText('◆ BASGIATH ACADEMY · ' + dateStr, FOOTER_X, PORTRAIT_H + 30)

  // Dragon name — display italic, large
  ctx.font = 'italic 700 64px "Playfair Display", Georgia, serif'
  ctx.fillStyle = COLORS.white
  ctx.fillText(name, FOOTER_X, PORTRAIT_H + 62)

  // Rider nickname — mono
  ctx.font = '500 18px "JetBrains Mono", monospace'
  ctx.fillStyle = COLORS.textDim
  ctx.fillText('rider · ', FOOTER_X, PORTRAIT_H + 138)
  const riderLabel = 'rider · '
  const riderLabelWidth = ctx.measureText(riderLabel).width
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
