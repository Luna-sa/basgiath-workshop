const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.3-70b-versatile'

/**
 * Send text to Groq for AI evaluation.
 * Returns { score, maxScore, feedback, details }
 */
export async function evaluateSubmission(type, text) {
  if (!GROQ_API_KEY || !text.trim()) {
    return null
  }

  const rubric = type === 'bug-report'
    ? BUG_REPORT_RUBRIC
    : TEST_CASES_RUBRIC

  try {
    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: rubric },
          { role: 'user', content: text },
        ],
        temperature: 0.3,
        max_tokens: 800,
      }),
    })

    if (!res.ok) {
      console.warn('Groq API error:', res.status)
      return null
    }

    const data = await res.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) return null

    return parseEvaluation(content)
  } catch (e) {
    console.warn('Groq request failed:', e.message)
    return null
  }
}

function parseEvaluation(text) {
  // Try to extract score from AI response
  const scoreMatch = text.match(/(\d+)\s*\/\s*(\d+)/)
  const score = scoreMatch ? parseInt(scoreMatch[1]) : null
  const maxScore = scoreMatch ? parseInt(scoreMatch[2]) : 10

  return {
    score,
    maxScore,
    feedback: text,
    xpBonus: score ? Math.round((score / maxScore) * 30) : 10,
  }
}

const BUG_REPORT_RUBRIC = `You are a QA mentor evaluating a bug report written by a junior tester during a workshop.

Rate the bug report on a scale of 1-10 based on these criteria:
- Title: clear, includes feature area (0-1 points)
- Severity: correctly assessed as Critical/Major/Minor (0-1 points)
- Steps to Reproduce: specific, numbered, anyone can follow (0-2 points)
- Expected vs Actual Result: both clearly stated (0-2 points)
- Environment info: OS, browser, version (0-1 points)
- Reproducibility: stated frequency (0-1 points)
- Additional checks or suggestions (0-1 points)
- Overall clarity and professionalism (0-1 points)

Respond in Russian. Format:

**Оценка: X/10**

**Что хорошо:**
- (2-3 bullet points)

**Что улучшить:**
- (2-3 bullet points)

**Совет:** (one actionable tip)

Be encouraging but honest. This is a learning workshop — focus on growth, not criticism.`

const TEST_CASES_RUBRIC = `You are a QA mentor evaluating test cases written by a junior tester during a workshop.

Rate the test cases on a scale of 1-10 based on these criteria:
- Format: structured table or list with clear columns (0-1 points)
- Positive cases (happy path): present and correct (0-2 points)
- Negative cases (invalid input, errors): present (0-2 points)
- Boundary cases (min, max, zero, empty): present (0-2 points)
- Edge cases (special chars, concurrent actions): present (0-1 points)
- Priority levels assigned (0-1 points)
- Coverage completeness: are major scenarios covered? (0-1 points)

Respond in Russian. Format:

**Оценка: X/10**

**Что хорошо:**
- (2-3 bullet points)

**Что улучшить:**
- (2-3 bullet points)

**Совет:** (one actionable tip)

Be encouraging but honest. This is a learning workshop — focus on growth, not criticism.`
