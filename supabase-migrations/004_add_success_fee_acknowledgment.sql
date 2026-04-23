-- Migration: Add success_fee_acknowledged column to premium_leads
-- Project: MCT PathAI
-- Run in: Supabase SQL Editor
--
-- Context: Tier 2 (Application Engine) and Tier 3 (Complete Career Package)
-- include an 8% success fee on accepted job offers. The /premium/join form
-- now shows a mandatory acknowledgment checkbox for these tiers. This column
-- records whether the lead explicitly checked that box before submitting.
-- Tier 1 (Master Resume) has no success fee and will always have this as false.

ALTER TABLE premium_leads
  ADD COLUMN IF NOT EXISTS success_fee_acknowledged BOOLEAN DEFAULT false;

COMMENT ON COLUMN premium_leads.success_fee_acknowledged IS
  'True when the lead checked the success-fee disclosure checkbox on /premium/join. '
  'Always false for Tier 1 (Master Resume). Required for Tier 2 and Tier 3 before form submission.';
