-- ============================================================
-- Dragon matches — Eyes of the Aerie (blind matching contest)
-- Run AFTER SUPABASE_MIGRATION_2026-05-11_dragons.sql
-- ============================================================

-- Stores one guess per voter per dragon.
-- A "round" = one full pass of guesses; voter_nickname makes it
-- one round per voter (the unique index enforces this).
CREATE TABLE IF NOT EXISTS dragon_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    voter_nickname TEXT NOT NULL,
    dragon_id UUID NOT NULL REFERENCES dragons(id) ON DELETE CASCADE,
    guessed_nickname TEXT NOT NULL, -- what voter guessed the rider is
    is_correct BOOLEAN NOT NULL DEFAULT false,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- One guess per dragon per voter.
CREATE UNIQUE INDEX IF NOT EXISTS uniq_match_voter_dragon
    ON dragon_matches(voter_nickname, dragon_id);

CREATE INDEX IF NOT EXISTS idx_match_voter ON dragon_matches(voter_nickname);
CREATE INDEX IF NOT EXISTS idx_match_correct ON dragon_matches(voter_nickname, is_correct);

-- RLS
ALTER TABLE dragon_matches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "matches_read_all" ON dragon_matches;
CREATE POLICY "matches_read_all" ON dragon_matches FOR SELECT USING (true);

DROP POLICY IF EXISTS "matches_insert_all" ON dragon_matches;
CREATE POLICY "matches_insert_all" ON dragon_matches FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "matches_delete_own" ON dragon_matches;
CREATE POLICY "matches_delete_own" ON dragon_matches FOR DELETE USING (true);

-- Realtime publication (do via dashboard or run separately):
-- ALTER PUBLICATION supabase_realtime ADD TABLE dragon_matches;
