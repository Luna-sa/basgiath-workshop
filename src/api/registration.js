import { supabase } from './supabase'
import { gsheetsEnabled, callAction } from './gsheetsClient'

export async function registerStudent(userData) {
  // Apps Script backend (primary path once VITE_GSHEETS_API is set)
  if (gsheetsEnabled()) {
    const res = await callAction('registerStudent', {
      nickname: userData.nickname,
      name: userData.name,
      studio: userData.studio,
      role: userData.role,
      os: userData.os,
      claudeCodeReady: userData.claudeCodeReady,
      characterId: userData.characterId,
    })
    if (res?.error === 'NICKNAME_TAKEN' || res?.code === 'NICKNAME_TAKEN') {
      const e = new Error('NICKNAME_TAKEN')
      e.code = 'NICKNAME_TAKEN'
      throw e
    }
    return { id: res.id, ...res }
  }

  // Legacy Supabase fallback (kept while migration is in flight)
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
  const trimmed = (nickname || '').trim().toLowerCase()
  if (!trimmed) return null

  if (gsheetsEnabled()) {
    try {
      const res = await callAction('getStudent', { nickname: trimmed })
      return res || null
    } catch (e) {
      console.warn('gsheets lookup failed:', e.message)
      return null
    }
  }

  if (!supabase) return null
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
