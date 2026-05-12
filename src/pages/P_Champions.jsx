import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import confetti from 'canvas-confetti'
import { listDragons } from '../api/dragons'
import { getXpLeaderboard } from '../api/progress'
import { getArenaLeaderboard } from '../api/arena'
import { useT } from '../i18n/useT'
import { CHARACTERS, pickCharacter } from '../data/characters'
import { useLocale } from '../i18n/store'
import { useWorkshopStore } from '../store/workshopStore'
import HiddenDragon from '../components/HiddenDragon'
import { TOTAL_DRAGONS } from '../data/hidden-dragons'

function isInMainFlow() {
  if (typeof window === 'undefined') return false
  const params = new URLSearchParams(window.location.search)
  return params.get('page') !== 'champions' && window.location.pathname !== '/champions'
}

/**
 * Three Champions - the workshop finale.
 *
 * Reveals three winners in sequence on the projector:
 *   1. Best Dragon - top of Aerie vote (image + rider + votes)
 *   2. Most XP - top of XP leaderboard (XP + wyrmlings found)
 *   3. Arena Champion - top of arena_runs aggregated total
 *
 * Each section appears with a slow theatrical reveal + confetti burst.
 *
 * Standalone route - facilitator opens /?page=champions when ready.
 * Hidden somewhere on this slide: the Golden Wyrmling (+500 XP).
 *
 * Renders without PageShell - full-screen, projector-mode aesthetic
 * matches P_AerieReveal.
 */
export default function P_Champions() {
  const t = useT()
  const lang = useLocale(s => s.lang)
  const myNickname = useWorkshopStore(s => s.user.nickname)

  const [dragons, setDragons] = useState([])
  const [xpRows, setXpRows] = useState([])
  const [arenaRows, setArenaRows] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [stage, setStage] = useState(0)
  // 0 = intro tagline, 1 = best dragon, 2 = +most xp, 3 = +arena champion, 4 = trio + golden hint
  const firedRef = useRef({})

  useEffect(() => {
    let cancelled = false
    Promise.all([
      listDragons().then(r => r.data || []),
      getXpLeaderboard().then(r => r.leaderboard || []),
      getArenaLeaderboard().then(r => r.leaderboard || []),
    ]).then(([d, xp, a]) => {
      if (cancelled) return
      setDragons(d)
      setXpRows(xp)
      setArenaRows(a)
      setLoaded(true)
    }).catch(() => {
      if (!cancelled) setLoaded(true)
    })
    return () => { cancelled = true }
  }, [])

  // Drive the reveal timeline once data is loaded
  useEffect(() => {
    if (!loaded) return
    const timers = []
    timers.push(setTimeout(() => setStage(1), 2400))   // best dragon
    timers.push(setTimeout(() => setStage(2), 7000))   // + most xp
    timers.push(setTimeout(() => setStage(3), 11400))  // + arena
    timers.push(setTimeout(() => setStage(4), 16000))  // golden hint visible
    return () => timers.forEach(clearTimeout)
  }, [loaded])

  // Fire confetti per-section (idempotent)
  useEffect(() => {
    if (stage >= 1 && !firedRef.current.dragon) {
      firedRef.current.dragon = true
      confetti({
        particleCount: 140, spread: 100,
        origin: { x: 0.5, y: 0.45 },
        colors: ['#00E5CC', '#FEED00', '#FF65BE', '#FFFFFF'],
      })
    }
    if (stage >= 2 && !firedRef.current.xp) {
      firedRef.current.xp = true
      confetti({
        particleCount: 140, spread: 100,
        origin: { x: 0.5, y: 0.55 },
        colors: ['#FEED00', '#FFA500', '#FFFFFF'],
      })
    }
    if (stage >= 3 && !firedRef.current.arena) {
      firedRef.current.arena = true
      confetti({
        particleCount: 180, spread: 120,
        origin: { x: 0.5, y: 0.6 },
        colors: ['#00E5CC', '#FFFFFF', '#FF65BE'],
        startVelocity: 50,
      })
      setTimeout(() => {
        confetti({ particleCount: 80, angle: 60, spread: 55, origin: { x: 0, y: 0.7 },
          colors: ['#FEED00', '#FFFFFF'] })
        confetti({ particleCount: 80, angle: 120, spread: 55, origin: { x: 1, y: 0.7 },
          colors: ['#00E5CC', '#FFFFFF'] })
      }, 600)
    }
  }, [stage])

  const today = new Date().toISOString().slice(0, 10)
  const bestDragon = dragons[0]
  const topXp = xpRows[0]
  const topArena = arenaRows[0]
  const topXpChar = topXp ? CHARACTERS.find(c => c.id === topXp.character_id) : null
  const topArenaChar = topArena ? CHARACTERS.find(c => c.id === topArena.character_id) : null

  return (
    <div className="min-h-screen bg-black text-text-body overflow-hidden">
      {/* Top eyebrow */}
      <div className="text-center pt-8 pb-4">
        <p className="font-mono text-[12px] tracking-[5px] uppercase text-qa-teal">
          ◆ {t('Three Champions', 'Три Чемпиона', 'Три Чемпіона')} · Basgiath · {today}
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-20">

        {/* Intro tagline */}
        {stage === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.0 }}
            className="text-center py-32"
          >
            <p className="font-display italic text-[clamp(28px,3vw,46px)] text-text-secondary leading-relaxed">
              {t(
                'Three prizes. Three paths to glory.',
                'Три приза. Три пути к славе.',
                'Три призи. Три шляхи до слави.'
              )}
            </p>
            <div className="mt-10 flex justify-center gap-2">
              {[0, 1, 2].map(i => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full bg-qa-teal animate-pulse"
                  style={{ animationDelay: `${i * 0.25}s` }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Three winners — horizontal grid. Each column reveals in
            sequence (stage 1 → 2 → 3), but they sit side-by-side
            instead of stacking vertically. */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 items-start">

          {/* ─── Column 1: Best Dragon ─── */}
          <AnimatePresence>
            {stage >= 1 && (
              <motion.section
                key="best-dragon"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, ease: 'easeOut' }}
                className="flex flex-col"
              >
                <h2 className="font-mono text-[12px] tracking-[3px] uppercase text-qa-teal mb-2 text-center">
                  ◆ {t('Best Dragon', 'Лучший Дракон', 'Найкращий Дракон')}
                </h2>
                <p className="font-display italic text-[13px] text-text-dim text-center mb-5 min-h-[34px]">
                  {t(
                    'The bond that lit the Aerie hottest.',
                    'Связь, что зажгла Аэрию ярче всех.',
                    'Звʼязок, що запалив Аерію найяскравіше.'
                  )}
                </p>
                {bestDragon ? (
                  <div className="flex flex-col items-center">
                    <motion.div
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 1.0, delay: 0.2 }}
                      className="w-full aspect-square overflow-hidden border-2 border-qa-teal shadow-[0_0_40px_rgba(0,229,204,0.3)] mb-4"
                    >
                      <img
                        src={bestDragon.image_url}
                        alt={bestDragon.name}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                    <h3 className="font-display italic text-[clamp(22px,2.5vw,32px)] text-white leading-tight mb-1 text-center">
                      {bestDragon.name}
                    </h3>
                    <p className="font-mono text-[11px] text-qa-teal tracking-[2px] uppercase mb-2 text-center">
                      {t('rider', 'всадник', 'вершник')} · <span className="text-white">@{bestDragon.nickname}</span>
                    </p>
                    <div className="font-mono text-[11px] tracking-[2px] uppercase text-text-dim">
                      ✦ {bestDragon.vote_count} {t('votes', 'голосов', 'голосів')}
                    </div>
                  </div>
                ) : (
                  <p className="text-center font-display italic text-text-dim py-10">
                    {t('No dragon sealed yet.', 'Ни один дракон ещё не запечатан.', 'Жоден дракон ще не запечатаний.')}
                  </p>
                )}
              </motion.section>
            )}
          </AnimatePresence>

          {/* ─── Column 2: Most XP ─── */}
          <AnimatePresence>
            {stage >= 2 && (
              <motion.section
                key="most-xp"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, ease: 'easeOut' }}
                className="flex flex-col"
              >
                <h2 className="font-mono text-[12px] tracking-[3px] uppercase text-yellow-300 mb-2 text-center">
                  ✦ {t('Most XP', 'Больше всех XP', 'Найбільше XP')}
                </h2>
                <p className="font-display italic text-[13px] text-text-dim text-center mb-5 min-h-[34px]">
                  {t(
                    'Every hidden corner explored.',
                    'Каждый скрытый угол исследован.',
                    'Кожен прихований кут досліджено.'
                  )}
                </p>
                {topXp ? (
                  <div className="flex flex-col items-center">
                    <motion.div
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', duration: 1.2, delay: 0.3 }}
                      className="font-display text-[clamp(56px,8vw,100px)] font-bold text-yellow-300 leading-none mb-1"
                      style={{ textShadow: '0 0 32px rgba(254, 237, 0, 0.4)' }}
                    >
                      {topXp.xp}
                    </motion.div>
                    <p className="font-mono text-[11px] tracking-[2.5px] uppercase text-yellow-300/70 mb-4">XP</p>
                    <p className="font-display italic text-[clamp(20px,2.5vw,28px)] text-white mb-1 text-center">
                      @{topXp.nickname}
                    </p>
                    {topXpChar && (
                      <p className="font-mono text-[11px] tracking-[2px] uppercase text-text-dim mb-2">
                        <span style={{ color: topXpChar.color }}>●</span> {pickCharacter(topXpChar, lang)?.name}
                      </p>
                    )}
                    <p className="font-mono text-[12px] text-qa-teal">
                      🐉 {topXp.dragons_found} / {TOTAL_DRAGONS} {t('wyrmlings', 'драконов', 'драконів')}
                    </p>
                  </div>
                ) : (
                  <p className="text-center font-display italic text-text-dim py-10">
                    {t('No XP recorded.', 'XP пока никто не накопил.', 'XP ще ніхто не накопичив.')}
                  </p>
                )}
              </motion.section>
            )}
          </AnimatePresence>

          {/* ─── Column 3: Arena Champion ─── */}
          <AnimatePresence>
            {stage >= 3 && (
              <motion.section
                key="arena-champion"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, ease: 'easeOut' }}
                className="flex flex-col"
              >
                <h2 className="font-mono text-[12px] tracking-[3px] uppercase text-pink-400 mb-2 text-center">
                  ▲ {t('Arena Champion', 'Чемпион Арены', 'Чемпіон Арени')}
                </h2>
                <p className="font-display italic text-[13px] text-text-dim text-center mb-5 min-h-[34px]">
                  {t(
                    'Ten flights. Five rivals. One pilot.',
                    'Десять полётов. Пять соперников. Один пилот.',
                    'Десять польотів. Пʼять суперників. Один пілот.'
                  )}
                </p>
                {topArena ? (
                  <div className="flex flex-col items-center">
                    <motion.div
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 1.0, delay: 0.3 }}
                      className="font-display text-[clamp(56px,8vw,100px)] font-bold text-white leading-none mb-1"
                      style={{ textShadow: '0 0 32px rgba(255, 101, 190, 0.5)' }}
                    >
                      {topArena.total_score}
                    </motion.div>
                    <p className="font-mono text-[11px] tracking-[2.5px] uppercase text-pink-400/80 mb-4">
                      {t('total', 'всего', 'усього')}
                    </p>
                    <p className="font-display italic text-[clamp(20px,2.5vw,28px)] text-white mb-1 text-center">
                      @{topArena.nickname}
                    </p>
                    {topArenaChar && (
                      <p className="font-mono text-[11px] tracking-[2px] uppercase text-text-dim mb-2">
                        <span style={{ color: topArenaChar.color }}>●</span> {pickCharacter(topArenaChar, lang)?.name}
                      </p>
                    )}
                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 font-mono text-[11px] text-text-dim">
                      <span>{t('best', 'лучший', 'найкращий')}: <span className="text-white">{topArena.best_run_score}</span></span>
                      <span>{t('fire', 'fire', 'fire')}: <span className="text-yellow-300">{topArena.total_fire_stars}</span></span>
                      {topArena.hit_pattern && (
                        <span className="text-yellow-300">✦ {t('constellation', 'созвездие', 'сузірʼя')}</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-center font-display italic text-text-dim py-10">
                    {t('No arena runs recorded.', 'Запусков арены пока нет.', 'Запусків арени ще нема.')}
                  </p>
                )}
              </motion.section>
            )}
          </AnimatePresence>

        </div>

        {/* Footer with subtle Golden Wyrmling hint */}
        {stage >= 4 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 2.0 }}
            className="text-center font-mono text-[10px] tracking-[3px] uppercase text-text-dim mt-12"
          >
            {t(
              'A golden wyrmling hides here. Find it.',
              'Здесь спрятан золотой дракончик. Найди его.',
              'Тут схований золотий дракончик. Знайди його.'
            )}
          </motion.p>
        )}

        {/* Next button — only when this slide runs inside the main
            workshop flow (not the projector-only /?page=champions
            route). Appears once all three reveals have played. Sits
            in the content flow (centered under the columns) so it
            doesn't hide behind the HUD icons in the bottom-right. */}
        {isInMainFlow() && stage >= 4 && (
          <div className="flex justify-center mt-10 mb-6">
            <FlowNextButton />
          </div>
        )}
      </div>

      {/* Golden Wyrmling - registered with slideKey 'champions',
          PageShell doesn't wrap this page so we render it inline.
          The HiddenDragon component reads its position from the
          registry; we re-supply position here in case it changes. */}
      <HiddenDragon
        id="golden-wyrmling"
        style={{ position: 'fixed', bottom: 280, right: 240 }}
      />
    </div>
  )
}

function FlowNextButton() {
  const t = useT()
  const navigateNext = useWorkshopStore(s => s.navigateNext)
  const completePage = useWorkshopStore(s => s.completePage)
  const currentPage = useWorkshopStore(s => s.currentPage)
  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      onClick={() => { completePage(currentPage); navigateNext() }}
      className="px-7 py-3 bg-qa-teal text-black font-mono text-[12px] tracking-[3px] uppercase font-semibold hover:shadow-[0_0_24px_rgba(0,229,204,0.4)] transition-all cursor-pointer"
    >
      {t('Continue →', 'Дальше →', 'Далі →')}
    </motion.button>
  )
}
