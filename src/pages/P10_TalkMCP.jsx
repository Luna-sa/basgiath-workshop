import { useT } from '../i18n/useT'
import PageShell from '../core/PageShell'

const SERVERS = [
  {
    emoji: '🌐', name: 'Playwright',
    what_en: 'AI gets a browser',
    what_ru: 'AI получает браузер',
    what_uk: 'AI отримує браузер',
    details_en: 'Opens sites, clicks, fills forms, takes screenshots - without a single line of code.',
    details_ru: 'Открывает сайты, кликает, заполняет формы, делает скриншоты - без единой строки кода',
    details_uk: 'Відкриває сайти, клікає, заповнює форми, робить скріншоти - без жодного рядка коду.',
    wow_en: '"Open the site and test registration - empty fields, invalid email, password \'1\'"',
    wow_ru: '«Открой сайт и протестируй регистрацию - пустые поля, невалидный email, пароль 1»',
    wow_uk: '«Відкрий сайт і протестуй реєстрацію - порожні поля, невалідний email, пароль 1»',
  },
  {
    emoji: '🔌', name: 'Fetch',
    what_en: 'AI sends HTTP requests',
    what_ru: 'AI отправляет HTTP-запросы',
    what_uk: 'AI надсилає HTTP-запити',
    details_en: 'GET, POST, PUT, DELETE against any API. Checks status codes, response bodies, timing.',
    details_ru: 'GET, POST, PUT, DELETE на любой API. Проверяет статус-коды, тело ответа, время',
    details_uk: 'GET, POST, PUT, DELETE на будь-який API. Перевіряє статус-коди, тіло відповіді, час.',
    wow_en: '"Test every endpoint - valid + invalid payloads, check 400/401/404"',
    wow_ru: '«Протестируй все эндпоинты: валидные и невалидные данные, проверь 400/401/404»',
    wow_uk: '«Протестуй усі ендпоінти - валідні та невалідні дані, перевір 400/401/404»',
  },
  {
    emoji: '📚', name: 'Context7',
    what_en: 'AI knows the current docs',
    what_ru: 'AI знает актуальную документацию',
    what_uk: 'AI знає актуальну документацію',
    details_en: 'Fresh docs for any library - Playwright, Jest, React - instead of training-data stale knowledge.',
    details_ru: 'Вместо устаревших знаний - свежие доки любой библиотеки. Playwright, Jest, React...',
    details_uk: 'Замість застарілих знань - свіжі доки будь-якої бібліотеки. Playwright, Jest, React...',
    wow_en: '"Write Playwright tests using only the current API, no deprecated calls"',
    wow_ru: '«Напиши Playwright тесты используя только актуальный API, не deprecated»',
    wow_uk: '«Напиши Playwright-тести, використовуючи лише актуальний API, без deprecated»',
  },
]

export default function P10_TalkMCP() {
  const t = useT()
  return (
    <PageShell pageIndex={16}>
      <div className="space-y-5">
        {/* MCP trinity — labelled diagram for the three servers we
            install today: PLAYWRIGHT · browser, CONTEXT7 · docs,
            FETCH · http. Picture stands on its own; the message
            quote sits as a separate block below. */}
        <figure className="relative -mt-2 overflow-hidden border border-[#2E2E2E] rounded-lg bg-black">
          <img
            src="/hero/mcp-trinity.jpg"
            alt="MCP trinity — Playwright (browser), Context7 (docs), Fetch (http)"
            className="w-full h-auto block"
            loading="eager"
          />
        </figure>

        <div className="border-l-2 border-qa-teal pl-5 py-1 max-w-3xl">
          <p className="font-display italic text-[clamp(20px,2.4vw,26px)] text-white leading-tight">
            {t(
              <>Without MCP - AI <span className="text-text-dim not-italic">only answers</span>. With MCP - AI <strong className="text-white">acts</strong>.</>,
              <>Без MCP - AI <span className="text-text-dim not-italic">только отвечает</span>. С MCP - AI <strong className="text-white">действует</strong>.</>,
              <>Без MCP - AI <span className="text-text-dim not-italic">тільки відповідає</span>. З MCP - AI <strong className="text-white">діє</strong>.</>
            )}
          </p>
        </div>

        {/* Wiring diagram + config file */}
        <div className="border border-border bg-surface/30 p-4">
          <div className="font-mono text-[10px] tracking-[2px] uppercase text-text-dim mb-3">
            ◆ {t('How it actually wires', 'Как это собрано', 'Як це зібрано')}
          </div>
          <pre className="font-mono text-[12px] text-qa-teal leading-relaxed mb-3">{`Claude  ───▶  MCP server  ───▶  Real tool / service
              (process)         (browser, API, file, DB…)`}</pre>
          <p className="text-[12.5px] text-text-body leading-relaxed">
            {t(
              <>Config lives at <code className="text-qa-teal font-mono text-[12px]">~/.claude/mcp_servers.json</code>. We show three core ones today - over 100 exist (GitHub, filesystem, Jira, Slack, your-internal-API).</>,
              <>Конфиг в <code className="text-qa-teal font-mono text-[12px]">~/.claude/mcp_servers.json</code>. Сегодня покажем три ключевых - всего их 100+ (GitHub, filesystem, Jira, Slack, твой внутренний API).</>,
              <>Конфіг у <code className="text-qa-teal font-mono text-[12px]">~/.claude/mcp_servers.json</code>. Сьогодні покажемо три ключових - усього їх 100+ (GitHub, filesystem, Jira, Slack, твій внутрішній API).</>
            )}
          </p>
        </div>

        {/* Server cards */}
        {SERVERS.map(s => (
          <div key={s.name} className="border border-[#2E2E2E] bg-[#141414] rounded-lg overflow-hidden hover:border-qa-teal/20 hover:shadow-[0_0_15px_rgba(0,229,204,0.05)] transition-all">
            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{s.emoji}</span>
                <div>
                  <div className="font-display text-[22px] text-white">{s.name}</div>
                  <div className="text-[15px] text-text-secondary">{t(s.what_en, s.what_ru, s.what_uk)}</div>
                </div>
              </div>
              <p className="text-[16px] text-text-body leading-relaxed mb-3">{t(s.details_en, s.details_ru, s.details_uk)}</p>
            </div>
            <div className="px-5 py-3 bg-black/40 border-t border-[#1E1E1E]">
              <div className="font-mono text-[11px] text-text-dim uppercase tracking-wider mb-1">
                {t('Sample prompt', 'Пример промпта', 'Приклад промпта')}
              </div>
              <code className="font-mono text-[15px] text-qa-teal italic">{t(s.wow_en, s.wow_ru, s.wow_uk)}</code>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  )
}
