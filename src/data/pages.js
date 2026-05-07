// Workshop flow — 16 pages (rebuilt around Dragon Arena, no QA practice drill).
//
// 🔒 facilitator = locked until facilitator advances (talk slides)
// 🔓 self-report / timed-task = student works independently after unlock

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
    gate: { type: 'selection', field: 'characterId', message: 'Выбери персонажа' },
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
    gate: { type: 'form', requiredFields: ['name', 'studio', 'role', 'claudeCodeReady'], message: 'Заполни обязательные поля и подтверди готовность Claude Code' },
    xpReward: 20,
    subSteps: null,
  },
  {
    id: 3,
    slug: 'prework',
    phase: 'pre',
    title: 'Parapet',
    narrativeKey: 'prework',
    gate: { type: 'checklist', message: 'Установи инструменты' },
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
    gate: { type: 'facilitator', message: 'Фасилитатор ведёт рассказ...' },
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
    gate: { type: 'facilitator', message: 'Фасилитатор разбирает архитектуру...' },
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
    gate: { type: 'facilitator', message: 'Фасилитатор показывает modes & hotkeys...' },
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
    gate: { type: 'self-report', message: 'Подтверди установку' },
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
    gate: { type: 'facilitator', message: 'Разбираем что встало...' },
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
    gate: { type: 'facilitator', message: 'Фасилитатор разбирает power moves...' },
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
    gate: { type: 'self-report', message: 'Сгенерируй и применить CLAUDE.md' },
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
    gate: { type: 'facilitator', message: 'Фасилитатор показывает MCP...' },
    xpReward: 0,
    subSteps: null,
  },

  // 🔒 HIDDEN GEMS — community projects + undocumented Claude Code features
  {
    id: 12,
    slug: 'hidden-gems',
    phase: 'live',
    title: 'Hidden gems',
    narrativeKey: 'hidden_gems',
    gate: { type: 'facilitator', message: 'Фасилитатор показывает фишки...' },
    xpReward: 0,
    subSteps: null,
  },

  // 🔓 ARENA: Code your dragon's flight, submit, watch the final battle
  {
    id: 13,
    slug: 'arena',
    phase: 'live',
    title: 'Riders in the Sky',
    narrativeKey: 'arena',
    gate: { type: 'self-report', message: 'Запусти Arena и отправь своего бота' },
    xpReward: 80,
    subSteps: null,
  },

  // 🔒 LEADERBOARD reveal (driven by facilitator)
  {
    id: 14,
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
    id: 15,
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
    id: 16,
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
