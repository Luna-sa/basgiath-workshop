import { supabase } from './supabase'

/**
 * Eyes of the Aerie — blind matching round.
 *
 * Each voter sees the anonymised dragon gallery and tries to guess
 * which rider made which dragon. One guess per dragon. Scoring is
 * simply `is_correct = (guessed_nickname == dragon.nickname)`.
 */

/** Submit a single guess. Replaces prior guess on the same dragon for this voter. */
export async function submitGuess({ voterNickname, dragonId, dragonOwnerNickname, guessedNickname }) {
  if (!supabase) throw new Error('Supabase not configured')
  if (!voterNickname || !dragonId || !guessedNickname) {
    throw new Error('voterNickname, dragonId and guessedNickname required')
  }
  const isCorrect = (dragonOwnerNickname || '').toLowerCase() === guessedNickname.toLowerCase()

  // Upsert via delete + insert (unique index uniq_match_voter_dragon)
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
  if (!supabase || !voterNickname) return []
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
  if (!supabase) return []
  const { data, error } = await supabase
    .from('dragon_matches')
    .select('voter_nickname, is_correct')
  if (error) {
    console.warn('getMatchLeaderboard failed:', error.message)
    return []
  }
  // Aggregate client-side — small data.
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

/** Realtime subscribe to all match changes. */
export function subscribeToMatches(onChange) {
  if (!supabase) return () => {}
  const channel = supabase
    .channel('aerie-matches')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'dragon_matches' }, onChange)
    .subscribe()
  return () => {
    try { supabase.removeChannel(channel) } catch {}
  }
}
