// Badges adjusted to the new 14-page flow (was 16). Old QA-practice
// badges (battle-ready/2 commands, perfect-score quiz, bug-hunter,
// speed-demon, third-wing) removed.

export const BADGES = [
  {
    id: 'parapet',
    name: 'Парапет',
    emoji: '🌉',
    description: 'Прошёл все шаги подготовки до воркшопа',
    condition: (store) => store.completedPages.includes(3),
  },
  {
    id: 'forge',
    name: 'Forge',
    emoji: '🔥',
    description: 'Установил полную QA-экосистему одним промптом',
    condition: (store) => store.completedPages.includes(7),
  },
  {
    id: 'signet',
    name: 'Signet',
    emoji: '✦',
    description: 'Собрал свой персональный CLAUDE.md',
    condition: (store) => store.completedPages.includes(10),
  },
  {
    id: 'rider',
    name: 'Rider',
    emoji: '🐉',
    description: 'Запрограммировал поведение своего дракона в Arena',
    condition: (store) => store.completedPages.includes(12),
  },
  {
    id: 'dragon-rider',
    name: 'Наездник',
    emoji: '👑',
    description: 'Прошёл весь воркшоп от Парапета до Bonded',
    condition: (store) => store.completedPages.includes(14),
  },
]
