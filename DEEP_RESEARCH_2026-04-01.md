# Deep Research Report: Basgiath Workshop
**Date:** 2026-04-01
**Focus:** full
**Agents:** UX/Product, Architecture, Security, Performance, Bugs

## Executive Summary

Workshop platform is functional and well-architected (7.5/10) but has **critical security holes** (API keys in bundle, permissive RLS, weak facilitator auth), **10 confirmed bugs**, **9.2MB unoptimized images**, and **zero tests**. The biggest risks: students can cheat by editing localStorage, facilitator token is discoverable in bundle, and Groq API key is publicly exposed. Before live workshop: rotate keys, fix RLS, add submission guards.

## Metrics
- Source files: 55 (.jsx/.js)
- Test files: 0
- Dependencies: 5 (react, react-dom, zustand, motion, @supabase/supabase-js)
- Bundle: 341KB (107KB gzip)
- Images: 9.2MB (6 PNGs, unoptimized)
- Last commit: 2026-04-01

---

## Critical (5)

### C-01: API Keys Exposed in Production Bundle
**Perspectives:** Security
**Files:** .env, src/api/groq.js, src/App.jsx
**Impact:** Groq key abuse (rate limit DoS, cost), facilitator token guessable (6 digits)
**Fix:** Rotate keys immediately. Move Groq to backend proxy. Use 32-char random facilitator token.
**Effort:** M (4-6h for backend proxy)

### C-02: Supabase RLS Allows Anyone to Update Any Record
**Perspectives:** Security + Architecture
**Files:** supabase-schema.sql:74-80
**Impact:** Students can set XP to 999999, modify facilitator_state, impersonate others
**Fix:** UID-based RLS. Students update only own record.
**Effort:** M (2h)

### C-03: Groq API Error Has No User Feedback
**Perspectives:** UX + Security
**Files:** src/api/groq.js:36-50, src/components/SubmissionReview.jsx
**Impact:** Student submits, Groq is down, gets silent 10 XP fallback — thinks they got real feedback
**Fix:** Show "AI unavailable" message, different XP display
**Effort:** S (30min)

### C-04: Registration Failure Creates Zombie User
**Perspectives:** Bugs + Architecture
**Files:** src/store/workshopStore.js:78-90
**Impact:** Supabase down → local UUID → all subsequent server writes fail silently
**Fix:** Expose error state, retry queue, show registration status
**Effort:** S (1h)

### C-05: localStorage XP/Progress Tamperable
**Perspectives:** Security + Bugs
**Files:** src/store/workshopStore.js:387-394
**Impact:** Student edits localStorage → XP 999999, skip all pages
**Fix:** Server-side source of truth for XP/badges. localStorage = cache only.
**Effort:** L (4-6h)

---

## High (8)

### H-01: Character Selection Not Changeable After P02
**Files:** src/pages/P01_CharacterSelect.jsx
**Fix:** Add "Edit Character" in P04 WaitingRoom or HUD
**Effort:** S

### H-02: Quiz Multi-Submit Vulnerability
**Files:** src/pages/P10_Quiz.jsx:17-20
**Fix:** Add isSubmitting state + disabled button
**Effort:** S

### H-03: Quiz Answers Replayable (navigate away & back)
**Files:** src/pages/P10_Quiz.jsx:7
**Fix:** Initialize showResults from quizScore !== null
**Effort:** S

### H-04: Timer Ignores Facilitator round_ended Signal
**Files:** src/pages/P11_Flight1.jsx:16-20, P12_Flight2.jsx
**Fix:** Add roundEnded to useEffect dependencies
**Effort:** S

### H-05: HUD Overlaps Content on Mobile
**Files:** src/core/HUD.jsx:22-74
**Fix:** Responsive positioning, hide on very small screens
**Effort:** M

### H-06: Images 9.2MB Unoptimized (PNG)
**Files:** public/characters/*.png
**Fix:** Convert to WebP (saves 5MB), add lazy loading
**Effort:** S (30min)

### H-07: Progress Bar Shows Page Index Not Completion
**Files:** src/core/ProgressBar.jsx:9
**Fix:** Calculate from completedPages.length, not currentPage
**Effort:** S

### H-08: Facilitator Unlock Is One-Way Only
**Files:** src/store/sync.js:74
**Fix:** Remove > comparison, allow any value from facilitator
**Effort:** S

---

## Medium (10)

### M-01: P08/P09 Are 95% Duplicate Code
**Files:** src/pages/P08_Combat1.jsx, P09_Combat2.jsx
**Fix:** Extract CombatTemplate.jsx, reduce 222→60 lines
**Effort:** M

### M-02: Polling Too Aggressive (3-5s intervals)
**Files:** src/store/sync.js, src/facilitator/Dashboard.jsx, RoundControl.jsx
**Fix:** Student sync 30s, dashboard 5s with exponential backoff
**Effort:** S

### M-03: 12 Console.warn/log Debug Artifacts
**Files:** src/api/*.js, src/store/sync.js
**Fix:** Create centralized logger, remove console calls
**Effort:** S

### M-04: Font Loading Blocks FCP (4 fonts, all variants)
**Files:** index.html
**Fix:** Reduce variants, self-host Inter, preload critical weight
**Effort:** S

### M-05: TealParticles 36 Continuous Animations
**Files:** src/effects/TealParticles.jsx
**Fix:** Add will-change, reduce to 8 particles, pause off-screen
**Effort:** S

### M-06: Podium Fragile With <3 Winners
**Files:** src/components/WinnersPodium.jsx:46,68
**Fix:** Safer indexing, fallback medals
**Effort:** S

### M-07: Character Persona CSS Variables Don't Reset on Null
**Files:** src/store/usePersona.js:11-26
**Fix:** Set defaults in else branch
**Effort:** S

### M-08: No Timer Warning Before Expiry
**Files:** src/pages/P11_Flight1.jsx, P12_Flight2.jsx
**Fix:** Add 30-sec pulsing warning, sound cue
**Effort:** S

### M-09: PreWork Mandatory 6/6 — No Skip Option
**Files:** src/pages/P03_PreWork.jsx
**Fix:** Add "I already have tools" skip button
**Effort:** S

### M-10: Round Ranking Not Deterministic on Ties
**Files:** src/api/rounds.js:47-52
**Fix:** Add tertiary sort by submitted_at + student_id
**Effort:** S

---

## Low (5)

### L-01: Unused CSS @keyframes blink
### L-02: Arrow Key Navigation Not Discoverable
### L-03: Space Key Doesn't Account for contenteditable
### L-04: Sound Toggle Hidden and Off by Default
### L-05: Dashboard Not Responsive (facilitator on mobile)

---

## Cross-Perspective Insights

1. **Security + UX:** Groq API key exposed + silent failure = student doesn't know review failed AND attacker can abuse API. Double problem.
2. **Architecture + Bugs:** Registration zombie user + localStorage tampering = entire scoring system unreliable.
3. **Performance + UX:** 9.2MB images + font blocking = 3-4s LCP on mobile. Students on phones will see blank screen.

## Top 10 Action Items

| # | Action | Effort | Category |
|---|--------|--------|----------|
| 1 | Rotate Groq API key + facilitator token | 15min | Security |
| 2 | Fix RLS policies (students own-record only) | 2h | Security |
| 3 | Convert images to WebP | 30min | Performance |
| 4 | Add Groq error feedback to user | 30min | UX |
| 5 | Fix quiz multi-submit + replay bugs | 30min | Bugs |
| 6 | Fix timer round_ended dependency | 15min | Bugs |
| 7 | Fix registration zombie user | 1h | Bugs |
| 8 | Fix progress bar calculation | 15min | UX |
| 9 | Fix facilitator one-way unlock | 5min | Bugs |
| 10 | Fix podium <3 winners edge case | 15min | Bugs |
