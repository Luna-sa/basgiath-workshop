-- ============================================================
-- Dragons + voting tables for Bond Ritual + Aerie (Sprint 2.1)
-- Run in Supabase SQL Editor.
-- ============================================================

-- 1. Storage bucket for dragon portraits.
--    Run this in Supabase dashboard (Storage > New bucket) or via SQL:
--    Name: dragons
--    Public: yes (anyone with URL can view — workshop is public)
--    File size limit: 5 MB
--
-- The SQL way (idempotent):
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'dragons',
    'dragons',
    true,
    5242880,
    ARRAY['image/png', 'image/jpeg', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to upload (workshop is public).
-- Tight policy: name must look like a UUID + .png (so participants
-- can't overwrite each other or upload arbitrary names).
DROP POLICY IF EXISTS "Anyone can upload to dragons" ON storage.objects;
CREATE POLICY "Anyone can upload to dragons"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'dragons'
);

DROP POLICY IF EXISTS "Anyone can read dragons" ON storage.objects;
CREATE POLICY "Anyone can read dragons"
ON storage.objects FOR SELECT
USING ( bucket_id = 'dragons' );

-- ============================================================
-- 2. dragons table
-- ============================================================
CREATE TABLE IF NOT EXISTS dragons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE SET NULL,
    nickname TEXT NOT NULL,
    character_id TEXT, -- 'violet' / 'xaden' / 'self' etc., nullable
    name TEXT NOT NULL,
    answers JSONB NOT NULL DEFAULT '{}'::jsonb,
    prompt TEXT,
    image_url TEXT NOT NULL,
    model_used TEXT,
    vote_count INT NOT NULL DEFAULT 0,
    sealed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dragons_sealed_at ON dragons(sealed_at DESC);
CREATE INDEX IF NOT EXISTS idx_dragons_vote_count ON dragons(vote_count DESC);
CREATE INDEX IF NOT EXISTS idx_dragons_nickname ON dragons(nickname);

-- One dragon per nickname (re-seal replaces; not allowed to spam Aerie).
CREATE UNIQUE INDEX IF NOT EXISTS uniq_dragons_nickname ON dragons(nickname);

-- ============================================================
-- 3. dragon_votes table — one vote per voter
-- ============================================================
CREATE TABLE IF NOT EXISTS dragon_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    voter_nickname TEXT NOT NULL,
    dragon_id UUID NOT NULL REFERENCES dragons(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Hard one-vote-per-voter rule.
CREATE UNIQUE INDEX IF NOT EXISTS uniq_votes_voter ON dragon_votes(voter_nickname);

CREATE INDEX IF NOT EXISTS idx_votes_dragon ON dragon_votes(dragon_id);

-- ============================================================
-- 4. Auto-update vote_count on dragons via trigger
-- ============================================================
CREATE OR REPLACE FUNCTION update_dragon_vote_count() RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE dragons SET vote_count = vote_count + 1 WHERE id = NEW.dragon_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE dragons SET vote_count = vote_count - 1 WHERE id = OLD.dragon_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_dragon_vote_count ON dragon_votes;
CREATE TRIGGER trg_dragon_vote_count
AFTER INSERT OR DELETE ON dragon_votes
FOR EACH ROW EXECUTE FUNCTION update_dragon_vote_count();

-- ============================================================
-- 5. RLS: public reads, controlled inserts
-- ============================================================
ALTER TABLE dragons ENABLE ROW LEVEL SECURITY;
ALTER TABLE dragon_votes ENABLE ROW LEVEL SECURITY;

-- Anyone can read both tables (Aerie is public).
DROP POLICY IF EXISTS "dragons_read_all" ON dragons;
CREATE POLICY "dragons_read_all" ON dragons FOR SELECT USING (true);

DROP POLICY IF EXISTS "votes_read_all" ON dragon_votes;
CREATE POLICY "votes_read_all" ON dragon_votes FOR SELECT USING (true);

-- Anyone can insert a dragon (workshop participants).
DROP POLICY IF EXISTS "dragons_insert_all" ON dragons;
CREATE POLICY "dragons_insert_all" ON dragons FOR INSERT WITH CHECK (true);

-- Anyone can re-seal their own (delete + re-insert under same nickname).
DROP POLICY IF EXISTS "dragons_delete_own" ON dragons;
CREATE POLICY "dragons_delete_own" ON dragons FOR DELETE USING (true);

-- Anyone can vote (the unique index enforces one vote per voter).
DROP POLICY IF EXISTS "votes_insert_all" ON dragon_votes;
CREATE POLICY "votes_insert_all" ON dragon_votes FOR INSERT WITH CHECK (true);

-- Anyone can change their vote (delete then re-insert).
DROP POLICY IF EXISTS "votes_delete_own" ON dragon_votes;
CREATE POLICY "votes_delete_own" ON dragon_votes FOR DELETE USING (true);

-- ============================================================
-- DONE
-- After running, basgiath-workshop participants can seal dragons
-- and vote from /?page=aerie.
-- ============================================================
