-- =============================================================================
-- MCT PathAI — waitlist table
-- Run in: Supabase Dashboard → SQL Editor
-- Idempotent — safe to re-run.
-- =============================================================================

CREATE TABLE IF NOT EXISTS waitlist (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT        NOT NULL,
    email       TEXT        NOT NULL,
    visa_status TEXT        NOT NULL,
    target_role TEXT        NOT NULL DEFAULT '',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Prevent duplicate emails
CREATE UNIQUE INDEX IF NOT EXISTS waitlist_email_idx ON waitlist(email);

-- RLS: anon can INSERT (public sign-up form), service role has full access
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "anon_insert_waitlist"
    ON waitlist FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "service_full_waitlist"
    ON waitlist FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
