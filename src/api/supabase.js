import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabaseInstance = null

// Only init if we have valid-looking credentials (anon key starts with eyJ)
if (supabaseUrl && supabaseAnonKey && supabaseAnonKey.startsWith('eyJ')) {
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
  } catch (e) {
    console.warn('Supabase init failed:', e.message)
  }
} else if (supabaseUrl) {
  console.warn('Supabase anon key missing or invalid — running in offline mode. Key should start with "eyJ..."')
}

export const supabase = supabaseInstance
