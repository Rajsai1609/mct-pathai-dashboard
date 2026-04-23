-- Migration: Add tier selection columns to paid_users
-- Run this in Supabase SQL Editor before deploying the /select-plan page.
-- Project: MCT PathAI

ALTER TABLE paid_users
  ADD COLUMN IF NOT EXISTS selected_tier        text        DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS tier_selected_at     timestamptz DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS consultation_status  text        DEFAULT 'pending';

-- Optional: add a check constraint to enforce valid tier values
ALTER TABLE paid_users
  ADD CONSTRAINT IF NOT EXISTS paid_users_selected_tier_check
    CHECK (
      selected_tier IS NULL OR selected_tier IN (
        'tier_1_master_resume',
        'tier_2_application_engine',
        'tier_3_complete_package'
      )
    );

-- Optional: add a check constraint to enforce valid status values
ALTER TABLE paid_users
  ADD CONSTRAINT IF NOT EXISTS paid_users_consultation_status_check
    CHECK (
      consultation_status IN ('pending', 'scheduled', 'completed', 'declined')
    );

-- Create an index so the team dashboard can filter by status quickly
CREATE INDEX IF NOT EXISTS idx_paid_users_consultation_status
  ON paid_users (consultation_status);

CREATE INDEX IF NOT EXISTS idx_paid_users_selected_tier
  ON paid_users (selected_tier);
