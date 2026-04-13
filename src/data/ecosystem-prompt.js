// The one-prompt QA ecosystem installer
// Student pastes this into Claude Code or Cursor → gets full setup

export function generateEcosystemPrompt(user) {
  const role = {
    manual: 'manual QA engineer — exploratory testing, test cases, bug reports, log analysis',
    automation: 'QA automation engineer — test frameworks, CI/CD, automated tests',
    lead: 'QA lead — test strategy, team coordination, quality metrics',
    dev: 'developer who also does testing',
    other: 'QA specialist',
  }[user.role] || 'QA engineer'

  return `Set up a complete QA ecosystem for me. I am a ${role}. Do everything in one go:

## 1. Create CLAUDE.md in the project root with:
- My role: ${role}
- Code review rules: focus on edge cases, error handling, null checks, testability
- Test case format: table with ID, Title, Steps, Expected, Priority. Always include positive, negative, boundary, edge cases
- Bug report format: Title, Severity, Steps to Reproduce, Expected vs Actual, Environment
- Communication: simple language, tables not paragraphs, warn about risks

## 2. Create these 7 slash commands in .claude/commands/:

**bug-report.md** — Takes $ARGUMENTS bug description, generates professional report with Title, Severity (Critical/Major/Minor), Steps to Reproduce, Expected vs Actual, Reproducibility, suggested additional checks.

**test-cases.md** — Takes $ARGUMENTS feature description, generates 15-25 test cases in table format covering positive, negative, boundary, edge cases, error handling. Priority: Critical > High > Medium > Low.

**review.md** — Reviews code for: input validation gaps, error handling, edge cases (null, empty, Unicode), security basics (injection, XSS), testability. Output: issues table by severity + recommended test cases.

**checklist.md** — Takes $ARGUMENTS feature name, generates pre-release testing checklist: smoke tests, regression areas, integration points, performance checks, accessibility basics.

**api-test.md** — Takes $ARGUMENTS endpoint description, generates API test scenarios: valid request (200), missing fields (400), unauthorized (401), not found (404), boundary values, malformed JSON. Include sample cURL commands.

**regression.md** — Takes $ARGUMENTS code change description, maps change to affected features, suggests minimal regression set + full regression set, flags integration risks.

**analyze-log.md** — Takes $ARGUMENTS error log or stack trace, identifies root cause in simple terms, suggests what logs to collect, rates severity, suggests how to reproduce.

## 3. Create these 4 agents in .claude/agents/:

**qa-reviewer.md** — Reviews pull requests from QA perspective. Checks: are tests added? Edge cases covered? Error handling present? Security basics? Generates review comment with findings by severity.

**test-generator.md** — Generates comprehensive test suites for a given module. Reads the code, identifies all functions, generates unit tests covering happy path, error cases, boundary values. Outputs ready-to-run test file.

**security-scanner.md** — Scans code for common vulnerabilities: hardcoded secrets, SQL injection, XSS, insecure dependencies, missing auth checks, sensitive data in logs. Outputs findings with OWASP references.

**bug-triager.md** — Takes a bug report, analyzes severity and priority, suggests which component/team owns it, estimates impact radius, recommends fix approach and regression tests needed.

## 4. Install MCP servers (run these commands):
\`\`\`
claude mcp add playwright -- npx @playwright/mcp@latest
claude mcp add fetch -- npx @anthropic-ai/mcp-fetch
claude mcp add context7 -- npx @upstash/context7-mcp@latest
\`\`\`

Create ALL files now. Don't ask questions — just build everything.`
}

export const CURSOR_ECOSYSTEM_PROMPT = `I need you to create a complete QA workspace setup. Create these files:

1. .cursorrules — with QA engineer context, code review rules, test case format, bug report format

2. Create folder .cursor/commands/ with these files:
   - bug-report.md, test-cases.md, review.md, checklist.md, api-test.md, regression.md, analyze-log.md
   (Same content as described — QA-focused slash commands)

3. In Cursor Settings > MCP, add:
   - playwright: npx @playwright/mcp@latest
   - fetch: npx @anthropic-ai/mcp-fetch
   - context7: npx @upstash/context7-mcp@latest

Create all files now.`
