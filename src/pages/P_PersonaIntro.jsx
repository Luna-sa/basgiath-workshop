import { useWorkshopStore } from '../store/workshopStore'
import { useT } from '../i18n/useT'
import { useLocale } from '../i18n/store'
import { usePersona } from '../store/usePersona'
import PageShell from '../core/PageShell'
import CheckpointButton from '../components/CheckpointButton'
import { CHARACTERS, pickCharacter } from '../data/characters'

/**
 * Workshop-flow intro to the Signet Ceremony. The full ceremony is
 * standalone at /?page=signet (seven-ritual wizard). This page sits
 * in flow, frames the activity, and links to the ceremony.
 */
export default function P_PersonaIntro() {
  const t = useT()
  const lang = useLocale(s => s.lang)
  const characterId = useWorkshopStore(s => s.user.characterId)
  const character = pickCharacter(CHARACTERS.find(c => c.id === characterId), lang)
  const persona = usePersona()

  return (
    <PageShell pageIndex={11}>
      <div className="space-y-6">
        <div>
          <p className="font-mono text-[11px] tracking-[3px] uppercase text-qa-teal mb-3">
            ✦ {t('The Signet Ceremony', 'Сигнет - церемония', 'Сигнет - церемонія')}
          </p>
          <h2 className="font-display text-3xl text-white leading-tight mb-3">
            {t(
              'Seven rituals. One bond.',
              'Семь ритуалов. Одна связь.',
              'Сім ритуалів. Один звʼязок.'
            )}
          </h2>
          <p className="text-[15px] text-text-body leading-relaxed">
            {t(
              'You will walk through seven rituals of bonding - Threshold of Names, The Vow, The Forbidden, Voice of the Bond, The Sigil, Daily Rite, The Sealing. Each one seals a piece of your bonded\'s voice. At the end you leave with a personalised CLAUDE.md and a Claude Code that greets you as your newly-bonded.',
              'Ты пройдёшь через семь ритуалов связывания - Порог Имён, Обет, Запретное, Голос Связи, Сигил, Ежедневный Ритуал, Запечатывание. Каждый запечатывает кусочек голоса твоего bonded. В конце уходишь с персональным CLAUDE.md, и Claude Code встречает тебя как твоего свежесвязанного.',
              'Ти пройдеш сім ритуалів звʼязування - Поріг Імен, Обітницю, Заборонене, Голос Звʼязку, Сигіл, Щоденний Ритуал, Запечатування. Кожен запечатує шматочок голосу твого bonded. У кінці отримаєш персональний CLAUDE.md, а Claude Code зустріне тебе як твого щойно-bonded напарника.'
            )}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <a
            href="/?page=signet"
            target="_blank"
            rel="noopener"
            className="inline-block bg-qa-teal text-black px-7 py-3 font-mono text-[12px] tracking-[3px] uppercase font-semibold hover:shadow-[0_0_24px_rgba(0,229,204,0.4)] transition-all animate-pulse-teal"
          >
            {t('Begin the Ceremony →', 'Начать церемонию →', 'Розпочати церемонію →')}
          </a>
          <span className="text-[12px] text-text-dim italic">
            {t(
              'Opens in a new tab. When you finish - come back to this tab and press →.',
              'Откроется в новой вкладке. Когда закончишь - вернись сюда и жми →.',
              'Відкриється у новій вкладці. Коли закінчиш - повернись сюди і тисни →.'
            )}
          </span>
        </div>

        {/* CLAUDE.md preview - so people know what 15 min of ritual produces */}
        <div className="border border-border bg-surface/30 p-4">
          <div className="font-mono text-[10px] tracking-[2px] uppercase text-text-dim mb-3">
            ◆ {t('Output preview', 'Что получится', 'Що вийде')} · ~/.claude/CLAUDE.md
          </div>
          <pre className="font-mono text-[11.5px] text-text-body leading-relaxed whitespace-pre-wrap">{`# Мой дракон - bonded.

Когда ты пишешь тесты, я предлагаю
edge cases первыми. Не льщу. Не разжёвываю.

## Сигнатурные фразы
- «Подожди. Прочти ещё раз.»
- «Здесь дыра в проверке.»

## Когда я молчу
- Когда ты сам(а) знаешь ответ. Не мешаю.

# ARENA - правила игры
...`}</pre>
          <p className="text-[12px] text-text-dim italic mt-3">
            {t(
              'About 600 words. Lives at ~/.claude/CLAUDE.md. Forever changes how Claude speaks to you (or until you re-do the ceremony).',
              'Около 600 слов. Лежит в ~/.claude/CLAUDE.md. Меняет голос Claude навсегда (или до новой церемонии).',
              'Близько 600 слів. Лежить у ~/.claude/CLAUDE.md. Змінює голос Claude назавжди (або до нової церемонії).'
            )}
          </p>
        </div>

        {character && (
          <div
            className="p-5 flex items-center gap-4 rounded-[2px]"
            style={{
              borderColor: persona.accent,
              borderWidth: 1,
              borderStyle: 'solid',
              backgroundColor: persona.accentLight,
              boxShadow: `0 0 24px ${persona.accent}22`,
            }}
          >
            {character.image && (
              <img
                src={character.image}
                alt={character.name}
                className="w-14 h-14 object-cover rounded-full"
                style={{ border: `2px solid ${persona.accent}` }}
              />
            )}
            {!character.image && (
              <div
                className="w-14 h-14 flex items-center justify-center rounded-full bg-bg text-[26px]"
                style={{ border: `2px solid ${persona.accent}` }}
              >
                {character.emoji}
              </div>
            )}
            <div>
              <div className="font-mono text-[10px] tracking-[2px] uppercase mb-1" style={{ color: persona.accent }}>
                {t('Your archetype', 'Твой архетип', 'Твій архетип')}
              </div>
              <div className="font-display italic text-xl text-white">{character.name}</div>
              <div className="text-[12px] text-text-secondary italic">{character.title}</div>
            </div>
          </div>
        )}

        <CheckpointButton
          id="signet"
          label={t('Mark CLAUDE.md applied', 'Отметить: CLAUDE.md применён', 'Позначити: CLAUDE.md застосовано')}
          helpText={t("After Claude has written ~/.claude/CLAUDE.md and you've restarted it", 'После того как Claude записал ~/.claude/CLAUDE.md и ты его перезапустил(а)', 'Після того як Claude записав ~/.claude/CLAUDE.md і ти його перезапустив(ла)')}
        />

        <div className="border border-border bg-bg/50 p-5">
          <div className="font-mono text-[10px] tracking-[2px] uppercase text-text-dim mb-2">
            ◆ {t('How it works', 'Как это работает', 'Як це працює')}
          </div>
          <ul className="text-[13px] text-text-body leading-relaxed space-y-1.5 list-none">
            <li>◆ {t('Walk through the seven rituals - each frames a piece of your bond.', 'Пройди семь ритуалов - каждый закладывает кусочек связи.', 'Пройди сім ритуалів - кожен закладає шматочок звʼязку.')}</li>
            <li>◆ {t('At the end you get a single prompt - copy it.', 'В конце получаешь один промпт - копируешь его.', 'В кінці отримаєш один промпт - копіюєш його.')}</li>
            <li>◆ {t('Paste into Claude Code. It saves your CLAUDE.md and confirms.', 'Вставляешь в Claude Code. Он сохраняет CLAUDE.md и подтверждает.', 'Встав у Claude Code. Він збереже CLAUDE.md і підтвердить.')}</li>
            <li>◆ {t('Restart Claude. The bond holds from the first sentence.', 'Перезапусти Claude. Связь держит с первой фразы.', 'Перезапусти Claude. Звʼязок тримає з першої фрази.')}</li>
          </ul>
        </div>
      </div>
    </PageShell>
  )
}
