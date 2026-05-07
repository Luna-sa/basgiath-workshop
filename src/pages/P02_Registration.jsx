import { useWorkshopStore } from '../store/workshopStore'
import { useT } from '../i18n/useT'
import PageShell from '../core/PageShell'

export default function P02_Registration() {
  const user = useWorkshopStore(s => s.user)
  const setUser = useWorkshopStore(s => s.setUser)
  const t = useT()

  const inputClass = "w-full px-5 py-4 bg-surface border border-border rounded-[2px] text-white text-base placeholder:text-text-dim placeholder:italic focus:border-qa-teal focus:shadow-[0_0_0_3px_rgba(0,229,204,0.08),0_0_20px_rgba(0,229,204,0.08)] outline-none transition-all"
  const labelClass = "font-mono text-[12px] tracking-[2px] uppercase text-text-secondary block mb-2.5"

  return (
    <PageShell pageIndex={2}>
      {/* Workshop tool callout — emphasizes Claude Code */}
      <div className="mb-6 p-4 border border-qa-teal/30 bg-qa-teal/[0.04] rounded-[2px]">
        <div className="font-mono text-[11px] tracking-[3px] uppercase text-qa-teal mb-2">
          {t('Workshop tool', 'Инструмент воркшопа')}
        </div>
        <p className="text-[15px] text-text-body leading-relaxed">
          {t(
            'This workshop is built specifically around Claude Code. Every command, every MCP setup, every persona we configure runs in Claude Code. You\'ll need it installed before we begin.',
            'Этот воркшоп построен специально вокруг Claude Code. Каждая команда, каждая настройка MCP, каждый персонаж который мы соберём - всё это работает в Claude Code. Без него на воркшопе делать нечего.'
          )}
        </p>
      </div>

      <div className="space-y-6">
        {/* Name + Email */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              {t('Name', 'Имя')} <span className="text-qa-teal">*</span>
            </label>
            <input
              type="text"
              value={user.name}
              onChange={e => setUser({ name: e.target.value })}
              placeholder={t('How should I call you', 'Как к тебе обращаться')}
              className={inputClass}
            />
            <p className="text-xs text-text-dim mt-2 italic">
              {t('Goes on your badge', 'Это имя будет на твоём бейдже')}
            </p>
          </div>
          <div>
            <label className={labelClass}>
              {t('Email', 'Email')} <span className="text-qa-teal">*</span>
            </label>
            <input
              type="email"
              value={user.email}
              onChange={e => setUser({ email: e.target.value })}
              placeholder="your@playtika.com"
              className={inputClass}
            />
            <p className="text-xs text-text-dim mt-2 italic">
              {t('Corporate email, so I can send you a reminder', 'Корпоративный, чтобы прислать тебе напоминалку')}
            </p>
          </div>
        </div>

        {/* Studio + Role */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              {t('Studio', 'Студия')} <span className="text-qa-teal">*</span>
            </label>
            <input
              type="text"
              value={user.studio}
              onChange={e => setUser({ studio: e.target.value })}
              placeholder="Bingo Blitz, Slotomania, Solitaire Grand Harvest..."
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>
              {t('Role', 'Роль')} <span className="text-qa-teal">*</span>
            </label>
            <select
              value={user.role}
              onChange={e => setUser({ role: e.target.value })}
              className={inputClass + ' appearance-none'}
            >
              <option value="">{t('Choose your role', 'Выбери роль')}</option>
              <option value="manual">{t('QA Manual', 'QA Manual')}</option>
              <option value="automation">{t('QA Automation', 'QA Automation')}</option>
              <option value="lead">{t('QA Lead / Manager', 'QA Lead / Manager')}</option>
              <option value="dev">{t('Developer', 'Разработчик')}</option>
              <option value="other">{t('Other', 'Другое')}</option>
            </select>
          </div>
        </div>

        {/* Experience */}
        <div>
          <label className={labelClass}>{t('Claude Code experience', 'Опыт с Claude Code')}</label>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { value: 'never', label_en: 'Never used AI', label_ru: 'Не пользовался AI', icon: '🌱' },
              { value: 'tried', label_en: 'Tried ChatGPT', label_ru: 'Пробовал ChatGPT', icon: '💬' },
              { value: 'daily', label_en: 'Use AI daily', label_ru: 'Использую регулярно', icon: '⚡' },
            ].map(o => (
              <button
                key={o.value}
                onClick={() => setUser({ experience: o.value })}
                className={`flex items-center gap-2 p-3 border transition-all cursor-pointer ${
                  user.experience === o.value
                    ? 'border-qa-teal bg-qa-teal/[0.05]'
                    : 'border-border hover:border-qa-teal/25'
                }`}
              >
                <span>{o.icon}</span>
                <span className="text-xs text-text-secondary">{t(o.label_en, o.label_ru)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* OS */}
        <div>
          <label className={labelClass}>{t('Operating system', 'Операционная система')}</label>
          <select
            value={user.os}
            onChange={e => setUser({ os: e.target.value })}
            className={inputClass + ' appearance-none'}
          >
            <option value="mac">macOS</option>
            <option value="win">Windows</option>
            <option value="linux">Linux</option>
          </select>
        </div>

        {/* Pain — optional */}
        <div>
          <label className={labelClass}>
            {t(
              'What annoys you most about AI assistants in QA work',
              'Что бесит в AI-помощниках при тестировании'
            )}{' '}
            <span className="text-text-dim normal-case tracking-normal">
              ({t('optional, one phrase', 'не обязательно, одна фраза')})
            </span>
          </label>
          <input
            type="text"
            value={user.pain}
            onChange={e => setUser({ pain: e.target.value })}
            placeholder={t(
              'Verbosity, false confidence, missing the point...',
              'Многословность, ложные «нашёл», не отвечает на суть...'
            )}
            className={inputClass}
          />
          <p className="text-xs text-text-dim mt-2 italic">
            {t(
              'I\'ll collect these and address them in the workshop',
              'Соберём это и подумаем как обойти на воркшопе'
            )}
          </p>
        </div>

        {/* Claude Code readiness */}
        <div className="border border-qa-teal/30 bg-qa-teal/[0.04] p-5 rounded-[2px]">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={user.claudeCodeReady}
              onChange={e => setUser({ claudeCodeReady: e.target.checked })}
              className="mt-1 w-4 h-4 accent-qa-teal cursor-pointer"
            />
            <div>
              <div className="font-display text-[16px] text-white leading-snug mb-1">
                {t(
                  'I\'ll have Claude Code installed before the workshop',
                  'Я установлю Claude Code до начала воркшопа'
                )}{' '}
                <span className="text-qa-teal">*</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                {t(
                  'After registration you\'ll get an email with step-by-step install instructions. The workshop is built around Claude Code - if it\'s not installed, you can\'t participate.',
                  'После регистрации тебе придёт письмо с пошаговой инструкцией. Воркшоп построен вокруг Claude Code - без установленного инструмента участвовать нельзя.'
                )}
              </p>
            </div>
          </label>
        </div>
      </div>
    </PageShell>
  )
}
