import { useState } from 'react'
import { usePersona } from '../store/usePersona'
import { useWorkshopStore } from '../store/workshopStore'
import PageShell from '../core/PageShell'

const VOTE_CATEGORIES = [
  { id: 'best-bugreport', emoji: '🎯', label: 'Лучший баг-репорт' },
  { id: 'best-ecosystem', emoji: '🐉', label: 'Лучшая экосистема' },
  { id: 'fastest', emoji: '⚡', label: 'Самый быстрый' },
  { id: 'peoples-choice', emoji: '👑', label: 'Народный выбор' },
]

export default function P13_WarGames() {
  const persona = usePersona()
  const name = useWorkshopStore(s => s.user.name)
  const [votes, setVotes] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const handleVote = (categoryId, candidate) => {
    if (submitted) return
    setVotes(prev => ({ ...prev, [categoryId]: candidate }))
  }

  const handleSubmit = () => {
    setSubmitted(true)
    // In production: save votes to Supabase
    useWorkshopStore.getState().addXP(20)
  }

  const allVoted = VOTE_CATEGORIES.every(c => votes[c.id])

  return (
    <PageShell pageIndex={13}>
      <div className="space-y-5">
        <div className="p-5 border border-[#2E2E2E] bg-[#141414] rounded-lg text-center">
          <div className="text-3xl mb-3">🏆</div>
          <h3 className="font-display text-[22px] text-white mb-2">Военные игры</h3>
          <p className="text-[16px] text-text-secondary">{persona.approach.challengeFrame} Голосуй за лучших.</p>
        </div>

        {/* Voting cards */}
        <div className="space-y-3">
          {VOTE_CATEGORIES.map(cat => (
            <div key={cat.id} className="border border-[#2E2E2E] bg-[#141414] rounded-lg overflow-hidden">
              <div className="p-4 flex items-center gap-3">
                <span className="text-2xl">{cat.emoji}</span>
                <div className="flex-1">
                  <div className="font-display text-[16px] text-white">{cat.label}</div>
                  {votes[cat.id] && (
                    <div className="font-mono text-[12px] mt-1" style={{ color: persona.accent }}>
                      Голос: {votes[cat.id]}
                    </div>
                  )}
                </div>
              </div>

              {!submitted && (
                <div className="px-4 pb-4">
                  <input
                    type="text"
                    placeholder="Впиши имя участника..."
                    value={votes[cat.id] || ''}
                    onChange={e => handleVote(cat.id, e.target.value)}
                    className="w-full px-4 py-3 bg-bg border border-border text-white text-[15px] rounded-lg focus:border-qa-teal focus:outline-none transition-colors"
                  />
                </div>
              )}

              {submitted && votes[cat.id] && (
                <div className="px-4 pb-4">
                  <div className="p-3 border rounded-lg" style={{ borderColor: persona.accentBorder, backgroundColor: persona.accentLight }}>
                    <span className="text-[15px] text-white">{votes[cat.id]}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Submit */}
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={!allVoted}
            className="w-full px-6 py-4 text-black font-body text-[16px] font-semibold rounded-lg transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ backgroundColor: allVoted ? persona.accent : '#333' }}
          >
            Отправить голоса (+20 XP)
          </button>
        ) : (
          <div className="text-center p-5 border border-forest/30 bg-forest/[0.05] rounded-lg">
            <p className="text-[16px] text-forest">✓ Голоса отправлены! +20 XP</p>
          </div>
        )}
      </div>
    </PageShell>
  )
}
