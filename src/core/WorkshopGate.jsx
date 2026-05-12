import { useState } from 'react'
import { useT } from '../i18n/useT'
import { useWorkshopStore } from '../store/workshopStore'
import { findStudentByNickname } from '../api/registration'

/**
 * Nickname gate. Shown before any workshop page if no nickname is loaded
 * into the store. Looks up the nickname in Supabase; if found, hydrates
 * the user state and lets them through. If not found, blocks with a
 * pointer to /register.
 */
export default function WorkshopGate({ onUnlock }) {
  const t = useT()
  const setUser = useWorkshopStore(s => s.setUser)
  const [nickname, setNickname] = useState('')
  const [status, setStatus] = useState('idle') // idle | checking | not-found | error
  const [errorMsg, setErrorMsg] = useState('')

  const handleEnter = async (e) => {
    e?.preventDefault?.()
    const trimmed = nickname.trim().toLowerCase()
    if (!trimmed) return
    setStatus('checking')
    setErrorMsg('')
    try {
      const student = await findStudentByNickname(trimmed)
      if (!student) {
        setStatus('not-found')
        return
      }
      setUser({
        id: student.id,
        name: student.name || '',
        nickname: student.nickname || trimmed,
        email: student.email || '',
        studio: student.studio || '',
        role: student.role || '',
        tool: student.tool || 'claude',
        os: student.os || 'mac',
        pain: student.pain || '',
        claudeCodeReady: !!student.claude_code_ready,
        characterId: student.character_id || null,
      })
      onUnlock?.()
    } catch (err) {
      console.error(err)
      setStatus('error')
      setErrorMsg(err?.message || 'Lookup failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-[480px] w-full">

        <div className="font-mono text-[11px] tracking-[3px] uppercase text-qa-teal mb-4">
          · QA Clan · Workshop
        </div>

        <h1 className="font-display text-3xl sm:text-4xl text-white leading-tight mb-3">
          {t('Sign in', 'Вход', 'Вхід')}
        </h1>

        <p className="text-[14px] text-text-secondary leading-relaxed mb-8">
          {t(
            'Enter the nickname you picked when you registered. Workshop is locked until your nickname is found.',
            'Введи свой ник из регистрации. Воркшоп заблокирован пока ник не найдётся.',
            'Введи свій нік з реєстрації. Воркшоп заблокований доки нік не знайдеться.'
          )}
        </p>

        <form onSubmit={handleEnter} className="space-y-4">

          <div>
            <label className="font-mono text-[11px] tracking-[2px] uppercase text-text-secondary block mb-2">
              {t('Workshop nickname', 'Ник', 'Нік')}
            </label>
            <input
              type="text"
              value={nickname}
              onChange={e => {
                const cleaned = String(e.target.value).toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 20)
                setNickname(cleaned)
                if (status === 'not-found' || status === 'error') setStatus('idle')
              }}
              placeholder="luna_qa"
              autoFocus
              autoComplete="off"
              className="w-full px-5 py-4 bg-surface border border-border rounded-[2px] text-white text-base placeholder:text-text-dim placeholder:italic focus:border-qa-teal focus:shadow-[0_0_0_3px_rgba(0,229,204,0.08),0_0_20px_rgba(0,229,204,0.08)] outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={!nickname.trim() || status === 'checking'}
            className={`w-full px-8 py-4 font-mono text-[12px] tracking-[3px] uppercase font-semibold transition-all ${
              nickname.trim() && status !== 'checking'
                ? 'bg-qa-teal text-black hover:shadow-[0_0_24px_rgba(0,229,204,0.3)] cursor-pointer'
                : 'bg-border text-text-dim cursor-not-allowed'
            }`}
          >
            {status === 'checking'
              ? t('Checking...', 'Проверяю...', 'Перевіряю...')
              : t('Enter →', 'Войти →', 'Увійти →')}
          </button>

          {status === 'not-found' && (
            <div className="border border-corp-red/40 bg-corp-red/[0.05] p-4 rounded-[2px]">
              <p className="text-[13px] text-white leading-relaxed mb-2">
                {t(
                  "Nickname not found. You haven't registered yet, or you typed it differently.",
                  'Ник не найден. Возможно регистрации ещё нет, или ник написан иначе.',
                  'Нік не знайдено. Можливо реєстрації ще немає, або нік написаний інакше.'
                )}
              </p>
              <a
                href="/?page=register"
                className="font-mono text-[11px] tracking-[2px] uppercase text-qa-teal hover:underline"
              >
                {t('Register →', 'Зарегистрироваться →', 'Зареєструватись →')}
              </a>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-3">
              <p className="text-[12px] text-corp-red text-center">
                {t('Could not check nickname: ', 'Не получилось проверить ник: ', 'Не вдалося перевірити нік: ')}{errorMsg}
              </p>
              {/* Emergency bypass — if the lookup backend is down during
                  a live workshop, we still need the participant to be
                  able to enter. Hydrates the store with whatever they
                  typed so the persona / dragon flow can run locally. */}
              <button
                type="button"
                onClick={() => {
                  setUser({
                    id: null,
                    name: '',
                    nickname: nickname.trim().toLowerCase(),
                    email: '',
                    studio: '',
                    role: '',
                    tool: 'claude',
                    os: 'mac',
                    pain: '',
                    claudeCodeReady: true,
                    characterId: null,
                  })
                  onUnlock?.()
                }}
                className="w-full px-6 py-3 font-mono text-[11px] tracking-[2px] uppercase border border-qa-teal/40 text-qa-teal hover:bg-qa-teal/10 transition-colors cursor-pointer"
              >
                {t('Enter offline (backend unreachable)', 'Войти офлайн (бэкенд не отвечает)', 'Увійти офлайн (бекенд не відповідає)')}
              </button>
            </div>
          )}

        </form>

      </div>
    </div>
  )
}
