import { useEffect, useState } from 'react'
import PageRouter from './core/PageRouter'
import AchievementToast from './components/AchievementToast'
import WinnersPodium from './components/WinnersPodium'
import LanguageToggle from './components/LanguageToggle'
import ErrorBoundary from './core/ErrorBoundary'
import TealParticles from './effects/TealParticles'
import Dashboard from './facilitator/Dashboard'
import StandaloneRegister from './pages/StandaloneRegister'
import WorkshopGate from './core/WorkshopGate'
import { useWorkshopStore } from './store/workshopStore'
import { startSync, fetchInitialState } from './store/sync'

const FACILITATOR_TOKEN = import.meta.env.VITE_FACILITATOR_TOKEN

function isFacilitatorMode() {
  const params = new URLSearchParams(window.location.search)
  return params.get('token') === FACILITATOR_TOKEN
}

function isRegisterRoute() {
  const params = new URLSearchParams(window.location.search)
  if (params.get('page') === 'register') return true
  const path = window.location.pathname
  return path === '/register' || path === '/register/'
}

export default function App() {
  const [facilitator] = useState(isFacilitatorMode)
  const [registerOnly] = useState(isRegisterRoute)
  const nickname = useWorkshopStore(s => s.user.nickname)
  const [unlocked, setUnlocked] = useState(false)

  useEffect(() => {
    if (!registerOnly) {
      fetchInitialState()
      if (!facilitator) startSync()
    }
  }, [facilitator, registerOnly])

  if (registerOnly) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-bg text-text-body">
          <TealParticles />
          <LanguageToggle />
          <StandaloneRegister />
        </div>
      </ErrorBoundary>
    )
  }

  if (facilitator) {
    return (
      <ErrorBoundary>
        <Dashboard />
      </ErrorBoundary>
    )
  }

  // Workshop gate — block access until a known nickname is provided
  const hasIdentity = !!nickname || unlocked
  if (!hasIdentity) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-bg text-text-body">
          <TealParticles />
          <LanguageToggle />
          <WorkshopGate onUnlock={() => setUnlocked(true)} />
        </div>
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-bg text-text-body">
        <TealParticles />
        <LanguageToggle />
        <PageRouter />
        <AchievementToast />
        <WinnersPodium />
      </div>
    </ErrorBoundary>
  )
}
