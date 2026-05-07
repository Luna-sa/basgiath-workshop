-- ═══════════════════════════════════════════════════════════
-- Supabase Migration — 2026-05-07 (delete policy)
-- Allows the facilitator dashboard to actually delete rows
-- from students. Without this, RLS silently blocks DELETE.
-- ═══════════════════════════════════════════════════════════
--
-- Run in: Supabase Dashboard → SQL Editor → New query → Run
-- Safe to re-run.
-- ═══════════════════════════════════════════════════════════

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'students' AND policyname = 'Anyone can delete students'
  ) THEN
    CREATE POLICY "Anyone can delete students" ON students FOR DELETE USING (true);
  END IF;
END $$;

-- Same for submissions (in case you need to clear test data there too)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'submissions' AND policyname = 'Anyone can delete submissions'
  ) THEN
    CREATE POLICY "Anyone can delete submissions" ON submissions FOR DELETE USING (true);
  END IF;
END $$;
