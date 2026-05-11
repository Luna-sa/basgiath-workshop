import { supabase } from './supabase'
import { gsheetsEnabled, callAction } from './gsheetsClient'

const BUCKET = 'dragons'

/**
 * Upload a base64-encoded PNG to Supabase storage. Returns the public URL.
 * Only used by the legacy Supabase path.
 */
async function uploadImageSupabase(nickname, imageB64) {
  const blob = await b64ToBlob(imageB64, 'image/png')
  const path = `${nickname.toLowerCase()}-${Date.now()}.png`
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, { contentType: 'image/png', upsert: true })
  if (error) throw error
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

async function b64ToBlob(b64, mimeType) {
  const bin = atob(b64)
  const arr = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i)
  return new Blob([arr], { type: mimeType })
}

/**
 * Seal a dragon — upload image + store the row.
 *
 *   nickname        — required, public identifier in Aerie
 *   characterId     — optional (selected Threshing archetype)
 *   answers         — full Bond Ritual answers map
 *   imageB64        — base64 PNG returned by /api/workshop/generate-dragon
 *   prompt          — final prompt used
 *   modelUsed       — gpt-image-2 / gpt-image-1
 *   studentId       — optional (links to students table)
 */
export async function sealDragon({ nickname, characterId, answers, imageB64, prompt, modelUsed, studentId }) {
  if (!nickname) throw new Error('Nickname required')
  if (!imageB64) throw new Error('Image required')

  if (gsheetsEnabled()) {
    // Apps Script uploads to Google Drive and writes the row in one call.
    const res = await callAction('sealDragon', {
      nickname,
      studentId,
      characterId,
      answers,
      imageB64,
      prompt,
      modelUsed,
    })
    // Apps Script returns the persisted record with `answers` still
    // as a JSON string; normalise it.
    let parsedAnswers = res?.answers
    if (typeof parsedAnswers === 'string') {
      try { parsedAnswers = JSON.parse(parsedAnswers) } catch { /* keep string */ }
    }
    return { ...res, answers: parsedAnswers }
  }

  // Legacy Supabase path
  if (!supabase) throw new Error('Supabase not configured')
  const imageUrl = await uploadImageSupabase(nickname, imageB64)
  await supabase.from('dragons').delete().eq('nickname', nickname.toLowerCase())
  const { data, error } = await supabase
    .from('dragons')
    .insert({
      nickname: nickname.toLowerCase(),
      student_id: studentId || null,
      character_id: characterId || null,
      name: (answers.name || '').trim() || 'Unnamed',
      answers,
      prompt: prompt || null,
      image_url: imageUrl,
      model_used: modelUsed || null,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

/** Get all dragons in Aerie, sorted by vote count desc then sealed_at. */
export async function listDragons() {
  if (gsheetsEnabled()) {
    try {
      const res = await callAction('listDragons')
      return res?.dragons || []
    } catch (e) {
      console.warn('listDragons (gsheets) failed:', e.message)
      return []
    }
  }
  if (!supabase) return []
  const { data, error } = await supabase
    .from('dragons')
    .select('*')
    .order('vote_count', { ascending: false })
    .order('sealed_at', { ascending: true })
  if (error) {
    console.warn('listDragons failed:', error.message)
    return []
  }
  return data || []
}

export const MAX_VOTES_PER_VOTER = 3

/**
 * Get all votes by this voter. Returns array of { dragon_id, created_at }.
 * Empty array if no votes / nickname missing.
 */
export async function getMyVotes(voterNickname) {
  if (!voterNickname) return []
  if (gsheetsEnabled()) {
    try {
      const res = await callAction('getMyVotes', { voterNickname })
      return res?.votes || []
    } catch (e) {
      console.warn('getMyVotes (gsheets) failed:', e.message)
      return []
    }
  }
  if (!supabase) return []
  const { data, error } = await supabase
    .from('dragon_votes')
    .select('dragon_id, created_at')
    .eq('voter_nickname', voterNickname.toLowerCase())
  if (error) {
    console.warn('getMyVotes failed:', error.message)
    return []
  }
  return data || []
}

/** Back-compat: single-vote getter — returns first vote or null. */
export async function getMyVote(voterNickname) {
  const votes = await getMyVotes(voterNickname)
  return votes[0] || null
}

/**
 * Cast a vote. Up to MAX_VOTES_PER_VOTER (3) different dragons.
 * Idempotent — voting for the same dragon twice is a no-op.
 * Returns { dragon_id, votes_used, max } or throws QUOTA_EXCEEDED.
 */
export async function voteForDragon(voterNickname, dragonId) {
  if (!voterNickname) throw new Error('Nickname required to vote')
  if (gsheetsEnabled()) {
    const res = await callAction('voteForDragon', { voterNickname, dragonId })
    if (res?.error === 'QUOTA_EXCEEDED' || res?.code === 'QUOTA_EXCEEDED') {
      const e = new Error('You have used all 3 votes. Withdraw one to switch.')
      e.code = 'QUOTA_EXCEEDED'
      throw e
    }
    return res
  }
  if (!supabase) throw new Error('Supabase not configured')
  // Client-side quota check on the legacy path
  const existing = await getMyVotes(voterNickname)
  if (existing.some(v => v.dragon_id === dragonId)) return { alreadyCast: true }
  if (existing.length >= MAX_VOTES_PER_VOTER) {
    const e = new Error('You have used all 3 votes. Withdraw one to switch.')
    e.code = 'QUOTA_EXCEEDED'
    throw e
  }
  const { error } = await supabase
    .from('dragon_votes')
    .insert({ voter_nickname: voterNickname.toLowerCase(), dragon_id: dragonId })
  if (error) throw error
  return { dragon_id: dragonId, votes_used: existing.length + 1, max: MAX_VOTES_PER_VOTER }
}

/**
 * Withdraw a vote. If dragonId is given — removes that specific vote.
 * If omitted — removes ALL votes by this voter (used for "reset my picks").
 */
export async function withdrawVote(voterNickname, dragonId) {
  if (!voterNickname) return
  if (gsheetsEnabled()) {
    return callAction('withdrawVote', { voterNickname, dragonId })
  }
  if (!supabase) return
  let q = supabase.from('dragon_votes').delete().eq('voter_nickname', voterNickname.toLowerCase())
  if (dragonId) q = q.eq('dragon_id', dragonId)
  await q
}

/**
 * Subscribe to Aerie changes. With Supabase realtime we used a
 * push channel. With Apps Script there's no realtime — we fall
 * back to polling every 5 seconds.
 *
 * Returns an unsubscribe function.
 */
export function subscribeToAerie(onChange) {
  if (gsheetsEnabled()) {
    const interval = setInterval(() => {
      try { onChange() } catch {}
    }, 5000)
    return () => clearInterval(interval)
  }
  if (!supabase) return () => {}
  const channel = supabase
    .channel('aerie-dragons')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'dragons' }, onChange)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'dragon_votes' }, onChange)
    .subscribe()
  return () => {
    try { supabase.removeChannel(channel) } catch {}
  }
}
