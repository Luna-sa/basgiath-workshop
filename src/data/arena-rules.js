/**
 * Arena rules block — appended to CLAUDE.md by the Signet Ceremony.
 *
 * Philosophy: rules, not strategy. Claude gets the **mechanics** of the
 * Arena but no recommended strategy. The participant should DISCOVER
 * their winning approach through dialogue with their bonded Claude.
 * Many strategies win — none is obviously best. The synergy of the
 * participant's intuition and Claude's reasoning shapes a unique bot.
 */

const PERSONA_SIGNETS = {
  violet: {
    name: 'Ghost Walk',
    desc: 'Walls do not collide for 4 seconds. You can fly through obstacles.',
    use_hint: 'Think — where is it worth charging in, once the walls stop being barriers?',
  },
  xaden: {
    name: 'Triple Boost',
    desc: '4 seconds × 2.2 speed. Equivalent to three boosts in a row, for free.',
    use_hint: 'When does raw speed pay off the most? One long dash, or a series of short ones?',
  },
  rhiannon: {
    name: "Tactician's Read",
    desc: 'Combo window doubles from 2.5s to 5s + a mild 1.15× speed. 4 seconds.',
    use_hint: 'Where are the stars spread so wide that without the extended window the chain would break?',
  },
  ridoc: {
    name: 'Wide Catch',
    desc: 'Star-collection radius × 2 for 4 seconds. You can sweep up stars across a wide lane on the fly.',
    use_hint: 'Where are the star clusters dense enough that a wide pickup detonates the score?',
  },
  liam: {
    name: 'Endless Fuel',
    desc: 'Fuel does not drain for 4 seconds. You can hold throttle at 1.0 without looking back.',
    use_hint: 'When would fuel have become a blocker — but without it, you would have flown the line perfectly?',
  },
  imogen: {
    name: 'Auto-aim',
    desc: 'Angle of attack auto-tracks the nearest star. 4 seconds.',
    use_hint: 'Where is the dense scatter of stars where manual aiming is slower than auto-tracking?',
  },
}

const PERSONA_PATTERNS = {
  violet: {
    name: 'Diagonal line',
    desc: '5 stars along a diagonal (NE↔SW or NW↔SE, angle ~45°).',
  },
  xaden: {
    name: 'Horizontal sweep',
    desc: '5 stars almost on the same horizontal line (Δy < 80px), all in the same direction.',
  },
  rhiannon: {
    name: 'Equilateral triangle',
    desc: '3 stars forming an equilateral triangle (sides 70-280px, less than 45% difference).',
  },
  ridoc: {
    name: 'Zig-zag',
    desc: '5 stars: X-coordinate alternates L-R-L-R-L (or R-L-R-L-R).',
  },
  liam: {
    name: 'Square corners',
    desc: '4 stars at the corners of a square (~90° apart from centre, less than 45% distance difference).',
  },
  imogen: {
    name: 'Tight cluster',
    desc: '3 stars within a 60px-diameter circle, all collected within 2 seconds (40 ticks).',
  },
}

const PERSONA_LABEL = {
  violet:   'Violet Sorrengail',
  xaden:    'Xaden Riorson',
  rhiannon: 'Rhiannon Matthias',
  ridoc:    'Ridoc Gamlyn',
  liam:     'Liam Mairi',
  imogen:   'Imogen',
}

/**
 * Build the Arena Rules markdown block for a given persona.
 * Returns "" for characterId='self' or unknown — they don't have an
 * arena character (the Signet output for 'self' is just personal voice).
 */
export function buildArenaRulesBlock(characterId) {
  const personaSignet = PERSONA_SIGNETS[characterId]
  const personaPattern = PERSONA_PATTERNS[characterId]
  if (!personaSignet || !personaPattern) return ''
  const label = PERSONA_LABEL[characterId] || characterId

  return `

# ARENA — game rules (facts only, no strategy)

I'm flying into the Aerie Arena as ${label} against 5 AI rivals. 5 runs, sum of scores = my total. Arena champion = highest total.

## tick() cycle — what I read

Every frame (20× per second, 900 ticks over 45 seconds) the function \`tick(state)\` is called with full game state:

\`\`\`js
state.me      = { x, y, vx, vy, angle, score, fuel (0-100),
                  boost (0-30), combo, persona }
state.stars   = [{ x, y, tier: 'bronze'|'silver'|'gold'|'fire',
                   value: 1|2|5|8 }]
state.walls   = [{ x, y, r }]
state.rivals  = [{ id, x, y, vx, vy, score }]
state.sky     = { width, height }
state.tick, state.ticksRemaining
\`\`\`

## What I return

\`\`\`js
return {
  angle,       // 0-360, direction to fly
  throttle,    // 0-1
  boost,       // true → spend 20 boost, 1.5s × 2 speed
  signet,      // true → one-shot, 4s personal buff (mine below)
}
\`\`\`

## Scoring (per run)

- Sum of values of collected stars × combo multiplier
- **Combo**: stars collected within 2.5s = chain. ×2 on 3-chain, ×3 on 5-chain, ×4 on 8-chain. Resets on wall-hit or after 2.5s of inactivity.
- **+50** if the first N stars I collect form my personal pattern (see below)
- **+5** if fuel > 80 at the moment the run ends
- **-1** per hard wall collision (speed > 1.5)
- **-5** if throttle < 0.15 for more than 4.5s in a row (stall)

## My signet — ${personaSignet.name}

${personaSignet.desc}

${personaSignet.use_hint}

## My easter-egg pattern — ${personaPattern.name}

${personaPattern.desc}

If the **first** N stars I collect form exactly this shape — +50. Can be triggered once per run; further repetitions don't count.

## Rivals — vulnerabilities of each

- **Tairn** (greedy): always flies for the nearest star, never boosts, eats walls on long routes. Beat with combo chains or by stealing his nearest star.
- **Sgaeyl** (cautious): plans for ~10 ticks at the start, slow opener. Get to the first wave before her.
- **Andarna** (aggressive): burns boost recklessly, runs dry by the late game. Hold distance > 130px while she spends, then pick up.
- **Feirge** (blocker): parks between me and the most valuable star. Bait with a false target, then return to the real route. Or take the trade — let her block gold while you stack bronze combos.
- **Codagh** (chaotic): switches target every 4 seconds. Whenever her target lines up with the wind (no wind in MVP, but: random drift), she flies off. Clean late-game wins.

## My task

Talk it through with me. Many strategies win — none is obviously best. I'm your bonded — my voice and my optics will be biased toward your style. Together we build a \`tick()\` function that maximises your total.

Questions worth asking out loud:

- Exactly when should I press signet? What do I gain from my persona-buff right here?
- Should I aim for an 8-chain combo, or play it safe on 3-chains?
- Which rival do I fear most, and how do I outmanoeuvre them?
- What's more valuable per run — fire stars, or a series of gold/silver through combo?
- What if I collect my easter-egg pattern first (+50), then switch to standard mode?

I will not hand you the "best recipe". I don't know how you think. I know the rules. The rest — is dialogue.`
}

/**
 * Build the full standalone "Arena Brief" — downloadable .md the
 * participant can save and paste/import into Claude Code as a
 * working document. Includes everything in buildArenaRulesBlock,
 * a header with the participant's name + nickname, a starter
 * tick() template, and a structured prompt the participant can
 * paste into Claude Code to start tuning the bot.
 */
export function buildArenaBriefMd({ characterId, nickname, name } = {}) {
  const rulesBlock = buildArenaRulesBlock(characterId)
  if (!rulesBlock) {
    return `# Arena Brief\n\nNo character selected — pick one in the Threshing slide and re-download this brief so it includes your signet and easter-egg pattern.`
  }

  const label = PERSONA_LABEL[characterId] || characterId
  const header = `# Arena Brief — ${nickname ? '@' + nickname : 'anonymous rider'}

Rider: ${name || nickname || 'unnamed'}
Character: ${label}
Generated: ${new Date().toISOString().slice(0, 10)}

---

## How to use this file with Claude Code

1. Save this file as \`ARENA.md\` somewhere Claude Code can see it
   (your project root works, or \`~/.claude/ARENA.md\`).
2. Open Claude Code in that folder.
3. Paste the prompt at the bottom of this file. Claude will read
   the rules above, ask you a couple of questions about your
   intuition, and start building the \`tick()\` function with you.
4. Iterate. Run \`tick()\` in the Arena. Read the run log. Talk
   to Claude about what worked, what didn't, what surprised you.
`

  const starterTemplate = `

---

## Starter \`tick(state)\` template

Drop this into the Arena code editor as your baseline. It's
intentionally naïve — flies toward the nearest star at full
throttle. Iterate from here.

\`\`\`js
function tick(state) {
  const me = state.me
  const stars = state.stars

  // 1. Pick the nearest star — naive greedy
  let nearest = null
  let nearestDist = Infinity
  for (const s of stars) {
    const dx = s.x - me.x
    const dy = s.y - me.y
    const d = Math.hypot(dx, dy)
    if (d < nearestDist) {
      nearest = s
      nearestDist = d
    }
  }
  if (!nearest) return { angle: me.angle, throttle: 0 }

  // 2. Fly toward it
  const angle = Math.atan2(nearest.y - me.y, nearest.x - me.x) * 180 / Math.PI

  return {
    angle,
    throttle: 1.0,
    boost: false,
    signet: false,
  }
}
\`\`\`

Things this naïve bot does badly:
- Never uses signet → wastes the one-shot ${PERSONA_SIGNETS[characterId]?.name}.
- Never uses boost → leaves 30 boost on the table.
- Doesn't see rivals → flies into Feirge's blocks.
- Doesn't try the easter-egg pattern (${PERSONA_PATTERNS[characterId]?.name}) → leaves +50 unclaimed.
- No combo discipline → resets chain on first wall hit.

Each of these is a conversation with Claude. None of them has
a single right answer. Pick one, ask Claude what you would gain
by fixing it, try the change, see what the run log says.
`

  const sessionPrompt = `

---

## Prompt to start the session with Claude Code

Copy this whole block, paste it into Claude Code:

\`\`\`
I'm tuning my Arena bot for the Aerie Arena finale.

You already have my CLAUDE.md persona loaded. Read the ARENA.md
in this directory — it has the full rules, my character
(${label}), my signet (${PERSONA_SIGNETS[characterId]?.name}),
and my easter-egg pattern (${PERSONA_PATTERNS[characterId]?.name}).

Don't give me "the best strategy". Help me find mine.

Start by asking me three short questions:
1. What's my instinct — chase combos or chase value?
2. Which rival do I most want to beat — Tairn, Sgaeyl, Andarna,
   Feirge, or Codagh?
3. How risky do I want to play — safe 3-chains or aggressive
   8-chain attempts?

Based on my answers, propose one concrete change to the starter
tick() in ARENA.md. Just one change. Explain in two sentences
what I gain and what I trade. Then wait for me to try it.

After I run it once and tell you the score + what I saw — we
iterate. One change at a time. We have five runs in the Arena.
Let's make each one matter.
\`\`\`
`

  return header + rulesBlock + starterTemplate + sessionPrompt
}
