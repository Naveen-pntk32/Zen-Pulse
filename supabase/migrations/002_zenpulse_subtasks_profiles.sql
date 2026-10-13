-- =============================================================================
-- ZenPulse Evolution Migration 002
-- Creates profiles, subtasks tables, and ensures task recurrence and positions.
-- Run in Supabase SQL Editor. Idempotent with IF NOT EXISTS guards.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Profiles Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 2. Enhance task_lists and tasks
-- -----------------------------------------------------------------------------
ALTER TABLE task_lists
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE tasks
  ADD COLUMN IF NOT EXISTS due_date TEXT,
  ADD COLUMN IF NOT EXISTS due_time TEXT,
  ADD COLUMN IF NOT EXISTS recurrence TEXT,
  ADD COLUMN IF NOT EXISTS position INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- -----------------------------------------------------------------------------
-- 3. Subtasks Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS subtasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 4. Indexes
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_subtasks_task ON subtasks(task_id);
CREATE INDEX IF NOT EXISTS idx_subtasks_user ON subtasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due ON tasks(user_id, due_date);

-- -----------------------------------------------------------------------------
-- 5. Row Level Security
-- -----------------------------------------------------------------------------
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subtasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own profile" ON profiles;
CREATE POLICY "Users can manage their own profile" ON profiles
  FOR ALL USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can manage their own subtasks" ON subtasks;
CREATE POLICY "Users can manage their own subtasks" ON subtasks
  FOR ALL USING (auth.uid() = user_id);
