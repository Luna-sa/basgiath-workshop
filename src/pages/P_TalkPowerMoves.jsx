import PageShell from '../core/PageShell'
import { useT } from '../i18n/useT'

const MOVES = [
  {
    n: '01',
    name_en: 'Plan First, Code Later',
    name_ru: 'План - первым, код - потом',
    name_uk: 'План - першим, код - потім',
    text_en: 'Before any complex task: "Don\'t do it yet. Show me the plan. Ask clarifying questions if anything is unclear." Works in 90% of cases. Catches the misunderstandings before code happens.',
    text_ru: 'Перед сложной задачей: «Не делай пока. Покажи план. Задай уточняющие вопросы если что-то неясно». Работает в 90% случаев. Ловит непонимания до того как код напишется.',
    text_uk: 'Перед складною задачею: «Не роби поки. Покажи план. Постав уточнювальні питання якщо щось неясно». Працює у 90% випадків. Ловить непорозуміння до того як код напишеться.',
  },
  {
    n: '02',
    name_en: 'Show source',
    name_ru: 'Покажи source',
    name_uk: 'Покажи source',
    text_en: 'When AI claims something specific: "Where from? Read the file and quote the line." Anti-hallucination. Forces evidence over confidence.',
    text_ru: 'Когда AI утверждает что-то конкретное: «Откуда? Прочти файл и процитируй строку». Анти-галлюцинация. Заставляет давать доказательства а не уверенность.',
    text_uk: 'Коли AI стверджує щось конкретне: «Звідки? Прочитай файл і процитуй рядок». Анти-галюцинація. Змушує давати докази а не впевненість.',
  },
  {
    n: '03',
    name_en: 'Drag & drop',
    name_ru: 'Drag & drop',
    name_uk: 'Drag & drop',
    text_en: 'Drag a file or screenshot into the terminal - the path inserts automatically. Claude sees screenshots: paste a UI bug image instead of describing.',
    text_ru: 'Перетащи файл или скриншот в терминал - путь вставится сам. Claude видит скриншоты: вместо описания - кидай картинку UI-бага.',
    text_uk: 'Перетягни файл або скриншот у термінал - шлях вставиться сам. Claude бачить скриншоти: замість опису - кидай картинку UI-бага.',
  },
  {
    n: '04',
    name_en: 'Give it the error',
    name_ru: 'Дай ему ошибку',
    name_uk: 'Дай йому помилку',
    text_en: '"Doesn\'t work" - useless. Full error text + expected + actual + repro steps = a path to the fix. Treat Claude like a teammate, not a fortune teller.',
    text_ru: '«Не работает» - бесполезно. Полный текст ошибки + ожидание + факт + шаги воспроизведения = путь к фиксу. Относись к Claude как к коллеге, не предсказателю.',
    text_uk: '«Не працює» - марно. Повний текст помилки + очікування + факт + кроки відтворення = шлях до фіксу. Стався до Claude як до колеги, не віщуна.',
  },
  {
    n: '05',
    name_en: '/clear when context is full',
    name_ru: '/clear когда контекст переполнен',
    name_uk: '/clear коли контекст переповнений',
    text_en: 'Claude starts repeating itself or losing the thread - /clear. Clean session. CLAUDE.md stays loaded. Memory in the project stays. Cheap reset.',
    text_ru: 'Claude начинает повторяться или терять нить - /clear. Чистая сессия. CLAUDE.md остаётся загружен. Память в проекте сохраняется. Дешёвый ресет.',
    text_uk: 'Claude починає повторюватися або губити нитку - /clear. Чиста сесія. CLAUDE.md залишається завантажений. Памʼять у проєкті зберігається. Дешевий ресет.',
    featured: true,
  },
  {
    n: '06',
    name_en: 'Sub-agents in parallel',
    name_ru: 'Sub-agents параллельно',
    name_uk: 'Sub-agents паралельно',
    text_en: 'Use the Task tool: "Launch 3 agents in parallel - one to review code, one to write tests, one to update docs." They run isolated, return summaries to you. Like having a team.',
    text_ru: 'Используй Task tool: «Запусти 3 агента параллельно - одного на ревью кода, второго на тесты, третьего на доки». Работают изолированно, возвращают summary. Как команда.',
    text_uk: 'Використовуй Task tool: «Запусти 3 агенти паралельно - одного на ревʼю коду, другого на тести, третього на доки». Працюють ізольовано, повертають summary. Як команда.',
  },
]

export default function P_TalkPowerMoves() {
  const t = useT()
  return (
    <PageShell pageIndex={9}>
      <div className="space-y-6">

        <p className="text-[15px] text-text-body leading-relaxed max-w-3xl">
          {t(
            "Six moves that power-users run every day. Not «secret commands» - skills. Master all six and Claude becomes 5x more productive.",
            "Шесть приёмов которыми пользуются power-юзеры каждый день. Это не «секретные команды» - это навыки. Освой все шесть и Claude станет в 5 раз продуктивнее.",
            "Шість прийомів якими користуються power-юзери щодня. Це не «секретні команди» - це навички. Освій усі шість і Claude стане у 5 разів продуктивнішим."
          )}
        </p>

        <div className="grid md:grid-cols-2 gap-3">
          {MOVES.map(m => (
            <div
              key={m.n}
              className={`p-4 border ${
                m.featured
                  ? 'border-qa-teal/40 bg-qa-teal/[0.06] md:col-span-2'
                  : 'border-border bg-surface/40'
              }`}
            >
              <div className="flex items-baseline gap-3 mb-2">
                <span className="font-mono text-[11px] tracking-[2px] text-qa-teal">{m.n}</span>
                <span className="font-display italic text-lg text-white">
                  {t(m.name_en, m.name_ru, m.name_uk)}
                </span>
              </div>
              <p className="text-[13px] text-text-body leading-relaxed">
                {t(m.text_en, m.text_ru, m.text_uk)}
              </p>
            </div>
          ))}
        </div>

      </div>
    </PageShell>
  )
}
