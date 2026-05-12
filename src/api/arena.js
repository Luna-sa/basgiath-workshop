import { gsheetsEnabled, callAction } from './gsheetsClient'

/**
 * Arena v2 — per-run scoring API.
 *
 * Each participant plays up to 5 runs vs 5 AI rivals. Each run's score
 * is persisted; total = SUM(scores). Leaderboard aggregates by nickname.
 *
 * Backend is Google Apps Script (sheet `arena_runs`) — no Supabase
 * fallback for v2 because workshop migrated fully off Supabase. If
 * VITE_GSHEETS_API isn't set, all calls noop with empty data so the
 * UI degrades gracefully instead of crashing.
 */

const MAX_RUNS = 5

export function maxArenaRuns() {
  return MAX_RUNS
}

/**
 * Record a single completed run. Idempotent on (nickname, characterId,
 * runNumber) — re-submit with same key overwrites, so flaky-network
 * retries don't double-count.
 *
 * @param {object} payload
 * @param {string} payload.nickname        — lowercase workshop handle
 * @param {string} payload.characterId     — violet|xaden|rhiannon|ridoc|liam|imogen
 * @param {number} payload.runNumber       — 1..5
 * @param {number} payload.score           — final run score
 * @param {object} payload.breakdown       — { starsCollected, fireStars, maxCombo, wallsHit, patternHit, signetUsed, ticksAlive, botCrashed }
 * @param {object} [payload.runLog]        — optional event timeline (≤80 events)
 * @param {string} [payload.botCodeSnapshot] — the code that produced this run
 * @param {string} [payload.studentId]     — optional, for joins
 */
export async function recordArenaRun(payload) {
  if (!gsheetsEnabled()) return { ok: false, error: 'backend-not-configured' }
  const b = payload.breakdown || {}
  try {
    const res = await callAction('recordArenaRun', {
      nickname: payload.nickname,
      characterId: payload.characterId,
      runNumber: payload.runNumber,
      score: payload.score,
      starsCollected: b.starsCollected || 0,
      fireStars: b.fireStars || 0,
      maxCombo: b.maxCombo || 0,
      wallsHit: b.wallsHit || 0,
      patternHit: !!b.patternHit,
      signetUsed: !!b.signetUsed,
      ticksAlive: b.ticksAlive || 0,
      botCrashed: !!b.botCrashed,
      runLog: payload.runLog || null,
      botCodeSnapshot: payload.botCodeSnapshot || '',
      studentId: payload.studentId || '',
    })
    return { ok: true, ...res }
  } catch (e) {
    return { ok: false, error: e.message }
  }
}

/**
 * Fetch this participant's run history (slim — no run_log_json or code).
 * Used by the right-panel scoreboard.
 */
export async function getMyArenaRuns(nickname, characterId) {
  if (!gsheetsEnabled() || !nickname) {
    return { runs: [], max: MAX_RUNS }
  }
  try {
    const res = await callAction('getMyArenaRuns', { nickname, characterId })
    return { runs: res.runs || [], max: res.max || MAX_RUNS }
  } catch (e) {
    console.warn('[arena] getMyArenaRuns failed:', e.message)
    return { runs: [], max: MAX_RUNS, error: e.message }
  }
}

/**
 * Aggregated leaderboard — total_score DESC, then best_run, fire stars,
 * earliest PB run number.
 */
export async function getArenaLeaderboard() {
  if (!gsheetsEnabled()) return { leaderboard: [], max: MAX_RUNS }
  try {
    const res = await callAction('getArenaLeaderboard')
    return { leaderboard: res.leaderboard || [], max: res.max || MAX_RUNS }
  } catch (e) {
    console.warn('[arena] getArenaLeaderboard failed:', e.message)
    return { leaderboard: [], max: MAX_RUNS, error: e.message }
  }
}

/**
 * Facilitator escape hatch — wipe a participant's runs (e.g. test data).
 */
export async function resetArenaRuns(nickname) {
  if (!gsheetsEnabled() || !nickname) return { ok: false }
  try {
    const res = await callAction('resetArenaRuns', { nickname })
    return { ok: true, deleted: res.deleted || 0 }
  } catch (e) {
    return { ok: false, error: e.message }
  }
}
