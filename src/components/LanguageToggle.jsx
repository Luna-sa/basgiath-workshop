import { useLocale } from '../i18n/store'

const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
  { code: 'uk', label: 'UK' },
]

export default function LanguageToggle() {
  const lang = useLocale((s) => s.lang)
  const setLang = useLocale((s) => s.setLang)

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-1 bg-surface/80 backdrop-blur border border-border rounded-[2px] p-1 font-mono text-[11px] tracking-[2px]">
      {LANGS.map(l => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          className={`px-2 py-1 rounded-[2px] cursor-pointer transition-all ${
            lang === l.code
              ? 'bg-qa-teal text-black font-semibold'
              : 'text-text-dim hover:text-qa-teal'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}
