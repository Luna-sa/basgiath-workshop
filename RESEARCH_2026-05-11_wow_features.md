# Research — Wow-level дополнения после Bond Ritual

**Дата:** 2026-05-11
**Workshop:** Basgiath Academy — Claude Code через Fourth Wing / Empyrean
**Дата запуска:** 2026-05-13 (через 2 дня)
**Аудитория:** 20-30 QA, 28-40 лет, преимущественно женщины, mix seniority
**Что уже есть:** 25-slide arc, Signet Ceremony (CLAUDE.md), Bond Ritual (dragon portrait), Aerie voting, Arena bot battle

---

## TL;DR — Топ-3 пика

1. **Dragon Sigil Card** — share-card 1080x1350 с портретом дракона, именем, девизом, классом райдера и QR на свой кастомный CLAUDE.md. Скачивается одним кликом после Bond Ritual. Wow 9/10. Cost: low. **Главный takeaway — то что они унесут и покажут в Slack.**
2. **The Choosing — Rider Class reveal** — после Signet Ceremony, прежде чем перейти к Hidden Gems, Claude читает их CLAUDE.md и присуждает один из 6 классов райдеров (Scribe / Healer / Infantry / Scout / Flier / Tailwind). Класс показывается на Sigil Card и в leaderboard. Wow 9/10. Cost: low (один промт, классов всего 6).
3. **The Aerie Mosaic + Voiced Codex** — когда после Bond Ritual все возвращаются в Aerie, на главном экране собирается мозаика из 20 драконов одновременно (reveal), и Claude озвучивает все 20 девизов подряд одним голосом 60 секунд. Wow 10/10. Cost: medium (один TTS prompt на сводный текст). Эмоциональный peak workshop'а.

Остальное — ниже, по слотам.

---

## Часть 1. Что делать с драконом дальше

### 1.1 Dragon Sigil Card (share-card)

**Что:** После Bond Ritual генерируется PNG 1080x1350 (Instagram story / Slack avatar friendly): портрет дракона + имя дракона + имя райдера + девиз + Rider Class + дата "Basgiath, 13 May 2026". В углу маленький QR на их публичный профиль райдера на лендинге (можно сделать read-only страницу `/rider/{nickname}`).

**Implementation:** Canvas API + предзаготовленный template SVG. Текст накладывается из state. Кнопка "Download my Sigil" + "Copy to clipboard". В Supabase уже есть таблица dragons — берём оттуда.

**Где в арке:** Сразу после P_BondRitual (slide 19), до Aerie. Или дублируется на Resources (24).

**Cost:** Low (1 день работы — template + Canvas)
**Wow:** 9/10
**Кому зайдёт:** QA любят "видимые артефакты". Это reusable thing они унесут в Slack, LinkedIn, Telegram. Виральность workshop'а растёт.

---

### 1.2 Dragon at Dusk — финальный портрет

**Что:** В конце дня, после Arena battle, второй раз вызывается gpt-image-2 с тем же seed-prompt + добавкой "weathered from battle, dust and ash on scales, sun setting behind the Aretian range, victorious but exhausted". То есть тот же дракон, но "после боя".

**Implementation:** Сохраняем оригинальный prompt в state, добавляем суффикс, повторный вызов API. Стоимость одной генерации ~ $0.04.

**Где в арке:** Graduation (slide 23). Открывается как reveal — "your dragon at the end of the day". Можно склеить в before/after.

**Cost:** Medium (нужен повторный API call + UI для reveal, маленький motion)
**Wow:** 8/10
**Риск:** Если первая генерация была так себе, вторая может быть ещё хуже. Mitigation — давать "regenerate this version" если не понравится, лимит 2 попытки.

---

### 1.3 Dragon Companion в CLAUDE.md

**Что:** В personalised CLAUDE.md, который генерирует Signet Ceremony, добавляется секция "## My Dragon — {DRAGON_NAME}" с описанием дракона, его девизом и инструкцией Claude: "Speak as if {DRAGON_NAME} is watching over our work. Reference them when I get stuck — they don't tolerate sloppiness". Дракон становится частью voice контракта.

**Implementation:** Прокидываем answers из Bond Ritual в Signet template. Уже есть инфраструктура (data/signet/signet-generator.js).

**Где в арке:** Нужно поменять порядок — Bond Ritual до Signet Ceremony. Сейчас наоборот (10 vs 19). Альтернатива — после Bond Ritual автоматически обновляется CLAUDE.md ("download v2 with your dragon"), и они вставляют его поверх.

**Cost:** Low-medium (нужно переставить порядок ИЛИ дать update-flow)
**Wow:** 8/10
**Долгосрок:** Их дракон живёт в их CLI каждый день после workshop. Это та самая "this will save me hours + personal touch" комбинация.

---

### 1.4 Dragon Lineage (между-когортный)

**Что:** На лендинге появляется страница `/aerie/elders` где видны все драконы прошлых когорт. Когда стартует следующий workshop, новые райдеры могут "be mentored by an elder dragon" — на странице есть кнопка "claim a mentor", это просто визуальная связка, но создаёт ощущение династии.

**Implementation:** Read-only Supabase view, простая галерея. На текущий workshop работает только как teaser ("your dragon will be elder for the next cohort").

**Где в арке:** Resources (24), как маленький блок "your dragon's legacy".
**Cost:** Low (для текущего пуска — просто сохранить dragons в БД; страница elders живёт после)
**Wow:** 6/10 для текущей когорты, 10/10 для следующих
**Заметка:** Это long-term play. Для майского пуска ценность низкая, но если планируется второй workshop — закладка стоит копейки.

---

### 1.5 Dragon Duel (mini-game в середине)

**Что:** Между Hidden Gems и Bond Ritual короткий мини-раунд: два случайных дракона из текущей когорты показываются рядом, аудитория голосует "кто бы победил в воздушной схватке" — без прохождения, без последствий, чисто для смеха и energy boost. 3 раунда по 30 секунд.

**Implementation:** Простой компонент с двумя картинками + кнопками. Голоса хранятся в БД, никаких побочных эффектов.

**Где в арке:** Не подходит для текущего арка (Bond Ritual в конце). Может быть post-Aerie перед Arena.
**Cost:** Low
**Wow:** 7/10
**Минус:** Аэрия уже даёт голосование. Дублирование. Не топ.

---

## Часть 2. Ritual feels

### 2.1 The Choosing — Rider Class reveal *(топ-3)*

**Что:** После того как они применили CLAUDE.md и Bond Ritual завершён, отдельный slide "The Choosing". Claude читает их сгенерированный CLAUDE.md + dragon answers + character выбор → выдаёт один из 6 классов:

- **Scribe** — пишут отлично, voice profile силён → "twin to your dragon's quiet patience"
- **Healer** — focus на refactoring / стабилизации → "you mend what others broke"
- **Infantry** — execution-first, доводят до конца → "no glory, all kept ground"
- **Scout** — exploration / research / debugging → "you see the path no one mapped"
- **Flier** — speed, фичи, новизна → "you ride the storm front"
- **Tailwind** — mentoring / коллаборация → "wind under everyone else's wings"

Класс выводится крупно, с описанием, прикрепляется к Sigil Card и leaderboard.

**Implementation:**
- Один Anthropic API call с system prompt "Given this CLAUDE.md and dragon profile, classify rider into one of these 6 classes. Return ONLY the class name and 2-sentence justification."
- Каждому классу — заготовленная narrative copy.
- Сохраняем в Supabase dragons table (новое поле rider_class).

**Где в арке:** Между Bond Ritual (19) и Aerie (20). Можно сделать reveal-style — все 30 секунд видят "Reading your signet..." потом одновременно открывается класс.

**Cost:** Low (один API call, 6 заготовленных текстов, 1 миграция БД)
**Wow:** 9/10
**Почему топ:** QA mindset — категоризация, "что я". Личный touch. Видимый артефакт. Светится на Sigil Card.

---

### 2.2 The Aerie Mosaic + Voiced Codex *(топ-3)*

**Что:** На P_Aerie (slide 20), когда фасилитатор открывает голосование, на главном экране (демонстрационный screen) запускается reveal:

1. **Mosaic build-up (20 сек):** одна за другой проявляются 20 драконов в сетку 5×4. Каждая ячейка — портрет + имя + девиз мелким. Звучит тихая фоновая музыка (Empyrean OST style — у Bridgerton-композиторов).
2. **Voiced Codex (60 сек):** Claude озвучивает все 20 девизов подряд одним голосом (ElevenLabs). Каждый девиз — короткая пауза, мозаичная ячейка соответствующего дракона на секунду подсвечивается.

**Implementation:**
- Все девизы и имена уже в БД после Bond Ritual.
- Серверный скрипт собирает текст: `"{name}, of {color} scales. {motto}. {name}, of {color} scales. {motto}. ..."`
- ElevenLabs TTS — один файл, около $0.10.
- На фронтенде — синхронизация audio time с highlight'ом ячейки (или просто без синхры, по таймеру).

**Где в арке:** Открытие slide 20 (Aerie), до начала голосования. Это peak момент workshop'а.

**Cost:** Medium (1-2 дня — TTS pipeline + mosaic анимация + synchronization)
**Wow:** 10/10
**Почему топ:** Коллективный момент. Все одновременно слышат свой девиз вслух от единого голоса. Это эмоциональная кульминация — то что они запомнят через год. Видеозапись этой минуты — лучший trailer для второй когорты.

---

### 2.3 The Pledge — First Flight Declaration

**Что:** На Graduation (slide 23) каждый райдер пишет одну строку — pledge, что они сделают в первый рабочий день после workshop. Например: "I will use Claude Code for my first real PR on Monday morning, no fallback to ChatGPT". Pledges собираются в общий public list на резюме-странице.

Усиление: Claude/email скрипт через 7 дней присылает им их же pledge с вопросом "did you keep it?" — короткая petitle, не obnoxious.

**Implementation:**
- Textarea на Graduation + Supabase insert.
- Resend transactional email через 7 дней (можно поставить как scheduled job в Render).
- Optionally — read-only `/pledges` страница для всей когорты.

**Где в арке:** Graduation (23).
**Cost:** Low (1 поле, 1 cron job, 1 email template)
**Wow:** 8/10
**Заметка:** Самый дешёвый способ закрыть workshop ритуально и держать retention. Работает и в одиночку, и в комбинации с Sigil Card.

---

### 2.4 The Codex — collective lore

**Что:** В течение всего workshop'а на боковой панели (или отдельной странице доступной только фасилитатору на главном экране) собирается живой Codex — короткие заметки, которые райдеры добавляют по одной строке: "что я узнал, что меня удивило, что я попробую завтра". Каждая запись — 1 строка, anonymous но с classed pseudonym ("a Scout from Studio Gaming"). К концу дня — это public artefact.

**Implementation:**
- Простая текстовая area в Resources slide, доступна с slide 7 и далее.
- Supabase append-only table.
- Live feed на главном экране (фасилитатор открывает /facilitator/codex).

**Где в арке:** Появляется как opt-in блок начиная с slide 7. На Graduation — финальный показ собранного Codex.
**Cost:** Low-medium
**Wow:** 7/10
**Риск:** Если никто не пишет — пусто, awkward. Нужно фасилитатору агитировать.

---

### 2.5 Sealing the Bond — синхронный момент

**Что:** Когда все закончили Bond Ritual (фасилитатор видит счётчик 20/20 на dashboard), он нажимает "Seal the Aerie". На экранах ВСЕХ райдеров одновременно проигрывается короткая 5-секундная анимация: их дракон на экране, появляется красная сургучовая печать с их сигилом, звук — низкий рык дракона. После этого открывается Aerie.

**Implementation:**
- Supabase realtime channel — фасилитатор бродкастит "SEAL_NOW".
- Все клиенты слушают, проигрывают canvas-анимацию + один SFX.
- SVG/CSS анимация (не видео — низкий weight).

**Где в арке:** Триггер от фасилитатора между slide 19 и 20.
**Cost:** Medium (нужна realtime инфраструктура и SFX)
**Wow:** 9/10
**Заметка:** Это тот самый "unfold something at once" момент. Cинхрония — главное.

---

## Часть 3. Wow моменты которые можно инженерить

### 3.1 The Reading — Claude угадывает кто есть кто *(сильный кандидат на топ-5)*

**Что:** На середине workshop'а (между Hidden Gems и Bond Ritual — primary energy dip момент), фасилитатор запускает 3-минутную игру: Claude получает 5 случайных CLAUDE.md без имён и пытается описать, кто это — что они делают, какой у них стиль, какая у них специализация. Райдеры угадывают, кто из них кто.

**Implementation:**
- Серверный скрипт берёт 5 random CLAUDE.md, маскирует имена, шлёт Claude с промптом "describe this person — what they do, their voice, their pet peeves. 3 sentences."
- Возврат на screen, фасилитатор читает вслух, аудитория угадывает.
- Никакой автоматики, чистая live игра.

**Где в арке:** Между slide 11 (MCP) и slide 12 (Hidden Gems) — 50-минутный mark.
**Cost:** Low (один API call с 5 промптами)
**Wow:** 9/10
**Почему сильно:** QA — finding what others missed. Они узнают свои паттерны со стороны. Comedy + insight. Закрытие energy dip'а.
**Риск:** Claude может звучать обобщённо. Mitigation — заранее проверить на тестовых данных и подкрутить промпт.

---

### 3.2 The Whisper — Claude reads your motto

**Что:** В момент когда райдер заканчивает Bond Ritual и портрет генерируется (это занимает 8-12 секунд — мёртвое время), на экране играет короткий 6-секундный voiceover: Claude (ElevenLabs voice) шепчет их девиз, обращаясь к их дракону. "{Dragon name}. {Motto}. We see you."

**Implementation:**
- ElevenLabs API call с input текстом из state.
- Cached на серверной стороне (1 file per rider).
- Plays during loading state.

**Где в арке:** Внутри Bond Ritual loader (slide 19).
**Cost:** Medium (TTS pipeline + audio playback)
**Wow:** 8/10
**Минус:** ElevenLabs стоит. 20 voiceovers ~ $2-4. Норм.

---

### 3.3 Time Capsule — Letter to Future You

**Что:** На Graduation райдер пишет письмо себе через 12 месяцев. Одно поле, 500 символов. Через 12 месяцев Resend шлёт письмо обратно с темой "From your dragon, 1 year ago" + копией их Sigil Card.

**Implementation:**
- Supabase insert + scheduled email (Resend, либо своя cron).
- Опционально — Claude добавляет к их письму 2 строки "что изменилось в Claude Code за год" из новостей.

**Где в арке:** Graduation (23).
**Cost:** Low (1 textarea, 1 scheduled job — Render cron уже есть)
**Wow:** 8/10 (отложенный, но мощный)
**Заметка:** Самое дешёвое retention действие. Через год они открывают email и вспоминают workshop — обычно это триггер апсейла, лояльности, recommendation.

---

### 3.4 The Convergence — Voice question mid-workshop

**Что:** На 50-минутной отметке (energy dip) — короткое (90 секунд) задание: записать голосом одно предложение "что я сделаю с Claude Code на работе на этой неделе". Голос обрабатывается Whisper → транскрипт сразу же на главном экране для всех + Claude кластеризует в 3 группы (test automation / code review / docs+specs) — выдаёт мини-инсайт "23% этой комнаты пойдут чинить flaky tests на этой неделе".

**Implementation:**
- Уже есть VoiceTextInput компонент.
- Whisper API на backend (есть).
- Один Claude call для кластеризации.
- Render результата на /facilitator/.

**Где в арке:** Между Hidden Gems overview (12) и первым gem deep-dive (13). Или прямо после MCP demo (11) — 50-минутный mark.
**Cost:** Medium
**Wow:** 8/10
**Почему работает:** Превращает audience в активного участника, голос — личное, кластеризация — wow от AI. И это перевод от "wow Claude умеет" в "Claude знает что мы здесь делаем".

---

### 3.5 The Reveal of the Strongest Bond

**Что:** В конце Aerie voting (slide 20), когда подсчитаны голоса, не просто показ winner — а reveal в стиле "и связь, которая зажгла Аэрию сильнее всех — это {dragon name}, и его всадник — {rider name}". Победитель получает special title на Sigil Card "Aerie Favourite — Basgiath 2026.05.13" + бейдж в leaderboard.

**Implementation:**
- Финальный screen в Aerie с slow reveal.
- Sigil Card регенерируется с title.

**Где в арке:** Конец Aerie (20).
**Cost:** Low
**Wow:** 8/10

---

## Часть 4. Practical take-homes

### 4.1 Autopilot Prompt — "Monday morning starter pack"

**Что:** В Resources участники получают 5 готовых промптов под их типовые QA задачи, кастомизированные под их CLAUDE.md (а значит под их voice / studio / role):
- "Analyse this flaky test and propose 3 hypotheses why it fails"
- "Convert this manual test case into Playwright"
- "Review this PR for missing edge cases — focus on race conditions"
- "Generate test data for {their domain — gaming/social/fintech}"
- "Refactor this test suite — same coverage, half the lines"

Каждый промт — copy-to-clipboard one-click.

**Implementation:**
- Шаблон промтов в `data/autopilot.js`.
- На Resources slide рендерим список с substitution из их CLAUDE.md (studio, role).

**Где в арке:** Resources (24).
**Cost:** Low (1 файл с промптами, 1 React component)
**Wow:** 7/10 (не wow, но **самый полезный** артефакт)

---

### 4.2 Skills Repo — pre-configured

**Что:** К концу workshop в Resources даётся ссылка на GitHub repo `basgiath-cohort-2026-05/your-name` (или просто общий repo) с уже настроенными:
- `~/.claude/skills/qa-test/SKILL.md` для их domain
- `~/.claude/skills/flaky-killer/SKILL.md`
- `~/.claude/agents/qa-reviewer.md`
- `~/.claude/commands/test-spec.md`
- pre-configured `.mcp.json` для playwright + supabase

**Implementation:**
- Заранее подготовленный shared repo.
- Опционально — fork-per-rider через GitHub API на их имя при registration.

**Где в арке:** Resources (24).
**Cost:** Medium (нужно time подготовить skills заранее — но это reusable)
**Wow:** 8/10
**Заметка:** Это серьёзный value-add. "Я ушёл с готовым repo который завтра использую в работе" — это lecture-tier outcome.

---

### 4.3 Custom Voice Mode — Kai-flavoured

**Что:** Каждый райдер получает CLI команду которая запускает Claude Code с их CLAUDE.md + ElevenLabs voice (через MCP) — у каждого свой голос дракона. "ckd" (claude-kai-dragon) — вызов. Дракон озвучивает короткие confirmations.

**Implementation:**
- Maintained MCP server для ElevenLabs (есть).
- Shell alias добавляется в их zshrc одной командой.

**Где в арке:** Power moves talk (9) + Resources (24).
**Cost:** Medium-high (нужен MCP, нужны voice IDs, надёжность под Windows может страдать)
**Wow:** 9/10
**Минус:** Может не работать на части машин (WSL2, Windows). Demo-only на workshop, инструкция для дома — лучше.

---

### 4.4 The Trifecta — three commands

**Что:** Каждый райдер получает три персональных slash-команды добавленных к их CLAUDE.md:
- `/morning` — Claude читает их JIRA, выдаёт топ-3 приоритета
- `/pr-shield` — review PR через QA-mindset чеклист (race conditions, edge cases, missing tests)
- `/dragon` — voice update от дракона на текущий task

**Implementation:**
- Заготовленные `.claude/commands/*.md` в repo который они клонируют.
- В Signet Ceremony последний шаг — "install three commands".

**Где в арке:** Signet Ceremony (10) или Resources (24).
**Cost:** Low-medium (3 готовых файла)
**Wow:** 8/10

---

## Часть 5. Mid-workshop interactive (50-минутный mark)

### 5.1 Speed Install Race — Hidden Gem sprint

**Что:** Когда фасилитатор переходит от MCP к Hidden Gems, объявляется speed challenge: "первые трое, кто установит и докажет работающий MemPalace через 5 минут — получают +50 XP". Они кричат "done", фасилитатор проверяет (через MCP search на их memory).

**Implementation:**
- Кнопка "I'm done" в P_GemMemPalace.
- Фасилитатор видит порядок на dashboard.
- Auto-XP в Supabase для первых 3.

**Где в арке:** Slide 14 (MemPalace).
**Cost:** Low
**Wow:** 7/10
**Заметка:** Энергия + competition. Но не для всех — некоторые отстают и это демотивирует. Mitigation — параллельно "honourable mentions" для всех кто доделал в течение 10 минут.

---

### 5.2 Bond Pair — 2-минутная пара-связка

**Что:** На 50-минутном mark'е фасилитатор просит каждого найти соседа (или random pair через app) и за 2 минуты рассказать друг другу: "что мой character (выбранный на slide 1) видит в твоём character'е". Никаких слайдов — только разговор.

**Implementation:** Никакая. Просто инструкция.
**Где в арке:** Между slide 11 и 12.
**Cost:** Zero
**Wow:** 6/10
**Заметка:** Дешёвый способ поднять энергию без техники. Risk: introverts напрягаются. Можно сделать opt-out.

---

### 5.3 Prediction Game — "которая фишка взорвёт твой workflow"

**Что:** Перед Hidden Gems overview (12) — quick poll: 6 фишек, надо угадать, какая получит больше всего "это я попробую завтра" реакций после раскрытия всех 6. Голос в начале, голос в конце, reveal — кто угадал тренд.

**Implementation:**
- 2 опроса (before/after) в Supabase.
- Reveal screen с сравнением.

**Где в арке:** Slide 12 (open) и slide 18 (close).
**Cost:** Low-medium
**Wow:** 7/10
**Почему работает:** Создаёт metacognitive loop — они уже думают о применении пока смотрят, а не пассивно слушают.

---

## Часть 6. Summary table

| # | Name | Cost | Wow | Slot | Top-3? |
|---|------|------|-----|------|--------|
| 1.1 | Dragon Sigil Card | Low | 9 | 19→24 | **YES** |
| 1.2 | Dragon at Dusk | Med | 8 | 23 | |
| 1.3 | Dragon in CLAUDE.md | Low-Med | 8 | 10/19 | |
| 1.4 | Dragon Lineage | Low | 6 (10 next) | 24 | |
| 1.5 | Dragon Duel | Low | 7 | mid | |
| 2.1 | Rider Class Reveal | Low | 9 | 19→20 | **YES** |
| 2.2 | Aerie Mosaic + Voiced Codex | Med | 10 | 20 | **YES** |
| 2.3 | First Flight Pledge | Low | 8 | 23 | |
| 2.4 | Collective Codex | Low-Med | 7 | 7+ | |
| 2.5 | Sealing the Bond sync | Med | 9 | 19→20 | |
| 3.1 | The Reading (Claude guesses) | Low | 9 | 11→12 | |
| 3.2 | Whisper voiceover | Med | 8 | 19 loading | |
| 3.3 | Time Capsule email | Low | 8 | 23 | |
| 3.4 | Voice cluster convergence | Med | 8 | 11→12 | |
| 3.5 | Strongest Bond reveal | Low | 8 | 20 | |
| 4.1 | Autopilot prompt pack | Low | 7 | 24 | |
| 4.2 | Pre-configured skills repo | Med | 8 | 24 | |
| 4.3 | Custom voice CLI | Med-High | 9 | 9/24 | |
| 4.4 | Trifecta commands | Low-Med | 8 | 10/24 | |
| 5.1 | Speed install race | Low | 7 | 14 | |
| 5.2 | Bond Pair convo | Zero | 6 | 11→12 | |
| 5.3 | Prediction Game | Low-Med | 7 | 12+18 | |

---

## Часть 7. Если делать только 3 вещи в оставшиеся 2 дня

Если время критично — порядок implementation:

**День 1 (2026-05-12):**
- Утром: Dragon Sigil Card (4-6 часов). Template + Canvas render + download.
- Днём: Rider Class Reveal (3-4 часа). 6 заготовленных текстов, 1 Claude API call, 1 SQL миграция, 1 reveal slide.

**День 2 (2026-05-13 утром перед запуском):**
- Aerie Mosaic + Voiced Codex (если успеваешь). Это самый ёмкий — может сожрать 6-8 часов. Если нет — резервный план: только mosaic без TTS (3 часа), TTS добавляешь к следующей когорте.

Этих трёх хватит чтобы превратить workshop из "хороший туториал" в "ritual which I'll remember in a year". Остальное — вкусные дополнения которые можно слоить на следующих когортах.

---

## Часть 8. Что не делать

- **Не добавлять live battle между драконами в реальном времени.** Arena уже это делает на slide 21. Дублирование убивает peak. Если хочется усиления — буст Arena, не новый mini-game.
- **Не делать voice CLI обязательным.** Cross-platform хрупкость + время на debugging на самом workshop'е = убитая энергия. Demo на главном экране — OK, для всех — risky.
- **Не делать collective Codex без модерации.** Если включаешь — фасилитатор должен иметь "hide" кнопку. На QA workshop'е risk is low, но проверь UX.
- **Не делать pair-work обязательным.** Введи через "opt-in pairs available" — introverts тебе спасибо скажут.

---

## Часть 9. Связь с QA mindset (sanity check)

Перепроверяю каждую топ-3 идею против профиля аудитории.

**Sigil Card** — видимый артефакт ✓, личный (имя+девиз+класс) ✓, share-friendly ✓, "this саvе hours" (нет напрямую, но reputation/discovery boost). Класс: **personal touch + showoff**.

**Rider Class Reveal** — categorisation (QA brain) ✓, surprise/reveal moment ✓, attached to artefact ✓, light competition (классы взаимно интересны). Класс: **find-what-others-missed + reveal**.

**Aerie Mosaic + Voiced Codex** — collective ritual ✓, voted-on (light competition) ✓, audio peak (something they'll remember) ✓, видеозапись для следующей когорты (long-term). Класс: **collective ritual + emotional peak**.

Три разных регистра: personal artefact + categorisation game + collective moment. Покрывают три ключевых драйвера QA-аудитории.

---

**Конец отчёта.**
