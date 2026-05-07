# Workshop Invitation - Plain Text Fallback

Use this if Outlook strips your HTML, or if you need a plain-text version
for accessibility / spam filters. Primary file is `INVITATION_EMAIL.html`.

---

## Subject

```
QA Clan · Claude Code Workshop - pre-registration mandatory
```

## Preheader

```
Pre-registration mandatory. Install Claude Code before the workshop. 1.5 hours hands-on.
```

## Body - plain text

```
QA CLAN · WORKSHOP

Claude Code for QA
1 to 1.5 hours, hands-on. Set up Claude Code as your QA partner,
configure the full ecosystem, take everything home.

▲ ATTENTION
Pre-registration is MANDATORY. No registration, no entry.
Claude Code must be installed before the workshop.

WHAT WE DO

  - Install the QA ecosystem in one prompt:
    slash commands, agents, MCP servers
  - Build your own AI partner with a chosen character
  - Walk away with the full ecosystem live in your terminal -
    CLAUDE.md, slash commands, agents, MCP - ready Monday morning

If we run out of time on any task, take the materials home
and finish there.

WHEN AND WHERE

  When:  May 13, 2026 · 14:00 - 15:30
  Where: Watermelon room (offline) or online

TWO THINGS TO ATTEND

1. Register (mandatory): https://basgiath-workshop.onrender.com
   Closes May 12, 17:00. No registration, no entry.

2. Install Claude Code before the workshop.
   The workshop runs entirely in Claude Code.
   Without it installed you cannot participate.

   macOS / Linux:
     curl -fsSL https://claude.ai/install.sh | bash

   Windows:
     WSL or https://claude.ai/download

   Verify:
     claude --version

- Anastasia
```

---

## Placeholders

| Token | What to put in |
|---|---|
| `[DATE]` | "Tuesday, May 13, 2026" |
| `[TIME]` | "10:00 IDT" |
| `https://basgiath-workshop.onrender.com` | Workshop landing URL on Render (your live site) |
| `May 12, 17:00` | Registration close date |
| Hero image | Already wired to `https://basgiath-workshop.onrender.com/email-hero.jpg`. Update URL in HTML if your Render URL is different. Image source file: `public/email-hero.jpg` |

---

## Day-before reminder

```
Subject: Tomorrow at [TIME] - QA Clan Workshop

Bring laptop with charger and Claude Code installed.
If not yet installed, do it tonight:

  curl -fsSL https://claude.ai/install.sh | bash
  claude --version

- Anastasia
```

## 30-min before reminder

```
Subject: Starting in 30 minutes

Open Claude Code, laptop with charger nearby.

- Anastasia
```
