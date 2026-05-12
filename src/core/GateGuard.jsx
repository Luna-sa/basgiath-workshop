import { useWorkshopStore } from '../store/workshopStore'
import { evaluateGate } from '../store/gateUtils'
import { PAGES } from '../data/pages'
import { useT } from '../i18n/useT'
import { useLocale } from '../i18n/store'

// Pick the locale-appropriate gate message. Gates can declare
// message_en/_ru/_uk OR a single legacy `message` (Russian by convention).
// Returns "" so callers can fall back to a generic t() default.
function pickGateMessage(gate, lang) {
  if (!gate) return ''
  if (lang === 'en' && gate.message_en) return gate.message_en
  if (lang === 'uk' && gate.message_uk) return gate.message_uk
  if (lang === 'ru' && gate.message_ru) return gate.message_ru
  return gate.message || ''
}

export default function GateGuard({ pageIndex, subStepId }) {
  const lang = useLocale(s => s.lang)
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
          <CloseButton t={t} onClick={() => completePage(pageIndex)} />
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
            {pickGateMessage(gate, lang) || t(
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
            {pickGateMessage(gate, lang) || t(
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

/**
 * The big primary action button used to advance to the next slide.
 * Persona-coloured solid fill (the CSS var --char-accent is set by
 * usePersona on mount). High-contrast black text. Pulsing glow shadow
 * pulls the eye; chevron nudges on hover. Designed to be the loudest
 * thing on the slide so participants never miss "where do I click".
 */
function NextButton({ onClick, t }) {
  return (
    <button
      onClick={onClick}
      className="group relative inline-flex items-center gap-3 cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
      style={{
        backgroundColor: 'var(--char-accent)',
        color: '#0A0A0A',
        padding: '16px 36px',
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: '15px',
        fontWeight: 700,
        letterSpacing: '1px',
        borderRadius: '2px',
        boxShadow: '0 0 0 2px var(--char-accent), 0 0 32px 0 var(--char-accent-light, rgba(0,229,204,0.25))',
        overflow: 'hidden',
      }}
    >
      <span className="relative z-10">{t('Next', 'Далее', 'Далі')}</span>
      <span className="relative z-10 text-xl transition-transform duration-300 group-hover:translate-x-1">→</span>
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
    </button>
  )
}

/**
 * Outline variant for "I did it" self-report confirmation. Persona-
 * coloured border + text, transparent fill, hovers to filled state.
 */
function SelfReportButton({ onConfirm, t }) {
  return (
    <button
      onClick={onConfirm}
      className="group inline-flex items-center gap-2.5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
      style={{
        padding: '14px 28px',
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: '14px',
        fontWeight: 600,
        letterSpacing: '1px',
        border: '2px solid var(--char-accent)',
        color: 'var(--char-accent)',
        backgroundColor: 'var(--char-accent-light, transparent)',
        borderRadius: '2px',
      }}
    >
      <span className="text-lg">✓</span>
      <span>{t('I did it', 'Я сделал(а)', 'Я зробив(ла)')}</span>
    </button>
  )
}

/**
 * Workshop-closer button for the very last slide. Distinct from Next
 * (heavier outline + ✦ icon, not chevron) so it reads as a finale,
 * not a continuation.
 */
function CloseButton({ onClick, t }) {
  return (
    <button
      onClick={onClick}
      className="group inline-flex items-center gap-3 cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
      style={{
        padding: '16px 32px',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '13px',
        fontWeight: 700,
        letterSpacing: '3px',
        textTransform: 'uppercase',
        border: '2px solid var(--char-accent)',
        color: 'var(--char-accent)',
        backgroundColor: 'var(--char-accent-light, transparent)',
        borderRadius: '2px',
        boxShadow: '0 0 24px 0 var(--char-accent-light, rgba(0,229,204,0.2))',
      }}
    >
      <span className="text-lg">✦</span>
      <span>{t('Close workshop', 'Закрыть воркшоп', 'Закрити воркшоп')}</span>
    </button>
  )
}
