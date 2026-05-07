import { useLocale } from './store'

/**
 * Translation hook — returns a function `t(en, ru)` that picks the
 * current locale's value. RU falls back to EN if undefined.
 *
 * Usage:
 *   const t = useT()
 *   <h1>{t('Welcome', 'Добро пожаловать')}</h1>
 */
export function useT() {
  const lang = useLocale((s) => s.lang)
  return (en, ru) => (lang === 'ru' && ru ? ru : en)
}
