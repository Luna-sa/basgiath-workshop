import { useWorkshopStore } from '../store/workshopStore'
import { useT } from '../i18n/useT'
import PageShell from '../core/PageShell'
import CheckpointButton from '../components/CheckpointButton'

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
  const arenaUrl = nickname
    ? `/?page=arena&nickname=${encodeURIComponent(nickname)}`
    : '/?page=arena'

  return (
    <PageShell pageIndex={10}>
      <div className="space-y-6">
        <div>
          <p className="font-mono text-[11px] tracking-[3px] uppercase text-qa-teal mb-3">
            ◆ {t('Riders in the Sky', 'Всадники в небе')}
          </p>
          <h2 className="font-display text-3xl text-white leading-tight mb-3">
            {t('Code how your dragon flies.', 'Запрограммируй полёт своего дракона.')}
          </h2>
          <p className="text-[15px] text-text-body leading-relaxed">
            {t(
              "You'll write a function that controls your dragon's flight. Your Claude Code helps you write it. Six dragons compete on the projector at the end — most stars wins.",
              'Напишешь функцию которая управляет полётом твоего дракона. Claude Code помогает её собрать. Шесть драконов сразятся на проекторе в финале — больше звёзд = победа.'
            )}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="border border-qa-teal/30 bg-qa-teal/[0.04] p-5">
            <div className="font-mono text-[10px] tracking-[2px] uppercase text-qa-teal mb-2">
              ◆ {t('How it works', 'Как это работает')}
            </div>
            <ul className="text-[14px] text-text-body leading-relaxed space-y-1.5 list-none">
              <li>1. {t('Open the arena (button below).', 'Открой арену (кнопка ниже).')}</li>
              <li>2. {t('Find your character\'s slot, copy the template into Claude Code.', 'Найди свой слот, скопируй шаблон в Claude Code.')}</li>
              <li>3. {t('Ask Claude to write smarter logic for your dragon.', 'Попроси Claude написать умнее логику для твоего дракона.')}</li>
              <li>4. {t('Paste the result back, hit Submit ✦.', 'Вставь результат обратно, нажми Submit ✦.')}</li>
              <li>5. {t('Watch the final battle on the projector.', 'Смотри финальную битву на проекторе.')}</li>
            </ul>
          </div>

          <div className="border border-border bg-surface/50 p-5">
            <div className="font-mono text-[10px] tracking-[2px] uppercase text-text-dim mb-2">
              ◆ {t('Bot API quick reference', 'API бота — кратко')}
            </div>
            <pre className="text-[12px] font-mono text-qa-teal leading-relaxed whitespace-pre-wrap">{`tick({ me, stars, walls, sky })
  → { angle, throttle }

me    : { x, y, score, fuel }
stars : [{ x, y, value, fire }]
walls : [{ x, y, r }]
sky   : { width, height }`}</pre>
            <p className="text-[11px] text-text-dim italic mt-3">
              {t(
                'Hint: bonded riders sometimes find more in the docs.',
                'Подсказка: всадники со связью находят в документации больше.'
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 items-center pt-2">
          <a
            href={arenaUrl}
            target="_blank"
            rel="noopener"
            className="inline-block bg-qa-teal text-black px-7 py-3 font-mono text-[12px] tracking-[3px] uppercase font-semibold hover:shadow-[0_0_24px_rgba(0,229,204,0.4)] transition-all"
          >
            {t('Open Arena →', 'Открыть арену →')}
          </a>
          {nickname && (
            <span className="text-[12px] text-text-dim italic">
              {t('Signed in as', 'Вошла как')}{' '}
              <span className="font-mono text-qa-teal">{nickname}</span>
            </span>
          )}
        </div>

        <p className="text-[12px] text-text-dim italic">
          {t(
            'When the facilitator calls the final battle, all submitted bots load on the projector.',
            'Когда фасилитатор объявит финальную битву — все отправленные боты загрузятся на проекторе.'
          )}
        </p>

        <CheckpointButton
          id="arena"
          label="Mark bot submitted"
          helpText="After you've clicked Submit ✦ on your character's slot"
        />
      </div>
    </PageShell>
  )
}
