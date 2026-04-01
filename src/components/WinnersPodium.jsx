import { motion, AnimatePresence } from 'motion/react'
import { useWorkshopStore } from '../store/workshopStore'
import { CHARACTERS } from '../data/characters'
import { playBadgeSound } from '../effects/SoundManager'

const MEDALS = ['🥇', '🥈', '🥉', '🏅', '🏅']
const DELAYS = [2.5, 1.5, 0.5, 0.3, 0.2]

function formatTime(seconds) {
  if (!seconds) return '--:--'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function WinnersPodium() {
  const showPodium = useWorkshopStore(s => s.showPodium)
  const roundWinners = useWorkshopStore(s => s.roundWinners)
  const dismissPodium = useWorkshopStore(s => s.dismissPodium)
  const soundEnabled = useWorkshopStore(s => s.soundEnabled)

  return (
    <AnimatePresence>
      {showPodium && roundWinners && roundWinners.length > 0 && (
        <motion.div
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-lg w-full px-6 text-center">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-10"
            >
              <div className="font-mono text-[12px] tracking-[4px] uppercase text-text-dim mb-2">Раунд завершён</div>
              <h2 className="font-display text-3xl text-white">Результаты</h2>
            </motion.div>

            {/* Winners — reveal 3rd, then 2nd, then 1st */}
            <div className="space-y-4">
              {[...roundWinners].sort((a, b) => b.rank - a.rank).map((winner, i) => {
                const char = CHARACTERS.find(c => c.id === winner.character_id)
                const isFirst = winner.rank === 1
                const delay = DELAYS[i] || 0.5

                return (
                  <motion.div
                    key={winner.rank}
                    initial={{ opacity: 0, scale: 0.5, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay, type: 'spring', stiffness: 200, damping: 15 }}
                    onAnimationComplete={() => {
                      if (soundEnabled && isFirst) playBadgeSound()
                    }}
                    className={`flex items-center gap-4 p-4 border ${
                      isFirst
                        ? 'border-qa-teal/50 bg-qa-teal/[0.08]'
                        : 'border-border bg-surface/50'
                    }`}
                  >
                    {/* Medal */}
                    <span className={`text-3xl ${isFirst ? 'animate-bounce' : ''}`}>
                      {MEDALS[winner.rank - 1] || '🏅'}
                    </span>

                    {/* Character photo */}
                    {char?.image ? (
                      <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2"
                        style={{ borderColor: isFirst ? '#00E5CC' : '#1E1E1E' }}>
                        <img src={char.image} alt="" className="w-full h-full object-cover object-top" />
                      </div>
                    ) : (
                      <span className="text-2xl">{char?.emoji || '🐉'}</span>
                    )}

                    {/* Info */}
                    <div className="flex-1 text-left min-w-0">
                      <div className={`font-display text-lg truncate ${isFirst ? 'text-white' : 'text-text-body'}`}>
                        {winner.name}
                      </div>
                      <div className="font-mono text-[11px] text-text-dim">
                        {char?.title || ''}
                      </div>
                    </div>

                    {/* Score + Time */}
                    <div className="text-right shrink-0">
                      <div className={`font-mono text-lg font-bold ${isFirst ? 'text-qa-teal' : 'text-text-body'}`}>
                        {winner.score}/10
                      </div>
                      <div className="font-mono text-[11px] text-text-dim">
                        {formatTime(winner.duration_seconds)}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Dismiss */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 4 }}
              onClick={dismissPodium}
              className="mt-8 px-8 py-3 border border-border text-text-secondary font-mono text-[12px] tracking-wider uppercase hover:border-qa-teal/30 hover:text-white transition-colors cursor-pointer"
            >
              Продолжить
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
