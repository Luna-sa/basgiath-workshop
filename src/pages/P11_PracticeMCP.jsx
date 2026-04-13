import { useState } from 'react'
import { useWorkshopStore } from '../store/workshopStore'
import { usePersona } from '../store/usePersona'
import PageShell from '../core/PageShell'

const WOW_PROMPTS = [
  { title: '🌐 AI тестирует сайт', prompt: 'Open the website at https://basgiath-workshop.onrender.com/sample-project/index.html and test the registration form. Try: empty fields, invalid email, password "1", mismatched passwords, future date of birth. Report all bugs found.', desc: 'AI откроет браузер, зайдёт на сайт, заполнит формы, найдёт баги' },
  { title: '🔌 AI тестирует API', prompt: 'Fetch https://jsonplaceholder.typicode.com/posts/1 and verify the response. Then POST to /posts with empty body and check error handling. Document the behavior.', desc: 'AI отправит запросы, проверит ответы' },
  { title: '🎯 AI пишет тест-план', prompt: 'Generate a complete test plan for a banking web application with: login, registration, money transfer, profile management. Include test strategy, risk analysis, and 20 critical test cases.', desc: 'AI сгенерирует стратегию и 20 тест-кейсов' },
]

export default function P11_PracticeMCP() {
  const persona = usePersona()
  const completePage = useWorkshopStore(s => s.completePage)
  const submitted = useWorkshopStore(s => s.completedPages).includes(11)
  const [copiedId, setCopiedId] = useState(null)

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <PageShell pageIndex={11}>
      <div className="space-y-4">
        <div className="p-4 border border-l-[3px] bg-surface/30" style={{ borderColor: persona.accentBorder, borderLeftColor: persona.accent }}>
          <p className="text-sm text-text-body">Выбери промпт, скопируй и вставь в Claude Code / Cursor. Смотри как AI работает.</p>
        </div>

        {WOW_PROMPTS.map((p, i) => (
          <div key={i} className="border border-border bg-surface/30 overflow-hidden">
            <div className="p-3">
              <div className="font-display text-[14px] text-white mb-1">{p.title}</div>
              <p className="text-xs text-text-secondary">{p.desc}</p>
            </div>
            <div className="bg-black border-t border-border">
              <div className="flex items-center justify-between px-3 py-1.5 border-b border-border/50">
                <span className="font-mono text-[10px] text-text-dim">Промпт</span>
                <button onClick={() => handleCopy(p.prompt, i)} className="font-mono text-[11px] tracking-wider uppercase transition-colors cursor-pointer" style={{ color: copiedId === i ? persona.accent : '#888' }}>
                  {copiedId === i ? '✓' : 'Copy'}
                </button>
              </div>
              <pre className="p-3 overflow-x-auto"><code className="font-mono text-[11px] text-qa-teal whitespace-pre-wrap break-words">{p.prompt}</code></pre>
            </div>
          </div>
        ))}

        <div className="p-3 border border-ember/20 bg-ember/[0.03]">
          <p className="text-xs text-text-body">
            <span className="text-ember font-mono text-[11px] uppercase">WOW</span>{' '}— Промпт #1 с Playwright самый впечатляющий. AI откроет браузер у тебя на глазах.
          </p>
        </div>
      </div>
    </PageShell>
  )
}
