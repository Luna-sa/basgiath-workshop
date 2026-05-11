import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import confetti from 'canvas-confetti'
import { useT } from '../i18n/useT'
import { listDragons } from '../api/dragons'
import { getMatchLeaderboard, subscribeToMatches } from '../api/dragonMatches'

/**
 * Seer of the Aerie — projector reveal of the Eyes of the Aerie
 * winner. Designed to be opened by the facilitator on the projector
 * after voting closes.
 *
 * Standalone route: /?page=seer
 *
 * Visual peak: black background, no UI chrome, big "Seer of the
 * Aerie" eyebrow, winner @nickname in 6vw display italic, score
 * fraction, top-5 runners-up below. Confetti on mount.
 */
export default function P_SeerReveal() {
  const t = useT()
  const [leaderboard, setLeaderboard] = useState([])
  const [dragonCount, setDragonCount] = useState(0)
  const [showWinner, setShowWinner] = useState(false)

  const refresh = async () => {
    const [board, dragons] = await Promise.all([
      getMatchLeaderboard(),
      listDragons(),
    ])
    setLeaderboard(board || [])
    setDragonCount(dragons.length || 0)
  }

  useEffect(() => {
    refresh()
    const unsub = subscribeToMatches(refresh)
    return unsub
  }, [])

  // Dramatic reveal — wait 2 seconds before announcing winner, then confetti
  useEffect(() => {
    const t1 = setTimeout(() => setShowWinner(true), 2200)
    return () => clearTimeout(t1)
  }, [])

  useEffect(() => {
    if (!showWinner || leaderboard.length === 0) return
    // Fire confetti — multiple bursts for a long peak
    const colors = ['#00E5CC', '#FEED00', '#FF65BE', '#E85D26']
    confetti({ particleCount: 120, spread: 90, origin: { y: 0.4 }, colors })
    setTimeout(() => {
      confetti({ particleCount: 80, spread: 110, origin: { y: 0.5, x: 0.2 }, colors })
      confetti({ particleCount: 80, spread: 110, origin: { y: 0.5, x: 0.8 }, colors })
    }, 600)
    setTimeout(() => {
      confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 }, colors })
    }, 1400)
  }, [showWinner, leaderboard.length])

  const top = leaderboard[0]
  const runnersUp = leaderboard.slice(1, 5)

  return (
    <div className="min-h-screen bg-black text-text-body flex flex-col">
      {/* Top eyebrow */}
      <div className="text-center pt-8 pb-4">
        <p className="font-mono text-[12px] tracking-[5px] uppercase text-qa-teal animate-pulse">
          ◆ {t('Eyes of the Aerie', 'Глаза Аэрии', 'Очі Аерії')}
        </p>
      </div>

      {/* Centre stage */}
      <div className="flex-1 flex items-center justify-center px-6">
        <AnimatePresence mode="wait">
          {!showWinner ? (
            <motion.div
              key="suspense"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <p className="font-display italic text-[clamp(36px,5vw,56px)] text-white leading-tight mb-4">
                {t(
                  'The Aerie reads who knew it best…',
                  'Аэрия читает кто знал её лучше всех…',
                  'Аерія читає хто знав її найкраще…'
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
          ) : !top ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <p className="font-display italic text-[clamp(32px,4vw,48px)] text-text-secondary">
                {t('No guesses yet.', 'Догадок ещё нет.', 'Здогадок ще немає.')}
              </p>
              <p className="text-[14px] text-text-dim italic mt-2">
                {t(
                  'Send people to /?page=eyes — they need to play first.',
                  'Отправь людей в /?page=eyes — пусть сначала сыграют.',
                  'Відправ людей у /?page=eyes — нехай спершу зіграють.'
                )}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="winner"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: 'spring' }}
              className="text-center max-w-4xl"
            >
              {/* Title */}
              <p className="font-display italic text-[clamp(28px,4vw,48px)] text-text-secondary leading-tight mb-3">
                {t('Seer of the Aerie', 'Провидец Аэрии', 'Провидець Аерії')}
              </p>

              {/* Winner nickname */}
              <motion.h1
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="font-display italic text-[clamp(64px,9vw,128px)] text-white leading-[1] mb-4"
              >
                @{top.voter_nickname}
              </motion.h1>

              {/* Score fraction */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="font-mono text-[clamp(24px,3vw,38px)] text-qa-teal tracking-[4px]"
              >
                {top.correct} / {dragonCount || top.total}{' '}
                <span className="text-text-dim font-mono text-[clamp(14px,1.5vw,18px)] tracking-[2px] uppercase">
                  {t('correct', 'верно', 'правильно')}
                </span>
              </motion.p>

              {/* Runners-up */}
              {runnersUp.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6, duration: 0.8 }}
                  className="mt-12"
                >
                  <p className="font-mono text-[11px] tracking-[3px] uppercase text-text-dim mb-3">
                    ◆ {t('Sharp eyes', 'Острый глаз', 'Гостре око')}
                  </p>
                  <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
                    {runnersUp.map((r, i) => (
                      <div
                        key={r.voter_nickname}
                        className="font-mono text-[clamp(14px,1.5vw,18px)] tracking-[2px]"
                      >
                        <span className="text-text-dim mr-2">{i + 2}.</span>
                        <span className="text-text-secondary">@{r.voter_nickname}</span>
                        <span className="text-qa-teal ml-2">{r.correct}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.4, duration: 0.8 }}
                className="font-display italic text-[clamp(16px,1.6vw,20px)] text-text-secondary mt-10 max-w-2xl mx-auto"
              >
                {t(
                  'You read the room before the room spoke.',
                  'Ты прочитала комнату до того, как комната заговорила.',
                  'Ти прочитала кімнату до того, як кімната заговорила.'
                )}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom: dragon-portrait strip from leaderboard's top voter (subtle) */}
      <div className="text-center pb-6 font-mono text-[10px] tracking-[2px] uppercase text-text-dim">
        {leaderboard.length} {t('riders guessed', 'всадников угадали', 'вершників вгадали')} ·
        {' '}{dragonCount} {t('dragons total', 'драконов всего', 'драконів всього')} ·
        basgiath-workshop.onrender.com
      </div>
    </div>
  )
}
