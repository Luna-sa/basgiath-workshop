# Workshop improvements — deferred queue

Items below were surfaced by the slide content audit (2026-05-12) but
not applied because they were medium/low priority OR needed assets
(images, screenshots) that take longer than a 5-minute edit.

All HIGH-priority items from the audit were applied — see commit log.

Format: each entry has a one-line fix suggestion + file location.

---

## MED priority (apply when there's a calm hour)

### Slide 1 — Character Select (`src/pages/P01_CharacterSelect.jsx`)
Lore paragraph mentions Violet/Xaden/Rhiannon by name; the grid has 6.
Either extend prose to all 6 names, or move the `match` quote into
the card body at larger size (currently italic and easily skipped).

### Slide 2 — Registration (`src/pages/P02_Registration.jsx`)
Add a one-line privacy assurance under the email input
("One reminder before workshop, one resources link after. That's it.").
The `claudeCodeReady` checkbox is required on this slide but the
install happens on the NEXT slide — reword to make it a commitment
("You'll do this on the next slide — checking here is a promise.").

### Slide 5 — Talk Evolution (`src/pages/P05_TalkEvolution.jsx`)
Add one-line read-order at top of the 6-grid:
"Read order: CLAUDE.md first (you can't skip it), then Skills/Agents/MCP
as you need them. Hooks/Plugins when you're fluent."

In Plugins example, swap `digital-marketing-pro` → `qa-pro` for
on-brand consistency.

### Slide 8 — Talk Ecosystem / Grimoire (`src/pages/P07_TalkEcosystem.jsx`)
Lead the grimoire section with one practical anchor:
"These are the seven `/commands`, four agents, three MCP servers you
installed two slides ago. The lore name is decoration — the invocation
is what you'll actually type."

### Slide 9 — Power Moves (`src/pages/P_TalkPowerMoves.jsx`)
For move 06 (parallel sub-agents), add a copy-pasteable invocation:
```
Use the Task tool to launch 3 sub-agents — one to <X>, one to <Y>,
one to <Z>. Run in parallel, report back.
```

### Slide 13 — Pixel Agents (`src/data/gems.js` line 22 / `src/pages/P_GemPixelAgents.jsx`)
Add a still screenshot of the pixel office at the top of the body, OR
a text mockup of what it looks like:
```
[Office: 3 desks. Agent-1 typing. Agent-2 flipping pages.
 Agent-3 tapping foot waiting]
```
Plus: "VS Code only — for JetBrains users, see JinxBox terminal
alternative in resources."

### Slide 19 — Bond Ritual Intro (`src/pages/P_BondIntro.jsx`)
Add a sample dragon portrait image at the top (one from a past
workshop) — sets visual quality bar + warms the activity.
Add a clarifying line on the `gpt-image-2` mention: "Image generation
via OpenAI (text via Claude). That's the one place we cross stacks."

### Slide 20 — Aerie Intro (`src/pages/P_AerieIntro.jsx`)
Add facilitator-only callout: "Facilitator: open
`/?page=aerie&view=projection` on the room TV. Voting opens for 5
minutes."
Plus a participant-visible time-box: "5-minute window — three votes — go."

### Slide 23 — Graduation (`src/pages/P15_Graduation.jsx`)
Add to the "what you carry home" list:
"Monday morning: open Claude Code in any real repo, type `/bug-report`
on the first bug you find — feel the new habit form."
And a community link line: "Stuck three days from now? Channel: <link>"

---

## LOW priority (cosmetic / next iteration)

### Slide 14 — MemPalace (`src/data/gems.js` line 213)
Replace one generic use case with QA-flavored:
"QA team memory — severity ladders, flaky-test conventions, regression
suite scope, all recallable across projects."

### Slide 15 — suzu-mcp (`src/data/gems.js` line 268)
Add fallback for non-Spotify users:
"No Spotify? Same hook can run `say 'task done'` (macOS) or
`notify-send` (Linux) instead — 3-line variant in Resources."

### Slide 17 — Quinn + Jinx (`src/data/gems.js` ~line 565)
Add a sample Jinx finding as a worked example:
```
Sample Jinx finding: "Submit button accepts amount = '𝟱𝟬𝟬'
(mathematical bold digits, Unicode). Backend parses it as numeric.
Probably not what the dev tested."
```

### Slide 18 — Channels (`src/data/gems.js` line 765)
Add a Telegram thread mock:
```
You [07:30] "summary?"
Claude [07:30] "Refactored 8 files overnight. 2 tests now fail
(auth.test.ts:42, user.test.ts:18). Want me to fix?"
You [07:31] "fix and rerun"
```
Plus security note: "Personal account / personal bot — not on company
devices unless IT cleared it."

### Slide 22 — Leaderboard (`src/pages/P14_Leaderboard.jsx`)
Add: "You can resubmit until the facilitator opens the final. Latest
submission wins your slot."

### Slide 24 — Resources (`src/pages/P_ResourcesIntro.jsx`)
Reframe "Hidden Gems — 22 power-user features" line to:
"Hidden Gems — the 6 we covered today plus 16 more that didn't fit in
4 hours."

### Component — CharacterCommentary
`title="dismiss"` on the close button leaks English. Wrap with t().

### Error fallbacks
`P_Aerie.jsx:113` and `CheckpointButton.jsx:51` have hardcoded English
fallbacks. Low impact (only fires when API returns no message), but
worth wrapping for completeness.

---

## Cross-cutting (one-pass improvements next iteration)

1. **"Demo right now" prompts** — slides 4, 6, 9, 11 each have a 5-second
   behavioral try that isn't currently surfaced. Adding "Right now: open
   Claude Code, type X" lines converts lecture into workshop. Already
   added to slide 6 (TalkModes).

2. **New-tab handoffs** — slides 10, 19, 20, 21 open standalone pages.
   Each should say "When you finish, come back to this tab and press →."
   Already added to slide 10 (PersonaIntro) and 21 (ArenaIntro).
   Remaining: 19 (BondIntro), 20 (AerieIntro).

3. **Cost / budget line** — nothing in the deck addresses monthly run cost
   for an enabled stack (MCP + ENABLE_TOOL_SEARCH + agents). For a
   corporate audience, a 1-line "expect $X-Y/month for active use" on
   slide 5 or in Resources would help eval conversations.

4. **Workshop duration consistency** — slide 0 now says 4h (was 60min).
   Sanity-check other slides for any "30-minute" references that should
   match.

---

## Out of scope for current workshop (next event)

- Pre-roll video / opening hype.
- Per-gem demo GIFs for visual gems (Pixel Agents, Channels).
- Multi-language Signet Ceremony output (currently RU-only CLAUDE.md).
- Mobile responsive sweep — current target is laptop only.
- Multi-cohort facilitator dashboard improvements.
