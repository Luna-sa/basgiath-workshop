-- ═══════════════════════════════════════════════════════════
-- Supabase Migration — 2026-05-07 (prizes + announcements)
-- ═══════════════════════════════════════════════════════════

-- 1. Prizes table — facilitator pre-configures + assigns winners
CREATE TABLE IF NOT EXISTS prizes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  position INT NOT NULL CHECK (position BETWEEN 1 AND 3),
  name TEXT NOT NULL,
  description TEXT,
  awarded_to_student_id UUID REFERENCES students(id) ON DELETE SET NULL,
  awarded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (position)
);

-- 2. Live announcements — current banner from facilitator
ALTER TABLE facilitator_state
  ADD COLUMN IF NOT EXISTS announcement TEXT,
  ADD COLUMN IF NOT EXISTS announcement_at TIMESTAMPTZ;

-- 3. RLS for prizes (mirrors students)
ALTER TABLE prizes ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'prizes' AND policyname = 'Anyone can read prizes') THEN
    CREATE POLICY "Anyone can read prizes" ON prizes FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'prizes' AND policyname = 'Anyone can insert prizes') THEN
    CREATE POLICY "Anyone can insert prizes" ON prizes FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'prizes' AND policyname = 'Anyone can update prizes') THEN
    CREATE POLICY "Anyone can update prizes" ON prizes FOR UPDATE USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'prizes' AND policyname = 'Anyone can delete prizes') THEN
    CREATE POLICY "Anyone can delete prizes" ON prizes FOR DELETE USING (true);
  END IF;
END $$;

-- 4. Seed default prize slots so admin UI has rows to edit
INSERT INTO prizes (position, name, description) VALUES
  (1, 'Champion of the Wing', 'Top XP overall · main prize'),
  (2, 'Signet of Skies', 'Highest signet creativity · second place'),
  (3, 'Easter Egg Finder', 'Found the hidden summonSignet API')
ON CONFLICT (position) DO NOTHING;
