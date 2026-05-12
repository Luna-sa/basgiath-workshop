import { supabase } from '../api/supabase'
import { syncProgress, getFacilitatorState } from '../api/progress'
import { gsheetsEnabled } from '../api/gsheetsClient'
import { useWorkshopStore } from './workshopStore'

let syncInterval = null
let pollInterval = null
let realtimeChannel = null
let started = false
let realtimeConnected = false

export function startSync() {
  if (started) return
  started = true

  // Periodic student-progress writeback. On gsheets this is a no-op
  // because syncProgress short-circuits, so we just keep the interval
  // cheap on the Supabase path.
  syncInterval = setInterval(() => {
    const state = useWorkshopStore.getState()
    if (state.user.id) {
      syncProgress(state.user.id, state).catch(() => {})
    }
  }, 30000)

  // Apps Script has no realtime — poll only.
  if (gsheetsEnabled()) {
    startPolling()
    return
  }

  if (!supabase) return

  // Try Realtime first (Supabase only)
  try {
    realtimeChannel = supabase
      .channel('facilitator-updates')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'facilitator_state' },
        (payload) => {
          try {
            applyFacilitatorState(payload.new)
          } catch (e) {
            console.warn('Realtime handler error:', e)
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Supabase realtime connected')
          realtimeConnected = true
          // Stop polling if realtime works
          stopPollingTimer()
        } else if (status === 'CHANNEL_ERROR') {
          console.warn('Realtime failed — falling back to polling')
          realtimeConnected = false
          startPolling()
        }
      })
  } catch (e) {
    console.warn('Realtime setup failed — using polling:', e.message)
    startPolling()
  }

  // Also start polling as fallback — will stop if realtime connects
  startPolling()
}

function stopPollingTimer() {
  if (pollInterval) { clearTimeout(pollInterval); pollInterval = null }
}

// Adaptive polling. 50 students × 3h workshop × 5s polls would burn
// the Apps Script daily URL-fetch quota (20k) in the first hour.
// Strategy:
//   - base interval: 15s on gsheets (was 5s), 8s on supabase
//   - exponential backoff on consecutive failures: 15s → 30s → 60s
//     → 120s (capped). Resets to base on first success.
//   - pause entirely when tab is hidden (page-visibility API)
//   - schedule one-shot timeouts instead of setInterval so backoff
//     actually takes effect without us juggling clearInterval
let pollFailures = 0
let pollPaused = false

// 50 students × 1h workshop @ 20s = ~9k polls. Combined with ~1-2k
// ad-hoc action calls (register / seal / submit / vote / leaderboard)
// keeps us comfortably under the 20k URL-fetch daily quota.
function pollBaseMs() {
  return gsheetsEnabled() ? 20000 : 8000
}

function pollNextMs() {
  const base = pollBaseMs()
  if (pollFailures <= 0) return base
  // 1 fail -> 2x, 2 fails -> 4x, 3+ -> 8x, capped at 120s
  const factor = Math.min(8, 2 ** pollFailures)
  return Math.min(120000, base * factor)
}

async function pollOnce() {
  if (pollPaused) return
  try {
    const data = await getFacilitatorState()
    if (data) {
      pollFailures = 0
      applyFacilitatorState(data)
    } else {
      pollFailures = Math.min(3, pollFailures + 1)
    }
  } catch (e) {
    pollFailures = Math.min(3, pollFailures + 1)
  }
}

function startPolling() {
  if (pollInterval) return
  const tick = async () => {
    if (!started) return
    await pollOnce()
    if (!started) return
    pollInterval = setTimeout(tick, pollNextMs())
  }
  pollInterval = setTimeout(tick, pollNextMs())

  // Pause when the browser tab is in the background. Saves quota
  // when 50 participants leave the projector slide focused for hours.
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      pollPaused = document.hidden
    })
  }
}

function applyFacilitatorState(newState) {
  if (!newState) return
  const store = useWorkshopStore.getState()
  // unlocked_page intentionally ignored — workshop is self-paced now.
  if (newState.workshop_phase && newState.workshop_phase !== store.workshopPhase) {
    store.setWorkshopPhase(newState.workshop_phase)
  }
  // Round competition sync (Supabase only — gsheets schema doesn't carry round state)
  if (newState.active_round_id !== undefined) {
    if (newState.active_round_id && newState.active_round_id !== store.activeRoundId) {
      store.setActiveRound(newState.active_round_id, newState.active_timer_start, newState.active_timer_duration)
    } else if (!newState.active_round_id && store.activeRoundId) {
      store.setActiveRound(null, null, null)
    }
  }
  if (newState.round_ended === true && !store.roundEnded) {
    store.setRoundEnded(true)
  }
  if (newState.round_winners && JSON.stringify(newState.round_winners) !== JSON.stringify(store.roundWinners)) {
    store.setRoundWinners(newState.round_winners)
  }
  // Live announcement from facilitator
  if (newState.announcement !== undefined) {
    const stored = store.lastAnnouncement || {}
    const incoming = { text: newState.announcement || '', at: newState.announcement_at || null }
    if (incoming.text && incoming.at !== stored.at) {
      if (typeof store.setAnnouncement === 'function') {
        store.setAnnouncement(incoming)
      }
    }
  }
}

export function stopSync() {
  if (syncInterval) { clearInterval(syncInterval); syncInterval = null }
  if (pollInterval) { clearTimeout(pollInterval); pollInterval = null }
  if (realtimeChannel && supabase) {
    try { supabase.removeChannel(realtimeChannel) } catch (e) {}
    realtimeChannel = null
  }
  started = false
  realtimeConnected = false
}

export async function fetchInitialState() {
  try {
    const data = await getFacilitatorState()
    if (data) applyFacilitatorState(data)
  } catch (e) {
    console.warn('Initial state fetch failed — offline mode')
  }
}
