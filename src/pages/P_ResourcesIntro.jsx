import { useT } from '../i18n/useT'
import PageShell from '../core/PageShell'

/**
 * Final-page intro pointing to the standalone Resource Hub at
 * /?page=resources (full-screen layout). Sits in workshop flow as
 * the last step.
 */
export default function P_ResourcesIntro() {
  const t = useT()

  return (
    <PageShell pageIndex={34}>
      <div className="space-y-6">
        {/* Ravens-with-scrolls — the "take it home" lore image.
            Right-side hero on desktop, full-width banner on mobile. */}
        <div className="grid md:grid-cols-[1fr_240px] gap-6 items-start">
          <div>
            <p className="font-mono text-[11px] tracking-[3px] uppercase text-qa-teal mb-3">
              {t('Bonded', 'Связан', 'Звʼязаний')}
            </p>
            <h2 className="font-display text-3xl text-white leading-tight mb-3">
              {t('Take it home, rider.', 'Унеси домой, всадник.', 'Забери додому, вершнице.')}
            </h2>
            <p className="text-[15px] text-text-body leading-relaxed">
              {t(
                'Every prompt, every reference, every file. Bookmark this page - your dragon waits here any day you come back.',
                'Каждый промпт, каждая справка, каждый файл. Закрепи закладкой - твой дракон ждёт тебя в любой день, когда захочешь вернуться.',
                'Кожен промпт, кожен довідник, кожен файл. Збережи закладкою - твій дракон чекає на тебе будь-якого дня, коли захочеш повернутися.'
              )}
            </p>
          </div>
          <div className="relative aspect-[9/16] max-h-[280px] mx-auto md:mx-0 overflow-hidden border border-border bg-black">
            <img
              src="/hero/resources-ravens.jpg"
              alt=""
              className="w-full h-full object-cover opacity-90"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-tl from-bg/40 via-transparent to-transparent" />
          </div>
        </div>

        <a
          href="/?page=resources"
          target="_blank"
          rel="noopener"
          className="inline-block bg-qa-teal text-black px-7 py-3 font-mono text-[12px] tracking-[3px] uppercase font-semibold hover:shadow-[0_0_24px_rgba(0,229,204,0.4)] transition-all animate-pulse-teal"
        >
          {t('Open Resource Hub →', 'Открыть хаб ресурсов →', 'Відкрити хаб ресурсів →')}
        </a>

        <div className="border border-border bg-surface/40 p-5">
          <div className="font-mono text-[10px] tracking-[2px] uppercase text-text-dim mb-3">
            ◆ {t('What\'s inside', 'Что внутри', 'Що всередині')}
          </div>
          <ul className="text-[13px] text-text-body leading-relaxed space-y-2 list-none">
            <li>◆ {t('Master setup prompt - full QA ecosystem in one go', 'Master setup промпт - вся QA-экосистема одной командой', 'Master setup промпт - уся QA-екосистема однією командою')}</li>
            <li>◆ {t('Five autopilot prompts - Setup-Doctor, Workspace-Init, MCP installer, Apply-Persona, Resume-from-error', 'Пять autopilot-промптов - Setup-Doctor, Workspace-Init, MCP installer, Apply-Persona, Resume-from-error', "Пʼять autopilot-промптів - Setup-Doctor, Workspace-Init, MCP installer, Apply-Persona, Resume-from-error")}</li>
            <li>◆ {t('Hidden Gems - 22 power-user features', 'Hidden Gems - 22 продвинутых фишки Claude Code', 'Hidden Gems - 22 просунуті фішки Claude Code')}</li>
            <li>◆ {t('Quick Reference - slash commands + hotkeys', 'Quick Reference - слэш-команды + хоткеи', 'Quick Reference - слеш-команди + гарячі клавіші')}</li>
            <li>◆ {t('Sample QA project - for at-home practice', 'Sample QA project - для практики дома', 'Sample QA project - для практики вдома')}</li>
          </ul>
        </div>
      </div>
    </PageShell>
  )
}
