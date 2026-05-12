import { useEffect, useState } from 'react'
import { useLocale } from '../i18n/store'
import { getLatestSubmissionsByCharacter } from '../api/submissions'
import { getAllStudents } from '../api/facilitator'
import { CHARACTERS, pickCharacter } from '../data/characters'
import { useWorkshopStore } from '../store/workshopStore'
import { useT } from '../i18n/useT'
import PageShell from '../core/PageShell'

/**
 * Signets honoured — final-stage roundup of the Dragon Arena.
 *
 * Shows ONE card per real Arena submission (no empty character slots),
 * tinted with the rider archetype the participant picked. Header
 * reads "X submitted of N registered" using the full students roster
 * — so the room sees both who actually flew and how big the cohort
 * is overall.
 */
export default function P14_Leaderboard() {
  const t = useT()
  const lang = useLocale(s => s.lang)
  const myNickname = useWorkshopStore(s => s.user.nickname)
  const [submissions, setSubmissions] = useState([])
  const [registeredCount, setRegisteredCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      const [subRes, students] = await Promise.all([
        getLatestSubmissionsByCharacter(),
        getAllStudents(),
      ])
      if (!mounted) return
      setSubmissions(subRes?.data || [])
      setRegisteredCount(Array.isArray(students) ? students.length : 0)
      setLoading(false)
    }
    load()
    const i = setInterval(load, 5000)
    return () => { mounted = false; clearInterval(i) }
  }, [])

  const submittedCount = submissions.length

  return (
    <PageShell pageIndex={31}>
      <div className="space-y-6">
        {/* Counter header */}
        {!loading && (
          <div className="flex items-baseline justify-center gap-2 font-mono text-[13px] tracking-[2px] uppercase">
            <span className="text-qa-teal font-semibold text-[20px]">{submittedCount}</span>
            <span className="text-text-dim">{t('submitted of', 'отправили из', 'надіслали з')}</span>
            <span className="text-white font-semibold text-[20px]">{registeredCount}</span>
            <span className="text-text-dim">{t('registered', 'зарегистрированных', 'зареєстрованих')}</span>
          </div>
        )}

        {/* Real submissions only */}
        {submittedCount > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {submissions.map(sub => {
              const rawC = CHARACTERS.find(c => c.id === sub.character_id)
              const c = rawC ? pickCharacter(rawC, lang) : null
              const isMine = sub.nickname === (myNickname || '').toLowerCase()
              const hex = c?.hex || '#00E5CC'
              return (
                <div
                  key={`${sub.character_id}-${sub.nickname}`}
                  className="p-4 border rounded-[2px]"
                  style={{
                    borderColor: isMine ? hex : hex + '99',
                    backgroundColor: hex + (isMine ? '12' : '08'),
                    boxShadow: isMine ? `0 0 18px ${hex}33` : 'none',
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    {c?.image
                      ? <img src={c.image} alt={c.name} className="w-10 h-10 rounded-full object-cover border-2" style={{ borderColor: hex }} />
                      : <span className="text-2xl">{c?.emoji || '🐉'}</span>}
                    <div>
                      <div className="font-display italic text-lg" style={{ color: hex }}>{c?.name || sub.character_id}</div>
                      <div className="font-mono text-[10px] tracking-[1.5px] uppercase text-text-dim">{c?.title}</div>
                    </div>
                  </div>
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
                </div>
              )
            })}
          </div>
        ) : (
          <div className="border border-border bg-surface/40 p-6 rounded-[2px] text-center">
            <p className="font-mono text-[12px] tracking-[2px] uppercase text-text-dim">
              {t(
                'Waiting for the first signet to land…',
                'Ждём первый сигнет в небе…',
                'Чекаємо перший сигнет у небі…'
              )}
            </p>
          </div>
        )}

        {/* Final battle CTA - open in new tab */}
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
