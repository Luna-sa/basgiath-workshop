import { useEffect, useState } from 'react'
import { useWorkshopStore } from '../store/workshopStore'

/**
 * Live announcement from the facilitator. Slides down from the top,
 * stays for 8 seconds, dismisses with click. New announcements
 * replace the current one.
 */
export default function AnnouncementToast() {
  const last = useWorkshopStore(s => s.lastAnnouncement)
  const [visible, setVisible] = useState(false)
  const [text, setText] = useState('')

  useEffect(() => {
    if (!last?.text) return
    setText(last.text)
    setVisible(true)
    const t = setTimeout(() => setVisible(false), 8000)
    return () => clearTimeout(t)
  }, [last?.at, last?.text])

  if (!visible || !text) return null

  return (
    <div
      onClick={() => setVisible(false)}
      style={{
        position: 'fixed',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 60,
        maxWidth: 560,
        padding: '14px 22px',
        background: 'linear-gradient(135deg, rgba(0,229,204,0.18), rgba(0,229,204,0.04))',
        border: '1px solid rgba(0,229,204,0.5)',
        borderLeft: '3px solid #00E5CC',
        boxShadow: '0 0 32px rgba(0,229,204,0.3)',
        color: '#FFFFFF',
        fontFamily: '"Playfair Display", Georgia, serif',
        fontSize: 17,
        fontStyle: 'italic',
        cursor: 'pointer',
        animation: 'announcement-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      <span style={{
        fontFamily: '"JetBrains Mono", monospace',
        fontStyle: 'normal',
        fontSize: 10,
        letterSpacing: 3,
        textTransform: 'uppercase',
        color: '#00E5CC',
        marginRight: 12,
      }}>◆</span>
      {text}
      <style>{`
        @keyframes announcement-in {
          from { opacity: 0; transform: translate(-50%, -16px) scale(0.95); }
          to { opacity: 1; transform: translate(-50%, 0) scale(1); }
        }
      `}</style>
    </div>
  )
}
