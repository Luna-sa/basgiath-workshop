import PageShell from '../core/PageShell'

const SERVERS = [
  { emoji: '🌐', name: 'Playwright', what: 'AI получает браузер — открывает сайты, кликает, заполняет формы, делает скриншоты', wow: '«Открой сайт и протестируй регистрацию — пустые поля, невалидный email, пароль 1»' },
  { emoji: '🔌', name: 'Fetch', what: 'AI отправляет HTTP-запросы — GET, POST, PUT, DELETE на любой API', wow: '«Протестируй все эндпоинты: валидные и невалидные данные, проверь статус-коды»' },
  { emoji: '📚', name: 'Context7', what: 'AI получает актуальную документацию вместо устаревших знаний', wow: '«Напиши Playwright тесты используя только актуальный API»' },
]

export default function P10_TalkMCP() {
  return (
    <PageShell pageIndex={10}>
      <div className="space-y-4">
        <div className="p-4 border border-border border-l-[3px] border-l-qa-teal bg-qa-teal/[0.03]">
          <p className="text-sm text-text-body">
            Без MCP — AI только отвечает на вопросы. С MCP — <strong className="text-white">открывает браузер</strong>, <strong className="text-white">тестирует API</strong>, <strong className="text-white">читает документацию</strong>. Это уже установлено в вашей экосистеме.
          </p>
        </div>

        {SERVERS.map(s => (
          <div key={s.name} className="p-4 border border-border bg-surface/30">
            <div className="flex items-start gap-3">
              <span className="text-xl shrink-0">{s.emoji}</span>
              <div>
                <div className="font-display text-[15px] text-white mb-1">{s.name}</div>
                <p className="text-sm text-text-body mb-2">{s.what}</p>
                <div className="p-2 bg-black/50 border border-border">
                  <p className="text-xs text-qa-teal font-mono italic">{s.wow}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  )
}
