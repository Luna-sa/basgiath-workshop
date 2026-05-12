// CLAUDE.md section templates - what students type/paste during the workshop

export const CLAUDE_MD_SECTIONS = {
  role: {
    title: 'My Role',
    instructions: 'Опиши, кто ты и чем занимаешься. Это даёт AI контекст твоей роли.',
    template: `# QA Workspace

## My Role
I am a QA engineer. I do manual testing, write bug reports, review code for
testability, create test cases from requirements, and analyze logs.`,
  },

  codeReview: {
    title: 'Code Review',
    instructions: 'Объясни AI, как ревьюить код глазами QA - на что обращать внимание.',
    template: `## How You Should Help Me

### When I ask you to review code:
- Focus on: edge cases, error handling, missing validation, null/undefined checks
- Check: can this code be tested easily? If not, suggest how to make it testable
- Look for: hardcoded values, missing error messages, unclear variable names
- Always list what test cases this code needs`,
  },

  testCases: {
    title: 'Test Cases',
    instructions: 'Задай формат и правила генерации тест-кейсов.',
    template: `### When I ask you to write test cases:
- Use this format: ID | Title | Preconditions | Steps | Expected Result | Priority
- Always include: positive, negative, boundary, and edge cases
- Group by: functional area, then priority (Critical > High > Medium > Low)
- Think about: what would break if a developer made a mistake?`,
  },

  bugReportsStyle: {
    title: 'Bug Reports + Style',
    instructions: 'Формат баг-репортов и стиль общения.',
    template: `### When I ask about a bug:
- Help me write a clear bug report with: Summary, Environment, Steps to
  Reproduce, Expected vs Actual, Severity, Screenshots/Logs section
- Suggest additional checks I should do before reporting

### Communication style:
- Explain technical concepts simply - I may not know the code internals
- When showing code, add comments explaining what each part does
- Use tables and structured lists, not walls of text
- If something is risky, warn me clearly`,
  },
}

export const FULL_CLAUDE_MD = Object.values(CLAUDE_MD_SECTIONS)
  .map(s => s.template)
  .join('\n\n')
