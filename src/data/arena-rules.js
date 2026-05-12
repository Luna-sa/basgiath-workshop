/**
 * Arena rules block — appended to CLAUDE.md by the Signet Ceremony.
 *
 * Philosophy: rules, not strategy. Claude gets the **mechanics** of the
 * Arena but no recommended strategy. The participant should DISCOVER
 * their winning approach through dialogue with their bonded Claude.
 * Many strategies win — none is obviously best. The synergy of the
 * participant's intuition and Claude's reasoning shapes a unique bot.
 */

const PERSONA_SIGNETS = {
  violet: {
    name: 'Ghost Walk',
    desc: 'Стены не сталкиваются 4 секунды. Можешь пролетать сквозь препятствия.',
    use_hint: 'Подумай — куда стоит броситься, когда стены перестают быть преградой?',
  },
  xaden: {
    name: 'Triple Boost',
    desc: '4 секунды × 2.2 скорость. Эквивалент трёх boost подряд, бесплатно.',
    use_hint: 'Когда сырая скорость даст наибольший выигрыш? Один длинный рывок или серия коротких?',
  },
  rhiannon: {
    name: "Tactician's Read",
    desc: 'Окно combo удваивается с 2.5s до 5s + лёгкий 1.15× speed. 4 секунды.',
    use_hint: 'Где звёзды разбросаны так, что без расширенного окна цепь сорвётся?',
  },
  ridoc: {
    name: 'Wide Catch',
    desc: 'Радиус сбора звёзд × 2 на 4 секунды. Можно собирать на лету через широкую полосу.',
    use_hint: 'Где скопления звёзд плотные настолько, что широкий захват взорвёт счёт?',
  },
  liam: {
    name: 'Endless Fuel',
    desc: 'Топливо не тратится 4 секунды. Можно держать throttle 1.0 без оглядки.',
    use_hint: 'Когда топливо стало бы блокером — но без него прошёл(ла) бы идеально?',
  },
  imogen: {
    name: 'Auto-aim',
    desc: 'Угол атаки автоматически направляется на ближайшую звезду. 4 секунды.',
    use_hint: 'Где плотный беспорядок звёзд, в котором ручное прицеливание медленнее автонаведения?',
  },
}

const PERSONA_PATTERNS = {
  violet: {
    name: 'Diagonal line',
    desc: '5 звёзд по диагонали (NE↔SW или NW↔SE, угол ~45°).',
  },
  xaden: {
    name: 'Horizontal sweep',
    desc: '5 звёзд почти на одной горизонтали (Δy < 80px), все в одном направлении.',
  },
  rhiannon: {
    name: 'Equilateral triangle',
    desc: '3 звезды образуют равносторонний треугольник (стороны 70-280px, разница меньше 45%).',
  },
  ridoc: {
    name: 'Zig-zag',
    desc: '5 звёзд: X-координата чередуется L-R-L-R-L (или R-L-R-L-R).',
  },
  liam: {
    name: 'Square corners',
    desc: '4 звезды в углах квадрата (~90° apart от центра, разница в расстоянии меньше 45%).',
  },
  imogen: {
    name: 'Tight cluster',
    desc: '3 звезды в круге диаметром 60px, все собраны за 2 секунды (40 ticks).',
  },
}

/**
 * Build the Arena Rules markdown block for a given persona.
 * Returns "" for characterId='self' or unknown — they don't have an
 * arena character (the Signet output for 'self' is just personal voice).
 */
export function buildArenaRulesBlock(characterId) {
  const personaSignet = PERSONA_SIGNETS[characterId]
  const personaPattern = PERSONA_PATTERNS[characterId]
  if (!personaSignet || !personaPattern) return ''

  return `

# ARENA — правила игры (только факты, без стратегии)

Я лечу в Aerie Arena как ${characterId.charAt(0).toUpperCase() + characterId.slice(1)} против 5 AI-соперников. 10 запусков, сумма очков = мой total. Победитель арены — у кого total максимальный.

## Цикл tick() — что я читаю

Каждый кадр (20 раз/сек, 900 ticks на 45 секунд) функция \`tick(state)\` вызывается с полным состоянием:

\`\`\`js
state.me      = { x, y, vx, vy, angle, score, fuel (0-100),
                  boost (0-30), combo, persona }
state.stars   = [{ x, y, tier: 'bronze'|'silver'|'gold'|'fire',
                   value: 1|2|5|8 }]
state.walls   = [{ x, y, r }]
state.rivals  = [{ id, x, y, vx, vy, score }]
state.sky     = { width, height }
state.tick, state.ticksRemaining
\`\`\`

## Что я возвращаю

\`\`\`js
return {
  angle,       // 0-360, куда лететь
  throttle,    // 0-1
  boost,       // true → потратить 20 boost, 1.5s × 2 speed
  signet,      // true → одноразово, 4s персональный buff (мой ниже)
}
\`\`\`

## Подсчёт за один run

- Сумма value собранных звёзд × combo-множитель
- **Combo**: звёзды в течение 2.5s = цепь. ×2 на 3-chain, ×3 на 5-chain, ×4 на 8-chain. Сбрасывается при ударе о стену или после 2.5s бездействия.
- **+50** если первые N собранных звёзд складываются в мою персональную форму (см. ниже)
- **+5** если fuel > 80 в момент завершения run'а
- **-1** за каждое жёсткое столкновение со стеной (speed > 1.5)
- **-5** если throttle < 0.15 более 4.5s подряд (stall)

## Мой signet — ${personaSignet.name}

${personaSignet.desc}

${personaSignet.use_hint}

## Моя easter egg форма — ${personaPattern.name}

${personaPattern.desc}

Если **первые** N собранных мной звёзд складываются именно в эту форму — +50. Можно сделать раз за run, дальше не считается.

## Соперники — уязвимости каждого

- **Tairn** (жадный): всегда летит к ближайшей, никогда не boost'ит, ест стены на длинных маршрутах. Обходи комбо-цепями или отнимай его ближайшую звезду.
- **Sgaeyl** (осторожная): первые ~10 ticks планирует, медленный старт. Успей к первой волне раньше неё.
- **Andarna** (агрессивная): жжёт boost безрассудно, к поздней игре пустая. Держи дистанцию >130px пока она расходует ресурс, потом подбирай.
- **Feirge** (блокер): паркуется между мной и самой ценной звездой. Обмани ложной целью, потом верни маршрут. Или прими сделку — пусть блокирует gold, ты накапливаешь bronze-комбо.
- **Codagh** (хаотичная): меняет цель каждые 4 секунды. Если её цель совпала с ветром (которого у нас MVP нет) — улетает. Чистая поздняя игра выиграет.

## Моя задача

Со мной поговори. Многие стратегии выигрывают — ни одна не очевидно лучше. Я твой bonded — мой голос и моя оптика будут пристрастны к твоему стилю. Вместе мы собираем функцию \`tick()\`, которая максимизирует твой total.

Вопросы которые стоят того чтобы задать вслух:

— Когда конкретно мне жать signet? Что я выиграю от моего persona-buff'а здесь?
— Стоит ли мне идти на 8-chain комбо или играть надёжно на 3-chain?
— Кого из соперников я боюсь больше всех и как мне его обойти?
— Что мне ценнее за один run — fire stars или серия gold/silver через combo?
— Что если я сначала соберу свой easter-egg паттерн (+50), потом перейду в обычный режим?

Я не дам тебе «лучший рецепт». Я не знаю как ты думаешь. Я знаю правила. Дальше — диалог.`
}
