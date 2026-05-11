import PageShell from '../core/PageShell'
import { useT } from '../i18n/useT'

/**
 * QA Grimoire — the seven incantations, the four familiars, the three
 * conduits. Same commands you actually run in Claude Code, just wrapped
 * in the language of an old spell book. The invocation (real command)
 * stays canonical so participants can use it in their day job without
 * translating "lore" back.
 */

const GRIMOIRE = [
  {
    section_en: 'Incantations',
    section_ru: 'Заклинания',
    eyebrow_en: 'spoken aloud to the system',
    eyebrow_ru: 'произносятся вслух системе',
    glyph: '✦',
    items: [
      {
        lore_en: 'Inscription of Faults',
        lore_ru: 'Запись Изъянов',
        invocation: '/bug-report',
        body_en: 'From a hurried description, the spell renders a clean, professional fault report. Tested by witnesses, signed by your hand.',
        body_ru: 'Из торопливого описания вытягивает чистый, профессиональный отчёт. Свидетелями подтверждено, твоей рукой подписано.',
      },
      {
        lore_en: 'Forge of Cases',
        lore_ru: 'Кузница Случаев',
        invocation: '/test-cases',
        body_en: 'Feed it a feature; it returns 15-25 test cases — happy paths, edges, and the corners where things break.',
        body_ru: 'Кидаешь в неё фичу — отдаёт 15-25 тест-кейсов: счастливые пути, границы и углы где всё ломается.',
      },
      {
        lore_en: 'Gaze of Witnessing',
        lore_ru: 'Взор Свидетеля',
        invocation: '/review',
        body_en: 'Reads code through QA eyes — what tests are missing, what assumptions go untested, where the spec drifted.',
        body_ru: 'Читает код глазами QA — каких тестов нет, какие допущения непротестированы, где спека ушла в сторону.',
      },
      {
        lore_en: 'Litany Before Flight',
        lore_ru: 'Литания Перед Полётом',
        invocation: '/checklist',
        body_en: 'A pre-release checklist drawn from the change in front of you. No one ships without speaking the litany.',
        body_ru: 'Чеклист перед релизом, выведенный из изменения перед тобой. Никто не отправляет в небо не произнеся литанию.',
      },
      {
        lore_en: 'Probe of the Wire',
        lore_ru: 'Зонд Провода',
        invocation: '/api-test',
        body_en: 'Sends test requests to your API and reads what comes back. cURL beneath the hood; sense above it.',
        body_ru: 'Шлёт пробные запросы в API и читает что пришло. Под капотом cURL; над капотом — смысл.',
      },
      {
        lore_en: 'Augury of Echo',
        lore_ru: 'Гадание по Эху',
        invocation: '/regression',
        body_en: 'Looks at what changed and predicts what to re-test. Catches regressions before users do.',
        body_ru: 'Смотрит на изменения и предсказывает что перепроверить. Ловит регресс до того как его поймают пользователи.',
      },
      {
        lore_en: 'Reading of Tongues',
        lore_ru: 'Чтение Языков',
        invocation: '/analyze-log',
        body_en: 'Turns a screaming stack trace into one human sentence about what failed and where to look.',
        body_ru: 'Превращает кричащий stack trace в одну человеческую фразу: что сломалось и куда смотреть.',
      },
    ],
  },
  {
    section_en: 'Familiars',
    section_ru: 'Фамильяры',
    eyebrow_en: 'creatures that work while you sleep',
    eyebrow_ru: 'существа, работающие пока ты спишь',
    glyph: '◆',
    items: [
      {
        lore_en: 'Witness · the Reviewer',
        lore_ru: 'Свидетель · Ревьюер',
        invocation: 'qa-reviewer',
        body_en: 'Sits at every pull request, asks the questions a senior QA would. Doesn\'t merge; only marks.',
        body_ru: 'Сидит на каждом PR, задаёт вопросы что задал бы старший QA. Не мержит; только размечает.',
      },
      {
        lore_en: 'Forgehand · the Maker',
        lore_ru: 'Кузнецова Рука · Творец',
        invocation: 'test-generator',
        body_en: 'Reads a module and writes tests for it. Returns runnable code, not pseudo.',
        body_ru: 'Читает модуль и пишет под него тесты. Возвращает рабочий код, не псевдо.',
      },
      {
        lore_en: 'Wardstone · the Watcher',
        lore_ru: 'Вард-Камень · Дозорный',
        invocation: 'security-scanner',
        body_en: 'Sniffs the code for vulnerabilities — injection, exposed secrets, weak crypto. Raises a flag, never silences it.',
        body_ru: 'Нюхает код на уязвимости — инъекции, открытые секреты, слабая крипта. Поднимает флаг, не глушит его.',
      },
      {
        lore_en: 'Adjudicator · the Weigher',
        lore_ru: 'Третейский · Весовщик',
        invocation: 'bug-triager',
        body_en: 'Looks at the bug list, decides what bleeds and what waits. Sorts by harm, not by who shouted.',
        body_ru: 'Смотрит на список багов, решает что кровоточит и что подождёт. Сортирует по вреду, не по тому кто громче кричал.',
      },
    ],
  },
  {
    section_en: 'Conduits',
    section_ru: 'Проводники',
    eyebrow_en: 'channels to other realms',
    eyebrow_ru: 'каналы к иным сферам',
    glyph: '◇',
    items: [
      {
        lore_en: 'Sight Beyond Glass',
        lore_ru: 'Зрение За Стеклом',
        invocation: 'Playwright',
        body_en: 'A conduit through which Claude opens a real browser — clicks, fills, screenshots. Beyond chat into the page itself.',
        body_ru: 'Канал по которому Claude открывает настоящий браузер — кликает, заполняет, скриншотит. Из чата прямо на страницу.',
      },
      {
        lore_en: 'Voice on the Wire',
        lore_ru: 'Голос в Проводе',
        invocation: 'Fetch',
        body_en: 'Lets Claude make HTTP calls into any service. The wire carries voice; the voice asks; the service answers.',
        body_ru: 'Позволяет Claude делать HTTP-запросы к любому сервису. Провод несёт голос; голос спрашивает; сервис отвечает.',
      },
      {
        lore_en: 'Library of Now',
        lore_ru: 'Библиотека Настоящего',
        invocation: 'Context7',
        body_en: 'Fetches the current documentation of any library — never the year-old version Claude memorised in training.',
        body_ru: 'Достаёт актуальную документацию любой библиотеки — никогда не годичной давности что Claude запомнил в обучении.',
      },
    ],
  },
]

function SpellEntry({ item, lang, accent }) {
  const lore = lang === 'ru' ? item.lore_ru : item.lore_en
  const body = lang === 'ru' ? item.body_ru : item.body_en
  return (
    <div className="py-3.5 first:pt-0 last:pb-0">
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-1.5">
        <div className="font-display italic text-[19px] text-white leading-tight">
          {lore}
        </div>
        <code
          className="font-mono text-[12.5px] tracking-[0.5px]"
          style={{ color: accent }}
        >
          {item.invocation}
        </code>
      </div>
      <p className="text-[13.5px] text-text-secondary italic leading-[1.6]">
        {body}
      </p>
    </div>
  )
}

export default function P07_TalkEcosystem() {
  const t = useT()
  return (
    <PageShell pageIndex={8}>
      <div className="space-y-6">
        {/* Grimoire frame */}
        <div className="border border-qa-teal/30 bg-gradient-to-br from-qa-teal/[0.05] via-transparent to-transparent p-5">
          <div className="font-mono text-[10px] tracking-[3px] uppercase text-qa-teal mb-2">
            ◆ {t('The QA Grimoire', 'Гримуар QA', 'Гримуар QA')}
          </div>
          <p className="text-[14px] text-text-body italic leading-relaxed max-w-2xl">
            {t(
              'Seven incantations, four familiars, three conduits. The invocations are real commands you run in Claude Code — the names beside them are the language of the older books. Use either; the spells care which you speak.',
              'Семь заклинаний, четыре фамильяра, три проводника. Инвокации — реальные команды которые ты запускаешь в Claude Code. Имена рядом — язык старых книг. Используй любое; заклинаниям всё равно каким именем ты их зовёшь.',
              'Сім заклинань, чотири фамільяри, три провідники. Інвокації — справжні команди які ти запускаєш у Claude Code. Імена поряд — мова старих книг. Використовуй будь-яке; заклинанням однаково яким імʼям їх кличеш.'
            )}
          </p>
        </div>

        {/* Sections */}
        {GRIMOIRE.map((section, sectionIdx) => {
          const accents = ['#00E5CC', '#E85D26', '#FF65BE']
          const accent = accents[sectionIdx % accents.length]
          return (
            <section
              key={section.section_en}
              className="border border-border bg-surface/30 overflow-hidden"
            >
              <header
                className="px-5 py-4 border-b border-border bg-black/40 flex items-center justify-between gap-3 flex-wrap"
                style={{ borderLeftWidth: '3px', borderLeftStyle: 'solid', borderLeftColor: accent }}
              >
                <div className="flex items-baseline gap-3">
                  <span className="text-[24px] leading-none" style={{ color: accent }}>{section.glyph}</span>
                  <div>
                    <h3 className="font-display italic text-[24px] text-white leading-none">
                      {lang(t) === 'ru' ? section.section_ru : section.section_en}
                    </h3>
                    <p className="font-mono text-[10px] tracking-[2px] uppercase mt-1" style={{ color: accent }}>
                      {lang(t) === 'ru' ? section.eyebrow_ru : section.eyebrow_en}
                    </p>
                  </div>
                </div>
                <span className="font-mono text-[11px] text-text-dim">
                  {section.items.length} {t('entries', 'записей', 'записів')}
                </span>
              </header>
              <div className="px-5 py-3 divide-y divide-border/40">
                {section.items.map(item => (
                  <SpellEntry
                    key={item.invocation}
                    item={item}
                    lang={lang(t)}
                    accent={accent}
                  />
                ))}
              </div>
            </section>
          )
        })}

        <p className="text-[12px] text-text-dim italic text-center pt-3">
          {t(
            'The grimoire grows. The eighth incantation you\'ll write yourself.',
            'Гримуар растёт. Восьмое заклинание ты напишешь сама.',
            'Гримуар росте. Восьме заклинання ти напишеш сама.'
          )}
        </p>
      </div>
    </PageShell>
  )
}

/** Detect locale from a useT() callable. Hacky but avoids importing useLocale here. */
function lang(t) {
  return t('en', 'ru', 'uk')
}
