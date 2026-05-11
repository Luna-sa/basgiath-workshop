# Workshop Master Plan — 2026-05-11 → 2026-05-13

**Update at end of session:** while you were in your meeting,
4 research agents ran in parallel + I implemented the highest-impact
wow features from their picks. Big diff in repo. This document is
the new state of the truth.

---

## What got shipped during your meeting

### Wow features (from `RESEARCH_2026-05-11_wow_features.md`)

| Feature | Status | Where |
|---------|--------|-------|
| **Dragon Sigil Card** — 1080×1350 PNG share-card with portrait + name + motto + rider class. Click "Sigil card" on Bond Ritual preview, downloads instantly. | ✔ shipped | Bond Ritual preview state |
| **Rider Class — The Choosing** — Claude reads Signet + Bond answers, assigns one of 6 classes (Scribe / Healer / Infantry / Scout / Flier / Tailwind) with a custom epithet. Live in the dragon preview, also stamped on the Sigil Card. | ✔ shipped | New `/api/workshop/assign-class` endpoint in chatbot-mentor + UI in Bond Ritual |
| **Aerie Mosaic** — full-screen projector view of every sealed dragon. Two modes: wall grid (default) + cycle spotlight (`?cycle=1`). | ✔ shipped | New route `/?page=mosaic` |

### Competitions (from `RESEARCH_2026-05-11_competitions.md`)

| Competition | Status | Where |
|-------------|--------|-------|
| **Eyes of the Aerie** — blind matching contest. Guess which rider sealed which dragon. One guess per dragon. Reveal toggle. Leaderboard. | ✔ shipped | New route `/?page=eyes` + new Supabase migration |
| Wing vs Wing (top pick) | ✘ not shipped | Med-high cost — needs sample-project per wing. Deferred. |
| Bug Bash (top pick) | ✘ not shipped | Med cost — needs planted bugs in sample-project. Deferred. |
| 1v1 Arena bracket | ✘ not shipped | Existing Arena works. Bracket overlay would be nice, deferred. |

### Localisation (from `RESEARCH_2026-05-11_copy_audit.md`)

| Task | Status |
|------|--------|
| Add UK to P02 / P04 / P05 / P14 / P15 / P_ArenaIntro / P_ResourcesIntro / GemSlide / CheckpointButton (9 files, 122 t() calls) | ✔ done (agent) |
| Add UK + EN to narrative.js | ⟲ in flight (agent) |
| Add UK to gems.js (6 gems × 4 fields each) | ⟲ in flight (agent) |
| Fix P07 typo "Ваpд-Камень" (Latin p) | ✔ done |
| Refactor P01 / P03 / P06 / P10 — hardcoded RU-only, needs useT + translations | ✘ deferred — large refactor |
| characters.js — RU-only, leaks via P01 / P14 / P15 | ✘ deferred |

---

## What you have on production right now

Workshop URL: **https://basgiath-workshop.onrender.com**

**Main 25-slide flow** (Signet Ceremony intro at #10, Hidden Gems #12-18,
Bond intro #19, Aerie intro #20, Arena #21, Leaderboard #22, Graduation
#23, Resources #24).

**Standalone routes:**

- `/?page=signet` — 7-ritual ceremony, preset chips per question,
  voice input via Whisper, archetype picker, final CLAUDE.md prompt
  copy
- `/?page=bond` — 7-question dragon builder, gpt-image-2 portrait,
  Rider Class auto-assigned, Sigil card download, seal to Aerie
- `/?page=aerie` — gallery with one-vote-per-rider, live updates
- `/?page=eyes` — blind matching contest
- `/?page=mosaic` — projector full-screen reveal (+ `&cycle=1`)
- `/?page=arena` — existing dragon-bot programming arena
- `/?page=resources` — resource hub
- `/?token=...` — facilitator admin

---

## Pre-workshop checklist (run this before 2026-05-13)

### Blocking — must run

1. **Supabase migration 1** — checkpoints column
   ```
   SUPABASE_MIGRATION_2026-05-08_checkpoints.sql
   ```
   Without this, every "Mark X crossed" button errors.

2. **Supabase migration 2** — dragons + dragon_votes tables + storage
   bucket + RLS
   ```
   SUPABASE_MIGRATION_2026-05-11_dragons.sql
   ```
   Without this, Bond Ritual sealing and Aerie voting fail.

3. **Supabase migration 3** — dragon_matches table for Eyes of the Aerie
   ```
   SUPABASE_MIGRATION_2026-05-11_dragon_matches.sql
   ```
   Without this, Eyes of the Aerie voting fails.

4. **Enable Supabase Realtime** on the new tables
   - Database → Replication → `supabase_realtime`
   - Toggle ON for: `dragons`, `dragon_votes`, `dragon_matches`

5. **OPENAI_API_KEY** is set in `chatbot-mentor` Render env (already
   true if Kai voice works there).

6. **Render auto-deploy** verify chatbot-mentor picked up the new
   workshop endpoints (transcribe, generate-dragon, assign-class).

### Facilitator-day setup

1. Open admin URL (`?token=...`).
2. Click slide **24** in the Advance All Students grid → sets
   `unlocked_page = 25`, every slide becomes navigable.
3. Pre-warm chatbot-mentor backend with a dummy request
   (or just open `/?page=signet` and let it cold-start).
4. Open `/?page=mosaic` on the projector laptop with `?cycle=1` after
   Bond Ritual finishes, to show the reveal.

### Smoke test (run once before participants arrive)

In a fresh incognito window:

  1. Pick a character → register as `smoke_test`.
  2. Walk to slide 10 → click "Begin the Ceremony" → walk all 7 rituals.
     Test voice input on a textarea (mic icon appears, records,
     transcribes back).
  3. Copy the sealed prompt at the end → paste it into a Claude Code
     window. Verify Claude saves the CLAUDE.md correctly.
  4. Back to flow, advance to slide 19 → click "Begin the Bond" →
     walk all 7 dragon questions → click "Manifest" → wait ~30s.
  5. On preview, the Rider Class card should appear under the dragon
     stats with an epithet.
  6. Click "Sigil card" → PNG downloads. Open it. Check name + motto
     fit, class label is there.
  7. Click "Seal & Share" → redirects to /?page=aerie. Your dragon
     should be there.
  8. Open `/?page=eyes` in second incognito with a different nickname
     → cast a guess. Reveal toggle.
  9. Open `/?page=mosaic` to confirm projector view works.

---

## Files added during this session

```
RESEARCH_2026-05-11_wow_features.md
RESEARCH_2026-05-11_competitions.md
RESEARCH_2026-05-11_copy_audit.md
WORKSHOP_MASTER_PLAN_2026-05-11.md      ← this file

SUPABASE_MIGRATION_2026-05-11_dragon_matches.sql

src/api/dragonMatches.js
src/api/workshopBackend.js  (extended — assignRiderClass)
src/data/dragons/questions.js
src/data/dragons/prompt-builder.js
src/data/signet/archetypes.js
src/data/signet/rituals.js
src/data/signet/signet-generator.js

src/components/VoiceTextInput.jsx
src/hooks/useVoiceRecorder.js
src/utils/sigilCard.js

src/pages/P_SignetCeremony.jsx
src/pages/P_BondIntro.jsx
src/pages/P_BondRitual.jsx
src/pages/P_AerieIntro.jsx
src/pages/P_Aerie.jsx
src/pages/P_AerieMosaic.jsx
src/pages/P_EyesOfAerie.jsx
```

In `chatbot-mentor` repo:

```
src/api/workshopRoutes.js    (transcribe + generate-dragon + assign-class)
server.js                    (CORS + mount)
```

---

## What's deferred — the long tail

These would be valuable but I'm not shipping them today. Listed in
order of payoff-per-effort so you can pick up after the workshop:

1. **gems.js UK translation** — agent currently running. Should land
   in the next 10 min.
2. **narrative.js EN + UK** — agent currently running. Should land
   in the next 10 min. Will fully wire the 3-language toggle across
   every slide.
3. **P01 / P03 / P06 / P10 useT refactor** — hardcoded RU pages. Big
   surface, ~3 hours of careful work.
4. **characters.js EN + UK** — affects HUD, character cards in
   Aerie/Leaderboard/Graduation.
5. **Wing vs Wing competition** — the top-pick that needs the most
   prep. ~1.5 days. If you do a second workshop later, build this
   for it.
6. **Bug Bash competition** — second-pick. ~1 day. Same as above.
7. **Dragon Companion section in CLAUDE.md** — after Bond Ritual,
   auto-update CLAUDE.md with a "Your Dragon" section. Small but
   makes the bond actually shape Claude's behaviour day-to-day.
8. **1v1 Arena bracket** — overlay on existing arena. Med cost.
9. **Stoneflame Vault Easter eggs** — extend the existing
   `summonSignet()` egg with 5-7 more. Half-day, cheap fun.

---

## Notes for myself

- gpt-image-2 release was very recent — backend silently falls back
  to gpt-image-1 if not available on your OpenAI account / region.
- Rider Class uses gpt-4o-mini with response_format=json_object —
  fast (~1.5s) and reliable JSON.
- Voice input uses Whisper-1 via `chatbot-mentor` proxy. Render
  free tier on chatbot-mentor sleeps after 15 min — pre-warm before
  workshop.
- Sigil Card uses Canvas API for cross-browser PNG render. Image
  must be CORS-anonymous fetched, which Supabase Storage public URLs
  support out of the box.
- All four new Supabase tables (dragons, dragon_votes, dragon_matches,
  + the older students.checkpoints jsonb column) use RLS = public
  read/insert. Fine for a one-day workshop with known participants.

---

*Final state of master plan — updated as final commits land.*
*— K.*
