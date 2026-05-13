import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import confetti from 'canvas-confetti'
import { useWorkshopStore } from '../store/workshopStore'
import { usePersona } from '../store/usePersona'
import { CHARACTERS, pickCharacter } from '../data/characters'
import { getGraduationCloser } from '../data/signet/character_defaults'
import { useLocale } from '../i18n/store'
import { useT } from '../i18n/useT'
import { CHECKPOINT_IDS, CHECKPOINT_LABELS, getCheckpoints } from '../api/checkpoints'
import PageShell from '../core/PageShell'

/**
 * First flight - closing recap. Shows what the rider walked away
 * with, their checkpoint progress, and the call to the Resource Hub.
 * Rebuilt around the new flow (no XP/quiz/badges grind).
 */
export default function P15_Graduation() {
  const t = useT()
  const persona = usePersona()
  const nickname = useWorkshopStore(s => s.user.nickname)
  const studentId = useWorkshopStore(s => s.user.id)
  const lang = useLocale(s => s.lang)
  const characterId = useWorkshopStore(s => s.user.characterId)
  const character = pickCharacter(CHARACTERS.find(c => c.id === characterId), lang)
  const [checkpoints, setCheckpoints] = useState({})

  useEffect(() => {
    if (studentId) getCheckpoints(studentId).then(({ data }) => setCheckpoints(data || {}))
  }, [studentId])

  // Fire confetti once on mount
  useEffect(() => {
    const colors = [persona.accent || '#00E5CC', '#00E5CC', '#FEED00', '#FF65BE']
    setTimeout(() => confetti({ particleCount: 100, spread: 80, origin: { y: 0.55 }, colors }), 400)
    setTimeout(() => {
      confetti({ particleCount: 60, spread: 100, origin: { y: 0.5, x: 0.25 }, colors })
      confetti({ particleCount: 60, spread: 100, origin: { y: 0.5, x: 0.75 }, colors })
    }, 1100)
  }, [persona.accent])

  const completed = CHECKPOINT_IDS.filter(id => checkpoints[id]).length

  return (
    <PageShell pageIndex={33}>
      <div className="space-y-7">

        {/* Graduation banner — braid / rider silhouette as quiet
            backdrop. Sits above the character portrait circle. */}
        <div className="relative -mt-4 mb-2 h-[160px] overflow-hidden">
          <img
            src={`${import.meta.env.BASE_URL}hero/graduation-braid.jpg`}
            alt=""
            className="w-full h-full object-cover object-center opacity-60"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
        </div>

        {/* Hero - character portrait + name */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          {character?.image && (
            <div
              className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4 ring-2"
              style={{ '--tw-ring-color': persona.accent }}
            >
              <img src={character.image} alt={character.name} className="w-full h-full object-cover object-top" />
            </div>
          )}
          <h2 className="font-display text-3xl text-white">
            {t('Welcome home,', 'С возвращением,', 'З поверненням,')}{' '}
            <em className="italic" style={{ color: persona.accent }}>{nickname || character?.name}</em>
          </h2>
          {character && (() => {
            // The participant IS the rider (their archetype). Their
            // bonded partner is their DRAGON - and the dragon's name
            // is the one they wrote during the Bond Ritual (lives
            // in localStorage). Fall back to a neutral "your dragon"
            // if they skipped the ritual.
            let customDragonName = ''
            try {
              const raw = window.localStorage.getItem('bond-ritual-answers')
              if (raw) {
                const a = JSON.parse(raw)
                const n = (a?.name || '').trim()
                if (n && n.toLowerCase() !== 'unnamed') customDragonName = n
              }
            } catch (e) {}
            return (
              <p className="font-mono text-[12px] tracking-[2px] uppercase text-text-dim mt-2">
                {t('Threshed as', 'Прошёл(ла) Threshing как', 'Пройшов(ла) Threshing як')} {character.name} · {character.title}
                {' · '}
                <span style={{ color: persona.accent }}>
                  {customDragonName
                    ? <>{t('bonded with', 'связан(а) с', 'звʼязаний(на) з')} {customDragonName}</>
                    : t('bonded with your dragon', 'связан(а) со своим драконом', 'звʼязаний(на) зі своїм драконом')}
                </span>
              </p>
            )
          })()}
          {/* Character voice closer - block D from red-thread spec */}
          {(() => {
            const closer = getGraduationCloser(characterId || 'self', lang)
            if (!closer) return null
            return (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.5 }}
                className="font-display italic text-[clamp(18px,2.2vw,24px)] text-text-secondary mt-5 max-w-2xl mx-auto leading-relaxed"
              >
                {closer}
              </motion.p>
            )
          })()}
        </motion.div>

        {/* What you carry home */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="border border-qa-teal/30 bg-qa-teal/[0.04] p-6 rounded-[2px]"
        >
          <div className="font-mono text-[11px] tracking-[3px] uppercase text-qa-teal mb-4">
            ◆ {t('What you carry home', 'Что унесёшь домой', 'Що понесеш додому')}
          </div>
          <ul className="space-y-2 text-[14px] text-text-body leading-relaxed list-none">
            <li className="flex items-start gap-2">
              <span className="text-qa-teal mt-0.5">◆</span>
              <span>{t('A configured Claude Code - slash commands, agents, MCP servers, all set up for QA.', 'Настроенный Claude Code - слэш-команды, агенты, MCP-серверы, всё под QA.', 'Налаштований Claude Code - слеш-команди, агенти, MCP-сервери, усе під QA.')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-qa-teal mt-0.5">◆</span>
              <span>{t('Your personal CLAUDE.md - your dragon learns you, talks back in your persona\'s voice.', 'Твой персональный CLAUDE.md - дракон знает тебя и говорит в голосе твоего персонажа.', 'Твій персональний CLAUDE.md - дракон знає тебе і говорить голосом твого персонажа.')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-qa-teal mt-0.5">◆</span>
              <span>{t('A bot you wrote yourself - competing with five others on the projector.', 'Бот написанный тобой - соперничал на проекторе с пятью другими.', "Бот, написаний тобою - змагався на проекторі з пʼятьма іншими.")}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-qa-teal mt-0.5">◆</span>
              <span>{t('A bookmarkable Resource Hub - four autopilot prompts, hidden gems, quick reference.', 'Закладка на Resource Hub - четыре autopilot-промпта, hidden gems, quick reference.', "Закладка на Resource Hub - чотири autopilot-промпти, hidden gems, quick reference.")}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-qa-teal mt-0.5">◆</span>
              <span>{t('Your nickname - the gates open any day you come back.', 'Твой ник - ворота открыты в любой день когда захочешь вернуться.', 'Твій нік - ворота відкриті будь-якого дня, коли захочеш повернутися.')}</span>
            </li>
          </ul>
        </motion.div>

        {/* Checkpoint summary */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="border border-border bg-surface/40 p-5 rounded-[2px]"
        >
          <div className="font-mono text-[11px] tracking-[3px] uppercase text-text-dim mb-3">
            ◆ {t('Your trail', 'Твой путь', 'Твій шлях')}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CHECKPOINT_IDS.map(id => {
              const ts = checkpoints[id]
              return (
                <div
                  key={id}
                  className={`p-3 border rounded-[2px] text-center ${
                    ts ? 'border-qa-teal/40 bg-qa-teal/[0.06]' : 'border-border/40 bg-bg/50'
                  }`}
                >
                  <div className={`font-mono text-[10px] tracking-[2px] uppercase mb-1 ${
                    ts ? 'text-qa-teal' : 'text-text-dim'
                  }`}>
                    {ts ? '✓' : '·'} {CHECKPOINT_LABELS[id]}
                  </div>
                  {ts && (
                    <div className="font-mono text-[10px] text-text-dim">
                      {new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          <p className="font-mono text-[11px] text-text-dim text-center mt-3">
            {completed} / {CHECKPOINT_IDS.length} {t('checkpoints crossed', 'чекпоинтов пройдено', 'чекпоїнтів пройдено')}
          </p>
        </motion.div>

        {/* Resource Hub CTA lives on slide 34 alongside the
            certificate — graduation now flows straight to the
            closing line. */}

        {/* Closing line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.7 }}
          className="text-center font-display italic text-xl text-text-secondary"
        >
          {t(
            'You walked in a cadet. You leave a rider.',
            'Ты вошла кадетом. Уходишь всадником.',
            'Ти увійшла кадеткою. Виходиш вершницею.'
          )}
        </motion.p>

      </div>
    </PageShell>
  )
}
