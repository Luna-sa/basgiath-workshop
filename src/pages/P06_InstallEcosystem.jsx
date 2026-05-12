import { useState } from 'react'
import { useWorkshopStore } from '../store/workshopStore'
import { usePersona } from '../store/usePersona'
import { generateEcosystemPrompt, CURSOR_ECOSYSTEM_PROMPT } from '../data/ecosystem-prompt'
import { useT } from '../i18n/useT'
import PageShell from '../core/PageShell'
import CheckpointButton from '../components/CheckpointButton'

export default function P06_InstallEcosystem() {
  const t = useT()
  const user = useWorkshopStore(s => s.user)
  const persona = usePersona()
  const [copied, setCopied] = useState(false)

  const isClaudeCode = user.tool === 'claude' || user.tool === 'both'
  const prompt = isClaudeCode ? generateEcosystemPrompt(user) : CURSOR_ECOSYSTEM_PROMPT

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  return (
    <PageShell pageIndex={14}>
      <div className="space-y-5">
        {/* What you get */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { n: '7', label_en: 'Commands', label_ru: 'Команд', label_uk: 'Команд', items: '/bug-report, /test-cases, /review...' },
            { n: '4', label_en: 'Agents', label_ru: 'Агента', label_uk: 'Агенти', items: 'qa-reviewer, test-generator...' },
            { n: '3', label_en: 'MCP', label_ru: 'MCP', label_uk: 'MCP', items: 'Playwright, Fetch, Context7' },
            { n: '1', label_en: 'CLAUDE.md', label_ru: 'CLAUDE.md', label_uk: 'CLAUDE.md',
              items_en: 'Configured for QA', items_ru: 'Настроен под QA', items_uk: 'Налаштований під QA' },
          ].map(s => (
            <div key={s.label_en} className="p-3 border border-border bg-surface/30 text-center">
              <div className="font-display text-xl text-white">{s.n}</div>
              <div className="font-mono text-[11px] text-qa-teal tracking-wider uppercase">
                {t(s.label_en, s.label_ru, s.label_uk)}
              </div>
              <div className="text-[10px] text-text-dim mt-1">
                {s.items_en ? t(s.items_en, s.items_ru, s.items_uk) : s.items}
              </div>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="space-y-2">
          <div className="flex items-start gap-3 p-3 border border-border bg-surface/30">
            <span className="font-mono text-[12px] text-qa-teal shrink-0 mt-0.5">1.</span>
            <span className="text-sm text-text-body">
              {isClaudeCode
                ? t(
                    'Open a terminal → run `claude`',
                    'Открой терминал → запусти claude',
                    'Відкрий термінал → запусти claude'
                  )
                : t(
                    'Open Cursor (Cmd+I)',
                    'Открой Cursor (Cmd+I)',
                    'Відкрий Cursor (Cmd+I)'
                  )}
            </span>
          </div>
          <div className="flex items-start gap-3 p-3 border border-border bg-surface/30">
            <span className="font-mono text-[12px] text-qa-teal shrink-0 mt-0.5">2.</span>
            <span className="text-sm text-text-body">
              {t(
                'Copy the prompt below and paste it in',
                'Скопируй промпт ниже и вставь',
                'Скопіюй промпт нижче і встав'
              )}
            </span>
          </div>
          <div className="flex items-start gap-3 p-3 border border-border bg-surface/30">
            <span className="font-mono text-[12px] text-qa-teal shrink-0 mt-0.5">3.</span>
            <span className="text-sm text-text-body">
              {t(
                'Wait 1-2 minutes - Claude lays down every file.',
                'Подожди 1-2 минуты - AI создаст все файлы',
                'Зачекай 1-2 хвилини - Claude створить усі файли.'
              )}
            </span>
          </div>
        </div>

        {/* Expected output - so participants know what success looks like */}
        <div className="border border-qa-teal/20 bg-qa-teal/[0.03] p-4">
          <div className="font-mono text-[10px] tracking-[2px] uppercase text-qa-teal mb-2">
            ◆ {t('Expected output', 'Что должно появиться', 'Що має зʼявитися')}
          </div>
          <pre className="font-mono text-[11px] text-text-body leading-relaxed whitespace-pre-wrap">{`✓ Created ~/.claude/commands/bug-report.md
✓ Created ~/.claude/commands/test-cases.md
✓ Created ~/.claude/commands/review.md
✓ Created ~/.claude/commands/checklist.md
✓ Created ~/.claude/commands/api-test.md
✓ Created ~/.claude/commands/regression.md
✓ Created ~/.claude/commands/analyze-log.md
✓ Created ~/.claude/agents/qa-reviewer.md
✓ Created ~/.claude/agents/test-generator.md
✓ Created ~/.claude/agents/security-scanner.md
✓ Created ~/.claude/agents/bug-triager.md
✓ Configured 3 MCP servers in ~/.claude/mcp_servers.json
Total: 12 files placed.`}</pre>
          <p className="text-[12px] text-text-dim italic mt-3">
            {t(
              "Errors? Don't panic - flag the facilitator. Most install issues are 30-second fixes.",
              'Ошибки? Не паникуй - позови фасилитатора. Большинство фейлов лечатся за 30 секунд.',
              'Помилки? Не панікуй - поклич фасилітатора. Більшість фейлів лікуються за 30 секунд.'
            )}
          </p>
        </div>

        {/* The prompt */}
        <div className="border border-border bg-black overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-surface/80 border-b border-border">
            <span className="font-mono text-[12px] tracking-wider" style={{ color: persona.accent }}>
              {t(
                'QA Ecosystem - one prompt',
                'QA Ecosystem - один промпт',
                'QA Ecosystem - один промпт'
              )}
            </span>
            <button onClick={handleCopy}
              className="font-mono text-[12px] tracking-wider uppercase transition-colors cursor-pointer"
              style={{ color: copied ? persona.accent : '#888' }}>
              {copied
                ? t('✓ Copied!', '✓ Скопировано!', '✓ Скопійовано!')
                : t('Copy', 'Копировать', 'Копіювати')}
            </button>
          </div>
          <pre className="p-4 overflow-x-auto max-h-[250px] overflow-y-auto">
            <code className="font-mono text-[12px] text-text-body leading-relaxed whitespace-pre-wrap break-words">{prompt}</code>
          </pre>
        </div>

        {/* Persona tip */}
        <div className="p-3 border bg-surface/30" style={{ borderColor: persona.accentBorder }}>
          <p className="text-xs text-text-secondary">
            <span className="font-mono text-[11px] uppercase" style={{ color: persona.accent }}>
              {t('Approach', 'Подход', 'Підхід')}
            </span>{' '}- {persona.approach.promptStyle}
          </p>
        </div>

        {/* Checkpoint */}
        <CheckpointButton
          id="forge"
          label={t('Mark ecosystem installed', 'Отметить: экосистема установлена', 'Позначити: екосистему встановлено')}
          helpText={t('When Claude has finished placing the files in your ~/.claude/ folder', 'Когда Claude закончил создавать файлы в твоём ~/.claude/', 'Коли Claude завершив створювати файли у твоєму ~/.claude/')}
        />
      </div>
    </PageShell>
  )
}
