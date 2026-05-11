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
          if (pollInterval) {
            clearInterval(pollInterval)
            pollInterval = null
          }
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

function startPolling() {
  if (pollInterval) return
  pollInterval = setInterval(async () => {
    try {
      const data = await getFacilitatorState()
      if (data) applyFacilitatorState(data)
    } catch (e) {}
  }, gsheetsEnabled() ? 5000 : 8000)
}

function applyFacilitatorState(newState) {
  if (!newState) return
  const store = useWorkshopStore.getState()
  if (newState.unlocked_page !== undefined && newState.unlocked_page !== '' &&
      Number(newState.unlocked_page) !== store.facilitatorUnlockedPage) {
    store.setFacilitatorUnlock(Number(newState.unlocked_page))
  }
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
  if (pollInterval) { clearInterval(pollInterval); pollInterval = null }
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
