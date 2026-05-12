import { useEffect, useRef } from 'react'
import arenaHtml from '../../public/dragon-arena.html?raw'
import { useWorkshopStore } from '../store/workshopStore'
import {
  recordArenaRun,
  getMyArenaRuns,
  getArenaLeaderboard,
} from '../api/arena'
import { markCheckpoint } from '../api/checkpoints'

/**
 * Arena v2 wrapper.
 *
 * The arena game is a single HTML file (Phaser 3 + UI), served inline
 * via iframe srcDoc to dodge Render's static-site SPA-rewrite 404.
 * The React side bridges the iframe's postMessage events to Apps
 * Script via src/api/arena.js.
 *
 * v2 messages from iframe → parent:
 *   { type: 'record-run', nickname, characterId, runNumber, score,
 *     breakdown, runLog, botCodeSnapshot }
 *   { type: 'request-arena-progress', nickname, characterId }
 *   { type: 'fetch-arena-leaderboard' }
 *
 * Parent → iframe replies:
 *   { type: 'record-run-result', ok, error?, runNumber }
 *   { type: 'arena-progress', runs }
 *   { type: 'arena-leaderboard', rows }
 */
export default function Arena() {
  const iframeRef = useRef(null)
  const nickname = useWorkshopStore(s => s.user.nickname)
  const studentId = useWorkshopStore(s => s.user.id)
  const characterId = useWorkshopStore(s => s.user.characterId)

  // srcDoc iframes don't inherit the parent's URL query string, so we
  // can't pass identity through the URL. Push it via postMessage as soon
  // as the iframe says it's ready.
  useEffect(() => {
    function pushIdentity() {
      const iframe = iframeRef.current?.contentWindow
      if (!iframe) return
      iframe.postMessage({
        type: 'init-identity',
        nickname: nickname || '',
        characterId: characterId || '',
      }, '*')
    }
    const onLoad = () => setTimeout(pushIdentity, 80)
    iframeRef.current?.addEventListener('load', onLoad)
    // Also fire after a delay in case load already happened
    setTimeout(pushIdentity, 400)
    return () => iframeRef.current?.removeEventListener('load', onLoad)
  }, [nickname, characterId])

  useEffect(() => {
    function onMessage(e) {
      if (!e.data || typeof e.data !== 'object') return
      const iframe = iframeRef.current?.contentWindow

      if (e.data.type === 'arena-ready') {
        // Iframe announces readiness - re-push identity to be safe.
        if (iframe) {
          iframe.postMessage({
            type: 'init-identity',
            nickname: nickname || '',
            characterId: characterId || '',
          }, '*')
        }
      } else if (e.data.type === 'record-run') {
        const { nickname: nick, characterId, runNumber, score, breakdown, runLog, botCodeSnapshot } = e.data
        recordArenaRun({
          nickname: nick || nickname,
          characterId,
          runNumber,
          score,
          breakdown: breakdown || {},
          runLog,
          botCodeSnapshot,
          studentId: studentId || '',
        }).then((res) => {
          if (iframe) {
            iframe.postMessage({
              type: 'record-run-result',
              ok: !!res.ok,
              error: res.error || null,
              runNumber,
            }, '*')
          }
          // Auto-mark Arena checkpoint after the first successful run.
          if (res.ok && studentId && runNumber === 1) {
            markCheckpoint(studentId, 'arena').catch(() => {})
          }
        })
      } else if (e.data.type === 'request-arena-progress') {
        const { nickname: nick, characterId } = e.data
        getMyArenaRuns(nick || nickname, characterId).then((res) => {
          if (iframe) {
            iframe.postMessage({
              type: 'arena-progress',
              runs: res.runs || [],
              max: res.max,
            }, '*')
          }
        })
      } else if (e.data.type === 'fetch-arena-leaderboard') {
        getArenaLeaderboard().then((res) => {
          if (iframe) {
            iframe.postMessage({
              type: 'arena-leaderboard',
              rows: res.leaderboard || [],
            }, '*')
          }
        })
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [nickname, studentId])

  return (
    <iframe
      ref={iframeRef}
      title="Dragon Arena"
      srcDoc={arenaHtml}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        border: 0,
        background: '#0A0A0A',
      }}
    />
  )
}
