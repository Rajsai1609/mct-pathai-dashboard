-- =============================================================================
-- MCT PathAI — RLS fix for homepage stats (Issue 3)
-- Run in: Supabase Dashboard → SQL Editor
-- Ensures anon key can SELECT COUNT from all three tables used by the dashboard.
-- Idempotent — safe to re-run.
-- =============================================================================

-- scraped_jobs
ALTER TABLE scraped_jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_scraped_jobs" ON scraped_jobs;
CREATE POLICY "anon_read_scraped_jobs"
    ON scraped_jobs FOR SELECT
    TO anon, authenticated
    USING (true);

-- students
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_students" ON students;
CREATE POLICY "anon_read_students"
    ON students FOR SELECT
    TO anon, authenticated
    USING (true);

-- student_job_scores
ALTER TABLE student_job_scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_scores" ON student_job_scores;
CREATE POLICY "anon_read_scores"
    ON student_job_scores FOR SELECT
    TO anon, authenticated
    USING (true);
