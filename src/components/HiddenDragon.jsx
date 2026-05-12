import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import confetti from 'canvas-confetti'
import { useWorkshopStore } from '../store/workshopStore'
import { findDragonById } from '../data/hidden-dragons'
import { updateStudentProgress } from '../api/progress'

/**
 * A tiny dragon hidden on a slide. Click → puff + curve-flight to HUD
 * (where the Wyrmling counter lives) + confetti + XP. Golden variant
 * fires fullscreen confetti.
 *
 * Lifecycle:
 *   idle   — semi-transparent dragon at its hiding spot, opacity ~0.18
 *            (hover bumps to ~0.55, scale ×1.15, cursor pointer)
 *   puff   — scales up 2.5× + opacity 1, rotation snap to 0 (250ms)
 *   fly    — arcs toward HUD bottom-right, scaling down, rotating (1.5s)
 *   done   — invisible; XP recorded in store; toast plays via lastToast
 *
 * Idempotent — clicking the same id twice or on reload doesn't re-award.
 * The component returns null once found.
 *
 * Place anywhere inside a slide; default positioning is absolute via
 * inline style. Override via props:
 *   <HiddenDragon id="..." style={{ top: 20, right: 30 }} />
 */

// Hand-drawn dragon silhouettes (5 variants in /public/dragons/).
// Each dragon entry deterministically picks one via hash(id) % 5.
const SILHOUETTE_COUNT = 5
function pickSilhouette(id) {
  let h = 0
  for (let i = 0; i < (id || '').length; i++) {
    h = ((h << 5) - h) + id.charCodeAt(i)
    h |= 0
  }
  return (Math.abs(h) % SILHOUETTE_COUNT) + 1
}

export default function HiddenDragon({
  id,
  style = {},
  size: sizeOverride,
  opacity: opacityOverride,
  rotation: rotationOverride,
}) {
  const dragon = findDragonById(id)
  const found = useWorkshopStore(s => s.hiddenDragonsFound.some(d => d.id === id))
  const markDragonFound = useWorkshopStore(s => s.markDragonFound)
  const buttonRef = useRef(null)
  const [stage, setStage] = useState('idle')
  const [flightDelta, setFlightDelta] = useState({ x: 0, y: 0 })

  if (!dragon || found) return null

  const variant = dragon.variant || 'regular'
  const isGolden = variant === 'golden'
  const size = sizeOverride || dragon.size || 18
  const baseOpacity = opacityOverride != null ? opacityOverride : dragon.opacity || 0.18
  const rotation = rotationOverride != null ? rotationOverride : dragon.rotation || 0
  const color = isGolden ? '#FEED00' : '#00E5CC'

  const handleClick = (e) => {
    if (stage !== 'idle') return
    if (!buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    const startX = rect.left + rect.width / 2
    const startY = rect.top + rect.height / 2
    // Aim toward the Wyrmling counter in the HUD (bottom-right). The
    // HUD's actual element id is hud-wyrmlings — measure it if present.
    let targetX = window.innerWidth - 80
    let targetY = window.innerHeight - 60
    const hud = document.getElementById('hud-wyrmlings')
    if (hud) {
      const hr = hud.getBoundingClientRect()
      targetX = hr.left + hr.width / 2
      targetY = hr.top + hr.height / 2
    }
    setFlightDelta({ x: targetX - startX, y: targetY - startY })
    setStage('puff')

    // Confetti burst at click point (paged in screen coords 0..1)
    confetti({
      particleCount: isGolden ? 100 : 24,
      spread: 70,
      startVelocity: 32,
      origin: { x: startX / window.innerWidth, y: startY / window.innerHeight },
      colors: isGolden
        ? ['#FFD700', '#FFA500', '#FEED00', '#FFFFFF']
        : ['#00E5CC', '#FEED00', '#FF65BE', '#FFFFFF'],
      ticks: 200,
      scalar: isGolden ? 1.2 : 0.9,
    })

    // Golden — fullscreen secondary burst + cannons from edges
    if (isGolden) {
      setTimeout(() => {
        confetti({
          particleCount: 250,
          spread: 160,
          origin: { x: 0.5, y: 0.45 },
          colors: ['#FFD700', '#FEED00', '#FFA500', '#FFFFFF'],
          startVelocity: 55,
          gravity: 0.65,
          ticks: 320,
          scalar: 1.3,
        })
      }, 220)
      setTimeout(() => {
        confetti({ particleCount: 80, angle: 60, spread: 55, origin: { x: 0, y: 0.7 },
          colors: ['#FFD700', '#FEED00'] })
        confetti({ particleCount: 80, angle: 120, spread: 55, origin: { x: 1, y: 0.7 },
          colors: ['#FFD700', '#FEED00'] })
      }, 500)
    }

    // Timeline: puff (0-250ms) → fly (250-1700ms) → done + award
    setTimeout(() => setStage('fly'), 240)
    setTimeout(() => {
      markDragonFound(id, dragon.xpReward)
      setStage('done')
      // Fire-and-forget server sync (XP + dragon list)
      const state = useWorkshopStore.getState()
      const studentId = state.user?.id
      const nickname = state.user?.nickname
      if (studentId || nickname) {
        updateStudentProgress({
          studentId, nickname,
          xp: state.xp,
          hiddenDragonsFound: (state.hiddenDragonsFound || []).map(d => d.id),
        }).catch(() => {})
      }
    }, 1700)
  }

  // Animation variants per stage
  const silhouetteIdx = pickSilhouette(id)
  const silhouettePath = `/dragons/silhouette-${silhouetteIdx}.png`

  const baseStyle = {
    position: style.position || 'absolute',
    top: style.top ?? dragon.position?.top,
    left: style.left ?? dragon.position?.left,
    right: style.right ?? dragon.position?.right,
    bottom: style.bottom ?? dragon.position?.bottom,
    width: size,
    height: size,
    lineHeight: 1,
    pointerEvents: stage === 'idle' ? 'auto' : 'none',
    background: 'transparent',
    border: 'none',
    padding: 0,
    cursor: stage === 'idle' ? 'pointer' : 'default',
    zIndex: stage === 'idle' ? 5 : 200,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
    ...style,
  }

  const motionProps = stage === 'idle' ? {
    animate: { opacity: baseOpacity, scale: 1, rotate: rotation, x: 0, y: 0 },
    whileHover: { opacity: 0.6, scale: 1.18, filter: 'drop-shadow(0 0 6px currentColor)' },
    transition: { duration: 0.2 },
  } : stage === 'puff' ? {
    animate: {
      opacity: 1,
      scale: 2.6,
      rotate: 0,
      filter: `drop-shadow(0 0 14px ${color})`,
    },
    transition: { duration: 0.24, ease: 'easeOut' },
  } : stage === 'fly' ? {
    animate: {
      opacity: [1, 1, 0.6, 0],
      scale: [2.6, 1.4, 0.7, 0.3],
      x: [0, flightDelta.x * 0.35, flightDelta.x * 0.75, flightDelta.x],
      y: [0, flightDelta.y * 0.35 - 100, flightDelta.y * 0.7 - 30, flightDelta.y],
      rotate: [0, 25, -15, 40],
      filter: [
        `drop-shadow(0 0 14px ${color})`,
        `drop-shadow(0 0 18px ${color})`,
        `drop-shadow(0 0 8px ${color})`,
        `drop-shadow(0 0 0px ${color})`,
      ],
    },
    transition: { duration: 1.4, times: [0, 0.35, 0.7, 1], ease: 'easeInOut' },
  } : {
    animate: { opacity: 0, scale: 0 },
    transition: { duration: 0.1 },
  }

  return (
    <>
      <motion.button
        ref={buttonRef}
        aria-label="hidden dragon"
        onClick={handleClick}
        style={baseStyle}
        initial={{ opacity: baseOpacity, scale: 1, rotate: rotation }}
        {...motionProps}
      >
        <img
          src={silhouettePath}
          alt=""
          draggable={false}
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            pointerEvents: 'none',
            filter: isGolden
              ? `drop-shadow(0 0 4px ${color}) hue-rotate(40deg) saturate(2) brightness(1.3)`
              : 'none',
          }}
        />
      </motion.button>

      {/* Spark trail particles during flight — render 6 echoes with stagger */}
      <AnimatePresence>
        {stage === 'fly' && (
          <>
            {[0, 1, 2, 3, 4, 5].map(i => (
              <motion.span
                key={`spark-${i}`}
                style={{
                  position: 'fixed',
                  pointerEvents: 'none',
                  left: buttonRef.current ? buttonRef.current.getBoundingClientRect().left + size / 2 : 0,
                  top: buttonRef.current ? buttonRef.current.getBoundingClientRect().top + size / 2 : 0,
                  width: 6, height: 6,
                  borderRadius: '50%',
                  background: color,
                  zIndex: 199,
                }}
                initial={{ opacity: 0.9, scale: 1 }}
                animate={{
                  opacity: [0.9, 0.5, 0],
                  scale: [1, 0.6, 0.2],
                  x: [0, flightDelta.x * 0.4, flightDelta.x * 0.85],
                  y: [0, flightDelta.y * 0.4 - 80, flightDelta.y * 0.85 - 10],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1.2 + i * 0.05,
                  delay: i * 0.06,
                  ease: 'easeOut',
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </>
  )
}
