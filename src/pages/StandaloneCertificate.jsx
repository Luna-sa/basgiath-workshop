/**
 * Standalone certificate page - lives at /cert or /?page=cert.
 *
 * Same cert + Download + LinkedIn share as the slide-34 finale, but
 * stripped of all workshop chrome (no slide framing, no feedback form,
 * no Resource Hub block). Designed for participants who want to come
 * back to the cert after the workshop closes - just give them this
 * URL and their nickname.
 *
 * Data flow:
 *   1. Read local Zustand `sigil` (fresh signers have this).
 *   2. If sigil image is missing, fetch the sealed dragon record
 *      from Sheets, then pull its bytes as a canvas-safe data URI
 *      via the getDragonImageDataUri proxy.
 */

import { useEffect, useRef, useState } from 'react'
import * as htmlToImage from 'html-to-image'
import { useT } from '../i18n/useT'
import { useWorkshopStore } from '../store/workshopStore'
import WorkshopCertificate from '../components/WorkshopCertificate'
import { buildLinkedInCaption, downloadBlob } from '../utils/sigilCard'
import { listDragons, getDragonImageDataUri } from '../api/dragons'

const TUTOR_LINKEDIN_URL = 'https://www.linkedin.com/in/ainastasia/'
const NAME_MAX = 40

export default function StandaloneCertificate() {
  const t = useT()
  const user = useWorkshopStore(s => s.user)
  const sigil = useWorkshopStore(s => s.sigil)
  const setUser = useWorkshopStore(s => s.setUser)
  const certRef = useRef(null)

  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState('')
  const [backendDragon, setBackendDragon] = useState(null)
  const [backendImageDataUri, setBackendImageDataUri] = useState(null)
  const [editedName, setEditedName] = useState(user.name?.trim() || '')

  useEffect(() => {
    const nick = String(user.nickname || '').toLowerCase().trim()
    if (!nick) return
    let cancelled = false
    listDragons()
      .then(rows => {
        if (cancelled) return
        const arr = Array.isArray(rows) ? rows : (rows?.dragons || rows?.data || [])
        const mine = arr.find(d => String(d.nickname || '').toLowerCase() === nick)
        if (mine) {
          setBackendDragon(mine)
          if (!sigil?.imageDataUri) {
            getDragonImageDataUri(nick).then(uri => {
              if (!cancelled && uri) setBackendImageDataUri(uri)
            })
          }
        }
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [user.nickname, sigil?.imageDataUri])

  const handleNameChange = (e) => {
    const v = e.target.value.slice(0, NAME_MAX)
    setEditedName(v)
    setUser({ name: v })
  }

  const riderName = editedName.trim()
  const dragonName = sigil?.dragonName || backendDragon?.name || 'Unnamed'
  const dragonImageUrl =
    sigil?.imageDataUri ||
    backendImageDataUri ||
    backendDragon?.image_url ||
    null
  const sealedAt = sigil?.sealedAt || backendDragon?.sealed_at || Date.now()
  const hasDragon = !!(sigil || backendDragon)

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
      setToast(t('Export failed - try again', 'Не получилось - попробуй ещё', 'Не вдалося - спробуй ще'))
    } finally {
      setBusy(false)
      setTimeout(() => setToast(''), 4000)
    }
  }

  const handleLinkedIn = async () => {
    if (busy) return
    setBusy(true)
    try {
      const dataUrl = await exportPng()
      if (!dataUrl) throw new Error('export failed')
      const blob = await (await fetch(dataUrl)).blob()
      const safeName = (dragonName || 'cert').replace(/[^a-z0-9]+/gi, '-').toLowerCase()
      downloadBlob(blob, `basgiath-certificate-${safeName}.png`)

      const caption = buildLinkedInCaption({ tutorLinkedinUrl: TUTOR_LINKEDIN_URL })
      try { await navigator.clipboard.writeText(caption) } catch {}
      window.open('https://www.linkedin.com/feed/?shareActive=true&mini=true', '_blank', 'noopener')

      setToast(t(
        'Cert downloaded · caption copied · LinkedIn opened - paste + drop the image',
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

  const PREVIEW_SCALE = 0.62

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <header>
          <p className="font-mono text-[11px] tracking-[3px] uppercase text-qa-teal mb-2">
            · QA Clan · Basgiath
          </p>
          <h1 className="font-display italic text-3xl sm:text-4xl text-white leading-tight mb-2">
            {t('Your certificate', 'Твой сертификат', 'Твій сертифікат')}
          </h1>
          <p className="text-[14px] text-text-secondary leading-relaxed max-w-3xl">
            {t(
              'Editorial certificate with your sealed dragon, your name and the workshop pillars. Download the PNG, or post it to LinkedIn in two clicks - the image saves locally, the English caption lands in your clipboard, LinkedIn opens ready for you to paste.',
              'Editorial-сертификат с твоим запечатанным драконом, именем и пилонами воркшопа. Скачай PNG или запости в LinkedIn в два клика - картинка сохраняется, английский текст ложится в буфер, LinkedIn откроется готовым к вставке.',
              'Editorial-сертифікат з твоїм запечатаним драконом, імʼям і пілонами воркшопу. Завантаж PNG або запости у LinkedIn у два кліки - картинка зберігається, англійський текст лягає у буфер, LinkedIn відкриється готовим до вставки.'
            )}
          </p>
        </header>

        {/* Editable full name */}
        <div className="max-w-2xl">
          <label
            htmlFor="cert-name-standalone"
            className="block font-mono text-[11px] tracking-[2px] uppercase text-text-dim mb-2"
          >
            {t('Full name on the certificate', 'Полное имя на сертификате', 'Повне імʼя на сертифікаті')}
          </label>
          <input
            id="cert-name-standalone"
            type="text"
            value={editedName}
            onChange={handleNameChange}
            maxLength={NAME_MAX}
            placeholder={t('e.g. Anastasiia Babanina', 'Напр. Анастасия Бабанина', 'Напр. Анастасія Бабаніна')}
            className="w-full bg-bg/80 border border-border focus:border-qa-teal/60 rounded-[2px] px-3 py-2.5 text-[14px] text-text-body placeholder-text-dim/60 transition-colors focus:outline-none"
          />
          <div className="flex justify-between items-center mt-1">
            <p className="font-mono text-[10px] tracking-[1px] text-text-dim">
              {t(
                'Updates the certificate live. Leave blank to use @nickname.',
                'Обновляет сертификат сразу. Пусто - будет @ник.',
                'Оновлює сертифікат одразу. Порожньо - буде @нік.'
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

        {/* Scaled cert preview */}
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
              dragonImageUrl={dragonImageUrl}
              dragonName={dragonName}
              riderName={riderName}
              nickname={user.nickname || 'rider'}
              sealedAt={sealedAt}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 items-center justify-center pt-2">
          <button
            type="button"
            onClick={handleLinkedIn}
            disabled={busy || !hasDragon}
            className="bg-[#0A66C2] text-white px-5 py-2.5 font-mono text-[12px] tracking-[2px] uppercase font-semibold hover:shadow-[0_0_18px_rgba(10,102,194,0.45)] transition-all cursor-pointer disabled:opacity-40 inline-flex items-center gap-1.5"
          >
            <span className="font-display italic normal-case text-[15px] tracking-normal">in</span>
            {busy ? t('working…', 'готовлю…', 'готую…') : t('Post to LinkedIn', 'Запостить в LinkedIn', 'Запостити в LinkedIn')}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={busy || !hasDragon}
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

        {!hasDragon && (
          <p className="text-[12px] text-text-dim italic text-center max-w-xl mx-auto">
            {t(
              'No sealed dragon found for this nickname. Log in with the nickname you used during the workshop, or complete the Signet ceremony first.',
              'Не нашла запечатанного дракона для этого ника. Залогинься под ником с воркшопа или пройди Signet-церемонию.',
              'Не знайшла запечатаного дракона для цього ніка. Залогінься під ніком із воркшопу або пройди Signet-церемонію.'
            )}
          </p>
        )}
      </div>
    </div>
  )
}
