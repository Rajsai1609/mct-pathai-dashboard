-- Alumni Referral Network
-- Run in Supabase SQL editor

CREATE TABLE IF NOT EXISTS alumni (
  id               UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name        TEXT          NOT NULL,
  linkedin_url     TEXT,
  current_company  TEXT          NOT NULL,
  current_title    TEXT,
  university       TEXT          NOT NULL,
  graduation_year  INTEGER,
  major            TEXT,
  visa_status      TEXT,
  location         TEXT,
  willing_to_refer BOOLEAN       DEFAULT TRUE,
  email            TEXT,
  added_at         TIMESTAMPTZ   DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS alumni_company_idx    ON alumni (LOWER(current_company));
CREATE INDEX IF NOT EXISTS alumni_university_idx ON alumni (LOWER(university));

-- Add university to students (no-op if already exists)
ALTER TABLE students ADD COLUMN IF NOT EXISTS university TEXT;

-- Add university to waitlist
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS university TEXT;

-- RLS: anyone can read alumni (public referral network)
ALTER TABLE alumni ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "alumni_read_anon" ON alumni;
CREATE POLICY "alumni_read_anon" ON alumni FOR SELECT USING (true);
