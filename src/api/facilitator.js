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
    .order('created_at', { ascending: false })
  if (error) return []
  return data || []
}

export async function awardXp(studentId, amount) {
  if (!supabase) return { error: 'no supabase' }
  // Read current XP, add, write back. (Not atomic but ok for facilitator.)
  const { data: cur, error: readErr } = await supabase
    .from('students').select('xp').eq('id', studentId).maybeSingle()
  if (readErr) return { error: readErr }
  const newXp = (cur?.xp || 0) + amount
  const { error } = await supabase
    .from('students')
    .update({ xp: newXp })
    .eq('id', studentId)
  return { error, xp: newXp }
}

export async function setAnnouncement(message) {
  if (!supabase) return { error: 'no supabase' }
  const { error } = await supabase
    .from('facilitator_state')
    .update({
      announcement: message || null,
      announcement_at: message ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', 1)
  return { error }
}

export async function getPrizes() {
  if (!supabase) return { data: [], error: null }
  const { data, error } = await supabase
    .from('prizes')
    .select('*, awarded_to:awarded_to_student_id (id, name, nickname)')
    .order('position')
  return { data: data || [], error }
}

export async function updatePrize(position, fields) {
  if (!supabase) return { error: 'no supabase' }
  const { error } = await supabase
    .from('prizes')
    .update(fields)
    .eq('position', position)
  return { error }
}

export async function deleteStudent(studentId) {
  if (!supabase) return { error: 'no supabase' }
  const { data, error } = await supabase
    .from('students')
    .delete()
    .eq('id', studentId)
    .select()
  if (error) return { error }
  if (!data || data.length === 0) {
    return {
      error: {
        message: 'Delete blocked by RLS. Run SUPABASE_MIGRATION_2026-05-07_delete_policy.sql in Supabase SQL Editor.'
      }
    }
  }
  return { error: null }
}
