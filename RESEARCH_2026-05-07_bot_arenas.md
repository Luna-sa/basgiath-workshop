# Bot-Arena Research for QA Workshop (1.5h)

**Date:** 2026-05-07
**Use case:** 1.5-hour live workshop for QA professionals at a gaming company. Each participant uses Claude Code to author behavior for a personal bot/character, then a visible finale runs where bots compete or perform on screen.
**Constraints (CRITICAL):**
- No git for some users (corp network)
- No npm/node install ideally
- Cross-platform (Mac, Win, Linux)
- Browser-based or trivial local run
- Polished visual finale (animation)
- Behavior in plain text (JS / JSON / English prompt) so Claude Code helps users iterate

---

## TL;DR — Top Recommendation

**Build a thin custom Phaser 3 arena (Option C) and host it as a static site.**

JsBattle is the closest "ready" match in API shape but the project has been dormant 2019–2026 (single README commit in March 2026), demo site is offline (`ECONNREFUSED` on `jsbattle.jmrlab.com`), and the architecture requires `npm install` + an Express server — that fails the no-git/no-npm rule for participants. AI-Town is research-grade and LLM-token-expensive at workshop scale. The Claude-Code "office" projects (AgentFleet, agents-in-the-office, Pixel Agents, claude-office) are gorgeous but they visualize **real Claude sessions doing real work** — they don't run a bot battle, and most need API keys + local install per attendee.

The fastest path to a polished WAU finale that fits all constraints is to fork a Phaser tank starter (`panietoar/phaser-tank` or `yandeu/phaser-project-template`), expose a tiny `tank.init` / `tank.loop` API mirroring JsBattle's contract (since the contract is well-known and Claude Code knows it cold), run each bot in a sandboxed Web Worker, and ship the whole thing as `dist/` static files served from any URL (Render static site, Netlify, or even `python -m http.server` on the presenter laptop).

Realistic effort: **3–4 days build + 1 day polish/dry-run = 5 working days**, which fits the 5–6 day window.

A bolt-on safety: keep `agents-in-the-office` running on the presenter's machine as an "interlude" visual between coding rounds — it makes a great "look what's happening behind the scenes" beat without being the load-bearing finale.

Detailed rationale below.

---

## Track 1 — JS Bot Battle Games (browser-runnable)

### JsBattle (jamro/jsbattle) — closest API shape, but dormant + server-required

- **Repo:** https://github.com/jamro/jsbattle
- **License:** MIT
- **Last meaningful activity:** v2.1.11 release **March 2019**. Single README commit **March 30, 2026**. No code changes in 5+ years.
- **Stars / Forks:** 110 / 48 (long-tail).
- **Live demo:** http://jsbattle.jmrlab.com — currently **offline** (ECONNREFUSED on root, 200 on a few sub-paths via cache; not reliable for a workshop).
- **Bot format — confirmed clean and Claude-friendly:**
  ```javascript
  importScripts('lib/tank.js');
  var turnDirection, turnTimer;

  tank.init(function(settings, info) {
    settings.SKIN = 'forest';
    turnDirection = Math.random() < 0.5 ? 1 : -1;
    turnTimer = Math.round(Math.randomRange(0, 30));
  });

  tank.loop(function(state, control) {
    if (state.collisions.wall) turnTimer = 30;
    if (turnTimer > 0) { turnTimer--; control.TURN = turnDirection; }
    else { control.THROTTLE = 1; control.TURN = 0; }
    if (state.radar.enemy) control.SHOOT = 0.5;
  });
  ```
  This is exactly the level that mixed-skill QAs can read and that Claude Code will write/iterate on perfectly.
- **Architecture:** Lerna monorepo with `jsbattle` (Express + Node server) and `jsbattle-engine`, `jsbattle-server`, `jsbattle-docs`. Bots run in Web Workers (sandboxed — important).
- **Runtime:** `npm install jsbattle && npm start` → http://localhost:8080. There is no published static build. Deploying needs Node on the host.
- **Visual quality:** Functional 2D top-down, sprites OK but dated 2019 aesthetic. Screenshot at `packages/jsbattle-docs/docs/img/screenshot.png`.
- **Adaptation effort if forking:** 2–3 days to strip the server, freeze the engine into the browser, swap sprites, embed Monaco/CodeMirror editor. At that point you're 60% of the way to Option C anyway, so forking JsBattle isn't a clear win over building lean from scratch.
- **Verdict:** Great **reference implementation** for the API contract. Don't run it in production for the workshop — dormancy + no static deploy + offline demo site is too many small fires for a live event.

### Robocode Tank Royale (robocode-dev/tank-royale) — active, polished, but heavy

- **Repo:** https://github.com/robocode-dev/tank-royale
- **License:** Apache 2.0
- **Last commit:** v1.0.0 **May 3, 2026** — actively maintained.
- **Languages:** Java, Kotlin, C#, Python, TypeScript/JS bots all supported.
- **Visual:** Animated GIF in README is pretty solid — `web/docs/images/robocode-battle-anim.webp`.
- **Runtime:** **Java 11+ JVM required**, GUI app, bots talk to server via WebSocket. There's a "Tank Royale Viewer" web component, but the orchestrator is a desktop app.
- **Workshop fit:** **Poor.** Java install on every participant's corp laptop is a non-starter. Even if presenter runs the server, each participant still installs a bot SDK. Hard fail vs constraints.

### Hesselbom/bot-arena — actually browser-only and matches the brief

- **Repo:** https://github.com/hesselbom/bot-arena
- **Hosted demo:** bot-arena.netlify.com (per README).
- **Runtime:** "Runs fully in browser" — visit URL, write JS bot, battle. No backend needed once deployed.
- **Bot format:** JS, with example bots and option comments.
- **License / activity:** Not surfaced in README scrape; needs follow-up on `gh repo view` to confirm. Smaller project, low star count.
- **Workshop fit:** Strongest "as-is" candidate — but visual polish + character count + arena quality are unknowns. **Worth 30 minutes of evaluation before committing to Option C.** If the demo URL is up and the visual isn't embarrassing, fork it instead of building.

### Other JS battle frameworks

- **FightCode** (fightcodegame.com): historic JS robot battle game, mostly dead. No active maintenance.
- **Crobots / Robowar:** classic-era, no modern browser ports worth using.

---

## Track 2 — Multi-Agent Simulation Projects

### AI-Town (a16z-infra/ai-town)

- **Repo:** https://github.com/a16z-infra/ai-town
- **License:** MIT • **Stars:** 9.8k • Active
- **Visual:** Top-down 2D pixel art via PixiJS, 32×32 / 16×16 spritesheets — looks polished, recognizable.
- **Characters:** Defined declaratively in `data/characters.ts` — name, identity, plan, spritesheet. Easy to author 6 named characters from prompts.
- **Runtime requirements:** Node 18, npm, Python 3, **Convex backend** (cloud or self-hosted Docker), **LLM provider**. Ollama works locally for free.
- **The cost reality:** AI-Town characters reason via LLM each turn. With 6 agents in a 1.5h session and OpenAI/Together pricing it's affordable for one demo run; but the agents don't fight — they socialize. There's no battle/win-condition out of the box. You'd be replacing the simulation loop, the sprites, the world map (Tiled editor), and the win logic. That's 2 weeks minimum.
- **Workshop fit:** **Wrong shape.** AI-Town is a "watch agents have small-talk" demo. Forcing combat into it = full rewrite. Skip unless we pivot the workshop concept from "battle" to "characters socialize / improvise."

### Generative Agents (Stanford/Park et al.) and forks

- The original Smallville code (`joonspk-research/generative_agents`) is research-grade Python, requires significant LLM budget per run, and the visual is a static-ish town. Not workshop-ready.

### Conclusion for Track 2

Multi-agent LLM simulation is a **theme** that maps to Option B (AI-Town fork) only if we change the workshop goal from "battle" to "simulated company / improv scene." For the stated brief — bots that compete — Track 2 adds cost and complexity without giving us the visual finale we want.

---

## Track 3 — Claude-Code "Agent Office" Visualizations (the surprise)

This space exploded in **early 2026**. There are now ~8 well-built projects that visualize Claude Code subagents as pixel-art workers. **None of them run a battle**, but several are workshop-relevant as the "interlude visual" or as a hybrid finale where each participant's Claude Code session shows up as a character on a shared screen.

| Project | Stack | License | Last commit | Best use |
|---|---|---|---|---|
| **AgentFleet** (DBell-workshop/AgentFleet) | Phaser 3 + React + FastAPI/Tauri | **BSL-1.1** (commercial-restricted until 2030) | **Apr 3, 2026** (v0.1.1) | LLM-driven; not battle |
| **agents-in-the-office** (gukosowa) | Vue 3 + Tauri (Rust) + canvas | **MIT** | **Mar 2026**, 65 commits | Local desktop, cleanest hooks |
| **Pixel Agents** (pablodelucca/pixel-agents) | VS Code extension, canvas | **MIT** | **Apr 14, 2026** (v1.3.0) | One-laptop view |
| **claude-office** (paulrobello) | Python + JS | **MIT** | active | Boss + employee metaphor |
| **agent-office** (harishkotra) | Phaser.js + React + Ollama | **MIT** | active (small repo) | Editable agent personalities |
| **Outworked** | Electron + Anthropic SDK | open-source | Mar 2026 | Boss/employee orchestrator |
| **claw-empire** (GreenSheep01201) | local-first, multi-CLI | **Apache 2.0** | **Mar 12, 2026** (v2.0.4) | CEO orchestrating multiple CLIs |
| **agent-flow** (patoles) | node-graph viz | open | active | Debugging viz, not character-based |

### Critical finding for the workshop

**AgentFleet** initially looked like the perfect fit (Phaser 3, "Game Studio" template among 6 pre-built scenes, 20 pixel characters, character/agent UI panel, desktop DMG for non-technical install). Two showstoppers after a deep look:

1. **Behavior is LLM-prompt only**, not authored code. Each agent has a personality prompt + LLM choice. The "behavior" Claude Code would write for participants is *another LLM prompt* — not interesting, doesn't showcase Claude as a coding tool.
2. **No battle/competition mode.** Modes are group chat, direct message, roundtable discussion. No win condition.
3. **BSL-1.1 license** restricts commercial use until 2030 — fine for a free internal workshop but worth flagging.

So AgentFleet is **not** a turnkey replacement for a battle game. **But** its architecture (Phaser canvas + React overlay + agent panel) is a textbook pattern for Option C. If we're building anyway, study `DBell-workshop/AgentFleet/static/office/` for layout / UI ideas.

**agents-in-the-office** is the cleanest "watch live Claude Code agents" demo and is MIT. The hook system (Claude Code lifecycle hooks → JSON event files → file-watcher → tile-map driver) is reusable. **But it's a Tauri desktop app** — only the operator sees it. No web view for an audience. So it could power a "look behind the scenes" interlude on the presenter's screen, but it's not the finale.

### Verdict for Track 3

Use as **inspiration and B-roll**, not as the load-bearing finale:
- Run `agents-in-the-office` (or Pixel Agents) on the presenter machine. During the coding round, project it on a side screen so participants see Claude Code agents materialize as pixel workers — that's the "WAU about Claude Code itself" beat.
- Keep the **arena finale** as a separate purpose-built thing (Option C).

This is the hybrid I think wins.

---

## Track 4 — Educational Coding-Game Frameworks

- **CodeCombat / Ozaria:** MIT-licensed (codecombat.com client side); browser-based; runs Python/JS in sandbox. **Wrong genre** — it's solo puzzles, not bot-vs-bot battle. Skip.
- **Screeps Arena & Screeps World:** Active in 2025–2026 (Arena 1.0.6 in Dec, World relaunch in 2026). Strong programming-game DNA, JS bots, good visuals. **But Steam-only, paid (~$15)**, requires Steam install per participant. Hard fail for corp-laptop / no-install constraint.
- **WarriorJS** (`olistic/warriorjs`): Solo dungeon, JS warrior. Single player. Wrong genre.
- **MIT Battlecode:** Annual contest framework, Java-heavy, not workshop-ready in 1.5h.

Track 4 is dead end for a battle finale. CodeCombat/Screeps confirm the desire for the shape but aren't deployable for our case.

---

## Track 5 — Quick Prototyping Tools

The realistic 1–2-day path:

| Framework | Why it fits | Notes |
|---|---|---|
| **Phaser 3** + TS starter | Mature, AgentFleet uses it, dozens of tank/arena clones | `yandeu/phaser-project-template` (MIT, build → static `dist/`); `panietoar/phaser-tank` for tank sprites + physics reference |
| **KAPLAY (kaboom successor)** | Tiny API, fast to learn, browser-native | `kaplayjs/kaplay`, has KAPLAYGROUND web editor with 90+ examples — great for sprite/animation prototype, less ideal for physics/collisions vs Phaser |
| **PixiJS** | What AI-Town uses, gorgeous rendering | More work than Phaser since Pixi is rendering-only (no physics, no scene manager); skip unless we want premium polish |
| **p5.js / plain Canvas** | Zero-tooling | Workshop-ugly visuals, big build time vs Phaser |

### Starter templates worth forking (in priority order)

1. **panietoar/phaser-tank** — Battle City tribute in Phaser. Tank sprites, movement, shooting, walls. Closest skeleton to "bot arena."
2. **yandeu/phaser-project-template** — MIT, TypeScript, webpack, `npm run build` → static `dist/`. Use as the boilerplate.
3. **DBell-workshop/AgentFleet** `static/office/` — read-only reference for office UI overlay style (BSL — don't lift code, just patterns).

### Minimum-viable arena — what we'd build in 3 days

```
arena/
├── index.html              # Canvas + side panel for log
├── src/
│   ├── main.ts             # Phaser game init
│   ├── arena.ts            # 800×600 top-down, walls, scoring
│   ├── tank.ts             # Tank entity (position, hp, radar)
│   ├── runner.ts           # Web Worker per bot, postMessage protocol
│   ├── api.ts              # tank.init(), tank.loop(), state/control schema
│   └── ui/
│       ├── lobby.ts        # 6 character slots, paste-bot textarea each
│       └── battle.ts       # GO! button, leaderboard
├── characters/             # 6 chosen sprites (8 frames walk, fire anim)
└── dist/                   # static output, deploy anywhere
```

Bot API surface (mirror JsBattle so Claude already knows it):
- `state`: `{ x, y, angle, hp, radar: { enemy?, ally?, wall? }, collisions: {...} }`
- `control`: `{ THROTTLE, TURN, GUN_TURN, SHOOT, RADAR_TURN }`

Each `tank.loop` runs in its own `Worker`. The main game thread aggregates worker outputs at 30 Hz, simulates physics, sends back state. **This is the security model**: untrusted participant code can't escape the worker. JsBattle uses the same model — copy it.

---

## Track 6 — Top Recommendation: Option C with Track 3 Bolt-on

### Compared options recap

| Option | Effort | Visual | Browser-only | LLM cost | Risk |
|---|---|---|---|---|---|
| **A. JsBattle as-is** | 1d set-up + 1d sprites | Dated 2019 | Needs Node server | $0 | Dormant repo, demo offline, server install per host |
| **B. AI-Town fork → battle** | 10–14d | Excellent | Convex backend + LLM | High | Wrong shape, way over budget |
| **C. Custom Phaser arena** ⭐ | **3d build + 1d polish + 1d dry-run** | Customizable to brand | Yes (static `dist/`) | $0 | We own the bugs |
| **D. Claude Squad / claude-flow as the show** | 1d | Terminal split panes / web graph | Mixed | High | Not a battle, not WAU for QAs |
| **E. Hybrid C + Track 3 interlude** ⭐⭐ | C effort + 30min setup | Excellent | Yes | $0 for arena, optional API for interlude | Best WAU |

### Recommended: Option E (Hybrid)

**The arena = Option C custom Phaser.** The Claude Code beat = `agents-in-the-office` running locally on presenter laptop, projected as B-roll during the coding round.

### Total realistic effort

- **Day 1:** Fork `yandeu/phaser-project-template`. Drop in 6 chosen character sprites (the existing personas from `RESEARCH_2026-05-07_archetypes.md`). Static walls, basic movement.
- **Day 2:** Web Worker bot runner + JsBattle-compatible API surface. One bundled "dummy" bot proven to fight.
- **Day 3:** Lobby UI (6 slots, paste/upload bot code per slot). Battle UI (HP bars, kill-feed, "GO!" button, leaderboard at end). Sounds optional.
- **Day 4:** Polish — explosions, camera, music. Build → `dist/`. Deploy to Render static site (already in this repo's stack).
- **Day 5:** Dry-run with 2 colleagues. Fix what breaks. Set up `agents-in-the-office` on presenter laptop.

### What participants do on workshop day

1. **Minute 0–10:** Demo. Presenter shows the arena with 2 pre-built bots fighting. Big WAU.
2. **Minute 10–20:** Hand out the bot template + Claude Code prompt sheet. They open Claude Code on their laptop, give it the spec + their character profile, ask Claude to write a bot.
3. **Minute 20–60:** Iterate. Paste bot into arena lobby web UI, run a 1v1 against the dummy, refine. Side screen shows `agents-in-the-office` so the Claude Code activity is visible as pixel workers — meta-WAU: "your bot is being written by *that* worker right there."
4. **Minute 60–80:** Six-bot royale battle on the main screen. Full character names + sprites. Leaderboard.
5. **Minute 80–90:** Q&A, takeaways. Each participant gets a link to the arena to take their bot home.

### What we inherit vs build

**Inherit:**
- Phaser 3 engine, scene manager, tween/anim system, arcade physics
- TypeScript + webpack starter (`yandeu/phaser-project-template`)
- JsBattle's bot API contract (well-known to Claude, easy to write)
- Web Worker sandbox pattern (standard browser API)
- Render static-site deploy (already wired in this project)
- `agents-in-the-office` for the side-screen interlude

**Build:**
- Lobby/battle UI (~300 LOC)
- Worker runner protocol (~150 LOC)
- 6 character configs + sprite pipeline (asset work, low code)
- Leaderboard / scoring (~100 LOC)

### Risks

| Risk | Severity | Mitigation |
|---|---|---|
| Web Worker performance with 6 bots × 30 Hz | Med | Pin tick to 20 Hz; throttle worker postMessage; tested in JsBattle for 5+ years |
| Participant bot has infinite loop and freezes worker | Med | Wrap each `tank.loop` in `Promise.race` with 50ms timeout; auto-kill bot, score 0 |
| Sprites licensing | Low | Use OpenGameArt CC0 packs; pick 6 distinct ones for the personas |
| Browser compat (corp IE/old Edge?) | Low | Target Chrome 100+ / Safari 15+; QAs at a gaming company will have modern browsers |
| Static site host blocked by corp | Low-med | Have a fallback: presenter laptop runs `python -m http.server 8080`, share LAN URL via QR code |
| `agents-in-the-office` doesn't install in time | Low | It's a "nice to have" interlude. If Tauri build is fiddly, fall back to Pixel Agents in VS Code, or skip the interlude entirely |
| Claude Code rate limits during workshop | Med | Each participant uses their own Anthropic key; Pro subscription enough for 1.5h |

### Sample repos to clone or learn from

- **Engine boilerplate:** https://github.com/yandeu/phaser-project-template
- **Tank reference:** https://github.com/panietoar/phaser-tank
- **Bot API contract reference:** https://github.com/jamro/jsbattle (clone for the docs in `packages/jsbattle-docs/docs/manual/ai_script.html`, the API is gold)
- **JsBattle bundled tank examples (proof the API is teachable):** https://github.com/jamro/jsbattle/blob/master/packages/jsbattle-docs/docs/manual/bundled_tanks.md
- **AgentFleet for office UI patterns:** https://github.com/DBell-workshop/AgentFleet (BSL-1.1, read-only)
- **Side-screen interlude:** https://github.com/gukosowa/agents-in-the-office (MIT, Tauri)
- **Fallback turnkey if Option C runs out of time:** https://github.com/hesselbom/bot-arena (browser-only, Netlify-hosted; needs evaluation)

---

## Quick-Decision Cheat Sheet

- **Want zero code, accept weak visual:** evaluate `hesselbom/bot-arena` for 30 min today. If demo URL is up and visual isn't embarrassing → use as-is, add 6 character names + sprites in 1 day.
- **Want the strongest WAU + control:** Option C (custom Phaser arena) + Option E hybrid (Track 3 interlude). 5 working days.
- **Want maximum production value, will skip the "battle" framing:** AI-Town fork with characters that interact instead of fight. Drops "competition" but gives a Smallville-style finale. 10–14 days. Probably too long.
- **Don't have 5 days:** Use JsBattle locally on the presenter laptop, accept dated visuals, give every participant a copy of the bundled `lib/tank.js` + the API doc in their Claude Code session prompt. 1.5 days but feels less polished.

---

## Sources

- [jamro/jsbattle (GitHub)](https://github.com/jamro/jsbattle)
- [JsBattle bundled tank examples](https://github.com/jamro/jsbattle/blob/master/packages/jsbattle-docs/docs/manual/bundled_tanks.md)
- [JsBattle AI Script docs](https://jsbattle.jmrlab.com/docs/manual/ai_script.html)
- [robocode-dev/tank-royale](https://github.com/robocode-dev/tank-royale)
- [hesselbom/bot-arena](https://github.com/hesselbom/bot-arena)
- [a16z-infra/ai-town](https://github.com/a16z-infra/ai-town)
- [DBell-workshop/AgentFleet](https://github.com/DBell-workshop/AgentFleet)
- [gukosowa/agents-in-the-office](https://github.com/gukosowa/agents-in-the-office)
- [pablodelucca/pixel-agents](https://github.com/pablodelucca/pixel-agents)
- [paulrobello/claude-office](https://github.com/paulrobello/claude-office)
- [harishkotra/agent-office](https://github.com/harishkotra/agent-office)
- [GreenSheep01201/claw-empire](https://github.com/GreenSheep01201/claw-empire)
- [patoles/agent-flow](https://github.com/patoles/agent-flow)
- [smtg-ai/claude-squad](https://github.com/smtg-ai/claude-squad)
- [ruvnet/claude-flow → ruflo](https://github.com/ruvnet/claude-flow)
- [yandeu/phaser-project-template](https://github.com/yandeu/phaser-project-template)
- [panietoar/phaser-tank](https://github.com/panietoar/phaser-tank)
- [Screeps Arena (Steam)](https://store.steampowered.com/app/1137320/Screeps_Arena/)
- [olistic/warriorjs](https://github.com/olistic/warriorjs)
- [kaplayjs/kaplay](https://github.com/kaplayjs/kaplay)
- [CodeCombat](https://codecombat.dexecure.net/home)
