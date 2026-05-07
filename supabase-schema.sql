-- Basgiath Workshop Platform — Supabase Schema
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)

-- 1. Students table (registration + progress)
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  studio TEXT,
  role TEXT,
  experience TEXT,
  tool TEXT DEFAULT 'cursor',
  os TEXT DEFAULT 'mac',
  pain TEXT,
  claude_code_ready BOOLEAN DEFAULT false,
  character_id TEXT,
  current_page INTEGER DEFAULT 0,
  current_sub_step TEXT,
  xp INTEGER DEFAULT 0,
  badges JSONB DEFAULT '[]'::jsonb,
  completed_pages JSONB DEFAULT '[]'::jsonb,
  completed_sub_steps JSONB DEFAULT '{}'::jsonb,
  quiz_score INTEGER,
  workshop_phase TEXT DEFAULT 'pre',
  created_at TIMESTAMPTZ DEFAULT now(),
  last_seen TIMESTAMPTZ DEFAULT now()
);

-- 2. Facilitator state (single row, updated by facilitator)
CREATE TABLE IF NOT EXISTS facilitator_state (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  unlocked_page INTEGER DEFAULT 4,
  active_timer_start TIMESTAMPTZ,
  active_timer_duration INTEGER,
  active_timer_page INTEGER,
  quiz_active BOOLEAN DEFAULT false,
  voting_open BOOLEAN DEFAULT false,
  workshop_phase TEXT DEFAULT 'pre',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default facilitator state
INSERT INTO facilitator_state (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- 3. Task submissions (screenshots, self-reports)
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  page_index INTEGER NOT NULL,
  sub_step TEXT,
  type TEXT NOT NULL, -- 'self-report', 'screenshot', 'quiz'
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Leaderboard view (computed from students)
CREATE OR REPLACE VIEW leaderboard AS
SELECT
  id,
  name,
  character_id,
  xp,
  badges,
  current_page,
  RANK() OVER (ORDER BY xp DESC) as rank
FROM students
WHERE name IS NOT NULL AND name != ''
ORDER BY xp DESC;

-- 5. Enable Row Level Security
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE facilitator_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies — allow anonymous access (workshop doesn't need auth)
-- Students: anyone can read all, insert own, update own
CREATE POLICY "Anyone can read students" ON students FOR SELECT USING (true);
CREATE POLICY "Anyone can insert students" ON students FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update students" ON students FOR UPDATE USING (true);

-- Facilitator state: anyone can read, anyone can update (protected by app-level token)
CREATE POLICY "Anyone can read facilitator_state" ON facilitator_state FOR SELECT USING (true);
CREATE POLICY "Anyone can update facilitator_state" ON facilitator_state FOR UPDATE USING (true);

-- Submissions: anyone can read all, insert own
CREATE POLICY "Anyone can read submissions" ON submissions FOR SELECT USING (true);
CREATE POLICY "Anyone can insert submissions" ON submissions FOR INSERT WITH CHECK (true);

-- 7. Enable Realtime on facilitator_state (students subscribe to changes)
ALTER PUBLICATION supabase_realtime ADD TABLE facilitator_state;
ALTER PUBLICATION supabase_realtime ADD TABLE students;

-- 8. Index for leaderboard performance
CREATE INDEX IF NOT EXISTS idx_students_xp ON students(xp DESC);
CREATE INDEX IF NOT EXISTS idx_students_last_seen ON students(last_seen);

-- ─────────────────────────────────────────────────────────
-- Migration 2026-05-07: registration form expansion
-- Run if the students table already exists in your Supabase
-- ─────────────────────────────────────────────────────────
ALTER TABLE students ADD COLUMN IF NOT EXISTS studio TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS pain TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS claude_code_ready BOOLEAN DEFAULT false;
