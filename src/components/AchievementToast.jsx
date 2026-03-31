import { useEffect, useState } from 'react'
import { useWorkshopStore } from '../store/workshopStore'
import { BADGES } from '../data/badges'

export default function AchievementToast() {
  const lastToast = useWorkshopStore(s => s.lastToast)
  const clearToast = useWorkshopStore(s => s.clearToast)
  const [visible, setVisible] = useState(false)
  const [content, setContent] = useState(null)

  useEffect(() => {
    if (!lastToast) return

    if (lastToast.type === 'xp') {
      setContent({ type: 'xp', value: `+${lastToast.value} XP` })
    } else if (lastToast.type === 'badge') {
      const badge = BADGES.find(b => b.id === lastToast.value)
      setContent({ type: 'badge', emoji: badge?.emoji, name: badge?.name })
    }

    setVisible(true)
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(clearToast, 300)
    }, 2500)

    return () => clearTimeout(timer)
  }, [lastToast?.timestamp])

  if (!visible || !content) return null

  return (
    <div className={`fixed top-20 right-4 z-[150] transition-all duration-300 ${
      visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      {content.type === 'xp' ? (
        <div className="px-4 py-3 bg-qa-teal/10 border border-qa-teal/30 backdrop-blur-lg flex items-center gap-2">
          <span className="text-qa-teal font-display text-lg font-bold">{content.value}</span>
        </div>
      ) : (
        <div className="px-4 py-3 bg-surface border border-qa-teal/30 backdrop-blur-lg flex items-center gap-3">
          <span className="text-2xl">{content.emoji}</span>
          <div>
            <div className="font-mono text-[11px] text-qa-teal tracking-[2px] uppercase">Бейдж получен</div>
            <div className="text-sm text-white font-display">{content.name}</div>
          </div>
        </div>
      )}
    </div>
  )
}
