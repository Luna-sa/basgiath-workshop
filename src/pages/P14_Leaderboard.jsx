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
        {/* Three cloaked figures — riders aligned, signets honoured.
            Banner sets the "those who flew" mood before the count. */}
        <div className="relative -mt-2 h-[140px] overflow-hidden border border-border">
          <img
            src={`${import.meta.env.BASE_URL}hero/leaderboard-figures.jpg`}
            alt=""
            className="w-full h-full object-cover opacity-70"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
        </div>

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

        {/* Closing transition — every signet on the board, next
            slide reveals the champions. Aurora as anticipation
            mood instead of the projector-mode CTA. */}
        <div className="relative overflow-hidden border border-qa-teal/30">
          <img
            src={`${import.meta.env.BASE_URL}hero/leaderboard-aurora.jpg`}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-bg/30" />
          <div className="relative text-center px-6 py-10">
            <p className="font-display italic text-[clamp(22px,2.6vw,30px)] text-white leading-tight mb-3">
              {t(
                'Every signet on the board.',
                'Все сигнеты на доске.',
                'Усі сигнети на дошці.'
              )}
            </p>
            <p className="font-mono text-[11px] tracking-[3px] uppercase text-qa-teal">
              {t('Champions next →', 'Победители - на следующем слайде →', 'Переможці - на наступному слайді →')}
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
