export const BADGES = [
  {
    id: 'parapet',
    name: 'Парапет',
    emoji: '🌉',
    description: 'Прошёл все шаги подготовки до воркшопа',
    condition: (store) => store.completedPages.includes(3),
  },
  {
    id: 'dragon-bond',
    name: 'Связь с драконом',
    emoji: '🐉',
    description: 'Создал CLAUDE.md',
    condition: (store) => store.completedPages.includes(7),
  },
  {
    id: 'battle-ready',
    name: 'Боевая готовность',
    emoji: '⚔️',
    description: 'Создал 2 slash-команды',
    condition: (store) => store.completedPages.includes(8) && store.completedPages.includes(9),
  },
  {
    id: 'perfect-score',
    name: 'Безупречный',
    emoji: '💎',
    description: '5 из 5 правильных ответов на Battle Brief',
    condition: (store) => store.quizScore === 5,
  },
  {
    id: 'bug-hunter',
    name: 'Охотник за багами',
    emoji: '🎯',
    description: 'Нашёл баг и написал отчёт в First Flight',
    condition: (store) => store.completedPages.includes(12),
  },
  {
    id: 'speed-demon',
    name: 'Молния',
    emoji: '⚡',
    description: 'Выполнил задание First Flight за 3 минуты или быстрее',
    condition: (store) => {
      const sub = store.taskSubmissions[11]
      return sub && sub.durationSeconds && sub.durationSeconds <= 180
    },
  },
  {
    id: 'third-wing',
    name: 'Третье крыло',
    emoji: '🔥',
    description: 'Создал бонусную третью команду',
    condition: (store) => store.completedPages.includes(13),
  },
  {
    id: 'dragon-rider',
    name: 'Наездник',
    emoji: '👑',
    description: 'Прошёл весь воркшоп от Парапета до Выпуска',
    condition: (store) => store.completedPages.includes(16),
  },
]
