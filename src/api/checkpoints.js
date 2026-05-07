import { supabase } from './supabase'

/**
 * Workshop checkpoint tracking. Each student records when they
 * confirmed completion of each install/build step. Stored as a
 * JSONB column on students:
 *   checkpoints: { parapet?, forge?, signet?, arena? }
 *
 * Checkpoint IDs:
 *   parapet — Claude Code installed and `claude --version` verified
 *   forge   — QA ecosystem installed (CLAUDE.md + commands + agents + MCP)
 *   signet  — Personal CLAUDE.md generated and applied
 *   arena   — Bot submitted to Dragon Arena (auto-set on submit)
 */

export const CHECKPOINT_IDS = ['parapet', 'forge', 'signet', 'arena']
export const CHECKPOINT_LABELS = {
  parapet: 'Parapet',
  forge: 'Forge',
  signet: 'Signet',
  arena: 'Arena',
}
export const CHECKPOINT_DESCRIPTIONS = {
  parapet: 'Claude Code installed + claude --version verified',
  forge: 'QA ecosystem installed (1 prompt)',
  signet: 'Personal CLAUDE.md generated + applied',
  arena: 'Bot submitted to the Dragon Arena',
}

function looksLikeMissingColumn(err) {
  if (!err) return false
  const msg = (err.message || '') + ' ' + (err.hint || '')
  return /checkpoints.*does not exist|column.*checkpoints/i.test(msg)
}

export async function markCheckpoint(studentId, checkpointId) {
  if (!supabase) return { error: { message: 'Backend not configured' } }
  if (!studentId) return { error: { message: 'No student id — register first' } }
  if (!CHECKPOINT_IDS.includes(checkpointId)) {
    return { error: { message: 'Unknown checkpoint' } }
  }
  // Read-modify-write the JSONB blob (good enough for workshop scale)
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
  if (!supabase || !studentId) return { data: {}, error: null }
  const { data, error } = await supabase
    .from('students').select('checkpoints').eq('id', studentId).maybeSingle()
  if (looksLikeMissingColumn(error)) {
    // Soft-fail so the page still renders without the column
    return { data: {}, error: null }
  }
  return { data: data?.checkpoints || {}, error }
}
