import ComponentDeepDive from '../components/ComponentDeepDive'

export default function P_CompSkills() {
  return <ComponentDeepDive pageIndex={9} data={DATA} />
}

const DATA = {
  eyebrow: 'COMPONENT · 04 · wings',
  heroImage: '/hero/skills-tattoo.jpg',
  name: 'Skills',
  path: '~/.claude/skills/',
  tagline_en: "Reusable abilities Claude gains by reading a folder. Like browser extensions for the brain - install once, available whenever the trigger fires.",
  tagline_ru: 'Многоразовые способности которые Claude получает, прочитав папку. Как браузерные расширения для мозга - установил один раз, доступны когда срабатывает trigger.',
  tagline_uk: 'Багаторазові здібності, які Claude отримує, прочитавши теку. Як браузерні розширення для мозку - встановив один раз, доступні коли спрацьовує тригер.',
  stats: [
    { value: 'folder', label: 'unit' },
    { value: 'on-demand', label: 'load' },
    { value: 'skills.sh', label: 'marketplace' },
  ],
  what_en: "A skill is a folder under ~/.claude/skills/<skill-name>/. Inside: a SKILL.md (entry point with trigger phrases + instructions), optional supporting files (templates, scripts, reference data). Claude scans the skills folder at start; when your prompt hints at a skill's trigger, Claude loads that skill's SKILL.md into context. Unlike commands, skills aren't called by name - they're activated when the model decides this trigger fits. Marketplace: skills.sh + the /plugin browser inside Claude Code.",
  what_ru: 'Skill - это папка под ~/.claude/skills/<имя-скилла>/. Внутри: SKILL.md (точка входа с trigger-фразами + инструкциями), опциональные файлы поддержки (шаблоны, скрипты, reference data). Claude сканирует папку skills при старте; когда твой промпт намекает на trigger скилла, Claude загружает SKILL.md этого скилла в контекст. В отличие от commands, skills не вызываются по имени - они активируются когда модель решает что trigger подходит. Marketplace: skills.sh + /plugin browser внутри Claude Code.',
  what_uk: 'Skill - це тека під ~/.claude/skills/<імʼя-скілла>/. Всередині: SKILL.md (точка входу з trigger-фразами + інструкціями), опціональні файли підтримки (шаблони, скрипти, reference data). Claude сканує теку skills при старті; коли твій промпт натякає на trigger скілла, Claude завантажує SKILL.md цього скілла в контекст. На відміну від commands, skills не викликаються за імʼям - вони активуються коли модель вирішує що trigger підходить. Marketplace: skills.sh + /plugin browser усередині Claude Code.',
  structure: `~/.claude/skills/
├── taste/                  ← LeonxInx/taste-skill (workshop ref)
│   ├── SKILL.md            ← trigger phrases + design instructions
│   ├── examples/
│   └── golden-ratio.md
├── design-extract/         ← Manavarya09/design-extract
│   ├── SKILL.md
│   └── scripts/extract.py
├── impeccable/             ← pbakaus/impeccable
│   └── SKILL.md            ← 23 commands against AI slop
├── open-design/            ← nexu-io/open-design
│   ├── SKILL.md            ← 31 sub-skills, 71 design systems
│   └── systems/...
└── superpowers/            ← obra/superpowers (meta-skill)
    └── SKILL.md            ← routes intent to other skills`,
  anatomy: [
    {
      field: 'SKILL.md',
      desc_en: 'Required entry file. Markdown with frontmatter (name, description, triggers) plus the actual instructions.',
      desc_ru: 'Обязательный entry-файл. Markdown с frontmatter (name, description, triggers) + сами инструкции.',
      desc_uk: 'Обовʼязковий entry-файл. Markdown із frontmatter (name, description, triggers) + самі інструкції.',
    },
    {
      field: 'triggers',
      desc_en: 'Phrases in user prompts that hint Claude to activate this skill. Multiple phrases recommended.',
      desc_ru: 'Фразы в промптах юзера которые намекают Claude активировать этот скилл. Рекомендуется несколько.',
      desc_uk: 'Фрази в промптах юзера, які натякають Claude активувати цей скілл. Рекомендується кілька.',
    },
    {
      field: 'supporting files',
      desc_en: 'Templates, code, reference docs. Claude reads them only when the skill is activated.',
      desc_ru: 'Шаблоны, код, reference-доки. Claude читает только когда скилл активирован.',
      desc_uk: 'Шаблони, код, reference-доки. Claude читає тільки коли скілл активований.',
    },
    {
      field: 'install',
      desc_en: 'Two ways: `npx skills add author/name` (registry) or `gh repo clone author/name ~/.claude/skills/name` (raw).',
      desc_ru: 'Два пути: `npx skills add author/name` (registry) или `gh repo clone author/name ~/.claude/skills/name` (raw).',
      desc_uk: 'Два шляхи: `npx skills add author/name` (registry) або `gh repo clone author/name ~/.claude/skills/name` (raw).',
    },
  ],
  example_label: '~/.claude/skills/taste/SKILL.md',
  example: `---
name: taste
description: |
  Front-end design taste - call when the user asks for a UI,
  landing page, dashboard layout, or anything visual.
triggers:
  - "design a"
  - "build a landing page"
  - "make this UI look good"
  - "improve the visual design"
---

# Design Taste

Before writing any layout, hold these references:

## Hierarchy
The eye lands on ONE thing per screen. Headline > everything.
Body text is 60-75 characters per line. Never 120.

## Type
Default scale: 14 / 16 / 20 / 28 / 44 / 72. Pick three.
Line-height = 1.5 for body, 1.1 for display, 1.3 in between.

## Colour
One brand colour, used at < 20% surface coverage. Greys do the
rest. The brand colour is the place the eye lands.

## Motion
< 200ms for feedback (hover, click). 200-400ms for transitions
that move the page. > 400ms is decorative - use sparingly.

## Negative space
The space between things is the thing. Components are 2× more
breathing-room than you think you need.

For each design task: anchor a reference image first
(see /references/), name the design DNA in one sentence, then
write the markup.`,
  when: [
    {
      en: "When the same KIND of work keeps coming up but the trigger varies - different prompts, same underlying skill (design, security, testing, docs).",
      ru: 'Когда один и тот же ТИП работы возникает регулярно, но trigger разный - разные промпты, один underlying skill (design, security, testing, docs).',
      uk: 'Коли один і той же ТИП роботи виникає регулярно, але trigger різний - різні промпти, один underlying skill (design, security, testing, docs).',
    },
    {
      en: 'When you want Claude to remember a craft discipline ALWAYS - not because you typed the command, but because the topic showed up.',
      ru: 'Когда хочешь чтобы Claude помнил craft-дисциплину ВСЕГДА - не потому что ты ввел команду, а потому что всплыла тема.',
      uk: 'Коли хочеш щоб Claude памʼятав craft-дисципліну ЗАВЖДИ - не тому що ти ввів команду, а тому що зʼявилася тема.',
    },
    {
      en: "When you want to install someone else's craft (Anthropic's official skills, community skills from skills.sh, anything on GitHub).",
      ru: "Когда хочешь установить чужой craft (официальные skills Anthropic, community-skills с skills.sh, всё что на GitHub).",
      uk: "Коли хочеш встановити чужий craft (офіційні skills Anthropic, community-skills з skills.sh, все що на GitHub).",
    },
  ],
}
