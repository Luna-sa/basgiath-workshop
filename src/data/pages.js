// Workshop flow — 16 pages
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
    title: 'Выбери Наездника',
    narrativeKey: 'character_select',
    gate: { type: 'selection', field: 'characterId', message: 'Выбери персонажа' },
    xpReward: 10,
    subSteps: null,
  },
  {
    id: 2,
    slug: 'registration',
    phase: 'pre',
    title: 'Записаться на Отбор',
    narrativeKey: 'registration',
    gate: { type: 'form', requiredFields: ['name', 'studio', 'role', 'claudeCodeReady'], message: 'Заполни обязательные поля и подтверди готовность Claude Code' },
    xpReward: 20,
    subSteps: null,
  },
  {
    id: 3,
    slug: 'prework',
    phase: 'pre',
    title: 'Парапет',
    narrativeKey: 'prework',
    gate: { type: 'checklist', message: 'Установи инструменты' },
    xpReward: 50,
    subSteps: null,
  },

  // ═══════════════════════════════════════════
  // LIVE WORKSHOP
  // ═══════════════════════════════════════════

  // 🔒 TALK: Что такое AI для QA + эволюция
  {
    id: 4,
    slug: 'talk-intro',
    phase: 'live',
    title: 'Что такое AI для QA',
    narrativeKey: 'talk_intro',
    gate: { type: 'facilitator', message: 'Фасилитатор ведёт рассказ...' },
    xpReward: 0,
    subSteps: null,
  },

  // 🔒 TALK: 5 уровней эволюции
  {
    id: 5,
    slug: 'talk-evolution',
    phase: 'live',
    title: 'Эволюция наездника',
    narrativeKey: 'talk_evolution',
    gate: { type: 'facilitator', message: 'Фасилитатор ведёт рассказ...' },
    xpReward: 0,
    subSteps: null,
  },

  // 🔓 TASK: Установи QA-экосистему
  {
    id: 6,
    slug: 'install-ecosystem',
    phase: 'live',
    title: 'Установи экосистему',
    narrativeKey: 'install',
    gate: { type: 'self-report', message: 'Подтверди установку' },
    xpReward: 100,
    subSteps: null,
  },

  // 🔒 TALK: Что мы установили — разбор
  {
    id: 7,
    slug: 'talk-ecosystem',
    phase: 'live',
    title: 'Что мы установили',
    narrativeKey: 'talk_ecosystem',
    gate: { type: 'facilitator', message: 'Фасилитатор разбирает экосистему...' },
    xpReward: 0,
    subSteps: null,
  },

  // 🔓 TASK: Попробуй /test-cases
  {
    id: 8,
    slug: 'practice-testcases',
    phase: 'live',
    title: 'Практика: /test-cases',
    narrativeKey: 'practice_tc',
    gate: { type: 'timed-task', durationSeconds: 420, message: 'Запусти /test-cases и отправь результат' },
    xpReward: 50,
    subSteps: null,
  },

  // 🔓 TASK: Найди баг и /bug-report
  {
    id: 9,
    slug: 'practice-bugreport',
    phase: 'live',
    title: 'Практика: /bug-report',
    narrativeKey: 'practice_br',
    gate: { type: 'timed-task', durationSeconds: 420, message: 'Найди баг и отправь отчёт' },
    xpReward: 50,
    subSteps: null,
  },

  // 🔒 TALK: MCP суперсила + демо
  {
    id: 10,
    slug: 'talk-mcp',
    phase: 'live',
    title: 'Суперсила: MCP',
    narrativeKey: 'talk_mcp',
    gate: { type: 'facilitator', message: 'Фасилитатор показывает MCP...' },
    xpReward: 0,
    subSteps: null,
  },

  // 🔓 TASK: AI тестирует сайт через браузер
  {
    id: 11,
    slug: 'practice-mcp',
    phase: 'live',
    title: 'AI тестирует сайт',
    narrativeKey: 'practice_mcp',
    gate: { type: 'self-report', message: 'Попробуй и подтверди' },
    xpReward: 80,
    subSteps: null,
  },

  // 🔓 TASK: Квиз
  {
    id: 12,
    slug: 'quiz',
    phase: 'live',
    title: 'Battle Brief',
    narrativeKey: 'quiz',
    gate: { type: 'quiz', message: 'Ответь на все вопросы' },
    xpReward: 0,
    subSteps: null,
  },

  // 🔒 War Games + голосование
  {
    id: 13,
    slug: 'war-games',
    phase: 'live',
    title: 'Военные игры',
    narrativeKey: 'wargames',
    gate: { type: 'facilitator' },
    xpReward: 0,
    subSteps: null,
  },

  // 🔒 Лидерборд
  {
    id: 14,
    slug: 'leaderboard',
    phase: 'live',
    title: 'Результаты',
    narrativeKey: 'leaderboard',
    gate: { type: 'facilitator' },
    xpReward: 0,
    subSteps: null,
  },

  // Выпуск
  {
    id: 15,
    slug: 'graduation',
    phase: 'live',
    title: 'Выпуск',
    narrativeKey: 'graduation',
    gate: { type: 'none' },
    xpReward: 100,
    subSteps: null,
  },
]

export const TOTAL_PAGES = PAGES.length
