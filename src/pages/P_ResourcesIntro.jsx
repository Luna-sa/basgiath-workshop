/**
 * Final-flow slide 34 — Certificate of Attendance.
 *
 * The participant lands here after the Champions/Graduation slides.
 * Their bonded dragon, name and sealed date are baked into an
 * editorial A4-landscape cert, scaled to fit the slide. Two primary
 * actions: Download PNG + Post to LinkedIn (English caption +
 * pre-opened compose). A tertiary link points at the full Resource
 * Hub for anyone who wants the prompts / handouts / external links.
 */

import { useRef, useState } from 'react'
import * as htmlToImage from 'html-to-image'
import { useT } from '../i18n/useT'
import PageShell from '../core/PageShell'
import { useWorkshopStore } from '../store/workshopStore'
import WorkshopCertificate from '../components/WorkshopCertificate'
import { buildLinkedInCaption, downloadBlob } from '../utils/sigilCard'
import { submitFeedback } from '../api/feedback'

const TUTOR_LINKEDIN_URL = 'https://www.linkedin.com/in/ainastasia/'

export default function P_ResourcesIntro() {
  const t = useT()
  const user = useWorkshopStore(s => s.user)
  const sigil = useWorkshopStore(s => s.sigil)
  const setUser = useWorkshopStore(s => s.setUser)
  const certRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState('')

  // Live-editable name for the certificate. Initialised from
  // user.name (the field they filled at registration) so most
  // participants land here with their name already populated. Each
  // keystroke updates the cert preview immediately AND persists
  // back to the store so the change survives a refresh.
  //
  // Hard cap at 40 chars — calibrated against the cert's name slot:
  // italic Playfair Display auto-scales the font (78px → 36px) to
  // fit any length up to 40, so even "Anastasiia Babanina-Kuznetsova"
  // renders cleanly. Beyond 40, it would start to look squished and
  // the line is realistically longer than any first+last name.
  const NAME_MAX = 40
  const [editedName, setEditedName] = useState(user.name?.trim() || '')
  const handleNameChange = (e) => {
    const v = e.target.value.slice(0, NAME_MAX)
    setEditedName(v)
    setUser({ name: v })
  }

  // Feedback form state
  const [fbRating, setFbRating] = useState(0)
  const [fbHover, setFbHover] = useState(0)
  const [fbComment, setFbComment] = useState('')
  const [fbSent, setFbSent] = useState(false)
  const [fbBusy, setFbBusy] = useState(false)
  const [fbError, setFbError] = useState('')

  const riderName = editedName.trim()
  const dragonName = sigil?.dragonName || 'Unnamed'
  const sealedAt = sigil?.sealedAt || Date.now()

  const handleFeedbackSubmit = async (e) => {
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

  // Live preview scale — cert is rendered at native 1120×792; we
  // shrink for the slide. Keep the source DOM at 1× so the PNG
  // export comes out sharp.
  const PREVIEW_SCALE = 0.62

  const exportPng = async () => {
    if (!certRef.current) return null
    return htmlToImage.toPng(certRef.current, {
      pixelRatio: 2,
      cacheBust: true,
      backgroundColor: '#0A0A0A',
    })
  }

  const handleDownload = async () => {
    if (busy) return
    setBusy(true)
    try {
      const dataUrl = await exportPng()
      if (!dataUrl) throw new Error('export failed')
      const blob = await (await fetch(dataUrl)).blob()
      const safeName = (dragonName || 'cert').replace(/[^a-z0-9]+/gi, '-').toLowerCase()
      downloadBlob(blob, `basgiath-certificate-${safeName}.png`)
      setToast(t('Certificate downloaded', 'Сертификат скачан', 'Сертифікат завантажено'))
    } catch (e) {
      console.error('cert export failed:', e)
      setToast(t('Export failed — try again', 'Не получилось - попробуй ещё', 'Не вдалося - спробуй ще'))
    } finally {
      setBusy(false)
      setTimeout(() => setToast(''), 4000)
    }
  }

  const handleLinkedIn = async () => {
    if (busy) return
    setBusy(true)
    try {
      // 1. Render cert PNG from the live DOM.
      const dataUrl = await exportPng()
      if (!dataUrl) throw new Error('export failed')
      const blob = await (await fetch(dataUrl)).blob()
      const safeName = (dragonName || 'cert').replace(/[^a-z0-9]+/gi, '-').toLowerCase()
      downloadBlob(blob, `basgiath-certificate-${safeName}.png`)

      // 2. Copy the English LinkedIn caption to clipboard.
      const caption = buildLinkedInCaption({
        tutorLinkedinUrl: TUTOR_LINKEDIN_URL,
      })
      try { await navigator.clipboard.writeText(caption) } catch {}

      // 3. Open LinkedIn compose modal in a new tab. We can't
      //    pre-attach files via URL — the participant pastes the
      //    caption and drops the just-downloaded cert.
      window.open('https://www.linkedin.com/feed/?shareActive=true&mini=true', '_blank', 'noopener')

      setToast(t(
        'Cert downloaded · caption copied · LinkedIn opened — paste + drop the image',
        'Серт скачан · текст в буфере · LinkedIn открыт - вставь и перетащи картинку',
        'Серт завантажено · текст у буфері · LinkedIn відкрито - встав і перетягни картинку'
      ))
    } catch (e) {
      console.error('LinkedIn share failed:', e)
      setToast(t('LinkedIn share failed', 'Не получилось', 'Не вдалося'))
    } finally {
      setBusy(false)
      setTimeout(() => setToast(''), 6000)
    }
  }

  return (
    <PageShell pageIndex={34}>
      <div className="space-y-6">
        <div>
          <p className="font-mono text-[11px] tracking-[3px] uppercase text-qa-teal mb-2">
            {t('Bonded', 'Связан', 'Звʼязаний')}
          </p>
          <h2 className="font-display italic text-3xl text-white leading-tight mb-2">
            {t('Your certificate', 'Твой сертификат', 'Твій сертифікат')}
          </h2>
          <p className="text-[14px] text-text-secondary leading-relaxed max-w-2xl">
            {t(
              'Editorial cert with your sealed dragon, your name and the workshop pillars. Post it to LinkedIn in two clicks — the cert image goes to your machine, the English caption goes to your clipboard, LinkedIn opens ready for you to paste.',
              'Editorial-сертификат с твоим запечатанным драконом, именем и пилонами воркшопа. Запостить в LinkedIn - два клика: картинка скачается, английский текст ляжет в буфер, LinkedIn откроется готовым к вставке.',
              'Editorial-сертифікат з твоїм запечатаним драконом, імʼям і пілонами воркшопу. Запостити в LinkedIn - два кліки: картинка завантажиться, англійський текст ляже у буфер, LinkedIn відкриється готовим до вставки.'
            )}
          </p>
        </div>

        {/* Editable full-name field for the certificate. Most
            participants signed up with just a first name or
            nickname; this lets them add a surname (or pull a
            different display name) before exporting the PNG. Live
            updates the preview below on every keystroke. */}
        <div className="max-w-2xl">
          <label
            htmlFor="cert-name"
            className="block font-mono text-[11px] tracking-[2px] uppercase text-text-dim mb-2"
          >
            {t(
              'Full name on the certificate',
              'Полное имя на сертификате',
              'Повне імʼя на сертифікаті'
            )}
          </label>
          <input
            id="cert-name"
            type="text"
            value={editedName}
            onChange={handleNameChange}
            maxLength={NAME_MAX}
            placeholder={t(
              'e.g. Anastasiia Babanina',
              'Напр. Анастасия Бабанина',
              'Напр. Анастасія Бабаніна'
            )}
            className="w-full bg-bg/80 border border-border focus:border-qa-teal/60 rounded-[2px] px-3 py-2.5 text-[14px] text-text-body placeholder-text-dim/60 transition-colors focus:outline-none"
          />
          <div className="flex justify-between items-center mt-1">
            <p className="font-mono text-[10px] tracking-[1px] text-text-dim">
              {t(
                'Updates the certificate live. Type your full name — font auto-shrinks to fit. Leave blank to use @nickname.',
                'Обновит сертификат сразу. Введи полное имя — шрифт сам подстроится. Пусто — будет @ник.',
                'Оновить сертифікат одразу. Введи повне імʼя — шрифт сам підлаштується. Порожньо — буде @нік.'
              )}
            </p>
            <span className={`font-mono text-[10px] tracking-[1px] ml-3 shrink-0 ${
              editedName.length >= NAME_MAX ? 'text-amber-400'
                : editedName.length >= NAME_MAX * 0.85 ? 'text-amber-300/70'
                : 'text-text-dim'
            }`}>
              {editedName.length} / {NAME_MAX}
            </span>
          </div>
        </div>

        {/* Scaled cert preview. Source DOM is 1120×792 so the PNG
            export stays sharp; we shrink the container with CSS
            transform so it fits the slide nicely. */}
        <div
          className="relative mx-auto overflow-hidden"
          style={{
            width: 1120 * PREVIEW_SCALE,
            height: 792 * PREVIEW_SCALE,
            maxWidth: '100%',
          }}
        >
          <div
            style={{
              transform: `scale(${PREVIEW_SCALE})`,
              transformOrigin: 'top left',
              width: 1120,
              height: 792,
            }}
          >
            <WorkshopCertificate
              ref={certRef}
              dragonImageUrl={sigil?.imageDataUri || null}
              dragonName={dragonName}
              riderName={riderName}
              nickname={user.nickname || 'rider'}
              sealedAt={sealedAt}
            />
          </div>
        </div>

        {/* Action row — sharing only (LinkedIn + Download). The
            Resource Hub CTA moved to its own prominent block below
            so it actually gets clicked. */}
        <div className="flex flex-wrap gap-3 items-center justify-center pt-2">
          <button
            type="button"
            onClick={handleLinkedIn}
            disabled={busy || !sigil}
            className="bg-[#0A66C2] text-white px-5 py-2.5 font-mono text-[12px] tracking-[2px] uppercase font-semibold hover:shadow-[0_0_18px_rgba(10,102,194,0.45)] transition-all cursor-pointer disabled:opacity-40 inline-flex items-center gap-1.5"
          >
            <span className="font-display italic normal-case text-[15px] tracking-normal">in</span>
            {busy ? t('working…', 'готовлю…', 'готую…') : t('Post to LinkedIn', 'Запостить в LinkedIn', 'Запостити в LinkedIn')}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={busy || !sigil}
            className="bg-qa-teal text-black px-5 py-2.5 font-mono text-[12px] tracking-[2px] uppercase font-semibold hover:shadow-[0_0_18px_rgba(0,229,204,0.4)] transition-all cursor-pointer disabled:opacity-40"
          >
            ↓ {t('Download PNG', 'Скачать PNG', 'Завантажити PNG')}
          </button>
        </div>

        {toast && (
          <p className="font-mono text-[11px] tracking-[1.5px] uppercase text-qa-teal text-center">
            ✓ {toast}
          </p>
        )}

        {!sigil && (
          <p className="text-[12px] text-text-dim italic text-center max-w-xl mx-auto">
            {t(
              'Complete the Signet ceremony to generate your dragon — the cert will appear here automatically.',
              'Пройди церемонию Signet чтобы сгенерировать дракона - серт появится здесь автоматически.',
              'Пройди церемонію Signet щоб згенерувати дракона - серт зʼявиться тут автоматично.'
            )}
          </p>
        )}

        {/* ─── Resource Hub CTA ───
            Own block, full-width, animated. This is where every
            workshop deliverable lives (master prompt, autopilots,
            handouts, gems, external links) so we don't want anyone
            scrolling past it. Pulsing teal glow + chevron nudge on
            hover. */}
        <section className="mt-12 pt-8 border-t border-border">
          <div className="text-center max-w-2xl mx-auto">
            <p className="font-mono text-[11px] tracking-[3px] uppercase text-qa-teal mb-3">
              ✦ {t('Your take-home arsenal', 'Твой take-home арсенал', 'Твій take-home арсенал')}
            </p>
            <h3 className="font-display italic text-[clamp(24px,3vw,30px)] text-white leading-tight mb-4">
              {t(
                "Everything you built today lives in the Resource Hub",
                'Всё что ты сегодня построил(а) лежит в Resource Hub',
                'Все що ти сьогодні побудував(ла) лежить у Resource Hub'
              )}
            </h3>
            <p className="text-[14px] text-text-secondary leading-relaxed mb-6 max-w-xl mx-auto">
              {t(
                'Master setup prompt, autopilot recoveries, hidden gems, the lecture arsenal installer, every external link. Bookmark it — your AI assistant waits there any day you come back.',
                'Master setup промпт, autopilot-восстановления, hidden gems, установщик арсенала лекции, все внешние ссылки. Закрепи закладкой - твой AI ждёт в любой день когда захочешь вернуться.',
                'Master setup промпт, autopilot-відновлення, hidden gems, встановлювач арсеналу лекції, усі зовнішні посилання. Збережи закладкою - твій AI чекає будь-якого дня коли захочеш повернутися.'
              )}
            </p>
            <a
              href="/?page=resources"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-3 bg-qa-teal text-black px-9 py-4 font-mono text-[13px] tracking-[3px] uppercase font-bold hover:shadow-[0_0_36px_rgba(0,229,204,0.6)] transition-all animate-pulse-teal group"
            >
              <span>{t('Open Resource Hub', 'Открыть Resource Hub', 'Відкрити Resource Hub')}</span>
              <span className="text-xl transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
            <p className="font-mono text-[10px] tracking-[2px] uppercase text-text-dim mt-4">
              {t('Bookmark this · opens in a new tab', 'Сохрани в закладки · откроется в новой вкладке', 'Збережи в закладки · відкриється в новій вкладці')}
            </p>
          </div>
        </section>

        {/* ─── Feedback form ───
            Two-field, takes ~15 seconds. Saves to gsheets if the
            Apps Script knows the action, else Supabase, else a
            local queue so nothing is lost. */}
        <section className="mt-10 pt-8 border-t border-border max-w-2xl mx-auto">
          {fbSent ? (
            <div className="text-center">
              <p className="font-display italic text-2xl text-white">
                {t('Thanks — feedback received.', 'Спасибо - отзыв получен.', 'Дякую - відгук отримано.')}
              </p>
              <p className="text-[13px] text-text-secondary leading-relaxed mt-2">
                {t(
                  'Every rider who tells me what landed and what bounced makes the next cohort sharper. See you in the sky.',
                  'Каждый кто скажет что зашло и что отскочило - делает следующий поток острее. До встречи в небе.',
                  'Кожен хто скаже що зайшло і що відскочило - робить наступний потік гострішим. До зустрічі у небі.'
                )}
              </p>
            </div>
          ) : (
            <form onSubmit={handleFeedbackSubmit}>
              <p className="font-mono text-[11px] tracking-[3px] uppercase text-qa-teal mb-2">
                {t('· Leave feedback ·', '· Оставить отзыв ·', '· Залишити відгук ·')}
              </p>
              <h3 className="font-display italic text-2xl text-white leading-tight mb-3">
                {t(
                  'Two questions, fifteen seconds.',
                  'Два вопроса, пятнадцать секунд.',
                  'Два питання, пʼятнадцять секунд.'
                )}
              </h3>
              <p className="text-[13px] text-text-secondary leading-relaxed mb-5">
                {t(
                  'I read every line. This is how the next workshop gets better.',
                  'Прочитаю каждую строчку. Так следующий воркшоп станет лучше.',
                  'Прочитаю кожен рядок. Так наступний воркшоп стане кращим.'
                )}
              </p>

              {/* Rating row */}
              <div className="mb-5">
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
                        className={`text-3xl leading-none cursor-pointer transition-all ${
                          active ? 'text-qa-teal' : 'text-text-dim hover:text-qa-teal/60'
                        }`}
                        aria-label={`${n} stars`}
                      >
                        {active ? '★' : '☆'}
                      </button>
                    )
                  })}
                  {fbRating > 0 && (
                    <span className="font-mono text-[11px] text-text-dim ml-3">
                      {fbRating} / 5
                    </span>
                  )}
                </div>
              </div>

              {/* Comment */}
              <div className="mb-5">
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
                    'One short paragraph is plenty.',
                    'Одного короткого абзаца достаточно.',
                    'Одного короткого абзацу достатньо.'
                  )}
                  rows={3}
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
                  className="bg-qa-teal text-black px-5 py-2.5 font-mono text-[11px] tracking-[2px] uppercase font-semibold hover:shadow-[0_0_18px_rgba(0,229,204,0.4)] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
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
            </form>
          )}
        </section>
      </div>
    </PageShell>
  )
}
