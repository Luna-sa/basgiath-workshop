import { useState } from 'react'
import { useWorkshopStore } from '../store/workshopStore'
import { usePersona } from '../store/usePersona'
import { PAGES } from '../data/pages'
import PageShell from '../core/PageShell'
import StepIndicator from '../components/StepIndicator'

const EMPTY = []
const PAGE_INDEX = 7
const page = PAGES[PAGE_INDEX]

function generatePrompt(user) {
  const role = {
    manual: 'manual QA engineer (exploratory testing, test case design, bug reporting)',
    automation: 'QA automation engineer (writing automated tests, CI/CD, test frameworks)',
    lead: 'QA lead / manager (team coordination, test strategy, quality metrics)',
    dev: 'developer who also does testing',
    other: 'QA specialist',
  }[user.role] || 'QA engineer'

  const tool = user.tool === 'claude' ? 'Claude Code in terminal' : 'Cursor IDE'

  return `You are helping me set up my AI coding assistant. I need you to create a complete CLAUDE.md file for my project.

About me:
- I am a ${role}
- I use ${tool}
- My experience with AI tools: ${user.experience === 'daily' ? 'I use AI regularly' : user.experience === 'tried' ? 'I have tried ChatGPT' : 'I am new to AI tools'}

Please create a CLAUDE.md file that includes ALL of these sections:

1. **My Role** — describe who I am and what I do daily (manual testing, bug reports, code review, test cases, log analysis)

2. **Code Review Rules** — when I ask to review code, focus on: edge cases, error handling, missing validation, null/undefined checks, testability, hardcoded values. Always list what test cases the code needs.

3. **Test Case Format** — when I ask for test cases, use table format: ID | Title | Preconditions | Steps | Expected Result | Priority. Always include: positive, negative, boundary, and edge cases. Group by functional area then priority.

4. **Bug Report Format** — when I describe a bug, create a report with: Title, Severity (Critical/Major/Minor), Environment, Steps to Reproduce, Expected vs Actual, Reproducibility. Suggest additional checks.

5. **Communication Style** — explain technical concepts simply, use tables and lists (not walls of text), add comments when showing code, warn clearly about risks.

Output the complete file content ready to save as CLAUDE.md. Make it practical and specific to QA work.`
}

export default function P07_Threshing() {
  const currentSubStep = useWorkshopStore(s => s.currentSubStep)
  const completedSubSteps = useWorkshopStore(s => s.completedSubSteps[PAGE_INDEX] ?? EMPTY)
  const navigateNext = useWorkshopStore(s => s.navigateNext)
  const user = useWorkshopStore(s => s.user)
  const persona = usePersona()
  const [copied, setCopied] = useState(false)

  const prompt = generatePrompt(user)

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Overview — entry point
  if (!currentSubStep) {
    return (
      <PageShell pageIndex={PAGE_INDEX}>
        <div className="space-y-5">
          <div className="p-5 border border-border border-l-[3px] border-l-qa-teal bg-qa-teal/[0.03]">
            <div className="font-mono text-[12px] tracking-[2px] uppercase text-qa-teal mb-3">Новый подход</div>
            <p className="text-sm text-text-body leading-relaxed">
              Вместо того чтобы набирать CLAUDE.md руками — пусть твой AI-агент сделает это за тебя.
              Ты скопируешь один промпт, вставишь его в <strong className="text-white">{user.tool === 'claude' ? 'Claude Code' : 'Cursor'}</strong>,
              и получишь полностью готовый файл, настроенный под твою роль.
            </p>
          </div>

          <StepIndicator steps={page.subSteps} currentStepId={null} completedIds={completedSubSteps} />

          <div className="grid gap-3">
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

  // Step A — Magic Prompt
  if (currentSubStep === 'a') {
    return (
      <PageShell pageIndex={PAGE_INDEX} subStepId="a">
        <StepIndicator steps={page.subSteps} currentStepId="a" completedIds={completedSubSteps} />

        <div className="space-y-5">
          {/* Instructions */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 border border-border bg-surface/30">
              <span className="font-mono text-[12px] text-qa-teal shrink-0 mt-0.5">1.</span>
              <span className="text-sm text-text-body">
                Открой <strong className="text-white">{user.tool === 'claude' ? 'терминал и запусти claude' : 'Cursor (Cmd+I / Ctrl+I)'}</strong>
              </span>
            </div>
            <div className="flex items-start gap-3 p-3 border border-border bg-surface/30">
              <span className="font-mono text-[12px] text-qa-teal shrink-0 mt-0.5">2.</span>
              <span className="text-sm text-text-body">Скопируй промпт ниже и вставь его в чат с AI</span>
            </div>
            <div className="flex items-start gap-3 p-3 border border-border bg-surface/30">
              <span className="font-mono text-[12px] text-qa-teal shrink-0 mt-0.5">3.</span>
              <span className="text-sm text-text-body">AI сгенерирует полный CLAUDE.md — сохрани его в корень проекта</span>
            </div>
          </div>

          {/* Personalized badge */}
          <div className="flex items-center gap-3 p-3 border border-qa-teal/20 bg-qa-teal/[0.03]">
            <span className="text-lg">⚡</span>
            <div>
              <div className="font-mono text-[11px] text-qa-teal tracking-[2px] uppercase">Персонализировано</div>
              <div className="text-xs text-text-secondary">
                Промпт адаптирован под твою роль ({user.role || 'QA'}) и инструмент ({user.tool === 'claude' ? 'Claude Code' : 'Cursor'})
              </div>
            </div>
          </div>

          {/* The prompt */}
          <div className="border border-border bg-black overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-surface/80 border-b border-border">
              <span className="font-mono text-[12px] text-qa-teal tracking-wider">Magic Prompt</span>
              <button
                onClick={handleCopy}
                className="font-mono text-[12px] tracking-wider uppercase hover:text-qa-teal transition-colors cursor-pointer"
                style={{ color: copied ? '#00E5CC' : '#888' }}
              >
                {copied ? '✓ Скопировано' : 'Копировать'}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto max-h-[240px] overflow-y-auto">
              <code className="font-mono text-[13px] text-text-body leading-relaxed whitespace-pre-wrap break-words">
                {prompt}
              </code>
            </pre>
          </div>

          {/* Character-specific tip */}
          <div className="p-4 border" style={{ borderColor: persona.accentBorder, backgroundColor: persona.accentLight }}>
            <p className="text-xs text-text-secondary">
              <span className="font-mono text-[12px] uppercase" style={{ color: persona.accent }}>Твой подход</span>{' '}
              — {persona.approach.promptStyle}
            </p>
          </div>
        </div>
      </PageShell>
    )
  }

  // Step B — Confirmation
  return (
    <PageShell pageIndex={PAGE_INDEX} subStepId="b">
      <StepIndicator steps={page.subSteps} currentStepId="b" completedIds={completedSubSteps} />

      <div className="text-center space-y-6">
        <div className="p-8 border border-qa-teal/30 bg-qa-teal/[0.05]">
          <div className="text-4xl mb-3">🐉</div>
          <h3 className="font-display text-xl text-white mb-3">Связь установлена?</h3>
          <p className="text-sm text-text-secondary max-w-md mx-auto mb-4">
            Убедись, что CLAUDE.md создан и содержит секции: роль, код-ревью, тест-кейсы, баг-репорты, стиль общения.
          </p>

          <div className="grid gap-2 max-w-sm mx-auto text-left">
            {['Файл CLAUDE.md в корне проекта', 'Описание роли QA', 'Правила код-ревью', 'Формат тест-кейсов', 'Формат баг-репортов'].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-text-secondary">
                <span className="text-qa-teal">✓</span> {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  )
}
