import { useEffect, useState } from 'react'
import PageRouter from './core/PageRouter'
import AchievementToast from './components/AchievementToast'
import WinnersPodium from './components/WinnersPodium'
import LanguageToggle from './components/LanguageToggle'
import ErrorBoundary from './core/ErrorBoundary'
import TealParticles from './effects/TealParticles'
import Dashboard from './facilitator/Dashboard'
import StandaloneRegister from './pages/StandaloneRegister'
import { startSync, fetchInitialState } from './store/sync'

const FACILITATOR_TOKEN = import.meta.env.VITE_FACILITATOR_TOKEN

function isFacilitatorMode() {
  const params = new URLSearchParams(window.location.search)
  return params.get('token') === FACILITATOR_TOKEN
}

function isRegisterRoute() {
  return window.location.pathname === '/register' || window.location.pathname === '/register/'
}

export default function App() {
  const [facilitator] = useState(isFacilitatorMode)
  const [registerOnly] = useState(isRegisterRoute)

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
