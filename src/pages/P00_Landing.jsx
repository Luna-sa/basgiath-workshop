import { useT } from '../i18n/useT'
import PageShell from '../core/PageShell'

export default function P00_Landing() {
  const t = useT()

  return (
    <PageShell pageIndex={0}>
      <div className="space-y-8">
        {/* World intro */}
        <div className="p-6 border border-[#2E2E2E] bg-[#141414] rounded-lg">
          <div className="font-mono text-[13px] tracking-[3px] uppercase text-qa-teal mb-4">
            {t('Welcome', 'О мире')}
          </div>
          <p className="text-[18px] text-text-body leading-relaxed mb-3">
            {t(
              <>This is a <strong className="text-white">Claude Code workshop for QA</strong>. We set up Claude Code together, build a personal AI partner with a real character, and run real tasks until everything clicks.</>,
              <>Это <strong className="text-white">воркшоп по Claude Code для QA</strong>. Настроим Claude Code вместе, соберём персонального AI-напарника с настоящим характером и пройдём через реальные задачи пока всё не сядет.</>
            )}
          </p>
          <p className="text-[18px] text-text-body leading-relaxed mb-3">
            {t(
              <>The frame is <strong className="text-white">Basgiath Academy</strong>. Like the dragon-rider academy from Fourth Wing, we have characters, squads and a Parapet to cross. The lore is the wrapper. The work underneath is real QA.</>,
              <>Обёртка - <strong className="text-white">Академия Басгиат</strong>. Как у наездников из «Четвёртого Крыла»: персонажи, отряды, Парапет который нужно пройти. Лор - это обёртка. Внутри настоящая QA-работа.</>
            )}
          </p>
          <p className="text-[16px] text-text-secondary italic">
            {t(
              'Today, AI is your dragon. You\'ll set up the full QA ecosystem and learn to fly with it.',
              'Сегодня AI - твой дракон. Настроишь полную QA-экосистему и научишься на ней летать.'
            )}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 sm:gap-12">
          {[
            { value: '7', label_en: 'Commands', label_ru: 'Команд' },
            { value: '4', label_en: 'Agents', label_ru: 'Агента' },
            { value: '3', label_en: 'MCP', label_ru: 'MCP' },
            { value: '60', unit: 'min', label_en: 'Workshop', label_ru: 'Воркшоп' },
          ].map(s => (
            <div key={s.label_en} className="text-center">
              <div className="font-display text-3xl sm:text-4xl text-white">
                {s.value}<span className="text-text-dim text-lg">{s.unit ? t(s.unit, 'мин') : ''}</span>
              </div>
              <div className="font-mono text-[13px] text-text-dim tracking-[2px] uppercase mt-1">
                {t(s.label_en, s.label_ru)}
              </div>
            </div>
          ))}
        </div>

        {/* What you get */}
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              icon: '🐉',
              title_en: 'QA ecosystem',
              title_ru: 'QA-экосистема',
              desc_en: 'CLAUDE.md + 7 commands + 4 agents - one prompt installs it all',
              desc_ru: 'CLAUDE.md + 7 команд + 4 агента - одной командой',
            },
            {
              icon: '🌐',
              title_en: 'MCP superpower',
              title_ru: 'MCP суперсила',
              desc_en: 'AI tests sites, hits APIs, reads docs - hands-on for you',
              desc_ru: 'AI сам тестирует сайт, API и читает документацию',
            },
            {
              icon: '🎯',
              title_en: 'Real bugs',
              title_ru: 'Практика на багах',
              desc_en: 'Test app with 36 planted defects + AI review',
              desc_ru: 'Тестовое приложение с 36 дефектами + AI-ревью',
            },
            {
              icon: '🏆',
              title_en: 'Live competition',
              title_ru: 'Соревнование',
              desc_en: 'Timers, points, leaderboard, podium for the winners',
              desc_ru: 'Таймеры, очки, лидерборд, подиум победителей',
            },
          ].map(a => (
            <div key={a.title_en} className="p-5 border border-[#2E2E2E] bg-[#141414] rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{a.icon}</span>
                <h3 className="font-display text-[18px] text-white">{t(a.title_en, a.title_ru)}</h3>
              </div>
              <p className="text-[15px] text-text-secondary leading-relaxed">{t(a.desc_en, a.desc_ru)}</p>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  )
}
