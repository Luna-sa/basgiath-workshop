-- ═══════════════════════════════════════════════════════════
-- Supabase Migration — 2026-05-07 (nickname gate)
-- Adds unique nickname column to students table
-- ═══════════════════════════════════════════════════════════
--
-- Run in: Supabase Dashboard → SQL Editor → New query → Run
-- Safe to run multiple times (uses IF NOT EXISTS).
-- ═══════════════════════════════════════════════════════════

ALTER TABLE students ADD COLUMN IF NOT EXISTS nickname TEXT;

-- Add unique constraint (won't fail if it already exists in some databases,
-- but if it does fail because of duplicates, you'll need to deduplicate first).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'students_nickname_unique'
  ) THEN
    ALTER TABLE students ADD CONSTRAINT students_nickname_unique UNIQUE (nickname);
  END IF;
END $$;

-- Index for fast nickname lookup at workshop gate
CREATE INDEX IF NOT EXISTS idx_students_nickname ON students(nickname);
