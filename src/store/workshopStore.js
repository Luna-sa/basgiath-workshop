import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { PAGES } from '../data/pages'
import { BADGES } from '../data/badges'
import { registerStudent } from '../api/registration'

const initialUser = {
  id: null,
  name: '',
  nickname: '',
  email: '',
  studio: '',
  role: '',
  experience: '',
  tool: 'claude',
  os: 'mac',
  pain: '',
  claudeCodeReady: false,
  characterId: null,
  personaAnswers: {},
}

export const useWorkshopStore = create(
  persist(
    (set, get) => ({
      // ── User Profile ──
      user: { ...initialUser },

      // ── Navigation ──
      currentPage: 0,
      currentSubStep: null,
      maxUnlockedPage: 0,
      completedPages: [],
      completedSubSteps: {},
      direction: 1, // 1 = forward, -1 = backward (for animation direction)

      // ── Gamification ──
      xp: 0,
      badges: [],
      quizAnswers: {},
      quizScore: null,
      taskSubmissions: {},
      hiddenDragonsFound: [], // [{id, foundAt, xpReward}]

      // ── Pre-work ──
      preworkChecklist: {},
      preworkPath: 'claude',

      // ── Workshop state ──
      workshopPhase: 'pre', // 'pre' | 'live' | 'complete'
      facilitatorUnlockedPage: 9999, // Self-paced workshop — no facilitator lock

      // ── Timestamps ──
      startedAt: null,
      completedAt: null,

      // ── Round Competition ──
      activeRoundId: null,
      roundTimerStart: null,
      roundTimerDuration: null,
      roundEnded: false,
      roundWinners: null,
      showPodium: false,

      // ── Sigil (sealed dragon) ──
      // Persisted so the Resources page can show + offer the card
      // even when the participant comes back days later.
      sigil: null, // { imageDataUri, dragonName, motto, riderClass, characterId, sealedAt }

      // ── UI ──
      soundEnabled: false,
      showBadgeOverlay: false,
      lastToast: null, // { type: 'xp'|'badge', value, timestamp }
      lastAnnouncement: null, // { text, at }

      // ═══════════════════════════════════════
      // ACTIONS
      // ═══════════════════════════════════════

      setUser: (data) => set((s) => ({
        user: { ...s.user, ...data },
      })),

      selectCharacter: (id) => set((s) => ({
        user: { ...s.user, characterId: id },
      })),

      setPersonaAnswers: (answers) => set((s) => ({
        user: { ...s.user, personaAnswers: { ...(s.user.personaAnswers || {}), ...answers } },
      })),

      setAnnouncement: (announcement) => set({ lastAnnouncement: announcement }),

      setSigil: (sigil) => set({ sigil: { ...sigil, sealedAt: sigil.sealedAt || Date.now() } }),

      // ── Backend Registration ──

      registerToBackend: async () => {
        const state = get()
        if (state.user.id) return // already registered
        try {
          const result = await registerStudent(state.user)
          if (result?.id) {
            set((s) => ({ user: { ...s.user, id: result.id } }))
          }
        } catch (e) {
          // Generate local ID as fallback
          set((s) => ({ user: { ...s.user, id: s.user.id || crypto.randomUUID() } }))
        }
      },

      // ── Navigation ──

      navigateTo: (pageIndex, subStep = null) => {
        const state = get()
        const dir = pageIndex > state.currentPage ? 1 : -1
        if (pageIndex < 0 || pageIndex >= PAGES.length) return
        // Can only go back to already-visited pages or forward to unlocked
        if (pageIndex > state.maxUnlockedPage) return

        set({
          currentPage: pageIndex,
          currentSubStep: subStep,
          direction: dir,
        })
      },

      navigateNext: () => {
        const state = get()
        const page = PAGES[state.currentPage]

        // If page has sub-steps, advance sub-step first
        if (page.subSteps && state.currentSubStep !== null) {
          const stepIds = page.subSteps.map(s => s.id)
          const currentIdx = stepIds.indexOf(state.currentSubStep)
          if (currentIdx < stepIds.length - 1) {
            // Advance to next sub-step
            set({ currentSubStep: stepIds[currentIdx + 1], direction: 1 })
            return
          }
          // All sub-steps done — fall through to advance page
        }

        // If page has sub-steps and we haven't started them, start first sub-step
        if (page.subSteps && state.currentSubStep === null) {
          set({ currentSubStep: page.subSteps[0].id, direction: 1 })
          return
        }

        // Advance to next page
        const nextPage = state.currentPage + 1
        if (nextPage >= PAGES.length) return

        const newMax = Math.max(state.maxUnlockedPage, nextPage)
        set({
          currentPage: nextPage,
          currentSubStep: null,
          maxUnlockedPage: newMax,
          direction: 1,
          startedAt: state.startedAt || Date.now(),
        })
      },

      navigateBack: () => {
        const state = get()
        const page = PAGES[state.currentPage]

        // If on a sub-step, go back to previous sub-step
        if (page.subSteps && state.currentSubStep !== null) {
          const stepIds = page.subSteps.map(s => s.id)
          const currentIdx = stepIds.indexOf(state.currentSubStep)
          if (currentIdx > 0) {
            set({ currentSubStep: stepIds[currentIdx - 1], direction: -1 })
            return
          }
          // First sub-step — go to parent page overview
          set({ currentSubStep: null, direction: -1 })
          return
        }

        if (state.currentPage > 0) {
          set({ currentPage: state.currentPage - 1, currentSubStep: null, direction: -1 })
        }
      },

      // ── Completion ──

      completePage: (pageIndex) => {
        const state = get()
        if (state.completedPages.includes(pageIndex)) return

        const page = PAGES[pageIndex]
        const newCompleted = [...state.completedPages, pageIndex]
        const xpGain = page.xpReward || 0

        // Single atomic set — no chained get() calls
        const update = {
          completedPages: newCompleted,
          xp: state.xp + xpGain,
        }
        if (xpGain > 0) {
          update.lastToast = { type: 'xp', value: xpGain, timestamp: Date.now() }
        }

        // Check badges inline (no separate set call)
        const stateAfter = { ...state, ...update }
        const newBadges = BADGES
          .filter(b => !state.badges.includes(b.id) && b.condition(stateAfter))
          .map(b => b.id)
        if (newBadges.length > 0) {
          update.badges = [...state.badges, ...newBadges]
          update.lastToast = { type: 'badge', value: newBadges[0], timestamp: Date.now() }
        }

        set(update)

        // Register to Supabase when registration page is completed (async, non-blocking)
        if (pageIndex === 2) {
          setTimeout(() => get().registerToBackend(), 0)
        }
      },

      completeSubStep: (pageIndex, subStepId) => {
        const state = get()
        const existing = state.completedSubSteps[pageIndex] || []
        if (existing.includes(subStepId)) return

        const page = PAGES[pageIndex]
        const subStep = page.subSteps?.find(s => s.id === subStepId)
        const xpGain = subStep?.xp || 0

        const newCompletedSubs = {
          ...state.completedSubSteps,
          [pageIndex]: [...existing, subStepId],
        }

        // Single atomic set
        const update = {
          completedSubSteps: newCompletedSubs,
          xp: state.xp + xpGain,
        }
        if (xpGain > 0) {
          update.lastToast = { type: 'xp', value: xpGain, timestamp: Date.now() }
        }

        // If all sub-steps done, also complete the page in the same set
        const allDone = page.subSteps && newCompletedSubs[pageIndex].length === page.subSteps.length
        if (allDone) {
          const pageXp = page.xpReward || 0
          update.completedPages = [...state.completedPages, pageIndex]
          update.xp = (update.xp || state.xp) + pageXp

          // Check badges with projected state
          const stateAfter = { ...state, ...update }
          const newBadges = BADGES
            .filter(b => !state.badges.includes(b.id) && b.condition(stateAfter))
            .map(b => b.id)
          if (newBadges.length > 0) {
            update.badges = [...state.badges, ...newBadges]
            update.lastToast = { type: 'badge', value: newBadges[0], timestamp: Date.now() }
          }
        }

        set(update)
      },

      // ── Quiz ──

      submitQuizAnswer: (questionId, answerId) => set((s) => ({
        quizAnswers: { ...s.quizAnswers, [questionId]: answerId },
      })),

      finalizeQuiz: (correctCount) => {
        const state = get()
        const xpGain = correctCount * 10 + (correctCount === 5 ? 20 : 0)
        const update = {
          quizScore: correctCount,
          xp: state.xp + xpGain,
          lastToast: { type: 'xp', value: xpGain, timestamp: Date.now() },
        }
        // Inline badge check
        const stateAfter = { ...state, ...update }
        const newBadges = BADGES
          .filter(b => !state.badges.includes(b.id) && b.condition(stateAfter))
          .map(b => b.id)
        if (newBadges.length > 0) {
          update.badges = [...state.badges, ...newBadges]
          update.lastToast = { type: 'badge', value: newBadges[0], timestamp: Date.now() }
        }
        set(update)
      },

      // ── Tasks ──

      submitTask: (pageIndex, submission) => set((s) => ({
        taskSubmissions: {
          ...s.taskSubmissions,
          [pageIndex]: { ...submission, submittedAt: Date.now() },
        },
      })),

      // ── Pre-work ──

      setPreworkPath: (path) => set({ preworkPath: path }),

      togglePreworkItem: (key) => set((s) => ({
        preworkChecklist: {
          ...s.preworkChecklist,
          [key]: !s.preworkChecklist[key],
        },
      })),

      isPreworkComplete: () => {
        const s = get()
        // P03 currently has 4 steps (install / Pro / git / verify).
        // Keep this number in sync with STEPS array in P03_PreWork.jsx.
        const steps = 4
        return Array.from({ length: steps }, (_, i) =>
          s.preworkChecklist[`${s.preworkPath}-${i}`]
        ).every(Boolean)
      },

      // ── Gamification ──

      addXP: (amount) => {
        set((s) => ({
          xp: s.xp + amount,
          lastToast: { type: 'xp', value: amount, timestamp: Date.now() },
        }))
      },

      // ── Hidden Dragons ──
      // Idempotent: clicking the same dragon twice doesn't double-count.
      // Returns the awarded XP (0 if already found) so the caller can
      // decide whether to play the animation.
      markDragonFound: (id, xpReward) => {
        let awarded = 0
        set((s) => {
          if (s.hiddenDragonsFound.some(d => d.id === id)) return s
          awarded = Number(xpReward) || 0
          return {
            hiddenDragonsFound: [
              ...s.hiddenDragonsFound,
              { id, foundAt: Date.now(), xpReward: awarded },
            ],
            xp: s.xp + awarded,
            lastToast: { type: 'dragon', value: id, xp: awarded, timestamp: Date.now() },
          }
        })
        return awarded
      },

      hasFoundDragon: (id) => {
        const s = get()
        return s.hiddenDragonsFound.some(d => d.id === id)
      },

      awardBadge: (badgeId) => {
        const state = get()
        if (state.badges.includes(badgeId)) return
        set({
          badges: [...state.badges, badgeId],
          lastToast: { type: 'badge', value: badgeId, timestamp: Date.now() },
        })
      },

      checkBadges: () => {
        const state = get()
        const newBadges = BADGES
          .filter(b => !state.badges.includes(b.id) && b.condition(state))
          .map(b => b.id)
        if (newBadges.length > 0) {
          set((s) => ({
            badges: [...s.badges, ...newBadges],
            lastToast: { type: 'badge', value: newBadges[0], timestamp: Date.now() },
          }))
        }
      },

      // ── Facilitator ──

      setFacilitatorUnlock: (page) => set({ facilitatorUnlockedPage: page }),
      setWorkshopPhase: (phase) => set({ workshopPhase: phase }),

      // ── Round Competition ──

      setActiveRound: (roundId, timerStart, duration) => set({
        activeRoundId: roundId,
        roundTimerStart: timerStart,
        roundTimerDuration: duration,
        roundEnded: false,
        roundWinners: null,
        showPodium: false,
      }),

      setRoundEnded: (ended) => set({ roundEnded: ended }),

      setRoundWinners: (winners) => set({
        roundWinners: winners,
        showPodium: Array.isArray(winners) && winners.length > 0,
      }),

      dismissPodium: () => set({ showPodium: false }),

      // ── UI ──

      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      toggleBadgeOverlay: () => set((s) => ({ showBadgeOverlay: !s.showBadgeOverlay })),
      clearToast: () => set({ lastToast: null }),

      // ── Reset ──

      reset: () => set({
        user: { ...initialUser },
        currentPage: 0,
        currentSubStep: null,
        maxUnlockedPage: 0,
        completedPages: [],
        completedSubSteps: {},
        direction: 1,
        xp: 0,
        badges: [],
        quizAnswers: {},
        quizScore: null,
        taskSubmissions: {},
        hiddenDragonsFound: [],
        preworkChecklist: {},
        preworkPath: 'claude',
        workshopPhase: 'pre',
        facilitatorUnlockedPage: 9999,
        startedAt: null,
        completedAt: null,
        lastToast: null,
      }),
    }),
    {
      name: 'basgiath-workshop',
      partialize: (state) => {
        // Exclude transient UI state from persistence
        const { showBadgeOverlay, lastToast, direction, ...persisted } = state
        return persisted
      },
    }
  )
)
