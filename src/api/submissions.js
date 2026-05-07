import { supabase } from './supabase'

const VALID_CHARACTERS = ['violet', 'xaden', 'rhiannon', 'ridoc', 'liam', 'imogen']

export async function submitBot({ nickname, characterId, code, notes = null }) {
  if (!supabase) return { error: { message: 'Backend not configured' } }
  if (!nickname || !nickname.trim()) {
    return { error: { message: 'Nickname required' } }
  }
  if (!VALID_CHARACTERS.includes(characterId)) {
    return { error: { message: 'Unknown character' } }
  }
  if (!code || code.length < 20) {
    return { error: { message: 'Code is too short' } }
  }
  if (code.length > 8000) {
    return { error: { message: 'Code is too long (8000 char limit)' } }
  }

  const { data, error } = await supabase
    .from('bot_submissions')
    .insert({
      nickname: nickname.trim().toLowerCase(),
      character_id: characterId,
      code,
      notes,
    })
    .select('id, submitted_at')
    .single()

  if (error) return { error }
  return { data }
}

export async function getLatestSubmissionsByCharacter() {
  if (!supabase) return { data: [], error: null }
  // Get most recent submission per character via row_number window — but
  // Supabase JS client doesn't support window functions directly. Instead
  // fetch all sorted, then dedupe by character_id client-side.
  const { data, error } = await supabase
    .from('bot_submissions')
    .select('*')
    .order('submitted_at', { ascending: false })
    .limit(500)
  if (error) return { data: [], error }
  const seen = new Set()
  const latest = []
  for (const row of data || []) {
    if (seen.has(row.character_id)) continue
    seen.add(row.character_id)
    latest.push(row)
    if (latest.length === VALID_CHARACTERS.length) break
  }
  return { data: latest, error: null }
}
