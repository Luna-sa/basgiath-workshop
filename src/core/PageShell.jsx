import { PAGES } from '../data/pages'
import { NARRATIVE } from '../data/narrative'
import { usePersona } from '../store/usePersona'
import GateGuard from './GateGuard'

export default function PageShell({ pageIndex, subStepId, children }) {
  const page = PAGES[pageIndex]
  const persona = usePersona()
  if (!page) return null

  let narrativeKey
  if (subStepId && page.subSteps) {
    const subStep = page.subSteps.find(s => s.id === subStepId)
    narrativeKey = subStep?.narrativeKey
  } else {
    narrativeKey = page.narrativeKey
  }
  const narrative = NARRATIVE[narrativeKey]

  // Use character accent for title highlight instead of hardcoded teal
  const accentStyle = { color: persona.accent }

  return (
    <div className="h-screen w-full flex flex-col bg-bg pt-[52px] overflow-hidden">
      <div className="flex-1 flex flex-col items-center overflow-y-auto px-4 sm:px-6 py-4">
        <div className="w-full max-w-[680px] mx-auto flex flex-col flex-1">
          {narrative && (
            <div className="mb-4 text-center shrink-0">
              <div className="font-mono text-[12px] tracking-[2px] uppercase text-text-secondary mb-2">
                {page.title}
              </div>
              <h1 className="font-display text-[clamp(22px,4vw,34px)] font-normal text-white mb-2 leading-tight">
                {narrative.title}
              </h1>
              <p className="font-display italic text-text-body text-base leading-relaxed max-w-lg mx-auto">
                {narrative.text}
              </p>
              <div className="flex items-center justify-center gap-4 mt-3">
                <div className="w-8 h-px bg-border" />
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: persona.accent + '66' }} />
                <div className="w-8 h-px bg-border" />
              </div>
            </div>
          )}

          <div className="flex-1 min-h-0">
            {children}
          </div>

          {!(page.subSteps && !subStepId) && (
            <div className="shrink-0 pb-16">
              <GateGuard pageIndex={pageIndex} subStepId={subStepId} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
