import { useState, useEffect } from 'react'
import { startRound, endRound, getRoundSubmissions, ROUND_CONFIG } from '../api/rounds'

export default function RoundControl() {
  const [activeRound, setActiveRound] = useState(null)
  const [timerStart, setTimerStart] = useState(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(false)

  // Timer countdown
  useEffect(() => {
    if (!activeRound || !timerStart) return
    const config = ROUND_CONFIG[activeRound]
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - new Date(timerStart).getTime()) / 1000)
      const left = Math.max(0, (config?.duration || 420) - elapsed)
      setTimeLeft(left)
      if (left <= 0) {
        clearInterval(interval)
        handleEndRound()
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [activeRound, timerStart])

  // Poll submissions while round is active
  useEffect(() => {
    if (!activeRound) return
    const poll = setInterval(async () => {
      const subs = await getRoundSubmissions(activeRound)
      setSubmissions(subs)
    }, 3000)
    return () => clearInterval(poll)
  }, [activeRound])

  const handleStartRound = async (roundId) => {
    setLoading(true)
    await startRound(roundId)
    setActiveRound(roundId)
    setTimerStart(new Date().toISOString())
    setSubmissions([])
    setLoading(false)
  }

  const handleEndRound = async () => {
    if (!activeRound) return
    setLoading(true)
    const winners = await endRound(activeRound)
    setActiveRound(null)
    setTimerStart(null)
    setLoading(false)
  }

  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60

  return (
    <div className="border border-border mb-8">
      <div className="p-4 border-b border-border bg-surface/50">
        <div className="font-mono text-[12px] tracking-[2px] uppercase text-text-dim">
          Управление раундами
        </div>
      </div>

      <div className="p-5">
        {!activeRound ? (
          /* No round active — show start buttons */
          <div className="grid sm:grid-cols-2 gap-3">
            {Object.entries(ROUND_CONFIG).map(([id, config]) => (
              <button
                key={id}
                onClick={() => handleStartRound(id)}
                disabled={loading}
                className="p-4 border border-border bg-surface/30 hover:border-qa-teal/25 cursor-pointer transition-all text-left disabled:opacity-50"
              >
                <div className="font-mono text-[11px] text-qa-teal tracking-wider uppercase mb-1">
                  {id.replace('-', ' ')}
                </div>
                <div className="text-sm text-text-body">{config.title}</div>
                <div className="text-xs text-text-dim mt-1">{Math.floor(config.duration / 60)} мин</div>
              </button>
            ))}
          </div>
        ) : (
          /* Round active */
          <div className="space-y-5">
            {/* Timer + End button */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-mono text-[11px] text-qa-teal tracking-wider uppercase">
                  {activeRound.replace('-', ' ')} — {ROUND_CONFIG[activeRound]?.title}
                </div>
                <div className={`font-mono text-3xl font-bold mt-1 ${
                  timeLeft > 60 ? 'text-qa-teal' : 'text-corp-red'
                }`}>
                  {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
                </div>
              </div>
              <button
                onClick={handleEndRound}
                disabled={loading}
                className="px-6 py-3 bg-corp-red text-white font-body text-[14px] font-semibold rounded-[2px] hover:bg-corp-red/80 transition-colors cursor-pointer disabled:opacity-50"
              >
                Завершить раунд
              </button>
            </div>

            {/* Live submissions feed */}
            <div>
              <div className="font-mono text-[11px] text-text-dim tracking-wider uppercase mb-3">
                Результаты ({submissions.length})
              </div>
              {submissions.length === 0 ? (
                <div className="p-4 border border-border bg-surface/30 text-center text-text-dim text-sm">
                  Ждём первый результат...
                </div>
              ) : (
                <div className="space-y-1">
                  {submissions.map((sub, i) => (
                    <div key={sub.id} className="flex items-center gap-3 p-3 border border-border bg-surface/30">
                      <span className={`font-mono text-lg font-bold w-8 text-center ${
                        i === 0 ? 'text-qa-teal' : i === 1 ? 'text-text-primary' : i === 2 ? 'text-ember' : 'text-text-dim'
                      }`}>
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white truncate">{sub.students?.name || 'Unknown'}</div>
                      </div>
                      <div className="font-mono text-sm text-qa-teal font-bold">{sub.score || 0}/10</div>
                      <div className="font-mono text-[11px] text-text-dim w-16 text-right">
                        {sub.duration_seconds ? `${Math.floor(sub.duration_seconds / 60)}:${String(sub.duration_seconds % 60).padStart(2, '0')}` : '--:--'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
