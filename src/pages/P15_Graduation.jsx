import { useEffect, useState, useRef } from 'react'
import { motion } from 'motion/react'
import confetti from 'canvas-confetti'
import { useWorkshopStore } from '../store/workshopStore'
import { usePersona } from '../store/usePersona'
import { BADGES } from '../data/badges'
import { CHARACTERS } from '../data/characters'
import PageShell from '../core/PageShell'

function AnimatedCounter({ target, duration = 2000 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    let start = 0
    const startTime = Date.now()
    const tick = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) ref.current = requestAnimationFrame(tick)
    }
    ref.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(ref.current)
  }, [target, duration])

  return <>{count}</>
}

export default function P15_Graduation() {
  const xp = useWorkshopStore(s => s.xp)
  const badges = useWorkshopStore(s => s.badges)
  const name = useWorkshopStore(s => s.user.name)
  const characterId = useWorkshopStore(s => s.user.characterId)
  const persona = usePersona()
  const character = CHARACTERS.find(c => c.id === characterId)
  const [confettiFired, setConfettiFired] = useState(false)

  // Fire confetti on mount
  useEffect(() => {
    if (confettiFired) return
    setConfettiFired(true)
    const colors = [persona.accent, '#00E5CC', '#F59E0B', '#FF65BE']

    // First burst
    setTimeout(() => {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors })
    }, 500)
    // Second burst
    setTimeout(() => {
      confetti({ particleCount: 50, spread: 90, origin: { y: 0.5, x: 0.3 }, colors })
      confetti({ particleCount: 50, spread: 90, origin: { y: 0.5, x: 0.7 }, colors })
    }, 1200)
  }, [])

  const badgeEmojis = badges.map(id => BADGES.find(x => x.id === id)?.emoji).join(' ')

  const telegramText = [
    `🐉 Академия Басгиат — воркшоп пройден!`,
    ``,
    `⚡ ${xp} XP`,
    `🏅 ${badges.length} бейджей: ${badgeEmojis}`,
    `🎭 Персонаж: ${character?.name} (${character?.title})`,
    ``,
    `За 60 минут:`,
    `✅ Настроил(а) полную QA-экосистему — 7 команд, 4 агента, 3 MCP`,
    `✅ AI сам тестировал сайт через браузер`,
    `✅ Получил(а) AI-ревью баг-репорта от Groq`,
    ``,
    `Воркшоп проводит @ainastasia — QA Tech Lead, AI Clan Champion`,
  ].join('\n')

  const linkedinText = [
    `Just completed an interactive AI for QA workshop — "Basgiath Academy" 🐉`,
    ``,
    `In 60 minutes, I set up a complete QA ecosystem:`,
    `→ 7 slash commands (/bug-report, /test-cases, /review...)`,
    `→ 4 AI agents (qa-reviewer, test-generator, security-scanner, bug-triager)`,
    `→ 3 MCP servers (Playwright, Fetch, Context7)`,
    ``,
    `The AI literally opened a browser and tested a web app on its own. 🤯`,
    ``,
    `Final score: ${xp} XP | ${badges.length} badges earned`,
    ``,
    `#QA #AITesting #ISTQB #ClaudeCode #Cursor #QAClan`,
  ].join('\n')

  const copyText = [
    `🐉 Академия Басгиат — AI для QA`,
    ``,
    `${xp} XP | ${badges.length} бейджей ${badgeEmojis}`,
    `Персонаж: ${character?.name}`,
    ``,
    `7 команд + 4 агента + 3 MCP-сервера`,
    `Всё настроено за 60 минут`,
    ``,
    `→ basgiath-workshop.onrender.com`,
  ].join('\n')

  return (
    <PageShell pageIndex={15}>
      <div className="space-y-6">
        {/* Portrait + animated stats */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="overflow-hidden border rounded-lg"
          style={{ borderColor: persona.accentBorder }}
        >
          <div className="relative h-56 overflow-hidden bg-surface">
            {character?.image ? (
              <img src={character.image} alt={name || ''} className={`w-full h-full object-cover ${character?.imagePosition || 'object-center'}`} loading="eager" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"><span className="text-6xl">{character?.emoji || '🐉'}</span></div>
            )}
            <div className="absolute bottom-0 left-0 right-0 h-[35%] bg-gradient-to-t from-[#0A0A0A] to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
              <div className="font-display text-2xl text-white drop-shadow-lg">{name}</div>
              <div className="font-mono text-[13px] tracking-[3px] uppercase drop-shadow-lg" style={{ color: persona.accent }}>{character?.title}</div>
            </div>
          </div>

          <div className="p-6 text-center" style={{ backgroundColor: persona.accentLight }}>
            {/* Animated XP counter */}
            <div className="font-display text-5xl font-bold mb-1" style={{ color: persona.accent }}>
              <AnimatedCounter target={xp} duration={2500} /> XP
            </div>

            {/* Staggered badge reveals */}
            <div className="flex justify-center gap-3 flex-wrap mt-4">
              {badges.map((id, i) => {
                const b = BADGES.find(x => x.id === id)
                return (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, scale: 0, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 1.5 + i * 0.3, type: 'spring', stiffness: 200 }}
                    className="flex flex-col items-center gap-1"
                  >
                    <span className="text-2xl">{b?.emoji}</span>
                    <span className="font-mono text-[10px] text-text-dim">{b?.name}</span>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Final words */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2.5 }}
          className="p-5 border border-l-[4px] rounded-lg"
          style={{ borderColor: persona.accentBorder, borderLeftColor: persona.accent, backgroundColor: persona.accentLight }}
        >
          <div className="font-mono text-[12px] tracking-[2px] uppercase mb-2" style={{ color: persona.accent }}>Финальные слова</div>
          <p className="font-display italic text-text-body text-lg leading-relaxed">«{persona.voice.finalWords}»</p>
        </motion.div>

        {/* Share section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5 }}
          className="space-y-4"
        >
          <div className="font-mono text-[13px] tracking-[2px] uppercase text-text-dim text-center">Поделиться</div>

          {/* Share card preview */}
          <div className="p-5 border border-[#2E2E2E] bg-[#141414] rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              {character?.image && (
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border-2" style={{ borderColor: persona.accent }}>
                  <img src={character.image} alt="" className="w-full h-full object-cover object-top" />
                </div>
              )}
              <div>
                <div className="text-[15px] text-white font-medium">{name}</div>
                <div className="font-mono text-[11px]" style={{ color: persona.accent }}>{character?.title} · {xp} XP · {badgeEmojis}</div>
              </div>
            </div>
            <p className="text-[13px] text-text-secondary leading-relaxed">
              7 команд + 4 агента + 3 MCP — полная QA-экосистема за 60 минут
            </p>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => {
                navigator.clipboard.writeText(copyText)
                const btn = document.getElementById('copy-btn')
                if (btn) { btn.textContent = '✓ Готово!'; setTimeout(() => { btn.textContent = '📋 Копировать' }, 2000) }
              }}
              id="copy-btn"
              className="px-4 py-3 border border-[#2E2E2E] bg-[#141414] text-text-secondary text-[14px] hover:border-qa-teal/40 hover:text-white transition-all cursor-pointer rounded-lg text-center"
            >
              📋 Копировать
            </button>
            <a
              href={`https://t.me/share/url?url=${encodeURIComponent('https://basgiath-workshop.onrender.com')}&text=${encodeURIComponent(telegramText)}`}
              target="_blank"
              className="px-4 py-3 border border-[#2E2E2E] bg-[#141414] text-text-secondary text-[14px] hover:border-[#26A5E4]/40 hover:text-[#26A5E4] transition-all cursor-pointer rounded-lg text-center"
            >
              ✈️ Telegram
            </a>
            <a
              href={`https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(linkedinText)}`}
              target="_blank"
              className="px-4 py-3 border border-[#2E2E2E] bg-[#141414] text-text-secondary text-[14px] hover:border-[#0A66C2]/40 hover:text-[#0A66C2] transition-all cursor-pointer rounded-lg text-center"
            >
              💼 LinkedIn
            </a>
          </div>
        </motion.div>

        {/* What you got */}
        <div>
          <div className="font-mono text-[13px] tracking-[2px] uppercase text-text-dim mb-3">Что у тебя теперь есть</div>
          <div className="grid grid-cols-2 gap-2">
            {['7 slash-команд для QA', '4 AI-агента', '3 MCP-сервера', 'Настроенный CLAUDE.md', 'Опыт AI-тестирования', 'Баг-репорт с AI-ревью'].map((h, i) => (
              <div key={i} className="flex gap-2 p-3 border border-[#2E2E2E] bg-[#141414] rounded-lg">
                <span className="text-qa-teal text-sm">✓</span>
                <span className="text-[14px] text-text-body">{h}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Series */}
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { n: 'I', t: 'Отбор', d: 'QA-экосистема', done: true },
            { n: 'II', t: 'Сигнет', d: 'Hooks, Skills, Plan mode' },
            { n: 'III', t: 'Тактика', d: 'Агенты, интеграции' },
            { n: 'IV', t: 'Военные игры', d: 'Хакатон' },
          ].map(w => (
            <div key={w.n} className={`p-4 border rounded-lg ${w.done ? 'border-l-[4px]' : 'border-[#2E2E2E] bg-[#141414]'}`}
              style={w.done ? { borderColor: persona.accentBorder, borderLeftColor: persona.accent, backgroundColor: persona.accentLight } : {}}>
              <span className="font-display text-xl text-text-dim italic">{w.n}</span>
              <h3 className="font-display text-[16px] text-white">{w.t}</h3>
              <p className="text-[13px] text-text-dim">{w.d}</p>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  )
}
