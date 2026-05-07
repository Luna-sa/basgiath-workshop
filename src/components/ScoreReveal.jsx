import { useState, useEffect, useRef } from 'react'
import { motion } from 'motion/react'

/**
 * Animated score reveal: counts from 0 to target with bounce.
 * Shows score/maxScore + XP bonus.
 */
export default function ScoreReveal({ score, maxScore = 10, xpBonus, accentColor }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    if (score === null || score === undefined) return
    const duration = 1500
    const startTime = Date.now()
    const tick = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * score))
      if (progress < 1) ref.current = requestAnimationFrame(tick)
    }
    ref.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(ref.current)
  }, [score])

  if (score === null || score === undefined) return null

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      className="text-center p-6 border rounded-lg"
      style={{ borderColor: accentColor + '40', backgroundColor: accentColor + '14' }}
    >
      <motion.div
        className="font-display text-5xl font-bold mb-1"
        style={{ color: accentColor }}
        animate={{ scale: count === score ? [1, 1.15, 1] : 1 }}
        transition={{ duration: 0.3 }}
      >
        {count}<span className="text-text-dim text-2xl">/{maxScore}</span>
      </motion.div>
      {xpBonus > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="font-mono text-[14px] tracking-wider"
          style={{ color: accentColor }}
        >
          +{xpBonus} XP
        </motion.div>
      )}
    </motion.div>
  )
}
