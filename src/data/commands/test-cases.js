export const TEST_CASES_COMMAND = {
  filename: 'test-cases.md',
  path: '.claude/commands/test-cases.md',
  template: `Generate test cases for this feature:
$ARGUMENTS

Format as table:
ID | Title | Type | Steps | Expected | Priority

Include: positive (happy path), negative (invalid input),
boundary (min/max/zero/empty), edge cases (special chars,
concurrent use), error handling (network fail, timeout).

Priority: Critical > High > Medium > Low
Aim for 15-25 test cases.`,
}
