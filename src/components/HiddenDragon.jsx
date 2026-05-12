import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import confetti from 'canvas-confetti'
import { useWorkshopStore } from '../store/workshopStore'
import { findDragonById } from '../data/hidden-dragons'
import { updateStudentProgress } from '../api/progress'

/**
 * Hidden dragon — click → reveal + spiral flight to HUD + reward.
 *
 * Multi-layer animation:
 *   idle    silhouette at base opacity, scrolls with content
 *   awake   3 expanding glow rings + 18 spark explosion + dragon
 *           grows to 3.2× + wing-flap kicks in (300ms)
 *   fly     spiral arc to HUD with comet-trail (12 echo silhouettes)
 *           + sparkle ✦ stars dropping along the path (1.5s)
 *   land    burst at HUD location, counter ticks up (250ms)
 *
 * Golden variant: longer (2.5s), edge-cannon confetti, +500 XP
 * floating tag, golden hue-rotate tint, double trail length.
 */

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
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })

  if (!dragon || found) return null

  const variant = dragon.variant || 'regular'
  const isGolden = variant === 'golden'
  const size = sizeOverride || dragon.size || 18
  const baseOpacity = opacityOverride != null ? opacityOverride : dragon.opacity || 0.18
  const rotation = rotationOverride != null ? rotationOverride : dragon.rotation || 0
  const color = isGolden ? '#FEED00' : '#00E5CC'
  const colorRGB = isGolden ? '254, 237, 0' : '0, 229, 204'

  const silhouetteIdx = pickSilhouette(id)
  const silhouettePath = `/dragons/silhouette-${silhouetteIdx}.png`

  // Trail length scales with golden grandeur
  const trailCount = isGolden ? 16 : 12
  const sparkleCount = isGolden ? 12 : 8
  const ringCount = isGolden ? 4 : 3
  const explosionCount = isGolden ? 24 : 18
  // Overall flight duration
  const flightDur = isGolden ? 2.2 : 1.5
  const totalDur = flightDur + 0.3   // includes awake stage

  const handleClick = () => {
    if (stage !== 'idle') return
    if (!buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    const sx = rect.left + rect.width / 2
    const sy = rect.top + rect.height / 2
    let tx = window.innerWidth - 80
    let ty = window.innerHeight - 60
    const hud = document.getElementById('hud-wyrmlings')
    if (hud) {
      const hr = hud.getBoundingClientRect()
      tx = hr.left + hr.width / 2
      ty = hr.top + hr.height / 2
    }
    setStartPos({ x: sx, y: sy })
    setFlightDelta({ x: tx - sx, y: ty - sy })
    setStage('awake')

    // Confetti burst at click point
    confetti({
      particleCount: isGolden ? 120 : 32,
      spread: 80,
      startVelocity: 38,
      origin: { x: sx / window.innerWidth, y: sy / window.innerHeight },
      colors: isGolden
        ? ['#FFD700', '#FFA500', '#FEED00', '#FFFFFF']
        : ['#00E5CC', '#FEED00', '#FF65BE', '#FFFFFF'],
      ticks: 220,
      scalar: isGolden ? 1.3 : 1.0,
    })

    if (isGolden) {
      setTimeout(() => {
        confetti({
          particleCount: 280, spread: 160, origin: { x: 0.5, y: 0.45 },
          colors: ['#FFD700', '#FEED00', '#FFA500', '#FFFFFF'],
          startVelocity: 60, gravity: 0.65, ticks: 360, scalar: 1.4,
        })
      }, 280)
      setTimeout(() => {
        confetti({ particleCount: 100, angle: 60, spread: 60, origin: { x: 0, y: 0.7 },
          colors: ['#FFD700', '#FEED00'] })
        confetti({ particleCount: 100, angle: 120, spread: 60, origin: { x: 1, y: 0.7 },
          colors: ['#FFD700', '#FEED00'] })
      }, 600)
    }

    // Timeline
    setTimeout(() => setStage('fly'), 320)
    setTimeout(() => {
      // Land confetti at HUD
      confetti({
        particleCount: isGolden ? 60 : 28,
        spread: 90,
        startVelocity: 25,
        origin: { x: tx / window.innerWidth, y: ty / window.innerHeight },
        colors: isGolden ? ['#FFD700', '#FEED00', '#FFFFFF'] : ['#00E5CC', '#FEED00', '#FFFFFF'],
        ticks: 140,
      })
      markDragonFound(id, dragon.xpReward)
      setStage('done')
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
    }, totalDur * 1000)
  }

  // ── Main dragon button ──
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

  const dragonAnim = stage === 'idle' ? {
    animate: { opacity: baseOpacity, scale: 1, rotate: rotation },
    whileHover: { opacity: 0.7, scale: 1.2, filter: `drop-shadow(0 0 8px ${color})` },
    transition: { duration: 0.2 },
  } : stage === 'awake' ? {
    animate: {
      opacity: 1,
      scale: 3.2,
      rotate: 0,
      filter: [
        `drop-shadow(0 0 8px ${color})`,
        `drop-shadow(0 0 26px ${color}) drop-shadow(0 0 6px #fff) brightness(1.4)`,
      ],
    },
    transition: { duration: 0.32, ease: [0.34, 1.56, 0.64, 1] },
  } : stage === 'fly' ? {
    animate: {
      opacity: [1, 1, 0.6, 0],
      scale: [3.2, 1.8, 0.8, 0.3],
      rotate: [0, 35, -20, 50],
      x: [
        0,
        flightDelta.x * 0.25 + (flightDelta.x > 0 ? 60 : -60),
        flightDelta.x * 0.65,
        flightDelta.x,
      ],
      y: [
        0,
        flightDelta.y * 0.25 - 140,
        flightDelta.y * 0.55 - 60,
        flightDelta.y,
      ],
      filter: [
        `drop-shadow(0 0 26px ${color}) brightness(1.4)`,
        `drop-shadow(0 0 22px ${color}) brightness(1.3)`,
        `drop-shadow(0 0 12px ${color}) brightness(1.1)`,
        `drop-shadow(0 0 0px ${color})`,
      ],
    },
    transition: { duration: flightDur, times: [0, 0.35, 0.7, 1], ease: [0.4, 0, 0.2, 1] },
  } : { animate: { opacity: 0, scale: 0 }, transition: { duration: 0.1 } }

  // Wing-flap on inner img — scaleY oscillates during awake + fly
  const wingFlap = (stage === 'awake' || stage === 'fly') ? {
    scaleY: [1, 0.55, 1.15, 0.55, 1.15, 0.6, 1.1, 0.7, 1],
  } : { scaleY: 1 }

  return (
    <>
      <motion.button
        ref={buttonRef}
        aria-label="hidden dragon"
        onClick={handleClick}
        style={baseStyle}
        initial={{ opacity: baseOpacity, scale: 1, rotate: rotation }}
        {...dragonAnim}
      >
        <motion.img
          src={silhouettePath}
          alt=""
          draggable={false}
          animate={wingFlap}
          transition={{
            duration: stage === 'fly' ? flightDur : 0.6,
            ease: 'easeInOut',
          }}
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            pointerEvents: 'none',
            transformOrigin: 'center',
            filter: isGolden
              ? `drop-shadow(0 0 4px ${color}) hue-rotate(40deg) saturate(2) brightness(1.3)`
              : 'none',
          }}
        />
      </motion.button>

      <AnimatePresence>
        {(stage === 'awake' || stage === 'fly') && (
          <>
            {/* ── Expanding glow rings at start position ── */}
            {[...Array(ringCount)].map((_, i) => (
              <motion.div
                key={`ring-${i}`}
                style={{
                  position: 'fixed',
                  left: startPos.x - 30,
                  top: startPos.y - 30,
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  border: `2px solid ${color}`,
                  pointerEvents: 'none',
                  zIndex: 198,
                  boxShadow: `0 0 24px rgba(${colorRGB}, 0.6)`,
                }}
                initial={{ scale: 0.4, opacity: 0.95 }}
                animate={{ scale: [0.4, 5], opacity: [0.9, 0] }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1.1,
                  delay: i * 0.18,
                  ease: 'easeOut',
                }}
              />
            ))}

            {/* ── Spark explosion: radiate outward in a circle ── */}
            {[...Array(explosionCount)].map((_, i) => {
              const angle = (i / explosionCount) * Math.PI * 2
              const dist = 90 + Math.random() * 50
              return (
                <motion.span
                  key={`spark-${i}`}
                  style={{
                    position: 'fixed',
                    left: startPos.x - 3,
                    top: startPos.y - 3,
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: i % 3 === 0 ? '#FFFFFF' : color,
                    pointerEvents: 'none',
                    zIndex: 199,
                    boxShadow: `0 0 8px ${color}`,
                  }}
                  initial={{ scale: 1, opacity: 1 }}
                  animate={{
                    x: Math.cos(angle) * dist,
                    y: Math.sin(angle) * dist,
                    scale: [1, 0.3],
                    opacity: [1, 0],
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.7 + Math.random() * 0.2,
                    ease: 'easeOut',
                  }}
                />
              )
            })}
          </>
        )}

        {stage === 'fly' && (
          <>
            {/* ── Comet trail: silhouette echoes following dragon ── */}
            {[...Array(trailCount)].map((_, i) => {
              const stagger = i * (flightDur * 0.04)
              const echoScale = 2.4 - i * 0.12
              return (
                <motion.img
                  key={`trail-${i}`}
                  src={silhouettePath}
                  alt=""
                  draggable={false}
                  style={{
                    position: 'fixed',
                    left: startPos.x - size,
                    top: startPos.y - size,
                    width: size * 2,
                    height: size * 2,
                    pointerEvents: 'none',
                    zIndex: 197,
                    filter: isGolden
                      ? `drop-shadow(0 0 6px ${color}) hue-rotate(40deg) saturate(2) brightness(1.2)`
                      : `drop-shadow(0 0 8px ${color})`,
                  }}
                  initial={{ opacity: 0, scale: echoScale, x: 0, y: 0 }}
                  animate={{
                    opacity: [0, 0.55 * (1 - i / trailCount), 0],
                    scale: [echoScale, echoScale * 0.6, 0.3],
                    rotate: [0, 25, 60],
                    x: [
                      0,
                      flightDelta.x * 0.25 + (flightDelta.x > 0 ? 60 : -60),
                      flightDelta.x * 0.65,
                      flightDelta.x * 0.95,
                    ],
                    y: [
                      0,
                      flightDelta.y * 0.25 - 140,
                      flightDelta.y * 0.55 - 60,
                      flightDelta.y * 0.95,
                    ],
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: flightDur,
                    delay: stagger,
                    times: [0, 0.35, 0.7, 1],
                    ease: [0.4, 0, 0.2, 1],
                  }}
                />
              )
            })}

            {/* ── Sparkle ✦ stars dropping along the path ── */}
            {[...Array(sparkleCount)].map((_, i) => {
              const t = (i + 1) / (sparkleCount + 1)
              return (
                <motion.span
                  key={`sparkle-${i}`}
                  style={{
                    position: 'fixed',
                    left: startPos.x - 8,
                    top: startPos.y - 8,
                    fontSize: 14 + Math.random() * 6,
                    color,
                    pointerEvents: 'none',
                    zIndex: 199,
                    textShadow: `0 0 8px ${color}`,
                    fontWeight: 'bold',
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0.4, 1.4, 0.2],
                    x: flightDelta.x * t + (Math.random() - 0.5) * 40,
                    y: flightDelta.y * t - 80 * Math.sin(t * Math.PI) + (Math.random() - 0.5) * 40,
                    rotate: 360,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.9,
                    delay: 0.2 + t * (flightDur - 0.2),
                    ease: 'easeOut',
                  }}
                >
                  ✦
                </motion.span>
              )
            })}

            {/* ── Floating XP tag (mid-flight) ── */}
            <motion.span
              key="xp-tag"
              style={{
                position: 'fixed',
                left: startPos.x + flightDelta.x * 0.4 - 30,
                top: startPos.y + flightDelta.y * 0.4 - 110,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: isGolden ? 18 : 14,
                fontWeight: 700,
                color: isGolden ? '#FFD700' : '#FFFFFF',
                textShadow: `0 0 8px ${color}, 0 0 16px ${color}`,
                pointerEvents: 'none',
                zIndex: 201,
                whiteSpace: 'nowrap',
              }}
              initial={{ opacity: 0, scale: 0.5, y: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0.5, 1.2, 1.0, 0.7],
                y: [0, -10, -30, -50],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: flightDur * 0.9,
                delay: 0.3,
                times: [0, 0.2, 0.7, 1],
                ease: 'easeOut',
              }}
            >
              +{dragon.xpReward} XP
            </motion.span>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
