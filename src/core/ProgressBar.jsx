import { useWorkshopStore } from '../store/workshopStore'
import { useLocale } from '../i18n/store'
import { PAGES } from '../data/pages'

const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
  { code: 'uk', label: 'UK' },
]

export default function ProgressBar() {
  const currentPage = useWorkshopStore(s => s.currentPage)
  const completedPages = useWorkshopStore(s => s.completedPages)
  const lang = useLocale(s => s.lang)
  const setLang = useLocale(s => s.setLang)
  const page = PAGES[currentPage]

  const progress = (completedPages.length / (PAGES.length - 1)) * 100

  return (
    <div className="fixed top-1 left-0 right-0 z-[90]">
      {/* Progress track */}
      <div className="h-[3px] bg-border">
        <div
          className="h-full bg-qa-teal transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Page info bar */}
      <div className="bg-black/80 backdrop-blur-xl border-b border-border-subtle px-4 sm:px-6 h-12 flex items-center justify-between max-w-full">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[12px] tracking-[2px] text-qa-teal uppercase">
            {String(currentPage).padStart(2, '0')}/{String(PAGES.length - 1).padStart(2, '0')}
          </span>
          <div className="w-px h-4 bg-border" />
          <span className="font-display text-base text-text-primary truncate max-w-[200px] sm:max-w-[300px]">
            {page?.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <div className="flex gap-0.5 border border-border bg-surface/60 rounded-[2px] p-0.5">
            {LANGS.map(l => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`px-2 py-1 font-mono text-[11px] tracking-[2px] rounded-[2px] transition-all cursor-pointer ${
                  lang === l.code
                    ? 'bg-qa-teal text-black font-semibold'
                    : 'text-text-dim hover:text-qa-teal'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          <span className={`font-mono text-[11px] tracking-[2px] uppercase px-2 py-1 border ${
            page?.phase === 'pre'
              ? 'text-text-dim border-border'
              : 'text-qa-teal border-qa-teal/20'
          }`}>
            {page?.phase === 'pre' ? 'Подготовка' : 'Live'}
          </span>
        </div>
      </div>
    </div>
  )
}
