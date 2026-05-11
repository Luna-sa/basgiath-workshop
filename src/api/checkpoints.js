import { supabase } from './supabase'
import { gsheetsEnabled, callAction } from './gsheetsClient'

/**
 * Workshop checkpoint tracking. Each student records when they
 * confirmed completion of each install/build step.
 *
 * Backend-agnostic: when VITE_GSHEETS_API is set we round-trip
 * through Apps Script (markCheckpoint / getStudent), otherwise we
 * use the legacy Supabase JSONB column.
 */

export const CHECKPOINT_IDS = ['parapet', 'forge', 'signet', 'bond', 'arena']
export const CHECKPOINT_LABELS = {
  parapet: 'Parapet',
  forge: 'Forge',
  signet: 'Signet',
  bond: 'Bond',
  arena: 'Arena',
}
export const CHECKPOINT_DESCRIPTIONS = {
  parapet: 'Claude Code installed + claude --version verified',
  forge: 'QA ecosystem installed (1 prompt)',
  signet: 'Personal CLAUDE.md generated + applied',
  bond: 'Dragon sealed into the Aerie',
  arena: 'Bot submitted to the Dragon Arena',
}

function looksLikeMissingColumn(err) {
  if (!err) return false
  const msg = (err.message || '') + ' ' + (err.hint || '')
  return /checkpoints.*does not exist|column.*checkpoints/i.test(msg)
}

export async function markCheckpoint(studentId, checkpointId) {
  if (!studentId) return { error: { message: 'No student id — register first' } }
  if (!CHECKPOINT_IDS.includes(checkpointId)) {
    return { error: { message: 'Unknown checkpoint' } }
  }

  if (gsheetsEnabled()) {
    try {
      const res = await callAction('markCheckpoint', { studentId, checkpointId })
      return { error: null, checkpoints: res?.checkpoints || {} }
    } catch (e) {
      return { error: { message: e.message || 'Apps Script error' } }
    }
  }

  if (!supabase) return { error: { message: 'Backend not configured' } }

  const { data: cur, error: readErr } = await supabase
    .from('students').select('checkpoints').eq('id', studentId).maybeSingle()
  if (readErr) {
    if (looksLikeMissingColumn(readErr)) {
      return { error: { message: 'Backend not migrated — run SUPABASE_MIGRATION_2026-05-08_checkpoints.sql in Supabase SQL Editor' } }
    }
    return { error: readErr }
  }
  const next = { ...(cur?.checkpoints || {}), [checkpointId]: new Date().toISOString() }
  const { error } = await supabase
    .from('students')
    .update({ checkpoints: next })
    .eq('id', studentId)
  if (looksLikeMissingColumn(error)) {
    return { error: { message: 'Backend not migrated — run SUPABASE_MIGRATION_2026-05-08_checkpoints.sql in Supabase SQL Editor' } }
  }
  return { error, checkpoints: next }
}

export async function getCheckpoints(studentId) {
  if (!studentId) return { data: {}, error: null }

  if (gsheetsEnabled()) {
    try {
      const student = await callAction('getStudent', { studentId })
      let cp = student?.checkpoints
      if (typeof cp === 'string') {
        try { cp = JSON.parse(cp) } catch { cp = {} }
      }
      return { data: cp || {}, error: null }
    } catch (e) {
      return { data: {}, error: null }
    }
  }

  if (!supabase) return { data: {}, error: null }
  const { data, error } = await supabase
    .from('students').select('checkpoints').eq('id', studentId).maybeSingle()
  if (looksLikeMissingColumn(error)) {
    return { data: {}, error: null }
  }
  return { data: data?.checkpoints || {}, error }
}
