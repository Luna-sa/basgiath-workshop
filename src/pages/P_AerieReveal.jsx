import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import confetti from 'canvas-confetti'
import { useT } from '../i18n/useT'
import { listDragons, subscribeToAerie } from '../api/dragons'
import { generateFakeDragons } from '../data/dragons/fixtures'

/**
 * The Reveal of the Strongest Bond — projector-mode reveal of the
 * Aerie vote winner. Slow theatrical staging:
 *
 *   beat 1 (2s)  : "Three votes. Forty dragons. One sky."
 *   beat 2 (3s)  : "The bond that lit the Aerie hottest…"
 *   beat 3       : Dragon portrait fades in
 *   beat 4       : Dragon name in 7vw display italic
 *   beat 5       : Rider nickname in 4vw
 *   beat 6       : "Aerie Favourite — Basgiath 2026-05-13" badge
 *   beat 7       : Confetti, motto pull-quote, runners-up strip
 *
 * Standalone route: /?page=reveal
 * Optional ?preview=40 for layout testing without real data.
 */
export default function P_AerieReveal() {
  const t = useT()
  const [dragons, setDragons] = useState([])
  const [stage, setStage] = useState(0) // 0..5 reveal beats
  // Once the dramatic reveal starts (stage >= 2 — portrait fade-in),
  // freeze the leaderboard so a late vote can't swap the winner
  // mid-animation. The shown sorted list is captured at freeze time.
  const [frozenDragons, setFrozenDragons] = useState(null)

  const params = useMemo(() => new URLSearchParams(window.location.search), [])
  const previewN = parseInt(params.get('preview') || '0', 10)
  const unsubRef = useRef(null)

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
    if (previewN > 0) return
    unsubRef.current = subscribeToAerie(refresh)
    return () => { if (unsubRef.current) unsubRef.current() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Detach subscription + snapshot the leaderboard the moment reveal
  // moves past the suspense lines.
  useEffect(() => {
    if (stage >= 2 && !frozenDragons) {
      const snapshot = [...dragons]
      setFrozenDragons(snapshot)
      if (unsubRef.current) { unsubRef.current(); unsubRef.current = null }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage])

  // Drive the reveal timeline
  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 1800)
    const t2 = setTimeout(() => setStage(2), 4200)
    const t3 = setTimeout(() => setStage(3), 6000)
    const t4 = setTimeout(() => setStage(4), 7400)
    const t5 = setTimeout(() => setStage(5), 8800)
    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout)
  }, [])

  // Sort by vote count desc, sealed_at asc tiebreak. Use the frozen
  // snapshot once reveal has started — so the winner can't change
  // mid-confetti from a late vote tipping the count.
  const sorted = useMemo(() => {
    const source = frozenDragons || dragons
    return [...source].sort((a, b) => {
      const av = Number(a.vote_count || 0), bv = Number(b.vote_count || 0)
      if (bv !== av) return bv - av
      return new Date(a.sealed_at) - new Date(b.sealed_at)
    })
  }, [dragons, frozenDragons])

  const winner = sorted[0]
  const runnersUp = sorted.slice(1, 4)

  // Fire confetti when stage reaches winner reveal
  useEffect(() => {
    if (stage < 3 || !winner) return
    const colors = ['#00E5CC', '#FEED00', '#FF65BE', '#E85D26']
    confetti({ particleCount: 140, spread: 90, origin: { y: 0.4 }, colors })
    setTimeout(() => {
      confetti({ particleCount: 80, spread: 110, origin: { y: 0.5, x: 0.2 }, colors })
      confetti({ particleCount: 80, spread: 110, origin: { y: 0.5, x: 0.8 }, colors })
    }, 700)
    setTimeout(() => {
      confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 }, colors })
    }, 1500)
  }, [stage, winner])

  // Format today's date for the Aerie Favourite badge
  const today = new Date().toISOString().slice(0, 10)

  return (
    <div className="min-h-screen bg-black text-text-body flex flex-col overflow-hidden">

      {/* Top eyebrow */}
      <div className="text-center pt-8 pb-4">
        <p className="font-mono text-[12px] tracking-[5px] uppercase text-qa-teal">
          ◆ {t('The Aerie', 'Аэрия', 'Аерія')}
        </p>
      </div>

      {/* Centre stage */}
      <div className="flex-1 flex items-center justify-center px-6">
        <AnimatePresence mode="wait">

          {/* ─── Stage 0: opening tagline ─── */}
          {stage === 0 && (
            <motion.div
              key="s0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <p className="font-display italic text-[clamp(28px,3vw,42px)] text-text-secondary leading-relaxed">
                {t(
                  'Three votes. Forty dragons. One sky.',
                  'Три голоса. Сорок драконов. Одно небо.',
                  'Три голоси. Сорок драконів. Одне небо.'
                )}
              </p>
            </motion.div>
          )}

          {/* ─── Stage 1: suspense line ─── */}
          {stage === 1 && (
            <motion.div
              key="s1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <p className="font-display italic text-[clamp(32px,4vw,56px)] text-white leading-tight">
                {t(
                  'The bond that lit the Aerie hottest…',
                  'Связь, что зажгла Аэрию ярче всех…',
                  'Звʼязок, що запалив Аерію найяскравіше…'
                )}
              </p>
              <div className="flex justify-center gap-2 mt-8">
                {[0, 1, 2, 3].map(i => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-full bg-qa-teal animate-pulse"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* ─── Stage 2: no winner case ─── */}
          {stage >= 2 && !winner && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <p className="font-display italic text-[clamp(28px,3vw,42px)] text-text-secondary">
                {t(
                  'The sky is still empty.',
                  'Небо ещё пустое.',
                  'Небо ще порожнє.'
                )}
              </p>
            </motion.div>
          )}

          {/* ─── Stage 2+: portrait fade-in ─── */}
          {stage >= 2 && winner && (
            <motion.div
              key="winner"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.0, ease: 'easeOut' }}
              className="flex flex-col items-center text-center max-w-5xl w-full"
            >
              {/* Portrait */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0 }}
                className="w-full max-w-[460px] aspect-square overflow-hidden border-2 border-qa-teal shadow-[0_0_60px_rgba(0,229,204,0.25)] mb-6"
              >
                <img
                  src={winner.image_url}
                  alt={winner.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Dragon name — Stage 3 */}
              {stage >= 3 && (
                <motion.h1
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, type: 'spring' }}
                  className="font-display italic text-[clamp(56px,7vw,108px)] text-white leading-[1.05] mb-1"
                >
                  {winner.name}
                </motion.h1>
              )}

              {/* Rider — Stage 4 */}
              {stage >= 4 && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="font-mono text-[clamp(20px,2.5vw,32px)] text-qa-teal tracking-[3px] mb-6"
                >
                  {t('rider', 'всадник', 'вершник')} · <span className="text-white">@{winner.nickname}</span>
                </motion.p>
              )}

              {/* Aerie Favourite badge — Stage 5 */}
              {stage >= 5 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, type: 'spring' }}
                  className="border border-qa-teal bg-qa-teal/[0.08] px-6 py-3 mb-6"
                >
                  <p className="font-mono text-[12px] tracking-[4px] uppercase text-qa-teal">
                    ✦ {t('Aerie Favourite', 'Любимец Аэрии', 'Улюбленець Аерії')} · Basgiath · {today}
                  </p>
                </motion.div>
              )}

              {/* Motto */}
              {stage >= 5 && winner.answers?.motto && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.0, delay: 0.4 }}
                  className="font-display italic text-[clamp(18px,2vw,26px)] text-text-secondary leading-relaxed max-w-2xl"
                >
                  "{winner.answers.motto}"
                </motion.p>
              )}

              {/* Vote count */}
              {stage >= 5 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.0, delay: 0.8 }}
                  className="font-mono text-[13px] tracking-[3px] uppercase text-text-dim mt-6"
                >
                  ✦ {winner.vote_count} {t('votes', 'голосов', 'голосів')}
                </motion.p>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Runners-up strip at bottom — Stage 5+ */}
      <AnimatePresence>
        {stage >= 5 && runnersUp.length > 0 && (
          <motion.div
            key="runners"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.4 }}
            className="pb-10"
          >
            <p className="text-center font-mono text-[10px] tracking-[3px] uppercase text-text-dim mb-3">
              ◆ {t('Held the sky', 'Держали небо', 'Тримали небо')}
            </p>
            <div className="flex justify-center gap-6 flex-wrap">
              {runnersUp.map((d, i) => (
                <div key={d.id} className="flex items-center gap-3">
                  <span className="font-display italic text-[20px] text-qa-teal/60">{i + 2}.</span>
                  <div className="w-12 h-12 overflow-hidden border border-border">
                    <img src={d.image_url} alt={d.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-left">
                    <div className="font-display italic text-[16px] text-text-secondary leading-tight">{d.name}</div>
                    <div className="font-mono text-[10px] text-text-dim">@{d.nickname} · ✦ {d.vote_count}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center pb-4 font-mono text-[10px] tracking-[2px] uppercase text-text-dim">
        basgiath-workshop.onrender.com
      </div>
    </div>
  )
}
