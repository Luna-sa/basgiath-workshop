import { useState, useEffect } from 'react'
import { getRoundSubmissions } from '../api/rounds'
import { CHARACTERS } from '../data/characters'

/**
 * Mini live leaderboard showing top 3 during a timed round.
 * Polls every 5 seconds while active.
 */
export default function MiniLeaderboard({ roundId, active }) {
  const [top3, setTop3] = useState([])

  useEffect(() => {
    if (!active || !roundId) return
    const load = async () => {
      const subs = await getRoundSubmissions(roundId)
      setTop3(subs.slice(0, 3))
    }
    load()
    const interval = setInterval(load, 5000)
    return () => clearInterval(interval)
  }, [active, roundId])

  if (!active || top3.length === 0) return null

  return (
    <div className="border border-[#2E2E2E] bg-[#141414] rounded-lg p-3">
      <div className="font-mono text-[11px] text-text-dim tracking-wider uppercase mb-2">Live Top 3</div>
      <div className="space-y-1.5">
        {top3.map((sub, i) => {
          const medals = ['🥇', '🥈', '🥉']
          const char = CHARACTERS.find(c => c.id === sub.students?.character_id)
          return (
            <div key={sub.id} className="flex items-center gap-2">
              <span className="text-base">{medals[i]}</span>
              {char?.image ? (
                <div className="w-5 h-5 rounded-full overflow-hidden shrink-0">
                  <img src={char.image} alt="" className="w-full h-full object-cover object-top" />
                </div>
              ) : null}
              <span className="text-[13px] text-text-body truncate flex-1">{sub.students?.name || '???'}</span>
              <span className="font-mono text-[12px] text-qa-teal">{sub.score || 0}/10</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
