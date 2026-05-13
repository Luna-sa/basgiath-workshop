/**
 * Standalone feedback page - lives at /feedback or /?page=feedback.
 *
 * Same two-field form as the slide-34 footer (rating + free-form
 * comment) without any other workshop chrome. Reachable any time,
 * after the workshop has closed too. If the user has a known
 * nickname in local store, it's attached to the submission so the
 * facilitator can attribute the feedback; otherwise the rows save
 * anonymously.
 */

import { useState } from 'react'
import { useT } from '../i18n/useT'
import { useWorkshopStore } from '../store/workshopStore'
import { submitFeedback } from '../api/feedback'

export default function StandaloneFeedback() {
  const t = useT()
  const user = useWorkshopStore(s => s.user)

  const [fbRating, setFbRating] = useState(0)
  const [fbHover, setFbHover] = useState(0)
  const [fbComment, setFbComment] = useState('')
  const [fbSent, setFbSent] = useState(false)
  const [fbBusy, setFbBusy] = useState(false)
  const [fbError, setFbError] = useState('')

  const handleSubmit = async (e) => {
    e?.preventDefault?.()
    if (fbBusy || fbSent || !fbRating) return
    setFbBusy(true)
    setFbError('')
    try {
      await submitFeedback({
        studentId: user.id || null,
        nickname: user.nickname || '',
        characterId: user.characterId || null,
        rating: fbRating,
        comment: fbComment,
      })
      setFbSent(true)
    } catch (err) {
      setFbError(err?.message || 'submit failed')
    } finally {
      setFbBusy(false)
    }
  }

  return (
    <div className="min-h-screen px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <p className="font-mono text-[11px] tracking-[3px] uppercase text-qa-teal mb-2">
            · QA Clan · Basgiath
          </p>
          <h1 className="font-display italic text-3xl sm:text-4xl text-white leading-tight">
            {t('Leave feedback', 'Оставить отзыв', 'Залишити відгук')}
          </h1>
        </header>

        {fbSent ? (
          <div className="border border-qa-teal/30 bg-qa-teal/[0.04] rounded-lg p-8 text-center">
            <p className="font-display italic text-2xl text-white mb-2">
              {t('Thanks - feedback received.', 'Спасибо - отзыв получен.', 'Дякую - відгук отримано.')}
            </p>
            <p className="text-[14px] text-text-secondary leading-relaxed">
              {t(
                'Every rider who tells me what landed and what bounced makes the next cohort sharper. See you in the sky.',
                'Каждый кто скажет что зашло и что отскочило - делает следующий поток острее. До встречи в небе.',
                'Кожен хто скаже що зайшло і що відскочило - робить наступний потік гострішим. До зустрічі у небі.'
              )}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p className="font-display italic text-2xl text-white leading-tight mb-3">
              {t(
                'Two questions, fifteen seconds.',
                'Два вопроса, пятнадцать секунд.',
                'Два питання, пʼятнадцять секунд.'
              )}
            </p>
            <p className="text-[14px] text-text-secondary leading-relaxed mb-6">
              {t(
                'I read every line. This is how the next workshop gets better.',
                'Прочитаю каждую строчку. Так следующий воркшоп станет лучше.',
                'Прочитаю кожен рядок. Так наступний воркшоп стане кращим.'
              )}
            </p>

            {/* Rating */}
            <div className="mb-6">
              <label className="font-mono text-[11px] tracking-[2px] uppercase text-text-dim block mb-2">
                {t('How was it?', 'Как тебе воркшоп?', 'Як тобі воркшоп?')}
              </label>
              <div className="flex gap-1.5 items-center">
                {[1, 2, 3, 4, 5].map(n => {
                  const active = (fbHover || fbRating) >= n
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setFbRating(n)}
                      onMouseEnter={() => setFbHover(n)}
                      onMouseLeave={() => setFbHover(0)}
                      className={`text-4xl leading-none cursor-pointer transition-all ${
                        active ? 'text-qa-teal' : 'text-text-dim hover:text-qa-teal/60'
                      }`}
                      aria-label={`${n} stars`}
                    >
                      {active ? '★' : '☆'}
                    </button>
                  )
                })}
                {fbRating > 0 && (
                  <span className="font-mono text-[12px] text-text-dim ml-3">
                    {fbRating} / 5
                  </span>
                )}
              </div>
            </div>

            {/* Comment */}
            <div className="mb-6">
              <label className="font-mono text-[11px] tracking-[2px] uppercase text-text-dim block mb-2">
                {t(
                  'What worked, what to sharpen?',
                  'Что зашло, что доработать?',
                  'Що зайшло, що доопрацювати?'
                )}
              </label>
              <textarea
                value={fbComment}
                onChange={e => setFbComment(e.target.value)}
                placeholder={t(
                  'One short paragraph is plenty. Any language.',
                  'Одного короткого абзаца достаточно. Любой язык.',
                  'Одного короткого абзацу достатньо. Будь-якою мовою.'
                )}
                rows={5}
                maxLength={1500}
                className="w-full bg-bg/80 border border-border focus:border-qa-teal/60 focus:outline-none text-[14px] text-text-body p-3 leading-relaxed resize-none placeholder:text-text-dim"
              />
              <div className="font-mono text-[10px] text-text-dim text-right mt-1">
                {fbComment.length} / 1500
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="submit"
                disabled={!fbRating || fbBusy}
                className="bg-qa-teal text-black px-6 py-3 font-mono text-[12px] tracking-[2px] uppercase font-semibold hover:shadow-[0_0_18px_rgba(0,229,204,0.4)] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {fbBusy
                  ? t('sending…', 'отправляю…', 'надсилаю…')
                  : t('Send feedback', 'Отправить отзыв', 'Надіслати відгук')}
              </button>
              {!fbRating && (
                <span className="font-mono text-[10px] text-text-dim italic">
                  {t('pick a rating first', 'сначала выбери рейтинг', 'спочатку обери рейтинг')}
                </span>
              )}
              {fbError && (
                <span className="font-mono text-[10px] text-corp-red italic">
                  {fbError}
                </span>
              )}
            </div>

            {user.nickname && (
              <p className="font-mono text-[10px] tracking-[1px] uppercase text-text-dim mt-6">
                {t('signed in as', 'отправляешь как', 'надсилаєш як')} <span className="text-qa-teal">@{user.nickname}</span>
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  )
}
