import { useState } from 'react'
import { useWorkshopStore } from '../store/workshopStore'
import { usePersona } from '../store/usePersona'
import { PAGES } from '../data/pages'
import PageShell from '../core/PageShell'
import StepIndicator from '../components/StepIndicator'

const EMPTY = []
const PAGE_INDEX = 8
const page = PAGES[PAGE_INDEX]

const PROMPT = `Create a custom slash command for me. I need a file at .claude/commands/bug-report.md (create the folders if they don't exist).

This command should take a bug description as input ($ARGUMENTS) and generate a complete, professional bug report.

The command file should contain these instructions for the AI:

1. Parse the description to identify: what feature is affected, what the user was doing, what went wrong
2. Assess severity: Critical (crash/data loss), Major (feature broken), Minor (cosmetic)
3. Generate a report with: Title, Severity, Priority, Environment, Preconditions, Steps to Reproduce, Expected Result, Actual Result, Reproducibility
4. Suggest additional checks and related areas to test

Create the file now. Just the .md file content, saved to .claude/commands/bug-report.md.`

export default function P08_Combat1() {
  const currentSubStep = useWorkshopStore(s => s.currentSubStep)
  const completedSubSteps = useWorkshopStore(s => s.completedSubSteps[PAGE_INDEX] ?? EMPTY)
  const navigateNext = useWorkshopStore(s => s.navigateNext)
  const user = useWorkshopStore(s => s.user)
  const persona = usePersona()
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
          <div className="p-5 border border-l-[3px] bg-surface/30" style={{ borderColor: persona.accentBorder, borderLeftColor: persona.accent }}>
            <div className="font-mono text-[12px] tracking-[2px] uppercase mb-2" style={{ color: persona.accent }}>{persona.voice.taskIntro}</div>
            <p className="text-sm text-text-body leading-relaxed">
              Создаём <code className="font-mono text-ember text-xs bg-black/50 px-1">/bug-report</code> — первый боевой приём.
            </p>
          </div>
          <StepIndicator steps={page.subSteps} currentStepId={null} completedIds={completedSubSteps} />
          <div className="p-3 border border-border bg-surface/30">
            <p className="text-xs text-text-secondary">
              <span className="font-mono text-[12px] uppercase" style={{ color: persona.accent }}>Подход</span>{' '}— {persona.approach.bugHunting}
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-center pb-16">
          <button onClick={navigateNext}
            className="inline-flex items-center gap-2.5 px-10 py-4 text-black font-body text-[15px] font-semibold tracking-[1px] rounded-[2px] transition-all cursor-pointer"
            style={{ backgroundColor: persona.accent }}>
            {persona.approach.challengeFrame} Начать →
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
              <span className="font-mono text-[12px] shrink-0 mt-0.5" style={{ color: persona.accent }}>1.</span>
              <span className="text-sm text-text-body">Скопируй промпт и вставь в {user.tool === 'claude' ? 'Claude Code' : 'Cursor'}</span>
            </div>
            <div className="flex items-start gap-3 p-3 border border-border bg-surface/30">
              <span className="font-mono text-[12px] shrink-0 mt-0.5" style={{ color: persona.accent }}>2.</span>
              <span className="text-sm text-text-body">AI создаст <code className="font-mono text-ember text-xs bg-black/50 px-1">.claude/commands/bug-report.md</code></span>
            </div>
          </div>

          <div className="border border-border bg-black overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-surface/80 border-b border-border">
              <span className="font-mono text-[12px] tracking-wider" style={{ color: persona.accent }}>Промпт для /bug-report</span>
              <button onClick={handleCopy}
                className="font-mono text-[12px] tracking-wider uppercase transition-colors cursor-pointer"
                style={{ color: copied ? persona.accent : '#888' }}>
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
      <div className="text-center p-8 border" style={{ borderColor: persona.accentBorder, backgroundColor: persona.accentLight }}>
        <div className="text-3xl mb-3">⚔️</div>
        <h3 className="font-display text-lg text-white mb-2">Первый приём создан</h3>
        <p className="text-sm text-text-secondary max-w-md mx-auto">{persona.voice.success[0]}</p>
      </div>
    </PageShell>
  )
}
