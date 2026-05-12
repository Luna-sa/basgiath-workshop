import { useState } from 'react'
import { useWorkshopStore } from '../store/workshopStore'
import { useT } from '../i18n/useT'

/**
 * Top-right user chip. Two render modes:
 *   - default (no props):  fixed top-4, right:160px — used on standalone
 *     routes (signet/bond/aerie/resources/etc) that don't have the
 *     ProgressBar above the slide.
 *   - inline (prop):       no positioning, just the chip — embedded
 *     inside ProgressBar header on the main workshop flow.
 *
 * Logout: clears identity fields but preserves local progress (xp,
 * hidden dragons, badges) so a re-login lands the participant back
 * where they were.
 */
export default function UserMenu({ inline = false }) {
  const t = useT()
  const user = useWorkshopStore(s => s.user)
  const setStore = useWorkshopStore.setState
  const [confirming, setConfirming] = useState(false)

  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search)
    if (params.get('page') === 'register' || window.location.pathname === '/register') {
      return null
    }
  }

  const handleLogout = () => {
    if (!confirming) {
      setConfirming(true)
      setTimeout(() => setConfirming(false), 3000)
      return
    }
    setStore(state => ({
      user: { ...state.user, nickname: '', name: '', email: '', characterId: null, id: null },
    }))
    if (typeof window !== 'undefined') {
      window.location.href = '/?page=register'
    }
  }

  const wrapperCls = inline
    ? 'flex items-center gap-1 bg-surface/60 border border-border rounded-[2px] font-mono text-[11px] tracking-[2px]'
    : 'fixed top-4 z-50 flex items-center gap-1 bg-surface/80 backdrop-blur border border-border rounded-[2px] font-mono text-[11px] tracking-[2px]'

  const wrapperStyle = inline ? undefined : { right: '160px' }

  if (!user?.nickname) {
    const loginCls = inline
      ? 'px-2 py-1 bg-surface/60 border border-border rounded-[2px] font-mono text-[11px] tracking-[2px] uppercase text-text-dim hover:text-qa-teal hover:border-qa-teal/30 transition-colors cursor-pointer'
      : 'fixed top-4 z-50 px-3 py-1.5 bg-surface/80 backdrop-blur border border-border rounded-[2px] font-mono text-[11px] tracking-[2px] uppercase text-text-dim hover:text-qa-teal hover:border-qa-teal/30 transition-colors cursor-pointer'
    return (
      <a href="/?page=register" className={loginCls} style={wrapperStyle}>
        {t('login', 'войти', 'увійти')}
      </a>
    )
  }

  return (
    <div className={wrapperCls} style={wrapperStyle}>
      <span className="px-2 py-1 text-text-dim">
        @<span className="text-qa-teal">{user.nickname}</span>
      </span>
      <button
        onClick={handleLogout}
        className="px-2 py-1 border-l border-border text-text-dim hover:text-corp-red transition-colors cursor-pointer uppercase"
        title={t('Logout', 'Выйти', 'Вийти')}
      >
        {confirming ? t('confirm', 'точно?', 'точно?') : '↩'}
      </button>
    </div>
  )
}
