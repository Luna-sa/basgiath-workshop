import { supabase } from './supabase'
import { gsheetsEnabled, callAction } from './gsheetsClient'

/**
 * Submit end-of-workshop feedback.
 *
 *   rating       1-5 stars
 *   comment      free-form text (optional)
 *   studentId    Supabase students.id when registered
 *   nickname     public handle
 *   characterId  selected archetype
 *
 * Tries the gsheets/Apps Script path first (preferred for the live
 * workshop running on Google Sheets), then Supabase as a fallback,
 * then queues to localStorage so nothing is lost when both backends
 * are unreachable. Returns { delivered: 'gsheets' | 'supabase' |
 * 'queued', error?: string }.
 */
export async function submitFeedback({
  studentId = null,
  nickname = '',
  characterId = '',
  rating,
  comment = '',
}) {
  if (!rating || rating < 1 || rating > 5) {
    throw new Error('rating must be 1-5')
  }

  const payload = {
    studentId,
    nickname: (nickname || '').trim(),
    characterId: characterId || null,
    rating: Number(rating),
    comment: (comment || '').trim().slice(0, 2000),
    submittedAt: new Date().toISOString(),
  }

  // 1. Try gsheets / Apps Script
  if (gsheetsEnabled()) {
    try {
      const res = await callAction('submitFeedback', payload)
      if (res && !res.error) {
        return { delivered: 'gsheets' }
      }
      // Apps Script doesn't recognise the action yet — fall through
      // to other paths instead of throwing.
      console.warn('gsheets submitFeedback returned error:', res?.error)
    } catch (e) {
      console.warn('gsheets submitFeedback failed:', e?.message)
    }
  }

  // 2. Try Supabase direct insert
  if (supabase) {
    try {
      const { error } = await supabase
        .from('workshop_feedback')
        .insert({
          student_id: payload.studentId,
          nickname: payload.nickname,
          character_id: payload.characterId,
          rating: payload.rating,
          comment: payload.comment || null,
        })
      if (!error) return { delivered: 'supabase' }
      console.warn('supabase workshop_feedback insert failed:', error?.message)
    } catch (e) {
      console.warn('supabase submitFeedback threw:', e?.message)
    }
  }

  // 3. Last resort — queue locally so the participant gets a
  //    confirmation and the data isn't lost. Anastasia can pull
  //    the queue manually later.
  try {
    const KEY = 'basgiath-feedback-queue'
    const existing = JSON.parse(window.localStorage.getItem(KEY) || '[]')
    existing.push(payload)
    window.localStorage.setItem(KEY, JSON.stringify(existing))
    return { delivered: 'queued' }
  } catch (e) {
    return { delivered: 'failed', error: e?.message || 'persist failed' }
  }
}
