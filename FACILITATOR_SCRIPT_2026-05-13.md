# Facilitator one-pager — Basgiath Workshop · 2026-05-13

90 minutes. 20-30 QA. Print this. Keep it near the laptop.

## Pre-show (T-30 min)

- [ ] Open `?token=...` admin URL in one tab.
- [ ] Open `/?page=mosaic` in a second tab (projector). Leave on standby.
- [ ] Pre-warm chatbot-mentor backend: `curl https://chatbot-mentor.onrender.com/api/workshop/transcribe -X POST -H "Content-Type: audio/webm" --data-binary @/dev/null` (returns 400, that's fine — server is now warm).
- [ ] Confirm `Render` deploys for both `basgiath-workshop` and `chatbot-mentor` are GREEN.
- [ ] Smoke-test as `smoke_test` — Signet copy → paste → restart → Bond seal → Aerie vote — 5 minutes.
- [ ] If your network is on Cisco Umbrella / Zscaler, **test from a mobile hotspot first** — supabase.co block is the #1 failure mode.
- [ ] In admin, click slide **24** → unlocks all 25 slides.

## Voice register (you on stage)

Workshop is **peer-style, not corporate training.** They are colleagues, not students. Use "ты". Curse if it fits the moment. Don't apologise for lore — own it.

Don't open any segment with "great question / отлично". You set the floor for what Claude should sound like — the participants are watching.

---

## Slide-by-slide notes

| # | Title | Time | What to say | What to draw out |
|---|-------|------|-------------|------------------|
| 0 | Landing | T+0 → 2 | One-line intro: "Today we install Claude Code together. The wrapper is dragons. The work is QA." Don't over-explain the lore — let it set the room. | — |
| 1 | Threshing (character) | T+2 → 4 | "Pick the rider whose style is closest to how you actually work — or 'this is me' if none fit." | They name their archetype out loud (sets context for Signet later). |
| 2 | Registration | T+4 → 7 | Just walk them through. Names + nickname. Nickname is what they log into Aerie / Eyes / Mosaic with. | — |
| 3 | Pre-work / Parapet | T+7 → 12 | "If Claude Code isn't installed, you cross the parapet now or never." | Watch for stragglers. |
| 4 | The Bonding (talk) | T+12 → 17 | "You don't use AI. You bond with one." This is the thesis of the workshop. Pause here. | — |
| 5 | Anatomy of Claude Code | T+17 → 22 | Six parts: CLAUDE.md / skills / agents / MCP / hooks / commands. Use the visuals. | — |
| 6 | Four modes & hotkeys | T+22 → 26 | Auto is the default now (was Edit). Shift+Tab to cycle. /clear is the magic word. | Hands up: who uses Plan mode? |
| 7 | Forging the bond (install) | T+26 → 35 | The big one. They paste one prompt and the QA ecosystem installs. Time it: who finishes first? | First three finishers — name them out loud. |
| 8 | The QA Grimoire | T+35 → 40 | "These are the spells. Real commands, lore names." Read 2-3 invocations theatrically. | — |
| 9 | Power moves | T+40 → 43 | Fast. Six habits. Don't dwell. | "Which of these will save you the most time tomorrow?" — 30 sec chat. |
| 10 | Signet Ceremony intro | T+43 → 44 | "Seven rituals of bonding. Walk through them at your own pace. Use voice if you want." | — |
| **STANDALONE: /?page=signet** | | T+44 → 60 | They work alone for 15 min. You walk the room. | — |
| 11 | Riders' arts (MCP demo) | T+60 → 65 | Live MCP demo. Open the sample-project in playwright, test something, find a bug live. | One participant suggests the test. |
| 12 | Hidden Gems overview | T+65 → 66 | "Six things you don't know yet. We go through one at a time." Brisk. | — |
| 13-18 | Six gem deep-dives | T+66 → 75 | 90 sec each. Read the pull quote out loud. Have them install ONE during this block (their pick). | First to install — name them. |
| 19 | Bond Ritual intro | T+75 → 76 | "Now your dragon takes shape." | — |
| **STANDALONE: /?page=bond** | | T+76 → 84 | They generate. ~30s per attempt. Encourage re-rolls. Class assignment happens in parallel. | — |
| 20 | Aerie intro | T+84 → 85 | "One vote each. Cast it for someone else's." | — |
| **STANDALONE: /?page=aerie** | | T+85 → 88 | They vote. Switch projector to `/?page=mosaic` while they vote. | **THIS IS THE PEAK.** Don't talk. Let the wall fill up. |
| Optional: /?page=eyes | T+88 → 90 | If time — blind matching. Funniest moment of the day. | — |
| 21-23 | Arena → Leaderboard → Graduation | T+90+ | If you've got time, do Arena. If not, skip to Graduation. | "You walked in a cadet. You leave a rider." |

---

## Three things that will go wrong (mitigations ready)

1. **Network blocks supabase.co.** Symptom: registration shows "Looks like your network is blocking *.supabase.co". Fix: mobile hotspot for the affected participant, or have IT whitelist `*.supabase.co` before the workshop.

2. **chatbot-mentor backend is cold.** Symptom: first voice-input or image-gen takes 30+ seconds, then works fine. Fix: pre-warm it (see pre-show checklist).

3. **gpt-image-2 not available on your OpenAI tier.** Symptom: silent fallback to gpt-image-1 — slightly different aesthetic but still photoreal. No action needed.

---

## Sigil Card reveal (memorable closing)

After Aerie voting, before Graduation:

- Switch projector to `/?page=mosaic` (grid mode) — show all dragons at once.
- Pick the top-voted dragon, click it, switch to `?cycle=1` mode — spotlight.
- Hand the floor to the winner. "Read your dragon's motto out loud." Whole room hears it.
- "Now everyone — download your Sigil card. Tweet it, slack it, framed-on-your-desk it."

That's the moment they'll remember in three months.

---

## After the workshop

- Aerie persists. Anyone can come back with their nickname.
- Encourage them to update their CLAUDE.md as their work changes.
- The bond is good for one year.

— K.
