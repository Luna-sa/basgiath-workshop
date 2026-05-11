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

/** Get the current voter's existing vote (or null). */
export async function getMyVote(voterNickname) {
  if (!voterNickname) return null
  if (gsheetsEnabled()) {
    try {
      const res = await callAction('getMyVote', { voterNickname })
      return res || null
    } catch (e) {
      console.warn('getMyVote (gsheets) failed:', e.message)
      return null
    }
  }
  if (!supabase) return null
  const { data, error } = await supabase
    .from('dragon_votes')
    .select('dragon_id, created_at')
    .eq('voter_nickname', voterNickname.toLowerCase())
    .maybeSingle()
  if (error) {
    console.warn('getMyVote failed:', error.message)
    return null
  }
  return data
}

/** Cast a vote — if user already voted, replaces previous. */
export async function voteForDragon(voterNickname, dragonId) {
  if (!voterNickname) throw new Error('Nickname required to vote')
  if (gsheetsEnabled()) {
    return callAction('voteForDragon', { voterNickname, dragonId })
  }
  if (!supabase) throw new Error('Supabase not configured')
  await supabase.from('dragon_votes').delete().eq('voter_nickname', voterNickname.toLowerCase())
  const { error } = await supabase
    .from('dragon_votes')
    .insert({ voter_nickname: voterNickname.toLowerCase(), dragon_id: dragonId })
  if (error) throw error
}

/** Withdraw a vote. */
export async function withdrawVote(voterNickname) {
  if (!voterNickname) return
  if (gsheetsEnabled()) {
    return callAction('withdrawVote', { voterNickname })
  }
  if (!supabase) return
  await supabase.from('dragon_votes').delete().eq('voter_nickname', voterNickname.toLowerCase())
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
