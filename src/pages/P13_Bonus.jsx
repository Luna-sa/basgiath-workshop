import { useState } from 'react'
import { useWorkshopStore } from '../store/workshopStore'
import { usePersona } from '../store/usePersona'
import { PAGES } from '../data/pages'
import PageShell from '../core/PageShell'
import StepIndicator from '../components/StepIndicator'

const EMPTY = []
const PAGE_INDEX = 13
const page = PAGES[PAGE_INDEX]

// MCP servers to install
const MCP_SERVERS = [
  {
    id: 'playwright',
    name: 'Playwright',
    emoji: '🌐',
    what: 'AI получает браузер — может открывать сайты, кликать, заполнять формы, делать скриншоты',
    wow: '«Открой наш тестовый сайт, заполни форму регистрации невалидными данными и расскажи что сломалось»',
    useCase: 'Exploratory testing через AI. Он буквально тестирует сайт вместо тебя.',
  },
  {
    id: 'fetch',
    name: 'Fetch',
    emoji: '🔌',
    what: 'AI может отправлять HTTP-запросы — GET, POST, PUT, DELETE на любой API',
    wow: '«Протестируй все эндпоинты нашего API: отправь валидные и невалидные данные, проверь статус-коды»',
    useCase: 'API-тестирование без Postman. Один промпт → полный отчёт по контракту.',
  },
  {
    id: 'context7',
    name: 'Context7',
    emoji: '📚',
    what: 'AI получает актуальную документацию любых библиотек вместо устаревших знаний',
    wow: '«Напиши Playwright тесты используя ТОЛЬКО актуальный API, не устаревший»',
    useCase: 'Больше никаких галлюцинаций с deprecated методами.',
  },
]

// One-liner install commands
const CLAUDE_CODE_INSTALL = `claude mcp add playwright -- npx @playwright/mcp@latest && claude mcp add fetch -- npx @anthropic-ai/mcp-fetch && claude mcp add context7 -- npx @upstash/context7-mcp@latest`

const CURSOR_CONFIG = `{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    },
    "fetch": {
      "command": "npx",
      "args": ["@anthropic-ai/mcp-fetch"]
    },
    "context7": {
      "command": "npx",
      "args": ["@upstash/context7-mcp@latest"]
    }
  }
}`

const WOW_PROMPTS = [
  {
    title: '🌐 AI тестирует сайт',
    prompt: 'Open the website at [URL_ТЕСТОВОГО_ПРИЛОЖЕНИЯ] and test the registration form. Try: empty fields, invalid email, password "1", mismatched passwords, future date of birth. Take a screenshot of each bug you find and write a summary.',
    description: 'AI откроет браузер, зайдёт на сайт, заполнит формы, найдёт баги, сделает скриншоты',
  },
  {
    title: '🔌 AI тестирует API',
    prompt: 'Fetch https://jsonplaceholder.typicode.com/posts/1 and verify the response. Then POST to /posts with an empty body and check error handling. Finally, try a GET to /posts/99999 and document the behavior.',
    description: 'AI отправит HTTP-запросы, проверит ответы, найдёт проблемы с error handling',
  },
  {
    title: '🎯 AI пишет полный тест-план',
    prompt: 'I need to test a banking web application. Main features: login, registration, money transfer, profile management. Generate a complete test plan with: test strategy, priority areas, risk analysis, and 20 critical test cases.',
    description: 'AI сгенерирует стратегию тестирования, приоритеты и 20 критических тест-кейсов',
  },
]

export default function P13_Bonus() {
  const currentSubStep = useWorkshopStore(s => s.currentSubStep)
  const completedSubSteps = useWorkshopStore(s => s.completedSubSteps[PAGE_INDEX] ?? EMPTY)
  const navigateNext = useWorkshopStore(s => s.navigateNext)
  const user = useWorkshopStore(s => s.user)
  const persona = usePersona()
  const [copiedId, setCopiedId] = useState(null)

  const isClaudeCode = user.tool === 'claude' || user.tool === 'both'
  const installCmd = isClaudeCode ? CLAUDE_CODE_INSTALL : null

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Overview
  if (!currentSubStep) {
    return (
      <PageShell pageIndex={PAGE_INDEX}>
        <div className="space-y-5">
          <div className="p-5 border border-border border-l-[3px] border-l-qa-teal bg-qa-teal/[0.03]">
            <div className="font-mono text-[12px] tracking-[2px] uppercase text-qa-teal mb-2">Что такое MCP</div>
            <p className="text-sm text-text-body leading-relaxed">
              MCP (Model Context Protocol) даёт AI доступ к внешним инструментам.
              Без MCP — AI может только читать текст и отвечать.
              С MCP — AI может <strong className="text-white">открывать браузер</strong>, <strong className="text-white">тестировать API</strong>, <strong className="text-white">создавать issues</strong>.
            </p>
          </div>

          <div className="space-y-3">
            {MCP_SERVERS.map(s => (
              <div key={s.id} className="p-4 border border-border bg-surface/30">
                <div className="flex items-start gap-3">
                  <span className="text-xl shrink-0">{s.emoji}</span>
                  <div>
                    <div className="font-display text-[15px] text-white mb-1">{s.name}</div>
                    <p className="text-sm text-text-body mb-2">{s.what}</p>
                    <div className="p-2 bg-black/50 border border-border">
                      <p className="text-xs text-qa-teal font-mono italic">{s.wow}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <StepIndicator steps={page.subSteps} currentStepId={null} completedIds={completedSubSteps} />
        </div>
        <div className="mt-5 flex justify-center pb-16">
          <button onClick={navigateNext}
            className="inline-flex items-center gap-2.5 px-10 py-4 bg-qa-teal text-black font-body text-[15px] font-semibold tracking-[1px] rounded-[2px] hover:bg-qa-teal-soft transition-all cursor-pointer">
            Установить →
          </button>
        </div>
      </PageShell>
    )
  }

  // Step A — Install
  if (currentSubStep === 'a') {
    return (
      <PageShell pageIndex={PAGE_INDEX} subStepId="a">
        <StepIndicator steps={page.subSteps} currentStepId="a" completedIds={completedSubSteps} />
        <div className="space-y-5">

          {/* Install command */}
          <div className="border border-border bg-black overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-surface/80 border-b border-border">
              <span className="font-mono text-[12px] text-qa-teal tracking-wider">
                {isClaudeCode ? 'Вставь в терминал' : 'Cursor: Settings → MCP → Edit JSON'}
              </span>
              <button onClick={() => handleCopy(isClaudeCode ? CLAUDE_CODE_INSTALL : CURSOR_CONFIG, 'install')}
                className="font-mono text-[12px] tracking-wider uppercase hover:text-qa-teal transition-colors cursor-pointer"
                style={{ color: copiedId === 'install' ? '#00E5CC' : '#888' }}>
                {copiedId === 'install' ? '✓ Скопировано' : 'Копировать'}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto">
              <code className="font-mono text-[12px] text-text-body leading-relaxed whitespace-pre-wrap break-words">
                {isClaudeCode ? CLAUDE_CODE_INSTALL : CURSOR_CONFIG}
              </code>
            </pre>
          </div>

          {/* While it installs — explain what's happening */}
          <div className="p-4 border border-qa-teal/15 bg-qa-teal/[0.03]">
            <div className="font-mono text-[12px] text-qa-teal tracking-[2px] uppercase mb-3">Пока устанавливается — что происходит:</div>
            <div className="space-y-3">
              {MCP_SERVERS.map(s => (
                <div key={s.id} className="flex items-start gap-3">
                  <span className="text-base shrink-0">{s.emoji}</span>
                  <div>
                    <span className="text-sm text-white font-medium">{s.name}</span>
                    <span className="text-sm text-text-secondary"> — {s.useCase}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 border border-border bg-surface/30">
            <p className="text-xs text-text-secondary">
              <span className="text-qa-teal font-mono text-[12px] uppercase">Проверка:</span>{' '}
              После установки введи <code className="font-mono text-ember text-xs bg-black/50 px-1">claude mcp list</code> — должны появиться playwright, fetch, context7
            </p>
          </div>
        </div>
      </PageShell>
    )
  }

  // Step B — WOW Demo
  return (
    <PageShell pageIndex={PAGE_INDEX} subStepId="b">
      <StepIndicator steps={page.subSteps} currentStepId="b" completedIds={completedSubSteps} />
      <div className="space-y-5">
        <div className="p-4 border border-l-[3px]" style={{ borderColor: persona.accentBorder, borderLeftColor: persona.accent, backgroundColor: persona.accentLight }}>
          <div className="font-mono text-[12px] tracking-[2px] uppercase mb-2" style={{ color: persona.accent }}>{persona.voice.taskIntro}</div>
          <p className="text-sm text-text-body">
            Выбери промпт, скопируй и вставь в {user.tool === 'claude' ? 'Claude Code' : 'Cursor'}. Смотри как AI работает.
          </p>
        </div>

        {WOW_PROMPTS.map((p, i) => (
          <div key={i} className="border border-border bg-surface/30 overflow-hidden">
            <div className="p-4">
              <div className="font-display text-[15px] text-white mb-1">{p.title}</div>
              <p className="text-xs text-text-secondary mb-3">{p.description}</p>
            </div>
            <div className="bg-black border-t border-border">
              <div className="flex items-center justify-between px-4 py-2 border-b border-border/50">
                <span className="font-mono text-[11px] text-text-dim">Промпт</span>
                <button onClick={() => handleCopy(p.prompt, `wow-${i}`)}
                  className="font-mono text-[12px] tracking-wider uppercase hover:text-qa-teal transition-colors cursor-pointer"
                  style={{ color: copiedId === `wow-${i}` ? '#00E5CC' : '#888' }}>
                  {copiedId === `wow-${i}` ? '✓' : 'Копировать'}
                </button>
              </div>
              <pre className="p-3 overflow-x-auto">
                <code className="font-mono text-[12px] text-qa-teal leading-relaxed whitespace-pre-wrap break-words">{p.prompt}</code>
              </pre>
            </div>
          </div>
        ))}

        <div className="p-4 border border-ember/20 bg-ember/[0.03]">
          <p className="text-sm text-text-body">
            <span className="text-ember font-mono text-[12px] uppercase">WOW-момент</span>{' '}
            — Промпт #1 с Playwright самый впечатляющий. AI откроет браузер у тебя на глазах, зайдёт на сайт, начнёт кликать и тестировать. Это то, что меняет представление о роли QA.
          </p>
        </div>
      </div>
    </PageShell>
  )
}
