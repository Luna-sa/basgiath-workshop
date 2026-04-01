import { supabase } from './supabase'

export const ROUND_CONFIG = {
  'round-1': { pageIndex: 11, type: 'test-cases', duration: 420, title: 'Тест-кейсы' },
  'round-2': { pageIndex: 12, type: 'bug-report', duration: 420, title: 'Баг-репорт' },
}

// Student submits a round entry
export async function submitRoundEntry(studentId, pageIndex, roundId, score, maxScore, xpBonus, data, timerStart) {
  if (!supabase || !studentId) return null

  try {
    const durationSeconds = Math.round((Date.now() - new Date(timerStart).getTime()) / 1000)

    const { data: result, error } = await supabase
      .from('submissions')
      .insert({
        student_id: studentId,
        page_index: pageIndex,
        round_id: roundId,
        type: data?.type || 'ai-review',
        score,
        max_score: maxScore,
        xp_bonus: xpBonus,
        data,
        duration_seconds: durationSeconds,
        timer_start: timerStart,
      })
      .select('id, duration_seconds, submitted_at')
      .single()

    if (error) { console.warn('Submit round entry error:', error); return null }
    return result
  } catch (e) {
    console.warn('Submit round entry failed:', e.message)
    return null
  }
}

// Facilitator: get all submissions for a round
export async function getRoundSubmissions(roundId) {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('submissions')
    .select('*, students(name, character_id)')
    .eq('round_id', roundId)
    .order('score', { ascending: false })
    .order('duration_seconds', { ascending: true })

  if (error) { console.warn('Get round submissions error:', error); return [] }
  return data || []
}

// Get top 3 winners for a round
export async function getRoundWinners(roundId) {
  if (!supabase) return []

  // Try RPC first
  const { data, error } = await supabase.rpc('get_round_winners', { p_round_id: roundId })

  if (!error && data) return data

  // Fallback: manual query
  const { data: subs } = await supabase
    .from('submissions')
    .select('student_id, score, duration_seconds, students(name, character_id)')
    .eq('round_id', roundId)
    .not('score', 'is', null)
    .order('score', { ascending: false })
    .order('duration_seconds', { ascending: true })
    .limit(3)

  return (subs || []).map((s, i) => ({
    student_id: s.student_id,
    name: s.students?.name,
    character_id: s.students?.character_id,
    score: s.score,
    duration_seconds: s.duration_seconds,
    rank: i + 1,
  }))
}

// Facilitator: start a round
export async function startRound(roundId) {
  if (!supabase) return
  const config = ROUND_CONFIG[roundId]
  if (!config) return

  await supabase
    .from('facilitator_state')
    .update({
      active_round_id: roundId,
      active_timer_start: new Date().toISOString(),
      active_timer_duration: config.duration,
      active_timer_page: config.pageIndex,
      round_ended: false,
      round_winners: null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', 1)
}

// Facilitator: end a round (early or on timer)
export async function endRound(roundId) {
  if (!supabase) return

  // Get winners
  const winners = await getRoundWinners(roundId)

  await supabase
    .from('facilitator_state')
    .update({
      round_ended: true,
      round_winners: winners,
      active_round_id: null,
      active_timer_start: null,
      active_timer_duration: null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', 1)

  return winners
}
