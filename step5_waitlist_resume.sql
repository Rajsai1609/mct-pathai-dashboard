-- =============================================================================
-- MCT PathAI — waitlist resume_url column + resumes storage bucket
-- Run in: Supabase Dashboard → SQL Editor
-- Idempotent — safe to re-run.
-- =============================================================================

-- 1. Add resume_url column to waitlist table
ALTER TABLE waitlist
  ADD COLUMN IF NOT EXISTS resume_url TEXT;

-- 2. Create the resumes storage bucket (public read, authenticated upload)
--    Run this once in the Storage section of the Supabase Dashboard:
--    Bucket name : resumes
--    Public      : true   (so public URLs work via getPublicUrl())
--
--    Or via SQL using the storage schema (requires pg_storage extension):
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Storage RLS — allow anon upload (waitlist form) and public read
CREATE POLICY IF NOT EXISTS "anon_upload_resumes"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'resumes');

CREATE POLICY IF NOT EXISTS "public_read_resumes"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'resumes');
