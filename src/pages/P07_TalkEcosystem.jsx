import PageShell from '../core/PageShell'

const ITEMS = [
  { category: 'Команды', color: '#00E5CC', items: [
    { name: '/bug-report', desc: 'Из описания → профессиональный отчёт' },
    { name: '/test-cases', desc: 'Из фичи → 15-25 тест-кейсов' },
    { name: '/review', desc: 'Ревью кода глазами QA' },
    { name: '/checklist', desc: 'Чеклист перед релизом' },
    { name: '/api-test', desc: 'API-тестирование с cURL' },
    { name: '/regression', desc: 'Анализ изменений → что тестировать' },
    { name: '/analyze-log', desc: 'Разбор ошибок простыми словами' },
  ]},
  { category: 'Агенты', color: '#E85D26', items: [
    { name: 'qa-reviewer', desc: 'Ревьюит PR с точки зрения QA' },
    { name: 'test-generator', desc: 'Генерирует тесты для модуля' },
    { name: 'security-scanner', desc: 'Ищет уязвимости в коде' },
    { name: 'bug-triager', desc: 'Оценивает и приоритизирует баги' },
  ]},
  { category: 'MCP серверы', color: '#FF65BE', items: [
    { name: 'Playwright', desc: 'AI открывает браузер и тестирует' },
    { name: 'Fetch', desc: 'AI отправляет HTTP-запросы' },
    { name: 'Context7', desc: 'AI получает свежую документацию' },
  ]},
]

export default function P07_TalkEcosystem() {
  return (
    <PageShell pageIndex={8}>
      <div className="space-y-6">
        {ITEMS.map(cat => (
          <div key={cat.category} className="border border-[#2E2E2E] rounded-lg overflow-hidden">
            <div className="p-4 border-b border-[#2E2E2E] bg-[#141414]">
              <div className="flex items-center gap-3">
                <span className="font-display text-[20px] font-semibold" style={{ color: cat.color }}>{cat.category}</span>
                <span className="font-mono text-[14px] text-text-dim">{cat.items.length}</span>
              </div>
            </div>
            <div className="divide-y divide-[#1E1E1E]">
              {cat.items.map(item => (
                <div key={item.name} className="flex items-center gap-4 px-4 py-3">
                  <code className="font-mono text-[16px] shrink-0 min-w-[140px]" style={{ color: cat.color }}>{item.name}</code>
                  <span className="text-[16px] text-text-secondary">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  )
}
