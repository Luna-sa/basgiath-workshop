# Workshop Master Plan — 2026-05-11 → 2026-05-13

The voice-driven priorities Anastasia laid out before her meeting:

1. Research **wow-level features** to add after Bond Ritual (dragon
   generation) and Signet Ceremony (CLAUDE.md setup).
2. Pass the existing slides under a microscope — improve copy depth,
   add Ukrainian where missing, audit tone consistency.
3. Brainstorm additional **competitions** — beyond Aerie voting +
   Arena bot battle.
4. Synthesise everything into a detailed plan with concrete tasks,
   then execute sequentially before workshop day (2 days away).

This document is the synthesis. Sections marked `⟲ pending` are
waiting on background research agents — they fill in as agents
return.

---

## Section 1 · Current state of the workshop

### Flow (25 slides)

| # | Slide | Status | Lang | Notes |
|---|-------|--------|------|-------|
| 0 | Landing | live · ✔ | EN/RU/UK | Just got UK pass |
| 1 | Character select (Threshing, option 7 added) | live · ✔ | EN/RU | UK pending |
| 2 | Registration | live · ✔ | EN/RU | UK pending |
| 3 | Pre-work checklist | live · ✔ | — | Static |
| 4 | The Bonding (talk intro) | live · ✔ | EN/RU | UK pending |
| 5 | What is your dragon (anatomy) | live · ✔ | EN/RU | UK pending |
| 6 | Three modes, eight keys | live · ✔ | EN/RU/UK | Just updated to four modes (Auto default) |
| 7 | Forging the bond (install ecosystem) | live · ✔ | EN/RU/UK | |
| 8 | The QA Grimoire (was: What flew in) | live · ✔ | EN/RU/UK | Just reframed as spell-book |
| 9 | Power moves | live · ✔ | EN/RU/UK | |
| 10 | Signet Ceremony intro | live · ✔ | EN/RU/UK | |
| 11 | Riders' arts (MCP demo) | live · ✔ | EN/RU/UK | |
| 12 | Hidden Gems overview | live · ✔ | EN/RU/UK | |
| 13-18 | Six gem deep-dives | live · ✔ | EN/RU/UK | |
| 19 | Bond Ritual intro | live · ✔ | EN/RU/UK | New today |
| 20 | Aerie intro | live · ✔ | EN/RU/UK | New today |
| 21 | Arena intro | live · ✔ | EN/RU | UK pending |
| 22 | Leaderboard | live · ✔ | EN/RU | UK pending |
| 23 | Graduation | live · ✔ | EN/RU | UK pending |
| 24 | Resources intro | live · ✔ | EN/RU/UK | |

### Standalone experiences (linked from in-flow slides)

| Route | Status | Notes |
|-------|--------|-------|
| /?page=signet | live · ✔ | 7-ritual wizard, presets per question, Whisper voice input, archetype picker |
| /?page=bond | live · ✔ | 7 questions → gpt-image-2 portrait → seal to Aerie |
| /?page=aerie | live · ✔ | Realtime gallery + one-vote-per-rider |
| /?page=arena | live · ✔ | Existing — Phaser 3 dragon-bot programming arena |
| /?page=persona | live · legacy | Old Persona Builder, kept for safety, can retire |
| /?page=resources | live · ✔ | Resource hub |
| /?page=register | live · ✔ | Standalone registration |

### Infrastructure dependencies (pre-workshop)

- ✘ Run `SUPABASE_MIGRATION_2026-05-08_checkpoints.sql` (Anastasia
  hit "column students.checkpoints does not exist" → checkpoint
  buttons fail).
- ✘ Run `SUPABASE_MIGRATION_2026-05-11_dragons.sql` (Bond Ritual
  sealing + Aerie voting won't work without it).
- ✘ Enable Supabase Realtime on `dragons` + `dragon_votes` tables.
- ✘ Verify `OPENAI_API_KEY` is set in `chatbot-mentor` Render env
  (already true if Kai voice still works in chatbot-mentor).
- ✘ Facilitator-side: bump `unlocked_page` to 25 via admin URL
  before the workshop opens.

---

## Section 2 · Research outputs

Three agents are currently running in parallel; outputs land in
`RESEARCH_2026-05-11_*.md`. Summarised here once they return.

### 2.1 · Wow-level features  ⟲ pending

`RESEARCH_2026-05-11_wow_features.md`

> Looking for: what to do AFTER dragon generation that makes the
> workshop feel like a real ritual, not a tutorial.

⟲ Awaiting agent output. Will integrate top picks below once
returned.

### 2.2 · Competition ideas  ⟲ pending

`RESEARCH_2026-05-11_competitions.md`

> Looking for: 8-12 competition formats beyond Aerie voting + Arena
> bot battle. Skill-revealing, tight viewable moments, paired rivalry.

⟲ Awaiting agent output.

### 2.3 · Copy audit  ⟲ pending

`RESEARCH_2026-05-11_copy_audit.md`

> Looking for: stilted translations, missing Ukrainian, inconsistent
> lore terms, voice slips.

⟲ Awaiting agent output.

### 2.4 · Ukrainian translation pass  ⟲ in flight

> 9 files being upgraded from `t(en, ru)` to `t(en, ru, uk)` with
> natural Ukrainian. P00_Landing.jsx already done by hand.

⟲ Agent running, will report file counts when done.

---

## Section 3 · Plan of action

Ordered by impact × ease. Each task carries:

- **Cost** — rough effort: XS (10min) / S (30min) / M (2h) / L (half-day)
- **Risk** — what breaks if we do this wrong
- **Why** — why this earns its slot in the 2-day window

### Phase A · Unblockers (today, before bedtime)

| Task | Cost | Risk | Why |
|------|------|------|-----|
| Run both Supabase migrations | XS (Anastasia) | None | Bond Ritual + checkpoints are dead without this |
| Enable Realtime on dragons / dragon_votes | XS (Anastasia) | None | Aerie won't live-update |
| Full smoke test through Signet + Bond + Aerie | S (Anastasia) | None | Catch any production-only bugs |
| Finish Ukrainian translation pass | S (agent) | XS | Lvov + Kyiv participants will notice the gaps |
| Apply top 3 copy-audit fixes | S | XS | Polish where it shows |

### Phase B · Wow additions (tomorrow morning)

⟲ Filled in after research agents return. Targets 2-3 of the top
ideas, ranked by wow × ease.

Placeholder slots:
- **B1 · [TBD]** — top pick from wow_features
- **B2 · [TBD]** — top pick from competitions
- **B3 · [TBD]** — one ritual moment (e.g. "Time Capsule" / "Pledge")

### Phase C · Final polish (tomorrow afternoon)

| Task | Cost | Risk | Why |
|------|------|------|-----|
| Cross-language proofreading pass | S | XS | Catch the Ukrainian/Russian inconsistencies copy-audit raised |
| Walk the whole 25-slide flow on three devices (laptop / phone / projector resolution) | S | None | Layout regressions |
| Test image gen + voice on the actual networks Anastasia will use | XS | XS | Render free tier can have cold-start lag — pre-warm |
| Prepare facilitator script — one printed page summarising slide-by-slide notes | M | None | Anastasia uses this live |

### Phase D · Day-of (workshop day)

| Task | Cost | Risk |
|------|------|------|
| Open admin URL, set unlocked_page=25 | XS | None |
| Pre-warm chatbot-mentor backend (POST /api/workshop/transcribe with empty body to wake it) | XS | None |
| Pre-create a "facilitator demo" dragon in Aerie so participants see an example | XS | None |
| Have backup .env values + Render dashboard tab open | XS | None |

---

## Section 4 · Open architectural decisions

These need Anastasia's call when she returns:

1. **Should Arena (page 21) stay or merge with Bond Ritual?**
   Arena programs a fighting bot tied to the Empyrean character
   (Violet / Xaden / etc.) — it doesn't use the dragon portrait yet.
   Options:
   - (a) Keep both. Arena = technical skill, Bond = creative skill.
     Costs 10-15 minutes of workshop time but no architectural work.
   - (b) Merge: Arena uses the participant's sealed dragon as their
     bot avatar, and bot performance feeds back into the Aerie vote
     count somehow. Costs M (half-day) but unifies the two competitive
     loops.
   - (c) Replace Arena entirely with Bond + Aerie. Bond becomes the
     ONLY signature task. Loses the programming exercise but tightens
     the narrative.
   - **My pick: (a).** They're different skills, both worth doing.
     If time pressure on the day, facilitator can skip Arena.

2. **Bond Ritual: re-roll cost / fairness.**
   Currently unlimited regenerations. Each one costs OpenAI ~$0.05
   for a high-quality 1024×1024 gpt-image-2 call. With 25 participants
   re-rolling 3× each on average → $4. Fine.
   But: someone could re-roll 30 times → $50. Add a cap of 5 or 7
   regenerations per nickname? Slight friction, but stops abuse if
   the workshop URL leaks.

3. **Persona Builder vs Signet Ceremony — retire the old one?**
   Both routes exist (`/?page=persona` legacy, `/?page=signet` new).
   Risk of confusion if someone has a stale bookmark. Recommend
   removing `P_PersonaBuilder.jsx` + the persona route in App.jsx
   after smoke testing.

4. **What happens to dragons after the workshop?**
   Permanent in Supabase storage. Each dragon has a public URL.
   Options:
   - Leave it. Participants can share dragon links forever.
   - Add a "Year-of-Bond" reminder — Claude emails participants in
     12 months with their dragon + a "how are you both doing now?"
     prompt. Requires email opt-in step in workshop.
   - Cross-cohort: next workshop's participants see this cohort's
     dragons in the Aerie as "elders". Adds lore continuity.

---

## Section 5 · Notes for myself across sessions

- gpt-image-2 may not be available for all OpenAI accounts. The
  workshop backend falls back to gpt-image-1 silently. Test both.
- Whisper API works on `chatbot-mentor.onrender.com/api/workshop/transcribe`.
  Render free tier sleeps after 15 minutes inactive → first request
  cold-starts in ~30s. **Pre-warm before workshop.**
- Auto mode in Claude Code became default in spring 2026. Shift+Tab
  cycles Auto → Plan → Edit → Auto.
- Voice archetypes: 7 + custom. Used in Signet Ceremony ritual IV.
- Bond Ritual answers feed `buildDragonPrompt()` which renders a
  cinematic prompt for gpt-image-2. Prompt builder lives at
  `src/data/dragons/prompt-builder.js`. Tune there if portraits
  come back too painterly / too cartoonish.

---

*This document updates as agents return.*
*Last updated: 2026-05-11 by Kai during Anastasia's meeting.*
