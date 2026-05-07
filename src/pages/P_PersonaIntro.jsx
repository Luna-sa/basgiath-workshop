import { useWorkshopStore } from '../store/workshopStore'
import { useT } from '../i18n/useT'
import PageShell from '../core/PageShell'
import CheckpointButton from '../components/CheckpointButton'
import { CHARACTERS } from '../data/characters'

/**
 * Workshop-flow intro to the Persona Builder. The full builder is
 * standalone at /?page=persona (own layout). This page sits in flow
 * and explains the activity, then links to the builder.
 */
export default function P_PersonaIntro() {
  const t = useT()
  const characterId = useWorkshopStore(s => s.user.characterId)
  const character = CHARACTERS.find(c => c.id === characterId)

  return (
    <PageShell pageIndex={8}>
      <div className="space-y-6">
        <div>
          <p className="font-mono text-[11px] tracking-[3px] uppercase text-qa-teal mb-3">
            ✦ {t('Your signet emerges', 'Твой сигнет проявляется')}
          </p>
          <h2 className="font-display text-3xl text-white leading-tight mb-3">
            {t('Seven questions, one CLAUDE.md.', 'Семь вопросов — твой CLAUDE.md.')}
          </h2>
          <p className="text-[15px] text-text-body leading-relaxed">
            {t(
              `Answer seven short questions. Claude folds them into a personal CLAUDE.md file — your dragon's voice, your rituals, what they hold about you. Drop the file into ~/.claude/CLAUDE.md. From that moment Claude greets you in your persona.`,
              'Ответь на семь коротких вопросов. Claude сворачивает их в персональный CLAUDE.md — голос твоего дракона, ритуалы, что он держит о тебе. Положишь файл в ~/.claude/CLAUDE.md — и Claude будет встречать тебя в этой роли.'
            )}
          </p>
        </div>

        {character && (
          <div className="border border-qa-teal/30 bg-qa-teal/[0.04] p-5 flex items-center gap-4">
            {character.image && (
              <img
                src={character.image}
                alt={character.name}
                className="w-14 h-14 object-cover rounded-full border border-qa-teal/40"
              />
            )}
            <div>
              <div className="font-mono text-[10px] tracking-[2px] uppercase text-text-dim mb-1">
                {t('Bonded with', 'Связан с')}
              </div>
              <div className="font-display italic text-xl text-white">{character.name}</div>
              <div className="text-[12px] text-text-secondary italic">{character.title}</div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3 items-center pt-2">
          <a
            href="/?page=persona"
            target="_blank"
            rel="noopener"
            className="inline-block bg-qa-teal text-black px-7 py-3 font-mono text-[12px] tracking-[3px] uppercase font-semibold hover:shadow-[0_0_24px_rgba(0,229,204,0.4)] transition-all"
          >
            {t('Open Persona Builder →', 'Открыть сборку персонажа →')}
          </a>
        </div>

        <CheckpointButton
          id="signet"
          label="Mark CLAUDE.md applied"
          helpText="After Claude has written ~/.claude/CLAUDE.md and you've restarted it"
        />

        <div className="border border-border bg-bg/50 p-5">
          <div className="font-mono text-[10px] tracking-[2px] uppercase text-text-dim mb-2">
            ◆ {t('Tips', 'Подсказки')}
          </div>
          <ul className="text-[13px] text-text-body leading-relaxed space-y-1.5 list-none">
            <li>{t('Answer in any order. Saved as you type.', 'Отвечай в любом порядке. Сохраняется по мере печати.')}</li>
            <li>{t('The preview on the right updates live.', 'Превью справа обновляется live.')}</li>
            <li>{t('When all 7 are answered, the action buttons unlock.', 'Как только 7 заполнены — кнопки активируются.')}</li>
            <li>{t('Apply via Claude Code: paste the autopilot prompt and let Claude install.', 'Apply via Claude Code: вставь autopilot-промпт и Claude сам поставит файл.')}</li>
          </ul>
        </div>
      </div>
    </PageShell>
  )
}
