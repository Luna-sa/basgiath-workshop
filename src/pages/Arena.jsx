import { useEffect, useRef } from 'react'
import arenaHtml from '../../public/dragon-arena.html?raw'
import { useWorkshopStore } from '../store/workshopStore'
import { submitBot, getLatestSubmissionsByCharacter } from '../api/submissions'

/**
 * Arena page wrapper. Render's static-site routing returns 404 for
 * /dragon-arena.html (same SPA-rewrite issue as /register), so we
 * serve the arena via /?page=arena → iframe srcDoc which renders
 * the bundled HTML inline without a network round-trip.
 *
 * Also bridges submit events: arena posts {type:'submit-bot',code,characterId}
 * via window.parent.postMessage; we forward to Supabase and reply back.
 */
function isFinalBattle() {
  return new URLSearchParams(window.location.search).get('final') === '1'
}

export default function Arena() {
  const iframeRef = useRef(null)
  const nickname = useWorkshopStore(s => s.user.nickname)

  // If ?final=1 is in URL, push the latest submitted bots into the arena
  // once the iframe says it's ready.
  useEffect(() => {
    if (!isFinalBattle()) return
    let pushed = false
    async function push() {
      if (pushed) return
      pushed = true
      const { data } = await getLatestSubmissionsByCharacter()
      try {
        if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage({
            type: 'load-submissions',
            submissions: (data || []).map(s => ({
              characterId: s.character_id,
              code: s.code,
              nickname: s.nickname,
            })),
          }, '*')
        }
      } catch {}
    }
    // Try after iframe loads, with a fallback delay
    const onLoad = () => push()
    iframeRef.current?.addEventListener('load', onLoad)
    setTimeout(push, 800)
    return () => iframeRef.current?.removeEventListener('load', onLoad)
  }, [])

  useEffect(() => {
    function onMessage(e) {
      if (!e.data || typeof e.data !== 'object') return
      if (e.data.type === 'submit-bot') {
        const { code, characterId } = e.data
        const useNickname = e.data.nickname || nickname || ''
        submitBot({ nickname: useNickname, characterId, code })
          .then(({ data, error }) => {
            const reply = {
              type: 'submit-result',
              ok: !error,
              characterId,
              error: error?.message || null,
              submittedAt: data?.submitted_at || null,
              nickname: useNickname,
            }
            try {
              if (iframeRef.current?.contentWindow) {
                iframeRef.current.contentWindow.postMessage(reply, '*')
              }
            } catch {}
          })
      } else if (e.data.type === 'request-nickname') {
        // Arena asks for the logged-in nickname (e.g., to prefill a prompt)
        try {
          if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage(
              { type: 'nickname', nickname: nickname || '' },
              '*'
            )
          }
        } catch {}
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [nickname])

  return (
    <iframe
      ref={iframeRef}
      title="Dragon Flight Trial"
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
