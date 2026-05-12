import { useState } from 'react'
import confetti from 'canvas-confetti'
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

  // On the very last page, there's nothing after - don't show a "Next" button
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
    // Facilitator-gating disabled — see comment in store/gateUtils.js.
    // All facilitator-type slides now behave like a plain click gate.
    return (
      <div className="mt-6 flex justify-center">
        <NextButton t={t} onClick={() => { completePage(pageIndex); navigateNext() }} />
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
 *
 * Easter egg — there's no actual "after" page so clicking the
 * button doesn't navigate anywhere. Instead it fires brand-coloured
 * confetti and pops a random one-liner above the button. Different
 * joke on every click. The underlying onClick (completePage) still
 * runs so the store is updated.
 */
function CloseButton({ onClick, t }) {
  const [joke, setJoke] = useState(null)

  // Each joke is { en, ru, uk } — picked at random on click, with
  // a follow-up check so the same line doesn't fire twice in a row.
  const JOKES = [
    {
      en: "Workshop closed. Your dragon is already updating CLAUDE.md from the new version.",
      ru: "Воркшоп закрыт. Твой дракон уже обновляет CLAUDE.md под новую версию.",
      uk: "Воркшоп закрито. Твій дракон вже оновлює CLAUDE.md під нову версію.",
    },
    {
      en: "There's no door here. You're free to go.",
      ru: "Здесь нет двери. Ты можешь идти.",
      uk: "Тут немає дверей. Ти можеш іти.",
    },
    {
      en: "Closed. Your dragon is napping. Don't wake him.",
      ru: "Закрыто. Дракон спит. Не буди.",
      uk: "Закрито. Дракон спить. Не буди.",
    },
    {
      en: "Workshop done. Now go break prod carefully.",
      ru: "Воркшоп закончен. Иди ломай прод осторожно.",
      uk: "Воркшоп завершено. Іди ламай прод обережно.",
    },
    {
      en: "The bond holds even off-platform. Don't worry.",
      ru: "Связь держится и вне платформы. Не переживай.",
      uk: "Звʼязок тримається і поза платформою. Не хвилюйся.",
    },
    {
      en: "Closed. The button still works if you want to try again.",
      ru: "Закрыто. Кнопка работает - можешь нажать ещё.",
      uk: "Закрито. Кнопка працює - можеш натиснути ще.",
    },
    {
      en: "Workshop archived. Your AI assistant just rolled its eyes — politely.",
      ru: "Воркшоп архивирован. Твой AI закатил глаза - но вежливо.",
      uk: "Воркшоп архівовано. Твій AI закотив очі - але ввічливо.",
    },
    {
      en: "Sealed. The Empyrean takes note.",
      ru: "Запечатано. Эмпиреи приняли к сведению.",
      uk: "Запечатано. Емпіреї прийняли до відома.",
    },
  ]

  const handleClick = () => {
    // Pick a joke that's different from the current one.
    let next
    do {
      next = JOKES[Math.floor(Math.random() * JOKES.length)]
    } while (joke && next.en === joke.en && JOKES.length > 1)
    setJoke(next)

    // Brand-colour confetti from the button area.
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        startVelocity: 35,
        ticks: 200,
        origin: { y: 0.85, x: 0.5 },
        colors: ['#00E5CC', '#FF65BE', '#FEED00', '#FFFFFF'],
      })
    } catch {}

    // Dismiss the bubble after a beat.
    setTimeout(() => setJoke(null), 5500)

    onClick?.()
  }

  return (
    <div className="relative inline-block">
      {joke && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-4 py-2.5 border border-qa-teal/40 bg-bg/95 backdrop-blur-sm whitespace-nowrap max-w-[420px] z-10"
          style={{
            animation: 'fade-in-up 0.4s ease-out forwards',
            boxShadow: '0 0 24px rgba(0, 229, 204, 0.25)',
          }}
        >
          <p className="font-display italic text-[14px] text-white leading-snug whitespace-normal text-center">
            {t(joke.en, joke.ru, joke.uk)}
          </p>
          {/* Down-pointing tail */}
          <div
            className="absolute top-full left-1/2 -translate-x-1/2"
            style={{
              width: 0, height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderTop: '8px solid #00E5CC',
              opacity: 0.4,
            }}
          />
        </div>
      )}
      <button
        onClick={handleClick}
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
    </div>
  )
}
