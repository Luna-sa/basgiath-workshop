import { useEffect, useState } from 'react'
import { useWorkshopStore } from '../store/workshopStore'
import { useT } from '../i18n/useT'
import { markCheckpoint, getCheckpoints } from '../api/checkpoints'

/**
 * Self-report checkpoint button.
 *
 * Props:
 *   id          — 'parapet' | 'forge' | 'signet' | 'arena'
 *   label       — text shown when not done
 *   doneLabel   — text shown when done (defaults to "Marked done")
 *   helpText    — small italic hint below the button
 *
 * Persists to Supabase. Once marked, button locks into "done" state
 * with timestamp. The facilitator dashboard shows live aggregates.
 */
export default function CheckpointButton({
  id,
  label,
  doneLabel,
  helpText,
}) {
  const t = useT()
  const studentId = useWorkshopStore(s => s.user.id)
  const [done, setDone] = useState(null) // ISO timestamp or null
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  // Hydrate state on mount
  useEffect(() => {
    let cancelled = false
    if (!studentId) return
    getCheckpoints(studentId).then(({ data }) => {
      if (cancelled) return
      if (data?.[id]) setDone(data[id])
    })
    return () => { cancelled = true }
  }, [studentId, id])

  const handleMark = async () => {
    if (!studentId) {
      setError(t('Register first to track progress', 'Сначала зарегистрируйся'))
      return
    }
    setBusy(true)
    setError(null)
    const { error, checkpoints } = await markCheckpoint(studentId, id)
    setBusy(false)
    if (error) {
      setError(error.message || 'Could not mark')
      return
    }
    if (checkpoints?.[id]) setDone(checkpoints[id])
  }

  const formatTime = (iso) => {
    try {
      const d = new Date(iso)
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } catch { return '' }
  }

  return (
    <div className="border border-qa-teal/30 bg-qa-teal/[0.04] p-4 rounded-[2px]">
      <div className="flex items-center gap-3 flex-wrap">
        {done ? (
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] tracking-[2px] uppercase text-qa-teal">
              ✓ {t('Done', 'Готово')}
            </span>
            <span className="font-mono text-[11px] text-text-dim">
              {t('Marked at', 'отмечено в')} {formatTime(done)}
            </span>
            {doneLabel && <span className="text-[13px] text-text-secondary italic">{doneLabel}</span>}
          </div>
        ) : (
          <>
            <button
              onClick={handleMark}
              disabled={busy}
              className="bg-qa-teal text-black px-5 py-2.5 font-mono text-[11px] tracking-[2px] uppercase font-semibold cursor-pointer hover:shadow-[0_0_18px_rgba(0,229,204,0.4)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {busy ? t('Saving...', 'Сохраняю...') : (label || t('Mark done', 'Отметить готово'))}
            </button>
            {helpText && (
              <span className="text-[12px] text-text-dim italic">{helpText}</span>
            )}
          </>
        )}
      </div>
      {error && (
        <p className="text-[12px] text-corp-red mt-2">{error}</p>
      )}
    </div>
  )
}
