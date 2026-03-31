import { useState, useEffect } from 'react'
import { useWorkshopStore } from '../store/workshopStore'
import { CHARACTERS } from '../data/characters'
import { getLeaderboard } from '../api/leaderboard'
import PageShell from '../core/PageShell'

export default function P15_Leaderboard() {
  const [leaders, setLeaders] = useState([])
  const myXp = useWorkshopStore(s => s.xp)
  const myName = useWorkshopStore(s => s.user.name)

  useEffect(() => {
    const load = () => getLeaderboard().then(d => { if (d.length) setLeaders(d) })
    load()
    const i = setInterval(load, 5000)
    return () => clearInterval(i)
  }, [])

  return (
    <PageShell pageIndex={15}>
      {leaders.length === 0 ? (
        <div className="text-center p-8 border border-qa-teal/30 bg-qa-teal/[0.05]">
          <div className="font-display text-5xl text-qa-teal font-bold mb-2">{myXp}</div>
          <div className="font-mono text-[12px] text-text-dim tracking-wider uppercase">Итоговый XP</div>
          <div className="font-display text-lg text-white mt-3">{myName}</div>
        </div>
      ) : (
        <div className="space-y-2">
          {leaders.slice(0, 20).map((s, i) => {
            const ch = CHARACTERS.find(c => c.id === s.character_id)
            return (
              <div key={s.id} className={`flex items-center gap-4 p-4 border ${s.name === myName ? 'border-qa-teal/30 bg-qa-teal/[0.05]' : 'border-border bg-surface/30'}`}>
                <span className={`font-mono text-lg font-bold w-8 text-center ${i < 3 ? 'text-qa-teal' : 'text-text-dim'}`}>{i + 1}</span>
                <span className="text-lg">{ch?.emoji || '🐉'}</span>
                <div className="flex-1"><div className="text-sm text-white truncate">{s.name}</div></div>
                <div className="font-mono text-sm text-qa-teal font-bold">{s.xp} XP</div>
              </div>
            )
          })}
        </div>
      )}
    </PageShell>
  )
}
