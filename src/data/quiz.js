export const QUIZ_QUESTIONS = [
  {
    id: 'q1',
    question: 'Что такое CLAUDE.md?',
    options: [
      { id: 'a', text: 'Файл с инструкциями для AI — описание проекта, роли и стандартов' },
      { id: 'b', text: 'База данных для хранения тест-кейсов' },
      { id: 'c', text: 'Плагин для Visual Studio Code' },
      { id: 'd', text: 'Конфигурация CI/CD пайплайна' },
    ],
    correct: 'a',
    xp: 10,
    explanation: 'CLAUDE.md — это файл-инструкция, который AI читает в начале каждой сессии. Он рассказывает агенту, кто ты и как ты работаешь.',
  },
  {
    id: 'q2',
    question: 'Что делает $ARGUMENTS в slash-команде?',
    options: [
      { id: 'a', text: 'Удаляет предыдущий ответ AI' },
      { id: 'b', text: 'Подставляет текст, который пользователь написал после команды' },
      { id: 'c', text: 'Запускает тесты автоматически' },
      { id: 'd', text: 'Открывает файл в редакторе' },
    ],
    correct: 'b',
    xp: 10,
    explanation: '/bug-report login page crashes → $ARGUMENTS заменится на "login page crashes" и Claude получит контекст.',
  },
  {
    id: 'q3',
    question: 'Где хранятся кастомные slash-команды?',
    options: [
      { id: 'a', text: 'В корне проекта в файле commands.json' },
      { id: 'b', text: 'В папке .claude/commands/ как .md файлы' },
      { id: 'c', text: 'В настройках системы /etc/claude/' },
      { id: 'd', text: 'В облаке Anthropic' },
    ],
    correct: 'b',
    xp: 10,
    explanation: 'Каждая команда — отдельный .md файл в .claude/commands/. Имя файла = имя команды.',
  },
  {
    id: 'q4',
    question: 'Какие типы тест-кейсов ОБЯЗАТЕЛЬНО нужно покрывать?',
    options: [
      { id: 'a', text: 'Только positive (happy path)' },
      { id: 'b', text: 'Positive + negative + boundary + edge cases' },
      { id: 'c', text: 'Только те, которые попросил менеджер' },
      { id: 'd', text: 'Только security-тесты' },
    ],
    correct: 'b',
    xp: 10,
    explanation: 'Хорошее покрытие включает: happy path, невалидные данные, граничные значения и edge cases (спецсимволы, пустые поля, параллельные действия).',
  },
  {
    id: 'q5',
    question: 'В чём главное отличие настроенного AI-агента от обычного ChatGPT?',
    options: [
      { id: 'a', text: 'Настроенный агент быстрее отвечает' },
      { id: 'b', text: 'Настроенный агент знает контекст проекта, роль и стандарты команды' },
      { id: 'c', text: 'ChatGPT не умеет писать код' },
      { id: 'd', text: 'Разницы нет — это одно и то же' },
    ],
    correct: 'b',
    xp: 10,
    explanation: 'CLAUDE.md + commands = AI, который знает твой проект, формат отчётов, стек и стандарты. ChatGPT каждый раз начинает с нуля.',
  },
]

export const QUIZ_BONUS_XP = 20 // Bonus for 5/5 perfect score
