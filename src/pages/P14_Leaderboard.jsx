import { useState, useEffect } from 'react'
import { useWorkshopStore } from '../store/workshopStore'
import { usePersona } from '../store/usePersona'
import { CHARACTERS } from '../data/characters'
import { getLeaderboard } from '../api/leaderboard'
import PageShell from '../core/PageShell'

export default function P14_Leaderboard() {
  const [leaders, setLeaders] = useState([])
  const myXp = useWorkshopStore(s => s.xp)
  const myName = useWorkshopStore(s => s.user.name)
  const myCharId = useWorkshopStore(s => s.user.characterId)
  const persona = usePersona()
  const myChar = CHARACTERS.find(c => c.id === myCharId)

  useEffect(() => {
    const load = () => getLeaderboard().then(d => { if (d.length) setLeaders(d) })
    load()
    const i = setInterval(load, 5000)
    return () => clearInterval(i)
  }, [])

  return (
    <PageShell pageIndex={11}>
      {leaders.length === 0 ? (
        <div className="text-center space-y-6">
          <div className="relative overflow-hidden border p-8" style={{ borderColor: persona.accentBorder, backgroundColor: persona.accentLight }}>
            {myChar?.image && <div className="absolute inset-0 opacity-10"><img src={myChar.image} alt="" className="w-full h-full object-cover" /></div>}
            <div className="relative">
              <div className="font-display text-5xl font-bold mb-2" style={{ color: persona.accent }}>{myXp}</div>
              <div className="font-mono text-[12px] text-text-dim tracking-wider uppercase">Итоговый XP</div>
              <div className="font-display text-lg text-white mt-3">{myName}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {leaders.slice(0, 20).map((s, i) => {
            const ch = CHARACTERS.find(c => c.id === s.character_id)
            const isMe = s.name === myName
            return (
              <div key={s.id} className={`flex items-center gap-3 p-3 border ${isMe ? '' : 'border-border bg-surface/30'}`}
                style={isMe ? { borderColor: persona.accentBorder, backgroundColor: persona.accentLight } : {}}>
                <span className={`font-mono text-lg font-bold w-8 text-center ${i < 3 ? '' : 'text-text-dim'}`}
                  style={i < 3 ? { color: persona.accent } : {}}>{i + 1}</span>
                {ch?.image ? <div className="w-8 h-8 rounded-full overflow-hidden shrink-0"><img src={ch.image} alt="" className="w-full h-full object-cover object-top" /></div> : <span className="text-lg">{ch?.emoji || '🐉'}</span>}
                <div className="flex-1 min-w-0"><div className="text-sm text-white truncate">{s.name}</div></div>
                <div className="font-mono text-sm font-bold" style={{ color: isMe ? persona.accent : 'var(--color-qa-teal)' }}>{s.xp} XP</div>
              </div>
            )
          })}
        </div>
      )}
    </PageShell>
  )
}
