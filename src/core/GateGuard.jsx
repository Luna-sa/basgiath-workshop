import { useWorkshopStore } from '../store/workshopStore'
import { evaluateGate } from '../store/gateUtils'
import { PAGES } from '../data/pages'

export default function GateGuard({ pageIndex, subStepId }) {
  // Subscribe to specific state slices to avoid unnecessary re-renders
  const user = useWorkshopStore(s => s.user)
  const completedPages = useWorkshopStore(s => s.completedPages)
  const completedSubSteps = useWorkshopStore(s => s.completedSubSteps)
  const preworkChecklist = useWorkshopStore(s => s.preworkChecklist)
  const preworkPath = useWorkshopStore(s => s.preworkPath)
  const quizScore = useWorkshopStore(s => s.quizScore)
  const taskSubmissions = useWorkshopStore(s => s.taskSubmissions)
  const facilitatorUnlockedPage = useWorkshopStore(s => s.facilitatorUnlockedPage)
  const navigateNext = useWorkshopStore(s => s.navigateNext)
  const completeSubStep = useWorkshopStore(s => s.completeSubStep)
  const completePage = useWorkshopStore(s => s.completePage)

  const page = PAGES[pageIndex]
  if (!page) return null

  // Build state snapshot for gate evaluation
  const stateSnapshot = { user, completedPages, completedSubSteps, preworkChecklist, preworkPath, quizScore, taskSubmissions, facilitatorUnlockedPage }
  const isOpen = evaluateGate(stateSnapshot, pageIndex, subStepId)

  // Determine the active gate
  let gate
  if (subStepId && page.subSteps) {
    const subStep = page.subSteps.find(s => s.id === subStepId)
    gate = subStep?.gate
  } else {
    gate = page.gate
  }

  if (!gate || gate.type === 'none' || gate.type === 'click') {
    return (
      <div className="mt-6 flex justify-center">
        <NextButton onClick={() => { completePage(pageIndex); navigateNext() }} />
      </div>
    )
  }

  if (gate.type === 'self-report') {
    return (
      <div className="mt-6 flex flex-col items-center gap-3">
        {!isOpen ? (
          <SelfReportButton onConfirm={() => {
            if (subStepId) completeSubStep(pageIndex, subStepId)
            else completePage(pageIndex)
          }} />
        ) : (
          <NextButton onClick={navigateNext} />
        )}
      </div>
    )
  }

  if (gate.type === 'facilitator') {
    if (isOpen) {
      return (
        <div className="mt-6 flex justify-center">
          <NextButton onClick={() => { completePage(pageIndex); navigateNext() }} />
        </div>
      )
    }
    return (
      <div className="mt-6 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-3 border border-border bg-surface/50">
          <span className="w-2 h-2 rounded-full bg-ember animate-pulse" />
          <span className="font-mono text-[12px] text-text-dim tracking-wider">
            {gate.message || 'Ожидай команду фасилитатора...'}
          </span>
        </div>
      </div>
    )
  }

  // For form, selection, checklist, quiz, timed-task, sub-steps-complete
  return (
    <div className="mt-6 flex flex-col items-center gap-3">
      {isOpen ? (
        <NextButton onClick={() => { completePage(pageIndex); navigateNext() }} />
      ) : (
        <div className="flex items-center gap-2 px-4 py-3 border border-border bg-surface/50">
          <span className="text-text-dim">🔒</span>
          <span className="font-mono text-[12px] text-text-dim tracking-wider">
            {gate.message || 'Заверши текущий этап, чтобы продолжить'}
          </span>
        </div>
      )}
    </div>
  )
}

function NextButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="group relative inline-flex items-center gap-2.5 px-10 py-4 bg-qa-teal text-black font-body text-[15px] font-semibold tracking-[1px] rounded-[2px] animate-pulse-teal hover:bg-qa-teal-soft hover:shadow-[0_0_32px_rgba(0,229,204,0.3)] hover:-translate-y-0.5 transition-all cursor-pointer overflow-hidden"
    >
      Далее
      <span className="text-lg">→</span>
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-600" />
    </button>
  )
}

function SelfReportButton({ onConfirm }) {
  return (
    <button
      onClick={onConfirm}
      className="group inline-flex items-center gap-2.5 px-8 py-4 border-2 border-qa-teal/40 text-qa-teal font-body text-[15px] font-semibold tracking-[1px] rounded-[2px] hover:bg-qa-teal/10 hover:border-qa-teal transition-all cursor-pointer"
    >
      <span className="text-lg">✓</span>
      Я сделал(а)
    </button>
  )
}
