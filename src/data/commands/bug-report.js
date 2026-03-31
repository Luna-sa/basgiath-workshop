export const BUG_REPORT_COMMAND = {
  filename: 'bug-report.md',
  path: '.claude/commands/bug-report.md',
  template: `Take this bug description and create a complete professional bug report.

Bug description: $ARGUMENTS

Include: Title, Severity (Critical/Major/Minor), Environment,
Preconditions, Steps to Reproduce, Expected Result, Actual Result,
Reproducibility, Suggested additional checks.

Assess severity based on impact:
- Critical: crash, data loss, security breach
- Major: feature broken, incorrect data
- Minor: cosmetic, workaround exists`,
}
