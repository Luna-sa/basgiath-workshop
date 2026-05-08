import { useEffect, useCallback, useRef, lazy, Suspense } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useWorkshopStore } from '../store/workshopStore'
import { evaluateGate } from '../store/gateUtils'
import { PAGES } from '../data/pages'
import { playNavigateSound } from '../effects/SoundManager'
import ProgressBar from './ProgressBar'
import HUD from './HUD'

// Lazy-load page components — workshop flow rebuilt around Dragon Arena.
// Old QA practice pages (PracticeTC, PracticeBR, PracticeMCP, Quiz, WarGames)
// removed — replaced by PersonaBuilder + Arena (each accessible
// in-flow via a small intro page that links to the standalone
// full-screen experience).
const pageComponents = {
  0: lazy(() => import('../pages/P00_Landing')),
  1: lazy(() => import('../pages/P01_CharacterSelect')),
  2: lazy(() => import('../pages/P02_Registration')),
  3: lazy(() => import('../pages/P03_PreWork')),
  4: lazy(() => import('../pages/P04_TalkIntro')),
  5: lazy(() => import('../pages/P05_TalkEvolution')),
  6: lazy(() => import('../pages/P_TalkModes')),
  7: lazy(() => import('../pages/P06_InstallEcosystem')),
  8: lazy(() => import('../pages/P07_TalkEcosystem')),
  9: lazy(() => import('../pages/P_TalkPowerMoves')),
  10: lazy(() => import('../pages/P_PersonaIntro')),
  11: lazy(() => import('../pages/P10_TalkMCP')),
  12: lazy(() => import('../pages/P_HiddenGems')),
  13: lazy(() => import('../pages/P_GemPixelAgents')),
  14: lazy(() => import('../pages/P_GemMemPalace')),
  15: lazy(() => import('../pages/P_GemSuzuMcp')),
  16: lazy(() => import('../pages/P_GemToolSearch')),
  17: lazy(() => import('../pages/P_GemQuinnJinx')),
  18: lazy(() => import('../pages/P_GemChannels')),
  19: lazy(() => import('../pages/P_ArenaIntro')),
  20: lazy(() => import('../pages/P14_Leaderboard')),
  21: lazy(() => import('../pages/P15_Graduation')),
  22: lazy(() => import('../pages/P_ResourcesIntro')),
}

// Loading fallback
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="text-center">
        <div className="w-2 h-2 rounded-full bg-qa-teal animate-pulse mx-auto mb-3" />
        <span className="font-mono text-[12px] text-text-dim tracking-widest uppercase">Loading...</span>
      </div>
    </div>
  )
}

export default function PageRouter() {
  const currentPage = useWorkshopStore(s => s.currentPage)
  const direction = useWorkshopStore(s => s.direction)
  const navigateNext = useWorkshopStore(s => s.navigateNext)
  const prevPage = useRef(currentPage)

  // Play navigation sound on page change
  useEffect(() => {
    if (prevPage.current !== currentPage) {
      if (useWorkshopStore.getState().soundEnabled) playNavigateSound()
      prevPage.current = currentPage
    }
  }, [currentPage])
  const navigateBack = useWorkshopStore(s => s.navigateBack)
  const completePage = useWorkshopStore(s => s.completePage)

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return

    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      const page = PAGES[currentPage]
      const gate = page?.gate
      const state = useWorkshopStore.getState()
      if (!gate || gate.type === 'click' || gate.type === 'none' || evaluateGate(state, currentPage)) {
        if (gate?.type === 'click' || gate?.type === 'none') completePage(currentPage)
        navigateNext()
      }
    }

    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      navigateBack()
    }
  }, [currentPage, navigateNext, navigateBack, completePage])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const PageComponent = pageComponents[currentPage]

  // Animation variants
  const variants = {
    enter: (dir) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
    }),
  }

  return (
    <>
      <ProgressBar />
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentPage}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Suspense fallback={<PageLoader />}>
            {PageComponent ? <PageComponent /> : <PageLoader />}
          </Suspense>
        </motion.div>
      </AnimatePresence>
      <HUD />
    </>
  )
}
