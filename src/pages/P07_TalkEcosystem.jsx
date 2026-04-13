import PageShell from '../core/PageShell'

const ITEMS = [
  { category: 'Команды', color: 'text-qa-teal', items: [
    { name: '/bug-report', desc: 'Из описания → профессиональный отчёт' },
    { name: '/test-cases', desc: 'Из фичи → 15-25 тест-кейсов' },
    { name: '/review', desc: 'Ревью кода глазами QA' },
    { name: '/checklist', desc: 'Чеклист перед релизом' },
    { name: '/api-test', desc: 'Сценарии API-тестирования' },
    { name: '/regression', desc: 'Регрессионный анализ изменений' },
    { name: '/analyze-log', desc: 'Разбор ошибок и стектрейсов' },
  ]},
  { category: 'Агенты', color: 'text-ember', items: [
    { name: 'qa-reviewer', desc: 'Ревьюит PR с точки зрения QA' },
    { name: 'test-generator', desc: 'Генерирует тест-сьют для модуля' },
    { name: 'security-scanner', desc: 'Ищет уязвимости в коде' },
    { name: 'bug-triager', desc: 'Анализирует и приоритизирует баги' },
  ]},
  { category: 'MCP серверы', color: 'text-personal-pink', items: [
    { name: 'Playwright', desc: 'AI открывает браузер, кликает, тестирует' },
    { name: 'Fetch', desc: 'AI отправляет HTTP-запросы к API' },
    { name: 'Context7', desc: 'AI получает актуальную документацию' },
  ]},
]

export default function P07_TalkEcosystem() {
  return (
    <PageShell pageIndex={7}>
      <div className="space-y-4">
        {ITEMS.map(cat => (
          <div key={cat.category} className="border border-border">
            <div className="p-3 border-b border-border bg-surface/50">
              <span className={`font-mono text-[12px] tracking-[2px] uppercase ${cat.color}`}>{cat.category}</span>
              <span className="font-mono text-[11px] text-text-dim ml-2">({cat.items.length})</span>
            </div>
            <div className="divide-y divide-border/50">
              {cat.items.map(item => (
                <div key={item.name} className="flex gap-3 px-3 py-2">
                  <code className={`font-mono text-[12px] shrink-0 ${cat.color}`}>{item.name}</code>
                  <span className="text-xs text-text-secondary">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  )
}
