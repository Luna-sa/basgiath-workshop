# Research: WAU-Grade Practice Tasks and Gamification for the QA Workshop

Date: 2026-05-07
Goal: an opinionated, source-backed proposal for what tasks/mechanics could replace or augment the current practice section (~60-90 min) to make it WAU-grade for ~30-50 skeptical QA professionals from a gaming company. Empyrean / Fourth Wing lore as wrapper, real QA work as substance.

This report is opinionated. Where two formats compete, I pick. Where a popular thing is shallow, I say so.

---

## TL;DR for the workshop designer

1. **The current practice block is competent but unmemorable.** P08 (slash command for test cases), P09 (find a bug), P11 (MCP demo), P12 (quiz), P13 (war games as 1-on-1 vote), P14 (podium) — each is a single-axis task. None has the "I have to tell my colleagues" hook. There is no scarcity, no hidden information, no consequence for failure, no asymmetric stakes, no peer-to-peer pressure. Skeptical QA sees through points-and-badges in 2 minutes — see [Hacker News thread on GitHub gamification](https://news.ycombinator.com/item?id=33309969) where engineers explicitly call out that streak counters cause "people making literally one contribution just to keep it up. That's fucked up." The current setup is the kind of gamification they roll their eyes at.

2. **What does work for senior engineers** (and Playtika QA are senior — they ship live ops to 34M MAU — see [Playtika QA careers](https://www.playtika.com/careers/qa/)) is *real consequences inside a small fictional frame*. CTF format. Bug bash with categories and "best bug" Oscar-style award. War games where teams attack the same target in parallel and bug counts are projected on screen ([Ministry of Testing — How We Ran A Bug Hunt](https://www.ministryoftesting.com/articles/94e3fd44)). Chaos engineering game days where someone breaks the system live ([TechTarget — chaos engineering game day](https://www.techtarget.com/searchsoftwarequality/tip/How-to-set-up-a-chaos-engineering-game-day)). These are the formats engineers tell their friends about.

3. **The single highest-leverage mechanic to add is hidden information / asymmetric roles.** Mafia/Werewolf is used in Silicon Valley team-building precisely because senior people can't see through it ([Tabletop Trove on Werewolf history](https://tabletoptrove.com/werewolf-game-history-how-mafia-became-social-deduction-king/)). Translated to QA: a planted "venin" tester whose secret goal is to write subtly bad test cases that pass peer review. A blue team has to spot them. This is a mechanic that produces stories.

4. **The Empyrean wrapper has 5-6 lore beats that map cleanly to QA work and 4-5 that feel forced.** Strong: Threshing (matching tests to features as a bonding ritual), Gauntlet (escalating obstacle course of bugs), Wards (regression / what protects the kingdom from breaking), Signet (each character's QA superpower), Death Roll (severity triage under time pressure), Battle Brief (incident postmortem). Weak / cringe: dragons literally talking to each other, calling participants "cadets," anything with sword fighting, anything that requires people to physically act out a role.

5. **The proposal in §6 replaces P08-P14 with five flagship tasks** that escalate in stakes and reuse infrastructure: Threshing (matching), Gauntlet (escalating bugs in a sample app, MCP-driven), Wards (regression with time pressure and a planted bug), Signet Duel (war games — 4-vs-4 squads, hidden roles, peer review), Battle Brief (final incident — log archaeology, pulled from real game ops). Total 75-85 minutes, headroom for facilitator.

6. **Anti-patterns to actively avoid** (§7): childish role-play (no "say it in dragon-rider voice"), made-up stakes (no "gold coins" — points have to map to something real or they get ignored), participation rewards (badges for showing up are seen as participation trophies and signal "this is for kids"), fake AI judging where Claude says "great submission!" — that destroys trust in 30 seconds. Specifics in §7.

---

## Track 1 — What WAU-grade workshop tasks actually look like

### Bug bash format (Microsoft, BrowserStack, Mews, Ministry of Testing)

Bug bashing is the most validated corporate QA workshop format. Ministry of Testing's well-documented bug hunt ([How We Ran A Bug Hunt](https://www.ministryoftesting.com/articles/94e3fd44)) provides specific data:

- **18 participants in 9 teams of 2.** Mix of roles: "10 developers, 3 Product Managers, The Director of R&D, Chief Architect, 2 Support Consultants, 1 Application Consultant." Test team facilitated but didn't compete.
- **Two sessions of two hours each** (= 72 person-hours of testing).
- **Bugs counted, no formal scoring.** Tags denoted "what particular area a bug was found in."
- **Projected bug counts** on screen during the event drove competitive spirit.
- **Prize structure:** Most bugs found, "Best Bug" (subjective, Oscar-style), cross-functional team dynamics prize, **Booby Prize for duplicate bug report** (this is brilliant — it punishes lazy submissions). Event closed with "poker, beer and pizza."
- **Rules:** one person drives, the other leads testing/notes. Switch roles mid-session.
- **What failed:** bug review was "time consuming and perceived as pedantic." Validating actual bugs vs symptoms was painful. Quality suffered when non-testers tested.

Implication for our workshop: **the format works, but the bug-validation overhead is the killer.** With 30-50 people and 60-90 min, you cannot manually validate. Solution: **AI rubric-graded submissions** ([promptfoo LLM rubric](https://www.promptfoo.dev/docs/configuration/expected-outputs/model-graded/llm-rubric/), [Rubric Is All You Need](https://arxiv.org/html/2503.23989v1)) plus pre-planted bugs in the sample-project where the "ground truth" is known and graders match submissions to known bug IDs. This is exactly the [OWASP Juice Shop CTF model](https://pwning.owasp-juice.shop/companion-guide/latest/part4/ctf.html): all instances use the same secret key to generate flag codes, and a score server accepts those flag codes for scoring "the first team that solved them."

### War games format (Devlane / proven at scale)

[Devlane's war games method writeup](https://www.devlane.com/blog/war-games-method-software-testing) is direct and concrete:

> "War Games consist of testing an app, or a set of its features, working in groups 'attacking' multiple test scenarios in parallel, with different points of view and approaches when it comes to detecting bugs. This task is carried out during a time interval set by the team leader (generally, between 1 or 2 hours), and then a record is made of the number of issues that each one has been reporting, hence the 'games' feature."

Concrete five-person example: John (5 bugs), Patricia (4), Sophie, Paul, Peter testing distinct features. Friday session, after a week of focused individual prep.

Implication: war games as **parallel attack on the same target** generates richer bug discovery than serial testing. The current workshop's P13 ("facilitator picks two submissions, everyone votes") is *not* war games — it's a beauty contest. Real war games is teams attacking *the system simultaneously* and a leaderboard updates live. That's the format to copy.

### CTF format (Capture the Flag, adapted to QA)

The [Software Quality Assurance CTF 2026](https://ctf-00-the-demo.hurayraiit.com/) is a real adaptation. Format borrowed from cybersecurity:

- **Jeopardy-style:** multiple categories with different point values, teams pick what to attack, no team-on-team direct attacks.
- **Flag codes** when a bug is found (a special string proving the bug). Team submits the flag for points.
- **First-blood bonus** for the team that solves a challenge first.
- **OWASP Juice Shop guidance:** 4 hours total ([Juice Shop guide via Mozilla Hacks](https://hacks.mozilla.org/2018/03/hands-on-web-security-capture-the-flag-with-owasp-juice-shop/)). Teams of 3-4. **"Asking competition winners to share how they solved challenges encourages discussion."**

Key Juice Shop lesson worth quoting: **"As a one-time event it won't have the desired outcome since learning happens through repetition, so more frequent, smaller-scale workshops where teams split off for an hour to attempt challenges then regroup to discuss solutions may be more promising."** This validates the workshop's existing pattern of multiple small practice blocks rather than one giant one.

### Chaos engineering game days (Netflix, Harness, AdHoc)

[Netflix-style chaos game days](https://www.techtarget.com/searchsoftwarequality/tip/How-to-set-up-a-chaos-engineering-game-day) are not pure QA but contain transferable mechanics:

- **Hypothesis-first format:** "If the Redis cache becomes unavailable, the checkout service will fall back to direct database queries and maintain sub-2-second response time."
- **Blast radius defined upfront:** one environment, one region, one percentage of traffic.
- **Game runners shut down or misconfigure a service without warning.** "They might break part of the back-end application specifically to observe how the front end handles the failure."
- **Three roles:** software engineer on the targeted service, DevOps, junior engineer.

Translatable insight: **someone breaks something live, in front of everyone, and a team has to detect-then-respond in real time.** This is theatrically different from "find bugs in this static app." For QA: facilitator pushes a regression to staging mid-task, leaderboard freezes, first team to spot it and report it correctly wins.

### What format type makes participants tell their friends

Looking across all formats, the things people actually retell:

1. **A specific moment of surprise** (the planted bug they nearly missed, the mole revealed at the end, the "first blood" notification).
2. **A meaningful win** (their team's name on screen, beating a real rival).
3. **A specific embarrassment they survived** (Booby Prize for dup, public-facing leaderboard).
4. **An actual artifact** (a flag code they captured, a bug they wrote up that someone pinned).

These map to Octalysis Core Drives 6 (Scarcity), 7 (Unpredictability), 8 (Loss & Avoidance) — the "black hat" drives most corporate workshops avoid because they feel risky. But these are the drives that produce stories. See §2.

---

## Track 2 — Gamification mechanics that actually work

### The Octalysis spine

[Yu-kai Chou's Octalysis](https://yukaichou.com/gamification-examples/octalysis-gamification-framework/) has 8 Core Drives. Most corporate workshops use only 2 (Drive 2: Development & Accomplishment via points, Drive 5: Social Influence via leaderboard). That's the **shallow gamification engineers see through immediately** ([Hoxhunt on shallow gamification](https://hoxhunt.com/blog/gamified-cyber-security-training)).

The drives that produce memorable workshops:

| Drive | What it activates | QA workshop translation |
|---|---|---|
| **1. Epic Meaning & Calling** | "I'm part of something bigger" | Empyrean wrapper done well — but ONLY if the lore is treated as flavor on top of real work. If you make the lore the point, it collapses into theater. |
| **2. Development & Accomplishment** | Visible mastery | XP/badges (already in app). Not enough on its own. |
| **3. Empowerment of Creativity** | Express individuality | Character signets — each archetype solves the same task differently and gets credit for archetype-fit, not just correctness. |
| **4. Ownership & Possession** | Accumulate, defend | Squad-level inventory: bugs you found stay on your squad's "wall of trophies" the whole workshop. |
| **5. Social Influence & Relatedness** | Compare, belong | Live leaderboard, peer voting, mentorship. |
| **6. Scarcity & Impatience (Black Hat)** | Urgency through restriction | First-blood bonus, time-gated challenges, limited reveals. |
| **7. Unpredictability & Curiosity (Black Hat)** | Variable reward | Planted moles, randomized loot drops, hidden severity multipliers. |
| **8. Loss & Avoidance (Black Hat)** | Don't lose what I have | Squad gets points stripped for bad-faith submissions. Booby Prize for duplicate. Live points draining if you're idle. |

The current workshop activates Drives 2 and 5 only. Adding any of 6, 7, 8 will move it into "memorable" territory. Adding all three plus 1 done well = WAU.

### Five mechanics worth stealing, opinionated

**1. Hidden role / social deduction (Mafia / Among Us / Werewolf).** Used in Silicon Valley team-building specifically because senior engineers can't see through it. The 1998 Russian Internal Affairs Ministry textbook ([Mafia (party game) Wikipedia](https://en.wikipedia.org/wiki/Mafia_(party_game))) used Mafia to teach reading body language. Translation to QA: 1-2 participants per squad are secretly "venin" — their hidden goal is to introduce subtle test-case bugs that pass peer review. The squad wins if it spots its venin; loses big if it doesn't. **This is the highest-leverage mechanic in the proposal.** Generates the most stories per minute.

**2. First Blood / scarcity bonuses.** [HackTheBox uses this](https://flashgenius.net/blog-article/hack-the-box-vs-tryhackme-a-professionals-guide-to-choosing-the-right-cybersecurity-training-platform): the first team to solve a challenge gets a permanent badge. "First blood" is now a CTF cliché because it works — it converts a long boring middle into a sprint. Add to every task: 50% bonus points for first squad to ship a valid submission.

**3. Asymmetric squads.** Among Us-style 1 vs many, or Codeforces-style "hack the submission" ([Codehacks paper](https://arxiv.org/html/2503.23466v1)): a defender team submits test cases, attackers try to find inputs that break the defender's tests. This maps to QA naturally — adversarial test design is what good QA does. Two squads, one writes test cases, the other writes inputs designed to slip through. Switch sides for round 2.

**4. Live break-in (chaos engineering style).** Mid-task, the facilitator deploys a regression to the sample app. Leaderboard freezes. First squad to detect and correctly characterize the regression wins outsized points. This is theatrical — everyone literally looks up from their laptops. It's also realistic: this is what real on-call QA does.

**5. Death Stranding asynchronous traces.** From Death Stranding's Social Strand System ([Death Stranding Wiki](https://deathstranding.fandom.com/wiki/Social_Strand_System)): "players see items, cargo, and structures that have been placed by other players, allowing people to help one another without immediate communication." Translation: bugs found by previous squads in the same task remain visible to later squads as "ghost trails" — but only if the previous squad chose to leave them. Earn karma for sharing, lose it for hoarding. This solves a real problem: in current war games, late squads have less to find.

### Five mechanics that look fun but I'd skip

- **Loot boxes / random rewards.** Octalysis Drive 7 done lazy. Engineers see the slot-machine pattern and recoil. Use unpredictability via hidden severity multipliers (the bug that *sounded* minor was actually critical) instead.
- **Avatar customization / virtual goods.** Possession drive done lazy. Tied to the workshop ending = wasted effort, since the loot dies with the session.
- **Streak counters.** Directly criticized on [Hacker News](https://news.ycombinator.com/item?id=33309969): "people making literally one contribution just to keep it up. That's fucked up." Not appropriate for a 3-hour event anyway.
- **XP-per-question quizzes.** P12 already does this. It's flat. Replace the quiz with an active task that requires the same knowledge.
- **Public shame mechanics.** Booby Prize is fine because it's playful and self-aware. "Lowest-scoring squad does a forfeit" is not — it punishes the people who came in least confident, which is the opposite of what a learning workshop should do.

---

## Track 3 — Real-world QA task formats that pop

I'll catalog these by suitability for a 60-90 min slot.

### Capture the Bug (CTF adapted)

Hardened format. Teams of 3-4. Each "challenge" is a known planted bug with a flag code. Submit the flag, get points. First blood bonus. Categories worth the points displayed Jeopardy-style. Validated by [SQA CTF 2026](https://ctf-00-the-demo.hurayraiit.com/) and [Juice Shop CTF guides](https://pwning.owasp-juice.shop/companion-guide/latest/part4/ctf.html).

**Strengths:** scales cleanly to 30-50, AI-graders work because flags are deterministic, first-blood bonus drives urgency.
**Weaknesses:** can feel like a treasure hunt (low judgment exercise); needs careful bug planting so they're discoverable but not trivial.
**Time:** 30-45 min works well, 4 hours is the [Juice Shop ideal](https://pwning.owasp-juice.shop/companion-guide/latest/part4/ctf.html) but we don't have that.

### Race-to-fix / Race-to-write

Each squad gets the same broken test suite or the same buggy feature. Whichever squad ships a passing PR / valid bug report first wins. Variant: squad with the highest-quality submission within X minutes wins (AI rubric-graded).

**Strengths:** time pressure produces stories.
**Weaknesses:** quality vs speed tradeoff is hard to balance — pure speed produces sloppy work.
**Time:** 15-25 min sprints. Repeatable.

### Blind code review

Each squad gets a PR they didn't write. They have to review it as if it were going to production. AI evaluates the review against a known "ideal" review (was the bug spotted? was the missing test called out?). [Exponent's code review interview format](https://www.tryexponent.com/blog/how-to-ace-a-code-review) is the model — evaluate design, functionality, and complexity.

**Strengths:** forces senior-level QA judgment, hard to fake, very Playtika-relevant.
**Weaknesses:** hard to make exciting visually — looks like reading.
**Time:** 20 min is sufficient for one review.

### Mystery box / "find the rot"

A small system with several known issues — some surface bugs, some architectural rot, some dead code, some security holes. Squads have an open brief: find as many distinct issues as you can. Categorized scoring. This is essentially a [bug bash](https://en.wikipedia.org/wiki/Bug_bash) with a deliberately rotten target.

**Strengths:** rewards exploratory testing instinct (which is what experienced QA actually do at work).
**Weaknesses:** requires a deeply prepared sample-project with seeded issues across multiple layers.
**Time:** 20-30 min minimum to feel substantive.

### "You have 7 minutes to break this"

Flash format. The whole room sees a feature on-screen. 7 minutes. Submit your best break. AI ranks them. The top 3 are read aloud and demoed live.

**Strengths:** theatrical, rewards quick instincts, generates a "I never would have thought of that" reaction.
**Weaknesses:** disadvantages slow-careful QAs (who are often the best). Pair with a slow-burn task to balance.
**Time:** 7-10 min flash + 5 min reveal.

### Cooperative regression with hidden bugs

Squads collaboratively run a regression suite where some test cases secretly contain a planted error (assertion looks right but the test data is wrong, or it's testing the wrong thing). Squads have to *catch the bad tests* not just run them.

**Strengths:** simulates a real QA threat — "tests that look green but lie." This is the QA equivalent of false-positive detection.
**Weaknesses:** hard to grade automatically without careful planting.
**Time:** 25-35 min.

### Log archaeology / "guess the bug from logs"

Squads get a production-style log file with one or more incidents buried in noise. They have to identify the incident, root-cause it, and propose a regression test. Real research backs this approach — [Advances and Challenges in Log Analysis (ACM Queue)](https://queue.acm.org/detail.cfm?id=2082137) shows log analysis is one of the highest-leverage QA skills, and real production logs are the best training corpus.

**Strengths:** Playtika QA literally do this — Aliaksandr Kavaliou (Performance Test Manager at Playtika) lists capacity testing on log-heavy infrastructure as a top challenge ([Apptim panel](https://blog.apptim.com/mobile-game-testing-qa-panel/)). This task feels like work, in a good way.
**Weaknesses:** harder for junior QA; needs realistic log data.
**Time:** 20-30 min.

---

## Track 4 — Empyrean / Fourth Wing themed wrappers

The Fourth Wing / Empyrean lore (Rebecca Yarros) has a small set of crystalline images. Most map cleanly. A few are forced.

Source: [Fourth Wing wiki](https://the-empyrean-series.fandom.com/wiki/Fourth_Wing), [Basgiath War College map explained](https://theliterarylifestyle.com/basgiath-war-college-map/), [Fourth Wing signets guide](https://thebookfeed.com/fourth-wing-guide/fourth-wing-signets-complete-guide-to-every-riders-signet/), [Venin and wards explainer](https://thebookfeed.com/fourth-wing-guide/venin-and-wyvern-in-fourth-wing/).

### Strong mappings

| Lore element | Source canonical role | QA task it maps to |
|---|---|---|
| **Threshing** | The bonding ritual where dragons choose riders. ([Wiki](https://the-empyrean-series.fandom.com/wiki/Fourth_Wing)) | Test case ↔ feature matching task. The "dragons" are features; the "riders" are test cases. A good test case is "chosen" by a feature when it covers it correctly. |
| **Parapet** | 200-foot-high, 18-inch-wide bridge. 15% of cadets fall. Tests fortitude under risk. | The intro / warm-up task. High-pressure, simple, weeds out the unprepared. Could be a quick "spot the bug in 60 seconds" gate. |
| **Gauntlet** | Vertical obstacle course before Threshing. Violet wins by reading the rules creatively rather than completing it as intended. | Escalating bugs in a sample app. Each obstacle = harder bug. **The Violet lesson is load-bearing: rules-lawyering wins** — exactly what good QA do. |
| **Wards** | Magical barriers protecting Navarre, drawn from dragon power, finite resource ([thebookfeed venin and wards](https://thebookfeed.com/fourth-wing-guide/venin-and-wyvern-in-fourth-wing/)). | Regression suite. The wards are what protects production from "venin" (regressions). Maintaining them = regression discipline. |
| **Signet** | Each rider's unique magical ability, manifesting from their innate need ([signets guide](https://thebookfeed.com/fourth-wing-guide/fourth-wing-signets-complete-guide-to-every-riders-signet/)). | Each character archetype (Violet/Xaden/Rhiannon/Ridoc/Liam/Imogen) gets a different bonus on certain task types. Plays to character builds the user already invested in. |
| **Death Roll** | Dragon battle move, severity-scaled. (Used elsewhere in fan glossary; canonical is dragon "rolling" in air combat.) | Severity assessment under time pressure. Rapid-fire "is this P0/P1/P2/P3?" with stakes. |
| **Venin** | Humans corrupted by drawing magic from the source without a dragon. Hidden among the population. ([screenrant venin](https://screenrant.com/fourth-wing-empyrean-books-venin-wyvern-powers-explained/)) | The hidden-role mechanic. Some squad members are secretly venin — they introduce subtle bad test cases or bad bug reports. Pure gold for social deduction. |
| **Battle Brief** | The strategic-history class at Basgiath where cadets analyze recent skirmishes. ([Riders Quadrant lore](https://shapes.inc/fandom/fourth-wing/episodes-guide)) | The postmortem / log-archaeology task. "A skirmish happened last night — read the logs, brief us." |
| **Quadrants** | Riders / Scribes / Healers / Infantry — the four divisions of Basgiath. | Squad role specialization. In a multi-task sequence, a squad can field its members in different "quadrants" — Scribe writes the report, Healer reviews coverage, Rider attacks the system, Infantry runs regression. Maps to real QA role differentiation (manual / automation / lead / dev-test) without forcing it. |

### Forced / cringe mappings to avoid

- **Calling participants "cadets"** every time. Once is fine; on every screen it's a tax.
- **"Bond with your dragon" as a metaphor for picking a tool.** Too saccharine. Skeptical adults gag.
- **Sword-fighting / physical combat metaphors for code review.** Doesn't map cleanly and feels forced.
- **Dragon names assigned to test cases.** Cute the first time, exhausting by minute 20.
- **Romance subplot referenced in any QA prompt.** Even Yarros readers don't want their bug report to reference Xaden's abs.
- **Asking participants to speak in-character.** This is the trap. The lore is wrapper, not script. People should never be asked to *perform* the role — only to *interpret tasks through* the role.

### How heavy to lean on lore

Rule: **lore is the visual and naming layer; the task is the work.** A submission form titled "Battle Brief — Incident Report" with normal QA fields is good. A submission form that requires you to write your bug report as a letter to your dragon is bad.

The split should feel like *Slay the Spire* with QA-themed cards — the framing is consistent and pretty, but you're playing a deck-building game, not "being a cleric."

---

## Track 5 — Five flagship tasks (the proposal)

This replaces the current P08-P14 practice block with five tasks across ~80 minutes. Reuses existing infrastructure (XP, leaderboard, Supabase realtime, Claude evaluation, MCP). Each task escalates stakes. Squads of 4-5 (so 6-12 squads at 30-50 attendees).

### 1. THRESHING — "The matching ceremony" (10 min)

**Real QA work:** match test cases to features. Given a list of 8 features (with brief specs) and 16 test cases, identify which test cases correctly cover which features, which are duplicates, which are gibberish, which are subtly wrong.

**Mechanic:** speed + accuracy. Drag-and-drop matching UI. AI-graded against ground truth. Each squad gets a slightly different shuffled set so collusion doesn't help.

**WAU twist:** when the matching is correct, the feature "bonds" to the test case visually — a small dragon-rider pairing animation (one-time, not repeated). Wrong matches show "rejection" — feature won't bond. This is the only place lore should go full theatrical, because it's the opening and people need a hook.

**Time:** 10 min.
**How character archetypes affect approach:**
- *Violet (analytical, rule-bending):* notices when the rules let her bond a test to multiple features.
- *Xaden (strategic, dominant):* sweeps the high-value matches first, leaves marginal ones.
- *Rhiannon (relational, supportive):* spots which features have no good coverage and flags coverage gaps.
- *Ridoc (witty, lateral):* finds the gibberish test cases fastest.
- *Liam (loyal, methodical):* highest accuracy, slower throughput.
- *Imogen (sharp, hard-edged):* aggressively rejects bad matches others let slide.
**AI evaluation:** trivial — deterministic ground truth.
**Tech effort:** Low. Drag-drop UI, single-screen.
**WAU rating:** 6/10. Solid opener, not the highlight. Job is to wake people up and signal "this isn't a quiz."

---

### 2. GAUNTLET — "The escalating climb" (15-20 min)

**Real QA work:** bug bash on the existing sample-project, but bugs are tiered and the squad's Gauntlet "altitude" rises with each correct find.

**Mechanic:** Jeopardy-style CTF format adapted ([SQA CTF model](https://ctf-00-the-demo.hurayraiit.com/)). 4 tiers of bugs, harder = more points:
- Tier 1 (50 pts each, 5 bugs): UI / cosmetic
- Tier 2 (100 pts, 4 bugs): functional, low-severity
- Tier 3 (200 pts, 3 bugs): logic / edge case
- Tier 4 (500 pts, 2 bugs): security / data integrity

Each bug has a flag code. Squad finds bug → submits flag + bug report → AI grades report against rubric → flag awarded. **First-blood bonus 50%** on each tier.

**WAU twist:** the leaderboard shows squads as climbing the Gauntlet visually. When a squad gets a Tier 4, a "thunderstrike" notification fires for everyone. Live drama.

**Time:** 15-20 min.
**Character archetypes:**
- *Violet:* Tier 4 specialist — the rules-lawyer who finds the data-integrity bugs.
- *Xaden:* triages — picks high-value tiers first, ignores Tier 1.
- *Rhiannon:* clears Tier 1-2 fast, builds squad momentum.
- *Ridoc:* Tier 3 pattern-spotter.
- *Liam:* completionist — wants to clear every tier.
- *Imogen:* scorched-earth — finds the cosmetic bugs others missed because she's brutal.
**AI evaluation:** flag deterministic; bug report AI-graded against rubric (clarity, repro steps, severity, expected/actual). Rubric LLM is well-validated ([promptfoo llm-rubric](https://www.promptfoo.dev/docs/configuration/expected-outputs/model-graded/llm-rubric/)).
**Tech effort:** Medium. Need flag system + planted bugs (already partly there) + tiered scoring + live "first blood" notifications via Supabase realtime.
**WAU rating:** 8/10. Core flagship task. Combines real exploratory testing with CTF mechanics.

---

### 3. WARDS — "The breach" (15 min)

**Real QA work:** regression testing under time pressure with a planted regression mid-task.

**Mechanic:** each squad gets a regression suite of 12 test cases against a known-good build. They run them. Halfway through (at the 7-minute mark, theatrically announced as "the wards have been breached"), the facilitator pushes a regression to the sample app. Squads have to detect which test now fails, root-cause it from logs, and submit a bug report with regression test recommendation.

**WAU twist:** the breach is announced live to everyone simultaneously — leaderboard pauses, screen flashes red, music cue. First squad to correctly identify the regression gets first-blood + the visual "ward holder" badge for the rest of the workshop. This is borrowed directly from [chaos engineering game days](https://www.techtarget.com/searchsoftwarequality/tip/How-to-set-up-a-chaos-engineering-game-day) — "shut down a service without warning, observe response."

**Time:** 15 min (7 min regression + breach + 8 min response).
**Character archetypes:**
- *Violet:* fastest log-archaeologist; reads the stack trace.
- *Xaden:* delegates ruthlessly — splits squad into "test runners" and "log readers" before the breach.
- *Rhiannon:* clearest bug report — best AI rubric score.
- *Ridoc:* lateral thinker, tries the obvious-but-wrong hypothesis fast and rules it out.
- *Liam:* methodical re-runs — isolates the regression precisely.
- *Imogen:* aggressive — tries to weaponize the regression to find adjacent issues.
**AI evaluation:** detection (deterministic — which test failed), root cause (rubric-graded against known cause), regression test proposal (rubric-graded for technical soundness).
**Tech effort:** Medium-high. Need staged deploy + Supabase event for the breach + scoring logic. But the reward — the live theatrical moment — is worth the build.
**WAU rating:** 9/10. This is the task people will tell their colleagues about.

---

### 4. SIGNET DUEL — "Squad vs squad with venin" (20 min)

**Real QA work:** adversarial test design + peer review + social deduction. Two phases.

**Phase A (10 min):** each squad writes 5 test cases for a small assigned feature (e.g., login form, in-app purchase flow). **One squad member is secretly assigned the role of "venin"** — their hidden goal is to introduce a subtly bad test case that *passes* peer review. The squad doesn't know who, or even if there is one (some rounds have no venin to keep it honest).

**Phase B (10 min):** squads exchange test suites. Receiving squad must (a) execute the tests, (b) evaluate quality, (c) flag any "venin" they suspect. Submitting squad reveals if there was a venin and who.

**Mechanic:** dual-layer — adversarial test design (Codeforces "hack the submission" style — see [Codehacks](https://arxiv.org/html/2503.23466v1)) plus social deduction (Mafia/Werewolf — see [Tabletop Trove](https://tabletoptrove.com/werewolf-game-history-how-mafia-became-social-deduction-king/)). Scoring asymmetric:
- If venin existed and was caught: defending squad +200, venin -100, attacking squad +200.
- If venin existed and slipped through: defending squad +500 (huge — they fooled everyone), attacking squad -100, venin's individual score +300.
- If no venin and attacking squad guesses correctly: attacking +300.
- If no venin and attacking squad falsely accuses: -200.

**WAU twist:** the social deduction layer. Engineers cannot resist this. Reveals are theatrical: "Was Squad Imogen-3 venin? Yes. Who? Liam-2 — he wrote test case #4 with a deliberately wrong assertion." Liam-2 stands up, takes a bow.

**Time:** 20 min.
**Character archetypes:**
- *Violet:* best at writing the venin test cases (subtly wrong) — gets disproportionate venin assignments.
- *Xaden:* best at squad management when defending — sets up review pairs.
- *Rhiannon:* hardest to fool when reviewing — her supportive style means she actually reads everything.
- *Ridoc:* loves the deception layer; will volunteer for venin.
- *Liam:* refuses to be venin (loyalty is core to him); penalty if assigned.
- *Imogen:* most likely to false-accuse — she's hard-edged and suspicious.
This is a place where the personas really sing — the archetypes' attachment styles drive their play differently.
**AI evaluation:** test case quality AI-graded against rubric. Detection of venin is binary against ground truth. Social-deduction scoring is mechanical.
**Tech effort:** Medium. Squad-internal role assignment via Supabase, exchange UI, reveal page. But mostly UI — the AI grading is straightforward.
**WAU rating:** 10/10. This is the headline task. The thing people quote later.

---

### 5. BATTLE BRIEF — "The skirmish report" (15-20 min)

**Real QA work:** log archaeology, root cause analysis, regression test proposal, comms write-up.

**Mechanic:** each squad gets an "incident packet" — production-style logs + 2-3 user complaints + a partial system diagram. They have 12 minutes to (a) identify the incident, (b) propose a root cause, (c) write a brief incident report (5-section template), (d) propose 2 regression tests that would have caught it.

After 12 min, **squads vote** on which other squad's brief is best. AI also scores all briefs against a rubric. **Winner = best combined score (peer vote + AI rubric).** Mismatch between peer and AI is itself a teaching moment — the facilitator surfaces a brief where humans loved it but AI scored it low (or vice versa) and discusses why.

This task incorporates the [Ministry of Testing bug hunt prize structure](https://www.ministryoftesting.com/articles/94e3fd44) — Best Bug Oscar-style nomination.

**WAU twist:** the incident packet contains a piece of "lore" — a fictional Battle Brief from a previous skirmish, written in-world but containing real QA principles. Reading it is rewarded with bonus context. (This is the only place where "in-world writing" appears, and it's optional — opt-in, not required.)

**Time:** 15-20 min.
**Character archetypes:**
- *Violet:* tightest writing, best AI rubric score on brief structure.
- *Xaden:* command-presence brief — clear, decisive, may sacrifice nuance.
- *Rhiannon:* highest peer-vote scores — relatable, well-explained.
- *Ridoc:* finds the funniest detail in the logs and cleverly weaves it in.
- *Liam:* most thorough regression test proposal.
- *Imogen:* harshest tone, but tightest analysis — divisive.
**AI evaluation:** rubric on 5 axes (incident clarity, RCA correctness, regression proposal soundness, completeness, professionalism). Peer voting is the existing P13 mechanic, repurposed correctly.
**Tech effort:** Low-medium. Reuses peer-vote infrastructure. Need carefully-crafted incident packets (~3 variants for variety).
**WAU rating:** 8/10. Strong closer because it's the most Playtika-realistic task — incident response is what they actually do.

---

### Bonus task (optional, if time): SHADOW WIELDER — flash break

**Real QA work:** rapid feature break attempt.

**Mechanic:** the whole room sees a tiny feature on screen. 7 minutes. Submit your best break. AI ranks against creativity + severity. Top 3 read aloud, demoed live by facilitator. This is the "you have 7 minutes to break this" format from §3.

**Time:** 10 min. Use as filler if other tasks finish early.
**WAU rating:** 7/10. Light, theatrical, palette-cleansing.

---

### Total time budget

| Task | Min | Cumulative |
|---|---|---|
| Threshing | 10 | 10 |
| Gauntlet | 18 | 28 |
| Wards | 15 | 43 |
| Signet Duel | 20 | 63 |
| Battle Brief | 18 | 81 |
| (Buffer for facilitator transitions, reveals, brief explanations) | 8 | 89 |

Fits 80-90 min target. Headroom by dropping Battle Brief to 15 min if needed, or skipping the optional Shadow Wielder.

### What this proposal kills from the current set

- **P08 (slash command for test cases):** absorbed into Threshing and Signet Duel — both involve writing/evaluating test cases as part of richer mechanics.
- **P09 (find a bug, submit via slash command):** absorbed into Gauntlet, which is the same task with CTF mechanics layered on.
- **P11 (MCP demo):** keep as a standalone demo *outside* the practice block (5 min showcase). MCP is impressive enough as a demo that it doesn't need a task. Forcing participants to use Playwright via MCP under time pressure would be cruel — too many things go wrong.
- **P12 (quiz):** kill. Quizzes are flat. The knowledge it tests should be acquired through the tasks.
- **P13 (war games as 1-vs-1 vote):** repurposed into Battle Brief peer vote, where it's actually doing useful work — voting on best incident report, not on "which submission do you like more" (which is shallow).
- **P14 (leaderboard reveal with podium):** keep. Move to end of Battle Brief. Add character signet reveals — top-3 in each archetype, not just overall, so more people land on a podium.

### What this proposal preserves from the current set

- XP / badges / leaderboard infrastructure.
- Supabase realtime (used heavily for live breaches and first-blood notifications).
- Character archetypes (heavily — they drive task variation).
- AI rubric grading (extended to more rubrics).
- Sample-project (extended with planted regressions and a Tier 4 security bug).

---

## Track 6 — Anti-patterns

### What kills these workshops, in priority order

**1. Fake AI judging.** If Claude grades a submission and says "Great work! Excellent test cases!" when they're mediocre, trust evaporates in 30 seconds. Skeptical QA will probe this within minutes by submitting deliberate trash. The AI MUST be willing to say "this submission is below the rubric — here's why." The [Hoxhunt critique](https://hoxhunt.com/blog/gamified-cyber-security-training) of shallow gamification names this directly: "shallow gamification optimizes for activity signals instead of competence." If the AI is sycophantic, the gamification is shallow. **The AI grader's prompt must include "be willing to score 2/10 if warranted."**

**2. Made-up stakes.** Points that don't tie to anything become noise. The current XP system is at risk of this. Counter: tie XP to *something the participant takes home*. Examples: top-3 across leaderboard get a real prize (book, swag, dinner). Top-1 in each archetype gets a callout in the post-workshop summary email. Otherwise the points feel like Chuck E. Cheese tickets. [Hacker News engineers explicitly call out](https://news.ycombinator.com/item?id=33309969) that "GitHub has turned into a social network...gamified elements are encouraging people to work for free" — meaning meaningless points feel exploitative.

**3. Childish role-play.** Asking participants to *speak* as their character is the cringe trigger. The line: lore as visual/naming wrapper = good; lore as performance requirement = bad. Never ask "what would Xaden say?" in a prompt. Test cases are written in normal English. Bug reports have normal fields. The character only affects *how they approach* the task, not *how they write* the answer.

**4. Participation badges.** "Welcome aboard, Cadet!" badge for showing up = signals "this is for kids." See Hoxhunt critique above. All badges should require a measurable accomplishment, even if low (e.g., "First Blood — first squad to ship a Tier 1 bug" is fine; "Workshop Attendee" is not).

**5. Punishment for low confidence.** Booby Prize for *duplicate* submission is fine — it's playful, self-aware, and rewards everyone before it. "Lowest scorer does a forfeit" is not — it punishes the people who came in least confident, which is exactly the opposite of what an inclusive workshop should do. **Mock the work, never the worker.**

**6. Format inversion (process over output).** Spending 5 min explaining a task that lasts 7 min is the death zone. Each task in §6 should have a 60-second briefing max — anything longer means the task is too complicated for a workshop slot. Prep visuals are a great forcing function: if you can't fit the rules on one slide with a clear scoring formula, the task is too complex.

**7. Tech failure as content.** If the MCP server takes 2 min to start, or the AI grader is slow, or Supabase realtime stalls — the gamification collapses. Have explicit fallback paths for every task. Pre-warmed MCP servers. AI grading with a 15-second timeout and a "facilitator override" button. Rehearse the breach in Wards 5x before workshop day.

**8. Lore overdose.** First 3 mentions of "Threshing" are fun. The 30th is exhausting. Use the lore terms as headers and once in flavor text, then drop into normal QA vocabulary. Compare: "Run the regression suite on the Wards" (fine) vs "As a Cadet of the Riders Quadrant, your bonded dragon Tairn calls upon you to fortify the Wards by executing the regression suite assigned by your Squad Leader" (lethal).

**9. Asymmetric prep that punishes newcomers.** If a task assumes deep Fourth Wing knowledge, half the room is locked out. Always provide a one-line primer: "Threshing — the matching ritual where dragons choose riders. Here, test cases are choosing the features they cover." Then move on.

**10. Single-axis scoring.** Pure speed = sloppy. Pure quality = boring. Always score on at least 2 axes (speed × quality, or coverage × accuracy, or detection × write-up). [Ministry of Testing's bug bash format](https://www.ministryoftesting.com/articles/94e3fd44) does this naturally: most bugs (speed), best bug (quality), Booby Prize (anti-quality). Multi-axis scoring lets multiple archetypes win different things — which is what character-based gamification needs.

### Specific things skeptical QA will roll their eyes at, observed in industry

From the [Hacker News thread](https://news.ycombinator.com/item?id=33309969) and [Hoxhunt critique](https://hoxhunt.com/blog/gamified-cyber-security-training):

- "We've added blockchain badges that you can mint." (Bolt-on novelty.)
- "Earn dragon coins that you can spend on..." (Fake currency with no use.)
- "The AI evaluates your *creativity* in bug-finding!" (Subjective AI grading is widely distrusted; only use AI grading on rubric-mappable axes.)
- "Roleplay as your character would!" (Already covered.)
- Long mandatory tutorials ("Watch this 10-minute lore video before starting.") Cut to the work.
- Recap videos of "what we accomplished today!" with cheerful music. Engineers feel managed-at.

### Specific things they will respect

- **Their bug being publicly demoed by the facilitator.** ("Squad Imogen-3 found a Tier 4 bug nobody else found — let me show what they did.") Public competence recognition.
- **A leaderboard that shows real-time relative position.** Not a final reveal. Live updating creates genuine drama.
- **A facilitator who says "I don't know — let's run it."** Live debug. This is theater of competence done right.
- **Acknowledging task difficulty honestly.** "Tier 4 is hard. Most squads will not find it. That's fine."
- **Real prizes that signal taste.** A book they'd actually read. A piece of merch their team would notice. Not a $5 gift card.

---

## Sources

- [Bug bash — Wikipedia](https://en.wikipedia.org/wiki/Bug_bash)
- [How We Ran A Bug Hunt — Ministry of Testing](https://www.ministryoftesting.com/articles/94e3fd44) — concrete format details
- [War Games Method in Software Testing — Devlane](https://www.devlane.com/blog/war-games-method-software-testing) — concrete war games format
- [Octalysis Framework — Yu-kai Chou](https://yukaichou.com/gamification-examples/octalysis-gamification-framework/) — 8 core drives, white-hat vs black-hat
- [Hacker News on GitHub gamification](https://news.ycombinator.com/item?id=33309969) — engineer criticism source
- [Hoxhunt — Does Gamified Cyber Security Training Actually Work?](https://hoxhunt.com/blog/gamified-cyber-security-training) — critique of shallow gamification
- [SQA CTF 2026 demo](https://ctf-00-the-demo.hurayraiit.com/) — QA-adapted CTF format
- [Pwning OWASP Juice Shop — Hosting a CTF event](https://pwning.owasp-juice.shop/companion-guide/latest/part4/ctf.html) — flag/score server architecture
- [Hands-On Web Security: Capture the Flag with OWASP Juice Shop — Mozilla Hacks](https://hacks.mozilla.org/2018/03/hands-on-web-security-capture-the-flag-with-owasp-juice-shop/) — 4-hour format validation
- [Chaos engineering game day — TechTarget](https://www.techtarget.com/searchsoftwarequality/tip/How-to-set-up-a-chaos-engineering-game-day) — live break-in mechanics
- [Mafia (party game) — Wikipedia](https://en.wikipedia.org/wiki/Mafia_(party_game)) — social deduction history
- [Werewolf Game History — Tabletop Trove](https://tabletoptrove.com/werewolf-game-history-how-mafia-became-social-deduction-king/) — Silicon Valley adoption
- [Death Stranding Social Strand System — Fandom Wiki](https://deathstranding.fandom.com/wiki/Social_Strand_System) — asynchronous social mechanics
- [Codehacks — adversarial tests on Codeforces — arXiv](https://arxiv.org/html/2503.23466v1) — hack-the-submission format
- [LLM Rubric — Promptfoo](https://www.promptfoo.dev/docs/configuration/expected-outputs/model-graded/llm-rubric/) — rubric-based AI grading
- [Rubric Is All You Need — arXiv 2503.23989](https://arxiv.org/html/2503.23989v1) — LLM rubric grading research
- [Fourth Wing — Empyrean Wiki](https://the-empyrean-series.fandom.com/wiki/Fourth_Wing) — lore canonical
- [Basgiath War College Map Explained — Literary Lifestyle](https://theliterarylifestyle.com/basgiath-war-college-map/) — Parapet, Gauntlet, Threshing details
- [Fourth Wing Signets Guide — The Book Feed](https://thebookfeed.com/fourth-wing-guide/fourth-wing-signets-complete-guide-to-every-riders-signet/) — signet system
- [Venin and Wards explainer — The Book Feed](https://thebookfeed.com/fourth-wing-guide/venin-and-wyvern-in-fourth-wing/) — venin / wards
- [Playtika QA careers](https://www.playtika.com/careers/qa/) — context on audience
- [Mobile Game Testing panel — Apptim](https://blog.apptim.com/mobile-game-testing-qa-panel/) — Playtika challenges (capacity testing on logs)
- [Advances and Challenges in Log Analysis — ACM Queue](https://queue.acm.org/detail.cfm?id=2082137) — log analysis as core QA skill
- [Code Review Interview — Exponent](https://www.tryexponent.com/blog/how-to-ace-a-code-review) — blind code review evaluation criteria
