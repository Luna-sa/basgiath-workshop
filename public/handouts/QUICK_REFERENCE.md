# Claude Code — Quick Reference

One page. Pin it next to your monitor.

---

## Slash commands (built-in)

| Command | What it does |
|---|---|
| `/help` | List all available commands. |
| `/clear` | Wipe conversation. Keeps config. |
| `/compact <focus>` | Summarise conversation, free up context. |
| `/cost` | Tokens used + dollars spent this session. |
| `/status` | Current model, tools, MCP servers, working dir. |
| `/login` / `/logout` | Manage Anthropic auth. |
| `/model <opus\|sonnet\|haiku>` | Switch model mid-session. |
| `/init` | Generate a starter CLAUDE.md for the current project. |
| `/memory` | Edit project CLAUDE.md from inside Claude. |
| `/permissions` | View / edit allowed tools. |
| `/mcp` | List + manage MCP servers. |
| `/agents` | List installed subagents. |
| `/review` | Review the current PR / diff. |
| `/bug` | Report a bug to Anthropic. |

## Slash commands (QA workshop set)

| Command | What it does |
|---|---|
| `/bug-report <description>` | Generate a structured bug report. |
| `/test-cases <feature>` | 15-25 cases: positive, negative, boundary, edge. |
| `/review` | QA-grade code review with severity table. |
| `/checklist <feature>` | Pre-release smoke + regression checklist. |
| `/api-test <endpoint>` | API scenarios + cURL samples. |
| `/regression <change>` | Map change → affected features → regression set. |
| `/analyze-log <text>` | Root cause + severity + reproduction hint. |

---

## Hotkeys

| Key | Action |
|---|---|
| `Shift+Tab` | Cycle Plan Mode / Edit Mode / Auto-Accept Mode. |
| `Esc Esc` | Cancel current Claude action mid-stream. |
| `Ctrl+R` | Toggle verbose mode (show tool I/O). |
| `Ctrl+L` | Clear screen, keep conversation. |
| `Up arrow` | Recall last prompt. |
| `Ctrl+C` then `Ctrl+C` | Exit Claude. |
| `@<path>` | Mention a file (autocompletes). |
| `#<rule>` | Append rule to CLAUDE.md (asks first). |
| `Cmd+V` (mac) / `Ctrl+V` | Paste image directly into chat. |

---

## MCP commands

| Command | What it does |
|---|---|
| `claude mcp add <name> -- <cmd>` | Install an MCP server. |
| `claude mcp list` | List configured servers. |
| `claude mcp remove <name>` | Remove a server. |
| `claude mcp get <name>` | Show server config. |

### Workshop MCP set

```bash
claude mcp add playwright -- npx @playwright/mcp@latest
claude mcp add fetch      -- npx @anthropic-ai/mcp-fetch
claude mcp add context7   -- npx @upstash/context7-mcp@latest
```

▲ Restart Claude Code after adding MCPs.

---

## Plan Mode triggers

| Trigger | Effect |
|---|---|
| `Shift+Tab` (1×) | Plan Mode — read-only until approved. |
| `Shift+Tab` (2×) | Auto-Accept Mode — Claude executes without asking. |
| `Shift+Tab` (3×) | Back to default Edit Mode. |
| Prompt: "make a plan first" | Forces planning behaviour even outside Plan Mode. |
| Prompt: "don't write code yet, just outline" | Same. |

---

## CLI flags

| Flag | Meaning |
|---|---|
| `claude --continue` | Resume your last session. |
| `claude --resume` | Pick from a list of past sessions. |
| `claude --model <opus\|sonnet\|haiku>` | Start with a specific model. |
| `claude -p "<prompt>"` | Headless one-shot. Pipe-friendly. |
| `claude --add-dir <path>` | Allow Claude into an extra directory. |
| `claude --version` | Print version. |

---

## File locations

| Path | Purpose |
|---|---|
| `~/.claude/CLAUDE.md` | Global persona / rules. Loaded every session. |
| `~/.claude/commands/` | Global slash commands. |
| `~/.claude/agents/` | Global subagents. |
| `~/.claude/settings.json` | Permissions, hooks, env vars. |
| `~/.claude/skills/` | Reusable workflow skills. |
| `<project>/CLAUDE.md` | Project-specific rules. |
| `<project>/.claude/commands/` | Project-specific slash commands. |
| `<project>/.claude/settings.local.json` | Per-project overrides. |

---

## When stuck

1. `/status` — confirm model, MCP, tools.
2. `claude mcp list` — confirm MCPs attached.
3. `cat ~/.claude/CLAUDE.md | head` — confirm persona loaded.
4. Run the **Resume-from-error** prompt from the workshop Resource Hub.

---

*Basgiath QA Workshop — print, fold, keep.*
