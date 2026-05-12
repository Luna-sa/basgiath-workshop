import { useWorkshopStore } from '../store/workshopStore'
import { useT } from '../i18n/useT'
import PageShell from '../core/PageShell'
import CheckpointButton from '../components/CheckpointButton'
import { buildArenaBriefMd } from '../data/arena-rules'

/**
 * Workshop-flow intro to the Dragon Arena. The arena itself runs at
 * /?page=arena (iframe wrapper around dragon-arena.html). This page
 * sits in the main flow, explains the rules, and links the user to
 * the arena with their nickname pre-filled.
 *
 * The facilitator-side final-battle URL is /?page=arena&final=1.
 */
export default function P_ArenaIntro() {
  const t = useT()
  const nickname = useWorkshopStore(s => s.user.nickname)
  const name = useWorkshopStore(s => s.user.name)
  const characterId = useWorkshopStore(s => s.user.characterId)
  const arenaUrl = nickname
    ? `/?page=arena&nickname=${encodeURIComponent(nickname)}`
    : '/?page=arena'

  const handleDownloadBrief = () => {
    const md = buildArenaBriefMd({ characterId, nickname, name })
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ARENA-${nickname || characterId || 'brief'}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <PageShell pageIndex={24}>
      <div className="space-y-6">
        <div>
          <p className="font-mono text-[11px] tracking-[3px] uppercase text-qa-teal mb-3">
            ◆ {t('Riders in the Sky', 'Всадники в небе', 'Вершники у небі')}
          </p>
          <h2 className="font-display text-3xl text-white leading-tight mb-3">
            {t('Code how your dragon flies.', 'Запрограммируй полёт своего дракона.', 'Запрограмуй політ свого дракона.')}
          </h2>
          <p className="text-[15px] text-text-body leading-relaxed">
            {t(
              "You'll write a function that controls your dragon's flight. Your Claude Code helps you write it. Six dragons compete on the projector at the end - most stars wins.",
              'Напишешь функцию которая управляет полётом твоего дракона. Claude Code помогает её собрать. Шесть драконов сразятся на проекторе в финале - больше звёзд = победа.',
              'Напишеш функцію, яка керує польотом твого дракона. Claude Code допомагає її зібрати. Шість драконів зітнуться на проекторі у фіналі - більше зірок = перемога.'
            )}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <a
            href={arenaUrl}
            target="_blank"
            rel="noopener"
            className="inline-block bg-qa-teal text-black px-7 py-3 font-mono text-[12px] tracking-[3px] uppercase font-semibold hover:shadow-[0_0_24px_rgba(0,229,204,0.4)] transition-all animate-pulse-teal"
          >
            {t('Open Arena →', 'Открыть арену →', 'Відкрити арену →')}
          </a>
          <button
            type="button"
            onClick={handleDownloadBrief}
            disabled={!characterId}
            className="inline-block border border-qa-teal/50 text-qa-teal px-5 py-3 font-mono text-[11px] tracking-[2.5px] uppercase font-semibold hover:bg-qa-teal/10 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            title={!characterId ? t('Pick a character first', 'Сначала выбери персонажа', 'Спершу обери персонажа') : undefined}
          >
            ↓ {t('Download Arena Brief', 'Скачать Arena Brief', 'Завантажити Arena Brief')}
          </button>
          {nickname && (
            <span className="text-[12px] text-text-dim italic">
              {t('Signed in as', 'Вошла как', 'Увійшла як')}{' '}
              <span className="font-mono text-qa-teal">{nickname}</span>
            </span>
          )}
        </div>

        <div className="border border-qa-teal/20 bg-qa-teal/[0.03] p-4 text-[13px] text-text-body leading-relaxed">
          {t(
            "The Arena Brief is a single ARENA.md — full game rules, your signet and easter-egg pattern, a starter tick() template, and a ready-to-paste prompt that gets Claude into iteration mode. Save it next to your project and Claude Code will read it.",
            'Arena Brief - один ARENA.md: полные правила игры, твой signet и easter-egg паттерн, стартовый tick() шаблон и готовый промпт для Claude чтобы войти в режим итераций. Сохрани рядом с проектом - Claude Code его прочтёт.',
            'Arena Brief - один ARENA.md: повні правила гри, твій signet і easter-egg патерн, стартовий tick() шаблон і готовий промпт для Claude, щоб увійти в режим ітерацій. Збережи поруч із проєктом - Claude Code його прочитає.'
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="border border-qa-teal/30 bg-qa-teal/[0.04] p-5">
            <div className="font-mono text-[10px] tracking-[2px] uppercase text-qa-teal mb-2">
              ◆ {t('How it works', 'Как это работает', 'Як це працює')}
            </div>
            <ul className="text-[14px] text-text-body leading-relaxed space-y-1.5 list-none">
              <li>1. {t('Open the arena (button below).', 'Открой арену (кнопка ниже).', 'Відкрий арену (кнопка нижче).')}</li>
              <li>2. {t('Find your character\'s slot, copy the template into Claude Code.', 'Найди свой слот, скопируй шаблон в Claude Code.', 'Знайди свій слот, скопіюй шаблон у Claude Code.')}</li>
              <li>3. {t('Ask Claude to write smarter logic for your dragon.', 'Попроси Claude написать умнее логику для твоего дракона.', 'Попроси Claude написати розумнішу логіку для твого дракона.')}</li>
              <li>4. {t('Paste the result back, hit Submit ✦.', 'Вставь результат обратно, нажми Submit ✦.', 'Встав результат назад, натисни Submit ✦.')}</li>
              <li>5. {t('Watch the final battle on the projector.', 'Смотри финальную битву на проекторе.', 'Дивись фінальну битву на проекторі.')}</li>
            </ul>
          </div>

          <div className="border border-border bg-surface/50 p-5">
            <div className="font-mono text-[10px] tracking-[2px] uppercase text-text-dim mb-2">
              ◆ {t('Starter bot - beat this', 'Стартовый бот - победи его', 'Стартовий бот - переможи його')}
            </div>
            <pre className="text-[11.5px] font-mono text-qa-teal leading-relaxed whitespace-pre-wrap">{`function tick({ me, stars, walls, rivals }) {
  // greedy: nearest star, full throttle
  let best = stars[0], bestD = Infinity
  for (const s of stars) {
    const d = Math.hypot(s.x-me.x, s.y-me.y)
    if (d < bestD) { bestD = d; best = s }
  }
  const angle = Math.atan2(
    best.y-me.y, best.x-me.x) * 180/Math.PI
  return { angle, throttle: 1 }
}`}</pre>
            <p className="text-[11px] text-text-dim italic mt-3">
              {t(
                'Paste into Arena, ask Claude to make it smarter. Hint: bonded riders find more in the docs.',
                'Вставь в Arena, попроси Claude сделать умнее. Подсказка: всадники со связью находят в документации больше.',
                'Встав у Arena, попроси Claude зробити розумнішим. Підказка: bonded-вершники знаходять у документації більше.'
              )}
            </p>
          </div>
        </div>

        <div className="border border-qa-teal/30 bg-qa-teal/[0.03] p-4 flex items-center gap-3">
          <span className="font-mono text-[10px] tracking-[2px] uppercase text-qa-teal shrink-0">
            ⏱ {t('Time budget', 'Бюджет времени', 'Бюджет часу')}
          </span>
          <span className="text-[13px] text-text-body">
            {t(
              '~12 minutes total. 5 runs × 45 seconds + coding loop between them.',
              '~12 минут всего. 5 запусков × 45 секунд + код-петля между ними.',
              '~12 хвилин усього. 5 запусків × 45 секунд + код-петля між ними.'
            )}
          </span>
        </div>

        <p className="text-[12px] text-text-dim italic">
          {t(
            'When you finish - come back to this tab and press →. Final reveal is on the Champions slide.',
            'Когда закончишь - вернись сюда и жми →. Финальный reveal - на слайде Champions.',
            'Коли закінчиш - повернись сюди і тисни →. Фінальний reveal - на слайді Champions.'
          )}
        </p>

        <CheckpointButton
          id="arena"
          label={t('Mark bot submitted', 'Отметить: бот отправлен', 'Позначити: бота надіслано')}
          helpText={t("After you've clicked Submit ✦ on your character's slot", 'После клика Submit ✦ в слоте твоего персонажа', 'Після кліку Submit ✦ у слоті твого персонажа')}
        />
      </div>
    </PageShell>
  )
}
