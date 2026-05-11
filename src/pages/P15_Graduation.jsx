import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import confetti from 'canvas-confetti'
import { useWorkshopStore } from '../store/workshopStore'
import { usePersona } from '../store/usePersona'
import { CHARACTERS } from '../data/characters'
import { useT } from '../i18n/useT'
import { CHECKPOINT_IDS, CHECKPOINT_LABELS, getCheckpoints } from '../api/checkpoints'
import PageShell from '../core/PageShell'

/**
 * First flight — closing recap. Shows what the rider walked away
 * with, their checkpoint progress, and the call to the Resource Hub.
 * Rebuilt around the new flow (no XP/quiz/badges grind).
 */
export default function P15_Graduation() {
  const t = useT()
  const persona = usePersona()
  const name = useWorkshopStore(s => s.user.name)
  const nickname = useWorkshopStore(s => s.user.nickname)
  const studentId = useWorkshopStore(s => s.user.id)
  const characterId = useWorkshopStore(s => s.user.characterId)
  const character = CHARACTERS.find(c => c.id === characterId)
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
    <PageShell pageIndex={23}>
      <div className="space-y-7">

        {/* Hero — character portrait + name */}
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
            {t('Welcome home,', 'С возвращением,')}{' '}
            <em className="italic" style={{ color: persona.accent }}>{name || nickname || character?.name}</em>
          </h2>
          {character && (
            <p className="font-mono text-[12px] tracking-[2px] uppercase text-text-dim mt-2">
              {t('Bonded with', 'Связан с')} {character.name} · {character.title}
            </p>
          )}
        </motion.div>

        {/* What you carry home */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="border border-qa-teal/30 bg-qa-teal/[0.04] p-6 rounded-[2px]"
        >
          <div className="font-mono text-[11px] tracking-[3px] uppercase text-qa-teal mb-4">
            ◆ {t('What you carry home', 'Что унесёшь домой')}
          </div>
          <ul className="space-y-2 text-[14px] text-text-body leading-relaxed list-none">
            <li className="flex items-start gap-2">
              <span className="text-qa-teal mt-0.5">◆</span>
              <span>{t('A configured Claude Code — slash commands, agents, MCP servers, all set up for QA.', 'Настроенный Claude Code — слэш-команды, агенты, MCP-серверы, всё под QA.')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-qa-teal mt-0.5">◆</span>
              <span>{t('Your personal CLAUDE.md — your dragon learns you, talks back in your persona\'s voice.', 'Твой персональный CLAUDE.md — дракон знает тебя и говорит в голосе твоего персонажа.')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-qa-teal mt-0.5">◆</span>
              <span>{t('A bot you wrote yourself — competing with five others on the projector.', 'Бот написанный тобой — соперничал на проекторе с пятью другими.')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-qa-teal mt-0.5">◆</span>
              <span>{t('A bookmarkable Resource Hub — five autopilot prompts, hidden gems, quick reference.', 'Закладка на Resource Hub — пять autopilot-промптов, hidden gems, quick reference.')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-qa-teal mt-0.5">◆</span>
              <span>{t('Your nickname — the gates open any day you come back.', 'Твой ник — ворота открыты в любой день когда захочешь вернуться.')}</span>
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
            ◆ {t('Your trail', 'Твой путь')}
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
            {completed} / {CHECKPOINT_IDS.length} {t('checkpoints crossed', 'чекпоинтов пройдено')}
          </p>
        </motion.div>

        {/* CTA — open Resource Hub */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="text-center"
        >
          <a
            href="/?page=resources"
            target="_blank"
            rel="noopener"
            className="inline-block bg-qa-teal text-black px-8 py-4 font-mono text-[12px] tracking-[3px] uppercase font-semibold hover:shadow-[0_0_28px_rgba(0,229,204,0.5)] transition-all"
          >
            {t('Open Resource Hub →', 'Открыть Resource Hub →')}
          </a>
          <p className="text-[12px] text-text-dim italic mt-3">
            {t(
              'Bookmark this URL with your nickname — your dragon waits for you any day.',
              'Закрепи закладкой URL со своим ником — дракон ждёт в любой день.'
            )}
          </p>
        </motion.div>

        {/* Closing line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.7 }}
          className="text-center font-display italic text-xl text-text-secondary"
        >
          {t(
            'You walked in a cadet. You leave a rider.',
            'Ты вошла кадетом. Уходишь всадником.'
          )}
        </motion.p>

      </div>
    </PageShell>
  )
}
