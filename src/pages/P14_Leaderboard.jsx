import { useEffect, useState } from 'react'
import { CHARACTERS } from '../data/characters'
import { getLatestSubmissionsByCharacter } from '../api/submissions'
import { useWorkshopStore } from '../store/workshopStore'
import { useT } from '../i18n/useT'
import PageShell from '../core/PageShell'

/**
 * Signets honoured — final-stage roundup of the Dragon Arena.
 * Shows latest bot submission per character (who submitted, when) +
 * facilitator-only call to action to open the final battle.
 */
export default function P14_Leaderboard() {
  const t = useT()
  const myNickname = useWorkshopStore(s => s.user.nickname)
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      const { data } = await getLatestSubmissionsByCharacter()
      if (!mounted) return
      setSubmissions(data || [])
      setLoading(false)
    }
    load()
    const i = setInterval(load, 5000)
    return () => { mounted = false; clearInterval(i) }
  }, [])

  return (
    <PageShell pageIndex={22}>
      <div className="space-y-6">
        {/* Six-slot grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CHARACTERS.map(c => {
            const sub = submissions.find(s => s.character_id === c.id)
            const isMine = sub && sub.nickname === (myNickname || '').toLowerCase()
            return (
              <div
                key={c.id}
                className={`p-4 border rounded-[2px] ${
                  isMine ? 'border-qa-teal bg-qa-teal/[0.06]' : sub ? 'border-border bg-surface/40' : 'border-border/40 bg-bg/40'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  {c.image
                    ? <img src={c.image} alt={c.name} className="w-10 h-10 rounded-full object-cover" style={{ borderLeft: '2px solid', borderColor: c.hex }} />
                    : <span className="text-2xl">{c.emoji || '🐉'}</span>}
                  <div>
                    <div className="font-display italic text-lg text-white">{c.name}</div>
                    <div className="font-mono text-[10px] tracking-[1.5px] uppercase text-text-dim">{c.title}</div>
                  </div>
                </div>
                {sub ? (
                  <div className="border-t border-border pt-3">
                    <div className="font-mono text-[10px] tracking-[2px] uppercase text-text-dim mb-1">
                      {t('Submitted by', 'От', 'Від')}
                    </div>
                    <div className="font-mono text-[14px] text-qa-teal mb-1">@{sub.nickname}</div>
                    <div className="font-mono text-[10px] text-text-dim">
                      {new Date(sub.submitted_at).toLocaleString()}
                    </div>
                    {isMine && (
                      <div className="mt-2 font-mono text-[10px] tracking-[1px] uppercase text-qa-teal">
                        ✦ {t('Yours', 'Твой', 'Твій')}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="border-t border-border/30 pt-3">
                    <div className="font-mono text-[11px] text-text-dim italic">
                      {t('No submission yet', 'Бота ещё нет', 'Бота ще немає')}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Counter */}
        {!loading && (
          <div className="text-center font-mono text-[12px] tracking-[2px] uppercase text-text-dim">
            {submissions.length} / 6 {t('riders bonded', 'наездников связаны', 'bonded-вершників')}
          </div>
        )}

        {/* Final battle CTA — open in new tab */}
        <div className="border border-qa-teal/30 bg-qa-teal/[0.04] p-5 rounded-[2px] text-center space-y-3">
          <p className="font-display italic text-xl text-white">
            {t('Time for the final flight.', 'Время финального полёта.', 'Час фінального польоту.')}
          </p>
          <a
            href="/?page=arena&final=1"
            target="_blank"
            rel="noopener"
            className="inline-block bg-qa-teal text-black px-7 py-3 font-mono text-[12px] tracking-[3px] uppercase font-semibold hover:shadow-[0_0_24px_rgba(0,229,204,0.4)] transition-all animate-pulse-teal"
          >
            {t('Open Final Battle →', 'Запустить финал →', 'Запустити фінал →')}
          </a>
          <p className="text-[12px] text-text-dim italic">
            {t(
              'Submitted bots load on the projector. The sky judges who took the most stars.',
              'Submitted боты загружаются на проектор. Небо судит кто собрал больше звёзд.',
              'Submitted боти завантажуються на проектор. Небо судить, хто зібрав більше зірок.'
            )}
          </p>
        </div>
      </div>
    </PageShell>
  )
}
