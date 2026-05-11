import { useWorkshopStore } from '../store/workshopStore'
import { evaluateGate } from '../store/gateUtils'
import { PAGES } from '../data/pages'
import { useT } from '../i18n/useT'

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
  const t = useT()

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

  // On the very last page, there's nothing after — don't show a "Next" button
  const isLastPage = pageIndex >= PAGES.length - 1

  if (!gate || gate.type === 'none' || gate.type === 'click') {
    if (isLastPage) {
      return (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => completePage(pageIndex)}
            className="px-8 py-3 border border-qa-teal/40 text-qa-teal font-mono text-[12px] tracking-[2px] uppercase font-semibold hover:bg-qa-teal/10 cursor-pointer transition-all"
          >
            ✦ {t('Close workshop', 'Закрыть воркшоп', 'Закрити воркшоп')}
          </button>
        </div>
      )
    }
    return (
      <div className="mt-6 flex justify-center">
        <NextButton t={t} onClick={() => { completePage(pageIndex); navigateNext() }} />
      </div>
    )
  }

  if (gate.type === 'self-report') {
    return (
      <div className="mt-6 flex flex-col items-center gap-3">
        {!isOpen ? (
          <SelfReportButton t={t} onConfirm={() => {
            if (subStepId) completeSubStep(pageIndex, subStepId)
            else completePage(pageIndex)
          }} />
        ) : (
          <NextButton t={t} onClick={navigateNext} />
        )}
      </div>
    )
  }

  if (gate.type === 'facilitator') {
    if (isOpen) {
      return (
        <div className="mt-6 flex justify-center">
          <NextButton t={t} onClick={() => { completePage(pageIndex); navigateNext() }} />
        </div>
      )
    }
    return (
      <div className="mt-6 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-3 border border-border bg-surface/50">
          <span className="w-2 h-2 rounded-full bg-ember animate-pulse" />
          <span className="font-mono text-[12px] text-text-dim tracking-wider">
            {gate.message || t(
              'Waiting for facilitator command...',
              'Ожидай команду фасилитатора...',
              'Чекай на команду фасилітатора...'
            )}
          </span>
        </div>
      </div>
    )
  }

  // For form, selection, checklist, quiz, timed-task, sub-steps-complete
  return (
    <div className="mt-6 flex flex-col items-center gap-3">
      {isOpen ? (
        <NextButton t={t} onClick={() => { completePage(pageIndex); navigateNext() }} />
      ) : (
        <div className="flex items-center gap-2 px-4 py-3 border border-border bg-surface/50">
          <span className="text-text-dim">🔒</span>
          <span className="font-mono text-[12px] text-text-dim tracking-wider">
            {gate.message || t(
              'Finish the current stage to continue',
              'Заверши текущий этап, чтобы продолжить',
              'Заверши поточний етап, щоб продовжити'
            )}
          </span>
        </div>
      )}
    </div>
  )
}

function NextButton({ onClick, t }) {
  return (
    <button
      onClick={onClick}
      className="group relative inline-flex items-center gap-2.5 px-10 py-4 bg-qa-teal text-black font-body text-[15px] font-semibold tracking-[1px] rounded-[2px] animate-pulse-teal hover:bg-qa-teal-soft hover:shadow-[0_0_32px_rgba(0,229,204,0.3)] hover:-translate-y-0.5 transition-all cursor-pointer overflow-hidden"
    >
      {t('Next', 'Далее', 'Далі')}
      <span className="text-lg">→</span>
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-600" />
    </button>
  )
}

function SelfReportButton({ onConfirm, t }) {
  return (
    <button
      onClick={onConfirm}
      className="group inline-flex items-center gap-2.5 px-8 py-4 border-2 border-qa-teal/40 text-qa-teal font-body text-[15px] font-semibold tracking-[1px] rounded-[2px] hover:bg-qa-teal/10 hover:border-qa-teal transition-all cursor-pointer"
    >
      <span className="text-lg">✓</span>
      {t('I did it', 'Я сделал(а)', 'Я зробив(ла)')}
    </button>
  )
}
