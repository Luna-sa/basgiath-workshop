import { useWorkshopStore } from '../store/workshopStore'
import { PAGES } from '../data/pages'

export default function ProgressBar() {
  const currentPage = useWorkshopStore(s => s.currentPage)
  const completedPages = useWorkshopStore(s => s.completedPages)
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
