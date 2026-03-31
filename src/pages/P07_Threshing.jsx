import { useWorkshopStore } from '../store/workshopStore'
import { PAGES } from '../data/pages'
import { CLAUDE_MD_SECTIONS } from '../data/commands/claude-md'
import PageShell from '../core/PageShell'
import CodeBlock from '../components/CodeBlock'
import StepIndicator from '../components/StepIndicator'

const EMPTY = []
const PAGE_INDEX = 7
const page = PAGES[PAGE_INDEX]
const sectionMap = { a: 'role', b: 'codeReview', c: 'testCases', d: 'bugReportsStyle' }

export default function P07_Threshing() {
  const currentSubStep = useWorkshopStore(s => s.currentSubStep)
  const completedSubSteps = useWorkshopStore(s => s.completedSubSteps[PAGE_INDEX] ?? EMPTY)
  const navigateNext = useWorkshopStore(s => s.navigateNext)

  if (!currentSubStep) {
    return (
      <PageShell pageIndex={PAGE_INDEX}>
        <p className="text-text-secondary text-sm text-center mb-6">
          Создаём CLAUDE.md — секцию за секцией. Открой редактор, создай файл <code className="font-mono text-ember text-xs bg-black/50 px-1">CLAUDE.md</code> в корне проекта.
        </p>
        <StepIndicator steps={page.subSteps} currentStepId={null} completedIds={completedSubSteps} />
        <div className="space-y-2 mt-4">
          {page.subSteps.map(step => {
            const isDone = completedSubSteps.includes(step.id)
            return (
              <div key={step.id} className={`flex items-center gap-3 p-3 border ${isDone ? 'border-forest/30 bg-forest/[0.05]' : 'border-border bg-surface/30'}`}>
                <span className={`font-mono text-[12px] ${isDone ? 'text-forest' : 'text-text-dim'}`}>{isDone ? '✓' : step.id.toUpperCase()}</span>
                <span className="text-sm text-text-body">{step.title}</span>
                {isDone && <span className="ml-auto font-mono text-[12px] text-forest">+{step.xp} XP</span>}
              </div>
            )
          })}
        </div>
        <div className="mt-6 flex justify-center pb-16">
          <button onClick={navigateNext}
            className="group relative inline-flex items-center gap-2.5 px-10 py-4 bg-qa-teal text-black font-body text-[15px] font-semibold tracking-[1px] rounded-[2px] hover:bg-qa-teal-soft transition-all cursor-pointer">
            Начать →
          </button>
        </div>
      </PageShell>
    )
  }

  if (currentSubStep === 'e') {
    return (
      <PageShell pageIndex={PAGE_INDEX} subStepId="e">
        <StepIndicator steps={page.subSteps} currentStepId="e" completedIds={completedSubSteps} />
        <div className="text-center p-8 border border-qa-teal/30 bg-qa-teal/[0.05]">
          <div className="text-4xl mb-3">🐉</div>
          <h3 className="font-display text-xl text-white mb-2">Связь установлена</h3>
          <p className="text-sm text-text-secondary max-w-md mx-auto">CLAUDE.md готов. Подтверди, что файл содержит все 4 секции.</p>
        </div>
      </PageShell>
    )
  }

  const sectionKey = sectionMap[currentSubStep]
  const section = sectionKey ? CLAUDE_MD_SECTIONS[sectionKey] : null
  if (!section) return null

  return (
    <PageShell pageIndex={PAGE_INDEX} subStepId={currentSubStep}>
      <StepIndicator steps={page.subSteps} currentStepId={currentSubStep} completedIds={completedSubSteps} />
      <div className="space-y-6">
        <div className="p-4 border border-border bg-surface/30">
          <div className="font-mono text-[11px] tracking-[2px] uppercase text-text-dim mb-2">Инструкция</div>
          <p className="text-sm text-text-body">{section.instructions}</p>
        </div>
        <CodeBlock code={section.template} filename="CLAUDE.md" />
        <div className="p-4 border border-qa-teal/15 bg-qa-teal/[0.03]">
          <p className="text-xs text-text-secondary">
            <span className="text-qa-teal font-mono text-[12px] uppercase">Совет</span>{' '}— Можешь изменить текст под свой проект.
          </p>
        </div>
      </div>
    </PageShell>
  )
}
