// Workshop flow — 23 pages.
//
// 🔒 facilitator = locked until facilitator advances (talk slides)
// 🔓 self-report / timed-task = student works independently after unlock
//
// Hidden Gems (id 12) is an overview slide; ids 13–18 are six
// per-gem deep-dive slides (Pixel Agents → MemPalace → suzu-mcp →
// ENABLE_TOOL_SEARCH → Quinn+Jinx → Channels).

export const PAGES = [
  // ═══════════════════════════════════════════
  // PRE-WORKSHOP (self-service)
  // ═══════════════════════════════════════════
  {
    id: 0,
    slug: 'landing',
    phase: 'pre',
    title: 'Академия Басгиат',
    narrativeKey: 'landing',
    gate: { type: 'click' },
    xpReward: 0,
    subSteps: null,
  },
  {
    id: 1,
    slug: 'character-select',
    phase: 'pre',
    title: 'Threshing',
    narrativeKey: 'character_select',
    gate: { type: 'selection', field: 'characterId', message: 'Выбери персонажа', message_en: 'Pick a character', message_uk: 'Обери персонажа' },
    xpReward: 10,
    subSteps: null,
  },
  {
    id: 2,
    slug: 'registration',
    phase: 'pre',
    title: 'Cross the Parapet',
    narrativeKey: 'registration',
    // Gate auto-passes if WorkshopGate already loaded the user via nickname
    gate: { type: 'form', requiredFields: ['name', 'studio', 'role', 'claudeCodeReady'], message: 'Заполни обязательные поля и подтверди готовность Claude Code', message_en: 'Fill required fields and confirm Claude Code is ready', message_uk: 'Заповни обовʼязкові поля та підтверди готовність Claude Code' },
    xpReward: 20,
    subSteps: null,
  },
  {
    id: 3,
    slug: 'prework',
    phase: 'pre',
    title: 'Parapet',
    narrativeKey: 'prework',
    gate: { type: 'checklist', message: 'Установи инструменты', message_en: 'Install the tools', message_uk: 'Встанови інструменти' },
    xpReward: 50,
    subSteps: null,
  },

  // ═══════════════════════════════════════════
  // LIVE WORKSHOP — built around Dragon Arena
  // ═══════════════════════════════════════════

  // 🔒 TALK: What is Claude Code (architecture overview)
  {
    id: 4,
    slug: 'talk-intro',
    phase: 'live',
    title: 'The Bonding',
    narrativeKey: 'talk_intro',
    gate: { type: 'facilitator', message: 'Фасилитатор ведёт рассказ...', message_en: 'Facilitator is talking…', message_uk: 'Фасилітатор веде розповідь…' },
    xpReward: 0,
    subSteps: null,
  },

  // 🔒 TALK: Anatomy — six parts of Claude Code
  {
    id: 5,
    slug: 'talk-evolution',
    phase: 'live',
    title: 'What is your dragon',
    narrativeKey: 'talk_evolution',
    gate: { type: 'facilitator', message: 'Фасилитатор разбирает архитектуру...', message_en: 'Facilitator walks the architecture…', message_uk: 'Фасилітатор розбирає архітектуру…' },
    xpReward: 0,
    subSteps: null,
  },

  // 🔒 TALK: Modes & hotkeys
  {
    id: 6,
    slug: 'talk-modes',
    phase: 'live',
    title: 'Three modes, eight keys',
    narrativeKey: 'talk_modes',
    gate: { type: 'facilitator', message: 'Фасилитатор показывает modes & hotkeys...', message_en: 'Facilitator shows modes & hotkeys…', message_uk: 'Фасилітатор показує modes & hotkeys…' },
    xpReward: 0,
    subSteps: null,
  },

  // 🔓 TASK: Install ecosystem in one prompt
  {
    id: 7,
    slug: 'install-ecosystem',
    phase: 'live',
    title: 'Forging the bond',
    narrativeKey: 'install',
    gate: { type: 'self-report', message: 'Подтверди установку', message_en: 'Confirm installation', message_uk: 'Підтверди встановлення' },
    xpReward: 100,
    subSteps: null,
  },

  // 🔒 TALK: What flew in (review installed pieces)
  {
    id: 8,
    slug: 'talk-ecosystem',
    phase: 'live',
    title: 'What flew in',
    narrativeKey: 'talk_ecosystem',
    gate: { type: 'facilitator', message: 'Разбираем что встало...', message_en: 'Walking through what just installed…', message_uk: 'Розбираємо що встановилося…' },
    xpReward: 0,
    subSteps: null,
  },

  // 🔒 TALK: Power moves
  {
    id: 9,
    slug: 'talk-power-moves',
    phase: 'live',
    title: 'Power moves',
    narrativeKey: 'talk_power_moves',
    gate: { type: 'facilitator', message: 'Фасилитатор разбирает power moves...', message_en: 'Facilitator walks power moves…', message_uk: 'Фасилітатор розбирає power moves…' },
    xpReward: 0,
    subSteps: null,
  },

  // 🔓 SIGNATURE: Build your personal CLAUDE.md from 7 questions
  {
    id: 10,
    slug: 'persona-builder',
    phase: 'live',
    title: 'Your signet emerges',
    narrativeKey: 'persona_builder',
    gate: { type: 'self-report', message: 'Сгенерируй и применить CLAUDE.md', message_en: 'Generate and apply CLAUDE.md', message_uk: 'Згенеруй і застосуй CLAUDE.md' },
    xpReward: 100,
    subSteps: null,
  },

  // 🔒 TALK: MCP demo by facilitator (5 min showcase, no participant task)
  {
    id: 11,
    slug: 'talk-mcp',
    phase: 'live',
    title: "Riders' arts",
    narrativeKey: 'talk_mcp',
    gate: { type: 'facilitator', message: 'Фасилитатор показывает MCP...', message_en: 'Facilitator shows MCP…', message_uk: 'Фасилітатор показує MCP…' },
    xpReward: 0,
    subSteps: null,
  },

  // 🔒 HIDDEN GEMS — overview, then 7 deep-dive slides
  {
    id: 12,
    slug: 'hidden-gems',
    phase: 'live',
    title: 'Hidden gems',
    narrativeKey: 'hidden_gems',
    gate: { type: 'facilitator', message: 'Фасилитатор показывает фишки...', message_en: 'Facilitator shows hidden gems…', message_uk: 'Фасилітатор показує приховані фічі…' },
    xpReward: 0,
    subSteps: null,
  },
  {
    id: 13,
    slug: 'gem-pixel-agents',
    phase: 'live',
    title: 'Pixel Agents',
    narrativeKey: 'gem_pixel_agents',
    gate: { type: 'facilitator' },
    xpReward: 0,
    subSteps: null,
  },
  {
    id: 14,
    slug: 'gem-mempalace',
    phase: 'live',
    title: 'MemPalace',
    narrativeKey: 'gem_mempalace',
    gate: { type: 'facilitator' },
    xpReward: 0,
    subSteps: null,
  },
  {
    id: 15,
    slug: 'gem-suzu-mcp',
    phase: 'live',
    title: 'suzu-mcp',
    narrativeKey: 'gem_suzu_mcp',
    gate: { type: 'facilitator' },
    xpReward: 0,
    subSteps: null,
  },
  {
    id: 16,
    slug: 'gem-tool-search',
    phase: 'live',
    title: 'ENABLE_TOOL_SEARCH',
    narrativeKey: 'gem_tool_search',
    gate: { type: 'facilitator' },
    xpReward: 0,
    subSteps: null,
  },
  {
    id: 17,
    slug: 'gem-quinn-jinx',
    phase: 'live',
    title: 'Quinn + Jinx',
    narrativeKey: 'gem_quinn_jinx',
    gate: { type: 'facilitator' },
    xpReward: 0,
    subSteps: null,
  },
  {
    id: 18,
    slug: 'gem-channels',
    phase: 'live',
    title: 'Claude Code Channels',
    narrativeKey: 'gem_channels',
    gate: { type: 'facilitator' },
    xpReward: 0,
    subSteps: null,
  },

  // 🔓 BOND RITUAL: Generate your dragon's portrait
  {
    id: 19,
    slug: 'bond-ritual',
    phase: 'live',
    title: 'The Bond Ritual',
    narrativeKey: 'bond_ritual',
    gate: { type: 'self-report', message: 'Запечатай своего дракона в Аэрии', message_en: 'Seal your dragon into the Aerie', message_uk: 'Запечатай свого дракона в Аерії' },
    xpReward: 100,
    subSteps: null,
  },

  // 🔒 AERIE + VOTING
  {
    id: 20,
    slug: 'aerie',
    phase: 'live',
    title: 'The Aerie',
    narrativeKey: 'aerie',
    gate: { type: 'facilitator', message: 'Голосование за самого красивого дракона', message_en: 'Voting for the most striking dragon', message_uk: 'Голосування за найкрасивішого дракона' },
    xpReward: 0,
    subSteps: null,
  },

  // 🔓 ARENA: Code your dragon's flight, submit, watch the final battle
  {
    id: 21,
    slug: 'arena',
    phase: 'live',
    title: 'Riders in the Sky',
    narrativeKey: 'arena',
    gate: { type: 'self-report', message: 'Запусти Arena и отправь своего бота', message_en: 'Open the Arena and submit your bot', message_uk: 'Запусти Arena та надішли свого бота' },
    xpReward: 80,
    subSteps: null,
  },

  // 🔒 LEADERBOARD reveal (driven by facilitator)
  {
    id: 22,
    slug: 'leaderboard',
    phase: 'live',
    title: 'Signets honoured',
    narrativeKey: 'leaderboard',
    gate: { type: 'facilitator' },
    xpReward: 0,
    subSteps: null,
  },

  // 🎓 GRADUATION
  {
    id: 23,
    slug: 'graduation',
    phase: 'live',
    title: 'First flight',
    narrativeKey: 'graduation',
    gate: { type: 'none' },
    xpReward: 100,
    subSteps: null,
  },

  // 📦 RESOURCES — take-home reference
  {
    id: 24,
    slug: 'resources',
    phase: 'live',
    title: 'Bonded',
    narrativeKey: 'resources',
    gate: { type: 'click' },
    xpReward: 0,
    subSteps: null,
  },
]

export const TOTAL_PAGES = PAGES.length
