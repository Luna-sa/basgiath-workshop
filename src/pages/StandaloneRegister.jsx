import { useState } from 'react'
import { useT } from '../i18n/useT'
import { registerStudent } from '../api/registration'

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
        setErrorMsg(err?.message || 'Submission failed')
      }
    }
  }

  const inputClass = "w-full px-5 py-4 bg-surface border border-border rounded-[2px] text-white text-base placeholder:text-text-dim placeholder:italic focus:border-qa-teal focus:shadow-[0_0_0_3px_rgba(0,229,204,0.08),0_0_20px_rgba(0,229,204,0.08)] outline-none transition-all"
  const labelClass = "font-mono text-[12px] tracking-[2px] uppercase text-text-secondary block mb-2.5"

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-16">
        <div className="max-w-[560px] w-full">
          <div className="border border-qa-teal/40 bg-qa-teal/[0.04] p-10 text-center rounded-[2px]">
            <div className="font-mono text-[11px] tracking-[3px] uppercase text-qa-teal mb-6">
              · QA Clan · Workshop
            </div>
            <h1 className="font-display text-3xl sm:text-4xl text-white leading-tight mb-5">
              {t('You are registered.', 'Ты зарегистрирована.', 'Ти зареєстрована.')}
            </h1>
            <div className="border border-qa-teal bg-qa-teal/[0.06] py-4 px-5 mb-6 rounded-[2px]">
              <div className="font-mono text-[10px] tracking-[2px] uppercase text-text-dim mb-1">
                {t('Your workshop nickname', 'Твой ник для воркшопа', 'Твій нік для воркшопу')}
              </div>
              <div className="font-mono text-[18px] text-qa-teal">{form.nickname}</div>
              <p className="text-[12px] text-text-secondary mt-2 italic">
                {t(
                  'Save this. You will need it to enter the workshop on May 13.',
                  'Сохрани. Понадобится чтобы зайти на воркшоп 13 мая.',
                  'Збережи. Знадобиться щоб зайти на воркшоп 13 травня.'
                )}
              </p>
            </div>
            <p className="text-[15px] text-text-body leading-relaxed mb-3">
              {t(
                'I will send a calendar invite for May 13, 14:00 to 15:30. Watch your Outlook.',
                'Calendar invite на 13 мая, 14:00-15:30 придёт в Outlook.',
                'Calendar invite на 13 травня, 14:00-15:30 прийде в Outlook.'
              )}
            </p>
            <p className="text-[14px] text-text-secondary leading-relaxed mb-8">
              {t(
                'Make sure Claude Code is installed before the workshop. The whole thing runs in it.',
                'Убедись что Claude Code установлен до воркшопа. Всё крутится вокруг него.',
                'Переконайся що Claude Code встановлений до воркшопу. Все крутиться навколо нього.'
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
                {t('Name', 'Имя', "Ім'я")} <span className="text-qa-teal">*</span>
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

          {/* Role — radio buttons, custom field if "Other" */}
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
