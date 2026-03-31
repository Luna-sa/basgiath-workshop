import { useState, useEffect } from 'react'
import { PAGES } from '../data/pages'
import { CHARACTERS } from '../data/characters'
import { advanceAll, getAllStudents, setWorkshopPhase } from '../api/facilitator'

export default function Dashboard() {
  const [students, setStudents] = useState([])
  const [currentUnlock, setCurrentUnlock] = useState(4)
  const [phase, setPhase] = useState('pre')

  // Poll students every 3 seconds
  useEffect(() => {
    const load = async () => {
      const data = await getAllStudents()
      setStudents(data)
    }
    load()
    const interval = setInterval(load, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleAdvance = async (toPage) => {
    await advanceAll(toPage)
    setCurrentUnlock(toPage)
  }

  const handlePhase = async (newPhase) => {
    await setWorkshopPhase(newPhase)
    setPhase(newPhase)
  }

  return (
    <div className="min-h-screen bg-bg text-text-body p-6">
      {/* Header */}
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl text-white">
              QA <em className="text-qa-teal italic">Clan</em> — Facilitator
            </h1>
            <div className="font-mono text-[12px] text-text-dim tracking-wider mt-1">
              {students.length} студентов · Разблокировано до P{currentUnlock}
            </div>
          </div>
          <div className="flex gap-2">
            {['pre', 'live', 'complete'].map(p => (
              <button
                key={p}
                onClick={() => handlePhase(p)}
                className={`px-4 py-2 font-mono text-[11px] tracking-wider uppercase border cursor-pointer transition-all ${
                  phase === p
                    ? 'border-qa-teal bg-qa-teal/10 text-qa-teal'
                    : 'border-border text-text-dim hover:border-qa-teal/25'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Quick advance controls */}
        <div className="mb-8 p-5 border border-border bg-surface/50">
          <div className="font-mono text-[12px] tracking-[2px] uppercase text-text-dim mb-4">
            Advance All Students
          </div>
          <div className="flex flex-wrap gap-2">
            {PAGES.map(page => (
              <button
                key={page.id}
                onClick={() => handleAdvance(page.id + 1)}
                className={`px-3 py-2 font-mono text-[12px] border cursor-pointer transition-all ${
                  page.id < currentUnlock
                    ? 'border-forest/30 bg-forest/[0.05] text-forest'
                    : page.id === currentUnlock
                      ? 'border-qa-teal bg-qa-teal/10 text-qa-teal animate-pulse'
                      : 'border-border text-text-dim hover:border-qa-teal/25'
                }`}
                title={page.title}
              >
                {String(page.id).padStart(2, '0')}
              </button>
            ))}
          </div>
          <div className="mt-3 font-mono text-[12px] text-text-dim">
            Нажми номер → все студенты получат доступ до этой страницы
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid sm:grid-cols-4 gap-3 mb-8">
          <button
            onClick={() => handleAdvance(6)}
            className="p-4 border border-border bg-surface/30 hover:border-qa-teal/25 cursor-pointer transition-all text-left"
          >
            <div className="font-mono text-[11px] text-qa-teal tracking-wider uppercase mb-1">Начать воркшоп</div>
            <div className="text-xs text-text-dim">Unlock P05 Opening</div>
          </button>
          <button
            onClick={() => handleAdvance(8)}
            className="p-4 border border-border bg-surface/30 hover:border-qa-teal/25 cursor-pointer transition-all text-left"
          >
            <div className="font-mono text-[11px] text-qa-teal tracking-wider uppercase mb-1">После CLAUDE.md</div>
            <div className="text-xs text-text-dim">Unlock Combat Training</div>
          </button>
          <button
            onClick={() => handleAdvance(14)}
            className="p-4 border border-border bg-surface/30 hover:border-qa-teal/25 cursor-pointer transition-all text-left"
          >
            <div className="font-mono text-[11px] text-qa-teal tracking-wider uppercase mb-1">War Games</div>
            <div className="text-xs text-text-dim">Unlock Show & Tell</div>
          </button>
          <button
            onClick={() => handleAdvance(17)}
            className="p-4 border border-border bg-surface/30 hover:border-qa-teal/25 cursor-pointer transition-all text-left"
          >
            <div className="font-mono text-[11px] text-qa-teal tracking-wider uppercase mb-1">Завершить</div>
            <div className="text-xs text-text-dim">Unlock all pages</div>
          </button>
        </div>

        {/* Student tracker */}
        <div className="border border-border">
          <div className="p-4 border-b border-border bg-surface/50 flex items-center justify-between">
            <div className="font-mono text-[12px] tracking-[2px] uppercase text-text-dim">
              Студенты ({students.length})
            </div>
            <button
              onClick={async () => setStudents(await getAllStudents())}
              className="font-mono text-[12px] text-qa-teal tracking-wider hover:underline cursor-pointer"
            >
              Refresh
            </button>
          </div>

          {students.length === 0 ? (
            <div className="p-8 text-center text-text-dim text-sm">
              Ещё никто не зарегистрировался
            </div>
          ) : (
            <div className="divide-y divide-border">
              {students.map(student => {
                const char = CHARACTERS.find(c => c.id === student.character_id)
                const pageTitle = PAGES[student.current_page]?.title || '?'
                return (
                  <div key={student.id} className="flex items-center gap-4 p-4 hover:bg-surface/30 transition-colors">
                    <span className="text-lg">{char?.emoji || '👤'}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white truncate">{student.name}</div>
                      <div className="font-mono text-[12px] text-text-dim">
                        {char?.title || student.role || '—'} · {student.email}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm text-qa-teal">{student.xp} XP</div>
                      <div className="font-mono text-[12px] text-text-dim">
                        P{String(student.current_page).padStart(2, '0')} {pageTitle}
                      </div>
                    </div>
                    <div className="w-20">
                      <div className="h-1.5 bg-border overflow-hidden">
                        <div
                          className="h-full bg-qa-teal transition-all"
                          style={{ width: `${(student.current_page / 16) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
