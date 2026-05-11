# Workshop Deploy Checklist (2026-05-13)

Walking-on order. Top to bottom. Skip nothing.

## 1. Supabase migration (one-time, blocking)

Open Supabase dashboard → SQL Editor → paste contents of
`SUPABASE_MIGRATION_2026-05-11_dragons.sql` → Run.

Expected output: `Success. No rows returned.` plus the new tables
visible under Database → Tables: `dragons`, `dragon_votes`.

Storage → Buckets should show a `dragons` bucket marked **public**.

## 2. Enable Supabase Realtime for new tables (one-time)

Realtime is what powers live Aerie updates (new dragons appear, vote
counts tick) without page refresh. The migration creates the tables
but Realtime publication is a UI step.

Supabase dashboard → Database → Replication → `supabase_realtime`
publication → toggle ON for `dragons` and `dragon_votes`.

Without this, Aerie still works but only via 30-second poll (no
push updates).

## 3. Verify OPENAI_API_KEY in chatbot-mentor backend

The workshop backend (`chatbot-mentor`) proxies both Whisper and
gpt-image-2 to OpenAI. It already uses OpenAI for Kai voice
transcription, so the key should already be in Render env.

Render dashboard → `chatbot-mentor` service → Environment →
confirm `OPENAI_API_KEY` is set.

After today's push (2026-05-11), Render will auto-redeploy the
backend with the new `/api/workshop/transcribe` and
`/api/workshop/generate-dragon` endpoints.

## 4. Smoke test the full flow (before participants arrive)

Browser steps from a fresh incognito window:

  1. https://basgiath-workshop.onrender.com/
     → choose a character (or "Это я")
     → register with a test nickname (`smoke_test`)
     → walk through to slide 10 (Signet Ceremony intro)
  2. Click "Begin the Ceremony"
     → walk all 7 rituals (test voice input on a textarea — should
       show mic icon, record, transcribe back to text)
     → at "The Bond is Sealed", click "Copy sealed prompt"
     → paste into a Claude Code window to verify the prompt parses
  3. Back to main flow, advance to slide 19 (Bond Ritual intro)
     → click "Begin the Bond"
     → walk all 7 bond questions
     → click "Manifest" → wait ~30 seconds for image
     → click "Seal & Share"
     → should redirect to /?page=aerie and show your dragon
  4. Open a second browser (or incognito) with a different nickname
     → go to /?page=aerie
     → cast a vote on the test dragon
     → verify vote count ticks up live in the first browser

If any step fails, the most likely causes:

  - Migration not run → seal returns 401 / RLS error
  - Realtime not enabled → vote count needs refresh
  - OPENAI_API_KEY missing → /api/workshop/* returns 500/503
  - chatbot-mentor still deploying → wait 90 seconds and retry

## 5. Facilitator-side setup

Workshop unlock state lives in Supabase `facilitator_state.unlocked_page`.
After adding the new slides (Bond Ritual, Aerie) the total page count is
25 (was 23). When ready to open everything:

  Workshop admin URL (`?token=...`) → Advance All Students → click
  the **last** page button (24). This sets `unlocked_page = 25` and
  every slide becomes navigable.

## 6. Day-of safeguards

  - Have a backup nickname ready in case Supabase pulls a strange
    cache (clear localStorage + try again).
  - If gpt-image-2 errors with "model not found", the backend will
    auto-fall back to gpt-image-1 — same prompt, slightly different
    aesthetic but still photoreal.
  - The OPENAI_API_KEY in workshop-landing `.env` is currently for
    server-side use only (no VITE_ prefix). After the workshop,
    rotate the key on OpenAI dashboard as standard hygiene.

## 7. Post-workshop

  - The Aerie persists. Participants can return any time with their
    nickname and see all the dragons.
  - Optional cleanup: delete test dragons (`smoke_test`, etc.) from
    Supabase `dragons` table via dashboard.
