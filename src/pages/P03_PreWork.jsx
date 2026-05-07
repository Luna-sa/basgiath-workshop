import { useState, useEffect } from 'react'
import { useWorkshopStore } from '../store/workshopStore'
import { supabase } from '../api/supabase'
import PageShell from '../core/PageShell'
import CheckpointButton from '../components/CheckpointButton'
import { useT } from '../i18n/useT'

const paths = {
  cursor: {
    label: 'Cursor (бесплатно)',
    tag: 'Рекомендован',
    steps: [
      { text: 'Скачать Cursor с cursor.com', note: 'Бесплатный аккаунт, без карты' },
      { text: 'Войти через Google или GitHub', note: 'Выбрать "I\'m new to coding" если спросит' },
      { text: 'Установить Git', note: 'git-scm.com — macOS часто уже имеет' },
      { text: 'Создать папку qa-workspace', note: 'File > Open Folder > New Folder' },
      { text: 'Склонировать тестовый проект', note: 'Скачай: /sample-project.zip' },
      { text: 'Проверить: Cmd+I → написать "hello"', note: 'Должен ответить' },
    ],
  },
  claude: {
    label: 'Claude Code ($20/мес)',
    tag: 'Продвинутый',
    steps: [
      { text: 'Установить Claude Code', note: 'curl -fsSL https://claude.ai/install.sh | bash' },
      { text: 'Подписка Claude Pro ($20/мес)', note: 'claude.ai/pricing' },
      { text: 'Установить Git', note: 'git-scm.com' },
      { text: 'Создать папку', note: 'mkdir ~/qa-workspace && cd ~/qa-workspace && git init' },
      { text: 'Склонировать тестовый проект', note: 'Скачай: /sample-project.zip' },
      { text: 'Проверить: claude --version', note: 'Должен показать версию' },
    ],
  },
}

export default function P03_PreWork() {
  const preworkPath = useWorkshopStore(s => s.preworkPath)
  const preworkChecklist = useWorkshopStore(s => s.preworkChecklist)
  const setPreworkPath = useWorkshopStore(s => s.setPreworkPath)
  const togglePreworkItem = useWorkshopStore(s => s.togglePreworkItem)
  const [studentCount, setStudentCount] = useState(null)

  useEffect(() => {
    if (!supabase) return
    supabase.from('students').select('id', { count: 'exact', head: true }).then(({ count }) => {
      if (count) setStudentCount(count)
    }).catch(() => {})
  }, [])

  const currentSteps = paths[preworkPath].steps
  const done = currentSteps.filter((_, i) => preworkChecklist[`${preworkPath}-${i}`]).length

  return (
    <PageShell pageIndex={3}>
      {/* Path switcher */}
      <div className="flex justify-center gap-3 mb-8">
        {Object.entries(paths).map(([key, p]) => (
          <button
            key={key}
            onClick={() => setPreworkPath(key)}
            className={`px-5 py-3 border font-mono text-[12px] tracking-[1px] uppercase transition-all cursor-pointer ${
              preworkPath === key
                ? 'border-qa-teal bg-qa-teal/[0.08] text-qa-teal'
                : 'border-border text-text-dim hover:border-qa-teal/25'
            }`}
          >
            {p.label}
            <span className={`block text-[11px] mt-0.5 tracking-[2px] ${
              preworkPath === key ? 'text-qa-teal/60' : 'text-text-dim'
            }`}>{p.tag}</span>
          </button>
        ))}
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-mono text-[12px] text-text-dim tracking-wider">Прогресс</span>
          <span className="font-mono text-[12px] text-qa-teal">{done}/{currentSteps.length}</span>
        </div>
        <div className="h-[3px] bg-border overflow-hidden">
          <div className="h-full bg-qa-teal transition-all duration-500" style={{ width: `${(done / currentSteps.length) * 100}%` }} />
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-2">
        {currentSteps.map((step, i) => {
          const key = `${preworkPath}-${i}`
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
                  {i + 1}. {step.text}
                </p>
                <p className="font-mono text-[11px] text-text-dim mt-0.5">{step.note}</p>
              </div>
            </button>
          )
        })}
      </div>

      {done === currentSteps.length ? (
        <div className="mt-6 space-y-3">
          <div className="text-center p-5 border border-qa-teal/30 bg-qa-teal/[0.05]">
            <p className="font-display text-qa-teal text-lg">Парапет пройден</p>
            <p className="text-xs text-text-dim mt-1">Все инструменты установлены. Ты готов(а).</p>
          </div>
          <CheckpointButton
            id="parapet"
            label="Mark Parapet crossed"
            helpText="Tells the facilitator you're ready"
          />
        </div>
      ) : (
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              // Mark all steps as done
              const path = preworkPath
              for (let i = 0; i < 6; i++) {
                if (!preworkChecklist[`${path}-${i}`]) togglePreworkItem(`${path}-${i}`)
              }
            }}
            className="text-text-dim text-[13px] hover:text-text-secondary transition-colors cursor-pointer underline underline-offset-4"
          >
            Всё уже установлено — пропустить
          </button>
        </div>
      )}

      {/* Student counter */}
      {studentCount > 0 && (
        <div className="mt-6 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 border border-qa-teal/20 bg-qa-teal/[0.05] font-mono text-[13px] text-qa-teal">
            <span className="w-2 h-2 rounded-full bg-qa-teal animate-pulse" />
            {studentCount} {studentCount === 1 ? 'студент' : studentCount < 5 ? 'студента' : 'студентов'} уже здесь
          </span>
        </div>
      )}

      {/* Voice hack */}
      <div className="mt-6 p-4 border border-qa-teal/15 bg-qa-teal/[0.03]">
        <p className="text-xs text-text-secondary">
          <span className="text-qa-teal font-mono text-[12px] tracking-wider uppercase">Лайфхак</span>
          {' '}— На воркшопе не обязательно набирать руками.
          Mac: <code className="font-mono text-ember text-[11px] bg-black/50 px-1">Fn</code> дважды.
          Win: <code className="font-mono text-ember text-[11px] bg-black/50 px-1">Win+H</code>.
        </p>
      </div>
    </PageShell>
  )
}
