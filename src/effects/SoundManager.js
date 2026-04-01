// Lightweight sound effect manager
// Plays short audio on XP gain, badge earn, page transition
// Sounds are generated as oscillator beeps — no external files needed

let audioCtx = null

function getContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioCtx
}

function playTone(frequency, duration = 0.15, type = 'sine', volume = 0.1) {
  try {
    const ctx = getContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = type
    osc.frequency.setValueAtTime(frequency, ctx.currentTime)
    gain.gain.setValueAtTime(volume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration)
  } catch (e) {
    // Audio not available — silently fail
  }
}

export function playXPSound() {
  playTone(880, 0.1, 'sine', 0.08)
  setTimeout(() => playTone(1100, 0.12, 'sine', 0.06), 80)
}

export function playBadgeSound() {
  playTone(660, 0.1, 'sine', 0.08)
  setTimeout(() => playTone(880, 0.1, 'sine', 0.08), 100)
  setTimeout(() => playTone(1320, 0.2, 'sine', 0.06), 200)
}

export function playNavigateSound() {
  playTone(440, 0.06, 'sine', 0.04)
}

export function playSuccessSound() {
  playTone(523, 0.08, 'sine', 0.06)
  setTimeout(() => playTone(659, 0.08, 'sine', 0.06), 80)
  setTimeout(() => playTone(784, 0.15, 'sine', 0.05), 160)
}

export function playErrorSound() {
  playTone(200, 0.15, 'square', 0.05)
}
