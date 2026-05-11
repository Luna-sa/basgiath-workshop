# Research 2026-05-11 — Competition Ideas for QA Workshop

**Context.** 90-min QA workshop, 20-30 participants, Empyrean / Fourth Wing thematic frame. Two competitions already locked:

1. **Bond Ritual + Aerie voting** — gpt-image-2 dragon portraits, live gallery, one vote each, winner gets "Signet of the Sky."
2. **Arena** — programming a dragon bot, final battle on projector.

This doc proposes **12 more competition ideas**. Each is judged on the four criteria the brief asked for: reveals skill/insight, has a tight viewable moment, can produce a memorable rivalry, reinforces the Claude Code stack participants just installed.

Top-3 picks for actual implementation are flagged at the end. Marked with **[PICK]** inline.

---

## 1. The Quickening — First Bond (speed install)

- **Empyrean flavour:** "Время первого касания. Чей дракон отзовётся первым?"
- **Competing on:** Speed + ability to follow paste-and-run instructions cleanly. Skill (not luck) — those who paid attention to pre-work win.
- **Format:** Live one-shot. The instant facilitator says "go," every participant pastes the master ecosystem prompt into Claude Code. First three to report a successful `claude /doctor` (or equivalent verification command) green-tick screenshot in chat take 1st/2nd/3rd. Tied breaks go to whoever finished cleanest (no errors mid-install).
- **Viewable moment:** Live announcement toast cascade as people finish — "Liam crossed the parapet. 1 minute 47 seconds." Projector shows a real-time leaderboard sorted by completion time.
- **Wow factor:** 6/10. Not cinematic, but produces immediate buzz and a clear winner before anyone has time to feel lost.
- **Cost:** **Low.** Reuse existing "Live Announcement" + manual XP. Add one column to `students` table: `ecosystem_install_completed_at`. Trigger a Realtime toast when set.
- **Where in 90-min arc:** T+15 to T+25, during the ecosystem install block. This is the moment that converts cynics — they see speed = mastery, not luck.
- **Prize / signet:** "First to Cross the Parapet" — small, named on graduation slide.
- **Reinforces:** the install pathway they'll use again at home.

---

## 2. Signet of Iron Sight — Bug Bash with Hidden Truth **[PICK]**

- **Empyrean flavour:** "Венин планирует атаку. Найдите трещины в защитных рунах раньше остальных."
- **Competing on:** Insight + speed. Skill-heavy. Whoever knows their craft wins.
- **Format:** Running tally over 12 minutes. Sample project is pre-loaded with 8 planted bugs (3 obvious, 3 medium, 2 subtle). Each bug has a hidden flag code (OWASP Juice Shop pattern — see `RESEARCH_2026-05-07_tasks_gamification.md` §1.3). When a participant finds a bug, they submit `bug_id + flag_code` via a dedicated `/bugs` panel. Score = severity-weighted (subtle = 5, medium = 3, obvious = 1). First-blood bonus on each bug (+2 points).
- **Viewable moment:** Live leaderboard on projector, ticker-tape of submissions: "Patricia found *Tarnished Ward* (medium). +3 to Crimson Wing." Last 30 seconds is theatrical — fastest scoring period of any block.
- **Wow factor:** 9/10. Real bug, real ticker, real rivalry. Engineers know when they're being tested.
- **Cost:** **Med.** Need: (a) plant 8 bugs in sample-project; (b) generate per-bug flag codes; (c) a single new Supabase table `bug_finds` with `student_id`, `bug_id`, `flag_code`, `found_at`; (d) leaderboard widget on facilitator screen. Probably 1 full day of dev.
- **Where in 90-min arc:** T+40 to T+55, the practice-task slot. Replaces or augments the P08/P09 slot Настя already has.
- **Prize / signet:** "Signet of Iron Sight" — branded with the Wards lore.
- **Reinforces:** the slash commands they just installed for finding bugs + the MCP/Playwright stack. They use Claude Code to hunt the planted bugs, so the competition rewards "did you actually configure your dragon properly?"

---

## 3. The Threshing of Minds — Best CLAUDE.md (Claude-judged)

- **Empyrean flavour:** "Дракон выбирает достойного. Кто говорит языком, который дракон признает?"
- **Competing on:** Creativity + self-knowledge. The persona-builder output gets judged not on length, but on **specificity, coherence, and one signature override line**.
- **Format:** Facilitator-judged via Claude. After persona-builder block, all generated CLAUDE.md files are submitted (already in `students.persona_answers`). A single Claude prompt with a rubric (see `RESEARCH_2026-05-07_tasks_gamification.md` §1.2 on LLM-rubric grading) scores all submissions on three axes: distinctiveness (1-10), behavioral specificity (1-10), and "would I want this partner" (1-10). Top 3 read aloud.
- **Viewable moment:** The top-3 reading. Three participants read their `override` line and one ritual aloud. Audience hears why this CLAUDE.md is different from generic AI-output. 2-3 minutes total.
- **Wow factor:** 7/10. The reading moment is intimate and culture-shifting — proves persona is a real lever, not theater.
- **Cost:** **Low to Med.** Claude API call with a rubric prompt over N submissions = one script. Display logic is already there (admin can broadcast).
- **Where in 90-min arc:** T+50 to T+55, immediately after persona-builder. Becomes the persona-showcase moment Настя already has planned (see WORKSHOP_STATUS §3) but with a competitive layer.
- **Prize / signet:** "Voice of the Bond" — winner gets named.
- **Reinforces:** the persona system. Best way to motivate people to actually fill it in instead of clicking through.

---

## 4. Eyes of the Aerie — Blind Match (rider-to-dragon)

- **Empyrean flavour:** "Каждый дракон выбирает rider'а в полёте. Угадай чей."
- **Competing on:** Wisdom + observation. Pure insight game. You win if you read people well.
- **Format:** Blind one-shot vote. After the Bond Ritual gallery is built, the projector shows 6-10 dragons (anonymized) side-by-side with 6-10 nickname tags below in random order. Everyone gets 60 seconds to drag-match (or write their guesses in a Google Form / simple page). Winner = most correct matches. Tie-break: speed.
- **Viewable moment:** The reveal. One by one, the correct mapping snaps into place with confetti. The room reacts to which matches were obvious and which were surprises ("How did THAT person make THAT dragon?!").
- **Wow factor:** 8/10. Social, funny, slightly embarrassing for the people whose dragons were "obvious." Memorable.
- **Cost:** **Med.** Need a matching UI (can be a single new page `/?page=match` reading from the dragons table). Probably 1 day.
- **Where in 90-min arc:** T+30 to T+35, immediately after Bond Ritual gallery is shown. Bridges the Bond Ritual into the rest of the workshop instead of letting the gallery be a one-and-done.
- **Prize / signet:** "Seer of the Aerie" — single winner.
- **Reinforces:** the prompting they used to generate dragons (since people learn from seeing which prompts produced which results).

---

## 5. Wing vs Wing — Adversarial Bug Plant **[PICK]**

- **Empyrean flavour:** "Два крыла. Один сажает яд в код, второй пытается вытащить его до полёта."
- **Competing on:** Skill + sneakiness on offense, insight on defense. Two distinct skills judged in one round.
- **Format:** Paired teams. 20-30 participants splits into 2 wings of ~10. Each wing gets 8 minutes to *plant* a single bug in their sample-project copy using Claude Code (write code that introduces a subtle regression). Then wings *swap* repos. Each wing has 10 minutes to find the planted bug using Claude Code. First wing to identify the planted bug correctly wins; bonus if the planted bug was so subtle the other wing failed entirely.
- **Viewable moment:** The reveal — each wing's planter walks the room through what they planted while the room watches the loser's last attempt to find it. 3-minute drama.
- **Wow factor:** 10/10. This is the format that generates legendary stories. Specifically designed to create rivalry between two named wings.
- **Cost:** **Med-High.** Need: (a) sample-project must support clean isolated copies per wing; (b) submission mechanism for "the bug we planted is in file X, line Y, expected behavior was Z, our break was W"; (c) judging logic (can be human-judged at this scale, 1 minute review each). Probably 1.5 days dev + facilitation prep.
- **Where in 90-min arc:** T+55 to T+75, the deep-practice slot. Could *replace* a slot or run instead of one of the QA practice tasks.
- **Prize / signet:** Two prizes — "Venin's Quill" (best plant) and "Wardstone Eye" (best hunt). The losing wing gets named "Sown with Iron" or similar (mild, fair).
- **Reinforces:** the full Claude Code stack — they use slash commands to plant, MCPs to read repos, agents to hunt. This single block exercises 80% of what they just learned.

---

## 6. Hundred Errors Endurance — Last Dragon Flying

- **Empyrean flavour:** "Сто ошибок в небе. Кто продержится дольше всех?"
- **Competing on:** Skill + endurance. Resilience under cascading failure.
- **Format:** A modified Arena round (reuses existing infrastructure) where the arena randomly injects "errors" (sudden wind, false stars, fuel drops, mid-flight API timeouts simulated by 100ms input freezes) every 5 seconds. Time-trial: which submitted bot survives longest. Single round, all bots fly at once on projector.
- **Viewable moment:** The screen — dragons dropping out one by one until 1-2 remain. Final 10 seconds is unbearable to watch.
- **Wow factor:** 8/10. Visual carnage. Survivor gets celebrated.
- **Cost:** **Low.** Existing arena infrastructure already supports the bot API — just add an "endurance mode" flag that perturbs the environment. ~3-4 hours dev.
- **Where in 90-min arc:** T+80, alternative or addition to the main Arena final battle. Run BEFORE the main battle as a warm-up to thin out unstable bots.
- **Prize / signet:** "Iron Wings" or "Last Bonded Standing."
- **Reinforces:** robust bot design — pushes people to write defensive code, not just optimal-path code. Reinforces the testing mindset.

---

## 7. Twin Flame Duel — Direct 1v1 Arena Bracket **[PICK]**

- **Empyrean flavour:** "Один на один. Дракон против дракона. Без свидетелей в небе."
- **Competing on:** Skill. Pure bot strategy + iteration speed.
- **Format:** Single-elimination bracket using the existing Arena, but matches are 1v1 instead of 6-rider melee. Bracket auto-generates from top 8 submissions (or however many people submit). 30-second matches. Whole bracket runs in ~5 minutes on projector. Each match shows two dragons head-to-head with their owners' nicknames over them.
- **Viewable moment:** The bracket itself. Visible "X beats Y" lights up like a tournament. Final match is theatrical.
- **Wow factor:** 9/10. Bracket format is universally legible. Creates 2-3 named rivalries naturally.
- **Cost:** **Med.** Need: 1v1 arena mode (existing arena supports n riders, just configure for 2); bracket UI + advancement logic; 30-sec match timing. ~1 day dev.
- **Where in 90-min arc:** T+78 to T+85. Replaces or precedes the existing all-6 final battle. The all-6 fight feels like a chaos test; a 1v1 bracket feels like a championship.
- **Prize / signet:** "Champion of Basgiath."
- **Reinforces:** the Arena/bot stack participants are already using. Doubles down on Claude Code as the tool that made the winning bot possible.

---

## 8. Codex of Ash — Funniest CLAUDE.md Override

- **Empyrean flavour:** "Древний свиток. Самая дерзкая строка в нём слышна громче всех."
- **Competing on:** Creativity + humor. Pure flavor competition.
- **Format:** Blind vote. After the persona-builder block, every participant's `override` line (the "what NEVER to do" rule) is extracted, anonymized, and put on a single slide. Everyone gets 60 seconds and 2 votes each. Most-voted line wins. This is the "Booby Prize" energy from Ministry of Testing — light, social, low-stakes.
- **Viewable moment:** Reading the top 5 aloud, in dramatic Highland voice if facilitator commits to the bit.
- **Wow factor:** 6/10. Lighter than the others but absolutely produces a story.
- **Cost:** **Low.** Reuse persona_answers field, single new page for voting. ~3 hours.
- **Where in 90-min arc:** T+88, in the closing — a moment of laughter to send people out on. Or T+50, as part of the persona showcase round.
- **Prize / signet:** "Voice of the Stones" — small. Maybe a sticker.
- **Reinforces:** that persona detail matters and is rewarded.

---

## 9. Ascendance Trial — Fastest Passing Test **[PICK]**

- **Empyrean flavour:** "Восхождение. Первый, кто доберётся до вершины с зелёным щитом."
- **Competing on:** Skill, speed, and ability to direct Claude Code precisely. Reveals who *uses* the tool vs. who *operates* it.
- **Format:** Time-trial. Facilitator announces the target: a specific feature in the sample-project that needs a passing Playwright (or similar) test written for it. Everyone starts at the same moment. First three to commit a passing test with their nickname in the commit message win. Whole thing is a 10-minute sprint.
- **Viewable moment:** A live test-runner dashboard on projector showing nicknames + test status (red/yellow/green) updating every 5 seconds. As tests pass, the row glows. First green row triggers a chime + confetti.
- **Wow factor:** 9/10. This is the demo of "Claude Code as productivity multiplier" in pure form. Engineers respect the format.
- **Cost:** **Med-High.** Need: (a) per-participant isolated workspace OR shared workspace with branch-per-participant; (b) auto-runner that polls each workspace and reports test status; (c) live dashboard reading from runner state. ~2 days dev. The polling/isolation is the hard part.
- **Where in 90-min arc:** T+45 to T+55, as the main practice block. Replaces or runs alongside one of the existing tasks.
- **Prize / signet:** "First Light on the Cliffs" — top 3 named.
- **Reinforces:** the entire stack at once — slash commands, MCP-Playwright, agents, CLAUDE.md persona-tuning. It's the ultimate "did you actually set this up correctly?" test.

---

## 10. Veil of the Ancients — Predict the Battle

- **Empyrean flavour:** "Старцы видят битву до того, как драконы взлетают. Кто видит верно?"
- **Competing on:** Insight + meta-observation. Pure prediction skill — who reads code well enough to forecast which bot wins?
- **Format:** Before the Arena final battle, all 6-8 submitted bots are listed on a slide with one-line strategy descriptions (auto-generated by Claude reading the bot code). Each participant ranks the bots 1 through N predicting finish order. Scoring: full points for exact match, partial for top-3 correct, none for completely wrong. Predictions submitted via simple page.
- **Viewable moment:** When the final battle resolves, the screen shows top predictors with their score next to actual finish order. "Sophie predicted exactly. +50 XP."
- **Wow factor:** 7/10. Adds suspense to the existing finale instead of competing with it. Multiplies engagement during the Arena watch.
- **Cost:** **Low-Med.** Need: prediction submission page + Claude-summary of each bot + scoring logic. ~6-8 hours.
- **Where in 90-min arc:** Predictions taken T+78. Reveal during/after the Arena final at T+82-85.
- **Prize / signet:** "Veil-Sight" — single winner.
- **Reinforces:** code reading and understanding bot strategies — which is exactly the meta-skill of working alongside Claude Code.

---

## 11. The Whisper Test — Best Single-Shot Prompt

- **Empyrean flavour:** "Один шёпот. Дракон делает что просят, или ломает крыло."
- **Competing on:** Creativity + prompt craft. Skill in compressed-input land.
- **Format:** Live one-shot. Facilitator gives a task in plain English ("Generate 10 edge-case test cases for a login form that handles email, OAuth, and SSO"). Every participant has exactly 90 seconds to craft a single Claude Code prompt and submit the output. Outputs anonymized, projected side by side. Audience votes (or rubric-Claude scores).
- **Viewable moment:** The grid of outputs. You can *see* who knows what they're doing within 5 seconds of looking at the structure.
- **Wow factor:** 7/10. Tight format, fair contest, reveals skill quickly.
- **Cost:** **Low-Med.** Need: prompt submission + output rendering page + voting. ~1 day.
- **Where in 90-min arc:** T+60-65, as a fast change-of-pace between deeper tasks.
- **Prize / signet:** "Tongue of the Bond."
- **Reinforces:** prompting skill — the #1 lever for QA effectiveness with AI.

---

## 12. Stoneflame Vault — Treasure Hunt (Easter eggs)

- **Empyrean flavour:** "Под Басгиатом — тайные руны. Найди их, прежде чем рассвет."
- **Competing on:** Curiosity + thoroughness. Skill at exploring documentation.
- **Format:** Running tally over the whole workshop. The ecosystem they just installed has 5-7 hidden Easter eggs (e.g., `me.summonSignet()` is already one; could add a hidden slash command, a special CLAUDE.md token, a hidden MCP tool that returns a flag, an undocumented agent name). First to find each Easter egg and report it (via a dedicated "Found a rune" form) gets bonus XP + named. Final tally announced at graduation.
- **Viewable moment:** Live "Runes Found" panel on projector, updated as people submit. Each find gets a toast: "Patricia discovered *Stoneflame Rune of First Light*."
- **Wow factor:** 7/10. Cumulative, not single-moment, but very memorable for those who get drawn into it.
- **Cost:** **Low.** Need: plant the eggs (mostly content work, low code), submission form, tally panel. ~1 day mostly in egg-design.
- **Where in 90-min arc:** Runs throughout, T+15 to T+88. Doesn't take a slot, just adds a parallel layer.
- **Prize / signet:** "Rune-Reader" for the top finder. "Stone-Touched" badges for anyone who found at least one.
- **Reinforces:** documentation reading habit — the single biggest predictor of "did this workshop stick or evaporate by Friday?"

---

## My top-3 picks for actual implementation before May 13

Ranked by impact-per-dev-day given Настя's constraints (2 days max remaining).

### **Pick 1: #5 Wing vs Wing — Adversarial Bug Plant**

This is the one. It hits every criterion the brief asked for and at 10/10 wow factor it generates the legendary story of the workshop. Two named wings against each other, hidden information, big reveal moment, full stack used. Risk: facilitation-heavy — Настя has to keep both wings in sync. But the payoff is the single most memorable block of the day. If you implement only one, do this.

### **Pick 2: #2 Signet of Iron Sight — Bug Bash with Hidden Truth**

Highest insight-per-minute. Validates *real QA skill* in a way the existing Arena (which is creative coding) doesn't. The ticker-tape of bug discoveries on the projector creates real competitive pressure. Lower facilitator load than Wing vs Wing. Reuses the planted-bug infrastructure you'd build for Pick 1 anyway, so if you ship both, Pick 2 costs ~30% incrementally.

### **Pick 3: #7 Twin Flame Duel — Direct 1v1 Arena Bracket**

The Arena is already the most polished part of the workshop. The 6-way melee is great but a 1v1 bracket on top of it is *better TV* and produces the natural rivalries the brief asked for. Replaces the final-melee with something more legible to the audience. Lowest dev cost of the three picks because the arena engine already exists — this is mostly a thin orchestration layer.

### Honorable mention: #12 Stoneflame Vault (Easter eggs)

Almost picked this as #3 — it runs *parallel* to everything else so it costs no time slot, and it rewards the exact behaviour that determines whether participants keep using Claude Code after the workshop. The reason it's not in the top 3: the existing `summonSignet()` egg already does ~60% of what this proposal does. Probably worth a half-day extension of what's already there rather than a fresh build.

---

## Notes on what NOT to add

A few formats I evaluated and rejected:

- **Pure luck competitions** (dragon roll, lottery signet). Skeptical QA audience reads luck as filler. Skip.
- **Long endurance / homework-style competitions** (best CLAUDE.md after 1 week of iteration). Wrong format for live 90-min — too slow to land.
- **Karaoke / physical acting** (read your override in dragon voice with gestures). Crosses Настя's existing line on "no role-play that requires acting out a part." Already documented as anti-pattern in `RESEARCH_2026-05-07_tasks_gamification.md`.
- **Crypto-style time-locked puzzles.** Too brittle for live workshop.
- **Multi-day persistent leaderboards.** Wrong window — workshop is one shot.

— K.
