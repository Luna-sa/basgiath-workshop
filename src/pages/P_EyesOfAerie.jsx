import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useWorkshopStore } from '../store/workshopStore'
import { useT } from '../i18n/useT'
import { listDragons } from '../api/dragons'
import {
  submitGuess,
  getMyGuesses,
  getMatchLeaderboard,
  subscribeToMatches,
} from '../api/dragonMatches'

/**
 * Eyes of the Aerie — blind matching round. Voters see the dragon
 * grid with portraits + mottos only (no rider names) plus a list of
 * all rider nicknames in random order. Each dragon gets one guess.
 * Scoring: correct guesses count.
 *
 * Reveal phase: facilitator-triggered or self-toggled in this UI.
 * Once revealed, correct/wrong banners appear on each card.
 *
 * Standalone route: /?page=eyes
 */
export default function P_EyesOfAerie() {
  const t = useT()
  const myNickname = useWorkshopStore(s => s.user.nickname) || ''

  const [dragons, setDragons] = useState([])
  const [myGuesses, setMyGuesses] = useState([]) // [{ dragon_id, guessed_nickname, is_correct }]
  const [leaderboard, setLeaderboard] = useState([])
  const [revealed, setRevealed] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  // Stable shuffled nickname order (memoised per session).
  const shuffledNicknames = useMemo(() => {
    if (!dragons.length) return []
    const all = dragons.map(d => d.nickname)
    // Stable shuffle by hashing
    return [...all].sort((a, b) => {
      return hash(a + myNickname) - hash(b + myNickname)
    })
  }, [dragons, myNickname])

  // Dragons in stable display order — same hash trick on dragon id.
  const shuffledDragons = useMemo(() => {
    return [...dragons].sort((a, b) => hash(a.id + myNickname) - hash(b.id + myNickname))
  }, [dragons, myNickname])

  const guessByDragonId = useMemo(() => {
    const m = {}
    for (const g of myGuesses) m[g.dragon_id] = g
    return m
  }, [myGuesses])

  const refresh = async () => {
    const [d, g, lb] = await Promise.all([
      listDragons(),
      myNickname ? getMyGuesses(myNickname) : Promise.resolve([]),
      getMatchLeaderboard(),
    ])
    setDragons(d)
    setMyGuesses(g)
    setLeaderboard(lb)
  }

  useEffect(() => {
    refresh()
    const unsub = subscribeToMatches(refresh)
    return unsub
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myNickname])

  const handleGuess = async (dragonId, dragonOwnerNickname, guessedNickname) => {
    if (!myNickname) {
      setError(t(
        'Sign into the workshop first — voting requires a nickname.',
        'Сначала войди в воркшоп — для голосования нужен ник.',
        'Спочатку увійди у воркшоп — для голосування потрібен нік.'
      ))
      return
    }
    setBusy(true)
    setError(null)
    try {
      await submitGuess({ voterNickname: myNickname, dragonId, dragonOwnerNickname, guessedNickname })
      await refresh()
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  const guessedSet = useMemo(
    () => new Set(myGuesses.map(g => g.guessed_nickname)),
    [myGuesses]
  )

  const allMineGuesses = myGuesses.length === dragons.length
  const correctCount = myGuesses.filter(g => g.is_correct).length

  return (
    <div className="min-h-screen bg-bg text-text-body py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <p className="font-mono text-[10px] tracking-[3px] uppercase text-qa-teal mb-2">
            ◆ {t('Eyes of the Aerie', 'Глаза Аэрии', 'Очі Аерії')}
          </p>
          <h1 className="font-display italic text-[clamp(36px,5vw,52px)] text-white leading-tight mb-3">
            {t('Which dragon belongs to whom?', 'Кому какой дракон?', 'Кому який дракон?')}
          </h1>
          <p className="text-[15px] text-text-secondary italic leading-relaxed max-w-xl mx-auto">
            {t(
              'For each dragon, guess which rider sealed it. One guess per dragon. The seer who reads the room best takes the Eyes of the Aerie.',
              'Для каждого дракона угадай чей всадник его запечатал. Одна догадка на дракона. Тот кто читает комнату лучше всех — забирает Глаза Аэрии.',
              'Для кожного дракона вгадай чий вершник його запечатав. Одна спроба на дракона. Той хто читає кімнату найкраще — забирає Очі Аерії.'
            )}
          </p>
        </div>

        {/* Status strip */}
        <div className="flex items-center justify-center gap-6 mb-8 font-mono text-[11px] tracking-[2px] uppercase flex-wrap">
          <div className="text-text-dim">
            {myGuesses.length} / {dragons.length} {t('guessed', 'отгадано', 'відгадано')}
          </div>
          <div className="text-text-dim">·</div>
          {revealed ? (
            <div className="text-qa-teal">
              {correctCount} / {dragons.length} {t('correct', 'верно', 'правильно')}
            </div>
          ) : allMineGuesses ? (
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="text-qa-teal hover:text-white cursor-pointer underline"
            >
              ✦ {t('Reveal answers', 'Показать ответы', 'Показати відповіді')}
            </button>
          ) : (
            <div className="text-text-dim italic">
              {t('Guess every dragon to reveal', 'Угадай каждого чтобы открыть', 'Вгадай кожного щоб відкрити')}
            </div>
          )}
        </div>

        {error && (
          <div className="border border-corp-red/40 bg-corp-red/[0.06] p-3 mb-6 text-[13px] text-corp-red text-center max-w-xl mx-auto">
            {error}
          </div>
        )}

        {/* Dragon grid */}
        {dragons.length === 0 && (
          <div className="text-center py-20 border border-border bg-surface/30">
            <p className="font-display italic text-[24px] text-text-secondary mb-2">
              {t('No dragons sealed yet.', 'Драконов ещё не запечатали.', 'Драконів ще не запечатали.')}
            </p>
            <p className="text-[13px] text-text-dim italic">
              {t('Send people to the Bond Ritual first.', 'Сначала отправь людей в Ритуал Связывания.', 'Спочатку відправ людей до Ритуалу Звʼязування.')}
            </p>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {shuffledDragons.map((d, idx) => {
              const myGuess = guessByDragonId[d.id]
              const isCorrect = revealed && myGuess?.is_correct
              const isWrong = revealed && myGuess && !myGuess.is_correct

              return (
                <motion.div
                  key={d.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`relative border bg-surface/40 overflow-hidden ${
                    isCorrect ? 'border-qa-teal shadow-[0_0_22px_rgba(0,229,204,0.25)]'
                    : isWrong ? 'border-corp-red/60'
                    : myGuess ? 'border-qa-teal/40'
                    : 'border-border'
                  }`}
                >
                  {/* Anonymous index */}
                  <div className="absolute top-3 left-3 z-10 font-display italic text-[18px] text-text-dim bg-bg/70 backdrop-blur w-8 h-8 rounded-full flex items-center justify-center border border-border">
                    {idx + 1}
                  </div>

                  {/* Reveal banner */}
                  {revealed && (
                    <div className={`absolute top-3 right-3 z-10 px-2 py-1 font-mono text-[9px] tracking-[2px] uppercase font-semibold ${
                      isCorrect ? 'bg-qa-teal text-black' : 'bg-corp-red text-white'
                    }`}>
                      {isCorrect ? '✓ ' + t('Right', 'Верно', 'Правильно') : '✗ ' + t('Wrong', 'Мимо', 'Мимо')}
                    </div>
                  )}

                  {/* Image */}
                  <div className="aspect-square w-full bg-black overflow-hidden">
                    {d.image_url ? (
                      <img src={d.image_url} alt={`Dragon ${idx + 1}`} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-dim">no image</div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-4 space-y-2">
                    <div className="font-display italic text-[20px] text-white leading-tight">{d.name}</div>
                    {d.answers?.motto && (
                      <p className="text-[12.5px] text-text-body italic leading-relaxed line-clamp-2">
                        "{d.answers.motto}"
                      </p>
                    )}

                    {/* Reveal: who actually owns this */}
                    {revealed && (
                      <div className="pt-2 border-t border-border">
                        <div className="font-mono text-[10px] tracking-[1.5px] uppercase text-text-dim">
                          {t('Actually:', 'На самом деле:', 'Насправді:')}
                          <span className="text-qa-teal ml-2">@{d.nickname}</span>
                        </div>
                        {myGuess && (
                          <div className="font-mono text-[10px] tracking-[1.5px] uppercase text-text-dim mt-1">
                            {t('You guessed:', 'Твоя догадка:', 'Твоя здогадка:')}
                            <span className="ml-2">@{myGuess.guessed_nickname}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Nickname picker — visible until revealed */}
                    {!revealed && (
                      <div>
                        <div className="font-mono text-[9.5px] tracking-[1.5px] uppercase text-text-dim mb-1.5 mt-2">
                          {myGuess
                            ? t('Your guess', 'Твоя догадка', 'Твоя здогадка')
                            : t('Pick a rider', 'Выбери всадника', 'Обери вершника')}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {shuffledNicknames.map(nick => {
                            const isMine = myGuess?.guessed_nickname === nick.toLowerCase()
                            return (
                              <button
                                key={nick}
                                type="button"
                                onClick={() => handleGuess(d.id, d.nickname, nick)}
                                disabled={busy}
                                className={`px-2 py-1 font-mono text-[10px] tracking-[1px] border transition-all cursor-pointer ${
                                  isMine
                                    ? 'bg-qa-teal text-black border-qa-teal'
                                    : 'border-border bg-bg/40 text-text-secondary hover:border-qa-teal/60 hover:text-qa-teal'
                                } ${busy ? 'opacity-60' : ''}`}
                              >
                                @{nick}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Leaderboard */}
        {leaderboard.length > 0 && (
          <div className="mt-10 max-w-md mx-auto">
            <p className="font-mono text-[10px] tracking-[3px] uppercase text-qa-teal mb-3 text-center">
              ◆ {t('Seers of the Aerie', 'Провидцы Аэрии', 'Провидці Аерії')}
            </p>
            <div className="border border-border bg-surface/40">
              {leaderboard.slice(0, 5).map((row, i) => (
                <div
                  key={row.voter_nickname}
                  className={`flex items-center justify-between gap-3 px-4 py-2 ${
                    i === 0 ? 'bg-qa-teal/[0.08]' : i % 2 === 0 ? 'bg-bg/20' : ''
                  } ${i < leaderboard.length - 1 ? 'border-b border-border' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-display italic text-qa-teal text-[18px] w-6 text-center">
                      {i + 1}
                    </span>
                    <span className="font-mono text-[12px] text-text-body">@{row.voter_nickname}</span>
                  </div>
                  <span className="font-mono text-[11px] text-qa-teal">
                    {row.correct} / {row.total}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/** Stable string hash for deterministic shuffle (FNV-1a 32-bit) */
function hash(str) {
  let h = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}
