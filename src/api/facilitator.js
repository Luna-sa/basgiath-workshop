import { supabase } from './supabase'
import { gsheetsEnabled, callAction } from './gsheetsClient'

const FACILITATOR_TOKEN = import.meta.env.VITE_FACILITATOR_TOKEN

export function isFacilitator() {
  const params = new URLSearchParams(window.location.search)
  return params.get('token') === FACILITATOR_TOKEN || params.get('role') === 'facilitator'
}

// ─── Common helper for facilitator state patches ──────────────────
async function patchFacilitatorState(patch) {
  if (gsheetsEnabled()) {
    return callAction('setFacilitatorState', { patch })
  }
  if (!supabase) return
  await supabase
    .from('facilitator_state')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', 1)
}

export async function advanceAll(toPage) {
  return patchFacilitatorState({ unlocked_page: toPage })
}

export async function setWorkshopPhase(phase) {
  return patchFacilitatorState({ workshop_phase: phase })
}

export async function startTimer(durationSeconds, pageIndex) {
  return patchFacilitatorState({
    active_timer_start: new Date().toISOString(),
    active_timer_duration: durationSeconds,
    active_timer_page: pageIndex,
  })
}

export async function stopTimer() {
  return patchFacilitatorState({
    active_timer_start: '',
    active_timer_duration: '',
    active_timer_page: '',
  })
}

export async function getAllStudents() {
  if (gsheetsEnabled()) {
    try {
      const res = await callAction('listStudents')
      const list = res?.students || []
      // sort newest first
      return list.sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))
    } catch (e) {
      console.warn('getAllStudents (gsheets) failed:', e.message)
      return []
    }
  }
  if (!supabase) return []
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return []
  return data || []
}

export async function awardXp(studentId, amount) {
  // XP isn't tracked in the Apps Script backend yet — workshop uses
  // checkpoints + dragon votes instead. No-op on gsheets.
  if (gsheetsEnabled()) return { error: null, xp: 0 }
  if (!supabase) return { error: 'no supabase' }
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
  return patchFacilitatorState({
    announcement: message || '',
    announcement_at: message ? new Date().toISOString() : '',
  })
}

export async function getPrizes() {
  // No prizes table on gsheets backend — feature is Supabase-only legacy.
  if (gsheetsEnabled()) return { data: [], error: null }
  if (!supabase) return { data: [], error: null }
  const { data, error } = await supabase
    .from('prizes')
    .select('*, awarded_to:awarded_to_student_id (id, name, nickname)')
    .order('position')
  return { data: data || [], error }
}

export async function updatePrize(position, fields) {
  if (gsheetsEnabled()) return { error: null }
  if (!supabase) return { error: 'no supabase' }
  const { error } = await supabase
    .from('prizes')
    .update(fields)
    .eq('position', position)
  return { error }
}

export async function deleteStudent(studentId) {
  // Not yet wired to Apps Script — facilitator can delete the row
  // directly in the Google Sheet when on gsheets.
  if (gsheetsEnabled()) {
    return { error: { message: 'Delete a student by removing the row in the Google Sheet directly.' } }
  }
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
