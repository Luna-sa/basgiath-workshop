import { useState, useEffect } from 'react'
import { useT } from '../i18n/useT'
import { registerStudent } from '../api/registration'
import { getFacilitatorState } from '../api/progress'

const ROLE_OPTIONS = [
  { value: 'manual', label_en: 'QA Manual', label_ru: 'QA Manual', label_uk: 'QA Manual' },
  { value: 'automation', label_en: 'QA Automation', label_ru: 'QA Automation', label_uk: 'QA Automation' },
  { value: 'lead', label_en: 'QA Lead / Manager', label_ru: 'QA Lead / Manager', label_uk: 'QA Lead / Manager' },
  { value: 'dev', label_en: 'Developer', label_ru: 'Разработчик', label_uk: 'Розробник' },
  { value: 'other', label_en: 'Other (write below)', label_ru: 'Другое (укажи ниже)', label_uk: 'Інше (вкажи нижче)' },
]

export default function StandaloneRegister() {
  const t = useT()
  const [form, setForm] = useState({
    name: '',
    nickname: '',
    studio: '',
    role: '',
    customRole: '',
    os: 'mac',
    claudeCodeReady: false,
  })
  const [status, setStatus] = useState('idle') // idle | submitting | success | error | nickname-taken
  const [errorMsg, setErrorMsg] = useState('')
  // Registration kill-switch — read once on mount from facilitator
  // state. If TRUE, swap the form for a "closed" banner.
  const [registrationClosed, setRegistrationClosed] = useState(false)
  const [gateChecked, setGateChecked] = useState(false)

  useEffect(() => {
    let cancelled = false
    getFacilitatorState().then(fs => {
      if (cancelled) return
      const v = fs?.registration_closed
      const closed = v === true || v === 'true' || v === 'TRUE' || v === 1 || v === '1'
      setRegistrationClosed(closed)
      setGateChecked(true)
    }).catch(() => setGateChecked(true))
    return () => { cancelled = true }
  }, [])

  const updateField = (k, v) => {
    if (k === 'nickname') v = String(v).toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 20)
    setForm(s => ({ ...s, [k]: v }))
  }

  const nicknameValid = /^[a-z0-9_-]{3,20}$/.test(form.nickname)

  const isValid = form.name.trim() &&
    nicknameValid &&
    form.studio.trim() &&
    form.role &&
    (form.role !== 'other' || form.customRole.trim()) &&
    form.claudeCodeReady

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isValid || status === 'submitting') return
    setStatus('submitting')
    setErrorMsg('')
    try {
      const finalRole = form.role === 'other' ? form.customRole.trim() : form.role
      await registerStudent({
        name: form.name.trim(),
        nickname: form.nickname.trim().toLowerCase(),
        email: null,
        studio: form.studio.trim(),
        role: finalRole,
        experience: null,
        tool: 'claude',
        os: form.os,
        pain: null,
        claudeCodeReady: form.claudeCodeReady,
        characterId: null,
      })
      setStatus('success')
    } catch (err) {
      console.error(err)
      if (err?.code === 'NICKNAME_TAKEN') {
        setStatus('nickname-taken')
        setErrorMsg('')
      } else {
        setStatus('error')
        // Detect the network-level "failed to fetch" - usually means
        // a corporate DNS/proxy (Cisco Umbrella, Zscaler, etc.) is
        // blocking *.supabase.co. Surface a helpful hint instead of
        // the raw TypeError.
        const raw = err?.message || 'Submission failed'
        const isNetworkBlock = /failed to fetch|networkerror|err_cert|err_connection|err_blocked/i.test(raw)
        setErrorMsg(isNetworkBlock
          ? t(
              'Looks like your network is blocking *.supabase.co (often a corporate DNS like Cisco Umbrella). Try a mobile hotspot, or ask IT to whitelist supabase.co.',
              'Похоже, твоя сеть блокирует *.supabase.co (часто корпоративный DNS, например Cisco Umbrella). Попробуй мобильный hotspot или попроси IT добавить supabase.co в whitelist.',
              'Схоже, твоя мережа блокує *.supabase.co (часто корпоративний DNS, наприклад Cisco Umbrella). Спробуй мобільний hotspot або попроси IT додати supabase.co до whitelist.'
            )
          : raw)
      }
    }
  }

  const inputClass = "w-full px-5 py-4 bg-surface border border-border rounded-[2px] text-white text-base placeholder:text-text-dim placeholder:italic focus:border-qa-teal focus:shadow-[0_0_0_3px_rgba(0,229,204,0.08),0_0_20px_rgba(0,229,204,0.08)] outline-none transition-all"
  const labelClass = "font-mono text-[12px] tracking-[2px] uppercase text-text-secondary block mb-2.5"

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-16">
        <div className="flex items-center justify-center gap-6 w-full max-w-[1200px]">

          {/* Left silhouette - hidden on small screens */}
          <img
            src="/sword-left.jpg"
            alt=""
            aria-hidden="true"
            className="hidden lg:block w-[260px] h-[600px] object-cover opacity-80 rounded-[2px]"
          />

          <div className="max-w-[560px] w-full">
            <div className="border border-qa-teal/40 bg-qa-teal/[0.04] p-10 text-center rounded-[2px]">
            <div className="font-mono text-[11px] tracking-[3px] uppercase text-qa-teal mb-6">
              · QA Clan · Workshop
            </div>
            <h1 className="font-display text-3xl sm:text-4xl text-white leading-tight mb-2">
              {t(
                'Your name is on the rolls.',
                'Имя занесено в свитки.',
                'Імʼя занесено до сувоїв.'
              )}
            </h1>
            <p className="font-display italic text-[15px] text-text-secondary mb-6">
              {t(
                'Basgiath awaits you on May 13.',
                'Басгиат ждёт тебя 13 мая.',
                'Басгіат чекає на тебе 13 травня.'
              )}
            </p>

            {/* Big attention block - remember the nickname */}
            <div className="border-2 border-qa-teal bg-qa-teal/[0.10] py-6 px-5 mb-6 rounded-[2px] shadow-[0_0_32px_rgba(0,229,204,0.18)]">
              <div className="font-mono text-[11px] tracking-[3px] uppercase text-qa-teal mb-3 font-semibold">
                ▲ {t('Your signet', 'Твой сигнет', 'Твій сигнет')}
              </div>
              <div className="font-mono text-[28px] sm:text-[32px] text-white font-semibold tracking-wide mb-4 break-all">
                {form.nickname}
              </div>
              <p className="text-[13px] text-white leading-relaxed font-medium">
                {t(
                  'Without your signet the Watch will not let you through the gates. Save it now - screenshot, note, anything.',
                  'Без сигнета стража не пустит за ворота. Сохрани прямо сейчас - скриншот, заметка, что угодно.',
                  'Без сигнета варта не пустить за ворота. Збережи прямо зараз - скріншот, нотатка, що завгодно.'
                )}
              </p>
            </div>
            <p className="text-[15px] text-text-body leading-relaxed mb-3">
              {t(
                'A calendar invite for May 13, 14:00-15:30 will arrive in your Outlook.',
                'Calendar invite на 13 мая, 14:00-15:30 придёт в Outlook.',
                'Calendar invite на 13 травня, 14:00-15:30 прийде в Outlook.'
              )}
            </p>
            <p className="text-[14px] text-text-secondary leading-relaxed mb-8 italic">
              {t(
                'On the day of the trial, your dragon must already be bonded. Install Claude Code now.',
                'К дню испытания дракон должен быть уже привязан. Установи Claude Code сейчас.',
                'До дня випробування дракон має бути вже привʼязаний. Встанови Claude Code зараз.'
              )}
            </p>
            <div className="border border-border bg-bg p-5 rounded-[2px] text-left">
              <div className="font-mono text-[10px] tracking-[2px] uppercase text-text-dim mb-2">
                {t('Install Claude Code', 'Установить Claude Code', 'Встановити Claude Code')}
              </div>
              <div className="font-mono text-[12px] text-qa-teal mb-3 break-all">
                curl -fsSL https://claude.ai/install.sh | bash
              </div>
              <div className="font-mono text-[10px] tracking-[2px] uppercase text-text-dim mb-2">
                {t('Verify', 'Проверка', 'Перевірка')}
              </div>
              <div className="font-mono text-[12px] text-qa-teal">
                claude --version
              </div>
            </div>
            </div>
          </div>

          {/* Right silhouette - hidden on small screens */}
          <img
            src="/sword-right.jpg"
            alt=""
            aria-hidden="true"
            className="hidden lg:block w-[260px] h-[600px] object-cover opacity-80 rounded-[2px]"
          />

        </div>
      </div>
    )
  }

  // Registration closed gate — once facilitator state confirms the
  // flag is on, swap the entire form for a closed banner so no new
  // sign-ups land in the students sheet from a stale link.
  if (gateChecked && registrationClosed) {
    return (
      <div className="min-h-screen px-6 py-12 sm:py-20 flex items-center justify-center">
        <div className="max-w-[560px] mx-auto text-center">
          <div className="font-mono text-[11px] tracking-[3px] uppercase text-amber-300 mb-4">
            · {t('Registration · closed', 'Регистрация · закрыта', 'Реєстрація · закрита')} ·
          </div>
          <h1 className="font-display italic text-3xl sm:text-5xl text-white leading-[1.1] mb-5">
            {t(
              'Cohort is full. The gates are sealed for this workshop.',
              'Поток закрыт. Ворота этого воркшопа запечатаны.',
              'Потік закрито. Ворота цього воркшопу запечатано.'
            )}
          </h1>
          <p className="text-[15px] text-text-secondary leading-relaxed mb-8">
            {t(
              "Registration for this Claude Code workshop has closed. If you already signed up earlier, your nickname still works — open the workshop and use it on the entry screen.",
              'Регистрация на этот воркшоп Claude Code закрыта. Если ты уже регистрировал(а)ся раньше, твой ник работает - открой воркшоп и используй его на экране входа.',
              'Реєстрація на цей воркшоп Claude Code закрита. Якщо ти вже реєструвався(лась) раніше, твій нік працює - відкрий воркшоп і використай його на екрані входу.'
            )}
          </p>
          <a
            href="/"
            className="inline-block bg-qa-teal text-black px-6 py-3 font-mono text-[12px] tracking-[2px] uppercase font-semibold hover:shadow-[0_0_18px_rgba(0,229,204,0.4)] transition-all"
          >
            {t('I already have a nickname →', 'У меня уже есть ник →', 'У мене вже є нік →')}
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-6 py-12 sm:py-20">
      <div className="max-w-[640px] mx-auto">

        {/* Eyebrow */}
        <div className="font-mono text-[11px] tracking-[3px] uppercase text-qa-teal mb-4">
          · QA Clan · Workshop registration
        </div>

        {/* Title */}
        <h1 className="font-display text-3xl sm:text-5xl text-white leading-[1.1] mb-3">
          Claude Code <em className="text-qa-teal not-italic font-normal" style={{ fontStyle: 'italic' }}>for QA</em>
        </h1>
        <p className="text-[15px] text-text-secondary mb-8">
          {t(
            'May 13, 2026 · 14:00 - 15:30 · Watermelon room or online · 1 to 1.5 hours',
            '13 мая 2026 · 14:00 - 15:30 · Watermelon room или онлайн · 1-1.5 часа',
            '13 травня 2026 · 14:00 - 15:30 · Watermelon room або онлайн · 1-1.5 години'
          )}
        </p>

        {/* Workshop is Claude Code callout */}
        <div className="mb-6 p-4 border border-qa-teal/30 bg-qa-teal/[0.04] rounded-[2px]">
          <div className="font-mono text-[11px] tracking-[3px] uppercase text-qa-teal mb-2">
            {t('This workshop is for Claude Code', 'Воркшоп под Claude Code', 'Воркшоп під Claude Code')}
          </div>
          <p className="text-[14px] text-text-body leading-relaxed">
            {t(
              'Every command, every MCP setup, every persona we configure runs in Claude Code. Cursor users are welcome but be aware some setups will not work the same way - if you want the full experience, switch to Claude Code for the workshop.',
              'Все команды, MCP-настройки и персонажи которые мы соберём - работают в Claude Code. Cursor-юзерам можно прийти, но имей в виду что часть настроек не сработает так же. Если хочешь полный опыт - поставь Claude Code на воркшоп.',
              'Всі команди, MCP-налаштування та персонажі що ми зберемо - працюють у Claude Code. Cursor-юзерам можна прийти, але майте на увазі що частина налаштувань не спрацює так само. Якщо хочеш повний досвід - постав Claude Code на воркшоп.'
            )}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Name + Nickname */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                {t('Name', 'Имя', "Імʼя")} <span className="text-qa-teal">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => updateField('name', e.target.value)}
                placeholder={t('How should I call you', 'Как к тебе обращаться', 'Як до тебе звертатись')}
                className={inputClass}
              />
              <p className="text-xs text-text-dim mt-2 italic">
                {t('Goes on your badge', 'Это имя будет на твоём бейдже', 'Це імʼя буде на твоєму бейджі')}
              </p>
            </div>
            <div>
              <label className={labelClass}>
                {t('Workshop nickname', 'Ник для воркшопа', 'Нік для воркшопу')} <span className="text-qa-teal">*</span>
              </label>
              <input
                type="text"
                value={form.nickname}
                onChange={e => updateField('nickname', e.target.value)}
                placeholder="luna_qa, dragonbreath, x42..."
                className={inputClass}
                autoComplete="off"
                maxLength={20}
              />
              <p className="text-xs text-text-dim mt-2 italic">
                {form.nickname && !nicknameValid
                  ? t('3-20 chars: letters, numbers, _ and - only', '3-20 символов: латиница, цифры, _ и -', '3-20 символів: латиниця, цифри, _ та -')
                  : t("You'll use this to log into the workshop", 'С этим ником будешь заходить на воркшоп', 'З цим ніком будеш заходити на воркшоп')}
              </p>
            </div>
          </div>

          {/* Studio */}
          <div>
            <label className={labelClass}>
              {t('Studio', 'Студия', 'Студія')} <span className="text-qa-teal">*</span>
            </label>
            <input
              type="text"
              value={form.studio}
              onChange={e => updateField('studio', e.target.value)}
              placeholder="Bingo Blitz, Slotomania, Solitaire Grand Harvest..."
              className={inputClass}
            />
          </div>

          {/* Role - radio buttons, custom field if "Other" */}
          <div>
            <label className={labelClass}>
              {t('Your role', 'Твоя роль', 'Твоя роль')} <span className="text-qa-teal">*</span>
            </label>
            <div className="grid sm:grid-cols-2 gap-2">
              {ROLE_OPTIONS.map(o => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => updateField('role', o.value)}
                  className={`text-left px-4 py-3 border transition-all cursor-pointer ${
                    form.role === o.value
                      ? 'border-qa-teal bg-qa-teal/[0.06] text-white'
                      : 'border-border text-text-secondary hover:border-qa-teal/30'
                  }`}
                >
                  <span className="text-[14px]">{t(o.label_en, o.label_ru, o.label_uk)}</span>
                </button>
              ))}
            </div>
            {form.role === 'other' && (
              <input
                type="text"
                value={form.customRole}
                onChange={e => updateField('customRole', e.target.value)}
                placeholder={t('Write your role', 'Напиши свою должность', 'Напиши свою посаду')}
                className={inputClass + ' mt-3'}
                autoFocus
              />
            )}
          </div>

          {/* Claude Code readiness */}
          <div className="border border-qa-teal/30 bg-qa-teal/[0.04] p-5 rounded-[2px]">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.claudeCodeReady}
                onChange={e => updateField('claudeCodeReady', e.target.checked)}
                className="mt-1 w-4 h-4 accent-qa-teal cursor-pointer"
              />
              <div>
                <div className="font-display text-[16px] text-white leading-snug mb-1">
                  {t(
                    'I will have Claude Code installed before the workshop',
                    'Я установлю Claude Code до начала воркшопа',
                    'Я встановлю Claude Code до початку воркшопу'
                  )}{' '}
                  <span className="text-qa-teal">*</span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {t(
                    'Even if you usually work in Cursor, install Claude Code for the workshop. Most setups we configure will only work properly there.',
                    'Даже если обычно работаешь в Cursor - поставь Claude Code на воркшоп. Большинство настроек которые соберём работают полноценно только в нём.',
                    'Навіть якщо зазвичай працюєш у Cursor - постав Claude Code на воркшоп. Більшість налаштувань що зберемо працюють повноцінно лише в ньому.'
                  )}
                </p>
              </div>
            </label>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={!isValid || status === 'submitting'}
              className={`w-full px-8 py-4 font-mono text-[12px] tracking-[3px] uppercase font-semibold transition-all ${
                isValid && status !== 'submitting'
                  ? 'bg-qa-teal text-black hover:shadow-[0_0_24px_rgba(0,229,204,0.3)] cursor-pointer'
                  : 'bg-border text-text-dim cursor-not-allowed'
              }`}
            >
              {status === 'submitting'
                ? t('Sending...', 'Отправляю...', 'Відправляю...')
                : t('Register →', 'Зарегистрироваться →', 'Зареєструватись →')}
            </button>
            {status === 'error' && (
              <p className="text-[12px] text-corp-red mt-3 text-center">
                {t('Something went wrong: ', 'Что-то не так: ', 'Щось не так: ')}{errorMsg}
              </p>
            )}
            {status === 'nickname-taken' && (
              <p className="text-[12px] text-corp-red mt-3 text-center">
                {t(
                  'This nickname is already taken. Pick another one.',
                  'Этот ник уже занят. Выбери другой.',
                  'Цей нік вже зайнятий. Обери інший.'
                )}
              </p>
            )}
            <p className="text-[11px] text-text-dim italic text-center mt-3">
              {t(
                'Closes May 12, 17:00. No registration, no entry.',
                'Закрывается 12 мая, 17:00. Без регистрации - не пускаем.',
                'Закривається 12 травня, 17:00. Без реєстрації - не пускаємо.'
              )}
            </p>
          </div>

        </form>
      </div>
    </div>
  )
}
