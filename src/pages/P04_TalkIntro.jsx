import PageShell from '../core/PageShell'
import { useT } from '../i18n/useT'

export default function P04_TalkIntro() {
  const t = useT()
  return (
    <PageShell pageIndex={4}>
      <div className="space-y-8">

        {/* Hook */}
        <div className="text-center">
          <p className="font-display italic text-[clamp(20px,2.6vw,26px)] text-text-secondary leading-relaxed max-w-3xl mx-auto">
            {t(
              "ChatGPT is a window. Claude Code is a worker who lives inside your project.",
              "ChatGPT — это окно. Claude Code — это рабочий, который живёт в твоём проекте.",
              "ChatGPT — це вікно. Claude Code — це працівник, який живе у твоєму проєкті."
            )}
          </p>
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
              <li>◇ {t('Every session — from scratch', 'Каждая сессия — с нуля', 'Кожна сесія — з нуля')}</li>
              <li>◇ {t("Can't open a file, run a test, make a commit", 'Не может открыть файл, запустить тест, сделать commit', 'Не може відкрити файл, запустити тест, зробити commit')}</li>
              <li>◇ {t("Doesn't remember yesterday's conversation", 'Не помнит вчерашнее обсуждение', 'Не памʼятає вчорашнє обговорення')}</li>
            </ul>
          </div>

          <div className="p-5 border border-qa-teal/30 border-l-[3px] border-l-qa-teal bg-qa-teal/[0.04]">
            <div className="font-mono text-[11px] tracking-[3px] uppercase text-qa-teal mb-3">
              {t('Claude Code — bonded partner', 'Claude Code — bonded напарник', 'Claude Code — bonded напарник')}
            </div>
            <ul className="space-y-2 text-[14px] text-text-body">
              <li>✓ {t('Reads and writes files straight in the repo', 'Читает и пишет файлы прямо в репо', 'Читає й пише файли прямо в репо')}</li>
              <li>✓ {t('Knows your project — constitution in CLAUDE.md', 'Знает твой проект — конституция в CLAUDE.md', 'Знає твій проєкт — конституція у CLAUDE.md')}</li>
              <li>✓ {t('Runs commands, tests, MCP servers', 'Запускает команды, тесты, MCP-серверы', 'Запускає команди, тести, MCP-сервери')}</li>
              <li>✓ {t('Remembers how to work with you — your voice, your rules', 'Помнит как с тобой работать — твой голос, твои правила', 'Памʼятає, як з тобою працювати — твій голос, твої правила')}</li>
              <li>✓ {t('Slash commands, agents, hooks — like muscles', 'Слэш-команды, агенты, hooks — как мускулы', 'Слеш-команди, агенти, hooks — як мʼязи')}</li>
            </ul>
          </div>
        </div>

        {/* Five levels of bonding */}
        <div>
          <p className="font-mono text-[11px] tracking-[3px] uppercase text-text-dim mb-4">
            ◆ {t('Five levels of riding', 'Пять уровней наездника', 'Пʼять рівнів вершника')}
          </p>
          <div className="space-y-2">
            {[
              { lvl: '01', name: t('Chat', 'Чат', 'Чат'), desc: t('You just ask questions. Everyone starts here.', 'Просто задаёшь вопросы. Это все начинают тут.', 'Просто ставиш запитання. Тут починають усі.') },
              { lvl: '02', name: t('Configured', 'Настроенный', 'Налаштований'), desc: t('CLAUDE.md describes who you are and how to work with you.', 'CLAUDE.md описывает кто ты и как с тобой работать.', 'CLAUDE.md описує, хто ти і як з тобою працювати.') },
              { lvl: '03', name: t('Commanded', 'Командир', 'Командувач'), desc: t('Your own slash commands — frequent tasks in one tap.', 'Свои slash-команды — частые задачи в один тык.', 'Власні slash-команди — часті задачі в один клік.') },
              { lvl: '04', name: t('Connected', 'Связанный', 'Звʼязаний'), desc: t('MCP servers give it eyes and hands — browser, API, docs.', 'MCP-серверы дают глаза и руки — браузер, API, докум.', 'MCP-сервери дають очі та руки — браузер, API, документація.') },
              { lvl: '05', name: t('Orchestrated', 'Оркестратор', 'Диригент'), desc: t('Several agents work in parallel on a task.', 'Несколько agents работают параллельно над задачей.', 'Кілька agents працюють паралельно над задачею.') },
            ].map(l => (
              <div key={l.lvl} className="flex items-baseline gap-4 p-3 border border-border bg-surface/30">
                <span className="font-mono text-[11px] tracking-[2px] text-qa-teal w-8">{l.lvl}</span>
                <span className="font-display italic text-lg text-white w-32">{l.name}</span>
                <span className="text-[13px] text-text-secondary flex-1">{l.desc}</span>
              </div>
            ))}
          </div>
          <p className="text-[12px] text-text-dim italic mt-3">
            {t(
              'Today you leave at level 2-3 minimum. After a month of practice — 4-5.',
              'Сегодня — выходишь со 2-3-го уровня минимум. Через месяц практики — 4-5.',
              'Сьогодні — виходиш мінімум з 2-3 рівня. Через місяць практики — 4-5.'
            )}
          </p>
        </div>

      </div>
    </PageShell>
  )
}
