-- ═══════════════════════════════════════════════════════════
-- Supabase Migration — 2026-05-08 (workshop checkpoints)
-- ═══════════════════════════════════════════════════════════
--
-- Each student tracks their progress through 4 install/build
-- checkpoints. Stored as JSONB so we can extend without schema change.
-- Shape: { parapet: timestamp, forge: timestamp, signet: timestamp, arena: timestamp }
--
-- Run in: Supabase Dashboard → SQL Editor → New query → Run
-- ═══════════════════════════════════════════════════════════

ALTER TABLE students ADD COLUMN IF NOT EXISTS checkpoints JSONB DEFAULT '{}'::jsonb;

-- Index for facilitator dashboard aggregations (we'll filter by
-- specific keys frequently)
CREATE INDEX IF NOT EXISTS idx_students_checkpoints_gin
  ON students USING gin (checkpoints);
