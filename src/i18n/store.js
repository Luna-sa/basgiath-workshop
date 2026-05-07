import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useLocale = create(
  persist(
    (set) => ({
      lang: 'en',
      setLang: (l) => set({ lang: l }),
      toggle: () => set((s) => ({ lang: s.lang === 'en' ? 'ru' : 'en' })),
    }),
    { name: 'workshop-locale' }
  )
)
