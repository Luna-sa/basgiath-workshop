import { useEffect, useState, useMemo } from 'react'
import { motion } from 'motion/react'
import { listDragons, subscribeToAerie } from '../api/dragons'
import { generateFakeDragons } from '../data/dragons/fixtures'
import { useT } from '../i18n/useT'

/**
 * The Aerie Mosaic — full-screen reveal of every sealed dragon
 * arranged into a wall mosaic. Designed for the projector during
 * the workshop's emotional peak: facilitator opens this and the
 * room sees every rider's dragon next to every other.
 *
 * Standalone route: /?page=mosaic
 *
 * Layout adapts to dragon count — small N gets large cells, large
 * N gets dense grid. No interactive elements; this is a viewing
 * experience.
 *
 * Optional ?cycle=1 — rotates a single dragon to spotlight every
 * few seconds (good for small N or projector close-ups).
 */
export default function P_AerieMosaic() {
  const t = useT()
  const [dragons, setDragons] = useState([])
  const [spotlightIdx, setSpotlightIdx] = useState(0)
  const params = useMemo(() => new URLSearchParams(window.location.search), [])
  const cycle = params.get('cycle') === '1' || params.get('cycle') === 'true'
  const previewN = parseInt(params.get('preview') || '0', 10)

  const refresh = async () => {
    if (previewN > 0) {
      setDragons(generateFakeDragons(previewN))
      return
    }
    const d = await listDragons()
    setDragons(d)
  }

  useEffect(() => {
    refresh()
    if (previewN > 0) return // no realtime in preview
    const unsub = subscribeToAerie(refresh)
    return unsub
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Cycle spotlight every 4 seconds if cycle mode is on
  useEffect(() => {
    if (!cycle || dragons.length === 0) return
    const interval = setInterval(() => {
      setSpotlightIdx(i => (i + 1) % dragons.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [cycle, dragons.length])

  // Grid sizing — adapt cells to dragon count for visual balance
  const gridCols = useMemo(() => {
    const n = dragons.length
    if (n <= 1) return 1
    if (n <= 4) return 2
    if (n <= 9) return 3
    if (n <= 16) return 4
    if (n <= 25) return 5
    return 6
  }, [dragons.length])

  // Cycle mode: show one dragon huge, rest tiny in a strip
  if (cycle && dragons.length > 0) {
    const spotlight = dragons[spotlightIdx]
    return (
      <div className="min-h-screen bg-black text-text-body flex flex-col">
        {/* Top eyebrow */}
        <div className="text-center py-4">
          <p className="font-mono text-[11px] tracking-[4px] uppercase text-qa-teal">
            ◆ {t('The Aerie · Mosaic', 'Аэрия · Мозаика', 'Аерія · Мозаїка')}
          </p>
        </div>

        {/* Spotlight */}
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div
            key={spotlight.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl w-full"
          >
            <div className="aspect-square bg-black overflow-hidden mb-4 border border-qa-teal/40">
              <img
                src={spotlight.image_url}
                alt={spotlight.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center">
              <h2 className="font-display italic text-[clamp(40px,6vw,72px)] text-white leading-tight mb-2">
                {spotlight.name}
              </h2>
              {spotlight.answers?.motto && (
                <p className="font-display italic text-[clamp(18px,2.5vw,28px)] text-qa-teal leading-relaxed mb-3 max-w-2xl mx-auto">
                  "{spotlight.answers.motto}"
                </p>
              )}
              <p className="font-mono text-[14px] tracking-[2px] uppercase text-text-dim">
                rider · <span className="text-text-secondary">@{spotlight.nickname}</span>
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom strip — thumbnails */}
        <div className="flex justify-center gap-2 px-4 pb-4 flex-wrap">
          {dragons.map((d, i) => (
            <button
              key={d.id}
              onClick={() => setSpotlightIdx(i)}
              className={`w-12 h-12 overflow-hidden border-2 transition-all cursor-pointer ${
                i === spotlightIdx
                  ? 'border-qa-teal scale-110'
                  : 'border-border opacity-50 hover:opacity-100'
              }`}
            >
              <img src={d.image_url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        <div className="text-center pb-4 font-mono text-[10px] tracking-[2px] uppercase text-text-dim">
          {spotlightIdx + 1} / {dragons.length}
        </div>
      </div>
    )
  }

  // Grid mode — wall of dragons
  return (
    <div className="min-h-screen bg-black text-text-body flex flex-col">
      {/* Top eyebrow */}
      <div className="text-center py-6">
        <p className="font-mono text-[11px] tracking-[4px] uppercase text-qa-teal">
          ◆ {t('The Aerie', 'Аэрия', 'Аерія')}
        </p>
        <h1 className="font-display italic text-[clamp(36px,5vw,56px)] text-white leading-tight mt-2">
          {t('Every rider. Every dragon.', 'Каждый всадник. Каждый дракон.', 'Кожен вершник. Кожен дракон.')}
        </h1>
      </div>

      {/* Mosaic */}
      <div className="flex-1 px-4 sm:px-8 pb-8 flex items-center justify-center">
        {dragons.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-display italic text-[24px] text-text-secondary">
              {t('The sky is empty.', 'Небо пустое.', 'Небо порожнє.')}
            </p>
            <p className="text-[14px] text-text-dim italic mt-2">
              {t('Send people to the Bond Ritual first.', 'Сначала отправь людей в Ритуал Связывания.', 'Спочатку відправ людей до Ритуалу Звʼязування.')}
            </p>
          </div>
        ) : (
          <div
            className="grid gap-2 w-full max-w-7xl"
            style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
          >
            {dragons.map((d, i) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: i * 0.06 }}
                className="relative aspect-square bg-black overflow-hidden border border-qa-teal/20 group"
              >
                <img
                  src={d.image_url}
                  alt={d.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                  <div className="font-display italic text-[clamp(16px,1.5vw,22px)] text-white leading-tight">
                    {d.name}
                  </div>
                  <div className="font-mono text-[10px] tracking-[1.5px] uppercase text-qa-teal">
                    @{d.nickname}
                  </div>
                  {d.answers?.motto && (
                    <p className="text-[11px] text-text-body italic mt-1 leading-tight line-clamp-2">
                      "{d.answers.motto}"
                    </p>
                  )}
                </div>
                {/* Always-visible nameplate strip on bottom */}
                <div className="absolute bottom-0 left-0 right-0 bg-bg/80 backdrop-blur-sm px-2 py-1 group-hover:opacity-0 transition-opacity">
                  <div className="font-display italic text-[clamp(12px,1.2vw,16px)] text-white leading-tight truncate">
                    {d.name}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center pb-4 font-mono text-[10px] tracking-[2px] uppercase text-text-dim">
        {dragons.length} {t('dragons sealed', 'драконов', 'драконів')} · basgiath-workshop.onrender.com
      </div>
    </div>
  )
}
