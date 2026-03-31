import { supabase } from './supabase'

export async function syncProgress(studentId, state) {
  if (!supabase || !studentId) return

  const { error } = await supabase
    .from('students')
    .update({
      current_page: state.currentPage,
      current_sub_step: state.currentSubStep,
      xp: state.xp,
      badges: state.badges,
      completed_pages: state.completedPages,
      completed_sub_steps: state.completedSubSteps,
      quiz_score: state.quizScore,
      workshop_phase: state.workshopPhase,
      last_seen: new Date().toISOString(),
    })
    .eq('id', studentId)

  if (error) console.error('Sync error:', error)
}

export async function getFacilitatorState() {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('facilitator_state')
    .select('*')
    .eq('id', 1)
    .single()

  if (error) {
    console.error('Facilitator state error:', error)
    return null
  }
  return data
}
