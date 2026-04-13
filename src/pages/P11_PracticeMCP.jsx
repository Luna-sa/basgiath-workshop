import { useState } from 'react'
import { useWorkshopStore } from '../store/workshopStore'
import { usePersona } from '../store/usePersona'
import PageShell from '../core/PageShell'
import SubmissionReview from '../components/SubmissionReview'

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
  const [showReview, setShowReview] = useState(false)

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <PageShell pageIndex={11}>
      <div className="space-y-4">
        <div className="p-4 border border-l-[4px] bg-[#141414] rounded-lg" style={{ borderColor: persona.accentBorder, borderLeftColor: persona.accent }}>
          <p className="text-[16px] text-text-body">Выбери промпт, скопируй, вставь в Claude Code / Cursor. Потом вставь результат на ревью.</p>
        </div>

        {WOW_PROMPTS.map((p, i) => (
          <div key={i} className="border border-[#2E2E2E] bg-[#141414] rounded-lg overflow-hidden">
            <div className="p-4">
              <div className="font-display text-[16px] text-white mb-1">{p.title}</div>
              <p className="text-[13px] text-text-secondary">{p.desc}</p>
            </div>
            <div className="bg-black border-t border-[#1E1E1E]">
              <div className="flex items-center justify-between px-4 py-2 border-b border-[#1E1E1E]">
                <span className="font-mono text-[12px] text-text-dim">Промпт</span>
                <button onClick={() => handleCopy(p.prompt, i)} className="font-mono text-[13px] tracking-wider uppercase transition-colors cursor-pointer" style={{ color: copiedId === i ? persona.accent : '#888' }}>
                  {copiedId === i ? '✓ Скопировано' : 'Копировать'}
                </button>
              </div>
              <pre className="p-4 overflow-x-auto"><code className="font-mono text-[13px] text-qa-teal whitespace-pre-wrap break-words">{p.prompt}</code></pre>
            </div>
          </div>
        ))}

        {/* AI Review or completion */}
        {submitted ? (
          <div className="text-center p-5 border border-forest/30 bg-forest/[0.05] rounded-lg">
            <p className="text-[16px] text-forest">{persona.voice.success[0]}</p>
          </div>
        ) : showReview ? (
          <SubmissionReview
            type="test-cases"
            pageIndex={11}
            onComplete={() => completePage(11)}
          />
        ) : (
          <div className="space-y-3">
            <button
              onClick={() => setShowReview(true)}
              className="w-full px-6 py-4 text-black font-body text-[15px] font-semibold rounded-lg transition-all cursor-pointer"
              style={{ backgroundColor: persona.accent }}
            >
              Вставить результат на AI-ревью
            </button>
            <button
              onClick={() => { useWorkshopStore.getState().addXP(40); completePage(11) }}
              className="w-full px-6 py-3 text-text-dim text-[14px] border border-[#2E2E2E] rounded-lg hover:border-text-dim transition-colors cursor-pointer"
            >
              Пропустить ревью (+40 XP)
            </button>
          </div>
        )}
      </div>
    </PageShell>
  )
}
