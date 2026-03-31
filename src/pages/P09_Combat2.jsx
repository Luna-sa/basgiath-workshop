import { useWorkshopStore } from '../store/workshopStore'
import { PAGES } from '../data/pages'
import { TEST_CASES_COMMAND } from '../data/commands/test-cases'
import PageShell from '../core/PageShell'
import CodeBlock from '../components/CodeBlock'
import StepIndicator from '../components/StepIndicator'

const EMPTY = []
const PAGE_INDEX = 9
const page = PAGES[PAGE_INDEX]

export default function P09_Combat2() {
  const currentSubStep = useWorkshopStore(s => s.currentSubStep)
  const completedSubSteps = useWorkshopStore(s => s.completedSubSteps[PAGE_INDEX] ?? EMPTY)
  const navigateNext = useWorkshopStore(s => s.navigateNext)

  if (!currentSubStep) {
    return (
      <PageShell pageIndex={PAGE_INDEX}>
        <p className="text-text-secondary text-sm text-center mb-6">
          Второй приём — <code className="font-mono text-ember text-xs bg-black/50 px-1">/test-cases</code>.
        </p>
        <StepIndicator steps={page.subSteps} currentStepId={null} completedIds={completedSubSteps} />
        <div className="mt-6 flex justify-center pb-16">
          <button onClick={navigateNext}
            className="group relative inline-flex items-center gap-2.5 px-10 py-4 bg-qa-teal text-black font-body text-[15px] font-semibold tracking-[1px] rounded-[2px] hover:bg-qa-teal-soft transition-all cursor-pointer">
            Начать →
          </button>
        </div>
      </PageShell>
    )
  }

  if (currentSubStep === 'a') {
    return (
      <PageShell pageIndex={PAGE_INDEX} subStepId="a">
        <StepIndicator steps={page.subSteps} currentStepId="a" completedIds={completedSubSteps} />
        <div className="space-y-6">
          <div className="p-4 border border-border bg-surface/30">
            <p className="text-sm text-text-body">Создай <code className="font-mono text-ember text-xs bg-black/50 px-1">{TEST_CASES_COMMAND.path}</code>:</p>
          </div>
          <CodeBlock code={TEST_CASES_COMMAND.template} filename={TEST_CASES_COMMAND.path} />
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell pageIndex={PAGE_INDEX} subStepId="b">
      <StepIndicator steps={page.subSteps} currentStepId="b" completedIds={completedSubSteps} />
      <div className="text-center p-8 border border-qa-teal/30 bg-qa-teal/[0.05]">
        <div className="text-3xl mb-3">⚔️⚔️</div>
        <h3 className="font-display text-lg text-white mb-2">Два приёма</h3>
        <p className="text-sm text-text-secondary"><code className="font-mono text-qa-teal">/bug-report</code> + <code className="font-mono text-qa-teal">/test-cases</code> готовы.</p>
      </div>
    </PageShell>
  )
}
