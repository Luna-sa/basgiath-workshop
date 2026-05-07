-- ═══════════════════════════════════════════════════════════
-- Supabase Migration — 2026-05-07 (bot submissions)
-- Stores Dragon Arena bot code that participants submit during
-- the workshop. Facilitator pulls these to assemble the final
-- battle.
-- ═══════════════════════════════════════════════════════════
--
-- Run in: Supabase Dashboard → SQL Editor → New query → Run
-- Safe to run multiple times (uses IF NOT EXISTS).
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS bot_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname TEXT NOT NULL,
  character_id TEXT NOT NULL CHECK (character_id IN ('violet', 'xaden', 'rhiannon', 'ridoc', 'liam', 'imogen')),
  code TEXT NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  -- Optional metadata
  notes TEXT,
  preview_score INTEGER
);

-- Index for facilitator: latest submission per character
CREATE INDEX IF NOT EXISTS idx_bot_submissions_character_time
  ON bot_submissions(character_id, submitted_at DESC);

-- Index for individual user lookup
CREATE INDEX IF NOT EXISTS idx_bot_submissions_nickname
  ON bot_submissions(nickname);

-- Enable Row Level Security
ALTER TABLE bot_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can read submissions (workshop is collaborative).
-- Anyone can insert their own.
-- Anyone can delete (RLS-pattern matches existing students table — facilitator
-- deletes test rows from the dashboard).
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bot_submissions' AND policyname = 'Anyone can read bot submissions') THEN
    CREATE POLICY "Anyone can read bot submissions" ON bot_submissions FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bot_submissions' AND policyname = 'Anyone can insert bot submissions') THEN
    CREATE POLICY "Anyone can insert bot submissions" ON bot_submissions FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bot_submissions' AND policyname = 'Anyone can delete bot submissions') THEN
    CREATE POLICY "Anyone can delete bot submissions" ON bot_submissions FOR DELETE USING (true);
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────
-- Verification (run after to confirm)
-- ─────────────────────────────────────────────────────────

-- Check table exists with all columns
-- SELECT column_name, data_type FROM information_schema.columns
-- WHERE table_name = 'bot_submissions' ORDER BY ordinal_position;

-- Check policies
-- SELECT policyname FROM pg_policies WHERE tablename = 'bot_submissions';

-- Test insert (replace nickname with one that exists in students):
-- INSERT INTO bot_submissions (nickname, character_id, code)
-- VALUES ('test_user', 'violet', 'function tick(){ return { angle: 0, throttle: 0 } }');
-- SELECT * FROM bot_submissions;
-- DELETE FROM bot_submissions WHERE nickname = 'test_user';
