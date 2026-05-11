import PageShell from '../core/PageShell'
import { useT } from '../i18n/useT'
import { useLocale } from '../i18n/store'
import { GEMS } from '../data/gems'

/**
 * Hidden Gems intro / overview slide. The six gems each have their
 * own deep-dive slide right after this one — this page is the
 * "table of contents" so participants see the shape of the next
 * 15 minutes before we dive in.
 */
export default function P_HiddenGems() {
  const t = useT()
  const lang = useLocale(s => s.lang)
  return (
    <PageShell pageIndex={12}>
      <div className="space-y-6">
        <div>
          <p className="text-[15px] text-text-body leading-relaxed max-w-3xl">
            {t(
              'Six things most riders don\'t know about. Some are baked into Claude Code and undocumented. Some are community projects that lift the workflow or just delight you. We go through them one at a time over the next slides — each with a copyable autopilot prompt, so you can install on the spot.',
              'Шесть штук, про которые большинство всадников не знают. Часть встроена в Claude Code и не задокументирована. Часть — community-проекты, которые поднимают workflow или просто радуют. Сейчас идём по ним по одной — у каждой свой слайд и copyable autopilot-промпт, поставить можно прямо здесь.',
              'Шість штук, про які більшість вершників не знають. Частина вбудована у Claude Code і не задокументована. Частина — community-проєкти, які піднімають workflow або просто тішать. Зараз ідемо по них по одній — у кожної свій слайд і copyable autopilot-промпт, поставити можна прямо тут.'
            )}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {GEMS.map((g, i) => {
            const tagline = lang === 'uk' ? (g.tagline_uk || g.tagline_en) : lang === 'ru' ? (g.tagline_ru || g.tagline_en) : g.tagline_en
            return (
              <div
                key={g.id}
                className="border border-border bg-surface/40 p-4 hover:border-qa-teal/40 transition-colors"
              >
                <div className="font-mono text-[10px] tracking-[2px] uppercase text-qa-teal mb-2">
                  ◆ {String(i + 1).padStart(2, '0')} · {g.eyebrow}
                </div>
                <div className="font-display italic text-[18px] text-white leading-tight mb-1">
                  {g.name}
                </div>
                <p className="text-[12.5px] text-text-body italic leading-relaxed">
                  {tagline}
                </p>
              </div>
            )
          })}
        </div>

        <div className="border border-qa-teal/30 bg-qa-teal/[0.04] p-4">
          <p className="text-[13px] text-text-body leading-relaxed">
            {t(
              'On each gem slide: tagline → what it is → why it matters → when to reach for it → install prompt. Use the right arrow / Space / Enter to advance through the six.',
              'На каждом слайде с гемом: tagline → что это → зачем → когда брать → install-промпт. Стрелка вправо / Space / Enter — листать дальше по шести.',
              'На кожному слайді з гемом: tagline → що це → навіщо → коли брати → install-промпт. Стрілка вправо / Space / Enter — гортати далі по шести.'
            )}
          </p>
          <p className="text-[12px] text-text-dim italic mt-2">
            {t(
              'About 15 minutes total. Each gem has a copy-paste install prompt — if one grabs you, install right at your seat while we cover the next.',
              'Примерно 15 минут на всё. У каждого гема — install-промпт под Copy. Зацепил какой-то — поставь прямо за партой, пока идём дальше.',
              'Близько 15 хвилин на все. У кожного гема — install-промпт під Copy. Зачепив якийсь — постав прямо за партою, поки йдемо далі.'
            )}
          </p>
        </div>
      </div>
    </PageShell>
  )
}
