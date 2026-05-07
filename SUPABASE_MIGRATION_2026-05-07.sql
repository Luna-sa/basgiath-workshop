-- ═══════════════════════════════════════════════════════════
-- Supabase Migration — 2026-05-07
-- Workshop registration form expansion
-- ═══════════════════════════════════════════════════════════
--
-- Run this in:
--   Supabase Dashboard → SQL Editor → New query
--   Paste, click "Run"
--
-- What it does:
--   Adds 3 new columns to the existing `students` table.
--   Safe to run multiple times — uses IF NOT EXISTS.
--
-- Time to run: ~1 second.
-- Rollback safe: yes (additive only, no data loss).
--
-- ═══════════════════════════════════════════════════════════

ALTER TABLE students ADD COLUMN IF NOT EXISTS studio TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS pain TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS claude_code_ready BOOLEAN DEFAULT false;

-- ═══════════════════════════════════════════════════════════
-- Verification queries (optional — run after to check)
-- ═══════════════════════════════════════════════════════════

-- Check that new columns exist:
-- SELECT column_name, data_type, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'students'
--   AND column_name IN ('studio', 'pain', 'claude_code_ready');

-- Check current student count (should not be zero if you've had registrations):
-- SELECT COUNT(*) FROM students;
