import arenaHtml from '../../public/dragon-arena.html?raw'

/**
 * Arena page wrapper. Render's static-site routing returns 404 for
 * /dragon-arena.html (same SPA-rewrite issue as /register), so we
 * serve the arena via /?page=arena → iframe srcDoc which renders
 * the bundled HTML inline without a network round-trip.
 */
export default function Arena() {
  return (
    <iframe
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
