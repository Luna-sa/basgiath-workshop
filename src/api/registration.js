import { supabase } from './supabase'

export async function registerStudent(userData) {
  if (!supabase) return { id: crypto.randomUUID() }

  const { data, error } = await supabase
    .from('students')
    .insert({
      name: userData.name,
      email: userData.email,
      studio: userData.studio,
      role: userData.role,
      experience: userData.experience,
      tool: userData.tool,
      os: userData.os,
      pain: userData.pain,
      claude_code_ready: userData.claudeCodeReady,
      character_id: userData.characterId,
    })
    .select('id')
    .single()

  if (error) {
    console.error('Registration error:', error)
    return { id: crypto.randomUUID() }
  }
  return data
}
