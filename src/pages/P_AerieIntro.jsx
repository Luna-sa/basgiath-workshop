import { useT } from '../i18n/useT'
import PageShell from '../core/PageShell'

/**
 * Workshop-flow intro to the Aerie + voting. The Aerie itself runs
 * standalone at /?page=aerie. This slide is the bridge — facilitator
 * opens voting here and projects the live gallery on the wall.
 */
export default function P_AerieIntro() {
  const t = useT()

  return (
    <PageShell pageIndex={20}>
      <div className="space-y-6">
        <div>
          <p className="font-mono text-[11px] tracking-[3px] uppercase text-qa-teal mb-3">
            ◆ {t('The Aerie', 'Аэрия', 'Аерія')}
          </p>
          <h2 className="font-display text-3xl text-white leading-tight mb-3">
            {t(
              'One vote each. The sky chooses.',
              'Один голос у каждого. Небо выбирает.',
              'Один голос у кожного. Небо обирає.'
            )}
          </h2>
          <p className="text-[15px] text-text-body leading-relaxed">
            {t(
              'Every sealed dragon now lives in the Aerie. You each have one vote — cast it for someone else\'s, not your own. The dragon with the most votes takes the Signet of the Sky. The board updates live as you vote.',
              'Каждый запечатанный дракон теперь живёт в Аэрии. У каждого один голос — отдай его за чужого дракона, не за своего. Дракон с наибольшим количеством голосов получает Сигнет Неба. Доска обновляется в реальном времени.',
              'Кожен запечатаний дракон тепер живе в Аерії. У кожного один голос — віддай його за чужого дракона, не за свого. Дракон з найбільшою кількістю голосів отримує Сигіл Неба. Дошка оновлюється в реальному часі.'
            )}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <a
            href="/?page=aerie"
            target="_blank"
            rel="noopener"
            className="inline-block bg-qa-teal text-black px-7 py-3 font-mono text-[12px] tracking-[3px] uppercase font-semibold hover:shadow-[0_0_24px_rgba(0,229,204,0.4)] transition-all animate-pulse-teal"
          >
            {t('Open the Aerie →', 'Открыть Аэрию →', 'Відкрити Аерію →')}
          </a>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="border border-qa-teal/30 bg-qa-teal/[0.04] p-5">
            <div className="font-mono text-[10px] tracking-[2px] uppercase text-qa-teal mb-2">
              ◆ {t('Voting rules', 'Правила голосования', 'Правила голосування')}
            </div>
            <ul className="text-[13.5px] text-text-body leading-relaxed space-y-1.5 list-none">
              <li>◆ {t('One vote per rider.', 'Один голос на всадника.', 'Один голос на вершника.')}</li>
              <li>◆ {t('You cannot vote for your own dragon.', 'За своего дракона голосовать нельзя.', 'За свого дракона голосувати не можна.')}</li>
              <li>◆ {t('You can change your vote any time before the facilitator closes voting.', 'Можешь сменить голос в любой момент пока фасилитатор не закрыл.', 'Можеш змінити голос будь-коли поки фасилітатор не закрив.')}</li>
              <li>◆ {t('The current leader gets the ✦ Lead badge.', 'Текущий лидер получает значок ✦ Lead.', 'Поточний лідер отримує значок ✦ Lead.')}</li>
            </ul>
          </div>

          <div className="border border-border bg-surface/50 p-5">
            <div className="font-mono text-[10px] tracking-[2px] uppercase text-text-dim mb-2">
              ◆ {t('What you\'re looking for', 'На что смотреть', 'На що дивитись')}
            </div>
            <ul className="text-[13.5px] text-text-body leading-relaxed space-y-1.5 list-none">
              <li>◆ {t('Which dragon moves you?', 'Какой дракон цепляет?', 'Який дракон зачепив?')}</li>
              <li>◆ {t('Whose composition tells a story?', 'Чья композиция рассказывает историю?', 'Чия композиція розповідає історію?')}</li>
              <li>◆ {t('Whose motto + portrait belong together?', 'Чей девиз + портрет в одной семье?', 'Чий девіз + портрет з однієї родини?')}</li>
            </ul>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
