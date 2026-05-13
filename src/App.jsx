import { useEffect, useState } from 'react'
import PageRouter from './core/PageRouter'
import AchievementToast from './components/AchievementToast'
import XpSync from './effects/XpSync'
import AnnouncementToast from './components/AnnouncementToast'
import WinnersPodium from './components/WinnersPodium'
import LanguageToggle from './components/LanguageToggle'
import UserMenu from './components/UserMenu'
import ErrorBoundary from './core/ErrorBoundary'
import TealParticles from './effects/TealParticles'
import Dashboard from './facilitator/Dashboard'
import StandaloneRegister from './pages/StandaloneRegister'
import StandaloneCertificate from './pages/StandaloneCertificate'
import StandaloneFeedback from './pages/StandaloneFeedback'
import Arena from './pages/Arena'
import P_SignetCeremony from './pages/P_SignetCeremony'
// P_BondRitual deprecated — Bond Ritual logic merged into Signet Ceremony.
import P_Aerie from './pages/P_Aerie'
import P_AerieMosaic from './pages/P_AerieMosaic'
import P_AerieReveal from './pages/P_AerieReveal'
import P_Resources from './pages/P_Resources'
import P_Champions from './pages/P_Champions'
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

function isArenaRoute() {
  const params = new URLSearchParams(window.location.search)
  if (params.get('page') === 'arena') return true
  const path = window.location.pathname
  return path === '/arena' || path === '/arena/'
}

function isPersonaRoute() {
  const params = new URLSearchParams(window.location.search)
  if (params.get('page') === 'persona') return true
  const path = window.location.pathname
  return path === '/persona' || path === '/persona/'
}

function isSignetRoute() {
  const params = new URLSearchParams(window.location.search)
  if (params.get('page') === 'signet') return true
  const path = window.location.pathname
  return path === '/signet' || path === '/signet/'
}

function isBondRoute() {
  const params = new URLSearchParams(window.location.search)
  if (params.get('page') === 'bond') return true
  const path = window.location.pathname
  return path === '/bond' || path === '/bond/'
}

function isAerieRoute() {
  const params = new URLSearchParams(window.location.search)
  if (params.get('page') === 'aerie') return true
  const path = window.location.pathname
  return path === '/aerie' || path === '/aerie/'
}


function isMosaicRoute() {
  const params = new URLSearchParams(window.location.search)
  if (params.get('page') === 'mosaic') return true
  const path = window.location.pathname
  return path === '/mosaic' || path === '/mosaic/'
}

function isRevealRoute() {
  const params = new URLSearchParams(window.location.search)
  if (params.get('page') === 'reveal') return true
  const path = window.location.pathname
  return path === '/reveal' || path === '/reveal/'
}


function isResourcesRoute() {
  const params = new URLSearchParams(window.location.search)
  if (params.get('page') === 'resources') return true
  const path = window.location.pathname
  return path === '/resources' || path === '/resources/'
}

function isChampionsRoute() {
  const params = new URLSearchParams(window.location.search)
  if (params.get('page') === 'champions') return true
  const path = window.location.pathname
  return path === '/champions' || path === '/champions/'
}

function isCertRoute() {
  const params = new URLSearchParams(window.location.search)
  if (params.get('page') === 'cert') return true
  const path = window.location.pathname
  return path === '/cert' || path === '/cert/' || path === '/certificate' || path === '/certificate/'
}

function isFeedbackRoute() {
  const params = new URLSearchParams(window.location.search)
  if (params.get('page') === 'feedback') return true
  const path = window.location.pathname
  return path === '/feedback' || path === '/feedback/'
}

export default function App() {
  const [facilitator] = useState(isFacilitatorMode)
  const [registerOnly] = useState(isRegisterRoute)
  const [arenaOnly] = useState(isArenaRoute)
  const [personaOnly] = useState(isPersonaRoute)
  const [signetOnly] = useState(isSignetRoute)
  const [bondOnly] = useState(isBondRoute)
  const [aerieOnly] = useState(isAerieRoute)
  const [mosaicOnly] = useState(isMosaicRoute)
  const [revealOnly] = useState(isRevealRoute)
  const [resourcesOnly] = useState(isResourcesRoute)
  const [championsOnly] = useState(isChampionsRoute)
  const [certOnly] = useState(isCertRoute)
  const [feedbackOnly] = useState(isFeedbackRoute)
  const nickname = useWorkshopStore(s => s.user.nickname)
  const [unlocked, setUnlocked] = useState(false)

  useEffect(() => {
    if (!registerOnly && !arenaOnly && !personaOnly && !signetOnly && !bondOnly && !aerieOnly && !mosaicOnly && !revealOnly && !resourcesOnly && !championsOnly && !certOnly && !feedbackOnly) {
      fetchInitialState()
      if (!facilitator) startSync()
    }
  }, [facilitator, registerOnly, arenaOnly, personaOnly, signetOnly, bondOnly, aerieOnly, mosaicOnly, revealOnly, resourcesOnly, championsOnly, certOnly, feedbackOnly])

  if (arenaOnly) {
    return (
      <ErrorBoundary>
        <Arena />
      </ErrorBoundary>
    )
  }

  if (personaOnly) {
    // Legacy route — Persona Builder retired in favour of the
    // Signet Ceremony. Redirect any bookmark / stale link
    // immediately to /?page=signet so the user lands in the
    // current persona-building flow without a broken page.
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      params.set('page', 'signet')
      window.location.replace(`${window.location.pathname}?${params.toString()}`)
    }
    return null
  }

  if (signetOnly) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-bg text-text-body">
          <TealParticles />
          <LanguageToggle /><UserMenu />
          <P_SignetCeremony />
        </div>
      </ErrorBoundary>
    )
  }

  if (bondOnly) {
    // Bond Ritual deprecated — redirect to Signet Ceremony where
    // dragon manifestation now lives.
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      params.set('page', 'signet')
      window.location.replace(`${window.location.pathname}?${params.toString()}`)
    }
    return null
  }

  if (aerieOnly) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-bg text-text-body">
          <TealParticles />
          <LanguageToggle /><UserMenu />
          <P_Aerie />
        </div>
      </ErrorBoundary>
    )
  }

  if (mosaicOnly) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-black text-text-body">
          {/* Mosaic intentionally has no LanguageToggle / no Particles
              — it's projector-mode, full screen, clean. */}
          <P_AerieMosaic />
        </div>
      </ErrorBoundary>
    )
  }

  if (revealOnly) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-black text-text-body">
          {/* Reveal — projector-mode, slow theatrical reveal */}
          <P_AerieReveal />
        </div>
      </ErrorBoundary>
    )
  }

  if (championsOnly) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-black text-text-body">
          {/* Champions finale — three winners revealed in sequence */}
          <LanguageToggle /><UserMenu />
          <P_Champions />
          {/* Toast slot so Golden Wyrmling click can show "+500 XP" */}
          <AchievementToast />
        </div>
      </ErrorBoundary>
    )
  }

  if (resourcesOnly) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-bg text-text-body">
          <TealParticles />
          <LanguageToggle /><UserMenu />
          <P_Resources />
        </div>
      </ErrorBoundary>
    )
  }

  if (registerOnly) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-bg text-text-body">
          <TealParticles />
          <LanguageToggle /><UserMenu />
          <StandaloneRegister />
        </div>
      </ErrorBoundary>
    )
  }

  if (feedbackOnly) {
    // Feedback page is fully open - no login required. If the
    // participant happens to have a nickname in local store it's
    // attached to the row, otherwise the submission saves anon.
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-bg text-text-body">
          <TealParticles />
          <LanguageToggle /><UserMenu />
          <StandaloneFeedback />
        </div>
      </ErrorBoundary>
    )
  }

  if (certOnly) {
    // Standalone cert page - needs a logged-in nickname to look up
    // the sealed dragon. Falls through to the workshop gate if no
    // identity is present in local store.
    if (!nickname && !unlocked) {
      return (
        <ErrorBoundary>
          <div className="min-h-screen bg-bg text-text-body">
            <TealParticles />
            <LanguageToggle /><UserMenu />
            <WorkshopGate onUnlock={() => setUnlocked(true)} />
          </div>
        </ErrorBoundary>
      )
    }
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-bg text-text-body">
          <TealParticles />
          <LanguageToggle /><UserMenu />
          <StandaloneCertificate />
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
          <LanguageToggle /><UserMenu />
          <WorkshopGate onUnlock={() => setUnlocked(true)} />
        </div>
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-bg text-text-body">
        <TealParticles />
        {/* LanguageToggle lives inside <ProgressBar /> on the main flow */}
        <PageRouter />
        <AchievementToast />
        <AnnouncementToast />
        <WinnersPodium />
        <XpSync />
      </div>
    </ErrorBoundary>
  )
}
