import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useWorkshopStore } from '../store/workshopStore'
import { useT } from '../i18n/useT'
import {
  listDragons,
  getMyVotes,
  voteForDragon,
  withdrawVote,
  subscribeToAerie,
  MAX_VOTES_PER_VOTER,
} from '../api/dragons'
import { generateFakeDragons } from '../data/dragons/fixtures'

/**
 * The Aerie - live gallery of all sealed dragons. Each rider may
 * cast up to 3 votes for different dragons (not their own).
 *
 * Standalone route: /?page=aerie
 */
export default function P_Aerie() {
  const t = useT()
  const myNickname = useWorkshopStore(s => s.user.nickname) || ''

  const [dragons, setDragons] = useState([])
  const [myVotes, setMyVotes] = useState([]) // [{ dragon_id, created_at }, ...]
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  // Distinguish "still loading" from "loaded but empty" - the empty
  // state should only show after the network call resolves, not in
  // the first 200-500ms while the first fetch is in flight.
  const [loaded, setLoaded] = useState(false)

  const params = useMemo(() => new URLSearchParams(window.location.search), [])
  const previewN = parseInt(params.get('preview') || '0', 10)

  const votedSet = useMemo(
    () => new Set(myVotes.map(v => v.dragon_id)),
    [myVotes]
  )
  const votesUsed = myVotes.length
  const votesLeft = Math.max(0, MAX_VOTES_PER_VOTER - votesUsed)

  const refresh = async () => {
    if (previewN > 0) {
      setDragons(generateFakeDragons(previewN))
      setMyVotes([])
      setLoaded(true)
      return
    }
    const list = await listDragons()
    setDragons(list)
    if (myNickname) {
      const votes = await getMyVotes(myNickname)
      setMyVotes(votes)
    }
    setLoaded(true)
  }

  useEffect(() => {
    refresh()
    if (previewN > 0) return
    const unsubscribe = subscribeToAerie(refresh)
    return unsubscribe
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myNickname])

  const handleVote = async (dragonId) => {
    if (!myNickname) {
      setError(t(
        'Sign into the workshop first (you need a nickname to vote).',
        'Сначала войди в воркшоп (нужен ник для голосования).',
        'Спочатку увійди у воркшоп (потрібен нік для голосування).'
      ))
      return
    }
    const myDragon = dragons.find(d => d.nickname.toLowerCase() === myNickname.toLowerCase())
    if (myDragon && myDragon.id === dragonId) {
      setError(t(
        'You can\'t vote for your own dragon.',
        'Нельзя голосовать за своего дракона.',
        'Не можна голосувати за свого дракона.'
      ))
      return
    }
    setBusy(true)
    setError(null)
    try {
      if (votedSet.has(dragonId)) {
        // Withdraw this specific vote
        await withdrawVote(myNickname, dragonId)
      } else {
        if (votesUsed >= MAX_VOTES_PER_VOTER) {
          setError(t(
            `All ${MAX_VOTES_PER_VOTER} votes used. Withdraw one to switch.`,
            `Все ${MAX_VOTES_PER_VOTER} голоса отданы. Убери один чтобы поменять.`,
            `Усі ${MAX_VOTES_PER_VOTER} голоси віддано. Прибери один, щоб поміняти.`
          ))
          setBusy(false)
          return
        }
        await voteForDragon(myNickname, dragonId)
      }
      await refresh()
    } catch (e) {
      if (e.code === 'QUOTA_EXCEEDED') {
        setError(t(
          `All ${MAX_VOTES_PER_VOTER} votes used. Withdraw one to switch.`,
          `Все ${MAX_VOTES_PER_VOTER} голоса отданы. Убери один чтобы поменять.`,
          `Усі ${MAX_VOTES_PER_VOTER} голоси віддано. Прибери один, щоб поміняти.`
        ))
      } else {
        setError(e.message || 'vote failed')
      }
    } finally {
      setBusy(false)
    }
  }

  const sortedDragons = [...dragons].sort((a, b) => {
    if (b.vote_count !== a.vote_count) return b.vote_count - a.vote_count
    return new Date(a.sealed_at) - new Date(b.sealed_at)
  })

  const topVote = sortedDragons[0]?.vote_count || 0
  const isLeader = (d) => topVote > 0 && d.vote_count === topVote

  return (
    <div className="min-h-screen bg-bg text-text-body py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="font-mono text-[10px] tracking-[3px] uppercase text-qa-teal mb-2">
            ◆ {t('The Aerie', 'Аэрия', 'Аерія')}
          </p>
          <h1 className="font-display italic text-[clamp(36px,5vw,56px)] text-white leading-tight mb-3">
            {t('Every rider, every dragon.', 'Каждый всадник, каждый дракон.', 'Кожен вершник, кожен дракон.')}
          </h1>
          <p className="text-[15px] text-text-secondary italic leading-relaxed max-w-2xl mx-auto">
            {t(
              `Three votes each. Cast them for the dragons that earn it - not your own.`,
              `Три голоса у каждого. Отдавай их драконам, кто заслужил - не своему.`,
              `Три голоси у кожного. Віддавай їх драконам, що заслужили - не своєму.`
            )}
          </p>
        </div>

        {/* Rules box - explicit before voting starts */}
        <div className="max-w-3xl mx-auto mb-8 border border-qa-teal/30 bg-qa-teal/[0.04] p-5">
          <div className="font-mono text-[10px] tracking-[3px] uppercase text-qa-teal mb-3">
            ◆ {t('Voting rules', 'Правила голосования', 'Правила голосування')}
          </div>
          <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-[13.5px] text-text-body leading-relaxed list-none">
            <li className="flex items-start gap-2">
              <span className="text-qa-teal mt-0.5">①</span>
              <span>{t(
                `You get ${MAX_VOTES_PER_VOTER} votes - use them on ${MAX_VOTES_PER_VOTER} different dragons.`,
                `У тебя ${MAX_VOTES_PER_VOTER} голоса - раздай за ${MAX_VOTES_PER_VOTER} разных драконов.`,
                `У тебе ${MAX_VOTES_PER_VOTER} голоси - віддай за ${MAX_VOTES_PER_VOTER} різних драконів.`
              )}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-qa-teal mt-0.5">②</span>
              <span>{t(
                'You cannot vote for your own dragon.',
                'За своего дракона голосовать нельзя.',
                'За свого дракона голосувати не можна.'
              )}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-qa-teal mt-0.5">③</span>
              <span>{t(
                'Click a voted dragon again to withdraw that vote and pick someone else.',
                'Клик по уже выбранному дракону снимает этот голос - можно перевыбрать.',
                'Клік по вже обраному дракону знімає цей голос - можна перевибрати.'
              )}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-qa-teal mt-0.5">④</span>
              <span>{t(
                'The dragon with the most total votes takes the Signet of the Sky.',
                'Дракон с наибольшим количеством голосов получает Сигнет Неба.',
                'Дракон із найбільшою кількістю голосів отримує Сигнет Неба.'
              )}</span>
            </li>
          </ul>
        </div>

        {/* Vote status - big and central */}
        {myNickname && (
          <div className="flex justify-center mb-6">
            <div className="border border-qa-teal/30 bg-qa-teal/[0.04] px-5 py-3 flex items-center gap-4">
              <div className="font-mono text-[10px] tracking-[2px] uppercase text-text-dim">
                {t('Your votes', 'Твои голоса', 'Твої голоси')}
              </div>
              {/* Three dots - filled if used */}
              <div className="flex gap-1.5">
                {Array.from({ length: MAX_VOTES_PER_VOTER }, (_, i) => (
                  <span
                    key={i}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      i < votesUsed ? 'bg-qa-teal' : 'border border-qa-teal/40 bg-transparent'
                    }`}
                  />
                ))}
              </div>
              <div className="font-mono text-[11px] text-qa-teal">
                {votesUsed} / {MAX_VOTES_PER_VOTER}
              </div>
            </div>
          </div>
        )}

        {/* Status strip */}
        <div className="flex items-center justify-center gap-6 mb-8 font-mono text-[11px] tracking-[2px] uppercase">
          <div className="text-text-dim">
            {sortedDragons.length} <span className="text-text-secondary">{t('dragons sealed', 'драконов запечатано', 'драконів запечатано')}</span>
          </div>
          {!myNickname && (
            <>
              <div className="text-text-dim">·</div>
              <div className="text-text-dim italic">{t('Sign in to vote', 'Войди чтобы голосовать', 'Увійди щоб голосувати')}</div>
            </>
          )}
        </div>

        {error && (
          <div className="border border-corp-red/40 bg-corp-red/[0.06] p-3 mb-6 text-[13px] text-corp-red text-center max-w-xl mx-auto">
            {error}
          </div>
        )}

        {/* Loading state - first fetch in flight */}
        {!loaded && (
          <div className="text-center py-20 border border-border bg-surface/30 rounded-[2px]">
            <div className="flex items-center justify-center gap-2 mb-2">
              {[0, 1, 2].map(i => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full bg-qa-teal animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
            <p className="font-display italic text-[18px] text-text-secondary">
              {t('Listening for dragons in the sky…', 'Слушаю драконов в небе…', 'Слухаю драконів у небі…')}
            </p>
          </div>
        )}

        {/* Empty state - loaded but no dragons yet */}
        {loaded && sortedDragons.length === 0 && (
          <div className="text-center py-20 border border-border bg-surface/30 rounded-[2px]">
            <p className="font-display italic text-[24px] text-text-secondary mb-2">
              {t('No dragons in the Aerie yet.', 'В Аэрии ещё нет драконов.', 'В Аерії ще немає драконів.')}
            </p>
            <p className="text-[13px] text-text-dim italic">
              {t('First sealed dragon takes the empty sky.', 'Первый запечатанный дракон забирает пустое небо.', 'Перший запечатаний дракон забирає порожнє небо.')}
            </p>
          </div>
        )}

        {/* Dragons grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {sortedDragons.map((d, idx) => {
              const mineDragon = d.nickname.toLowerCase() === myNickname.toLowerCase()
              const voted = votedSet.has(d.id)
              const leader = isLeader(d)
              const quotaFull = votesUsed >= MAX_VOTES_PER_VOTER && !voted && !mineDragon
              return (
                <motion.div
                  key={d.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`relative border bg-surface/40 overflow-hidden ${
                    voted ? 'border-qa-teal/60 shadow-[0_0_18px_rgba(0,229,204,0.18)]'
                    : leader ? 'border-qa-teal shadow-[0_0_28px_rgba(0,229,204,0.25)]'
                    : 'border-border'
                  }`}
                >
                  {/* Rank badge */}
                  <div className="absolute top-3 left-3 z-10 font-display italic text-[20px] text-qa-teal/80 bg-bg/70 backdrop-blur w-9 h-9 rounded-full flex items-center justify-center border border-qa-teal/30">
                    {idx + 1}
                  </div>

                  {/* Leader badge */}
                  {leader && (
                    <div className="absolute top-3 right-3 z-10 px-2.5 py-1 bg-qa-teal text-black font-mono text-[9px] tracking-[2px] uppercase font-semibold">
                      ✦ {t('Lead', 'Лидер', 'Лідер')}
                    </div>
                  )}

                  {/* Voted check overlay */}
                  {voted && !leader && (
                    <div className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-qa-teal text-black flex items-center justify-center font-bold">
                      ✓
                    </div>
                  )}

                  {/* Image */}
                  <div className="aspect-square w-full bg-black overflow-hidden">
                    {d.image_url ? (
                      <img
                        src={d.image_url}
                        alt={d.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-dim">{t('no image', 'нет картинки', 'немає зображення')}</div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="font-display italic text-[22px] text-white leading-tight">{d.name}</div>
                      <div className="font-mono text-[10px] tracking-[1.5px] uppercase text-qa-teal">
                        ✦ {d.vote_count}
                      </div>
                    </div>
                    <div className="font-mono text-[10px] tracking-[1.5px] uppercase text-text-dim">
                      {t('rider', 'всадник', 'вершник')}: <span className="text-text-secondary">@{d.nickname}</span>
                      {mineDragon && (
                        <span className="ml-2 text-qa-teal">({t('you', 'ты', 'ти')})</span>
                      )}
                    </div>
                    {d.answers?.motto && (
                      <p className="text-[12.5px] text-text-body italic leading-relaxed">
                        "{d.answers.motto}"
                      </p>
                    )}

                    {/* Vote button */}
                    <button
                      type="button"
                      onClick={() => handleVote(d.id)}
                      disabled={busy || mineDragon || quotaFull}
                      title={quotaFull
                        ? t('Withdraw a vote to switch', 'Убери голос чтобы поменять', 'Прибери голос, щоб поміняти')
                        : ''}
                      className={`w-full mt-2 px-3 py-2 font-mono text-[10.5px] tracking-[2px] uppercase font-semibold transition-all cursor-pointer ${
                        mineDragon
                          ? 'bg-surface text-text-dim cursor-not-allowed'
                          : voted
                            ? 'bg-qa-teal text-black'
                            : quotaFull
                              ? 'border border-border bg-bg/40 text-text-dim cursor-not-allowed'
                              : 'border border-qa-teal/40 text-qa-teal hover:bg-qa-teal/10'
                      } ${busy ? 'opacity-60' : ''}`}
                    >
                      {mineDragon
                        ? t('Your dragon', 'Твой дракон', 'Твій дракон')
                        : voted
                          ? t('✦ Voted (click to withdraw)', '✦ Голос отдан (клик чтобы убрать)', '✦ Голос віддано (клік, щоб прибрати)')
                          : quotaFull
                            ? t('No votes left', 'Голосов не осталось', 'Голосів не лишилося')
                            : t('Cast vote', 'Отдать голос', 'Віддати голос')}
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
