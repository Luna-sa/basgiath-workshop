import { useWorkshopStore } from '../store/workshopStore'
import { useT } from '../i18n/useT'
import PageShell from '../core/PageShell'
import CheckpointButton from '../components/CheckpointButton'

/**
 * Workshop-flow intro to the Bond Ritual. The ritual itself runs at
 * /?page=bond (standalone wizard with image generation). This page
 * frames the activity and links over to it.
 */
export default function P_BondIntro() {
  const t = useT()
  const nickname = useWorkshopStore(s => s.user.nickname)
  const bondUrl = nickname ? '/?page=bond' : '/?page=bond'

  return (
    <PageShell pageIndex={12}>
      <div className="space-y-6">
        <div>
          <p className="font-mono text-[11px] tracking-[3px] uppercase text-qa-teal mb-3">
            ◆ {t('The Bond Ritual', 'Ритуал Связывания', 'Ритуал Звʼязування')}
          </p>
          <h2 className="font-display text-3xl text-white leading-tight mb-3">
            {t(
              'Now your dragon takes shape.',
              'Теперь твой дракон обретает форму.',
              'Тепер твій дракон набирає форми.'
            )}
          </h2>
          <p className="text-[15px] text-text-body leading-relaxed">
            {t(
              'Eight short questions - scales, breath, signet, size, wings, eyes, motto, name. From those answers a real cinematic portrait is generated. You can re-roll until it feels right. When you seal it, your dragon enters the Aerie alongside everyone else\'s.',
              'Восемь коротких вопросов - чешуя, дыхание, сигнет, размер, крылья, глаза, девиз, имя. По ответам генерируется реальный кинематографический портрет. Можешь перегенерить пока не почувствуешь - это он. Запечатаешь - он попадает в Аэрию рядом со всеми остальными.',
              'Вісім коротких запитань - луска, подих, сигнет, розмір, крила, очі, девіз, імʼя. За відповідями генерується справжній кінематографічний портрет. Можеш перегенерувати, доки не відчуєш - це він. Коли запечатаєш - він стане поряд з усіма іншими в Аерії.'
            )}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <a
            href={bondUrl}
            target="_blank"
            rel="noopener"
            className="inline-block bg-qa-teal text-black px-7 py-3 font-mono text-[12px] tracking-[3px] uppercase font-semibold hover:shadow-[0_0_24px_rgba(0,229,204,0.4)] transition-all animate-pulse-teal"
          >
            {t('Begin the Bond →', 'Начать связывание →', 'Розпочати звʼязування →')}
          </a>
          {nickname && (
            <span className="text-[12px] text-text-dim italic">
              {t('Signed in as', 'Вошла как', 'Увійшла як')}{' '}
              <span className="font-mono text-qa-teal">@{nickname}</span>
            </span>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="border border-qa-teal/30 bg-qa-teal/[0.04] p-5">
            <div className="font-mono text-[10px] tracking-[2px] uppercase text-qa-teal mb-2">
              ◆ {t('How it works', 'Как это работает', 'Як це працює')}
            </div>
            <ul className="text-[13.5px] text-text-body leading-relaxed space-y-1.5 list-none">
              <li>1. {t('Answer eight short questions (voice or typing).', 'Ответь на восемь коротких вопросов (голос или текст).', 'Відповідай на вісім коротких запитань (голосом або текстом).')}</li>
              <li>2. {t('Claude assembles a cinematic prompt from your answers.', 'Claude собирает кинематографический промпт по ответам.', 'Claude збирає кінематографічний промпт за відповідями.')}</li>
              <li>3. {t('gpt-image-2 generates a 1024×1024 portrait (~30 sec).', 'gpt-image-2 генерирует портрет 1024×1024 (~30 сек).', 'gpt-image-2 генерує портрет 1024×1024 (~30 сек).')}</li>
              <li>4. {t('Re-roll until it feels right. No limit on attempts.', 'Перегенерь пока не почувствуешь. Лимита на попытки нет.', 'Перегенеруй, доки не відчуєш. Ліміту на спроби немає.')}</li>
              <li>5. {t('Seal - it enters the Aerie for voting.', 'Запечатай - попадает в Аэрию на голосование.', 'Запечатай - потрапляє в Аерію на голосування.')}</li>
            </ul>
          </div>

          <div className="border border-border bg-surface/50 p-5">
            <div className="font-mono text-[10px] tracking-[2px] uppercase text-text-dim mb-2">
              ◆ {t('What you bring', 'Что нужно от тебя', 'Що потрібно від тебе')}
            </div>
            <ul className="text-[13.5px] text-text-body leading-relaxed space-y-1.5 list-none">
              <li>◆ {t('Your imagination - colours, shapes, presence.', 'Воображение - цвета, формы, присутствие.', 'Уява - кольори, форми, присутність.')}</li>
              <li>◆ {t('A motto in one line - sets the dragon\'s stance.', 'Девиз в одну строку - задаёт позу.', 'Девіз в один рядок - задає позу.')}</li>
              <li>◆ {t('A name (only after everything else is sealed).', 'Имя (только когда всё остальное запечатано).', 'Імʼя (лише коли все інше запечатано).')}</li>
            </ul>
          </div>
        </div>

        <CheckpointButton
          id="bond"
          label={t('Mark dragon sealed', 'Отметить: дракон запечатан', 'Позначити: дракона запечатано')}
          helpText={t("After you've sealed your dragon into the Aerie", 'После того как запечатаешь дракона в Аэрии', 'Після того як запечатаєш дракона в Аерії')}
        />
      </div>
    </PageShell>
  )
}
