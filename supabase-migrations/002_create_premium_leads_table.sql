-- Migration: Create premium_leads table for the new no-auth lead capture flow
-- Project: MCT PathAI
-- Run in: Supabase SQL Editor

CREATE TABLE IF NOT EXISTS premium_leads (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at            timestamptz NOT NULL    DEFAULT now(),
  full_name             text        NOT NULL,
  email                 text        NOT NULL,
  phone                 text        NOT NULL,
  visa_status           text        NOT NULL,
  visa_status_other     text,
  selected_tier         text        NOT NULL,
  resume_storage_path   text,
  contact_status        text        NOT NULL    DEFAULT 'pending',
  contact_notes         text,
  payment_method        text,
  payment_received_at   timestamptz
);

-- Check constraints wrapped in DO blocks (Postgres has no ADD CONSTRAINT IF NOT EXISTS)
DO $$ BEGIN
  ALTER TABLE premium_leads
    ADD CONSTRAINT premium_leads_visa_status_check
    CHECK (visa_status IN ('f1_no_opt', 'f1_opt', 'f1_stem_opt', 'h1b', 'other'));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE premium_leads
    ADD CONSTRAINT premium_leads_selected_tier_check
    CHECK (selected_tier IN (
      'tier_1_master_resume',
      'tier_2_application_engine',
      'tier_3_complete_package'
    ));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE premium_leads
    ADD CONSTRAINT premium_leads_contact_status_check
    CHECK (contact_status IN (
      'pending',
      'contacted',
      'consultation_scheduled',
      'consultation_completed',
      'payment_received',
      'declined',
      'unreachable'
    ));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE premium_leads
    ADD CONSTRAINT premium_leads_payment_method_check
    CHECK (payment_method IS NULL OR payment_method IN ('zelle', 'stripe', 'other'));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_premium_leads_contact_status
  ON premium_leads (contact_status);

CREATE INDEX IF NOT EXISTS idx_premium_leads_selected_tier
  ON premium_leads (selected_tier);

CREATE INDEX IF NOT EXISTS idx_premium_leads_created_at
  ON premium_leads (created_at DESC);

-- Row-Level Security
ALTER TABLE premium_leads ENABLE ROW LEVEL SECURITY;

-- Anyone (including anon) can INSERT — the lead capture form uses the anon key
CREATE POLICY "anon_can_insert_premium_leads"
  ON premium_leads FOR INSERT
  TO anon
  WITH CHECK (true);

-- Authenticated users can INSERT too (covers edge cases)
CREATE POLICY "auth_can_insert_premium_leads"
  ON premium_leads FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- SELECT is denied for anon/authenticated by default (no policy = deny)
-- The team accesses data via the service_role key, which bypasses RLS entirely.

-- If you need a named SELECT policy for the team dashboard (using service_role JWT):
-- CREATE POLICY "service_role_select_premium_leads"
--   ON premium_leads FOR SELECT
--   TO service_role
--   USING (true);
