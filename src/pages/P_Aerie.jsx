import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useWorkshopStore } from '../store/workshopStore'
import { useT } from '../i18n/useT'
import {
  listDragons,
  getMyVote,
  voteForDragon,
  withdrawVote,
  subscribeToAerie,
} from '../api/dragons'

/**
 * The Aerie — live gallery of all sealed dragons. Each rider may
 * cast one vote (for someone else, not themselves). Realtime via
 * Supabase channel.
 *
 * Standalone route: /?page=aerie
 */
export default function P_Aerie() {
  const t = useT()
  const myNickname = useWorkshopStore(s => s.user.nickname) || ''

  const [dragons, setDragons] = useState([])
  const [myVote, setMyVote] = useState(null) // { dragon_id } | null
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const refresh = async () => {
    const list = await listDragons()
    setDragons(list)
    if (myNickname) {
      const vote = await getMyVote(myNickname)
      setMyVote(vote)
    }
  }

  useEffect(() => {
    refresh()
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
      if (myVote && myVote.dragon_id === dragonId) {
        await withdrawVote(myNickname)
        setMyVote(null)
      } else {
        await voteForDragon(myNickname, dragonId)
        setMyVote({ dragon_id: dragonId })
      }
      await refresh()
    } catch (e) {
      setError(e.message || 'vote failed')
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
          <p className="text-[15px] text-text-secondary italic leading-relaxed max-w-xl mx-auto">
            {t(
              'One vote each. Cast it for the dragon that earns it — not your own. The vote that seals the Threshing wins the Signet of the Sky.',
              'Один голос у каждого. Отдай его дракону кто заслужил — не своему. Голос запечатывающий Threshing получает Сигнет Неба.',
              'Один голос у кожного. Віддай його дракону що заслужив — не своєму. Голос що запечатує Threshing отримує Сигіл Неба.'
            )}
          </p>
        </div>

        {/* Status strip */}
        <div className="flex items-center justify-center gap-6 mb-8 font-mono text-[11px] tracking-[2px] uppercase">
          <div className="text-text-dim">
            {sortedDragons.length} <span className="text-text-secondary">{t('dragons sealed', 'драконов запечатано', 'драконів запечатано')}</span>
          </div>
          <div className="text-text-dim">·</div>
          {myNickname ? (
            <div className="text-qa-teal">
              {myVote ? t('Your vote cast', 'Твой голос отдан', 'Твій голос подано') : t('No vote yet', 'Голоса ещё нет', 'Голосу ще немає')}
            </div>
          ) : (
            <div className="text-text-dim italic">{t('Sign in to vote', 'Войди чтобы голосовать', 'Увійди щоб голосувати')}</div>
          )}
        </div>

        {error && (
          <div className="border border-corp-red/40 bg-corp-red/[0.06] p-3 mb-6 text-[13px] text-corp-red text-center max-w-xl mx-auto">
            {error}
          </div>
        )}

        {/* Empty state */}
        {sortedDragons.length === 0 && (
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
              const voted = myVote?.dragon_id === d.id
              const leader = isLeader(d)
              return (
                <motion.div
                  key={d.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`relative border bg-surface/40 overflow-hidden ${
                    leader ? 'border-qa-teal shadow-[0_0_28px_rgba(0,229,204,0.25)]' : 'border-border'
                  }`}
                >
                  {/* Rank badge */}
                  <div className="absolute top-3 left-3 z-10 font-display italic text-[20px] text-qa-teal/80 bg-bg/70 backdrop-blur w-9 h-9 rounded-full flex items-center justify-center border border-qa-teal/30">
                    {idx + 1}
                  </div>

                  {/* Leader badge */}
                  {leader && (
                    <div className="absolute top-3 right-3 z-10 px-2.5 py-1 bg-qa-teal text-black font-mono text-[9px] tracking-[2px] uppercase font-semibold">
                      ✦ Lead
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
                      <div className="w-full h-full flex items-center justify-center text-text-dim">no image</div>
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
                      rider: <span className="text-text-secondary">@{d.nickname}</span>
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
                      disabled={busy || mineDragon}
                      className={`w-full mt-2 px-3 py-2 font-mono text-[10.5px] tracking-[2px] uppercase font-semibold transition-all cursor-pointer ${
                        mineDragon
                          ? 'bg-surface text-text-dim cursor-not-allowed'
                          : voted
                            ? 'bg-qa-teal text-black'
                            : 'border border-qa-teal/40 text-qa-teal hover:bg-qa-teal/10'
                      } ${busy ? 'opacity-60' : ''}`}
                    >
                      {mineDragon
                        ? t('Your dragon', 'Твой дракон', 'Твій дракон')
                        : voted
                          ? t('✦ Voted (click to withdraw)', '✦ Голос отдан (клик чтобы убрать)', '✦ Голос віддано (клік щоб прибрати)')
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
