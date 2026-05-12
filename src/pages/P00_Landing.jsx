import { useT } from '../i18n/useT'
import PageShell from '../core/PageShell'

export default function P00_Landing() {
  const t = useT()

  return (
    <PageShell pageIndex={0}>
      {/* Castle background — full-screen behind ALL content. Fixed
          position so it stays put while content scrolls. Content
          panels below use opaque bg-[#0a0a0a]/95 + backdrop-blur so
          their text never competes with the image underneath. */}
      <div
        className="fixed inset-0 pointer-events-none -z-10"
        aria-hidden="true"
      >
        <img
          src="/hero/landing-castle.jpg"
          alt=""
          className="w-full h-full object-cover opacity-40"
          loading="eager"
        />
        {/* Soft vignette + bottom fade so cards near the bottom of
            the screen don't fight the brightest part of the sky. */}
        <div className="absolute inset-0 bg-gradient-to-b from-bg/30 via-bg/50 to-bg/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
      </div>

      <div className="space-y-8 relative">
        {/* World intro */}
        <div className="relative p-6 border border-[#2E2E2E] bg-[#0a0a0a]/95 backdrop-blur-md rounded-lg">
          <div className="font-mono text-[13px] tracking-[3px] uppercase text-qa-teal mb-4">
            {t('Welcome', 'О мире', 'Про світ')}
          </div>
          <p className="text-[18px] text-text-body leading-relaxed mb-3">
            {t(
              <>This is a <strong className="text-white">Claude Code workshop for QA</strong>. We set up Claude Code together, build a personal AI partner with a real character, and run real tasks until everything clicks.</>,
              <>Это <strong className="text-white">воркшоп по Claude Code для QA</strong>. Настроим Claude Code вместе, соберём персонального AI-напарника с настоящим характером и пройдём через реальные задачи пока всё не сядет.</>,
              <>Це <strong className="text-white">воркшоп із Claude Code для QA</strong>. Разом налаштуємо Claude Code, зберемо персонального AI-напарника зі справжнім характером і пройдемо справжні задачі - доки все не складеться.</>
            )}
          </p>
          <p className="text-[18px] text-text-body leading-relaxed mb-3">
            {t(
              <>The frame is <strong className="text-white">Basgiath Academy</strong>. Like the dragon-rider academy from Fourth Wing, we have characters, squads and a Parapet to cross. The lore is the wrapper. The work underneath is real QA.</>,
              <>Обёртка - <strong className="text-white">Академия Басгиат</strong>. Как у наездников из «Четвёртого Крыла»: персонажи, отряды, Парапет который нужно пройти. Лор - это обёртка. Внутри настоящая QA-работа.</>,
              <>Обгортка - <strong className="text-white">Академія Басгіат</strong>. Як у вершників із «Четвертого Крила»: персонажі, загони, Парапет, який треба пройти. Лор - це обгортка. Усередині справжня QA-робота.</>
            )}
          </p>
          <p className="text-[16px] text-text-secondary italic">
            {t(
              'Today, AI is your dragon. You\'ll set up the full QA ecosystem and learn to fly with it.',
              'Сегодня AI - твой дракон. Настроишь полную QA-экосистему и научишься на ней летать.',
              'Сьогодні AI - твій дракон. Налаштуєш повну QA-екосистему і навчишся на ній літати.'
            )}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 sm:gap-12">
          {[
            { value: '7', label_en: 'Commands', label_ru: 'Команд', label_uk: 'Команд' },
            { value: '4', label_en: 'Agents', label_ru: 'Агента', label_uk: 'Агенти' },
            { value: '3', label_en: 'MCP', label_ru: 'MCP', label_uk: 'MCP' },
            { value: '4', unit: 'h', label_en: 'Workshop', label_ru: 'Воркшоп', label_uk: 'Воркшоп' },
          ].map(s => (
            <div key={s.label_en} className="text-center">
              <div className="font-display text-3xl sm:text-4xl text-white">
                {s.value}<span className="text-text-dim text-lg">{s.unit === 'h' ? t('h', 'ч', 'год') : s.unit === 'min' ? t('min', 'мин', 'хв') : ''}</span>
              </div>
              <div className="font-mono text-[13px] text-text-dim tracking-[2px] uppercase mt-1">
                {t(s.label_en, s.label_ru, s.label_uk)}
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
              title_uk: 'QA-екосистема',
              desc_en: 'CLAUDE.md + 7 commands + 4 agents - one prompt installs it all',
              desc_ru: 'CLAUDE.md + 7 команд + 4 агента - одной командой',
              desc_uk: 'CLAUDE.md + 7 команд + 4 агенти - однією командою',
            },
            {
              icon: '🌐',
              title_en: 'MCP superpower',
              title_ru: 'MCP суперсила',
              title_uk: 'MCP суперсила',
              desc_en: 'AI tests sites, hits APIs, reads docs - hands-on for you',
              desc_ru: 'AI сам тестирует сайт, API и читает документацию',
              desc_uk: 'AI сам тестує сайт, API та читає документацію',
            },
            {
              icon: '🎯',
              title_en: 'Real bugs',
              title_ru: 'Практика на багах',
              title_uk: 'Практика на багах',
              desc_en: 'Test app with 36 planted defects + AI review',
              desc_ru: 'Тестовое приложение с 36 дефектами + AI-ревью',
              desc_uk: 'Тестовий застосунок з 36 дефектами + AI-ревʼю',
            },
            {
              icon: '🏆',
              title_en: 'Live competition',
              title_ru: 'Соревнование',
              title_uk: 'Змагання',
              desc_en: 'Timers, points, leaderboard, podium for the winners',
              desc_ru: 'Таймеры, очки, лидерборд, подиум победителей',
              desc_uk: 'Таймери, очки, лідерборд, подіум переможців',
            },
          ].map(a => (
            <div key={a.title_en} className="p-5 border border-[#2E2E2E] bg-[#0a0a0a]/95 backdrop-blur-md rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{a.icon}</span>
                <h3 className="font-display text-[18px] text-white">{t(a.title_en, a.title_ru, a.title_uk)}</h3>
              </div>
              <p className="text-[15px] text-text-secondary leading-relaxed">{t(a.desc_en, a.desc_ru, a.desc_uk)}</p>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  )
}
