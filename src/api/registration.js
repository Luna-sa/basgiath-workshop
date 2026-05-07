import { supabase } from './supabase'

export async function registerStudent(userData) {
  if (!supabase) return { id: crypto.randomUUID() }

  const { data, error } = await supabase
    .from('students')
    .insert({
      name: userData.name,
      nickname: userData.nickname,
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
    if (error.code === '23505' || /duplicate key|unique/i.test(error.message || '')) {
      const e = new Error('NICKNAME_TAKEN')
      e.code = 'NICKNAME_TAKEN'
      throw e
    }
    console.error('Registration error:', error)
    throw error
  }
  return data
}

export async function findStudentByNickname(nickname) {
  if (!supabase) return null
  const trimmed = (nickname || '').trim().toLowerCase()
  if (!trimmed) return null

  const { data, error } = await supabase
    .from('students')
    .select('*')
    .ilike('nickname', trimmed)
    .maybeSingle()

  if (error) {
    console.error('Lookup error:', error)
    return null
  }
  return data
}
