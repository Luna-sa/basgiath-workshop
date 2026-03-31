// image: path to AI-generated portrait (place in src/assets/characters/)
// When you generate portraits in Midjourney, save as:
//   src/assets/characters/violet.png, xaden.png, etc.
// Then update the `image` field below with:
//   image: new URL('../assets/characters/violet.png', import.meta.url).href

export const CHARACTERS = [
  {
    id: 'violet',
    name: 'Вайолет Сорренгейл',
    title: 'Недооценённая',
    dragon: 'Tairn — чёрный Хвостоскорпион',
    trait: 'Стратег. Ум побеждает силу.',
    match: 'Ты не «типичный технарь», но ты умнее всех в комнате.',
    style: 'Изучает документацию. Понимает систему до того, как трогать.',
    emoji: '⚡',
    image: null, // Replace with portrait URL
  },
  {
    id: 'xaden',
    name: 'Ксаден Рирсон',
    title: 'Опасный',
    dragon: 'Sgaeyl — синий Кинжалохвост',
    trait: 'Ставит под сомнение систему. Всегда с планом Б.',
    match: 'Ты уже думаешь, что ещё можно сделать с этим инструментом.',
    style: 'Учится делая. Начинает до того, как объяснят.',
    emoji: '🌑',
    image: null,
  },
  {
    id: 'rhiannon',
    name: 'Рианнон Маттиас',
    title: 'Лидерка',
    dragon: 'Feirge — коричневый Бурохребет',
    trait: 'К ней все идут за помощью. Поднимает команду.',
    match: 'Ты уже помогаешь соседу. Учишься лучше, когда можешь учить.',
    style: 'Социальный учёник. Лучший бета-тестер чужих конфигов.',
    emoji: '🔥',
    image: null,
  },
  {
    id: 'ridoc',
    name: 'Ридок Гэмлин',
    title: 'Джокер',
    dragon: 'Aotrom — зелёный Булавохвост',
    trait: 'Через юмор — к глубине. Удивляет, когда это важно.',
    match: 'Ты назовёшь секции CLAUDE.md чем-то нелепым. И оно будет работать.',
    style: 'Эксперименты и игра. Его отклонения — самые интересные.',
    emoji: '❄️',
    image: null,
  },
  {
    id: 'sawyer',
    name: 'Сойер Хенрик',
    title: 'Надёжный',
    dragon: 'Sliseag — коричневый Бурохребет',
    trait: 'Основательный. Не пропускает шагов.',
    match: 'Ты следуешь каждой инструкции и уходишь с идеальной настройкой.',
    style: 'Пошаговый. Ценит завершённость и правильность.',
    emoji: '🔨',
    image: null,
  },
  {
    id: 'imogen',
    name: 'Имоджен',
    title: 'Закалённая',
    dragon: 'Неизвестен',
    trait: 'Без лишних слов. Когда говорит — имеет значение.',
    match: 'Ты пропустила вступление и уже читаешь шаблоны команд.',
    style: 'Результат важнее процесса. Модифицирует готовое.',
    emoji: '⚔️',
    image: null,
  },
]
