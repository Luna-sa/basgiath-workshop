/**
 * Client for the workshop's backend proxy (hosted on
 * chatbot-mentor.onrender.com). Two endpoints:
 *
 *   POST /api/workshop/transcribe        — audio blob → { transcript }
 *   POST /api/workshop/generate-dragon   — { prompt } → { model, image_b64, url }
 *
 * Base URL is configurable via VITE_WORKSHOP_API (defaults to the
 * production chatbot-mentor host so previews work out of the box).
 */

const BASE = import.meta.env.VITE_WORKSHOP_API || 'https://chatbot-mentor.onrender.com'

export async function transcribeAudio(audioBlob, mimeType = 'audio/webm') {
  const res = await fetch(`${BASE}/api/workshop/transcribe`, {
    method: 'POST',
    headers: { 'Content-Type': mimeType },
    body: audioBlob,
  })
  if (!res.ok) {
    const detail = await safeReadError(res)
    throw new Error(`transcribe failed (${res.status}): ${detail}`)
  }
  const data = await res.json()
  return data.transcript || ''
}

export async function assignRiderClass({ signet, dragon }) {
  const res = await fetch(`${BASE}/api/workshop/assign-class`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ signet, dragon }),
  })
  if (!res.ok) {
    const detail = await safeReadError(res)
    throw new Error(`class assignment failed (${res.status}): ${detail}`)
  }
  return res.json() // { class, class_name, class_meaning, epithet, reason }
}

export async function generateDragonImage({ prompt, size = '1024x1024', quality = 'high' }) {
  const res = await fetch(`${BASE}/api/workshop/generate-dragon`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, size, quality }),
  })
  if (!res.ok) {
    const detail = await safeReadError(res)
    throw new Error(`generation failed (${res.status}): ${detail}`)
  }
  return res.json() // { model, image_b64, url, revised_prompt }
}

async function safeReadError(res) {
  try {
    const j = await res.json()
    return j.error || JSON.stringify(j)
  } catch {
    return res.statusText || 'unknown'
  }
}
