import { useState, useEffect } from 'react'
import { PAGES } from '../data/pages'
import { CHARACTERS } from '../data/characters'
import {
  getAllStudents, setWorkshopPhase, deleteStudent,
  awardXp, setAnnouncement, getPrizes, updatePrize,
} from '../api/facilitator'
import { getFacilitatorState } from '../api/progress'
import { getLatestSubmissionsByCharacter } from '../api/submissions'
import { CHECKPOINT_IDS, CHECKPOINT_LABELS, CHECKPOINT_DESCRIPTIONS } from '../api/checkpoints'
import RoundControl from './RoundControl'

export default function Dashboard() {
  const [students, setStudents] = useState([])
  const [phase, setPhase] = useState('pre')
  const [search, setSearch] = useState('')
  const [busyId, setBusyId] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [submissionsLoading, setSubmissionsLoading] = useState(false)
  const [announceText, setAnnounceText] = useState('')
  const [prizes, setPrizes] = useState([])

  const handleAwardXp = async (student, amount) => {
    setBusyId(student.id)
    const { error, xp } = await awardXp(student.id, amount)
    setBusyId(null)
    if (error) { alert('XP award failed: ' + (error.message || JSON.stringify(error))); return }
    setStudents(prev => prev.map(s => s.id === student.id ? { ...s, xp } : s))
  }

  const handleAnnounce = async () => {
    if (!announceText.trim()) return
    const { error } = await setAnnouncement(announceText.trim())
    if (error) { alert('Announcement failed'); return }
    setAnnounceText('')
  }

  const handleClearAnnouncement = async () => {
    await setAnnouncement(null)
  }

  const refreshPrizes = async () => {
    const { data } = await getPrizes()
    setPrizes(data)
  }

  const handlePrizeUpdate = async (position, fields) => {
    const { error } = await updatePrize(position, fields)
    if (error) { alert('Update failed'); return }
    refreshPrizes()
  }

  const handleAwardPrize = async (position, studentId) => {
    await updatePrize(position, {
      awarded_to_student_id: studentId || null,
      awarded_at: studentId ? new Date().toISOString() : null,
    })
    refreshPrizes()
  }

  const refreshSubmissions = async () => {
    setSubmissionsLoading(true)
    const { data } = await getLatestSubmissionsByCharacter()
    setSubmissions(data || [])
    setSubmissionsLoading(false)
  }

  const openFinalBattle = () => {
    window.open('/?page=arena&final=1', '_blank', 'noopener')
  }

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

  // Poll students every 3 seconds + initial fetch of submissions.
  // Also pulls the facilitator_state so the unlock slider and phase
  // pickers reflect what's actually in the spreadsheet (rather than
  // the hardcoded useState defaults), which is what makes a page
  // refresh "feel like it forgot everything".
  useEffect(() => {
    const load = async () => {
      const data = await getAllStudents()
      setStudents(data)
      const fs = await getFacilitatorState()
      if (fs && fs.workshop_phase) setPhase(fs.workshop_phase)
    }
    load()
    refreshSubmissions()
    refreshPrizes()
    const interval = setInterval(load, 3000)
    return () => clearInterval(interval)
  }, [])

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
              {students.length} студентов · self-paced
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

        {/* Quick advance / unlock controls removed — flow is self-paced.
            Participants navigate themselves; no facilitator-side gate. */}

        {/* Round control */}
        <RoundControl />

        {/* Stats summary (studio / role / claude_code_ready) */}
        <div className="mb-6 grid sm:grid-cols-3 gap-3">
          <div className="p-4 border border-border bg-surface/40">
            <div className="font-mono text-[10px] tracking-[2px] uppercase text-text-dim mb-2">By studio</div>
            <div className="text-[12px] text-text-body space-y-1">
              {Object.entries(students.reduce((acc, s) => {
                const k = s.studio || '—'
                acc[k] = (acc[k] || 0) + 1
                return acc
              }, {})).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([k, n]) => (
                <div key={k} className="flex justify-between"><span>{k}</span><span className="text-qa-teal">{n}</span></div>
              ))}
              {students.length === 0 && <div className="text-text-dim italic">none yet</div>}
            </div>
          </div>
          <div className="p-4 border border-border bg-surface/40">
            <div className="font-mono text-[10px] tracking-[2px] uppercase text-text-dim mb-2">By role</div>
            <div className="text-[12px] text-text-body space-y-1">
              {Object.entries(students.reduce((acc, s) => {
                const k = s.role || '—'
                acc[k] = (acc[k] || 0) + 1
                return acc
              }, {})).sort((a, b) => b[1] - a[1]).map(([k, n]) => (
                <div key={k} className="flex justify-between"><span>{k}</span><span className="text-qa-teal">{n}</span></div>
              ))}
              {students.length === 0 && <div className="text-text-dim italic">none yet</div>}
            </div>
          </div>
          <div className="p-4 border border-border bg-surface/40">
            <div className="font-mono text-[10px] tracking-[2px] uppercase text-text-dim mb-2">Claude Code ready</div>
            {(() => {
              const ready = students.filter(s => s.claude_code_ready).length
              const pct = students.length ? Math.round(ready / students.length * 100) : 0
              return (
                <div>
                  <div className="font-display text-3xl text-white">{pct}<span className="text-text-dim text-base">%</span></div>
                  <div className="text-[12px] text-text-dim mt-1">{ready} / {students.length} confirmed</div>
                  <div className="mt-3 h-1.5 bg-border overflow-hidden">
                    <div className="h-full bg-qa-teal" style={{ width: pct + '%' }} />
                  </div>
                </div>
              )
            })()}
          </div>
        </div>

        {/* Workshop progress — checkpoint completion across all students */}
        <div className="mb-6 p-5 border border-border bg-surface/40">
          <div className="font-mono text-[12px] tracking-[2px] uppercase text-text-dim mb-4">
            Workshop progress · checkpoints
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {CHECKPOINT_IDS.map(cid => {
              const completed = students.filter(s => s.checkpoints?.[cid]).length
              const total = students.length
              const pct = total ? Math.round(completed / total * 100) : 0
              return (
                <div key={cid} className="border border-border bg-bg/40 p-3">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="font-display text-base text-white capitalize">{CHECKPOINT_LABELS[cid]}</span>
                    <span className="font-mono text-[12px] text-qa-teal">{completed}/{total}</span>
                  </div>
                  <div className="h-1.5 bg-border overflow-hidden mb-2">
                    <div className="h-full bg-qa-teal transition-all duration-500" style={{ width: pct + '%' }} />
                  </div>
                  <p className="text-[10px] text-text-dim leading-snug">{CHECKPOINT_DESCRIPTIONS[cid]}</p>
                </div>
              )
            })}
          </div>
          {students.length > 0 && (
            <details className="mt-4">
              <summary className="font-mono text-[10px] tracking-[2px] uppercase text-text-dim cursor-pointer hover:text-qa-teal">
                Per-student grid
              </summary>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-[12px] font-mono">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-2 text-text-dim font-normal text-[10px] tracking-[1px] uppercase">Nickname</th>
                      {CHECKPOINT_IDS.map(cid => (
                        <th key={cid} className="text-center p-2 text-text-dim font-normal text-[10px] tracking-[1px] uppercase">
                          {CHECKPOINT_LABELS[cid]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(s => (
                      <tr key={s.id} className="border-b border-border/40 hover:bg-bg/40">
                        <td className="p-2 text-qa-teal">{s.nickname || s.name || '—'}</td>
                        {CHECKPOINT_IDS.map(cid => {
                          const ts = s.checkpoints?.[cid]
                          return (
                            <td key={cid} className="text-center p-2">
                              {ts
                                ? <span className="text-qa-teal">✓</span>
                                : <span className="text-text-dim">—</span>}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          )}
        </div>

        {/* Live announcement (broadcasts to all students via Supabase realtime on facilitator_state) */}
        <div className="mb-6 p-4 border border-border bg-surface/40">
          <div className="font-mono text-[10px] tracking-[2px] uppercase text-text-dim mb-2">Live announcement</div>
          <div className="flex gap-2 flex-wrap">
            <input
              type="text"
              value={announceText}
              onChange={e => setAnnounceText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleAnnounce() }}
              placeholder="Type a message — broadcasts to all students..."
              className="flex-1 min-w-[260px] px-3 py-2 bg-bg border border-border text-white text-sm placeholder:text-text-dim focus:border-qa-teal outline-none"
            />
            <button
              onClick={handleAnnounce}
              className="font-mono text-[11px] tracking-[2px] uppercase font-semibold bg-qa-teal text-black px-4 py-2 cursor-pointer hover:shadow-[0_0_18px_rgba(0,229,204,0.4)]"
            >
              Send
            </button>
            <button
              onClick={handleClearAnnouncement}
              className="font-mono text-[11px] tracking-[1px] uppercase border border-border text-text-dim hover:border-qa-teal/40 hover:text-qa-teal px-3 py-2 cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Prizes config */}
        <div className="mb-8 p-5 border border-border bg-surface/50">
          <div className="font-mono text-[12px] tracking-[2px] uppercase text-text-dim mb-3">Prizes · Configure & Award</div>
          <div className="space-y-3">
            {prizes.map(p => (
              <div key={p.position} className="flex flex-wrap gap-3 items-center p-3 border border-border bg-bg/50">
                <div className="font-display text-lg text-qa-teal w-8">{p.position}</div>
                <input
                  type="text"
                  defaultValue={p.name}
                  onBlur={e => handlePrizeUpdate(p.position, { name: e.target.value })}
                  placeholder="Prize name"
                  className="flex-1 min-w-[140px] px-3 py-2 bg-surface border border-border text-white text-sm focus:border-qa-teal outline-none"
                />
                <input
                  type="text"
                  defaultValue={p.description || ''}
                  onBlur={e => handlePrizeUpdate(p.position, { description: e.target.value })}
                  placeholder="Description"
                  className="flex-1 min-w-[200px] px-3 py-2 bg-surface border border-border text-text-secondary text-sm focus:border-qa-teal outline-none"
                />
                <select
                  value={p.awarded_to_student_id || ''}
                  onChange={e => handleAwardPrize(p.position, e.target.value)}
                  className="px-3 py-2 bg-surface border border-border text-white text-sm focus:border-qa-teal outline-none"
                >
                  <option value="">— not awarded —</option>
                  {[...students].sort((a, b) => (b.xp || 0) - (a.xp || 0)).slice(0, 20).map(s => (
                    <option key={s.id} value={s.id}>
                      {s.nickname || s.name} · {s.xp || 0} XP
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Bot submissions for final battle */}
        <div className="mb-8 p-5 border border-border bg-surface/50">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <div className="font-mono text-[12px] tracking-[2px] uppercase text-text-dim">
                Bot Submissions · Final Battle
              </div>
              <div className="text-[12px] text-text-dim mt-1">
                Latest submission per character. Click "Open Final Battle" to load all into the arena.
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={refreshSubmissions}
                disabled={submissionsLoading}
                className="font-mono text-[11px] tracking-[1px] uppercase border border-border text-text-dim hover:border-qa-teal/40 hover:text-qa-teal px-3 py-2 cursor-pointer disabled:opacity-40"
              >
                {submissionsLoading ? 'Refreshing...' : 'Refresh'}
              </button>
              <button
                onClick={openFinalBattle}
                disabled={submissions.length === 0}
                className="font-mono text-[11px] tracking-[2px] uppercase font-semibold bg-qa-teal text-black px-4 py-2 cursor-pointer hover:shadow-[0_0_18px_rgba(0,229,204,0.4)] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Open Final Battle →
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {CHARACTERS.map(c => {
              const sub = submissions.find(s => s.character_id === c.id)
              return (
                <div key={c.id} className="border border-border p-3 bg-bg/50">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{c.emoji}</span>
                    <span className="text-[13px] text-white truncate">{c.name}</span>
                  </div>
                  <div className="mt-2 font-mono text-[11px]">
                    {sub ? (
                      <>
                        <span className="text-qa-teal">@{sub.nickname}</span>
                        <span className="text-text-dim block mt-1">
                          {new Date(sub.submitted_at).toLocaleString()}
                        </span>
                      </>
                    ) : (
                      <span className="text-text-dim italic">no submission yet</span>
                    )}
                  </div>
                </div>
              )
            })}
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
                  <div key={student.id} className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-3 p-4 hover:bg-surface/30 transition-colors">
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

                    <div className="flex gap-1">
                      {[10, 20, 50].map(amt => (
                        <button
                          key={amt}
                          onClick={() => handleAwardXp(student, amt)}
                          disabled={busyId === student.id}
                          className="font-mono text-[10px] tracking-[1px] border border-qa-teal/30 text-qa-teal hover:bg-qa-teal/10 px-2 py-1 disabled:opacity-30 cursor-pointer transition-all"
                          title={`+${amt} XP`}
                        >
                          +{amt}
                        </button>
                      ))}
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
