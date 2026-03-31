import { useState, useEffect } from 'react'

export default function NarrativeBlock({ text, speed = 25 }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let i = 0
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1))
        i++
      } else {
        setDone(true)
        clearInterval(interval)
      }
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed])

  return (
    <div className="p-6 border border-border border-l-[3px] border-l-qa-teal bg-surface/50 text-left">
      <div className="font-mono text-[11px] tracking-[2px] uppercase text-qa-teal mb-3 flex items-center gap-2">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-qa-teal animate-[blink_1.5s_ease-in-out_infinite]" />
        Narrative
      </div>
      <p className="font-display text-base text-text-primary italic leading-relaxed">
        {displayed}
        {!done && <span className="inline-block w-0.5 h-5 bg-qa-teal ml-0.5 align-text-bottom animate-[blink_0.8s_step-end_infinite]" />}
      </p>
    </div>
  )
}
