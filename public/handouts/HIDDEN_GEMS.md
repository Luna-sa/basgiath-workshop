# Hidden Gems — 22 Power-User Claude Code Features

The stuff most people never discover. Each one shaves real time off real work.

---

## 1. Plan Mode (Shift+Tab → Tab)
Press `Shift+Tab` to cycle through modes. Plan Mode makes Claude lay out the work before touching files — read-only until you approve. Your safety net for risky refactors.
**Try:** `Shift+Tab` → ask "refactor the auth module" → review the plan → `Tab` to execute.

## 2. Custom Slash Commands (`.claude/commands/`)
Drop a markdown file in `.claude/commands/` — it becomes a slash command. `$ARGUMENTS` is interpolated.
**Try:** `.claude/commands/bug-report.md` containing "Generate a bug report for: $ARGUMENTS" → use `/bug-report login fails on Safari`.

## 3. Subagents (`.claude/agents/`)
Specialist personas with their own instructions. Claude invokes them automatically when relevant.
**Try:** `.claude/agents/security-scanner.md` with OWASP-focused instructions → Claude pulls it in when reviewing auth code.

## 4. CLAUDE.md as Project Memory
A `CLAUDE.md` in the project root is auto-loaded into every session. Put your style guide, test format, project glossary here.
**Try:** Write your bug-report template into CLAUDE.md once. Every future report follows it.

## 5. Hooks (`~/.claude/settings.json`)
`PreToolUse`, `PostToolUse`, `Stop` — run shell commands when Claude does things. Auto-format on edit, log every action, block dangerous tools.
**Try:** PostToolUse on `Edit` → `prettier --write $FILE` to auto-format on every change.

## 6. MCP Servers
Pluggable tools — Playwright (browsers), Fetch (HTTP), Context7 (live docs), Filesystem, GitHub, your own. Add with `claude mcp add`.
**Try:** `claude mcp add playwright -- npx @playwright/mcp@latest` → Claude can now drive a real browser.

## 7. `@`-File Mentions
Type `@` in chat — autocompletes file paths. Forces Claude to actually read the file before responding.
**Try:** "Why is `@src/auth.js` failing on the third test case?" — far more accurate than describing the file.

## 8. `#`-To-Memory Shortcut
Start a message with `#` and it gets appended to CLAUDE.md (after confirmation). Capture rules as you discover them.
**Try:** `# always use vitest, never jest` → next session, the rule is already loaded.

## 9. Image Paste in Terminal
Drag an image into the terminal (or `cmd+v` a screenshot). Claude reads it. Killer for UI bugs and screenshots from QA tickets.
**Try:** Paste a Figma screenshot → "translate this layout to Tailwind".

## 10. `--resume` and `--continue`
`claude --continue` picks up your last session. `claude --resume` shows a list of past sessions to jump back into.
**Try:** Closed your laptop mid-task? `claude --continue` and you're back exactly where you were.

## 11. `/compact` to Trim Context
Long session getting slow? `/compact` summarises the conversation so far and frees up context window. You don't lose the thread.
**Try:** After 50+ turns of debugging — `/compact "keep the auth bug findings"` to keep what matters.

## 12. `/clear` Mid-Session
Wipes the conversation but keeps your CLAUDE.md and tool config. Faster than restarting Claude.
**Try:** Switching tasks? `/clear` instead of relaunching.

## 13. Bash Auto-Approval Rules
In `~/.claude/settings.json` you can pre-approve specific commands so Claude doesn't ask each time. `git status`, `npm test`, `ls` are safe candidates.
**Try:** `"permissions": { "allow": ["Bash(git status)", "Bash(npm test)"] }` — fewer interruptions.

## 14. Plan Mode + Long Bash Commands
In Plan Mode, you see exactly which shell commands Claude wants to run before any execute. Catch a `rm -rf` typo before it runs.
**Try:** Always use Plan Mode the first time you let Claude touch infra scripts.

## 15. Skills (`~/.claude/skills/`)
Reusable workflows packaged as markdown. Claude auto-detects when a skill applies and loads it.
**Try:** A `security-review` skill that runs the same 30 checks on every PR — invoked by saying "review this for security".

## 16. Headless Mode (`-p` flag)
`claude -p "summarise this log" < error.log` — one-shot, scriptable, no UI. Pipe into anything.
**Try:** Cron job that runs `claude -p "..."` every morning to summarise yesterday's CI failures.

## 17. Worktrees for Parallel Sessions
Open the same repo in two git worktrees → run two Claude sessions in parallel on different branches. No context bleed.
**Try:** `git worktree add ../feature-branch` → second Claude session on the new branch while the first keeps working.

## 18. `/cost` and `/status`
`/cost` shows token usage and dollars spent in the current session. `/status` shows model, tools, MCP servers attached.
**Try:** Run `/cost` after a long debug session — you'll learn which patterns burn tokens.

## 19. Context7 MCP for Live Docs
Stops Claude from making up API signatures. Pulls current docs for any library.
**Try:** "Use context7: how do I configure middleware in Hono v4?" — current syntax, not 2023 syntax.

## 20. `--model` Flag (Opus / Sonnet / Haiku)
Pick the brain per session. Opus for hard architectural calls, Sonnet for daily code, Haiku for simple repetitive tasks.
**Try:** `claude --model haiku` for a session that's just renaming variables — 10x cheaper.

## 21. Hotkeys Worth Memorising
- `Esc Esc` — bail out of the current Claude action mid-stream.
- `Ctrl+R` — toggle verbose mode (see tool input/output).
- `Shift+Tab` — cycle Plan Mode / Edit Mode / Auto-Accept.
- `Ctrl+L` — clear screen, keep conversation.
- `Up arrow` — recall last prompt.

## 22. Output to File via `>`
Long Claude output? End your prompt with "save the result to `./output.md`". Claude writes the file directly.
**Try:** "Generate 50 test cases for the cart module and save them to `tests/cart-cases.md`."

---

*The dragon doesn't pick the rider for comfort. He picks for what they'll become.*

— Basgiath QA Workshop
