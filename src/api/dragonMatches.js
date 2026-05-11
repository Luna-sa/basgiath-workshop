import { supabase } from './supabase'
import { gsheetsEnabled, callAction } from './gsheetsClient'

/**
 * Eyes of the Aerie — blind matching round.
 *
 * Each voter sees the anonymised dragon gallery and tries to guess
 * which rider made which dragon. One guess per dragon. Scoring is
 * simply `is_correct = (guessed_nickname == dragon.nickname)`.
 */

/** Submit a single guess. Replaces prior guess on the same dragon for this voter. */
export async function submitGuess({ voterNickname, dragonId, dragonOwnerNickname, guessedNickname }) {
  if (!voterNickname || !dragonId || !guessedNickname) {
    throw new Error('voterNickname, dragonId and guessedNickname required')
  }

  if (gsheetsEnabled()) {
    const res = await callAction('submitGuess', {
      voterNickname, dragonId, dragonOwnerNickname, guessedNickname,
    })
    return { isCorrect: !!res?.is_correct }
  }

  if (!supabase) throw new Error('Supabase not configured')
  const isCorrect = (dragonOwnerNickname || '').toLowerCase() === guessedNickname.toLowerCase()
  await supabase
    .from('dragon_matches')
    .delete()
    .eq('voter_nickname', voterNickname.toLowerCase())
    .eq('dragon_id', dragonId)
  const { error } = await supabase.from('dragon_matches').insert({
    voter_nickname: voterNickname.toLowerCase(),
    dragon_id: dragonId,
    guessed_nickname: guessedNickname.toLowerCase(),
    is_correct: isCorrect,
  })
  if (error) throw error
  return { isCorrect }
}

/** Get the current voter's guesses for all dragons in the round. */
export async function getMyGuesses(voterNickname) {
  if (!voterNickname) return []
  if (gsheetsEnabled()) {
    try {
      const res = await callAction('getMyGuesses', { voterNickname })
      return res?.guesses || []
    } catch (e) {
      console.warn('getMyGuesses (gsheets) failed:', e.message)
      return []
    }
  }
  if (!supabase) return []
  const { data, error } = await supabase
    .from('dragon_matches')
    .select('dragon_id, guessed_nickname, is_correct, submitted_at')
    .eq('voter_nickname', voterNickname.toLowerCase())
  if (error) {
    console.warn('getMyGuesses failed:', error.message)
    return []
  }
  return data || []
}

/** Get the leaderboard — voters ranked by number of correct guesses. */
export async function getMatchLeaderboard() {
  if (gsheetsEnabled()) {
    try {
      const res = await callAction('getMatchLeaderboard')
      return res?.leaderboard || []
    } catch (e) {
      console.warn('getMatchLeaderboard (gsheets) failed:', e.message)
      return []
    }
  }
  if (!supabase) return []
  const { data, error } = await supabase
    .from('dragon_matches')
    .select('voter_nickname, is_correct')
  if (error) {
    console.warn('getMatchLeaderboard failed:', error.message)
    return []
  }
  const byVoter = {}
  for (const m of (data || [])) {
    const k = m.voter_nickname
    if (!byVoter[k]) byVoter[k] = { voter_nickname: k, correct: 0, total: 0 }
    byVoter[k].total += 1
    if (m.is_correct) byVoter[k].correct += 1
  }
  return Object.values(byVoter).sort((a, b) => {
    if (b.correct !== a.correct) return b.correct - a.correct
    return a.total - b.total
  })
}

/** Subscribe to match changes — Apps Script falls back to polling. */
export function subscribeToMatches(onChange) {
  if (gsheetsEnabled()) {
    const interval = setInterval(() => {
      try { onChange() } catch {}
    }, 5000)
    return () => clearInterval(interval)
  }
  if (!supabase) return () => {}
  const channel = supabase
    .channel('aerie-matches')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'dragon_matches' }, onChange)
    .subscribe()
  return () => {
    try { supabase.removeChannel(channel) } catch {}
  }
}
