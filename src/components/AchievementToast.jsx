import { useEffect, useState } from 'react'
import { useWorkshopStore } from '../store/workshopStore'
import { BADGES, pickBadge } from '../data/badges'
import { usePersona, getRandomSuccess } from '../store/usePersona'
import { playXPSound, playBadgeSound } from '../effects/SoundManager'
import { useLocale } from '../i18n/store'
import { useT } from '../i18n/useT'

export default function AchievementToast() {
  const lastToast = useWorkshopStore(s => s.lastToast)
  const clearToast = useWorkshopStore(s => s.clearToast)
  const persona = usePersona()
  const lang = useLocale(s => s.lang)
  const t = useT()
  const [visible, setVisible] = useState(false)
  const [content, setContent] = useState(null)

  useEffect(() => {
    if (!lastToast) return

    const soundEnabled = useWorkshopStore.getState().soundEnabled

    if (lastToast.type === 'xp') {
      const msg = getRandomSuccess(persona)
      setContent({ type: 'xp', value: `+${lastToast.value} XP`, message: msg })
      if (soundEnabled) playXPSound()
    } else if (lastToast.type === 'badge') {
      const rawBadge = BADGES.find(b => b.id === lastToast.value)
      const badge = pickBadge(rawBadge, lang)
      setContent({ type: 'badge', emoji: badge?.emoji, name: badge?.name })
      if (soundEnabled) playBadgeSound()
    }

    setVisible(true)
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(clearToast, 300)
    }, 3000)

    return () => clearTimeout(timer)
  }, [lastToast?.timestamp])

  if (!visible || !content) return null

  return (
    <div className={`fixed top-20 right-4 z-[150] transition-all duration-300 ${
      visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      {content.type === 'xp' ? (
        <div className="px-4 py-3 backdrop-blur-lg border flex items-center gap-3"
          style={{ backgroundColor: persona.accentLight, borderColor: persona.accentBorder }}>
          <span className="font-display text-lg font-bold" style={{ color: persona.accent }}>{content.value}</span>
          <span className="text-xs text-text-secondary max-w-[180px]">{content.message}</span>
        </div>
      ) : (
        <div className="px-4 py-3 bg-surface backdrop-blur-lg flex items-center gap-3"
          style={{ borderColor: persona.accentBorder, borderWidth: 1, borderStyle: 'solid' }}>
          <span className="text-2xl">{content.emoji}</span>
          <div>
            <div className="font-mono text-[11px] tracking-[2px] uppercase" style={{ color: persona.accent }}>{t('Badge', 'Бейдж', 'Бейдж')}</div>
            <div className="text-sm text-white font-display">{content.name}</div>
          </div>
        </div>
      )}
    </div>
  )
}
