import { useState } from 'react'
import { useWorkshopStore } from '../store/workshopStore'
import { PAGES } from '../data/pages'
import PageShell from '../core/PageShell'
import StepIndicator from '../components/StepIndicator'

const EMPTY = []
const PAGE_INDEX = 9
const page = PAGES[PAGE_INDEX]

const PROMPT = `Create a custom slash command for me. I need a file at .claude/commands/test-cases.md (create the folders if they don't exist).

This command takes a feature description as input ($ARGUMENTS) and generates comprehensive test cases.

The command file should instruct the AI to:

1. Identify functional areas within the feature
2. Generate test cases in table format: ID | Title | Type | Steps | Expected Result | Priority
3. Cover ALL types: positive (happy path), negative (invalid input), boundary (min/max/zero), edge cases (special chars, concurrent use), error handling (network fail, timeout)
4. Prioritize: Critical > High > Medium > Low
5. Aim for 15-25 test cases per feature

Create the file now. Save to .claude/commands/test-cases.md.`

export default function P09_Combat2() {
  const currentSubStep = useWorkshopStore(s => s.currentSubStep)
  const completedSubSteps = useWorkshopStore(s => s.completedSubSteps[PAGE_INDEX] ?? EMPTY)
  const navigateNext = useWorkshopStore(s => s.navigateNext)
  const user = useWorkshopStore(s => s.user)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(PROMPT)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!currentSubStep) {
    return (
      <PageShell pageIndex={PAGE_INDEX}>
        <div className="space-y-4">
          <div className="p-5 border border-border border-l-[3px] border-l-qa-teal bg-qa-teal/[0.03]">
            <p className="text-sm text-text-body leading-relaxed">
              Второй приём — <code className="font-mono text-ember text-xs bg-black/50 px-1">/test-cases</code>.
              Тот же подход: промпт → AI создаёт команду.
            </p>
          </div>
          <StepIndicator steps={page.subSteps} currentStepId={null} completedIds={completedSubSteps} />
        </div>
        <div className="mt-6 flex justify-center pb-16">
          <button onClick={navigateNext}
            className="inline-flex items-center gap-2.5 px-10 py-4 bg-qa-teal text-black font-body text-[15px] font-semibold tracking-[1px] rounded-[2px] hover:bg-qa-teal-soft transition-all cursor-pointer">
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
        <div className="space-y-5">
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 border border-border bg-surface/30">
              <span className="font-mono text-[12px] text-qa-teal shrink-0 mt-0.5">1.</span>
              <span className="text-sm text-text-body">Скопируй промпт и вставь в {user.tool === 'claude' ? 'Claude Code' : 'Cursor'}</span>
            </div>
            <div className="flex items-start gap-3 p-3 border border-border bg-surface/30">
              <span className="font-mono text-[12px] text-qa-teal shrink-0 mt-0.5">2.</span>
              <span className="text-sm text-text-body">AI создаст <code className="font-mono text-ember text-xs bg-black/50 px-1">.claude/commands/test-cases.md</code></span>
            </div>
          </div>

          <div className="border border-border bg-black overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-surface/80 border-b border-border">
              <span className="font-mono text-[12px] text-qa-teal tracking-wider">Промпт для /test-cases</span>
              <button onClick={handleCopy}
                className="font-mono text-[12px] tracking-wider uppercase hover:text-qa-teal transition-colors cursor-pointer"
                style={{ color: copied ? '#00E5CC' : '#888' }}>
                {copied ? '✓ Скопировано' : 'Копировать'}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto max-h-[200px] overflow-y-auto">
              <code className="font-mono text-[13px] text-text-body leading-relaxed whitespace-pre-wrap break-words">{PROMPT}</code>
            </pre>
          </div>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell pageIndex={PAGE_INDEX} subStepId="b">
      <StepIndicator steps={page.subSteps} currentStepId="b" completedIds={completedSubSteps} />
      <div className="text-center p-8 border border-qa-teal/30 bg-qa-teal/[0.05]">
        <div className="text-3xl mb-3">⚔️⚔️</div>
        <h3 className="font-display text-lg text-white mb-2">Два приёма в арсенале</h3>
        <p className="text-sm text-text-secondary max-w-md mx-auto">
          <code className="font-mono text-qa-teal">/bug-report</code> и <code className="font-mono text-qa-teal">/test-cases</code> готовы к бою.
        </p>
      </div>
    </PageShell>
  )
}
