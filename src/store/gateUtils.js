import { PAGES } from '../data/pages'

/**
 * Evaluate whether a gate is open based on current store state.
 * Pure function — no store subscription, no side effects.
 */
export function evaluateGate(state, pageIndex, subStepId = null) {
  const page = PAGES[pageIndex]
  if (!page) return false

  let gate
  if (subStepId && page.subSteps) {
    const subStep = page.subSteps.find(s => s.id === subStepId)
    gate = subStep?.gate
  } else {
    gate = page.gate
  }
  if (!gate) return true

  switch (gate.type) {
    case 'none':
    case 'click':
      return true

    case 'selection':
      return state.user[gate.field] != null

    case 'form':
      return gate.requiredFields.every(f => {
        const val = state.user[f]
        return val !== '' && val !== null && val !== undefined
      })

    case 'checklist': {
      const path = state.preworkPath
      const steps = 6
      return Array.from({ length: steps }, (_, i) =>
        state.preworkChecklist[`${path}-${i}`]
      ).every(Boolean)
    }

    case 'self-report': {
      if (subStepId) {
        const completed = state.completedSubSteps[pageIndex] || []
        return completed.includes(subStepId)
      }
      return state.completedPages.includes(pageIndex)
    }

    case 'screenshot':
      return !!state.taskSubmissions[pageIndex]

    case 'quiz':
      return state.quizScore !== null

    case 'timed-task':
      return !!state.taskSubmissions[pageIndex]

    case 'sub-steps-complete': {
      if (!page.subSteps) return true
      const completed = state.completedSubSteps[pageIndex] || []
      return completed.length === page.subSteps.length
    }

    case 'facilitator':
      return state.facilitatorUnlockedPage > pageIndex

    default:
      return false
  }
}
