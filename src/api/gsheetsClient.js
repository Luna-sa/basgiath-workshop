/**
 * Apps Script Web App client.
 *
 * Routes every persistence call through a single POST endpoint.
 * `VITE_GSHEETS_API` env var holds the deployment URL. If unset,
 * `gsheetsEnabled()` returns false and callers can fall back to
 * the legacy Supabase path (so deploys don't break before the
 * Apps Script is wired up).
 *
 * Apps Script Web Apps can't return non-200 status codes, so we
 * inspect `data.error` and surface it as a thrown Error.
 */

const BASE = import.meta.env.VITE_GSHEETS_API || ''

export function gsheetsEnabled() {
  return Boolean(BASE && /^https:\/\/script\.google\.com\//.test(BASE))
}

/**
 * Apps Script Web App is *not* CORS-friendly when sending custom
 * Content-Type headers — the browser preflight fails. The trick is
 * to send the body as `text/plain` so it skips preflight. Apps
 * Script reads the raw body from `e.postData.contents` regardless.
 */
// Apps Script can hang silently when a deployment URL is stale or
// the script account hits a quota — without a timeout the UI just
// shows the "checking..." button forever. Cap every request at 15s
// and surface a meaningful error so the caller can fall back / retry.
const DEFAULT_TIMEOUT_MS = 15000

export async function callAction(action, payload = {}, { timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  if (!gsheetsEnabled()) {
    throw new Error('VITE_GSHEETS_API not configured')
  }
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(BASE, {
      method: 'POST',
      // text/plain dodges CORS preflight; Apps Script still gets the body
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action, ...payload }),
      redirect: 'follow',
      signal: controller.signal,
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`gsheets ${action} HTTP ${res.status}: ${text.slice(0, 200)}`)
    }
    const data = await res.json()
    if (data && data.error) {
      const e = new Error(data.error)
      if (data.code) e.code = data.code
      throw e
    }
    return data
  } catch (err) {
    if (err?.name === 'AbortError') {
      const e = new Error(`gsheets ${action} timed out after ${timeoutMs}ms`)
      e.code = 'TIMEOUT'
      throw e
    }
    throw err
  } finally {
    clearTimeout(timer)
  }
}
