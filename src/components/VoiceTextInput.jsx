import { useState, useEffect, useRef } from 'react'
import { useVoiceRecorder } from '../hooks/useVoiceRecorder'
import { transcribeAudio } from '../api/workshopBackend'
import { useT } from '../i18n/useT'

/**
 * Textarea with a microphone button. Click mic → record. Click again →
 * stop, transcribe via Whisper, and *append* transcript to existing value
 * (so the user can dictate in chunks or mix typing + speaking).
 *
 * Props:
 *   value, onChange    — controlled input pair
 *   rows               — textarea rows (default 3)
 *   placeholder        — placeholder string
 *   inputType          — 'textarea' (default) | 'text'
 *
 * If the browser doesn't support MediaRecorder, the mic button is
 * hidden and the input becomes a plain textarea.
 */
export default function VoiceTextInput({
  value,
  onChange,
  rows = 3,
  placeholder,
  inputType = 'textarea',
  className = '',
}) {
  const t = useT()
  const recorder = useVoiceRecorder()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const errorTimer = useRef(null)

  useEffect(() => () => { if (errorTimer.current) clearTimeout(errorTimer.current) }, [])

  const showError = (msg) => {
    setError(msg)
    if (errorTimer.current) clearTimeout(errorTimer.current)
    errorTimer.current = setTimeout(() => setError(null), 5000)
  }

  const handleMicClick = async () => {
    if (recorder.state === 'recording') {
      // Stop + transcribe
      try {
        setBusy(true)
        const result = await recorder.stop()
        if (!result || !result.audio) {
          setBusy(false)
          return
        }
        // The hook returns base64 audio; we want a Blob to POST.
        const blob = base64ToBlob(result.audio, result.mimeType)
        const transcript = await transcribeAudio(blob, result.mimeType)
        if (transcript && transcript.trim()) {
          const prev = (value || '').trim()
          const joined = prev ? `${prev} ${transcript.trim()}` : transcript.trim()
          onChange(joined)
        } else {
          showError(t('No words detected — try again.', 'Не услышал слов — попробуй ещё раз.', 'Не почув слів — спробуй ще раз.'))
        }
      } catch (e) {
        showError(e.message || 'transcription failed')
      } finally {
        setBusy(false)
      }
    } else {
      setError(null)
      const ok = await recorder.start()
      if (!ok && recorder.error) {
        const map = {
          unsupported: t('Voice not supported in this browser.', 'Голос не поддерживается в этом браузере.', 'Голос не підтримується в цьому браузері.'),
          NotAllowedError: t('Mic access denied. Allow in browser settings.', 'Доступ к микрофону запрещён. Разреши в настройках.', 'Доступ до мікрофона заборонено. Дозволь у налаштуваннях.'),
          NotFoundError: t('No microphone found.', 'Микрофон не найден.', 'Мікрофон не знайдено.'),
        }
        showError(map[recorder.error] || recorder.error)
      }
    }
  }

  const isRecording = recorder.state === 'recording'
  const baseInputClass = 'w-full bg-bg/80 border border-border focus:border-qa-teal/60 rounded-[2px] px-3 py-2.5 text-[14px] text-text-body placeholder-text-dim/60 font-body transition-colors focus:outline-none'

  return (
    <div className="space-y-1.5">
      <div className="relative">
        {inputType === 'textarea' ? (
          <textarea
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            rows={rows}
            placeholder={placeholder}
            disabled={isRecording || busy}
            className={`${baseInputClass} leading-relaxed resize-y pr-12 ${className}`}
          />
        ) : (
          <input
            type="text"
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={isRecording || busy}
            className={`${baseInputClass} pr-12 ${className}`}
          />
        )}

        {recorder.supported && (
          <button
            type="button"
            onClick={handleMicClick}
            disabled={busy}
            title={
              isRecording
                ? t('Stop recording', 'Остановить запись', 'Зупинити запис')
                : busy
                  ? t('Transcribing...', 'Распознаю...', 'Розпізнаю...')
                  : t('Record voice', 'Записать голосом', 'Записати голосом')
            }
            className={`absolute right-2 top-2 w-8 h-8 flex items-center justify-center rounded-full transition-all cursor-pointer ${
              busy
                ? 'bg-yellow-300/20 text-yellow-300 cursor-wait'
                : isRecording
                  ? 'bg-corp-red text-white animate-pulse'
                  : 'bg-qa-teal/10 text-qa-teal hover:bg-qa-teal/20'
            }`}
          >
            {busy ? (
              <span className="text-[14px]">⋯</span>
            ) : isRecording ? (
              <span className="text-[14px]">◼</span>
            ) : (
              <span className="text-[16px]">🎙</span>
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="text-[12px] text-corp-red italic">⚠ {error}</p>
      )}
      {isRecording && !error && (
        <p className="font-mono text-[10.5px] tracking-[1.5px] uppercase text-corp-red animate-pulse">
          ● {t('recording — click mic again to stop', 'запись — нажми ещё раз чтобы остановить', 'запис — клацни ще раз щоб зупинити')}
        </p>
      )}
      {busy && !error && (
        <p className="font-mono text-[10.5px] tracking-[1.5px] uppercase text-yellow-300">
          ◴ {t('transcribing...', 'распознаю...', 'розпізнаю...')}
        </p>
      )}
    </div>
  )
}

/** base64 → Blob — useVoiceRecorder returns base64 for easy Telegram pass-through */
function base64ToBlob(b64, mimeType) {
  const bin = atob(b64)
  const arr = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i)
  return new Blob([arr], { type: mimeType })
}
