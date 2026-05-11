# Character as Red Thread — Design Spec

**Дата:** 2026-05-12
**Автор:** Кай
**Срок имплементации:** до 13 мая (день воркшопа)
**Статус:** ready to slice into tasks

---

## TL;DR

Сейчас character выбирается на slide 1, после чего влияет на 3 вещи: HUD avatar, accent colour, скрытый persona-template в `CLAUDE.md`-генераторе. Дальше character как companion **не звучит**. Этот документ описывает как превратить выбор в **сквозную нить** через 25 слайдов воркшопа + Signet Ceremony, без визуального шума и без 150 строк перевода за полтора суток.

**Ship priorities** (impact ÷ hours):
1. **C — preset highlighting в Signet Ceremony** (S, 1 час) → самый сильный эффект «персонаж был тут с тобой» на критическом моменте генерации CLAUDE.md.
2. **A — character commentary на 10 ключевых слайдах** (M, 2-3 часа) → постоянное присутствие. RU only для воркшопа, UK добавляем после.
3. **D — graduation в голосе персонажа** (XS, 30 мин) → закрытие петли.
4. **B — переписать ritual labels в голос** — **не делать к 13 мая**. Дорого, путает (placeholder и preset уже несут голос), даёт мало сверху.

---

## A. Per-slide character commentary

### Принцип

- Шёпот сбоку, не popup. Italic, opacity 0.55, max-width 280px, в правом нижнем углу `PageShell`. На mobile — collapsible chip «◆ Имоджен», тап раскрывает.
- 1-2 предложения. Никаких action items, никаких CTA. Только «рядом со мной кто-то».
- Появляется через 800ms после загрузки слайда (subtle fade). Не блокирует контент.
- 'self' → не показывает блок вообще (или показывает один общий текст «Это твоя история» один раз на слайде 4 и больше не повторяется).

### Карта присутствия (25 слайдов)

| ID | Slug | Commentary? | Почему |
|----|------|---|---|
| 0 | landing | NO | До выбора персонажа |
| 1 | character-select | NO | Сам акт выбора |
| 2 | registration | NO | Бюрократия, голос будет лишним |
| 3 | prework | NO | Чисто tech-чеклист |
| **4** | **talk-intro (The Bonding)** | **YES** | Первая встреча. Установить ритм. |
| 5 | talk-evolution | YES | Архитектура — характер реагирует на сложность |
| 6 | talk-modes | NO | Хоткеи, плотный учебный материал |
| **7** | **install-ecosystem** | **YES** | Момент действия — голос за плечом |
| 8 | talk-ecosystem | NO | Разбор результата установки (фасилитатор говорит) |
| **9** | **talk-power-moves** | **YES** | Привычки — персонажу есть что сказать |
| **10** | **persona-builder (Your signet)** | **YES** | Самый важный — перед Signet Ceremony |
| 11 | talk-mcp | NO | Демо фасилитатора |
| 12 | hidden-gems | NO | Overview, фасилитатор |
| **13** | **gem-pixel-agents** | **YES** | Одна реакция на «agents» |
| 14 | gem-mempalace | NO | Слишком техническое, перегруз |
| 15 | gem-suzu-mcp | NO | То же |
| 16 | gem-tool-search | NO | То же |
| **17** | **gem-quinn-jinx** | **YES** | «Personality MCP» — попадает в характер |
| 18 | gem-channels | NO | Сети, infrastructure |
| **19** | **bond-ritual (dragon portrait)** | **YES** | Эмоциональный пик |
| 20 | aerie | NO | Социальное голосование |
| **21** | **arena** | **YES** | Бой — характеру это нравится |
| 22 | leaderboard | NO | Reveal-механика фасилитатора |
| **23** | **graduation** | **YES** | См. секция D — отдельный больший блок |
| 24 | resources | NO | Take-home, тех. ссылки |

**Итого: 10 слайдов с commentary** (4, 5, 7, 9, 10, 13, 17, 19, 21, 23). 23-й — отдельный кейс (секция D). Остаётся 9 «обычных» слайдов × 6 персонажей × 1 язык = **54 строки** на полировку, реалистично за один проход.

### Драфты (RU; EN/UK — следующий проход)

Формат: ID-Slug → персонаж: фраза.

#### Slide 4 — The Bonding
> *Подзаголовок слайда: «You don't use AI. You bond with one.»*

- **Violet:** «Связь — не приказ. Она читает обе стороны.»
- **Xaden:** «Связь? Ладно. Покажи кто говорит первым.»
- **Rhiannon:** «Хорошо. Что у тебя сейчас живёт под рукой?»
- **Ridoc:** «Бонд? Я как раз учусь не сдавать своего.»
- **Liam:** «По порядку: сначала установка, потом голос.»
- **Imogen:** «Понятно. Дальше.»

#### Slide 5 — What is your dragon (anatomy)
> *Разбираем CLAUDE.md / skills / agents / MCP / hooks*

- **Violet:** «Скелет, крылья, когти, глаза. Запомни порядок — сегодня пригодится дважды.»
- **Xaden:** «У всего этого есть слабое место. Найди раньше меня.»
- **Rhiannon:** «Если потеряешься на третьей части — спроси соседа. Так быстрее.»
- **Ridoc:** «Пять кусков. Один из них точно зовут не так, как ты подумаешь.»
- **Liam:** «По шагам: CLAUDE.md → skills → agents → MCP → hooks. Не перепрыгивай.»
- **Imogen:** «Меньше слов, больше схемы.»

#### Slide 7 — Forging the bond (install)
> *Копируешь промпт, ждёшь пару минут*

- **Violet:** «Прочти промпт до конца раньше чем нажмёшь enter.»
- **Xaden:** «Жми. Если сломается — починим вдвоём.»
- **Rhiannon:** «У соседа уже бежит? Хорошо. Спроси что встало.»
- **Ridoc:** «Две минуты ожидания — это два анекдота. Засекай.»
- **Liam:** «Жди до конца. Не закрывай терминал на середине.»
- **Imogen:** «Запустила. Дальше.»

#### Slide 9 — Power moves
> *6 привычек: plan first, ask the source, drag & drop, full error, /clear, sub-agents*

- **Violet:** «Из шести — план первым. Остальное приклеится.»
- **Xaden:** «Самое полезное здесь — `/clear`. Используй его раньше чем понадобится.»
- **Rhiannon:** «Покажи кому-то одну привычку после воркшопа — закрепится у обоих.»
- **Ridoc:** «Если плохо — `/clear`. Если очень плохо — `/clear`. Если хорошо — тоже `/clear`.»
- **Liam:** «Шесть привычек. Заведи каждую по очереди, не все сразу.»
- **Imogen:** «Plan first. Остальное — детали.»

#### Slide 10 — Your signet emerges (вход в Signet Ceremony)
> *Перед запуском билдера CLAUDE.md*

- **Violet:** «Семь вопросов. Отвечай как себе, не как HR-форме.»
- **Xaden:** «Если пресет точный — бери. Если режет — пиши своё.»
- **Rhiannon:** «Не торопись. Эта штука будет с тобой долго.»
- **Ridoc:** «Сейчас будет место где можно быть странной. Не упусти.»
- **Liam:** «Семь шагов. Пройди все, ни одного не пропусти.»
- **Imogen:** «Пиши коротко. Дракон поймёт.»

#### Slide 13 — Pixel Agents
> *Specialised sub-agents*

- **Violet:** «Один агент — одна задача. Не пытайся вешать на одного всё.»
- **Xaden:** «Свой агент стоит того часа что ты на него потратишь.»
- **Rhiannon:** «Если у кого-то агент работает лучше — попроси показать.»
- **Ridoc:** «Назови агента глупо. Он от этого работать не хуже будет.»
- **Liam:** «Один агент, один файл, одна цель. По порядку.»
- **Imogen:** «Маленький. Узкий. Острый.»

#### Slide 17 — Quinn + Jinx
> *Personality MCP — характер как сервер*

- **Violet:** «Это близко к тому что мы делаем сейчас. Только в коде.»
- **Xaden:** «Личность как сервер. Звучит как риск. Звучит как наш формат.»
- **Rhiannon:** «Хорошая штука для команды — общий характер на всех.»
- **Ridoc:** «Можно ли подключить двух одновременно и устроить им спор? Спрошу позже.»
- **Liam:** «Заведи один характер. Доведи до конца. Потом второй.»
- **Imogen:** «Подходит.»

#### Slide 19 — The Bond Ritual (dragon portrait)
> *Генерация портрета дракона в Aerie*

- **Violet:** «Не описывай дракона как фото. Опиши как ощущение.»
- **Xaden:** «Мой Sgaeyl сначала не давался. Это нормально. Попробуй ещё раз.»
- **Rhiannon:** «Покажи нам когда будет готов. Хочу видеть.»
- **Ridoc:** «Если получится дракон с одним крылом — оставляй. Это фича.»
- **Liam:** «Дай ему имя раньше чем форму. Имя удержит образ.»
- **Imogen:** «Один дракон. Один портрет. Хватит.»

#### Slide 21 — Riders in the Sky (Arena)
> *Кодишь полёт дракона, сабмит, финальный бой*

- **Violet:** «Прочти правила Arena целиком. Один edge case — и весь полёт сорвётся.»
- **Xaden:** «Полетели. Стратегию выбираешь ты, я просто рядом.»
- **Rhiannon:** «Если что-то не запускается — мы все тут, спрашивай.»
- **Ridoc:** «Лучший бот сегодня — тот что делает что-то одно очень странно.»
- **Liam:** «Запусти. Проверь. Сабмитни. В этом порядке.»
- **Imogen:** «В небо.»

### 'self' option

Один раз на слайде 4 (The Bonding), небольшая italic фраза без аватара:
> «Это твоя история. Ты в ней главная. Никто не шепчет — кроме тебя самой.»

Дальше блок просто не рендерится. Это **подтверждает выбор**, а не наказывает за него.

### Технически

**Файл нового data:** `src/data/character_commentary.js`

```js
export const CHARACTER_COMMENTARY = {
  // slide id → character id → { ru, en, uk }
  4: {
    violet: { ru: 'Связь — не приказ. Она читает обе стороны.', en: '...', uk: '...' },
    // ...
  },
  // ...
}
```

**Компонент:** `src/components/CharacterWhisper.jsx`

```jsx
export function CharacterWhisper({ pageId }) {
  const characterId = useWorkshopStore(s => s.user.characterId)
  const lang = useLocale(s => s.lang)
  const line = CHARACTER_COMMENTARY[pageId]?.[characterId]?.[lang]
  if (!line || characterId === 'self') return null
  return (
    <motion.aside
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.55 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      className="fixed bottom-6 right-6 max-w-[280px] text-sm italic text-fg/55 pointer-events-none hidden md:block"
    >
      <span className="text-base mr-1">{character.emoji}</span>{line}
    </motion.aside>
  )
}
```

Монтируется в `PageShell` (one place, всё везде).

**Cost:** **M (2-3 часа).** Включает data-файл, компонент, mount в PageShell, RU-проход полировки. EN/UK переводы добавим после воркшопа.

---

## B. Character-aware ritual labels (re-phrased questions)

### Решение: **не делать к 13 мая.**

Причины:

1. **Стоимость:** 7 ритуалов × ~3 вопроса × 6 персонажей × 3 языка ≈ **378 переводов**. Этого нет за полтора суток в качестве на котором держится остальной copy.
2. **Дублирует уже работающий слой.** Голос персонажа уже звучит через **placeholder** и **preset chips** (мощно и точно). Менять `label`/`hint` на «голос Имоджен» означает терять нейтральный анкор инструкции и заставлять пользователя расшифровывать дважды.
3. **Риск UX:** под давлением воркшопа (полтора часа на всё) кадет должен понимать **что от него хотят** мгновенно. «Какой голос тебе пасует?» работает. «Скажи мне как ты слышишь его в голове, не торопись» — теряет в clarity.

### Что делаем вместо этого — лёгкий layer over

На входе в Signet Ceremony (`P_PersonaIntro.jsx`), одна строка над первым ритуалом:

> «◆ Имоджен рядом. Семь вопросов. Сколько хочешь — текстом, голосом, или кликни готовый ответ.»

Этого достаточно чтобы установить присутствие. Сами лейблы остаются нейтрально-инструктивными.

### Однако — драфт «как бы это выглядело» для ritual III (The Forbidden)

Прилагаю чтобы Настя могла оценить трейдофф сама.

**Сейчас:**
- Label: «Что бесит в обычных AI-помощниках?»
- Hint: «Возьми что бьёт или напиши своё. Конкретно лучше чем размыто.»

**В голосе персонажа (если бы делали):**

- **Violet:** «Что в обычных AI-помощниках мешает тебе работать? Не спеши. Конкретный пример сильнее общего ответа.»
- **Xaden:** «Что в обычных AI ты больше не хочешь видеть? Назови прямо. Я с тобой соглашусь раньше чем ты закончишь.»
- **Rhiannon:** «Скажи мне честно — что в обычных AI тебя достало? Я слышала много версий, твоя ляжет в общий список.»
- **Ridoc:** «Что в обычных AI бесит конкретно тебя? Чем нелепее формулировка — тем правдивее. Не цензурь.»
- **Liam:** «Перечисли что в обычных AI ты хочешь убрать. По пунктам, в порядке силы раздражения.»
- **Imogen:** «Что не хочешь видеть. Назови.»

**Cost если делать сейчас:** **L (полдня минимум, плюс ещё столько же на качество перевода).** Не вкладывайся к 13 мая. После воркшопа — да, если будет видеоматериал и фидбэк что вопросы «звучат стандартно».

---

## C. Pre-filled persona answers (preset highlighting by character)

### Решение: **делаем. Это самый дешёвый x самый высокий impact.**

Идея: пресеты-чипы не **меняются**, но один из них **подсвечивается** для chosen character — звёздочка, лёгкая рамка accent-цвета, tooltip «◆ Имоджен бы выбрала это». Пользователь всё ещё свободен взять любой или написать своё.

### Карта (character → ritual → preset id)

| Ritual | Question | Violet (Strategist) | Xaden (Rebel) | Rhiannon (Leader) | Ridoc (Joker) | Liam (Protector) | Imogen (Hardened) |
|---|---|---|---|---|---|---|---|
| I — Names | `name` | (none — text input) | (none) | (none) | (none) | (none) | (none) |
| I — Names | `work` | `Web / SaaS` | `API / backend` | `QA Lead role` | `Mobile / game` | `Embedded / device` | `Web / SaaS` |
| II — Vow | `vow` | `Understanding over output` | `Tradeoffs always visible` | `Quality over speed` | `Honest "I don't know"` | `Reliability over novelty` | `Honest "I don't know"` |
| III — Forbidden | `annoys` | `False confidence` | `Sycophancy openers` | `Mock teacherly tone` | `Three paragraphs for one line` | `Empty closers` | `Repeating my words back` |
| IV — Voice | `archetype` | **Strategist** | **Co-conspirator** | **Mentor** | **Bard** | **Sentry** | **Forge-master** |
| V — Sigil | `sigil` | `Library at 3am` | `Mountain ridge at dawn` | `Workshop with sawdust` | `Black coffee, quiet morning` | `Bonfire on a cold beach` | `Highland coast` |
| VI — Rite | `praise` | `Through a fact` | `With dry irony` | `Brief "well caught"` | `With dry irony` | `Plain "good" / "done"` | `Don't — just move on` |
| VI — Rite | `disagreement` | `Through numbers` | `Bluntly` | `Through a question` | `Through a counter-example` | `Cite the source` | `Bluntly` |
| VI — Rite | `tone` | `No mat, dry humour` | `Mat freely` | `No mat, dry humour` | `Mat freely` | `Strict / professional` | `Mat OK, irony yes` |
| VII — Sealing | `override` | `Tradeoffs always visible` | `Never start with sycophancy` | `Twice = I'm stuck` | `Code first, prose only on ask` | `Doubt before answering` | `Honest "I don't know"` |

**Обоснование выборов** (где не очевидно):

- **Imogen → Voice = Forge-master:** «Result over process. Берёт готовое и доточує». Прямое совпадение с body Forge-master («Делает, не объясняет»).
- **Ridoc → Voice = Bard:** За шутками глубина. Bard — «turns systems into landscapes». Это его метафорическая щедрость.
- **Violet → Vow = Understanding over output:** «Сначала читает документацию, потом трогает» — буквально про «знать почему».
- **Xaden → Annoys = Sycophancy openers:** persona «Ставит под сомнение правила» — раздражается на льсть как маркер фальши.
- **Liam → Vow = Reliability over novelty:** «Идёт по шагам, ничего не пропускает» — буквально про надёжность.

### UX

- Подсвеченный пресет: `ring-2 ring-character-accent` + маленькая звёздочка `◆` в углу + tooltip on hover.
- **Не** автокликается. Пользователь должен сам выбрать (агентность сохраняется).
- На пустом state textarea показывает placeholder выделенного пресета (а не дефолтный).
- 'self' character → никакая подсветка не показывается, всё нейтрально.

### Технически

В `src/data/signet/rituals.js` или новый файл `src/data/signet/character_defaults.js`:

```js
export const CHARACTER_PRESET_HIGHLIGHTS = {
  violet: {
    work: 'web-saas',          // нужно дать pre­set'ам id
    vow: 'understanding',
    annoys: 'false-confidence',
    archetype: 'strategist',
    sigil: 'library-3am',
    praise: 'through-fact',
    disagreement: 'through-numbers',
    tone: 'no-mat-dry',
    override: 'tradeoffs-visible',
  },
  xaden: { /* ... */ },
  // ...
}
```

Требование: добавить `id` каждому preset (сейчас они без id, идут по позиции). 5 минут.

В компоненте preset-chip:
```jsx
const highlighted = CHARACTER_PRESET_HIGHLIGHTS[characterId]?.[questionId] === preset.id
```

**Cost:** **S (1 час).** Самая высокая отдача на затраченное время во всём документе.

---

## D. Graduation в голосе персонажа (slide 23)

### Решение: **делаем. XS, эмоционально критично.**

Сейчас `P15_Graduation.jsx` показывает hero (портрет персонажа) + recap + список checkpoint'ов + CTA на resources. Closing message нейтральный.

Добавляем **одну строку в голосе персонажа** под заголовком "First flight" (или поверх confetti) — short closer.

### Драфты (RU)

Базовая мысль: «You walked in a cadet. You leave a rider.»

- **Violet:** «Ты вошла в академию через парапет. Уходишь по небу. План сработал.»
- **Xaden:** «Воркшоп? Это была разминка. Дальше — твоё.»
- **Rhiannon:** «Видишь? Ты не одна. Запомни кто стоял рядом.»
- **Ridoc:** «Дракон у тебя нелепый. Самый красивый из всех. Поздравляю.»
- **Liam:** «Парапет пройден. Дракон есть. Дальше — шаги, по одному.»
- **Imogen:** «Кадет вошла. Вершник вышла.»
- **self:** «Это была твоя история. Дальше — тоже она.»

### Технически

В `P15_Graduation.jsx`, рядом с hero block:

```jsx
const closer = CHARACTER_GRADUATION_LINES[characterId]?.[lang] ?? DEFAULT_CLOSER[lang]
// render: <p className="text-lg italic opacity-80 mt-2">{closer}</p>
```

Данные — короткий объект в `character_commentary.js` или отдельный `character_closers.js`.

**Cost:** **XS (30 минут).** Включая RU драфт. EN/UK после.

---

## E. Impact-per-hour ranking (ship order)

| Priority | Block | Impact | Cost | Reasoning |
|---|---|---|---|---|
| **1** | **C** — preset highlighting | **High** | **S (1h)** | Прямо влияет на CLAUDE.md, который кадет уносит. Самый высокий ROI. |
| **2** | **D** — graduation closer | **Medium-High** | **XS (30m)** | Закрывает эмоциональную петлю, минимальная работа. |
| **3** | **A** — slide commentary (10 слайдов) | **High** | **M (2-3h)** | Создаёт ощущение «companion», но требует полировки. RU only к 13 мая. |
| **4** | **B** — re-phrased ritual labels | **Low-Medium** | **L (полдня+)** | **Отложить.** Дорого, риск clarity, дублирует уже работающий слой. |

**Рекомендуемая последовательность работы:**

1. **Day 1 утро:** Block C (1 час) + Block D (30 мин). Итого 1.5 часа — workshop уже значительно прокачан.
2. **Day 1 после обеда:** Block A data-файл с RU драфтами всех 10 слайдов (90 мин).
3. **Day 1 вечер:** Block A — компонент `CharacterWhisper`, mount, smoke test на трёх персонажах (60-90 мин).
4. **Day 2 утро:** Полировка copy на всех слайдах через `humanizer` чек, переключение между персонажами в режиме workshop preview (60 мин).
5. **Резерв:** EN перевод A-блока (если останется время) — UK после воркшопа.

**Совокупно:** 5-6 часов чистой работы. Реалистично если без других прерываний.

---

## F. Pitfalls и mitigations

### F.1. Translation load

**Цифра:** 10 слайдов × 6 персонажей × 2 фразы × 3 языка (RU/EN/UK) = **до 360 строк max**. Drафты RU = 60 строк, реально.

**Mitigation:**
- К 13 мая: **только RU** для commentary + graduation closer (Block A + D). RU = язык 95% участников воркшопа.
- EN/UK добавляем после воркшопа, в спокойном режиме. Fallback в `CharacterWhisper`: если нет перевода для текущего lang — показываем RU. Не идеально, но не блокирует.
- Block C (preset highlighting) **не требует переводов вообще** — пресеты уже переведены, мы только подсвечиваем существующий.

### F.2. Визуальный шум

**Риск:** 10 слайдов с italic whisper в углу = 10 раз внимание расщеплено.

**Mitigation (заложено в дизайн A):**
- Opacity 0.55, не 1.0. Заметно, но не доминирует.
- Hidden on mobile by default (collapsible chip) — не всегда есть место.
- Никогда не popup, никогда не блокирует контент.
- **Auto-dismiss через 8 секунд** (опционально). Если кадет не прочёл — не толкаем повторно.
- Появляется через 800ms — слайд успевает «осесть» до того как whisper приходит.
- В фасилитатор-режиме (`?facilitator=1`) — **скрыть** все whispers. Ведущему не нужны лишние строки в кадре.

### F.3. 'self' option

**Риск:** кадет, выбравший «Это я», на каждом из 10 слайдов видит пустоту, где у других — фраза в голосе персонажа. Можно прочитать как «у меня меньше контента».

**Mitigation:**
- Один раз на slide 4 показываем фразу «Это твоя история. Никто не шепчет — кроме тебя самой.» (см. секция A).
- Дальше блок просто не существует — но визуально нет «пустого слота». Whisper это floating element, его отсутствие не оставляет дыры.
- В Signet Ceremony — все highlight отключены для 'self', presets идут в дефолтном виде. Это **подтверждает** выбор «я сам(а) себе академия», а не наказывает за него.
- Graduation closer для 'self' есть (см. D).

### F.4. Character switch mid-workshop

**Edge case:** кадет передумал и поменял персонажа на slide 7 (теоретически возможно через UI). Что с whispers, которые он уже видел?

**Решение:** на character change — `localStorage.setItem('seenWhispers', '[]')`, все commentary показываются заново начиная со следующего слайда. Не блокер для 13 мая, можно отложить — но добавить TODO в код.

### F.5. Facilitator alignment

**Риск:** фасилитатор говорит «сейчас перейдём к Power Moves», а у кадетов в углу всплывает реплика Ridoc «если плохо — /clear». Может рассинхронизировать.

**Mitigation:**
- Whispers появляются через 800ms, не сразу. Фасилитатор успевает закрепить.
- В FACILITATOR_SCRIPT упомянуть один раз («у каждого может всплывать фраза от выбранного персонажа — это намеренно, не отвлекайтесь»).

---

## Open questions для Насти

1. **EN/UK для A и D — после воркшопа или жёстко к 13 мая?** Моё мнение: RU only, EN/UK потом. Если у тебя другая позиция — час на ChatGPT-pass переводы + 30 мин на ручную правку. Подъёмно, но не обязательно.
2. **Whisper auto-dismiss через 8 сек — да/нет?** Я бы оставил, но это вкусовое.
3. **`?facilitator=1` режим скрытия whispers** — точно нужен или ты сама демонстрируешь со своим персонажем?
4. **Preset highlight visual:** ring + звёздочка, или только лёгкий tint фона? У меня склонность к ring (видимее), но в твоей текущей design system tint может вписаться чище.

---

## Файлы, которые будут затронуты

**Новые:**
- `src/data/character_commentary.js` — все строки A + D
- `src/data/signet/character_defaults.js` — map для C
- `src/components/CharacterWhisper.jsx` — компонент A

**Существующие (правка):**
- `src/core/PageShell.jsx` — mount `CharacterWhisper` (1 строка)
- `src/data/signet/rituals.js` — добавить `id` каждому preset (5 минут)
- `src/pages/P_SignetCeremony.jsx` (или компонент preset-chip внутри) — применить highlight
- `src/pages/P15_Graduation.jsx` — добавить closer line под hero

**Не трогаем:** `pages.js`, `narrative.js`, `characters.js`, `archetypes.js`. Это позволяет откатить всю фичу одним git revert если что-то пойдёт не так за день до воркшопа.

---

## Definition of done (к 13 мая)

- [ ] Block C (preset highlighting) работает на всех 7 ритуалах, проверено на трёх персонажах (Violet, Imogen, Ridoc).
- [ ] Block D (graduation closer) показывается на 6 персонажах + 'self'.
- [ ] Block A — 10 слайдов × 6 персонажей × RU. EN/UK fallback на RU.
- [ ] 'self' option протестирован на всех слайдах — нигде нет пустого слота или нарушения layout.
- [ ] Facilitator-mode скрывает whispers (если решили делать).
- [ ] Smoke test на mobile — chip раскрывается, не ломает scroll.

Block B (re-phrased ritual labels) — **out of scope** для 13 мая.
