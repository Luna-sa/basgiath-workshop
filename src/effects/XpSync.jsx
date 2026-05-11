import { useEffect, useRef } from 'react'
import { useWorkshopStore } from '../store/workshopStore'
import { updateStudentProgress } from '../api/progress'

/**
 * Background sync — push XP + hidden-dragons + current page to the
 * students sheet whenever they change. Debounced (1500ms) so a burst
 * of completePage / completeSubStep / markDragonFound in one frame
 * coalesces into one network call.
 *
 * Renders nothing. Mount once globally (near AchievementToast).
 *
 * Fire-and-forget — localStorage holds truth, server is eventually
 * consistent. Failures are silently swallowed; the next change
 * re-syncs the new total.
 */
export default function XpSync() {
  const xp = useWorkshopStore(s => s.xp)
  const hiddenDragonsFound = useWorkshopStore(s => s.hiddenDragonsFound)
  const currentPage = useWorkshopStore(s => s.currentPage)
  const studentId = useWorkshopStore(s => s.user.id)
  const nickname = useWorkshopStore(s => s.user.nickname)
  const lastSentRef = useRef('')

  useEffect(() => {
    if (!studentId && !nickname) return
    const dragonIds = (hiddenDragonsFound || []).map(d => d.id)
    const payload = `${xp}|${dragonIds.join(',')}|${currentPage}`
    // Skip if nothing changed since last send (e.g. reload restored same state)
    if (payload === lastSentRef.current) return
    const t = setTimeout(() => {
      lastSentRef.current = payload
      updateStudentProgress({
        studentId,
        nickname,
        xp,
        hiddenDragonsFound: dragonIds,
        currentPage,
      }).catch(() => {})
    }, 1500)
    return () => clearTimeout(t)
  }, [xp, hiddenDragonsFound, currentPage, studentId, nickname])

  return null
}
