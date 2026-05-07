import { useState, useEffect } from 'react'
import { PAGES } from '../data/pages'
import { CHARACTERS } from '../data/characters'
import { advanceAll, getAllStudents, setWorkshopPhase, deleteStudent } from '../api/facilitator'
import RoundControl from './RoundControl'

export default function Dashboard() {
  const [students, setStudents] = useState([])
  const [currentUnlock, setCurrentUnlock] = useState(4)
  const [phase, setPhase] = useState('pre')
  const [search, setSearch] = useState('')
  const [busyId, setBusyId] = useState(null)

  const handleDelete = async (student) => {
    setBusyId(student.id)
    const { error } = await deleteStudent(student.id)
    setBusyId(null)
    if (error) {
      alert('Delete failed: ' + (error.message || JSON.stringify(error)))
      return
    }
    setStudents(prev => prev.filter(s => s.id !== student.id))
  }

  const filteredStudents = students.filter(s => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      (s.nickname || '').toLowerCase().includes(q) ||
      (s.name || '').toLowerCase().includes(q) ||
      (s.studio || '').toLowerCase().includes(q) ||
      (s.role || '').toLowerCase().includes(q)
    )
  })

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

        {/* Round control */}
        <RoundControl />

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
          <div className="p-4 border-b border-border bg-surface/50 flex items-center justify-between gap-3 flex-wrap">
            <div className="font-mono text-[12px] tracking-[2px] uppercase text-text-dim">
              Registered ({filteredStudents.length}{search ? ` of ${students.length}` : ''})
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search nickname, name, studio..."
                className="px-3 py-1.5 bg-bg border border-border text-white text-[12px] font-mono placeholder:text-text-dim focus:border-qa-teal outline-none w-[220px]"
              />
              <button
                onClick={async () => setStudents(await getAllStudents())}
                className="font-mono text-[12px] text-qa-teal tracking-wider hover:underline cursor-pointer"
              >
                Refresh
              </button>
            </div>
          </div>

          {filteredStudents.length === 0 ? (
            <div className="p-8 text-center text-text-dim text-sm">
              {students.length === 0 ? 'Ещё никто не зарегистрировался' : 'Nothing matches that search'}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredStudents.map(student => {
                const char = CHARACTERS.find(c => c.id === student.character_id)
                const pageTitle = PAGES[student.current_page]?.title || '—'
                const created = student.created_at ? new Date(student.created_at).toLocaleString() : '—'
                return (
                  <div key={student.id} className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 p-4 hover:bg-surface/30 transition-colors">
                    <span className="text-lg">{char?.emoji || '👤'}</span>

                    <div className="min-w-0">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-mono text-[14px] text-qa-teal font-semibold">
                          {student.nickname || '—'}
                        </span>
                        <span className="text-sm text-white truncate">{student.name || '—'}</span>
                      </div>
                      <div className="font-mono text-[11px] text-text-dim flex flex-wrap gap-x-3">
                        <span>{student.studio || '— studio'}</span>
                        <span>·</span>
                        <span>{student.role || '— role'}</span>
                        {student.claude_code_ready && <><span>·</span><span className="text-qa-teal">claude ready</span></>}
                        <span>·</span>
                        <span className="italic">{created}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono text-sm text-qa-teal">{student.xp || 0} XP</div>
                      <div className="font-mono text-[11px] text-text-dim">
                        P{String(student.current_page || 0).padStart(2, '0')} {pageTitle}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(student)}
                      disabled={busyId === student.id}
                      className="font-mono text-[10px] tracking-[2px] uppercase border border-corp-red/40 text-corp-red px-3 py-2 hover:bg-corp-red/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
                      title="Delete this registration"
                    >
                      {busyId === student.id ? '…' : 'Delete'}
                    </button>
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
