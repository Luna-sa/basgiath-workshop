import PageShell from '../core/PageShell'

const SERVERS = [
  {
    emoji: '🌐', name: 'Playwright',
    what: 'AI получает браузер',
    details: 'Открывает сайты, кликает, заполняет формы, делает скриншоты — без единой строки кода',
    wow: '«Открой сайт и протестируй регистрацию — пустые поля, невалидный email, пароль 1»',
  },
  {
    emoji: '🔌', name: 'Fetch',
    what: 'AI отправляет HTTP-запросы',
    details: 'GET, POST, PUT, DELETE на любой API. Проверяет статус-коды, тело ответа, время',
    wow: '«Протестируй все эндпоинты: валидные и невалидные данные, проверь 400/401/404»',
  },
  {
    emoji: '📚', name: 'Context7',
    what: 'AI знает актуальную документацию',
    details: 'Вместо устаревших знаний — свежие доки любой библиотеки. Playwright, Jest, React...',
    wow: '«Напиши Playwright тесты используя только актуальный API, не deprecated»',
  },
]

export default function P10_TalkMCP() {
  return (
    <PageShell pageIndex={11}>
      <div className="space-y-5">
        {/* Core message */}
        <div className="p-6 border border-[#2E2E2E] bg-[#141414] rounded-lg text-center">
          <p className="text-[20px] text-text-body leading-relaxed">
            Без MCP — AI <span className="text-text-dim">только отвечает</span>.
            <br />С MCP — AI <strong className="text-white">действует</strong>.
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
                  <div className="text-[15px] text-text-secondary">{s.what}</div>
                </div>
              </div>
              <p className="text-[16px] text-text-body leading-relaxed mb-3">{s.details}</p>
            </div>
            <div className="px-5 py-3 bg-black/40 border-t border-[#1E1E1E]">
              <div className="font-mono text-[11px] text-text-dim uppercase tracking-wider mb-1">Пример промпта</div>
              <code className="font-mono text-[15px] text-qa-teal italic">{s.wow}</code>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  )
}
