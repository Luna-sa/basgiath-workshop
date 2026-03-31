import { supabase } from './supabase'

const FACILITATOR_TOKEN = import.meta.env.VITE_FACILITATOR_TOKEN

export function isFacilitator() {
  const params = new URLSearchParams(window.location.search)
  return params.get('token') === FACILITATOR_TOKEN || params.get('role') === 'facilitator'
}

export async function advanceAll(toPage) {
  if (!supabase) return
  await supabase
    .from('facilitator_state')
    .update({ unlocked_page: toPage, updated_at: new Date().toISOString() })
    .eq('id', 1)
}

export async function setWorkshopPhase(phase) {
  if (!supabase) return
  await supabase
    .from('facilitator_state')
    .update({ workshop_phase: phase, updated_at: new Date().toISOString() })
    .eq('id', 1)
}

export async function startTimer(durationSeconds, pageIndex) {
  if (!supabase) return
  await supabase
    .from('facilitator_state')
    .update({
      active_timer_start: new Date().toISOString(),
      active_timer_duration: durationSeconds,
      active_timer_page: pageIndex,
      updated_at: new Date().toISOString(),
    })
    .eq('id', 1)
}

export async function stopTimer() {
  if (!supabase) return
  await supabase
    .from('facilitator_state')
    .update({
      active_timer_start: null,
      active_timer_duration: null,
      active_timer_page: null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', 1)
}

export async function getAllStudents() {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .order('xp', { ascending: false })
  if (error) return []
  return data || []
}
