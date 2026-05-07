import { useLocale } from './store'

/**
 * Translation hook — returns a function `t(en, ru, uk)` that picks the
 * current locale's value. Missing translations fall back to EN.
 *
 * Usage:
 *   const t = useT()
 *   <h1>{t('Welcome', 'Добро пожаловать', 'Ласкаво просимо')}</h1>
 */
export function useT() {
  const lang = useLocale((s) => s.lang)
  return (en, ru, uk) => {
    if (lang === 'ru' && ru) return ru
    if (lang === 'uk' && uk) return uk
    return en
  }
}
