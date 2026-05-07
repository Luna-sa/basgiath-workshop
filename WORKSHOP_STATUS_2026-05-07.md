# Workshop Status — 2026-05-07

End-of-day snapshot of the QA Clan · Claude Code workshop site. Use this
as the single reference for what's where, what's done, what to run on
Supabase, and what to verify before the workshop on 2026-05-13.

---

## Live URLs

All on the `basgiath-workshop.onrender.com` Render service. Render's
static-site routing returns 404 on path-based routes, so we use
query-string routes throughout. Every public URL works.

| Purpose | URL |
|---|---|
| Workshop landing (after nickname gate) | `https://basgiath-workshop.onrender.com/` |
| Registration form (standalone, no nickname required) | `https://basgiath-workshop.onrender.com/?page=register` |
| Persona Builder (7 questions → CLAUDE.md) | `https://basgiath-workshop.onrender.com/?page=persona` |
| Resource Hub (autopilots + handouts) | `https://basgiath-workshop.onrender.com/?page=resources` |
| Dragon Arena (mini-game) | `https://basgiath-workshop.onrender.com/?page=arena` |
| Dragon Arena · Final Battle (loads submitted bots) | `https://basgiath-workshop.onrender.com/?page=arena&final=1` |
| Facilitator Dashboard | `https://basgiath-workshop.onrender.com/?token=YOUR_VITE_FACILITATOR_TOKEN` |

For Arena you can pre-fill the participant's nickname:
`?page=arena&nickname=luna_qa` — they don't have to type it on Submit.

---

## Supabase migrations to run

Run **in this order** in Supabase Dashboard → SQL Editor → New query.
Each is idempotent (uses `IF NOT EXISTS` / `IF NOT EXISTS DO $$`):

1. `SUPABASE_MIGRATION_2026-05-07.sql` — adds `studio`, `pain`,
   `claude_code_ready` columns to `students`. (You ran this already.)
2. `SUPABASE_MIGRATION_2026-05-07_nickname.sql` — adds unique `nickname`
   column to `students`. (You ran this.)
3. `SUPABASE_MIGRATION_2026-05-07_delete_policy.sql` — RLS DELETE policy
   for `students` + `submissions`. (You ran this.)
4. `SUPABASE_MIGRATION_2026-05-07_bot_submissions.sql` — creates
   `bot_submissions` table for arena code submissions. **Needs to run.**
5. `SUPABASE_MIGRATION_2026-05-07_prizes_announcements.sql` — creates
   `prizes` table + adds `announcement` columns to `facilitator_state`.
   **Needs to run.**

After running all migrations, the dashboard's Bot Submissions panel,
Prizes panel, and Live Announcement broadcaster will work.

---

## Routes — implementation map

`src/App.jsx` reads `window.location.search` and dispatches:

- `?token=<env.VITE_FACILITATOR_TOKEN>` → `facilitator/Dashboard.jsx`
- `?page=register` (or `/register`) → `pages/StandaloneRegister.jsx`
- `?page=arena` (or `/arena`) → `pages/Arena.jsx` (iframe wrapper around
  `public/dragon-arena.html`, bridges Supabase via postMessage)
- `?page=persona` (or `/persona`) → `pages/P_PersonaBuilder.jsx`
- `?page=resources` (or `/resources`) → `pages/P_Resources.jsx`
- everything else → nickname gate → `core/PageRouter.jsx` (the workshop
  flow with 16 pages)

---

## Workshop flow — what each page is for

The workshop runs in this order on May 13. Most live pages are gated
behind the facilitator unlocking them via the dashboard.

| Stage | Page / Route | What happens |
|---|---|---|
| Pre | Email invite | Recipient clicks Register button → `/?page=register` |
| Pre | `/?page=register` | Form: name + workshop nickname + studio + role + claude_code_ready checkbox. Saves to `students` table. |
| Pre | Calendar invite | Sent separately via Outlook/Teams. Body in `MS_TEAMS_MEETING_BODY.md`. |
| Pre | (optional) `/?page=resources` | Take-home reference — autopilots, handouts, master setup. |
| Live (start) | Workshop landing `/` | Nickname gate → P00 Landing |
| Live | P00 Landing | "Академия Басгиат" — Empyrean cover with epigraph |
| Live | P01 Character Select | Threshing — pick one of 6 personas |
| Live | P02 Registration | Confirms identity (nickname pre-filled if signed in) |
| Live | P03 Pre-work | Parapet — verify Claude Code is installed |
| Live | `/?page=persona` | Your signet emerges — 7 interview questions, generates CLAUDE.md |
| Live | P06 Install Ecosystem | Forging the bond — paste big ecosystem prompt into Claude Code |
| Live | P08-09 Practice | Threshing the spec / Gauntlet — slash command tasks on sample-project |
| Live | `/?page=arena` (during workshop) | Dragon Arena — write bot code in Claude Code, submit to Supabase |
| Live | `/?page=arena&final=1` (facilitator) | Final battle — auto-loads top submission per character, projector display |
| Live | P15 Graduation | First flight — leaderboard, prize reveal, share |
| Post | `/?page=resources` | Always available for take-home work |

---

## Dragon Arena — workshop mechanic

This is the WAU game. Each participant writes a JS function that controls
their dragon's flight. Six dragons compete on the projector at the end.

**Bot API** (visible in the API panel on the page):
```javascript
function tick({ me, stars, walls, sky }) {
  // me: { x, y, score, fuel } — fuel 0-100, drains at full throttle
  // stars: [{ x, y, value, fire }] — fire stars worth +3, refuel +100
  // walls: [{ x, y, r }] — avoid
  // sky: { width, height }
  return { angle: 0..360, throttle: 0..1 }
}
// Easter egg API hint in the docs:
// me.summonSignet() — once per round, 3-second 1.6x boost
```

**Bot submission flow:**
1. Participant opens `/?page=arena&nickname=their_nick`.
2. Edits their persona's slot via Claude Code (paste back into textarea).
3. Clicks Submit ✦. Iframe → parent → Supabase `bot_submissions` insert.
4. Confirmation banner. Slot shows "Submitted by @nick".

**Final battle on projector:**
1. Facilitator opens `/?token=...` → "Bot Submissions · Final Battle" panel.
2. Sees 6 character cards, each showing latest submission's nickname + time.
3. Clicks "Open Final Battle →" → new tab `/?page=arena&final=1`.
4. Parent fetches latest submissions, posts to iframe → all 6 slots
   populated. Banner "Final battle loaded · 6 riders bonded".
5. Click Run flight → 60-second round → confetti + Battle Brief table
   + winner replay (slow-mo trace of winner's last 5 seconds).

**Per-persona flight stats** (built into arena):
- Violet: agile (sharpest turns, slightly slower top speed).
- Xaden: powerhouse (highest top speed, smoother arcs).
- Rhiannon: balanced.
- Ridoc: jagged wings, slightly faster, looser turns.
- Liam: steady.
- Imogen: knife-sharp turns, modest top speed.

**Three biome variants** (selectable from dropdown):
- Star Vault (default) — purple/teal nebula.
- Misty Pass — fog bands.
- Lava Crags — ember-tinted obstacles, red glow.

**Stamina/fuel:**
- Throttle burns 0.6 per tick; empty fuel clamps throttle to 0.25.
- Regular star refuels +25, fire star refuels +100.
- Fuel arc rendered under each dragon (teal → yellow → red as fuel drops).

---

## Facilitator Dashboard

Open with `?token=<your VITE_FACILITATOR_TOKEN>`.

**Sections (top to bottom):**

1. **Header** — total students, current unlocked page, phase switcher (pre / live / complete).
2. **Advance All Students** — quick-buttons to unlock pages.
3. **Round Control** — start/stop timer per page.
4. **Stats Summary** (3 cards) — by studio, by role, Claude Code ready %.
5. **Live Announcement** — text input + Send + Clear. Broadcasts to all
   students via Realtime on `facilitator_state.announcement` field.
   AnnouncementToast component renders at top center for 8 seconds.
6. **Prizes** — 3 rows; edit name + description on blur, dropdown to
   award to top-20-by-XP students.
7. **Bot Submissions · Final Battle** — 6-card grid showing latest
   submission per character + Refresh + Open Final Battle.
8. **Quick Actions** — workshop milestones (Start, after CLAUDE.md, War Games, Finish).
9. **Student tracker** — full list with search by nickname/name/studio/role.
   Each row: nickname, name, studio · role · claude_ready, XP, current page,
   manual XP buttons (+10/+20/+50), Delete button.

---

## Persona Builder details

`src/pages/P_PersonaBuilder.jsx` — built by background agent, integrated.

- 7 mandatory questions (name, work, annoyances, praise, disagreement,
  tone, override).
- 3 optional deeper questions (grounding, AI relationship, recovery)
  behind a "Go deeper" toggle.
- Live preview of CLAUDE.md on the right (sticky on lg+).
- Uses `generateClaudeMd()` from `src/data/persona-templates.js`.
- Action buttons: Copy, Download .md, Apply via Claude Code (autopilot).
- LocalStorage persistence under `persona-builder-answers`.
- Also writes to `useWorkshopStore.user.personaAnswers` (via
  `setPersonaAnswers` action).

The `persona-templates.js` file has full 5-layer profiles for all 6
characters: personality (5 markers), takesOn (3-5 functions), voice
markers, rituals (do/don't), flaw, override, default personality
dimensions, and a `generateClaudeMd(characterId, answers)` function
that produces ~1000-token CLAUDE.md.

---

## Resource Hub details

`src/pages/P_Resources.jsx` — built by background agent.

Sections:
1. **Master Setup** — featured CopyPrompt card with QA ecosystem prompt
   (read from `src/data/ecosystem-prompt.js`).
2. **5 Autopilot Prompts** — Cross the Parapet (Setup-Doctor), Lay your
   perch (Workspace-Init), Wake your dragon's senses (MCP installer),
   Wear your signet (Apply-Persona), Call the Healers (Resume-from-error).
3. **Reference Downloads:**
   - HIDDEN_GEMS.md — 22 power-user features (in `public/handouts/`).
   - QUICK_REFERENCE.md — slash commands + hotkeys cheat sheet.
   - sample-project-readme.md — placeholder for the QA practice project.
4. **External Links** — Anthropic docs, prompt library, MCP servers gallery, repo.

Component: `src/components/CopyPrompt.jsx` — bb-deck-style with featured
border, peek toggle, copy with textContent + textarea fallback.

---

## What participants actually take home

After the workshop, each rider has:

1. **Their personal CLAUDE.md** — in `~/.claude/CLAUDE.md`, generated
   from their persona archetype + 7 interview answers. Persists across
   sessions, makes Claude Code talk in their persona's voice.
2. **The QA ecosystem** — 7 slash commands, 4 agents, 3 MCP servers
   set up via the master prompt.
3. **Bookmark to `/?page=resources`** — every autopilot prompt available
   any day to finish what they didn't get to.
4. **Their nickname** — entry to the workshop site any day, picks up
   where they left off.
5. **Hidden Gems handout** — 22 power features they can adopt over time.
6. **(For some)** — a prize: book, swag, or call-out.

---

## Open / TODO before the workshop

These are things to verify or do before May 13:

- [ ] **Run migrations 4 + 5** in Supabase (bot_submissions + prizes/announcements).
- [ ] **Send invitation email** — `INVITATION_EMAIL.html` (HTML version) or
  `INVITATION_EMAIL.md` (plain text fallback). All placeholders already
  filled (May 13, 14:00-15:30, May 12 17:00 deadline).
- [ ] **Send Outlook calendar invite** — body from `MS_TEAMS_MEETING_BODY.md`.
- [ ] **Configure prizes** in admin — 1st/2nd/3rd place names + descriptions.
- [ ] **Test register → arena → submit flow end-to-end** with a fresh
  nickname (incognito).
- [ ] **Rehearse the final battle** — open admin, configure 6 dummy
  submissions, click Open Final Battle, run it on the projector.
- [ ] **Translate P03 Pre-work + practice pages** to EN — currently RU only.
  (Optional, P00, P02, P_PersonaBuilder, P_Resources are localized.)
- [ ] **Hidden Gems autopilot** — verify content in
  `public/handouts/HIDDEN_GEMS.md` matches what you want to share.

---

## Build state

`npm run build` → 493 kB JS / 153 kB gzip · clean · 0 warnings (2026-05-07
EOD). All routes render. Vite copies `public/handouts/`,
`public/dragon-arena.html`, `public/sword-left.jpg`, `public/sword-right.jpg`,
`public/email-hero.jpg` into `dist/` automatically on build.

Render auto-deploys on push to `main`. Last commits:
- 88165b7 Arena round 8: stamina + replay
- 574784d Arena round 7: biomes + persona stats
- 5a8ba95 Round 6: admin extensions
- 47d76bb Round 5: facilitator final-battle loader
- cd18e66 Round 4: bot submission
- fc7cc33 Battle Brief breakdown
- 6bc2d28 Auto-save + bot_submissions schema

---

## Quick reference for facilitator on workshop day

**Before workshop (Day -1):**
- Open admin, verify all migrations green
- Configure 3 prizes
- Test send-announcement
- Send 24h reminder email

**Workshop start (T-30 min):**
- Open admin in one tab, arena in another (`?page=arena`), Persona Builder in third
- Verify projector mirrors arena tab
- Open MS Teams meeting

**During (T+0 to T+90 min):**
- Use admin "Live announcement" for time cues, transitions
- Use admin "Advance All" to unlock workshop pages as you progress
- Use manual XP (+10/+20/+50) to reward exceptional moments
- Mid-workshop, share `/?page=arena&nickname=THEIR_NICK` URL with each
  participant (or have them get it from the registration screen)

**Final battle (T+70 min):**
- Open admin, click "Refresh" on Bot Submissions
- Confirm 6 submissions exist (or fewer if some didn't)
- Click "Open Final Battle →"
- Switch to projector view, click Run flight
- Watch confetti, announce winners

**Post:**
- Configure prize awards in admin (dropdown selects winner per slot)
- Email recap with link to `/?page=resources`

— K.
