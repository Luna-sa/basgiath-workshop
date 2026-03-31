import { supabase } from '../api/supabase'
import { syncProgress, getFacilitatorState } from '../api/progress'
import { useWorkshopStore } from './workshopStore'

let syncInterval = null
let realtimeChannel = null
let started = false

export function startSync() {
  if (!supabase || started) return
  started = true

  // Sync progress every 10 seconds
  syncInterval = setInterval(() => {
    const state = useWorkshopStore.getState()
    if (state.user.id) {
      syncProgress(state.user.id, state).catch(() => {})
    }
  }, 10000)

  // Subscribe to facilitator_state realtime changes
  try {
    realtimeChannel = supabase
      .channel('facilitator-updates')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'facilitator_state' },
        (payload) => {
          try {
            const newState = payload.new
            const store = useWorkshopStore.getState()
            if (newState.unlocked_page !== undefined && newState.unlocked_page > store.facilitatorUnlockedPage) {
              store.setFacilitatorUnlock(newState.unlocked_page)
            }
            if (newState.workshop_phase && newState.workshop_phase !== store.workshopPhase) {
              store.setWorkshopPhase(newState.workshop_phase)
            }
          } catch (e) {
            console.warn('Realtime handler error:', e)
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Supabase realtime connected')
        } else if (status === 'CHANNEL_ERROR') {
          console.warn('Supabase realtime channel error')
        }
      })
  } catch (e) {
    console.warn('Supabase realtime setup failed:', e.message)
  }
}

export function stopSync() {
  if (syncInterval) {
    clearInterval(syncInterval)
    syncInterval = null
  }
  if (realtimeChannel && supabase) {
    try { supabase.removeChannel(realtimeChannel) } catch (e) {}
    realtimeChannel = null
  }
  started = false
}

export async function fetchInitialState() {
  try {
    const data = await getFacilitatorState()
    if (data) {
      const store = useWorkshopStore.getState()
      store.setFacilitatorUnlock(data.unlocked_page)
      if (data.workshop_phase) store.setWorkshopPhase(data.workshop_phase)
    }
  } catch (e) {
    console.warn('Initial state fetch failed — offline mode')
  }
}
