import { useEffect, useState } from 'react'
import PageRouter from './core/PageRouter'
import AchievementToast from './components/AchievementToast'
import WinnersPodium from './components/WinnersPodium'
import ErrorBoundary from './core/ErrorBoundary'
import TealParticles from './effects/TealParticles'
import Dashboard from './facilitator/Dashboard'
import { startSync, fetchInitialState } from './store/sync'

const FACILITATOR_TOKEN = import.meta.env.VITE_FACILITATOR_TOKEN

function isFacilitatorMode() {
  const params = new URLSearchParams(window.location.search)
  return params.get('token') === FACILITATOR_TOKEN
}

export default function App() {
  const [facilitator] = useState(isFacilitatorMode)

  useEffect(() => {
    fetchInitialState()
    if (!facilitator) startSync()
  }, [facilitator])

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
        <PageRouter />
        <AchievementToast />
        <WinnersPodium />
      </div>
    </ErrorBoundary>
  )
}
