import { useState, useEffect } from 'react'
import { useWorkshopStore } from '../store/workshopStore'
import { supabase } from '../api/supabase'
import PageShell from '../core/PageShell'
import CheckpointButton from '../components/CheckpointButton'
import { useT } from '../i18n/useT'

const STEPS = [
  {
    text_en: 'Install Claude Code',
    text_ru: 'Установить Claude Code',
    text_uk: 'Встановити Claude Code',
    note_en: 'curl -fsSL https://claude.ai/install.sh | bash',
    note_ru: 'curl -fsSL https://claude.ai/install.sh | bash',
    note_uk: 'curl -fsSL https://claude.ai/install.sh | bash',
  },
  {
    text_en: 'Claude Pro subscription ($20/mo)',
    text_ru: 'Подписка Claude Pro ($20/мес)',
    text_uk: 'Підписка Claude Pro ($20/міс)',
    note_en: 'claude.ai/pricing',
    note_ru: 'claude.ai/pricing',
    note_uk: 'claude.ai/pricing',
  },
  {
    text_en: 'Install Git',
    text_ru: 'Установить Git',
    text_uk: 'Встановити Git',
    note_en: 'git-scm.com',
    note_ru: 'git-scm.com',
    note_uk: 'git-scm.com',
  },
  {
    text_en: 'Create a working folder',
    text_ru: 'Создать рабочую папку',
    text_uk: 'Створити робочу теку',
    note_en: 'mkdir ~/qa-workspace && cd ~/qa-workspace && git init',
    note_ru: 'mkdir ~/qa-workspace && cd ~/qa-workspace && git init',
    note_uk: 'mkdir ~/qa-workspace && cd ~/qa-workspace && git init',
  },
  {
    text_en: 'Clone the sample project',
    text_ru: 'Склонировать тестовый проект',
    text_uk: 'Клонувати тестовий проєкт',
    note_en: 'Download: /sample-project.zip',
    note_ru: 'Скачай: /sample-project.zip',
    note_uk: 'Завантаж: /sample-project.zip',
  },
  {
    text_en: 'Verify: claude --version',
    text_ru: 'Проверить: claude --version',
    text_uk: 'Перевірити: claude --version',
    note_en: 'Should print a version. Minimum: 2.0 (Jan 2026+)',
    note_ru: 'Должен показать версию. Минимум: 2.0 (с янв 2026)',
    note_uk: 'Має показати версію. Мінімум: 2.0 (з січ 2026)',
  },
]

export default function P03_PreWork() {
  const t = useT()
  const preworkChecklist = useWorkshopStore(s => s.preworkChecklist)
  const togglePreworkItem = useWorkshopStore(s => s.togglePreworkItem)
  const [studentCount, setStudentCount] = useState(null)

  useEffect(() => {
    if (!supabase) return
    supabase.from('students').select('id', { count: 'exact', head: true }).then(({ count }) => {
      if (count) setStudentCount(count)
    }).catch(() => {})
  }, [])

  // Single Claude Code path now — workshop is built around Claude Code (see P02).
  const pathKey = 'claude'
  const done = STEPS.filter((_, i) => preworkChecklist[`${pathKey}-${i}`]).length

  const studentLabel = (n) => {
    if (t('en', 'ru', 'uk') === 'en') return n === 1 ? 'student' : 'students'
    if (t('en', 'ru', 'uk') === 'uk') return n === 1 ? 'студент' : n < 5 ? 'студенти' : 'студентів'
    return n === 1 ? 'студент' : n < 5 ? 'студента' : 'студентов'
  }

  return (
    <PageShell pageIndex={3}>
      {/* Single path header */}
      <div className="flex justify-center mb-8">
        <div className="px-5 py-3 border border-qa-teal bg-qa-teal/[0.08] text-qa-teal font-mono text-[12px] tracking-[1px] uppercase">
          {t('Claude Code ($20/mo)', 'Claude Code ($20/мес)', 'Claude Code ($20/міс)')}
          <span className="block text-[11px] mt-0.5 tracking-[2px] text-qa-teal/60">
            {t('Workshop path', 'Путь воркшопа', 'Шлях воркшопу')}
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-mono text-[12px] text-text-dim tracking-wider">
            {t('Progress', 'Прогресс', 'Прогрес')}
          </span>
          <span className="font-mono text-[12px] text-qa-teal">{done}/{STEPS.length}</span>
        </div>
        <div className="h-[3px] bg-border overflow-hidden">
          <div className="h-full bg-qa-teal transition-all duration-500" style={{ width: `${(done / STEPS.length) * 100}%` }} />
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-2">
        {STEPS.map((step, i) => {
          const key = `${pathKey}-${i}`
          const isDone = preworkChecklist[key]
          return (
            <button
              key={key}
              onClick={() => togglePreworkItem(key)}
              className={`w-full text-left flex gap-4 p-4 border transition-all cursor-pointer ${
                isDone
                  ? 'border-forest/30 bg-forest/[0.05]'
                  : 'border-border bg-surface/30 hover:border-qa-teal/15'
              }`}
            >
              <div className={`shrink-0 w-5 h-5 mt-0.5 border flex items-center justify-center font-mono text-[12px] transition-colors ${
                isDone ? 'border-forest bg-forest text-black' : 'border-border'
              }`}>
                {isDone && '✓'}
              </div>
              <div>
                <p className={`text-sm transition-colors ${isDone ? 'text-forest line-through' : 'text-text-body'}`}>
                  {i + 1}. {t(step.text_en, step.text_ru, step.text_uk)}
                </p>
                <p className="font-mono text-[11px] text-text-dim mt-0.5">
                  {t(step.note_en, step.note_ru, step.note_uk)}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      {done === STEPS.length ? (
        <div className="mt-6 space-y-3">
          <div className="text-center p-5 border border-qa-teal/30 bg-qa-teal/[0.05]">
            <p className="font-display text-qa-teal text-lg">
              {t('Parapet crossed', 'Парапет пройден', 'Парапет пройдено')}
            </p>
            <p className="text-xs text-text-dim mt-1">
              {t(
                "All tools installed. You're ready.",
                'Все инструменты установлены. Ты готов(а).',
                'Усі інструменти встановлено. Ти готовий(а).'
              )}
            </p>
          </div>
          <CheckpointButton
            id="parapet"
            label={t('Mark Parapet crossed', 'Отметить: Парапет пройден', 'Позначити: Парапет пройдено')}
            helpText={t("Tells the facilitator you're ready", 'Сообщает фасилитатору что ты готов(а)', 'Повідомляє фасилітатору що ти готовий(а)')}
          />
        </div>
      ) : (
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              // Mark all steps as done
              for (let i = 0; i < STEPS.length; i++) {
                if (!preworkChecklist[`${pathKey}-${i}`]) togglePreworkItem(`${pathKey}-${i}`)
              }
            }}
            className="text-text-dim text-[13px] hover:text-text-secondary transition-colors cursor-pointer underline underline-offset-4"
          >
            {t(
              'Everything already installed — skip',
              'Всё уже установлено — пропустить',
              'Усе вже встановлено — пропустити'
            )}
          </button>
        </div>
      )}

      {/* Student counter */}
      {studentCount > 0 && (
        <div className="mt-6 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 border border-qa-teal/20 bg-qa-teal/[0.05] font-mono text-[13px] text-qa-teal">
            <span className="w-2 h-2 rounded-full bg-qa-teal animate-pulse" />
            {studentCount} {studentLabel(studentCount)} {t('already here', 'уже здесь', 'вже тут')}
          </span>
        </div>
      )}

      {/* Voice hack */}
      <div className="mt-6 p-4 border border-qa-teal/15 bg-qa-teal/[0.03]">
        <p className="text-xs text-text-secondary">
          <span className="text-qa-teal font-mono text-[12px] tracking-wider uppercase">
            {t('Tip', 'Лайфхак', 'Порада')}
          </span>
          {' — '}
          {t(
            "At the workshop you don't have to type by hand.",
            'На воркшопе не обязательно набирать руками.',
            'На воркшопі не обовʼязково набирати руками.'
          )}
          {' '}Mac: <code className="font-mono text-ember text-[11px] bg-black/50 px-1">Fn</code> {t('twice', 'дважды', 'двічі')}.
          {' '}Win: <code className="font-mono text-ember text-[11px] bg-black/50 px-1">Win+H</code>.
        </p>
      </div>
    </PageShell>
  )
}
