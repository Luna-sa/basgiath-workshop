# Dragon Arena v2 — Design Spec

**Date:** 2026-05-11
**Workshop:** Basgiath Mock Battle, 2026-05-13 (~40 QA-engineer participants)
**Author:** Кай (для Насти)
**Status:** Spec — ready to chunk into implementation tasks
**Lives at:** `public/dragon-arena.html` (single-file Phaser 3 game) + `src/pages/Arena.jsx` (iframe wrapper) + `src/api/submissions.js` (persistence)

---

## 0. Why a redesign

Current arena:
- 6 player-bots in one melee. Whoever submits last "wins" by overwriting the slot.
- Each bot writes one `tick({me, stars, walls, sky}) -> {angle, throttle}` plus a one-shot `me.summonSignet()` easter egg.
- Score range per round: roughly 0-18. With 14 stars (2 fire = +3, 12 regular = +1) the theoretical max is 18, but bots cluster at 4-8 because greedy nearest-star is a strong attractor.
- Personas are pure cosmetics + minor flight-stat tuning (`maxSpeedMul`, `turnSmoothing`). Claude has nothing persona-specific to lean on.
- One final battle on the projector. Winner = whoever happens to nail the last submit.

Anastasia's new model:
1. **Solo runs vs 5 AI rival dragons** — no participant-vs-participant during runs.
2. **10 runs per participant.** Score per run = stars (+modifiers). **Sum of 10 = total.**
3. **Database persists every run.** Leaderboard ranks total.
4. **One Arena Champion** at workshop close.
5. **Game must support enough depth** that 40 participants × 10 runs produce a *visible* spread, not a 12-way tie at 92.

The core design problem: **current mechanics are too shallow for sum-scoring to distinguish strategies.** Greedy nearest-star is near-optimal; persona has no leverage; 10 runs of greedy = 10× the same number ± RNG noise.

The fix is structural, not numerical: add **dimensions of strategy** (positioning, timing, prediction, sacrifice, combo, route-planning, persona-coded play) so that *the function Claude writes* visibly diverges across participants.

---

## 1. New Game Mechanics

22 mechanics. Each has the API surface, difficulty for Claude, score impact, and easter-egg potential. **Bold = recommended for v2 MVP** (one-day implementation). Italic = stretch / full vision.

### 1.1 Spatial & physics

| # | Name | Description | API surface (added to `tick` state / return) | Difficulty | Score impact | Easter egg? |
|---|------|-------------|---------------------------------------------|------------|--------------|-------------|
| **1** | **Wind currents** | 4-8 invisible-by-default wind cells across the map. Each tick adds `wind.dx, wind.dy` to dragon velocity. Direction rotates slowly. | `state.wind: [{x,y,r,angle,strength}]` (visible-on-radar). Smart bot reads cells along its path and either rides them (+speed) or compensates angle. | Medium | High | Yes — Tairn Wind Reader cheat |
| **2** | **Star rarity tiers** | gold = 5pts, silver = 2pts, bronze = 1pt, **fire = 8pts** (rare, drifts). Visible tier on star object. | `state.stars[i].tier: 'gold'\|'silver'\|'bronze'\|'fire'`, `.value: number` | Easy | High | — |
| **3** | **Wall-hugging speed bonus** | Flying within 30px of a wall edge but not touching = +12% speed for that tick (rewards positional courage). | `state.me.nearWall: {wallId, dist}\|null` | Medium | Med | — |
| **4** | **Edge-of-map slipstream** | Fly within 25px of arena boundary = +8% speed but +1 collision risk if angle drifts. | `state.me.nearEdge: 'top'\|'bottom'\|'left'\|'right'\|null` | Medium | Med | — |
| 5 | *Gravity wells* | 1-2 invisible attractors per map. Pull dragon toward them, harder to escape at low throttle. | `state.gravWells: [{x,y,strength}]` | Medium | Med | — |
| **6** | **Vertical-axis levels (altitude)** | Dragon has `me.altitude: 0\|1\|2` (low/mid/high). Move up/down costs 1 action. Some stars only reachable at altitude 2, walls only collide at altitude 0-1. | `state.me.altitude`, return `{altitudeDelta: -1\|0\|+1}` | Hard | High | — |

### 1.2 Energy / fuel

| # | Name | Description | API surface | Difficulty | Score impact | Easter egg? |
|---|------|-------------|-------------|------------|--------------|-------------|
| **7** | **Boost meter** | Separate from fuel. Charges +1/sec passively, +5 on star pickup. Spend 20 to activate **1.5s boost** (2× speed). Return `{boost: true}` activates if available. | `state.me.boost: number` (0-30), return `{boost: boolean}` | Easy | High | — |
| **8** | **Stall mechanic** | Throttle < 0.15 for 30+ consecutive ticks = "stall" — dragon drops 1 altitude or loses 5% boost. Forces active play. | `state.me.stallTicks: number` | Easy | Low (anti-camp) | — |
| 9 | *Fuel regen zones* | 2 fixed "thermal" zones (visible halo circles) that refuel +3/tick while inside. | `state.thermals: [{x,y,r}]` | Easy | Low | — |

### 1.3 Combat / interaction

| # | Name | Description | API surface | Difficulty | Score impact | Easter egg? |
|---|------|-------------|-------------|------------|--------------|-------------|
| **10** | **Fire-breath attack** | Cone, 100px range, costs 15 boost. Knocks any rival in cone backward 40px and **drops one star they're carrying** (see #11). 1.5s cooldown. | `state.me.canBreathe: boolean`, return `{breathe: {angle: number}}` | Medium | Med | — |
| **11** | **Carry-stars** | Stars don't bank immediately. Dragon carries up to **3 stars** at once. Banked when dragon enters one of 2 "nest" zones. Killed/breath-knocked → drop all carried. | `state.me.carrying: [{tier,value}]`, `state.nests: [{x,y,r}]` | Hard | High | — |
| **12** | **Dragon-to-dragon collision (no damage)** | Two dragons within 12px cause a soft bounce. Tactical: blocker rival can intercept lanes. | `state.rivals: [{x,y,angle,vx,vy,archetype}]` | Medium | Med | — |
| 13 | *Slipstream-draft* | Flying directly behind another dragon (within 40px, ±15° angle) = +15% speed. Use rivals as wind shields. | `state.me.drafting: dragonId\|null` | Hard | Med | Yes — "Convoy" achievement |

### 1.4 Time / phase

| # | Name | Description | API surface | Difficulty | Score impact | Easter egg? |
|---|------|-------------|-------------|------------|--------------|-------------|
| **14** | **Day/Night cycle** | 60s round = 40s day + 20s night. At night, regular stars dim (invisible to greedy bots that filter by `visible`), fire stars **glow brighter** and double value (+16). | `state.phase: 'day'\|'night'`, `state.stars[i].visible: boolean` | Medium | High | — |
| **15** | **Star spawn waves** | Stars don't all exist at t=0. Spawn in 4 waves: t=0, t=15s, t=30s, t=45s. Wave 4 includes 1 guaranteed gold + 1 fire. Smart bot saves boost for wave 4. | `state.starsRemaining: number`, `state.nextWaveAt: tick` | Medium | High | — |
| 16 | *Hot-zone bounty* | Every 15s a 100px-radius "bounty zone" appears. Any star collected inside = 2× value. Lasts 8s. | `state.bountyZone: {x,y,r,expiresAt}\|null` | Easy | Med | — |

### 1.5 Combo / chain

| # | Name | Description | API surface | Difficulty | Score impact | Easter egg? |
|---|------|-------------|-------------|------------|--------------|-------------|
| **17** | **Combo multiplier** | Collect stars within 2.5s of each other → combo counter. ×2 at 3-chain, ×3 at 5-chain, ×4 at 8-chain. Resets on wall hit or 2.5s idle. | `state.me.combo: number`, `state.me.comboExpiresAt: tick` | Medium | Very High | — |
| **18** | **Constellation bonus** | 3 collected stars whose positions form a line (within 15° tolerance) = +10 bonus. Encourages planning. | `state.me.lastThreeStars: [{x,y}]` | Hard | Med | Yes — "Stargazer" |
| 19 | *Color-match chain* | 3 same-tier stars in a row = +5 each. Mix tiers = neutral. | (derivable from `me.lastTier` history) | Easy | Low | — |

### 1.6 Easter eggs

| # | Name | Description | API surface | Difficulty | Score impact | Easter egg? |
|---|------|-------------|-------------|------------|--------------|-------------|
| **20** | **Signet** (kept from v1, upgraded) | One-time per **run**: `me.summonSignet()` triggers persona-specific buff for 4s. Violet=invisibility to rivals (no breath/collision), Xaden=triple breath, Imogen=auto-aim breath, Rhiannon=draft from anywhere, Ridoc=double pickup radius, Liam=fuel never drops. | call `me.summonSignet()` once. Bot returns `{signet: true}` instead. | Easy | High | Yes |
| **21** | **Persona-shape star formation** (full easter egg) | If bot collects 5 stars in sequence matching a hidden pattern keyed to their persona (e.g., Violet = diagonal NE→SW, Xaden = wide horizontal sweep, Imogen = tight cluster), unlock **+50 run bonus** and shimmer VFX. The hint lives in the persona description, not the docs. | (purely derived — no API change) | Hard | Very High | Yes (core) |
| 22 | *Konami sequence* | If bot returns `{angle: 1337}` exactly once in the first 10 ticks, "Andarna mode" — fire stars worth 4× for that run. | return `{angle: 1337}` | Easy | High | Yes |

---

### 1.7 Recommended v2 MVP set (one-day implementation)

Pick the **bolded** rows. 12 mechanics, layered so each adds a strategic decision Claude can write toward:

1. **Star tiers** (gold/silver/bronze/fire) — instant score-spread
2. **Boost meter** — first non-trivial resource
3. **Combo multiplier** — rewards routing
4. **Wind currents** — rewards reading state
5. **Day/Night cycle** — rewards timing
6. **Star spawn waves** — rewards patience
7. **Fire breath** — rewards aggression
8. **Carry-stars + nests** — rewards risk management
9. **Wall-hugging bonus** — rewards positional skill
10. **Stall mechanic** — anti-camp
11. **Persona-shape easter egg** — gives Claude something secret per persona
12. **Upgraded signet** — gives Claude something flashy per persona

Cut for stretch: altitude, gravity wells, slipstream-draft, edge slipstream, fuel zones, bounty zones, color-match, constellation, Konami.

---

## 2. Bot API v2 — Full specification

### 2.1 Function signature

```js
/**
 * Called every tick (20 ticks/sec, 1200 ticks per 60s run).
 * Total time budget per tick: 8ms (enforced by Web Worker timeout).
 * Memory across ticks: use closure variables or `me.memory` (persisted dict, 4KB cap).
 *
 * @param {GameState} state
 * @returns {Action}
 */
function tick(state) { ... }
```

### 2.2 GameState shape

```ts
type GameState = {
  // ─── Self ───
  me: {
    // Position & physics
    x: number,                       // 0..arena.width
    y: number,                       // 0..arena.height
    vx: number,                      // current velocity X
    vy: number,                      // current velocity Y
    angle: number,                   // current heading 0..360
    speed: number,                   // |v| in px/tick

    // Resources
    fuel: number,                    // 0..100 — burned by throttle
    boost: number,                   // 0..30 — for boost & breath
    score: number,                   // banked score (carried stars NOT included)

    // State
    persona: 'violet'|'xaden'|'rhiannon'|'ridoc'|'liam'|'imogen',
    carrying: Array<{tier:'gold'|'silver'|'bronze'|'fire', value:number}>,
    carryingValue: number,           // sum of carried (convenience)
    combo: number,                   // current chain length
    comboExpiresAt: number,          // tick index — combo resets after
    stallTicks: number,              // consecutive low-throttle ticks
    signetUsed: boolean,             // can't summon twice
    signetActiveUntil: number,       // tick — 0 if inactive

    // Hint flags (precomputed for convenience)
    nearWall: { wallId:number, dist:number } | null,
    nearEdge: 'top'|'bottom'|'left'|'right' | null,
    inNest:   number | null,         // nest index if inside one

    // Persistent memory across ticks
    memory: Record<string, any>,     // your scratch space (4KB)
  },

  // ─── World ───
  stars: Array<{
    id: number,
    x: number, y: number,
    tier: 'gold' | 'silver' | 'bronze' | 'fire',
    value: number,                   // 1 / 2 / 5 / 8 (16 at night for fire)
    visible: boolean,                // false during night for non-fire
    bornAtTick: number,              // when it spawned
  }>,

  walls: Array<{ x:number, y:number, r:number, id:number }>,
  nests: Array<{ x:number, y:number, r:number, id:number }>,
  wind:  Array<{ x:number, y:number, r:number, angle:number, strength:number }>,

  rivals: Array<{
    id: 'tairn'|'sgaeyl'|'andarna'|'feirge'|'codagh',
    archetype: 'greedy'|'cautious'|'aggressive'|'blocker'|'chaotic',
    x: number, y: number, angle: number,
    vx: number, vy: number,
    carryingCount: number,           // (don't reveal contents — anti-info-leak)
    alive: boolean,
  }>,

  // ─── Round meta ───
  arena: { width:number, height:number },
  tick: number,                       // current tick index, 0..1199
  ticksRemaining: number,             // 1199..0
  phase: 'day' | 'night',
  nextWaveAt: number,                 // tick of next star wave (or -1)
  starsRemaining: number,             // count of uncollected on board

  // ─── Hidden / discoverable ───
  // Not documented in the API panel. Only revealed in persona-specific lore.
  // (Bot can still READ them — they're in the state object.)
  hiddenPattern?: { hint: string },   // persona-shape easter egg
}
```

### 2.3 Action shape (return value)

```ts
type Action = {
  // ── Required (one of) ──
  angle?: number,                    // 0..360 deg, target heading
  throttle?: number,                 // 0..1, motion intensity

  // ── Optional resource actions (free if available) ──
  boost?: boolean,                   // spend 20 boost → 1.5s at 2× speed
  breathe?: { angle: number },       // spend 15 boost → fire cone at heading
  signet?: true,                     // call once per run

  // ── Internal-only easter eggs ──
  // Sending angle:1337 in first 10 ticks → Andarna mode
}
```

**Action budget per tick:** 1 movement (angle+throttle), up to 2 optional actions (boost + breathe, or boost + signet). Sending all 3 optional actions costs all resources — by design participants must pick.

**Invalid actions silently fail** — no crash. Bot that throws → frozen at last action for 5 ticks, then resumed. **3 crashes in 10 ticks → bot disabled for the rest of the run** (score still counts, just frozen).

### 2.4 Compatibility note

The current v1 signature `tick({me, stars, walls, sky}) -> {angle, throttle}` is a **strict subset**. v1 bots run unchanged but ignore all new mechanics → low score → motivation to learn v2 API.

---

## 3. The Five Rival Dragons

Player flies their persona (Violet/Xaden/Rhiannon/Ridoc/Liam/Imogen). The five rivals are **fixed AI**, named from the Fourth Wing lore but mechanically distinct.

### 3.1 Tairn — the Greedy

> *Largest dragon in the kingdom. He sees a star. He goes to it. He repeats.*

- **Behaviour:** nearest-star greedy, ignores walls except for last-second avoidance.
- **Strength:** baseline. Will out-score lazy players.
- **Weakness:** never uses boost, never breathes, eats wall taxes on long paths. Beat him by **routing through combos** or **denying his closest star**.
- **Pseudocode:**
  ```js
  function tairnTick(state) {
    const targets = state.stars.filter(s => s.visible && !state.me.carrying.find(c => c.id === s.id))
    const t = targets.reduce((a, b) =>
      dist(state.me, a) < dist(state.me, b) ? a : b
    , targets[0])
    return { angle: angleTo(state.me, t), throttle: 0.85 }
  }
  ```

### 3.2 Sgaeyl — the Cautious

> *Refuses to engage unless the path is clean.*

- **Behaviour:** evaluates star ROI = `value / (dist + walls_in_path * 50)`. Picks highest. Tops up fuel at thermals/regen.
- **Strength:** clean lines, low wall hits, predictable.
- **Weakness:** **slow first move** (spends ~10 ticks planning). Beat her by **rushing wave-1 stars** or **boost-ambushing her with breath**.
- **Pseudocode:**
  ```js
  function sgaeylTick(state) {
    if (state.me.fuel < 40) return { angle: angleTo(state.me, nearestThermal(state)), throttle: 0.6 }
    const scored = state.stars
      .filter(s => s.visible)
      .map(s => ({ s, score: s.value / (dist(state.me, s) + wallsBetween(state.me, s) * 50) }))
      .sort((a, b) => b.score - a.score)
    if (!scored.length) return { angle: state.me.angle, throttle: 0.1 }
    return { angle: angleTo(state.me, scored[0].s), throttle: 0.7 }
  }
  ```

### 3.3 Andarna — the Aggressive

> *Spits fire first. Plans later.*

- **Behaviour:** if any rival within 120px → breathe. If boost full → activate. Otherwise greedy.
- **Strength:** disrupts everyone, scatters carried stars.
- **Weakness:** **burns boost recklessly**, low late-game output. **Stay outside her 120px bubble** during the first 30s and pick up scraps. Or **out-aggress her** — her cooldown leaves a 1.5s window.
- **Pseudocode:**
  ```js
  function andarnaTick(state) {
    const enemy = nearestRival(state)
    if (enemy && dist(state.me, enemy) < 120 && state.me.boost >= 15) {
      return { angle: angleTo(state.me, enemy), throttle: 0.8, breathe: { angle: angleTo(state.me, enemy) } }
    }
    if (state.me.boost >= 25) {
      return { angle: angleTo(state.me, nearestStar(state)), throttle: 1, boost: true }
    }
    return { angle: angleTo(state.me, nearestStar(state)), throttle: 0.9 }
  }
  ```

### 3.4 Feirge — the Blocker

> *Doesn't collect. Stands between you and what you want.*

- **Behaviour:** finds the highest-value star, parks 60px from it on the line between it and *the lead-scoring dragon* (you, mostly).
- **Strength:** denies the best star. Even if you boost past, you've wasted a window.
- **Weakness:** **never collects.** Bait him with a fake target then loop. Or **breathe him aside** to clear the lane. Or accept the trade — let him block gold, you stack bronze combos.
- **Pseudocode:**
  ```js
  function feirgeTick(state) {
    const leader = state.rivals.concat([state.me])
      .sort((a, b) => b.score - a.score)[0]
    const target = state.stars
      .filter(s => s.visible)
      .sort((a, b) => b.value - a.value)[0]
    if (!target) return { angle: state.me.angle, throttle: 0 }
    const blockX = (leader.x + target.x) / 2
    const blockY = (leader.y + target.y) / 2
    return { angle: angleTo(state.me, { x: blockX, y: blockY }), throttle: 0.6 }
  }
  ```

### 3.5 Codagh — the Chaotic

> *Reads the wind. Bets on patterns. Loses some, wins some.*

- **Behaviour:** picks a random target every 4 seconds, but boosts when wind aligns with target heading. Sometimes brilliant, sometimes useless.
- **Strength:** **wind-rider** — fast across the map when conditions favour.
- **Weakness:** unpredictable, often wastes wave-4 stars. Beat him by **playing the late game cleanly** — he'll have burned through resources.
- **Pseudocode:**
  ```js
  function codaghTick(state) {
    state.me.memory.target ??= randomStar(state)
    if (state.tick % 80 === 0) state.me.memory.target = randomStar(state)
    const t = state.me.memory.target
    const heading = angleTo(state.me, t)
    const wind = windAt(state, state.me)
    const aligned = wind && Math.abs(wind.angle - heading) < 30
    return {
      angle: heading,
      throttle: aligned ? 1 : 0.6,
      boost: aligned && state.me.boost >= 20 ? true : false,
    }
  }
  ```

### 3.6 Why these five

Each rival is **beatable by exactly one new mechanic**:
- Tairn → combos / wave-timing
- Sgaeyl → wave-1 rush / breath
- Andarna → cooldown windows / stay out of range
- Feirge → fake target / breath-clear
- Codagh → late-game discipline

This gives Claude **five distinct lessons** to teach the participant when writing their bot. A participant who fights all five well = an Arena Champion.

---

## 4. Persona-aware Strategy Hints

These are **system-prompt fragments** the participant pastes into Claude Code along with their persona, telling Claude how to bias the bot. Each persona's hint is in the participant's Claude Code system prompt (or surfaced in the docs panel on the arena page if they ask "what's the play for my persona").

### 4.1 Violet — Patient Strategist

> *Reads the map before she moves. Avoids brute force. Wins by knowing where to be in 5 seconds.*

```
PERSONA: Violet
PRIORITY: positioning > collection > combat

When writing tick():
- Don't move toward stars in the first 5 ticks. Read the map, identify the
  3-star route with the highest summed value and lowest wall-path cost.
- Save signet for late game — Violet's invisibility lets you slip past
  Feirge's blocking line OR steal a fire star from Andarna.
- Always have a 2nd target queued in me.memory.plan. If the 1st gets
  collected by a rival, pivot immediately, don't replan.
- Combo target = 5-chain. Reset only if next star >+5 value.
- Avoid Andarna's 120px bubble. She wastes boost when threatened —
  let her chase ghosts.

The persona-shape easter egg is a DIAGONAL line of 5 stars NE → SW.
If your first 5 collections trace that vector, watch for the +50.
```

### 4.2 Xaden — Aggressive Risk-Seeker

> *Goes fast. Breathes first. Carries 3 stars and dares you to take them.*

```
PERSONA: Xaden
PRIORITY: speed > carrying > combat > combo

When writing tick():
- Activate boost the moment it reaches 20. Don't hoard.
- Fly toward nests when carrying ≥2 stars. Bank fast, then re-pump.
- Use breath every cooldown. Even on empty cones — denies rivals.
- Hug walls (within 30px) for the +12% bonus. Xaden's persona-tuned
  turn-smoothing 0.88 means wide arcs — but his +15% top speed eats
  the risk.
- Ignore Sgaeyl. She's slow. Race her to wave-1 stars.
- If Feirge blocks gold → breathe him, take the gold, you'll come out
  ahead on the boost-for-points trade.

Signet: triple-breath = 3 cone breaths in 4s. Save for crowded mid-game.

The persona-shape easter egg is a wide HORIZONTAL SWEEP — 5 stars from
near-left edge to near-right edge. If your first 5 trace that line,
+50 + shimmer.
```

### 4.3 Rhiannon — Balanced Tactician

> *Adapts. Counter-picks. Reads what rivals are doing and does the opposite.*

```
PERSONA: Rhiannon
PRIORITY: adaptive — depends on rival behaviour

When writing tick():
- Every 100 ticks (5 sec), classify each rival by archetype:
  * Greedy (Tairn) → race him to nearest stars, or yield and pick scraps
  * Aggressive (Andarna) → maintain >130px distance
  * Blocker (Feirge) → fake a target, go elsewhere
- Combo target = 3-chain (safer than Xaden's 5).
- Carry max 2 stars (vs Xaden's 3). Cash in faster.
- Use signet (draft-from-anywhere) when 2+ rivals are clustered —
  free speed boost.
- Day phase: prefer silver/gold. Night phase: hunt fire stars.

The persona-shape easter egg is a TRIANGLE — 3 stars forming an
equilateral triangle (side 100-200px). If your first 3 form one, +50.
```

### 4.4 Ridoc — Playful Opportunist

> *Plays for fun. Picks weird routes. Wins by being unpredictable.*

```
PERSONA: Ridoc
PRIORITY: pickup-radius abuse > chaotic routing > combo

When writing tick():
- Signet (double pickup radius) — activate at t=10s, lasts 4s.
  Run through dense star clusters during signet for 5-7 picks in 4s.
- Don't aim for highest-value stars. Aim for DENSEST CLUSTERS — they
  give combo + signet synergy.
- Use wind cells aggressively even if direction is suboptimal —
  the +speed beats the slight detour.
- At wave-4 spawn, sprint toward map centre — that's where Ridoc
  thrives in chaos.

The persona-shape easter egg is a ZIG-ZAG — 5 stars alternating
left-right-left-right-left within a 200px vertical band. Random
routing often hits it accidentally. +50 + shimmer.
```

### 4.5 Liam — Steady Guardian

> *Reliable. Won't lose to RNG. Beats you by being there for all 10 runs without crashing.*

```
PERSONA: Liam
PRIORITY: consistency > optimisation

When writing tick():
- Defensive coding. Never let a single run score under 30.
- Always have ≥40 fuel. Refuel at the first thermal you see if below.
- Wall-collision avoidance is HARD — predict 5 ticks ahead, slow if
  the path crosses a wall radius.
- Boost only when sure (combo about to expire OR fire star within
  150px). No speculative boosts.
- Signet (fuel never drops) — activate at t=45s, lets you full-throttle
  for the last 15s without conserving.
- Don't bother with breath. Liam doesn't fight.

The persona-shape easter egg is a SQUARE — 4 stars at near-corner positions
of a square (200-300px side). +50 if your first 4 collections form one.
```

### 4.6 Imogen — Knife-Quick Assassin

> *Auto-aimed breath. Sharpest turns in the kingdom. Doesn't collect — destroys carries.*

```
PERSONA: Imogen
PRIORITY: breath > carrying-disruption > collection

When writing tick():
- Track which rival is leading. Aim breath at them.
- Imogen's signet (auto-aim breath) is game-changing — activate when
  3 rivals are within 200px. You'll knock all 3 if cone is wide enough.
- Use her sharpest-turn stat (0.72 smoothing): you can REVERSE direction
  in 4 ticks. Lure rivals into chase, then knife back to a star they
  abandoned.
- Don't worry about long-haul combos. Imogen's combo target = 2-chain.
- Carry max 1 star — minimise loss risk if YOU get breathed.
- Hunt Andarna's cooldown windows (1.5s after she breathes).

The persona-shape easter egg is a TIGHT CLUSTER — 3 stars within a
60px circle, all collected within 2 seconds. +50 if hit.
```

---

## 5. Scoring & Anti-Tie Mechanisms

### 5.1 Why ties happen now

- Score range 0-18 per round → 10 runs → max 180, realistic ~80-130.
- Greedy nearest-star is dominant strategy → most submissions cluster around 95-105.
- No bonuses, no multipliers, no penalties → no spread.
- 40 participants → expect ~12 ties at the median, ~3-way tie at the top.

### 5.2 Score-spread tactics (per-run scoring formula)

```
runScore =
    sum(starValues collected, with night-doubling)       // base 1..8 per star
  + combo bonus  (×1 / ×2 / ×3 / ×4 multiplier on chain) // up to 4× the chain
  + constellation/persona-shape +50 if pattern hit       // 0 or 50
  + nestBankingBonus (+2 per star banked at nest)        // up to ~6
  + windRiderBonus (+1 per tick fully wind-aligned)      // up to ~10
  - wallHits × 2                                         // -0..20
  - stallPenalty (stallTicks > 90 → -5)                  // 0 or -5
  + fullFuelEndBonus (fuel > 80 at round end → +5)       // 0 or 5
  + andarnaModeMultiplier (×4 fire stars if Konami)      // rare
```

Realistic spread: **45-220 per run**, ×10 runs → **450-2200 total**.

With 40 participants, this spread basically eliminates ties without artificial tiebreakers — the modifiers compound differently per strategy.

### 5.3 Tiebreakers (if total still ties)

Apply in order:

1. **Highest single-run score** (rewards peak performance)
2. **Most fire stars collected across 10 runs**
3. **Earliest run hitting personal best** (rewards early mastery)
4. **Per-tick efficiency** = total_score / total_ticks_alive across 10 runs
5. **Coin flip** (facilitator's discretion — but unlikely to reach this)

### 5.4 Run-budget meta-strategy

Because each run is solo vs 5 rivals (same five every time, same map seed per run? or randomised?):

**Recommendation: map seed varies per run (1..10), rival positions randomised, star positions randomised, but persona-shape easter egg constellation pattern is DETERMINISTIC per persona.**

This means:
- Bots that hardcode positions fail.
- Bots that read state succeed.
- The easter egg is exploitable by smart bots over multiple runs (notice the pattern in run 1 → exploit in runs 2-10).

---

## 6. Database Schema

### 6.1 Migration: `SUPABASE_MIGRATION_2026-05-12_arena_runs.sql`

```sql
-- ═══════════════════════════════════════════════════════════
-- Arena v2 — per-run scoring
-- ═══════════════════════════════════════════════════════════

-- Drop old bot_submissions? NO — keep it for code submissions.
-- bot_submissions now stores ONE code submission per (nickname, character_id).
-- arena_runs stores 10 RUNS of that code.

CREATE TABLE IF NOT EXISTS arena_runs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES bot_submissions(id) ON DELETE CASCADE,
  nickname      TEXT NOT NULL,
  character_id  TEXT NOT NULL CHECK (character_id IN ('violet','xaden','rhiannon','ridoc','liam','imogen')),
  run_number    INT  NOT NULL CHECK (run_number BETWEEN 1 AND 10),

  -- Score breakdown (denormalized for fast leaderboard queries)
  score              INT  NOT NULL,            -- final run score
  stars_collected    INT  NOT NULL DEFAULT 0,
  fire_stars         INT  NOT NULL DEFAULT 0,
  max_combo          INT  NOT NULL DEFAULT 0,
  walls_hit          INT  NOT NULL DEFAULT 0,
  pattern_hit        BOOLEAN NOT NULL DEFAULT FALSE,  -- persona-shape easter egg
  signet_used        BOOLEAN NOT NULL DEFAULT FALSE,
  ticks_alive        INT  NOT NULL DEFAULT 1200,
  bot_crashed        BOOLEAN NOT NULL DEFAULT FALSE,

  -- Full run log (compressed) — for replay + facilitator audit
  run_log_json       JSONB,                    -- {seed, finalPositions, eventTimeline}

  created_at    TIMESTAMPTZ DEFAULT now()
);

-- Unique: one row per (nickname, character_id, run_number)
CREATE UNIQUE INDEX IF NOT EXISTS uniq_arena_runs_user_run
  ON arena_runs(nickname, character_id, run_number);

CREATE INDEX IF NOT EXISTS idx_arena_runs_nickname    ON arena_runs(nickname);
CREATE INDEX IF NOT EXISTS idx_arena_runs_submission  ON arena_runs(submission_id);

-- Leaderboard view: total + tiebreakers (best run, fire stars, etc.)
CREATE OR REPLACE VIEW arena_leaderboard AS
SELECT
  nickname,
  character_id,
  COUNT(*)                          AS runs_completed,
  SUM(score)                        AS total_score,
  MAX(score)                        AS best_run_score,
  SUM(fire_stars)                   AS total_fire_stars,
  SUM(stars_collected)              AS total_stars,
  MAX(max_combo)                    AS best_combo,
  BOOL_OR(pattern_hit)              AS hit_persona_pattern,
  SUM(score)::FLOAT / NULLIF(SUM(ticks_alive),0)  AS efficiency,
  MIN(CASE WHEN score = MAX(score) OVER (PARTITION BY nickname) THEN run_number END)
                                    AS pb_run_number
FROM arena_runs
GROUP BY nickname, character_id
ORDER BY
  total_score DESC,
  best_run_score DESC,            -- tiebreaker 1
  total_fire_stars DESC,          -- tiebreaker 2
  pb_run_number ASC,              -- tiebreaker 3 (earlier PB wins)
  efficiency DESC;                -- tiebreaker 4

-- RLS — anyone can read (it's a leaderboard), anyone can insert their own.
ALTER TABLE arena_runs ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'arena_runs' AND policyname = 'Anyone reads arena_runs') THEN
    CREATE POLICY "Anyone reads arena_runs" ON arena_runs FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'arena_runs' AND policyname = 'Anyone inserts arena_runs') THEN
    CREATE POLICY "Anyone inserts arena_runs" ON arena_runs FOR INSERT WITH CHECK (true);
  END IF;
END $$;
```

### 6.2 What `bot_submissions` becomes

Stays as-is — one code blob per (nickname, character_id). Optionally add a column to track v1 vs v2 API:

```sql
ALTER TABLE bot_submissions
  ADD COLUMN IF NOT EXISTS api_version SMALLINT DEFAULT 2;
```

### 6.3 What the run-log JSON looks like

```json
{
  "seed": 42,
  "tickCount": 1200,
  "finalScore": 187,
  "events": [
    { "tick": 23,  "type": "star",        "tier": "silver", "value": 2,  "combo": 1 },
    { "tick": 24,  "type": "star",        "tier": "gold",   "value": 5,  "combo": 2 },
    { "tick": 28,  "type": "wall_hit",    "wallId": 3,      "penalty": -2 },
    { "tick": 31,  "type": "boost",       "remaining": 5 },
    { "tick": 45,  "type": "breath",      "hit": ["andarna"] },
    { "tick": 80,  "type": "signet" },
    { "tick": 120, "type": "pattern_hit", "bonus": 50 },
    { "tick": 600, "type": "phase",       "to": "night" },
    { "tick": 1199,"type": "end",         "fuelLeft": 87, "fuelBonus": 5 }
  ]
}
```

Keep events array under ~80 entries per run — full positional replay isn't needed for the leaderboard (would explode storage).

---

## 7. UX flow

### 7.1 The participant journey (workshop day)

```
Step 1. Arena Intro slide (P_ArenaIntro.jsx)
         ↓
Step 2. Click "Open Arena →"   →   opens /?page=arena in new tab
         ↓
Step 3. Arena page:
         ├─ LEFT: persona slot, code editor, hint panel
         ├─ CENTER: arena canvas (Phaser)
         └─ RIGHT: 10-run scoreboard, leaderboard, "RUN" button
         ↓
Step 4. Participant edits code in editor
         (or copies template to Claude Code, gets help, pastes back)
         ↓
Step 5. Click "▶ Run 1" — bot vs 5 rivals plays out in 60 seconds
         (with arena-page-internal speedup option: 2× / 4× toggle for impatient users)
         ↓
Step 6. Run completes → score recorded, "▶ Run 2" enabled
         ↓
Step 7. After 10 runs → "Submit final" greys out RUN button.
         Total score posted. Leaderboard updates.
         ↓
Step 8. (Optional) Edit code between runs. Re-runs use the new code.
         Total = sum of whichever code was active at each run.
```

### 7.2 Run controls (right panel)

```
┌─ MY RUNS ──────────────────┐
│ Run 1  ✓  87 pts           │
│ Run 2  ✓  102 pts          │
│ Run 3  ✓  64 pts ⚠         │  ← wall hits hurt
│ Run 4  ✓  155 pts ⭐        │  ← pattern hit
│ Run 5  ─                    │
│ Run 6  ─                    │
│ Run 7  ─                    │
│ Run 8  ─                    │
│ Run 9  ─                    │
│ Run 10 ─                    │
├─────────────────────────────┤
│ Total: 408 / max ~2200      │
│ Rank: 12 of 38              │
├─────────────────────────────┤
│ [▶ Run 4] [2× ⏩] [Edit code]│
└─────────────────────────────┘
```

### 7.3 Leaderboard (bottom of arena page)

```
┌─ ARENA LEADERBOARD ────────────────────────────────────┐
│  #1  alex_qa     Xaden    1842  (best run 247) 🔥9     │
│  #2  marina_t    Violet   1721  (best run 198) 🔥6     │
│  #3  you (mid)   Liam     1503  ...                    │
│ ...                                                     │
└─────────────────────────────────────────────────────────┘
```

### 7.4 Champion reveal page

`/?page=arena-champion` — facilitator opens at workshop close. Pulls top-1 from `arena_leaderboard` view. Animated reveal (dragon silhouette + name + character + total). Top-5 listed below.

Implementation: new `src/pages/ArenaChampion.jsx` that uses Supabase view + dramatic CSS reveal.

### 7.5 Anti-cheat / sanity guardrails

- Bot runs in **Web Worker** (current setup) — no DOM access.
- **8ms time budget per tick** — exceed → return last action, count 1 strike.
- **3 strikes → bot frozen for the round.** Score still recorded.
- **Code size cap 8KB** (current is 8000 chars — keep).
- **No `eval`, no `Function` constructor in worker** — already isolated.
- Run log stored server-side. **Facilitator can audit any run** (replay button on champion page).
- Same map seed for run-N across all participants? **No — let RNG vary**, otherwise rote memorisation wins. But within a single run, all positions deterministic from seed (for reproducibility).

### 7.6 What changes in `src/pages/Arena.jsx`

The iframe wrapper needs:
1. **New postMessage type: `record-run`** — arena sends `{score, breakdown}` after each of 10 runs. Wrapper calls `recordRun(nickname, characterId, runNumber, scoreBlob)` → Supabase.
2. **New postMessage type: `request-runs-progress`** — arena asks "how many runs has this user completed?" on load, so participant can resume.
3. Remove `?final=1` melee mode (or keep as facilitator demo — non-scoring exhibition).

### 7.7 What changes in `src/pages/P_ArenaIntro.jsx`

Update copy:
- "Six dragons compete on the projector" → "You fight 5 AI dragons. 10 runs. Sum of stars = your score."
- Add "10 runs × 60s = 10 minutes" expected time.
- Add API v2 quick reference (highlight new fields: `boost`, `tier`, `wind`, `phase`).

---

## 8. Implementation Effort — Minimum Viable v2 vs Full Vision

### 8.1 Time budget

Anastasia has **~1 day** before workshop (2026-05-12 → workshop is 2026-05-13). Plus the day-of (morning prep). Realistic effort budget: **8-10 productive coding hours**.

### 8.2 Three implementation tiers

#### Tier 0 — Backend & schema (must-have, ~2h)

| Task | Effort | Why |
|------|--------|-----|
| New `arena_runs` table + view migration | 30 min | Without this, no sum-scoring |
| Update `Arena.jsx` to handle `record-run` postMessage | 45 min | Wires arena → DB |
| `recordRun()` / `getProgress()` / `getLeaderboard()` API methods | 45 min | Data plumbing |

#### Tier 1 — Minimum Viable v2 (~5h)

The smallest set of changes that turns the game from "one melee, undifferentiated" into "solo vs 5 rivals, 10-run sum, real spread".

| Task | Effort | Why |
|------|--------|-----|
| **Rewrite arena loop:** 1 player + 5 hardcoded AI rivals (Tairn, Sgaeyl, Andarna, Feirge, Codagh) | 90 min | Core format change |
| **Star tiers** (gold/silver/bronze + existing fire), random distribution | 30 min | Instant score spread |
| **Boost meter** + boost action | 45 min | Adds first non-trivial resource decision |
| **Combo multiplier** | 30 min | Biggest spread multiplier in one mechanic |
| **Wall-hit penalty** (-2 per hard hit) | 15 min | Punishes lazy bots |
| **10-run scoreboard UI** in right panel | 45 min | UX of the new format |
| **Run replay JSON capture** (event timeline) | 30 min | For audit + champion replay |
| **Leaderboard view** in arena page (fetched from Supabase view) | 30 min | Live ranking |

**Tier 1 outcome:** participants see real spread (60-300 per run, 600-3000 totals). Five rival archetypes give Claude something to teach. 10 runs feel different from each other because of combo + boost decisions.

**What Tier 1 DOESN'T have yet:** persona-coded easter eggs, wind, day/night, carrying/nests, breath. Game is *playable and fair* but not yet *deep*.

#### Tier 2 — Depth & easter eggs (~3-4h, stretch)

If Tier 1 finishes early and there's juice left:

| Task | Effort | Why |
|------|--------|-----|
| **Day/Night phase + fire star night-doubling** | 45 min | Adds timing layer |
| **Wind currents** (4 cells, visible on minimap) | 60 min | Adds positional reading |
| **Fire breath action** | 60 min | Combat — interacts with rivals |
| **Persona-shape easter egg** (6 patterns, +50 bonus) | 75 min | Per-persona Claude lesson |
| **Upgraded signet** (per-persona effect) | 45 min | More flash |
| Star spawn waves | 30 min | Patience play |
| Wall-hugging speed bonus | 30 min | Positional skill |

**Tier 2 outcome:** full vision. Every persona has a unique optimal strategy. Claude has 6 different system prompts to bias. Score spread becomes 200-2500 totals, ties become rare.

#### Tier 3 — Polish (cut if time)

- Champion reveal page (`ArenaChampion.jsx`)
- Run replay viewer
- Carry-stars + nests mechanic
- Bounty zones, gravity wells, draft, Konami, altitude, etc. — all skippable for workshop, can be added post-event for "v2.1 evergreen" if she wants to keep the game public.

### 8.3 Recommended cut line

**Ship Tier 0 + Tier 1 + persona-shape easter egg from Tier 2 (one easter egg per persona — the simplest one).**

- That's ~7 hours of focused work.
- Leaves ~2 hours for testing, polish, deployment.
- Gives Claude six meaningfully different per-persona prompts.
- Score spread will be wide enough to produce a clear champion.

### 8.4 Day-of testing plan

1. **Morning of workshop:** Anastasia runs 3 self-tests with 3 different persona prompts → check that scores differ meaningfully.
2. **First 5 participants:** facilitator watches their 10-run progress, flags any "all bots tied at 1200" outcomes.
3. **If scores cluster:** quick patch — bump combo multiplier from 4× to 6× max, persona-pattern bonus from +50 to +100. Hot-reload.

---

## 9. Open Questions / Decisions for Anastasia

1. **Same map seed per run-N across participants, or fully random?**
   - Same → fair comparison, encourages memorisation.
   - Random → encourages adaptive bots, kills memorisation.
   - **Кай's pick:** random, but log the seed in the run record so we can replay any run.

2. **Do code edits between runs count, or is code locked after Run 1?**
   - Locked → simpler, fairer, single artifact.
   - Editable → more workshop-y, more "iterate with Claude".
   - **Кай's pick:** editable. Each run uses the code as-of-submit. This is the *learning loop* — let them iterate.

3. **Time per run — 60s (current) or shorter (30-45s)?**
   - 60s × 10 = 10 min just running, plus coding time per iteration.
   - 30s × 10 = 5 min running. Faster session, less material per run.
   - **Кай's pick:** 45s. Total ~7.5 min of pure runtime, leaves more breath for coding loop.

4. **Speed toggle (2× / 4×)?**
   - Lets participants watch runs in background while writing.
   - **Кай's pick:** yes, 1×/2×/4× buttons. Default 1× for first run, auto-2× after.

5. **Single-elimination final on projector, or pure leaderboard reveal?**
   - The original v1 plan was a melee on the projector. With v2, melee doesn't exist.
   - **Кай's pick:** replace projector melee with: (a) top-3 champion reveal animation, (b) **top-3 do a "victory lap" run live** — their bot vs 5 rivals on the big screen. Audience watches. Loudest cheering = bonus rep.

---

## 10. Implementation order — concrete next-action queue

If you start now (2026-05-11 evening) and ship for 2026-05-13:

```
Phase A — schema & wiring (Tier 0)
  [ ] Write SUPABASE_MIGRATION_2026-05-12_arena_runs.sql
  [ ] Run migration on dev Supabase
  [ ] Add recordRun() / getProgress() / getLeaderboard() to src/api/submissions.js
  [ ] Update Arena.jsx postMessage handler for `record-run`
  [ ] Smoke test: hardcode a dummy run record, verify it lands

Phase B — game loop rewrite (Tier 1 core)
  [ ] Refactor dragon-arena.html so only ONE player slot exists
  [ ] Implement 5 rival AI tick functions inline (Tairn..Codagh)
  [ ] Add star tiers
  [ ] Add boost meter
  [ ] Add combo multiplier
  [ ] Add wall-hit penalty
  [ ] Build run-end summary: score breakdown JSON

Phase C — UX (Tier 1 UI)
  [ ] Replace 6-slot panel with 1-slot + run history
  [ ] Add 10-run scoreboard UI
  [ ] Add live leaderboard panel
  [ ] Speed toggle buttons (1× / 2× / 4×)
  [ ] Update P_ArenaIntro.jsx copy

Phase D — depth (Tier 2 selective)
  [ ] Persona-shape easter eggs (6 patterns, +50)
  [ ] Upgraded signet (per-persona effect)
  [ ] (if time) day/night phase
  [ ] (if time) wind currents

Phase E — champion (Tier 3)
  [ ] ArenaChampion.jsx page
  [ ] Workshop-close URL: /?page=arena-champion
  [ ] Final battle replay viewer (optional)

Phase F — final test
  [ ] Anastasia plays 3 personas with 3 strategies → verify spread
  [ ] Deploy to Render
  [ ] Smoke-test on workshop URL
  [ ] Brief facilitator script update
```

---

## 11. Summary

**The change:** 6-dragon melee → solo-vs-5-AI × 10 runs, summed, persisted.
**The depth:** 12 new mechanics in MVP, 10 more in stretch — enough strategic surface that Claude has real material per persona.
**The personas matter:** each gets a strategy hint Claude leans on + a unique signet + a hidden pattern bonus.
**The ranking:** total score → best run → fire stars → PB run number → efficiency.
**The schema:** new `arena_runs` table, `arena_leaderboard` view, keep `bot_submissions` for code.
**The time:** Tier 0 + Tier 1 + one easter egg per persona = ~7h focused work. Realistic for 1 day.

Score spread target: **450-2500 across 10 runs**, single-digit ties at the top.
One clear Arena Champion.

— К.
