import PageShell from '../core/PageShell'
import CodeBlock from '../components/CodeBlock'

const REVIEW = `Review the code from a QA perspective. Focus on what could go wrong.

Analyze:
1. Input validation gaps (null, empty, zero, negative)
2. Error handling (caught? meaningful messages?)
3. Edge cases (Unicode, long strings, concurrent ops)
4. Security basics (SQL injection, XSS, data in logs)
5. Testability (can this be unit tested?)

Output:
### Critical Issues | File:Line | Issue | Risk | Test needed |
### Major Issues | File:Line | Issue | Risk | Test needed |
### Recommended Test Cases`

export default function P13_Bonus() {
  return (
    <PageShell pageIndex={13}>
      <div className="space-y-6">
        <div className="p-5 border border-border bg-surface/30">
          <div className="font-mono text-[11px] tracking-[2px] uppercase text-ember mb-3">Бонус</div>
          <p className="text-sm text-text-body">Создай <code className="font-mono text-ember text-xs bg-black/50 px-1">.claude/commands/review.md</code>:</p>
        </div>
        <CodeBlock code={REVIEW} filename=".claude/commands/review.md" />
        <div className="p-4 border border-qa-teal/15 bg-qa-teal/[0.03]">
          <p className="text-xs text-text-secondary"><span className="text-qa-teal font-mono text-[12px] uppercase">+30 XP</span> — необязательное задание для быстрых.</p>
        </div>
      </div>
    </PageShell>
  )
}
