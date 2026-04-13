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

  return (
    <div className="h-screen w-full flex flex-col bg-bg pt-[52px] overflow-hidden">
      <div className="flex-1 flex flex-col items-center overflow-y-auto px-6 sm:px-10 lg:px-16 py-6">
        <div className="w-full max-w-[960px] mx-auto flex flex-col flex-1">
          {/* Slide header — large, breathing */}
          {narrative && (
            <div className="mb-8 text-center shrink-0">
              <div className="font-mono text-[14px] tracking-[3px] uppercase text-text-secondary mb-3">
                {page.title}
              </div>
              <h1 className="font-display text-[clamp(32px,5vw,56px)] font-semibold text-white mb-4 leading-[1.1]">
                {narrative.title}
              </h1>
              <p className="font-display italic text-[clamp(18px,2.5vw,24px)] text-text-secondary leading-relaxed max-w-2xl mx-auto">
                {narrative.text}
              </p>
              <div className="flex items-center justify-center gap-4 mt-6">
                <div className="w-10 h-px bg-border" />
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: persona.accent + '66' }} />
                <div className="w-10 h-px bg-border" />
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-h-0">
            {children}
          </div>

          {/* Gate */}
          {!(page.subSteps && !subStepId) && (
            <div className="shrink-0 pb-20">
              <GateGuard pageIndex={pageIndex} subStepId={subStepId} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
