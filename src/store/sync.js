import { supabase } from '../api/supabase'
import { syncProgress, getFacilitatorState } from '../api/progress'
import { useWorkshopStore } from './workshopStore'

let syncInterval = null
let pollInterval = null
let realtimeChannel = null
let started = false
let realtimeConnected = false

export function startSync() {
  if (!supabase || started) return
  started = true

  // Sync student progress every 10 seconds
  syncInterval = setInterval(() => {
    const state = useWorkshopStore.getState()
    if (state.user.id) {
      syncProgress(state.user.id, state).catch(() => {})
    }
  }, 10000)

  // Try Realtime first
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
  }, 5000)
}

function applyFacilitatorState(newState) {
  const store = useWorkshopStore.getState()
  if (newState.unlocked_page !== undefined && newState.unlocked_page !== store.facilitatorUnlockedPage) {
    store.setFacilitatorUnlock(newState.unlocked_page)
  }
  if (newState.workshop_phase && newState.workshop_phase !== store.workshopPhase) {
    store.setWorkshopPhase(newState.workshop_phase)
  }
  // Round competition sync
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
