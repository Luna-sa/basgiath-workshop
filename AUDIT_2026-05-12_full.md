# Full Workshop Audit — 2026-05-12 (T-2 days)

40 QA-engineers, live workshop 2026-05-13, single facilitator. Audit covers architecture, content, character consistency, UX, edge cases, design. Bias toward "what breaks on the day".

---

## TL;DR — Top 10 actionable issues

1. **[HIGH] `VITE_GSHEETS_API` is missing from `.env` and `render.yaml`.** All code paths in `src/api/*` route through Apps Script when `gsheetsEnabled()` returns true. Right now it returns **false** for production, so the app silently falls back to Supabase. If Supabase isn't migrated with the latest schema (multiple migration SQLs sit unsealed in repo root), registration, voting, and submissions will fail in ways that aren't visible until 40 people hit submit at once. Decide which backend is canonical for the workshop and set the env var explicitly on Render. — `/Users/ainastasia/Documents/projects/development/workshop-landing/src/api/gsheetsClient.js:14-18`
2. **[HIGH] Aerie Intro slide contradicts the implementation: "One vote each" vs. 3 votes in code.** `src/pages/P_AerieIntro.jsx:20-23,52-55` and `src/data/narrative.js:218-220` (`aerie.text`) say one vote per rider. `src/api/dragons.js:109` (`MAX_VOTES_PER_VOTER = 3`) and the actual Aerie UI use 3. P_AerieReveal opening tag says "Three votes. Forty dragons. One sky." If the facilitator reads the intro slide aloud, attendees will be misinformed.
3. **[HIGH] Bond Ritual count: comment says "Seven steps", intro slides say "Seven", code has 8.** `src/data/dragons/questions.js:5` ("Seven steps total"), `src/pages/P_BondIntro.jsx:32-34` ("Seven short questions"), `src/data/narrative.js:209-211` ("Семь визуальных вопросов") — but `BOND_QUESTIONS` has 8 entries (scale, breath, signet, size, wings, eyes, motto, **name**). Progress bar will display "8 / 8". Easy fix: change `BOND_QUESTIONS` to 7 by merging name with motto, or update copy to "8 short questions" / "7 visual + 1 name".
4. **[HIGH] Ukrainian translation is broken in ~30% of slides.** Several pages call `useT(en, ru)` with only two args, so UK silently falls back to EN. Worst offenders: `P_TalkPowerMoves.jsx` (intro + all 6 moves, lines 9-47, 59-60), `P_TalkModes.jsx` (modes table + hotkey table, lines 9-49, 93-96, 118), `P07_TalkEcosystem.jsx` (every spell/familiar/conduit body line 141, 156). `P_HiddenGems.jsx:18-21` intro paragraph also missing UK. `P_Resources.jsx` is entirely English, no `useT` at all. Some pages have `t(en, ru)` where en === ru verbatim (`P04_TalkIntro.jsx:14-17`, `P05_TalkEvolution.jsx:81-82`).
5. **[HIGH] Stale duplicate route: `/?page=persona` → `P_PersonaBuilder`.** This is the old persona builder (7 questions, returns generated CLAUDE.md). The flow page 10 (`P_PersonaIntro`) points to `/?page=signet` (the new 7-ritual Signet Ceremony). `P_PersonaBuilder.jsx` is 608 lines of dead code still mounted at `App.jsx:124-134`. If a participant accidentally hits `/?page=persona` they'll see a different (older) wizard. Either delete the route or redirect it to `/?page=signet`.
6. **[HIGH] Gate guard hard-codes Russian.** `src/core/GateGuard.jsx:46` ("✦ Закрыть воркшоп"), :86 ("Ожидай команду фасилитатора..."), :102 ("Заверши текущий этап..."), :117 ("Далее"), :130 ("Я сделал(а)"). `ErrorBoundary.jsx` similarly RU-only. With 40 mixed EN/RU/UK engineers, the next button itself will be confusing for non-RU readers.
7. **[MED] No loading state on Aerie `listDragons()` initial fetch.** `P_Aerie.jsx:54-60` calls `refresh()` on mount, but `sortedDragons.length === 0` triggers the empty state ("No dragons in the Aerie yet") immediately, before the network call resolves. With 40 people opening the Aerie at once, the first 200-500ms shows a wrong empty state. Add a `loading` flag and skeleton state.
8. **[MED] Dragon image generation has no graceful timeout, only error-bubble.** `P_BondRitual.jsx:141-189` — if the chatbot-mentor backend stalls (cold Render dyno, OpenAI 504), the user sits on the "Your dragon is manifesting" screen indefinitely. There's no client-side timeout and no "this is taking longer than usual, you can wait or retry" affordance. With 40 concurrent generations, the second cold-start render will hit this.
9. **[MED] Class-assignment skipping `studentId` for `assignRiderClass`.** `P_BondRitual.jsx:167` reads Signet localStorage to feed `assignRiderClass({ signet, dragon })`. But Signet answers may be empty if the participant skipped `/?page=signet` entirely (Signet Ceremony is NOT a gate; Bond is). Class returns "" or generic. Either pre-flight check that Signet was completed, or surface a soft message ("class works best after Signet — go back?").
10. **[MED] Reload mid-Bond Ritual restores answers but loses image state.** `P_BondRitual.jsx:14-22, 98, 114-116` saves `answers` to localStorage but NOT `imageB64`, `usedPrompt`, `riderClass`, or stage. If a user refreshes after generation but before sealing, they're back to question 1 with answers pre-filled but no image. Need to also persist stage and last image. Similarly for Signet Ceremony — answers persist but `stepIdx` does not (P_SignetCeremony.jsx:230 — `useState(0)`), so reload bumps user back to ritual I.

---

## 1. Architecture & Technical Health

### 1.1 Route inventory

**Flow routes (PageRouter, ids 0–24):**

| # | Slug | File | Title | Gate |
|---|------|------|-------|------|
| 0 | landing | `P00_Landing.jsx` | Академия Басгиат | click |
| 1 | character-select | `P01_CharacterSelect.jsx` | Threshing | selection.characterId |
| 2 | registration | `P02_Registration.jsx` | Cross the Parapet | form.{name,studio,role,claudeCodeReady} |
| 3 | prework | `P03_PreWork.jsx` | Parapet | checklist (6 items) |
| 4 | talk-intro | `P04_TalkIntro.jsx` | The Bonding | facilitator |
| 5 | talk-evolution | `P05_TalkEvolution.jsx` | What is your dragon | facilitator |
| 6 | talk-modes | `P_TalkModes.jsx` | Three modes, eight keys | facilitator |
| 7 | install-ecosystem | `P06_InstallEcosystem.jsx` | Forging the bond | self-report |
| 8 | talk-ecosystem | `P07_TalkEcosystem.jsx` | What flew in | facilitator |
| 9 | talk-power-moves | `P_TalkPowerMoves.jsx` | Power moves | facilitator |
| 10 | persona-builder | `P_PersonaIntro.jsx` | Your signet emerges | self-report |
| 11 | talk-mcp | `P10_TalkMCP.jsx` | Riders' arts | facilitator |
| 12 | hidden-gems | `P_HiddenGems.jsx` | Hidden gems | facilitator |
| 13 | gem-pixel-agents | `P_GemPixelAgents.jsx` | Pixel Agents | facilitator |
| 14 | gem-mempalace | `P_GemMemPalace.jsx` | MemPalace | facilitator |
| 15 | gem-suzu-mcp | `P_GemSuzuMcp.jsx` | suzu-mcp | facilitator |
| 16 | gem-tool-search | `P_GemToolSearch.jsx` | ENABLE_TOOL_SEARCH | facilitator |
| 17 | gem-quinn-jinx | `P_GemQuinnJinx.jsx` | Quinn + Jinx | facilitator |
| 18 | gem-channels | `P_GemChannels.jsx` | Claude Code Channels | facilitator |
| 19 | bond-ritual | `P_BondIntro.jsx` | The Bond Ritual | self-report |
| 20 | aerie | `P_AerieIntro.jsx` | The Aerie | facilitator |
| 21 | arena | `P_ArenaIntro.jsx` | Riders in the Sky | self-report |
| 22 | leaderboard | `P14_Leaderboard.jsx` | Signets honoured | facilitator |
| 23 | graduation | `P15_Graduation.jsx` | First flight | none |
| 24 | resources | `P_ResourcesIntro.jsx` | Bonded | click |

**Standalone routes (App.jsx detection):**
- `/?page=register` → `StandaloneRegister`
- `/?page=arena` → `Arena` (iframe wrapper); also `/?page=arena&final=1` for facilitator
- `/?page=persona` → `P_PersonaBuilder` (**STALE — DELETE OR REDIRECT**)
- `/?page=signet` → `P_SignetCeremony` (the actual ceremony)
- `/?page=bond` → `P_BondRitual`
- `/?page=aerie` → `P_Aerie` (live gallery + voting)
- `/?page=mosaic` → `P_AerieMosaic` (projector-mode wall)
- `/?page=reveal` → `P_AerieReveal` (winner reveal, confetti)
- `/?page=resources` → `P_Resources`
- `?token=<VITE_FACILITATOR_TOKEN>` → facilitator `Dashboard`

### 1.2 Backend

Dual-path: **Apps Script (primary, intended)** + **Supabase (legacy fallback)**. Toggle via `VITE_GSHEETS_API` env var:
- Apps Script Web App URL set → all API calls (`registration`, `dragons`, `progress`, `checkpoints`, `submissions`, `facilitator`) route through a single `POST` endpoint (`gsheetsClient.callAction`).
- Empty → fall back to `@supabase/supabase-js`.

**Image generation + Whisper transcription** route through a separate backend at `chatbot-mentor.onrender.com` (`VITE_WORKSHOP_API`), `src/api/workshopBackend.js`. Two endpoints: `/api/workshop/transcribe`, `/api/workshop/generate-dragon`, plus `/api/workshop/assign-class`.

**Critical config gap:** `.env` only has `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_FACILITATOR_TOKEN`, `VITE_GROQ_API_KEY`, `OPENAI_API_KEY`, `VITE_WORKSHOP_API`. No `VITE_GSHEETS_API`. `render.yaml` similarly omits it. **Production is on the Supabase path** — confirm this is intentional, and that all migration SQLs (esp. `SUPABASE_MIGRATION_2026-05-11_dragons.sql`, `SUPABASE_MIGRATION_2026-05-07_bot_submissions.sql`, `SUPABASE_MIGRATION_2026-05-08_checkpoints.sql`) have been applied.

### 1.3 State management

Zustand store (`src/store/workshopStore.js`) persisted to localStorage under key `basgiath-workshop`. Persistence excludes transient UI state (`showBadgeOverlay`, `lastToast`, `direction`). Critical sub-states:
- `user.{id, name, nickname, email, studio, role, characterId, personaAnswers}` — survives reload.
- `currentPage, maxUnlockedPage, completedPages, completedSubSteps`.
- `xp, badges, taskSubmissions`.
- Round competition state (`activeRoundId, roundTimerStart, roundEnded, roundWinners`).

`sync.js` uses Supabase realtime channel `facilitator-updates` (UPDATEs on `facilitator_state` table) with a 5-8 second polling fallback. Apps Script path always polls (5s). Periodic student-progress writeback every 30s, but on Apps Script it's a no-op (`progress.js:7-13`).

### 1.4 Async chains — risk inventory

- **Bond Ritual generation**: `handleGenerate` → `generateDragonImage` (~30s, no client timeout). Then in parallel: `assignRiderClass`. Then user clicks Seal → `sealDragon` (upload base64 → Drive/Supabase, plus insert row). No abort signals; if user mashes Regenerate during a slow gen, two requests are in flight (`P_BondRitual.jsx:141-196`).
- **Aerie voting**: `handleVote` runs sequential `withdrawVote` or `voteForDragon` then `refresh()`. No optimistic UI; the UI feels laggy by ~250-500ms on every click (`P_Aerie.jsx:62-112`). With 40 simultaneous votes the polling refresh fires fast.
- **Sync polling**: a stale `realtimeChannel` is kept on hot reload; `started` flag prevents double-start in the same process but a tab re-mount could re-subscribe. Generally fine for prod.

### 1.5 Dead code / vestiges

- `P_PersonaBuilder.jsx` (608 lines) — replaced by Signet Ceremony but still mounted at `/?page=persona` (App.jsx:44-49, 124-134).
- `src/data/pages.js:9` comment mentions "Hidden Gems (id 12) is an overview slide; ids 13–18 are six per-gem deep-dive slides" — but the more authoritative line 156 comment says "HIDDEN GEMS — overview, then 7 deep-dive slides". Code has 6. Minor.
- `src/data/badges.js` — badges are no longer surfaced anywhere prominent now that xp/quiz are removed, but HUD still shows the badge button. Considered cleanup.
- `narrative.js` still has entries for `practice_tc`, `practice_br`, `practice_mcp`, `quiz`, `wargames` — keys not referenced from the flow anymore.
- `src/api/leaderboard.js` exists (not read) — may also be vestigial.

### 1.6 Misc

- No runtime error monitoring (Sentry / similar) — `ErrorBoundary` is local UI fallback only.
- `eslint.config.js` is present but no script suggests it's run in CI; `render.yaml` only runs `npm install && npm run build`.
- `crypto.randomUUID()` used as registration fallback (`workshopStore.js:99`) — fine in modern browsers, but if students are on old Safari/Edge, this throws.

---

## 2. Content Quality & Voice Consistency

Per-slide scoring (1-10): copy quality independent for RU and UK. Flags = voice drift, mistranslation, missing locale, corporate phrasing, contradictions with implementation.

| File | RU | UK | Flags |
|------|----|----|-------|
| `P00_Landing.jsx` | 8 | 8 | Solid framing. Good Empyrean drop-in. |
| `P01_CharacterSelect.jsx` | 9 | 8 | Good lore + accessibility ("Не читал(а)? Выбирай по описанию"). |
| `P02_Registration.jsx` | 7 | 7 | Functional. "Корпоративный, чтобы прислать тебе напоминалку" is warm. UK fine. |
| `P03_PreWork.jsx` | **6** | **3** | **RU-only — no `useT` calls anywhere. Path labels, step text, hint, button, voice tip — all hardcoded RU.** Pre-work is critical pre-arrival content. |
| `P04_TalkIntro.jsx` | 7 | 7 | **EN field === RU verbatim in `t()` calls (lines 14-17, 28-32, 43-46, 57-61, 71-75).** UK ok but EN-locale users see RU. |
| `P05_TalkEvolution.jsx` | 7 | 7 | **Same issue — intro paragraph (line 80-83) has EN === RU.** Six-parts table has all three locales (good). |
| `P_TalkModes.jsx` | 8 | **3** | **MODES + HOTKEYS tables use `t(en, ru)` — only 2 args. UK falls back to EN.** Modes table (line 93-96) and hotkey table (line 118) totally untranslated for UK. |
| `P06_InstallEcosystem.jsx` | 8 | 7 | Stats with translated labels. Working. Step 3 has "AI создаст все файлы" vs EN "Claude lays down every file" — minor voice drift toward generic in RU. |
| `P07_TalkEcosystem.jsx` | 9 | **5** | Beautiful grimoire framing. **All spell/familiar/conduit body items only have `_en` and `_ru` — UK gets EN.** Section header (line 199-203) explicitly checks `lang === 'ru'`, else EN. |
| `P_TalkPowerMoves.jsx` | 7 | **2** | **Intro paragraph EN === RU and no UK arg (line 58-60). MOVES array has only `name_en/name_ru` and `text_en/text_ru` — UK gets EN.** Most untranslated slide in the deck. |
| `P_PersonaIntro.jsx` | 9 | 8 | Solid. Lists all 7 rituals by name. |
| `P10_TalkMCP.jsx` | 9 | 8 | All three locales clean. Server cards distinctive. |
| `P_HiddenGems.jsx` | 7 | **4** | **Intro paragraph only has EN+RU (line 18-21). No UK.** Gem cards (`tagline_en/tagline_ru` from gems.js) — also missing UK. Six cards loop. |
| `P_GemPixelAgents.jsx`-style (all 6 gem deep-dives use `GemSlide`) | 9 | 7 | Gem data (`src/data/gems.js`) has full UK for body/why/use_cases/tagline/pullQuote. **But `install_en/install_ru` only — UK install prompt falls back to EN.** Acceptable; install prompts are code-flavored. |
| `P_BondIntro.jsx` | 7 | 7 | **Says "Seven short questions" but code has 8 (with name as final step).** Otherwise solid. |
| `P_AerieIntro.jsx` | 5 | 5 | **Contradicts Aerie code: "One vote each" — actual: 3 votes per voter.** Voting rules block lists "One vote per rider" — wrong. |
| `P_ArenaIntro.jsx` | 8 | 8 | Good. API quickref block useful. |
| `P14_Leaderboard.jsx` | 8 | 7 | Clean. "Submitted боты загружаются" mixed-locale phrasing — minor. |
| `P15_Graduation.jsx` | 9 | 9 | Strong closer. "You walked in a cadet. You leave a rider." lands. |
| `P_ResourcesIntro.jsx` | 8 | 8 | OK. |
| `P_SignetCeremony.jsx` (standalone) | 9 | 9 | All three locales. Rituals data (`signet/rituals.js`) is fully trilingual including presets. Strong content. |
| `P_BondRitual.jsx` (standalone) | 8 | 8 | All three locales. `dragons/questions.js` has UK for every option. |
| `P_Aerie.jsx` (standalone) | 8 | 8 | Voting rules block explicit and trilingual. |
| `P_AerieReveal.jsx` (projector) | 9 | 9 | "Three votes. Forty dragons. One sky." — strong. |
| `P_AerieMosaic.jsx` (projector) | 9 | 9 | Clean visual moment. |
| `P_Resources.jsx` (take-home) | **3** | **3** | **English only — no `useT` at all (file uses no i18n import).** Big content surface participants will see post-workshop. |
| `StandaloneRegister.jsx` | 8 | 8 | Trilingual, including the corporate-DNS-blocked hint. |

### Voice drift / corporate phrasing flags

- **"Давайте разберём!"** appears in the "annoys" preset in Signet Ceremony (line 268 of rituals.js — **but in the negative**, as something to forbid). That's correct usage.
- **"По итогу"** appears nowhere in current content — clean.
- "Подход" header in `P06_InstallEcosystem.jsx:115` is corporate-flavored but small.
- "Заклинаниям всё равно каким именем ты их зовёшь" (P07) — Empyrean voice maintained.
- "Riders' arts" Section header (`P10_TalkMCP`) — clean Fourth Wing register.
- **Mixed-locale phrasing creeping in:** P03 voice-input hack uses Russian only, P_Resources has English-only marketing. These violate the consistency principle.

### "Three modes" vs four

`P_TalkModes.jsx` defines 4 modes (`Plan, Auto, Edit, Yolo`), but `narrative.js:64-66` describes the slide as "Three working modes (Plan / Edit / Yolo)" and the page title is "Three modes, eight keys". **Off-by-one between narrative copy and content table.** Likely "Auto" is the implicit default and was added later. Easy fix: change narrative to "Four modes…".

### Translation parity audit (verdict)

UK locale is **half-implemented**. Use cases where UK silently displays English:
1. P_TalkPowerMoves entire content
2. P_TalkModes modes + hotkeys tables
3. P07_TalkEcosystem spell/familiar/conduit items
4. P_HiddenGems intro
5. P_Resources entirely
6. Gem install prompts
7. ErrorBoundary, GateGuard buttons (RU instead of EN)
8. P03_PreWork everything (RU only)

If any of the 40 participants picks UK from the toggle, they'll see a mix of UK + EN + RU per slide. **Either pull UK from the toggle until parity is complete, or focus the last day on closing these gaps.**

---

## 3. Character (Persona) Consistency

### 3.1 Templates assessment

`src/data/persona-templates.js` carries six fully-fleshed characters (violet, xaden, rhiannon, ridoc, liam, imogen). Each has: essence, lore_anchor, personality (5 markers), takesOn (5 items), voiceMarkers (5-6 lines), rituals.do/dont (3+3), signature_phrases (5), forbidden_phrases (4), opening_line, closing_line, dialogue_examples (4 mini-exchanges), flaw, override, HEXACO defaults.

**Quality of distinctiveness: high.**

Read out loud test (could Imogen's dialogue be mistaken for Violet's?):
- **Imogen** (line 493-510): "Сломается." / "Line 14. Boundary." / "Тест. Зафиксировать. Дальше." — telegraphic, 1-3 words, no warmth, never apologizes. Signature: list/table instead of paragraph.
- **Violet** (line 78-95): "Дай 30 секунд проверить. Что я ищу — края или регрессию?" / "Нюанс — на строке 12 ожидается single quote..." — long sentences, qualifications, uses "нюанс", contextual.

These do not collide. Violet pauses; Imogen cuts. Both are reserved but **Imogen reads as battle-cold, Violet as deliberative**.

Other pairs to check:
- **Xaden vs Imogen** — both rough, but Xaden uses cursing + sarcasm (`Покажи зачем он вообще нужен. Что страшнее всего сломается?`), Imogen flatlines (`Сломается.`). Different. ✓
- **Rhiannon vs Ridoc** — Rhiannon teaches ("представь что это попадёт в продакшн"), Ridoc plays ("О, любимое. А что если пользователь — это сам баг?"). Very distinct. ✓
- **Liam vs Rhiannon** — Liam is checklist-oriented ("Давай по порядку. 1. Данные. 2. Логика."), Rhiannon is scenario-oriented ("представь что..."). Different. ✓
- **Violet vs Liam** — both careful and complete. Liam uses numbered lists more aggressively; Violet uses prose qualifications. Subtle but holds. ✓

### 3.2 Signet Ceremony — does character actually surface?

Yes. Flow:
1. `P01_CharacterSelect` sets `user.characterId` in zustand store.
2. `P_SignetCeremony` reads `user.characterId` from store (line 222), passes to `generateSignetClaudeMd({characterId, archetype, ...})`.
3. `signet-generator.js:60` reads `PERSONA_TEMPLATES[characterId]` to populate persona blocks (personality, takesOn, signature_phrases, dialogue_examples, etc.).
4. Final CLAUDE.md output explicitly references the character ("# Violet — мой bonded", lore_anchor block, "Ты не Claude в маске. Ты Violet.").

**Character is the spine of the generated CLAUDE.md.** Signet adds **archetype** (mentor/comrade/strategist/forge-master/bard/etc, 6 voices) as an additional voice layer on top. Both surface.

`P_PersonaIntro.jsx:52-75` displays the chosen Threshing character (image + title) right before "Begin the Ceremony". Good continuity.

### 3.3 'self' character handling

`signet-generator.js:14-36` defines `PERSONA_FOR_SELF` — a generic template used when `characterId === 'self'`. It's softer/less distinctive by design ("Звучит так как ты решил(а) — не как кто-то из лоры"). The override prompt + archetype + sigil + vow do the heavy lifting for these users. Acceptable, though "self" users get a less wow-effect final prompt.

### 3.4 Signet vs Bond — character carries through?

- **Signet Ceremony** (page 10 in flow / `/?page=signet`) uses `characterId` from store.
- **Bond Ritual** (page 19 in flow / `/?page=bond`) reads `characterId` (line 96) and passes it to `sealDragon({nickname, characterId, answers, ...})` — but doesn't use it for the dragon prompt itself. The dragon prompt is built from the 7 answers (`buildDragonPrompt(answers)`), with no character influence on the visual style.

**Mild inconsistency**: the dragon portrait does not visually reflect the chosen archetype. Imogen's dragon and Ridoc's dragon could look identical if they fill in similar answers. The characters in `data/characters.js` carry canonical Empyrean dragon descriptions (e.g., "Tairn — чёрный Хвостоскорпион" for Violet) — but these are not surfaced in the generation prompt.

**Suggestion (1 hour)**: in `buildDragonPrompt`, if `characterId` exists, prepend "Bonded to a rider in the style of [CHARACTER.style or trait]" or merge character.dragon hints. Subtle but reinforces the through-line.

### 3.5 Verdict

Character distinctiveness in templates is **excellent**. Surfacing into the actual generated CLAUDE.md is **clean**. One gap: Bond Ritual does not visually echo the character. Recommend addressing only if you want full Threshing→Signet→Bond circle to land.

---

## 4. UX / New-User Walkthrough (cold path)

Walking slide 0 → 24 with no prior context.

### Slide 0 (Landing)
- **Energy:** Calm-curious. The "voice" Hook (Это воркшоп по Claude Code для QA) lands immediately.
- **Confusion risk:** Low. Stats strip is informative.
- **Suggestion:** Stats are static ("7 commands, 4 agents, 3 MCP, 60 min Workshop") — they feel a bit generic vs the surrounding lore. Could leave them or replace with one big "What you'll walk out with" image.

### Slide 1 (Threshing)
- **Energy:** Peak interest — this is the choice moment.
- **Confusion risk:** "Это я" option is positioned last, no portrait, big glyph — visually a bit out-of-place vs the 6 character cards. Worth keeping but make it look more deliberate (e.g., maybe a parchment/scroll glyph).
- **Suggestion:** Add subtle "selected: X" confirmation already exists at the bottom. Good.

### Slide 2 (Registration)
- **Energy:** Drops — forms always drop energy. Mitigated by the workshop tool callout box.
- **Confusion risk:** "Email — Corporate" hint says "so I can send you a reminder" — but no actual reminder system is documented. If reminders aren't sent, this promise breaks.
- **Edge case:** If user came via WorkshopGate (nickname pre-filled), the form is skipped and they see only the welcome card. Then they have to press "→" — no obvious affordance besides keyboard. Consider adding a clear "Continue" button.

### Slide 3 (Parapet — pre-work checklist)
- **Energy:** Functional. Russian-only (issue flagged above).
- **Confusion risk:** Two paths (Cursor "бесплатно" vs Claude Code "$20/мес") — but the workshop is **built around Claude Code**, per slide 2. Why offer Cursor? This contradicts the rest of the deck. Recommend removing the Cursor path or making it explicit ("you'll join in observer mode").
- **Suggestion:** Pre-work counter ("X студентов уже здесь") is a nice social proof touch.

### Slide 4-6 (Talks: Bonding / Anatomy / Modes)
- **Energy:** Educational. Loses energy if read straight without facilitator commentary. These are facilitator-locked, so participants wait.
- **Suggestion:** While locked, show a "👂 wait for the facilitator" hint with maybe a 60-sec countdown or breathing indicator so the audience doesn't refresh.

### Slide 7 (Forging — install ecosystem)
- **Energy:** ACTION. First "do something" moment. Good.
- **Confusion risk:** The instructions are 3 steps in plain prose — good. But step 3 says "Wait 1-2 minutes" — that's optimistic. Actual install (7 commands + 4 agents + 3 MCPs) is 3-5 min for fresh users. Set expectations correctly.
- **Edge case:** No timer or progress indicator. Recommend showing "Install in progress... ~3 min" with optional fake progress bar.

### Slide 8-9 (Talks: What flew in / Power moves)
- **Energy:** Educational dip.

### Slide 10 (Persona Intro → Signet Ceremony)
- **Energy:** Rises sharply — this is the "make your AI yours" moment.
- **Confusion risk:** Big CTA "Begin the Ceremony →" opens in new tab. User loses the workshop flow tab. The Signet wizard has its own 7-ritual sequence. When done, the CTA at bottom says "Return to workshop →" but the original tab still sits on slide 10.

### Slide 11 (MCP demo)
- **Energy:** Facilitator-led demo. Audience watches.

### Slide 12 (Hidden Gems intro)
- **Energy:** Curiosity rises — promise of cool things.
- **Suggestion:** Six gem cards rendered as tags only ("◆ 01 · visual fun") with name + tagline. Decent but could use micro-illustrations or color cues per gem.

### Slide 13-18 (Six Hidden Gem deep-dives)
- **Energy:** Sustained but at risk of fatigue. Each gem follows the same template: hero → stats → pullquote → visual → "what it is" → "why it matters" → "when to reach for it" → install prompt.
- **Hidden Gems pacing concern:** Six identical-shaped slides in a row. If the facilitator spends 2 minutes each, that's 12 minutes of similar visual rhythm. The participant brain auto-tunes out.
- **Suggestion (≥3h):** Add visual variety per gem — different layout for hidden gems (e.g., the "Spotify track plays" gem could have an audio-wave visual, the "memory palace" could have a literal room diagram, the "85% context" gem could have a big chart). Some of this already exists in `GemVisual`, but not all.
- **Wow-factor verdict:** Sustained for first 2-3 gems. Drops by gem 5-6. Worth shortening to 4-5 gems if pacing is tight on the day.

### Slide 19 (Bond Intro → Bond Ritual)
- **Energy:** Peaks again — the moment they generate their dragon image.
- **Edge case:** New tab opens. User answers 8 questions (~3 minutes). Then 30-90 sec generation. If they regenerate, another 30-90 sec. With 40 concurrent users on the OpenAI API, queue times can blow out. **This is the biggest live-execution risk in the entire workshop.**

### Slide 20 (Aerie Intro)
- **Energy:** Group moment — eager to see everyone's dragons.
- **Bug:** "One vote each" — actual is 3 (flagged above).

### Slide 21 (Arena Intro)
- **Energy:** Action peak — coding their dragon.
- **Confusion risk:** Bot API quickref is compact and well-presented. Good. But there's no inline link to the Arena docs or to the full API; participants will rely on the facilitator + Claude Code.

### Slide 22 (Leaderboard / Final Battle CTA)
- **Energy:** Anticipation — this is the climax setup.
- **Suggestion:** Add facilitator-only countdown ("Battle starts in T-90 sec") so the room synchronizes.

### Slide 23 (Graduation)
- **Energy:** Calm-warm with confetti. Closer hits.
- **Verdict:** Strong landing. "You walked in a cadet. You leave a rider." is the right note.

### Slide 24 (Resources)
- **Energy:** Practical wind-down.

### Interaction model shifts (warning needed?)

The flow alternates between **listen** (facilitator-locked talks) and **do** (self-report ecosystem install, Signet, Bond, Arena). The shift is generally signposted via gate type, but not always made explicit in copy.

- Slide 7 → 8: "you just did something" → "now we're talking again". Acceptable.
- Slide 10 → 11: "you just built your CLAUDE.md" → "now we watch MCP demo". Acceptable but creates context-switching cost.
- Slide 18 → 19: "we just talked about 6 gems" → "now build a dragon". Big shift in tone.
- Slide 19 → 20: "you built a dragon" → "open Aerie and vote". Multi-tab management.

**No critical interaction-model surprises**, but the **multi-tab pattern** (Signet/Bond/Aerie/Arena/Resources all open in new tabs) is a UX risk for the day. Participants will end up with 6+ tabs open. Recommend a small "tab map" in HUD or sidebar.

### Boredom troughs (mapped)

- Slide 5-6: dense talk content. Mitigation: facilitator energy.
- Slide 14-16: middle of Hidden Gems. Mitigation: shorten or visually vary.
- Slide 22: leaderboard waits for battle — could have a vibrancy beat.

### Energy peaks
- Slide 7 (install moment)
- Slide 10/Signet (persona ceremony)
- Slide 19/Bond (dragon image reveal)
- Slide 20/Aerie (collective viewing)
- Slide 22/Final Battle (climax)
- Slide 23 (graduation confetti)

---

## 5. Logic & Edge Cases

### 5.1 Signet Ceremony (`P_SignetCeremony.jsx`)

| Edge case | Behaviour | Verdict |
|-----------|-----------|---------|
| Reload mid-flow | Answers persisted to `localStorage` AND zustand store. `stepIdx` resets to 0 (line 230 `useState(0)`). | **Bug** — answers preserved, but user is bumped back to ritual I. Should persist stepIdx. |
| Backend slow/down | No backend calls in Signet (it's pure client → clipboard/download). | OK. |
| Empty answers | Final "Sealed" page warns if mandatory unfilled (line 435-443). User can still proceed and copy. | Acceptable. |
| Very long answer | No max-length; textarea grows. Could theoretically generate a 100KB prompt. | Minor risk — set max-length on inputs. |
| Emoji in answers | `JSON.stringify` handles, copy works, paste into Claude Code works. | OK. |
| User picks 'custom' archetype but doesn't fill text | `archetype_custom` is in `showIf` for the textarea but NOT in `MANDATORY_IDS`. If left blank, archetype block is omitted from output silently (`signet-generator.js:42-46`). | Soft bug — user expects custom voice, gets nothing. Add validation. |
| Copy fails | Falls back to textarea+execCommand. Toast shows error. | Good. |
| Two browsers open with same nickname | localStorage is per-browser. Each saves its own answers. Last-write-wins on the server (no server save in Signet, only client-side). | OK for Signet. |

### 5.2 Bond Ritual (`P_BondRitual.jsx`)

| Edge case | Behaviour | Verdict |
|-----------|-----------|---------|
| Reload mid-question stage | Answers persist (localStorage key `bond-ritual-answers`). stepIdx, stage, imageB64, riderClass — NOT persisted. | **Bug** — user goes back to step 1 of unfilled state. |
| Reload after generate, before seal | Image lost, must regenerate (costs another API call + 30s). | **Bug** — see above. |
| Reload after seal | Already sealed in Aerie. User unaware unless they navigate to Aerie. | Acceptable — sealed state is server-side. |
| Backend slow | UI sits on "manifesting..." indefinitely. No timeout. | **Bug** — add 90-second timeout with retry. |
| Rate limit | Detected via regex `/rate limit|RATE_LIMITED|429/` and friendly message shown. | Good. |
| Empty motto | Filled with default in prompt builder. | OK. |
| Very long motto (50K chars) | Sent to OpenAI. Likely truncates somewhere. Stat display uses `truncate` class. | Probably OK but limit input length. |
| Emoji in name/motto | Filename uses lowercase + spaces→dashes; emoji passes through. Spotify-style emoji in motto fine. | OK. |
| Generate before nickname (gate slip) | Workshop store requires nickname for sealing (`handleSeal` checks `if (!nickname)`). Generate doesn't check — image generated but cannot be sealed. | Minor — show nickname requirement upfront. |
| Re-roll spam | Each re-roll fires fresh `generateDragonImage` call. No throttle/quota client-side. User can burn through OpenAI rate limits fast. | **Risk** — add cooldown of 5 sec between re-rolls. |
| Edit-prompt persistence | `editedPrompt` is `useState` — lost on reload, lost on stage change. | OK as designed (re-rolls reset on seal). |
| Voice input fails | `VoiceTextInput` shows error toast and falls back to typing. | Good. |
| Class assignment fails | Silently swallowed; UI doesn't show class section. | OK — "bonus content". |

### 5.3 Aerie (`P_Aerie.jsx`)

| Edge case | Behaviour | Verdict |
|-----------|-----------|---------|
| Voting 3 times | Each vote increments. After 3, "No votes left". | Correct (matches MAX_VOTES_PER_VOTER=3). |
| Voting 4th time | Blocked client-side AND server-side (QUOTA_EXCEEDED). | Good defense-in-depth. |
| Voting for own dragon | Blocked client-side (line 71-79: `mineDragon` check). Server-side? Apps Script — see Code.gs; Supabase — RLS or app check. **Need to verify server-side.** | **Risk** — confirm server-side check. |
| Voting then withdrawing | `withdrawVote(nickname, dragonId)` deletes specific row. Refresh. | OK. |
| Toggle vote (click voted dragon again) | UI says "Voted (click to withdraw)". Implements withdraw. | Good. |
| Empty Aerie | Empty state shown ("The sky is still empty"). | OK but shows briefly even while loading (no loading state). |
| Massive Aerie (100+ dragons) | Grid `lg:grid-cols-3` — would scroll. No pagination, no virtualization. | OK for 40-person cohort; risk if grows. |
| Realtime fails / falls back to polling | 5s poll on gsheets path, 8s on Supabase. UI auto-refreshes. | Good. |
| Two tabs open | Both subscribe, both update independently. Vote count consistent because backend is source of truth. | OK. |
| Network down mid-vote | Error message shown ("vote failed"). State not updated. | Acceptable, but no retry mechanism. |
| Preview mode (`?preview=N`) | Generates fake dragons via `generateFakeDragons`. No backend hits. | Useful for layout testing. |

### 5.4 Aerie Reveal (`P_AerieReveal.jsx`)

| Edge case | Behaviour | Verdict |
|-----------|-----------|---------|
| No winner (zero dragons) | Stage ≥2 shows "The sky is still empty." | Good. |
| Tie | First by sealed_at ascending wins display. | Acceptable — tiebreak by sealed_at. |
| Reload mid-reveal | Stages reset to 0; full sequence replays. | Mild side-effect but intentional given setTimeout-driven sequence. |
| Real-time vote during reveal | `subscribeToAerie(refresh)` keeps updating. If winner changes during reveal, the displayed dragon may shift mid-stage. | **Bug — design tension.** Should freeze winner at stage 2 ("the bond that lit the Aerie hottest..." moment) so the reveal isn't whiplashed by late votes. |

### 5.5 TODO comments

Grepped `TODO|FIXME|XXX|HACK` — **none found in src/**. Good signal of polish; but some commented-out code paths exist (e.g., old QA pages in `pages.js`).

---

## 6. Design & Polish

### 6.1 Token system (`index.css`)

Tight palette:
- Primary teal `#00E5CC` (with soft + dark variants).
- Ember `#E85D26`, blood `#8B1A1A`, sky `#1A3A5C`, forest `#2D6A4F` — Fourth Wing accents.
- Pink `#FF65BE` — used very sparingly (confetti).
- Backgrounds `#0A0A0A` / `#111111` / `#1E1E1E` — strong stack.
- Fonts: Playfair Display (italic display), Inter (body), JetBrains Mono.

**Consistent across slides.** Border-radius is `[2px]` everywhere — clean, deliberately mechanical.

### 6.2 Visual consistency between slides

- ✓ Border style: `border border-border` (`#1E1E1E`) on cards, `border-qa-teal/30` on highlighted blocks. Used consistently.
- ✓ Padding: `p-4` / `p-5` / `p-6` mostly consistent.
- ✓ Eyebrow pattern: `font-mono text-[10-11px] tracking-[2-3px] uppercase text-qa-teal mb-2-3` with `◆` glyph — used on ~every slide.
- ✓ Headline: `font-display italic` with `clamp(...)` sizing — consistent.
- ✓ Button styles: primary `bg-qa-teal text-black px-7 py-3 font-mono tracking-[3px]` — consistent across all CTAs.

### 6.3 Inconsistencies found

- **Border colors:** Some places use `#2E2E2E` (e.g., `P00_Landing.jsx:11`, `P10_TalkMCP.jsx:49`) instead of the token `border` (`#1E1E1E`). Hex one-offs in slide markup. Easy fix: replace with `border-border`.
- **Stat sizes:** Landing uses `text-3xl sm:text-4xl` for big numbers, Gem stats use `text-[26px]` font-display italic. Different vibes.
- **Card hover:** Most have `hover:border-qa-teal/40` (sometimes /25, /30, /60 — inconsistent opacity). Pick one.
- **Aerie cards** (`P_Aerie.jsx:254`) use `aspect-square` for images; Bond preview uses different aspect. Aerie Reveal also `aspect-square`.

### 6.4 Loading states

- **Bond generation:** Has "manifesting..." with dot animation. ✓
- **Aerie initial load:** No skeleton — empty state flashes. ✗
- **Aerie Reveal:** Stages 0-1 are pacing animations, not loading per se. Acceptable.
- **Signet Ceremony:** No async, no need.
- **Leaderboard:** Has `loading` state, hides counter. ✓
- **Resource Hub:** Static, no loading needed.
- **Workshop Gate nickname check:** Has "Checking..." state. ✓
- **PageRouter:** `PageLoader` shown during lazy-load. ✓

### 6.5 Empty states

- **Aerie empty:** "No dragons in the Aerie yet" + "First sealed dragon takes the empty sky." ✓
- **Aerie Reveal empty:** "The sky is still empty." ✓
- **Mosaic empty:** "The sky is empty. Send people to the Bond Ritual first." ✓ (in three languages)
- **Leaderboard empty per character slot:** "No submission yet" — ✓
- **Resource Hub:** No empty state needed (static).

### 6.6 Animations

- `motion/react` AnimatePresence used in PageRouter, Signet, Bond, Aerie cards, Aerie Reveal stages, Graduation.
- Pulse-teal CSS animation on primary CTAs.
- TealParticles background — runs everywhere except mosaic/reveal (projector clean).
- Confetti on Aerie Reveal stage 3+ and Graduation mount.

**Animation feels coherent.** Stage timings in Aerie Reveal (`1800ms → 4200ms → 6000ms → 7400ms → 8800ms`) are well-paced for projector.

### 6.7 Mobile (<768px) — spot check

Reading the Tailwind classes:
- **Landing (P00):** Stats strip uses `gap-8 sm:gap-12` — OK on narrow. Grid `grid sm:grid-cols-2 gap-4` — single column on mobile. Acceptable.
- **Character Select (P01):** `grid grid-cols-2 sm:grid-cols-3` — 2 columns on mobile. Portrait `aspect-[3/4]`. Should work.
- **Signet Ceremony:** `max-w-3xl mx-auto` with `px-4 sm:px-8`. Q+A flow vertical. Mobile OK.
- **Bond Ritual:** Same shell. Cards picker `grid-cols-2 sm:grid-cols-3` — 2 cols on mobile. Manageable.
- **Aerie:** `sm:grid-cols-2 lg:grid-cols-3` — 1 column mobile, 2 tablet, 3 desktop. With 40 dragons on a phone screen, that's a long scroll. Add pagination if mobile is a real channel.
- **Aerie Reveal / Mosaic:** Projector-only. Mobile not a concern.
- **Resource Hub:** `grid sm:grid-cols-2/3` — fine.

**Verdict:** No major break expected at <768px. Aerie mobile scroll-length is the only concern.

### 6.8 Tab navigation

Every standalone route opens via `target="_blank"`. This is **intentional** (projector mode separate from facilitator) but creates **tab-soup**. Add a "Workshop tabs:" sidebar or page-3 instruction "we'll open new tabs as we go".

---

## Bugs found (consolidated)

- `src/api/gsheetsClient.js:14` + `.env` — `VITE_GSHEETS_API` unset → silent Supabase fallback.
- `src/pages/P_AerieIntro.jsx:20-23,52-55` + `src/data/narrative.js:218-220` — "one vote" copy contradicts 3-vote implementation.
- `src/data/dragons/questions.js:5` + `src/pages/P_BondIntro.jsx:32-34` + `narrative.js:209-211` — "Seven" vs 8 questions in code.
- `src/pages/P_TalkPowerMoves.jsx:58-60,76-80` — UK locale falls back to EN (no `_uk` in MOVES array; intro `t()` has only 2 args).
- `src/pages/P_TalkModes.jsx:93-96,118` — UK falls back to EN in modes and hotkeys tables (only `_en/_ru` in MODES; HOTKEYS has no UK).
- `src/pages/P07_TalkEcosystem.jsx:141,156` (SpellEntry) — UK gets EN because `lang === 'ru'` check.
- `src/pages/P_HiddenGems.jsx:18-21` — intro `t()` has only `en` + `ru` args. UK falls to EN.
- `src/pages/P_Resources.jsx` (entire file) — English only, no `useT` import.
- `src/pages/P03_PreWork.jsx` — Russian-only, no `useT`. Pre-arrival critical content.
- `src/core/GateGuard.jsx:46,86,102,117,130` — hard-coded Russian buttons + messages.
- `src/core/ErrorBoundary.jsx:23-25,34` — hard-coded Russian error UI.
- `src/data/badges.js` (all entries) — Russian-only badge names + descriptions.
- `src/components/CheckpointButton.jsx` — `label` prop is English string passed from parent (P03/P06/P_Persona/P_Bond/P_Arena). No `useT` wrapping.
- `src/store/workshopStore.js:99-101` — fallback `crypto.randomUUID()` will throw on old Safari.
- `src/pages/P_BondRitual.jsx:230` (stage), `src/pages/P_SignetCeremony.jsx:230` (stepIdx) — neither persists wizard position. Reload mid-flow loses progress.
- `src/pages/P_BondRitual.jsx:141-189` — no client-side timeout on `generateDragonImage`.
- `src/pages/P_Aerie.jsx:54-60` — no loading state. Empty state flashes before fetch.
- `src/pages/P_AerieReveal.jsx:42-46` — winner can change mid-reveal due to live subscription.
- `src/pages/P_BondRitual.jsx:192-196` (handleRegenerate) — no rate-limiting; user can spam re-rolls.
- `src/App.jsx:124-134` — `/?page=persona` mounts vestigial `P_PersonaBuilder` (old wizard).
- `src/data/narrative.js:64-66` — describes "Three working modes" but `P_TalkModes` shows 4.
- `src/data/pages.js:9,156` comments — "7 deep-dive slides" vs actual 6 gems.
- `src/data/gems.js` — `install_uk` field missing from every gem (UK install prompt = EN).
- `src/pages/P03_PreWork.jsx:18,29` — Cursor + Claude Code dual-path. Workshop is built around Claude Code only (per slide 2). Remove Cursor path.

---

## Quick wins (≤1 hour each)

1. **Set `VITE_GSHEETS_API` in Render env or remove the Apps Script path entirely.** Decide one backend, commit. (15 min)
2. **Fix the "One vote" copy in `P_AerieIntro.jsx` + `narrative.js`** — change to "Three votes" everywhere. (10 min)
3. **Change "Seven short questions" to "Eight" in `P_BondIntro.jsx` + `narrative.js`** OR remove the `name` question from Bond Ritual flow (let server auto-name). (15 min)
4. **Wrap `GateGuard.jsx` buttons + messages in `useT`.** Add EN+UK strings. (30 min)
5. **Wrap `ErrorBoundary.jsx` in `useT`.** (10 min)
6. **Add UK translations to `P_TalkModes.jsx` MODES + HOTKEYS arrays.** (30 min)
7. **Add UK translations to `P_TalkPowerMoves.jsx` MOVES array + intro.** (30 min)
8. **Add UK translations to `P_HiddenGems.jsx` intro paragraph + advance lookups.** (15 min)
9. **Wrap `P_Resources.jsx` in `useT`** — at minimum the section titles + descriptions. (45 min)
10. **Add loading state to Aerie** — skeleton or spinner before first fetch resolves. (20 min)
11. **Remove `/?page=persona` route + `P_PersonaBuilder.jsx` from App.jsx.** Add redirect to `/?page=signet`. (15 min)
12. **Add 90-second client timeout to `generateDragonImage`.** Show retry button. (20 min)
13. **Add 5-second cooldown between Bond Ritual re-rolls.** (15 min)
14. **Update `narrative.js:64-66`** to say "Four working modes". (5 min)
15. **Remove Cursor path from `P03_PreWork.jsx`** — workshop is Claude Code only. (15 min)
16. **Persist `stepIdx` for Signet and `stepIdx + stage` for Bond** to localStorage. (45 min)
17. **Add max-length attributes to all text inputs.** Prevent 50K-char abuse. (15 min)
18. **Translate `badges.js` strings** via `useT` lookup in HUD. (20 min)

## Bigger improvements (≥3 hours)

1. **Complete UK locale parity sweep.** Audit every `t()` call site for 2-arg vs 3-arg, fill in UK strings in arrays (gems install_uk, modes, hotkeys, power moves, etc.). 4-6 hours.
2. **Translate `P03_PreWork.jsx`** to all three locales properly. 1-2 hours.
3. **Add visual variety to Hidden Gem slides** — different layout/illustration per gem (`GemVisual` exists but is sparse). 4-6 hours.
4. **Add character-driven dragon prompt augmentation** — in `buildDragonPrompt`, blend `characterId` style into the prompt so Imogen's dragon looks different from Ridoc's. 3-4 hours.
5. **Resource Hub full translation + content review.** It's the take-home artefact, currently EN only. 4-6 hours.
6. **Add a "Workshop tabs" sidebar/HUD** showing which standalone routes are currently open so participants don't lose context. 3-4 hours.
7. **Persist full wizard state for Signet + Bond** — current step, stage, image, prompt. Critical for poor-Wi-Fi participants. 3-4 hours.
8. **Server-side own-dragon vote check.** Verify the Aerie can't be gamed by a bypass client. Audit `Code.gs` and Supabase RLS. 2-3 hours.
9. **Freeze winner in Aerie Reveal.** Snapshot once stage 2 starts; don't re-evaluate. 2 hours.
10. **Replace the static "60 min Workshop" stat on landing** with an actual schedule mini-graphic. 3-4 hours.
11. **Pre-render fallback images for dragon generation** — if OpenAI hits rate limits, have 8 stock dragon portraits in `/public/dragons-fallback/` keyed by `breath × size`. Better than infinite spinner. 3-4 hours.
12. **Add Sentry or similar** for live-day error monitoring. With 40 concurrent users, having visibility into client errors is worth the 1-hour setup.
