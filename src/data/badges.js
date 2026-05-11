// Badges adjusted to the new 14-page flow (was 16). Old QA-practice
// badges (battle-ready/2 commands, perfect-score quiz, bug-hunter,
// speed-demon, third-wing) removed.

export const BADGES = [
  {
    id: 'parapet',
    name: 'Парапет',
    name_en: 'Parapet',
    name_ru: 'Парапет',
    name_uk: 'Парапет',
    emoji: '🌉',
    description: 'Прошёл все шаги подготовки до воркшопа',
    description_en: 'Completed all pre-workshop setup steps',
    description_ru: 'Прошёл все шаги подготовки до воркшопа',
    description_uk: 'Пройшов усі кроки підготовки до воркшопу',
    condition: (store) => store.completedPages.includes(3),
  },
  {
    id: 'forge',
    name: 'Forge',
    name_en: 'Forge',
    name_ru: 'Forge',
    name_uk: 'Forge',
    emoji: '🔥',
    description: 'Установил полную QA-экосистему одним промптом',
    description_en: 'Installed the full QA ecosystem with one prompt',
    description_ru: 'Установил полную QA-экосистему одним промптом',
    description_uk: 'Встановив повну QA-екосистему одним промптом',
    condition: (store) => store.completedPages.includes(7),
  },
  {
    id: 'signet',
    name: 'Signet',
    name_en: 'Signet',
    name_ru: 'Сигнет',
    name_uk: 'Сигнет',
    emoji: '✦',
    description: 'Собрал свой персональный CLAUDE.md',
    description_en: 'Forged your personal CLAUDE.md',
    description_ru: 'Собрал свой персональный CLAUDE.md',
    description_uk: 'Зібрав свій персональний CLAUDE.md',
    condition: (store) => store.completedPages.includes(10),
  },
  {
    id: 'rider',
    name: 'Rider',
    name_en: 'Rider',
    name_ru: 'Всадник',
    name_uk: 'Вершник',
    emoji: '🐉',
    description: 'Запрограммировал поведение своего дракона в Arena',
    description_en: "Programmed your dragon's behaviour in the Arena",
    description_ru: 'Запрограммировал поведение своего дракона в Arena',
    description_uk: 'Запрограмував поведінку свого дракона в Arena',
    condition: (store) => store.completedPages.includes(21),
  },
  {
    id: 'dragon-rider',
    name: 'Наездник',
    name_en: 'Dragon Rider',
    name_ru: 'Наездник',
    name_uk: 'Дракон-вершник',
    emoji: '👑',
    description: 'Прошёл весь воркшоп от Парапета до Bonded',
    description_en: 'Completed the whole workshop from Parapet to Bonded',
    description_ru: 'Прошёл весь воркшоп от Парапета до Bonded',
    description_uk: 'Пройшов увесь воркшоп від Парапета до Bonded',
    condition: (store) => store.completedPages.includes(23),
  },
]

/**
 * Resolve a badge record to a localised view. Falls back to the canonical
 * Russian fields when a per-locale variant is missing.
 *
 * Usage:
 *   import { pickBadge } from '../data/badges'
 *   import { useLocale } from '../i18n/store'
 *   const lang = useLocale(s => s.lang)
 *   const b = pickBadge(rawBadge, lang)
 */
export function pickBadge(b, lang = 'ru') {
  if (!b) return null
  const pick = (key) => {
    if (lang === 'en' && b[`${key}_en`]) return b[`${key}_en`]
    if (lang === 'uk' && b[`${key}_uk`]) return b[`${key}_uk`]
    if (lang === 'ru' && b[`${key}_ru`]) return b[`${key}_ru`]
    return b[key]
  }
  return {
    ...b,
    name: pick('name'),
    description: pick('description'),
  }
}
