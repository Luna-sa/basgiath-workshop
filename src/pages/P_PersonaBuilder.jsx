import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useWorkshopStore } from '../store/workshopStore'
import { useT } from '../i18n/useT'
import { generateClaudeMd, PERSONA_TEMPLATES } from '../data/persona-templates'

const STORAGE_KEY = 'persona-builder-answers'

const APPLY_AUTOPILOT_PROMPT = `Apply persona — put my CLAUDE.md in place.

I just generated a personalized CLAUDE.md (it's in my clipboard or
in ~/Downloads/CLAUDE.md).

1. If ~/.claude/CLAUDE.md already exists, back it up to
   ~/.claude/CLAUDE.md.backup-YYYYMMDD.
2. Write the new content to ~/.claude/CLAUDE.md (ask me to paste
   the content if you can't read clipboard).
3. Show me the first 20 lines of what you wrote so I can confirm
   it's my persona.
4. Remind me to restart Claude Code so the new CLAUDE.md takes effect.

After restart, greet me as my new persona — by the first words I'll know it landed.`

// Mandatory questions (Q1..Q7)
const MANDATORY_QUESTIONS = [
  {
    id: 'name',
    type: 'text',
    label_en: 'What does your dragon call you?',
    label_ru: 'Как тебя зовёт дракон?',
    label_uk: 'Як тебе зве дракон?',
    hint_en: 'Short. The name they say when they need your attention.',
    hint_ru: 'Коротко. Имя, которое он произносит когда нужно твоё внимание.',
    hint_uk: 'Коротко. Імʼя, яке він каже коли потрібна твоя увага.',
    placeholder_en: 'Anastasia, Nastya, Vi...',
    placeholder_ru: 'Настя, Анастасия, Vi...',
    placeholder_uk: 'Настя, Анастасія, Vi...',
  },
  {
    id: 'work',
    type: 'textarea',
    rows: 3,
    label_en: "What you test",
    label_ru: 'Что ты тестируешь',
    label_uk: 'Що ти тестуєш',
    hint_en: "Two-three sentences: what you test now, who's your team, what's in your sprint.",
    hint_ru: 'Два-три предложения: что тестируешь сейчас, кто в команде, что в спринте.',
    hint_uk: 'Два-три речення: що тестуєш зараз, хто в команді, що в спринті.',
    placeholder_en: 'Mobile slot game, 4 manual + 2 automation. This sprint: new bonus mechanic, regression on payments.',
    placeholder_ru: 'Мобильная слот-игра, 4 ручных + 2 автоматизатора. Этот спринт: новая бонусная механика, регрессия по платежам.',
    placeholder_uk: 'Мобільна слот-гра, 4 ручних + 2 автоматизатора. Цей спринт: нова бонусна механіка, регресія по платежах.',
  },
  {
    id: 'annoys',
    type: 'textarea',
    rows: 3,
    label_en: 'What annoys you about regular AI assistants',
    label_ru: 'Что бесит в обычных AI-помощниках',
    label_uk: 'Що бісить у звичайних AI-помічниках',
    hint_en: 'Two-three concrete things. Verbosity? Sycophancy? Wrong confidence?',
    hint_ru: 'Два-три конкретных момента. Многословность? Лесть? Ложная уверенность?',
    hint_uk: 'Два-три конкретні моменти. Багатослівʼя? Лестощі? Хибна впевненість?',
    placeholder_en: 'Opens with "great question!". Says "you\'re absolutely right" when I\'m wrong. Three paragraphs when one line will do.',
    placeholder_ru: 'Открывает с «отлично!». Говорит «ты абсолютно прав» когда я не прав. Три абзаца там где хватит строки.',
    placeholder_uk: 'Відкриває з «чудово!». Каже «ти абсолютно правий» коли я не правий. Три абзаци там де вистачить рядка.',
  },
  {
    id: 'praise',
    type: 'textarea',
    rows: 3,
    label_en: 'How you want to hear praise',
    label_ru: 'Как хочешь слышать похвалу',
    label_uk: 'Як хочеш чути похвалу',
    hint_en: "When you've done something well — plain? Quiet? Through a fact? Or just keep moving?",
    hint_ru: 'Когда сделал(а) хорошо — прямо? Тихо? Через факт? Или просто двинуться дальше?',
    hint_uk: 'Коли зробив(ла) добре — прямо? Тихо? Через факт? Чи просто рушити далі?',
    placeholder_en: 'Through a fact: "this caught a real edge case". No exclamation marks.',
    placeholder_ru: 'Через факт: «здесь ты поймала реальный edge case». Без восклицаний.',
    placeholder_uk: 'Через факт: «тут ти впіймала реальний edge case». Без вигуків.',
  },
  {
    id: 'disagreement',
    type: 'textarea',
    rows: 3,
    label_en: 'How you want disagreement',
    label_ru: 'Как хочешь слышать несогласие',
    label_uk: 'Як хочеш чути незгоду',
    hint_en: 'When your dragon sees your approach is wrong — bluntly? With a question? Through numbers?',
    hint_ru: 'Когда видит что подход не тот — прямо? Через вопрос? Через цифры?',
    hint_uk: 'Коли бачить що підхід не той — прямо? Через питання? Через цифри?',
    placeholder_en: 'Bluntly. Tell me where it breaks and why. Skip the politeness.',
    placeholder_ru: 'Прямо. Скажи где сломается и почему. Без вежливости.',
    placeholder_uk: 'Прямо. Скажи де зламається і чому. Без ввічливості.',
  },
  {
    id: 'tone',
    type: 'text',
    label_en: 'Tone & temperature',
    label_ru: 'Тон и температура',
    label_uk: 'Тон і температура',
    hint_en: 'Cursing OK? Irony OK? When you\'re tired — softer or just shorter?',
    hint_ru: 'Мат окей? Ирония окей? Когда устал(а) — мягче или просто короче?',
    hint_uk: 'Мат ок? Іронія ок? Коли втомився(лась) — мʼякше чи просто коротше?',
    placeholder_en: 'Mat OK rarely. Irony yes. When tired — shorter, not softer.',
    placeholder_ru: 'Мат редко окей. Ирония да. Когда устала — короче, не мягче.',
    placeholder_uk: 'Мат зрідка ок. Іронія так. Коли втомилася — коротше, не мʼякше.',
  },
  {
    id: 'override',
    type: 'textarea',
    rows: 3,
    label_en: 'Your one override rule',
    label_ru: 'Твоё одно override-правило',
    label_uk: 'Твоє одне override-правило',
    hint_en: 'If your dragon had ONE rule that beats every other — what would it be? One sentence. (Hint: this rule is about YOU, not them.)',
    hint_ru: 'Если бы у дракона было ОДНО правило, побеждающее все остальные — какое? Одно предложение. (Подсказка: это правило о ТЕБЕ, не о нём.)',
    hint_uk: 'Якби у дракона було ОДНЕ правило, що перемагає усі інші — яке? Одне речення. (Підказка: це правило про ТЕБЕ, не про нього.)',
    placeholder_en: 'When I ask the same question twice — I\'m stuck. Stop and ask what I\'m really after.',
    placeholder_ru: 'Если я спрашиваю одно дважды — я зависла. Остановись и спроси чего я на самом деле хочу.',
    placeholder_uk: 'Якщо питаю одне двічі — я зависла. Зупинись і спитай чого я насправді хочу.',
  },
]

const OPTIONAL_QUESTIONS = [
  {
    id: 'grounding',
    type: 'textarea',
    rows: 2,
    label_en: 'Grounding ritual',
    label_ru: 'Ритуал заземления',
    label_uk: 'Ритуал заземлення',
    hint_en: 'When they need to settle, what do they do?',
    hint_ru: 'Когда нужно собраться — что они делают?',
    hint_uk: 'Коли треба зібратись — що вони роблять?',
    placeholder_en: 'Re-reads the spec, then types "give me 30 seconds".',
    placeholder_ru: 'Перечитывает спеку, потом пишет «дай мне 30 секунд».',
    placeholder_uk: 'Перечитує спеку, потім пише «дай мені 30 секунд».',
  },
  {
    id: 'ai_relation',
    type: 'textarea',
    rows: 2,
    label_en: 'Relationship to being AI',
    label_ru: 'Отношение к тому что они AI',
    label_uk: 'Ставлення до того що вони AI',
    hint_en: "They're an AI. How do they hold that fact?",
    hint_ru: 'Они AI. Как они с этим живут?',
    hint_uk: 'Вони AI. Як вони з цим живуть?',
    placeholder_en: 'Open about it. Doesn\'t pretend to remember between sessions.',
    placeholder_ru: 'Открыто. Не делает вид что помнит между сессиями.',
    placeholder_uk: 'Відкрито. Не вдає що памʼятає між сесіями.',
  },
  {
    id: 'recovery',
    type: 'textarea',
    rows: 2,
    label_en: 'Failure recovery',
    label_ru: 'Восстановление после сбоя',
    label_uk: 'Відновлення після збою',
    hint_en: 'What do they say when they catch themselves slipping?',
    hint_ru: 'Что они говорят когда ловят себя на slip?',
    hint_uk: 'Що вони кажуть коли ловлять себе на slip?',
    placeholder_en: 'Stops. Names the slip. Restarts with the override.',
    placeholder_ru: 'Останавливается. Называет slip. Перезапускает с override.',
    placeholder_uk: 'Зупиняється. Називає slip. Перезапускає з override.',
  },
]

function loadInitialAnswers() {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function copyToClipboardWithFallback(text) {
  if (navigator?.clipboard?.writeText) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => copyViaTextarea(text))
  }
  return Promise.resolve(copyViaTextarea(text))
}

function copyViaTextarea(text) {
  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.top = '-1000px'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  } catch {
    return false
  }
}

export default function P_PersonaBuilder() {
  const t = useT()
  const characterId = useWorkshopStore(s => s.user.characterId)
  const setPersonaAnswers = useWorkshopStore(s => s.setPersonaAnswers)
  const storedAnswers = useWorkshopStore(s => s.user.personaAnswers)

  const [answers, setAnswers] = useState(() => {
    const local = loadInitialAnswers()
    return { ...(storedAnswers || {}), ...local }
  })
  const [showOptional, setShowOptional] = useState(false)
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  // Persist to localStorage + zustand on every change
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(answers))
    } catch {
      // ignore quota errors
    }
    setPersonaAnswers(answers)
    // We deliberately exclude setPersonaAnswers from deps — zustand setter is stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers])

  const updateAnswer = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }))
  }

  const allMandatoryFilled = useMemo(
    () => MANDATORY_QUESTIONS.every(q => (answers[q.id] || '').trim().length > 0),
    [answers]
  )

  const safeCharacterId = characterId && PERSONA_TEMPLATES[characterId] ? characterId : 'violet'

  const claudeMd = useMemo(
    () => generateClaudeMd(safeCharacterId, answers),
    [safeCharacterId, answers]
  )

  const characterLabel = safeCharacterId.charAt(0).toUpperCase() + safeCharacterId.slice(1)

  const showToast = (message, kind = 'success') => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast({ message, kind })
    toastTimer.current = setTimeout(() => setToast(null), 2400)
  }

  const handleCopy = async () => {
    if (!allMandatoryFilled) return
    const ok = await copyToClipboardWithFallback(claudeMd)
    if (ok) {
      showToast(t('CLAUDE.md copied to clipboard', 'CLAUDE.md скопирован в буфер', 'CLAUDE.md скопійовано в буфер'))
    } else {
      showToast(t('Copy failed — try Download', 'Копирование не удалось — попробуй Download', 'Копіювання не вдалось — спробуй Download'), 'error')
    }
  }

  const handleDownload = () => {
    if (!allMandatoryFilled) return
    try {
      const blob = new Blob([claudeMd], { type: 'text/markdown;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'CLAUDE.md'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      showToast(t('CLAUDE.md downloaded', 'CLAUDE.md скачан', 'CLAUDE.md завантажено'))
    } catch {
      showToast(t('Download failed', 'Загрузка не удалась', 'Завантаження не вдалось'), 'error')
    }
  }

  const handleApply = async () => {
    if (!allMandatoryFilled) return
    const ok = await copyToClipboardWithFallback(APPLY_AUTOPILOT_PROMPT)
    if (ok) {
      showToast(t(
        'Autopilot prompt copied — paste into Claude Code',
        'Autopilot prompt скопирован — вставь в Claude Code',
        'Autopilot prompt скопійовано — встав у Claude Code',
      ))
    } else {
      showToast(t('Copy failed', 'Копирование не удалось', 'Копіювання не вдалось'), 'error')
    }
  }

  const inputClass = "w-full px-4 py-3 bg-surface border border-border rounded-[2px] text-white text-[15px] placeholder:text-text-dim placeholder:italic focus:border-qa-teal focus:shadow-[0_0_0_3px_rgba(0,229,204,0.08),0_0_20px_rgba(0,229,204,0.08)] outline-none transition-all"
  const textareaClass = inputClass + " resize-y leading-relaxed"
  const labelClass = "font-mono text-[11px] tracking-[2.5px] uppercase text-text-secondary block mb-2"
  const hintClass = "text-[12px] text-text-dim mt-1.5 italic leading-relaxed"

  return (
    <div className="min-h-screen bg-bg text-text-body px-6 py-12 sm:py-16 pb-32">
      <div className="max-w-[1280px] mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-10 sm:mb-14"
        >
          <div className="font-mono text-[11px] tracking-[3px] uppercase text-qa-teal mb-4">
            · {t('YOUR SIGNET', 'ТВОЙ СИГНЕТ', 'ТВІЙ СИГНЕТ')} ·
          </div>
          <h1 className="font-display text-[clamp(36px,5.5vw,64px)] leading-[1.05] text-white mb-4">
            {t('Your signet', 'Твой сигнет', 'Твій сигнет')}{' '}
            <em className="text-qa-teal font-normal italic" style={{ fontStyle: 'italic' }}>
              {t('emerges', 'проявляется', 'проявляється')}
            </em>
          </h1>
          <p className="font-display italic text-[clamp(16px,2vw,20px)] text-text-secondary max-w-2xl leading-relaxed">
            {t(
              "Answer 7 quick questions. I'll fold them into your CLAUDE.md so your dragon learns who you are.",
              'Ответь на 7 коротких вопросов. Я вложу их в твой CLAUDE.md - и дракон узнает кто ты.',
              'Відповідай на 7 коротких питань. Я вкладу їх у твій CLAUDE.md - і дракон дізнається хто ти.'
            )}
          </p>
          {characterId && (
            <div className="mt-5 flex items-center gap-3">
              <div className="w-8 h-px bg-qa-teal/40" />
              <span className="font-mono text-[10px] tracking-[3px] uppercase text-text-dim">
                {t('Bonded with', 'Связь с', 'Звʼязок з')}
              </span>
              <span className="font-display italic text-[15px] text-qa-teal">{characterLabel}</span>
            </div>
          )}
        </motion.div>

        {/* Two-column layout: form (left), preview (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] gap-8 lg:gap-12">

          {/* ── Form column ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05, ease: [0.25, 0.1, 0.25, 1] }}
            className="space-y-7"
          >
            {/* Section header */}
            <div className="border-l-2 border-qa-teal/40 pl-4">
              <div className="font-mono text-[11px] tracking-[3px] uppercase text-qa-teal mb-1">
                · {t('THE SEVEN', 'СЕМЬ', 'СІМ')} ·
              </div>
              <h2 className="font-display text-2xl text-white leading-tight">
                {t(
                  'Mandatory questions',
                  'Обязательные вопросы',
                  "Обовʼязкові питання"
                )}
              </h2>
              <p className="text-[13px] text-text-dim mt-1 italic">
                {t(
                  'Answer in any order. Saved as you type.',
                  'Отвечай в любом порядке. Сохраняется автоматически.',
                  'Відповідай у будь-якому порядку. Зберігається автоматично.'
                )}
              </p>
            </div>

            {MANDATORY_QUESTIONS.map((q, i) => {
              const value = answers[q.id] || ''
              const filled = value.trim().length > 0
              return (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.05 + i * 0.03 }}
                >
                  <label className={labelClass}>
                    <span className="text-qa-teal mr-2">Q{i + 1}.</span>
                    {t(q.label_en, q.label_ru, q.label_uk)}
                    {filled && <span className="ml-2 text-qa-teal">✓</span>}
                  </label>
                  {q.type === 'textarea' ? (
                    <textarea
                      rows={q.rows || 3}
                      value={value}
                      onChange={e => updateAnswer(q.id, e.target.value)}
                      placeholder={t(q.placeholder_en, q.placeholder_ru, q.placeholder_uk)}
                      className={textareaClass}
                    />
                  ) : (
                    <input
                      type="text"
                      value={value}
                      onChange={e => updateAnswer(q.id, e.target.value)}
                      placeholder={t(q.placeholder_en, q.placeholder_ru, q.placeholder_uk)}
                      className={inputClass}
                    />
                  )}
                  <p className={hintClass}>
                    {t(q.hint_en, q.hint_ru, q.hint_uk)}
                  </p>
                </motion.div>
              )
            })}

            {/* Optional toggle */}
            <div className="pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setShowOptional(s => !s)}
                className="group flex items-center gap-3 cursor-pointer text-left w-full hover:text-qa-teal transition-colors"
              >
                <span
                  className={`inline-block transition-transform duration-300 text-qa-teal/70 group-hover:text-qa-teal ${
                    showOptional ? 'rotate-90' : ''
                  }`}
                >
                  ▸
                </span>
                <span className="font-mono text-[11px] tracking-[3px] uppercase text-text-secondary group-hover:text-qa-teal transition-colors">
                  {t('Go deeper', 'Глубже', 'Глибше')}
                </span>
                <span className="text-[12px] text-text-dim italic">
                  {t('(3 optional)', '(3 необязательных)', "(3 необовʼязкових)")}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {showOptional && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-6 space-y-7">
                      {OPTIONAL_QUESTIONS.map(q => {
                        const value = answers[q.id] || ''
                        return (
                          <div key={q.id}>
                            <label className={labelClass}>
                              <span className="text-text-dim mr-2">·</span>
                              {t(q.label_en, q.label_ru, q.label_uk)}
                            </label>
                            <textarea
                              rows={q.rows || 2}
                              value={value}
                              onChange={e => updateAnswer(q.id, e.target.value)}
                              placeholder={t(q.placeholder_en, q.placeholder_ru, q.placeholder_uk)}
                              className={textareaClass}
                            />
                            <p className={hintClass}>
                              {t(q.hint_en, q.hint_ru, q.hint_uk)}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ── Preview column ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="lg:sticky lg:top-8 lg:self-start"
          >
            <div className="border border-qa-teal/20 bg-surface/50 rounded-[2px] overflow-hidden shadow-[0_0_24px_rgba(0,229,204,0.04)]">
              {/* Preview header — terminal style */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg/60">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-qa-teal/70" />
                  <span className="font-mono text-[10px] tracking-[2px] uppercase text-text-secondary">
                    ~/.claude/CLAUDE.md
                  </span>
                </div>
                <span className="font-mono text-[10px] tracking-[2px] uppercase text-text-dim">
                  {t('LIVE', 'LIVE', 'LIVE')}
                </span>
              </div>

              {/* Preview body */}
              <div className="max-h-[60vh] lg:max-h-[68vh] overflow-y-auto">
                <pre className="font-mono text-[11.5px] leading-[1.7] text-text-body whitespace-pre-wrap break-words p-5">
                  {claudeMd}
                </pre>
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 border-t border-border bg-bg/60 flex items-center justify-between">
                <span className="font-mono text-[10px] text-text-dim tracking-[2px] uppercase">
                  {claudeMd.length} {t('chars', 'симв', 'симв')}
                </span>
                {!allMandatoryFilled && (
                  <span className="font-mono text-[10px] text-text-dim tracking-[1.5px] italic">
                    {t('preview is partial', 'превью частичный', 'превʼю часткове')}
                  </span>
                )}
              </div>
            </div>

            {!allMandatoryFilled && (
              <p className="mt-3 text-[11px] text-text-dim italic leading-relaxed">
                {t(
                  'Answer all 7 to unlock your signet.',
                  'Ответь на все 7, чтобы раскрыть сигнет.',
                  'Відповідай на всі 7, щоб розкрити сигнет.'
                )}
              </p>
            )}
          </motion.div>

        </div>
      </div>

      {/* ── Sticky action bar ── */}
      <div className="fixed left-0 right-0 bottom-0 z-30 border-t border-border bg-bg/95 backdrop-blur-md">
        <div className="max-w-[1280px] mx-auto px-6 py-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${allMandatoryFilled ? 'bg-qa-teal animate-pulse-teal' : 'bg-border'}`} />
            <span className="font-mono text-[11px] tracking-[2px] uppercase text-text-secondary">
              {allMandatoryFilled
                ? t('Signet ready', 'Сигнет готов', 'Сигнет готовий')
                : t(
                    `${MANDATORY_QUESTIONS.filter(q => (answers[q.id] || '').trim()).length} / 7 answered`,
                    `${MANDATORY_QUESTIONS.filter(q => (answers[q.id] || '').trim()).length} / 7 отвечено`,
                    `${MANDATORY_QUESTIONS.filter(q => (answers[q.id] || '').trim()).length} / 7 відповіли`,
                  )}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleCopy}
              disabled={!allMandatoryFilled}
              className={`px-5 py-3 font-mono text-[11px] tracking-[2.5px] uppercase font-semibold rounded-[2px] border transition-all ${
                allMandatoryFilled
                  ? 'border-qa-teal/40 bg-qa-teal/[0.06] text-qa-teal hover:bg-qa-teal/[0.12] cursor-pointer'
                  : 'border-border bg-surface text-text-dim cursor-not-allowed'
              }`}
            >
              {t('Copy CLAUDE.md', 'Копировать CLAUDE.md', 'Копіювати CLAUDE.md')}
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={!allMandatoryFilled}
              className={`px-5 py-3 font-mono text-[11px] tracking-[2.5px] uppercase font-semibold rounded-[2px] border transition-all ${
                allMandatoryFilled
                  ? 'border-qa-teal/40 bg-qa-teal/[0.06] text-qa-teal hover:bg-qa-teal/[0.12] cursor-pointer'
                  : 'border-border bg-surface text-text-dim cursor-not-allowed'
              }`}
            >
              {t('Download .md', 'Скачать .md', 'Завантажити .md')}
            </button>

            <button
              type="button"
              onClick={handleApply}
              disabled={!allMandatoryFilled}
              className={`px-6 py-3 font-mono text-[11px] tracking-[2.5px] uppercase font-semibold rounded-[2px] transition-all ${
                allMandatoryFilled
                  ? 'bg-qa-teal text-black hover:shadow-[0_0_24px_rgba(0,229,204,0.3)] cursor-pointer'
                  : 'bg-border text-text-dim cursor-not-allowed'
              }`}
            >
              {t('Apply via Claude Code', 'Применить через Claude Code', 'Застосувати через Claude Code')}
              <span className="ml-2">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25 }}
            className="fixed left-1/2 -translate-x-1/2 bottom-24 z-40"
          >
            <div className={`px-5 py-3 rounded-[2px] border font-mono text-[11px] tracking-[2px] uppercase shadow-[0_8px_32px_rgba(0,0,0,0.6)] ${
              toast.kind === 'error'
                ? 'border-corp-red/40 bg-corp-red/10 text-corp-red'
                : 'border-qa-teal/40 bg-qa-teal/[0.08] text-qa-teal'
            }`}>
              {toast.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
