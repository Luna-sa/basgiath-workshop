# Copy Audit — Basgiath Workshop Landing
**Date:** 2026-05-11
**Workshop date:** 2026-05-13
**Audience:** 20-30 Russian-speaking QA engineers at Playtika
**Scope:** All user-facing strings across EN / RU / UK in `src/pages/` and `src/components/`

---

## Executive Summary

Лор-обёртка работает: ключевые «Empyrean»-слайды (P07 Grimoire, Signet Ceremony, Bond Ritual, Aerie) написаны в правильном академическом регистре с нормальным русским. Главная системная проблема — **i18n покрытие неровное**: украинский язык реально оживает только в 6 слайдах из 25, остальные при переключении на UK тихо падают обратно на английский, и в нескольких ключевых местах русский тоже отсутствует (P03 PreWork, P06 InstallEcosystem, P10 TalkMCP, P01 CharacterSelect — намертво захардкожены на одном языке). На уровне русского есть россыпь калек («не предсказателю», «не псевдо», «adversarial к самому себе»), смесь латиницы и кириллицы в одном предложении внутри Gem-слайдов (technical jargon untranslated), и две точки воспроизводимого slip-а к корпоративному тону (P02 регистрация checkbox, P03 prework, P06 install).

---

## 1. Missing Ukrainian (exact file paths)

### 1a. Файлы вообще без `useT` (только русский или только английский)
Эти слайды видны участникам, но при `lang === 'uk'` они не меняются — текст остаётся на одном языке:

| File | Текущий язык | Severity |
|------|--------------|----------|
| `src/pages/P01_CharacterSelect.jsx` | RU only (lore intro + persona descriptions из `characters.js`) | HIGH — это первая интерактивная страница |
| `src/pages/P03_PreWork.jsx` | RU only (paths labels, checklist text, lifehack, student counter) | HIGH — обязательная pre-work страница |
| `src/pages/P06_InstallEcosystem.jsx` | RU only (steps, copy button, persona tip) | HIGH — момент истины воркшопа |
| `src/pages/P10_TalkMCP.jsx` | RU only (server descriptions + prompts) | MED — facilitator talks over it |
| `src/data/characters.js` | RU only (все 7 персонажей) | HIGH — leaks через `P01`, `P14_Leaderboard`, `P15_Graduation` |
| `src/data/narrative.js` | mixed RU+EN single string (title EN, text RU) | MED — глобальные заголовки страниц |

### 1b. Файлы где `useT` есть, но вызывается с 2 аргументами (нет UK перевода — silently fallback to EN)
Хук `useT()` определён как `t(en, ru, uk)`. Если `uk` не передан и `lang === 'uk'`, возвращает `en`. Эти файлы технически «локализованы», но украинский пользователь видит английский:

| File | Кол-во 2-arg вызовов | Severity |
|------|----------------------|----------|
| `src/pages/P00_Landing.jsx` | ~12 строк (весь файл) | HIGH — первый экран |
| `src/pages/P02_Registration.jsx` | ~30 строк (вся форма + already-on-rolls блок) | HIGH |
| `src/pages/P04_TalkIntro.jsx` | ~20 строк (вся анатомия + 5 уровней) | HIGH — flagship talk |
| `src/pages/P05_TalkEvolution.jsx` | 2 строки (главный параграф + "Where the dragon lives on disk") | MED |
| `src/pages/P14_Leaderboard.jsx` | 8 строк (Submitted by, Yours, Final battle CTA…) | MED |
| `src/pages/P15_Graduation.jsx` | 11 строк (всё содержимое включая closing line) | HIGH — финал |
| `src/pages/P_ArenaIntro.jsx` | ~15 строк (вся страница) | HIGH |
| `src/pages/P_ResourcesIntro.jsx` | 8 строк (вся страница) | HIGH |
| `src/components/CheckpointButton.jsx` | 5 строк (Done / Marked at / Saving / Mark done / Register first) | HIGH — повторяется на 4 слайдах |
| `src/components/GemSlide.jsx` | 6 строк (секционные заголовки: "What it is", "Why it matters", "When to reach for it", "install · paste", "Copy prompt") | HIGH — повторяется на 6 gem-слайдах |
| `src/data/gems.js` | вся структура gem-данных (tagline/body/why/use_cases/install) — нет `*_uk` полей | HIGH — 6 слайдов |
| `src/pages/P_HiddenGems.jsx` | 2 строки (intro paragraph, footer) | MED |
| `src/pages/P_TalkPowerMoves.jsx` | 7 строк (6 moves + intro) | MED |

### 1c. Файлы с правильным `t(en, ru, uk)` (golden — для образца)
Сохранить как референс, остальные привести к этому уровню:

- `src/pages/P_TalkModes.jsx` — все 3 языка, перевод хороший
- `src/pages/P07_TalkEcosystem.jsx` — все 3 языка, lore-перевод
- `src/pages/P_PersonaIntro.jsx` — все 3 языка
- `src/pages/P_BondIntro.jsx` — все 3 языка
- `src/pages/P_AerieIntro.jsx` — все 3 языка

---

## 2. Stilted Translations / Calques (file:line + problem + suggested rewrite)

### Самые звонкие кальки и неестественности (RU)

**`src/pages/P00_Landing.jsx:18`**
> «Это **воркшоп по Claude Code для QA**. Настроим Claude Code вместе, соберём персонального AI-напарника с настоящим характером и пройдём через реальные задачи **пока всё не сядет**.»

«Пока всё не сядет» — мысль ясна, но звучит обрывисто на лендинге. Предложить: «...пока всё не встанет на место» или «...пока не почувствуешь, что оно твоё».

**`src/pages/P00_Landing.jsx:24`**
> «Обёртка - **Академия Басгиат**. Как у наездников из «Четвёртого Крыла»: персонажи, отряды, Парапет который нужно пройти. **Лор - это обёртка.**»

«Обёртка» появляется два раза в трёх предложениях. Звучит как self-conscious извинение за лор. Предложить: «Каркас - **Академия Басгиат**. ... Лор — это каркас.» или просто убрать вторую тавтологию.

**`src/pages/P04_TalkIntro.jsx:13-17` (хук)**
> «ChatGPT — это окно. Claude Code — это **рабочий, который живёт в твоём проекте**.»

«Рабочий» в русском читается как пролетариат. Хук на воркшопе для QA-инженеров. Предложить: «Claude Code — это **напарник, который живёт в твоём проекте**» (созвучно остальной риторике bonding) или «**мастер, поселившийся в проекте**».

**`src/pages/P_TalkPowerMoves.jsx:31`**
> «Относись к Claude как к коллеге, **не предсказателю**.»

Калька от "not a fortune teller". По-русски нет такого регистра. Предложить: «...не к гадалке» или «...а не к хрустальному шару».

**`src/pages/P_TalkPowerMoves.jsx:46`**
> «Используй Task tool: «Запусти 3 агента параллельно — одного на ревью кода, второго на тесты, третьего на доки». **Работают изолированно, возвращают summary.** Как команда.»

«Возвращают summary» — англицизм. Можно: «возвращают сводку» или «возвращают итог». «Изолированно» по-русски сухое — предложить: «...работают сами по себе, возвращают итог».

**`src/pages/P05_TalkEvolution.jsx:30` (Agents · claws)**
> «Делегируешь — работают — **main session чистая**.»

«Main session чистая» — латиница в середине русской фразы. Предложить: «...основная сессия остаётся чистой».

**`src/pages/P07_TalkEcosystem.jsx:94` (Wardstone · the Watcher)**
> «**Ваpд-Камень** · Дозорный»

«Ваpд-Камень» — здесь содержится латинская **p** вместо кириллической **р** (`Ваpд` vs `Вард`). Опечатка → glyph baseline дрогнет в шрифте. **Visual bug.**

**`src/pages/P07_TalkEcosystem.jsx:104`**
> «Сортирует по вреду, не по тому **кто громче кричал**.»

OK по смыслу, но «кто громче кричал» — про прошедшее время, а контекст про текущий процесс. Предложить: «...не по тому, кто громче кричит».

**`src/data/gems.js:42-43` (Pixel Agents body_ru)**
> «...**Видишь как он листает страницы. Ждёт разрешения? Нетерпеливо постукивает ногой.**»

«Постукивает ногой» — animated character топает ногой = sound of impatience по-английски. По-русски «топает ногой» имеет агрессивный оттенок, скорее «нетерпеливо барабанит пальцами». Если хочется сохранить — «топчется».

**`src/data/gems.js:60` (Pixel Agents why_ru)**
> «...один **застрял на разрешении**, два читают доки»

«Застрял на разрешении» = stuck on permission prompt. По-русски «на подтверждении» или «на permission-prompt-е» — естественнее в контексте Claude Code.

**`src/data/gems.js:88` (MemPalace body_ru)**
> «Каждый факт, который ты учишь Claude, становится **markdown-drawer-ом** в комнате»

Двойной дефис-морфема через латиницу. Очень читается как раз тот самый «giveaway machine-translated». Предложить: «...становится **markdown-ящиком** в комнате» (drawer = выдвижной ящик в memory palace метафоре).

**`src/data/gems.js:141` (MemPalace body_ru)**
> «Оказывается, она 20 лет на Linux и **тихо контрибьютит в опенсорс**.»

«Контрибьютит» — допустимое разговорное, но в одном предложении с «оказывается» создаёт тональный конфликт. Предложить: «...и тихо пишет в опенсорс» или «...и тихо коммитит в опенсорс».

**`src/data/gems.js:230` (suzu-mcp body_ru)**
> «...может быть **mumbling учёного** из Half-Life, Galaxy-at-war **sting** из Mass Effect, item-get **jingle** из Nintendo...»

Три латинских технических термина подряд (mumbling/sting/jingle) в одном предложении. Хотя бы один-два надо адаптировать: «бормотание учёного», «звуковая отбивка». Иначе предложение читается как стенограмма дублирования.

**`src/data/gems.js:251` (suzu-mcp why_ru)**
> «...самым **дешёвым attention-grab**...»

Грамматически ломанное. По-русски: «...самым дешёвым способом привлечь внимание...» или «...самым дешёвым крючком для внимания...».

**`src/data/gems.js:362-365` (tool-search why_ru)**
> «85% сэкономленного overhead — это более длинные разговоры до /clear, больше места под реальный код/текст в контексте **и заметно быстрее ответы** (меньше токенов обрабатывать на turn). Для QA-workflow **specifically** — где жонглируешь test data, скриншотами и tool output — этот headroom это разница между «Claude запутался» и «Claude держит весь контекст».»

«Specifically» латиницей в середине русского предложения = mistranslated tag. Предложить: «Для QA-workflow в частности» или просто «именно для QA-workflow».
Плюс «этот headroom это разница» — двойное «это». Чистить.

**`src/data/gems.js:469-473` (Quinn+Jinx why_ru)**
> «Quinn+Jinx делает testing AI **adversarial к самому себе**. Методичный проход и хаотичный проход имеют **разные bias-ы**...»

«Adversarial к самому себе», «разные bias-ы» — латинско-кириллические гибриды. Предложить: «...делает AI-тестировщика антагонистом самому себе. У методичного и хаотичного прохода — разные перекосы...».

**`src/data/gems.js:583-585` (channels use_cases_ru)**
> «Pair-programming **с самой собой через контексты** — запустила задачу на ноуте, **дотачиваешь prompts с телефона** за кофе.»

«С самой собой через контексты» — calque от "across contexts". По-русски звучит криво. Предложить: «Парное программирование с собой в разных средах — запустила задачу на ноуте, докручиваешь промпты с телефона за кофе.»

**`src/pages/P_AerieIntro.jsx:30` (RU)**
> «Дракон с наибольшим количеством голосов получает **Сигнет Неба**.»

OK. **Но в UK на той же строке:** «Дракон з найбільшою кількістю голосів отримує **Сигіл Неба**.» — несогласованная терминология. EN — «Signet of the Sky», RU — «Сигнет Неба», UK — «Сигіл Неба». Должна быть либо везде транслитерация (Сигнет/Сигнет), либо везде перевод (Знак/Сигіл).

**`src/pages/P_BondIntro.jsx:35` (UK)**
> «...отримаєш персональний CLAUDE.md, і Claude Code зустрічатиме тебе як твого **свіжозвʼязаного**.»

«Свіжозвʼязаного» — спецесловотвір. Прозвучить як машинний переклад. У контексті лору краще: «...як твого новоповʼязаного партнера» або «...як того, з ким щойно склав звʼязок».

**`src/pages/P15_Graduation.jsx:178`**
> «Ты **вошла** кадетом. Уходишь всадником.»

Гендеризация в женском роде. У `mslunasa` женская аудитория частая, но в группе 20-30 человек неизбежны мужчины. Либо нейтрализовать («Вошёл/вошла», «Ты ступил(а) сюда кадетом»), либо адресовать default-сценарий и оставить как есть с пометкой в фасилитаторской доке. **Это решение Насти, не правка.**

Аналогично — `P_BondIntro.jsx:50`, `P_ArenaIntro.jsx:51` «Вошла как» в EN-исходнике это «Signed in as». На EN gender-neutral. Можно: «Ты — @nickname» или «Под именем @nickname».

---

## 3. Inconsistent Lore Terms

### 3a. Главные термины — таблица вариантов

| EN canon | RU (наблюдаемые) | UK (наблюдаемые) | Файлы |
|----------|------------------|------------------|-------|
| **rider** | «всадник» / «наездник» | «вершник» | `P00_Landing` («наездники»), `P15_Graduation`, `P_ArenaIntro`, `P_ResourcesIntro` («всадник»); `P14_Leaderboard` («наездников связаны»); `P04_TalkIntro` («наездника») |
| **bond / bonded** | «связь» / «bonded» (untranslated) / «bonded-напарник» / «свежесвязанный» | «звʼязок» / «bonded» / «свіжозвʼязаний» / «новоповʼязаний» | `P04_TalkIntro:37` «bonded напарник»; `P_PersonaIntro:33-34` «голос твоего **bonded**» (untranslated); `P_BondIntro` «связывание / Bond / звʼязування»; `P_ArenaIntro:83` «всадники со связью»; `P15_Graduation:67` «Связан с» |
| **signet** | «сигнет» / «Сигнет» / «знак» / «значок» | «сигнет» / «сигіл» / «знак» | `P02_Registration:30` «Сигнет»; `P_AerieIntro:30` «Сигнет Неба» (RU) vs **«Сигіл Неба»** (UK); `P_BondIntro:32` «сигнет» (lowercase, в списке атрибутов); `narrative.js` «signet emerges» |
| **threshing** | «Threshing» (untranslated) | (n/a — UK not loaded) | `pages.js` page id=1 title; `narrative.js:12`. Не объяснено по-русски. |
| **parapet** | «Парапет» (Cyrillic capitalised) | — | `P00_Landing`, `P03_PreWork`, `narrative.js`. Consistent ✓ |
| **wing / squad** | «крыло» / «отряд» | «крило» / «загін» (where exists) | `P01_CharacterSelect:14` «кадеты разбиты на крылья и отряды»; `narrative.js:138` «крылья сражаются». Inconsistent: workshop talks dont mention squads at all. |
| **dragon** | «дракон» | «дракон» | OK везде ✓ |
| **Aerie** | «Аэрия» | «Аерія» | OK везде ✓ |
| **familiar** (P07) | «фамильяр» | «фамільяр» | OK ✓ |

### 3b. Конкретные несогласованности по местам

1. **`P_AerieIntro.jsx:30`** — RU «Сигнет Неба» vs UK «Сигіл Неба». Один концепт, два разных перевода.
2. **`P_PersonaIntro.jsx:33-35`** — слово «bonded» оставлено латиницей в RU и UK тексте, при том что в `P_BondIntro` уже использовали «связанный»/«звʼязаний». Привести к одному.
3. **`P04_TalkIntro.jsx:37`** — «Claude Code — **bonded напарник**» — half-translated. Либо «Claude Code — связанный напарник», либо англоязычный заголовок «Claude Code — bonded partner» (как на той же строке EN).
4. **`P00_Landing.jsx:23` vs `P_ArenaIntro.jsx:26`** — «как у наездников» vs «Всадники в небе». Одно произведение, два слова. Зафиксировать одно. В каноне «Четвёртого Крыла» переводы Эксмо используют «всадники».
5. **`P02_Registration.jsx:30` («Сигнет») vs `P_BondIntro.jsx:32` («сигнет»)** — capitalisation. Если это лоровый собственный термин — capital. Если общий — lowercase. Решить.
6. **`pages.js:28-29`** — title `Threshing` оставлено латиницей как название слайда. Студенты не читавшие книгу не поймут. Либо добавить subtitle/glossary, либо локализовать.

---

## 4. Voice Slips (где академия даёт корпоративную трещину)

### 4a. Жёсткие slip-ы

**`src/pages/P02_Registration.jsx:80-82`** — Workshop tool callout
> «Этот воркшоп построен специально вокруг Claude Code. Каждая команда, каждая настройка MCP, каждый персонаж который мы соберём - всё это работает в Claude Code. **Без него на воркшопе делать нечего.**»

Звучит как notice от HR. В академии бы написали что-то вроде: «Без него Парапет не пройти» или «Без него ты не пересечёшь Парапет». Лор закрыт корпоративным «делать нечего».

**`src/pages/P02_Registration.jsx:241-242`** — Claude Code readiness checkbox
> «После регистрации тебе придёт письмо с пошаговой инструкцией. **Воркшоп построен вокруг Claude Code - без установленного инструмента участвовать нельзя.**»

То же самое: «участвовать нельзя» — формальная вежливость. Можно: «без него двери Басгиата не открываются» или просто оставить факт без угрозы.

**`src/pages/P03_PreWork.jsx:9-31`** — путь Cursor / Claude Code labels и шаги
> «Cursor (бесплатно)» · «Рекомендован» · «Скачать Cursor с cursor.com», «Установить Git», «Создать папку qa-workspace»

Это полностью операционный режим: bullet-bullet-bullet, никакого академического обрамления. После лорового интро в narrative.js «Первая проверка — не на силу, а на готовность» сразу dropping в «Скачать Cursor с cursor.com», «Бесплатный аккаунт, без карты». Не нужно весь чеклист переписывать поэтично, но первые два-три слова заголовков можно: «**Готовь снаряжение**: скачай Cursor с cursor.com», «Подвяжи **Git к поясу**: git-scm.com». Хотя бы один лоровый штрих per item.

Также `P03_PreWork.jsx:119-121`:
> «Парапет пройден»
> «Все инструменты установлены. Ты готов(а).»

«Парапет пройден» — golden. «Все инструменты установлены. Ты готов(а)» — обратно в SaaS-installer. Можно: «Снаряжение собрано. Дракон ждёт.»

**`src/pages/P06_InstallEcosystem.jsx:44-54`** — три инструкции
> «1. Открой терминал → запусти claude»
> «2. Скопируй промпт ниже и вставь»
> «3. Подожди 1-2 минуты — AI создаст все файлы»

Опять чисто install wizard. На этом слайде («Forging the bond» по narrative.js) можно лоровый обвес: «1. Открой алтарь (терминал) → призови claude», «2. Прочти заклинание ниже и вставь его». Или хотя бы один штрих per step. Сейчас один из самых критичных моментов воркшопа (момент инсталляции экосистемы) проходит в самом плоском операционном тоне.

**`src/pages/P10_TalkMCP.jsx:30-34`** — core message
> «Без MCP — AI **только отвечает**. С MCP — AI **действует**.»

OK по содержанию, но это уже не lore. Сразу после P_PersonaIntro/P_TalkPowerMoves, где идёт «Sub-agents в параллели», «riders' arts», — здесь резкое падение в маркетинг-сравнение. У этого слайда subtitle в narrative.js — «Riders' arts. What a bonded rider can do.» Подзаголовок есть, а боди вернулся к до-академическому регистру.

**`src/pages/P03_PreWork.jsx:140-141`** — escape hatch
> «Всё уже установлено — пропустить»

Honest copy ≠ корпоративное копи. Но в академии это звучит как «У меня есть справка от деканата». Можно проще: «Уже всё стоит → дальше».

### 4b. Мягкие slip-ы (можно оставить, но если есть бюджет)

**`P14_Leaderboard.jsx:104-107`** — «Submitted боты загружаются на проектор» — латинско-кириллическая морфема.

**`P_ResourcesIntro.jsx:44-48`** — список того что внутри:
> «Master setup промпт — вся QA-экосистема одной командой»
> «Пять autopilot-промптов — Setup-Doctor, Workspace-Init, MCP installer, Apply-Persona, Resume-from-error»
> «Hidden Gems — 22 продвинутых фишки Claude Code»

Это просто кусок из docs. Лоровой версии «Resource Hub» в narrative.js — «Bonded. You walked in a cadet. You leave a rider.». Контраст между обещанием на слайде и его наполнением.

**`P00_Landing.jsx:73`** — «Test app with 36 planted defects + AI review» / «Тестовое приложение с 36 дефектами + AI-ревью». Конкретность числа хорошая, но «дефектами» — корп-канцелярит. По-русски в QA-разговоре чаще «багами»: «Тестовое приложение с 36 зашитыми багами + AI-ревью».

---

## 5. Priority List — Top 10 для отгрузки до 13 мая

Порядок: impact × effort, с фокусом на не-сломать-работу-в-день-воркшопа.

| # | Action | File(s) | Reason | Effort |
|---|--------|---------|--------|--------|
| **1** | **Решить policy по украинскому к воркшопу.** Если UK не нужен 13 мая — убрать toggle из `LanguageToggle.jsx` чтоб не светить пустыми переводами. Если нужен — приоритет 2-7 ниже. | `src/components/LanguageToggle.jsx`, `src/i18n/store.js` | Самый дешёвый способ перестать врать | 15 мин |
| **2** | Перевести украинский в **5 ключевых слайдах** (P00 Landing, P02 Registration, P04 TalkIntro, P15 Graduation, P_ResourcesIntro) — это маршрут который видит каждый. | те 5 файлов | Если оставить UK toggle, эти 5 — критичный путь | 2-3 ч |
| **3** | **Захардкоженый RU без useT в `P01`, `P03`, `P06`, `P10`** — обернуть в `t()` хотя бы EN+RU (UK по бюджету). | четыре файла | Сейчас RU-only ломает английскую группу если такая будет; и фундамент для UK | 2 ч |
| **4** | **Зафиксировать lore-глоссарий** одним документом (rider/bond/signet/threshing/wing — таблица EN→RU→UK) и пройти все слайды против него. Главное несоответствие — «Сигнет Неба»/«Сигіл Неба», «bonded» untranslated, «всадник»/«наездник». | `src/data/lore-glossary.md` (new), затем `P_AerieIntro`, `P_PersonaIntro`, `P04_TalkIntro`, `P00_Landing`, `narrative.js` | Заметят первые же 5 участников | 1 ч глоссарий + 1 ч прохода |
| **5** | **Починить латинскую `p` в «Ваpд-Камень»** (`P07_TalkEcosystem.jsx:94`) → «Вард-Камень». Это visual bug, glyph искажается. | `P07_TalkEcosystem.jsx` | Стыдная мелочь | 1 мин |
| **6** | **Перепрочесть voice-slip страницы** P02 (callout + checkbox), P03 (parapet messages), P06 (steps). Эти три страницы сейчас выпадают из академии в installer-режим, и это самые длинные time-on-page страницы для участника. | три файла | Самый чувствуемый разрыв | 1.5 ч |
| **7** | **Прочистить кальки в `gems.js`** — `markdown-drawer-ом`, `attention-grab`, `adversarial к самому себе`, `mumbling/sting/jingle`, `dotachivaesh prompts`. 6 gem-слайдов смотрят минимум 20 человек по 1.5 мин каждый — самый видимый контент. | `src/data/gems.js` | High visibility, low effort | 1 ч |
| **8** | **`P04_TalkIntro` hook** — «рабочий, который живёт в твоём проекте». На flagship-слайде это первое предложение которое слышит зал. Заменить на «напарник/мастер». | `P04_TalkIntro.jsx:14-17` | First impression talk | 5 мин |
| **9** | **Решить gender** в `P15_Graduation:178` («вошла», «уходишь»), `P_BondIntro:50` («Вошла как»), `P_ArenaIntro:51`. Если группа смешанная — нейтрализовать. Если все женщины, чего скорее не — оставить и в facilitator notes пометить. | три файла | Один мужчина в зале — заметит сразу | 10 мин |
| **10** | **`P02_Registration.jsx` опции роли**: «QA Manual», «QA Automation», «QA Lead / Manager», «Developer» — UI-копи для labeling, не lore-проблема. **Но** «Other» → «Другое» (там RU/EN одинаковые сейчас) — добавить хотя бы один shadow перевод, чтоб не выглядело как machine-skipped. И «Choose your role» / «Выбери роль» — везде проверить consistency capitalisation. | `P02_Registration.jsx:144-149` | Polish | 5 мин |

---

## Appendix A — Useful patterns to fix

**Pattern A: RU-only files without `useT`.**
Замечено в: `P01_CharacterSelect`, `P03_PreWork`, `P06_InstallEcosystem`, `P10_TalkMCP`. Импортнуть `useT`, обернуть строки. Если UK не нужен в этом цикле — оставить 2-аргумент `t(en, ru)`, который и так уже работает в половине файлов.

**Pattern B: 2-arg `t(en, ru)` где надо 3-arg.**
Поиск: `grep -rEn "t\('[^']*', '[^']*'\)" src/pages src/components | grep -v "t('en'"`. Сейчас даёт ~70 строк. Это и есть рабочий лист для UK-локализации.

**Pattern C: Latin in middle of Cyrillic word (`markdown-drawer-ом`, `bias-ы`, `prompts`).**
Не systemic — точечно по `gems.js`. Не technical jargon (типа `claude --version`) — там это OK.

---

## Appendix B — Files I did not deep-dive

Эти есть в репо, но не были в списке аудита (вне scope):
- `src/pages/StandaloneRegister.jsx` (18K — отдельный регистрационный flow)
- `src/pages/P_SignetCeremony.jsx` (22K — standalone ceremony wizard)
- `src/pages/P_BondRitual.jsx` (17K — standalone bond ritual wizard)
- `src/pages/P_Aerie.jsx` (11K — aerie gallery)
- `src/pages/Arena.jsx` (3.7K)
- `src/pages/P_PersonaBuilder.jsx` (30K)
- `src/pages/P_Resources.jsx` (17K — Resource Hub standalone)
- `src/data/persona-templates.js` (22K)
- `src/data/characterPersona.js` (14K)
- `src/data/dragons/`, `src/data/signet/`, `src/data/commands/` (sub-data folders)

Эти файлы могут содержать **больше всего** lore copy и больше всего голосовых slip-ов. Если бюджет позволит — пройти их вторым раундом.
