import { supabase } from './supabase'
import { gsheetsEnabled, callAction } from './gsheetsClient'

const VALID_CHARACTERS = ['violet', 'xaden', 'rhiannon', 'ridoc', 'liam', 'imogen']

export async function submitBot({ nickname, characterId, code, notes = null, studentId = null }) {
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

  if (gsheetsEnabled()) {
    try {
      const res = await callAction('submitBot', {
        nickname: nickname.trim().toLowerCase(),
        characterId,
        botCode: code,
        studentId,
      })
      return { data: { id: res.id, submitted_at: res.submitted_at }, error: null }
    } catch (e) {
      return { error: { message: e.message } }
    }
  }

  if (!supabase) return { error: { message: 'Backend not configured' } }
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
  if (gsheetsEnabled()) {
    try {
      const res = await callAction('getLatestSubmissionsByCharacter')
      return { data: res?.submissions || [], error: null }
    } catch (e) {
      return { data: [], error: { message: e.message } }
    }
  }
  if (!supabase) return { data: [], error: null }
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
