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

const TUTOR_LINKEDIN_URL = 'https://www.linkedin.com/in/ainastasia/'

export default function P_ResourcesIntro() {
  const t = useT()
  const user = useWorkshopStore(s => s.user)
  const sigil = useWorkshopStore(s => s.sigil)
  const certRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState('')

  const riderName = user.name?.trim() || ''
  const dragonName = sigil?.dragonName || 'Unnamed'
  const sealedAt = sigil?.sealedAt || Date.now()

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
        dragonName,
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

        {/* Action row */}
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
          <a
            href="/?page=resources"
            target="_blank"
            rel="noopener"
            className="border border-qa-teal/40 text-qa-teal px-5 py-2.5 font-mono text-[12px] tracking-[2px] uppercase hover:bg-qa-teal/10 transition-all cursor-pointer"
          >
            {t('Open Resource Hub →', 'Открыть Resource Hub →', 'Відкрити Resource Hub →')}
          </a>
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
      </div>
    </PageShell>
  )
}
