import PageShell from '../core/PageShell'
import { useT } from '../i18n/useT'

export default function P04_TalkIntro() {
  const t = useT()
  return (
    <PageShell pageIndex={4}>
      <div className="space-y-8">

        {/* Hook — rider + dragon silhouette anchors the lore moment.
            Image is portrait (9:16); pinned right on desktop, full
            width above on mobile. The hook line sits beside it.  */}
        <div className="grid md:grid-cols-[1fr_280px] gap-6 items-center">
          <p className="font-display italic text-[clamp(20px,2.6vw,26px)] text-text-secondary leading-relaxed">
            {t(
              "ChatGPT is a window. Claude Code is a worker who lives inside your project.",
              "ChatGPT - это окно. Claude Code - это рабочий, который живёт в твоём проекте.",
              "ChatGPT - це вікно. Claude Code - це працівник, який живе у твоєму проєкті."
            )}
          </p>
          <div className="relative aspect-[9/16] max-h-[320px] mx-auto md:mx-0 overflow-hidden border border-border bg-black">
            <img
              src="/hero/bonding-rider.jpg"
              alt=""
              className="w-full h-full object-cover opacity-90"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-bg/50 via-transparent to-transparent" />
          </div>
        </div>

        {/* Yesterday's habit vs today's move - concrete pain example */}
        <div className="border border-qa-teal/30 bg-qa-teal/[0.04] p-5">
          <div className="font-mono text-[10px] tracking-[2px] uppercase text-qa-teal mb-3">
            ◆ {t("Yesterday's habit → today's move", 'Вчерашняя привычка → сегодняшний ход', 'Вчорашня звичка → сьогоднішній хід')}
          </div>
          <div className="grid md:grid-cols-2 gap-3 text-[13px] leading-relaxed">
            <div>
              <span className="font-mono text-[10px] tracking-[1.5px] uppercase text-corp-red">ChatGPT</span>
              <p className="text-text-secondary mt-1">
                {t(
                  'Paste a stack trace. Get a generic answer. Re-paste your function. Re-paste your package.json. Re-paste your test. Get another generic answer.',
                  'Вставляешь stack trace. Получаешь общий ответ. Опять вставляешь функцию. Опять package.json. Опять тест. Опять общий ответ.',
                  'Вставляєш stack trace. Отримуєш загальну відповідь. Знову вставляєш функцію. Знову package.json. Знову тест. Знову загальна відповідь.'
                )}
              </p>
            </div>
            <div>
              <span className="font-mono text-[10px] tracking-[1.5px] uppercase text-qa-teal">Claude Code</span>
              <p className="text-text-body mt-1">
                {t(
                  '/analyze-log → it reads the trace, opens your package.json, walks the actual file at the line in the trace, and tells you which assumption failed.',
                  '/analyze-log → читает trace, открывает твой package.json, идёт в файл по строке из trace и говорит какое допущение не сошлось.',
                  '/analyze-log → читає trace, відкриває твій package.json, йде у файл за рядком із trace і каже яке припущення не зійшлося.'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Comparison */}
        <div className="grid md:grid-cols-2 gap-5">
          <div className="p-5 border border-border border-l-[3px] border-l-corp-red/60 bg-surface/40">
            <div className="font-mono text-[11px] tracking-[3px] uppercase text-corp-red mb-3">
              {t('Generic chat AI', 'Обычный AI-чат', 'Звичайний AI-чат')}
            </div>
            <ul className="space-y-2 text-[14px] text-text-secondary">
              <li>◇ {t('Copy-paste code back and forth every time', 'Copy-paste код туда-сюда каждый раз', 'Copy-paste код туди-сюди щоразу')}</li>
              <li>◇ {t("Doesn't know your project, your team, your stack", 'Не знает твой проект, твою команду, твой стек', 'Не знає твій проєкт, твою команду, твій стек')}</li>
              <li>◇ {t('Every session - from scratch', 'Каждая сессия - с нуля', 'Кожна сесія - з нуля')}</li>
              <li>◇ {t("Can't open a file, run a test, make a commit", 'Не может открыть файл, запустить тест, сделать commit', 'Не може відкрити файл, запустити тест, зробити commit')}</li>
              <li>◇ {t("Doesn't remember yesterday's conversation", 'Не помнит вчерашнее обсуждение', 'Не памʼятає вчорашнє обговорення')}</li>
            </ul>
          </div>

          <div className="p-5 border border-qa-teal/30 border-l-[3px] border-l-qa-teal bg-qa-teal/[0.04]">
            <div className="font-mono text-[11px] tracking-[3px] uppercase text-qa-teal mb-3">
              {t('Claude Code - bonded partner', 'Claude Code - bonded напарник', 'Claude Code - bonded напарник')}
            </div>
            <ul className="space-y-2 text-[14px] text-text-body">
              <li>✓ {t('Reads and writes files straight in the repo', 'Читает и пишет файлы прямо в репо', 'Читає й пише файли прямо в репо')}</li>
              <li>✓ {t('Knows your project - constitution in CLAUDE.md', 'Знает твой проект - конституция в CLAUDE.md', 'Знає твій проєкт - конституція у CLAUDE.md')}</li>
              <li>✓ {t('Runs commands, tests, MCP servers', 'Запускает команды, тесты, MCP-серверы', 'Запускає команди, тести, MCP-сервери')}</li>
              <li>✓ {t('Remembers how to work with you - your voice, your rules', 'Помнит как с тобой работать - твой голос, твои правила', 'Памʼятає, як з тобою працювати - твій голос, твої правила')}</li>
              <li>✓ {t('Slash commands, agents, hooks - like muscles', 'Слэш-команды, агенты, hooks - как мускулы', 'Слеш-команди, агенти, hooks - як мʼязи')}</li>
            </ul>
          </div>
        </div>

        {/* Five levels of riding — vertical timeline. Each level has:
            big italic numeral · italic name · short tagline · one
            concrete move that becomes possible at THIS level · a thin
            connector line tying the column together. Opacity ramps
            up from level 01 to 05 so the visual reinforces "growth
            into the bond". */}
        <div>
          <p className="font-mono text-[11px] tracking-[3px] uppercase text-text-dim mb-1">
            ◆ {t('Five levels of riding', 'Пять уровней наездника', 'Пʼять рівнів вершника')}
          </p>
          <p className="text-[13px] text-text-secondary italic mb-5 max-w-2xl">
            {t(
              'Five rungs from "open a chat" to "the dragon flies a formation while you watch". Each one unlocks a specific move you couldn\'t do before.',
              'Пять ступеней - от «открыл чат» до «дракон ведёт строй пока ты смотришь». Каждая открывает конкретный ход, который раньше был недоступен.',
              'Пʼять щаблів - від «відкрив чат» до «дракон веде стрій, поки ти дивишся». Кожен відкриває конкретний хід, який раніше був недоступний.'
            )}
          </p>

          <div className="relative">
            {/* Vertical connector line that runs down the left */}
            <div className="absolute left-[18px] top-3 bottom-3 w-px bg-gradient-to-b from-qa-teal/20 via-qa-teal/40 to-qa-teal" aria-hidden="true" />

            <div className="space-y-3">
              {[
                {
                  lvl: '01',
                  name: t('Chat', 'Чат', 'Чат'),
                  tagline: t('You just ask questions.', 'Просто задаёшь вопросы.', 'Просто ставиш запитання.'),
                  move: t('You: "How do I write a test for this function?" - Claude explains. You copy-paste the code back to your IDE yourself.', 'Ты: «как мне написать тест для этой функции?» - Claude объясняет. Код в IDE копируешь руками.', 'Ти: «як написати тест для цієї функції?» - Claude пояснює. Код в IDE копіюєш руками.'),
                  intensity: 0.4,
                },
                {
                  lvl: '02',
                  name: t('Configured', 'Настроенный', 'Налаштований'),
                  tagline: t('CLAUDE.md holds your voice, conventions, the things you refuse to compromise on.', 'CLAUDE.md держит твой голос, конвенции, и то на чём ты не уступишь.', 'CLAUDE.md тримає твій голос, конвенції, і те на чому не поступишся.'),
                  move: t('Claude opens with "Right, what are we testing today?" instead of "Hi, how can I help?". Knows you prefer table-format test cases. Never opens with "great question!".', 'Claude открывает диалог с «так, что тестируем сегодня?» вместо «привет, чем помочь?». Знает что ты любишь test-cases таблицей. Никогда не начинает с «отличный вопрос!».', 'Claude відкриває діалог з «так, що тестуємо сьогодні?» замість «привіт, чим допомогти?». Знає що ти любиш test-cases таблицею. Ніколи не починає з «чудове питання!».'),
                  intensity: 0.55,
                },
                {
                  lvl: '03',
                  name: t('Commanded', 'Командир', 'Командувач'),
                  tagline: t('Your own /slash commands - frequent tasks compressed to one tap.', 'Свои /slash-команды - частые задачи сжаты в один тык.', 'Власні /slash-команди - часті задачі стиснуті в один клік.'),
                  move: t('/test-cases generates a full table from a feature spec. /bug-report turns a Slack screenshot into a Linear-ready ticket. /review pulls the diff and gives you the bug list before the PR opens.', '/test-cases генерит полную таблицу из описания фичи. /bug-report превращает скрин из Slack в готовый Linear-тикет. /review подтягивает diff и выдаёт список багов до открытия PR.', '/test-cases генерує повну таблицю з опису фічі. /bug-report перетворює скріншот зі Slack в готовий Linear-тикет. /review підтягує diff і видає список багів до відкриття PR.'),
                  intensity: 0.7,
                },
                {
                  lvl: '04',
                  name: t('Connected', 'Связанный', 'Звʼязаний'),
                  tagline: t('MCP servers give it eyes and hands — browser, APIs, live docs, your Notion, your Jira.', 'MCP-серверы дают глаза и руки - браузер, API, актуальные доки, твой Notion, твоя Jira.', 'MCP-сервери дають очі та руки - браузер, API, актуальні доки, твій Notion, твоя Jira.'),
                  move: t('You: "Test the registration form - empty fields, weird emails, password \'1\'". Claude opens the browser via Playwright MCP, drives the form, takes screenshots, files bugs in Jira with steps. You watch.', 'Ты: «протестируй форму регистрации - пустые поля, странные email, пароль "1"». Claude открывает браузер через Playwright MCP, ведёт форму, делает скриншоты, заводит баги в Jira со степами. Ты смотришь.', 'Ти: «протестуй форму реєстрації - порожні поля, дивні email, пароль "1"». Claude відкриває браузер через Playwright MCP, веде форму, робить скриншоти, заводить баги в Jira зі степами. Ти дивишся.'),
                  intensity: 0.85,
                },
                {
                  lvl: '05',
                  name: t('Orchestrated', 'Оркестратор', 'Диригент'),
                  tagline: t('Several sub-agents run in parallel. You set the strategy. They split the work.', 'Несколько sub-agents работают параллельно. Ты задаёшь стратегию. Они делят работу.', 'Кілька sub-agents працюють паралельно. Ти задаєш стратегію. Вони ділять роботу.'),
                  move: t('You: "Cover this release - one agent on regression, one on integration, one on accessibility." Three agents split the task in their own sandboxes, run in parallel, each comes back with a report. You read three summaries instead of running three test passes.', 'Ты: «закрой релиз - один agent на регрессию, один на интеграцию, один на accessibility». Три агента делят задачу в своих sandbox-ах, идут параллельно, каждый возвращает отчёт. Ты читаешь три summary вместо того чтобы прогонять три прохода руками.', 'Ти: «закрий реліз - один agent на регресію, один на інтеграцію, один на accessibility». Три агенти ділять задачу у своїх sandbox-ах, ідуть паралельно, кожен повертає звіт. Ти читаєш три summary замість того щоб ганяти три проходи руками.'),
                  intensity: 1.0,
                },
              ].map(l => (
                <div
                  key={l.lvl}
                  className="relative pl-12 pr-4 py-4 border border-border bg-surface/30 hover:border-qa-teal/30 transition-colors"
                  style={{ borderLeftWidth: '3px', borderLeftColor: `rgba(0,229,204,${0.15 + l.intensity * 0.7})` }}
                >
                  {/* Big numeral overlapping the connector line */}
                  <div
                    className="absolute left-0 top-3 w-[36px] h-[36px] flex items-center justify-center bg-bg border border-qa-teal/30"
                    style={{ borderColor: `rgba(0,229,204,${0.25 + l.intensity * 0.5})` }}
                  >
                    <span
                      className="font-display italic text-[18px] leading-none"
                      style={{ color: `rgba(0,229,204,${0.55 + l.intensity * 0.45})` }}
                    >
                      {l.lvl}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-3 flex-wrap mb-1.5">
                    <span className="font-display italic text-[22px] text-white">{l.name}</span>
                    <span className="font-display italic text-[14px] text-text-secondary leading-tight">
                      {l.tagline}
                    </span>
                  </div>

                  <div className="border-l border-qa-teal/20 pl-3 ml-0">
                    <p className="font-mono text-[9.5px] tracking-[2px] uppercase text-qa-teal/70 mb-1">
                      {t('what unlocks', 'что открывается', 'що відкривається')}
                    </p>
                    <p className="text-[13px] text-text-body leading-relaxed">
                      {l.move}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 border-l-2 border-qa-teal/40 bg-qa-teal/[0.04] pl-4 py-3">
            <p className="text-[13px] text-text-body leading-relaxed">
              <span className="font-mono text-[10px] tracking-[2px] uppercase text-qa-teal mr-2">today</span>
              {t(
                'You leave at level 2-3 minimum. CLAUDE.md sealed, slash commands installed, MCP servers wired. Level 4-5 grows in over a month of daily work — once the bond is real, the dragon stops needing instructions.',
                'Выходишь со 2-3 уровня минимум. CLAUDE.md запечатан, slash-команды стоят, MCP-серверы подключены. 4-5 уровень прорастает за месяц ежедневной работы - когда связь становится настоящей, дракон перестаёт нуждаться в инструкциях.',
                'Виходиш мінімум з 2-3 рівня. CLAUDE.md запечатано, slash-команди стоять, MCP-сервери підключено. 4-5 рівень проростає за місяць щоденної роботи - коли звʼязок стає справжнім, дракон перестає потребувати інструкцій.'
              )}
            </p>
          </div>
        </div>

      </div>
    </PageShell>
  )
}
