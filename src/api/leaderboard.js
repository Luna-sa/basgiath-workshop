import { supabase } from './supabase'

export async function getLeaderboard() {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .limit(50)

  if (error) {
    console.error('Leaderboard error:', error)
    return []
  }
  return data || []
}
