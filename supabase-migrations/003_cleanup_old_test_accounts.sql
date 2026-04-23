-- Cleanup script: List test accounts for manual review
-- Project: MCT PathAI
-- Instructions: Run the SELECT queries first to review rows.
--               Uncomment the DELETE statements only after confirming you want removal.

-- ── 1. List test accounts in auth.users ─────────────────────────────────────
SELECT
  id,
  email,
  created_at,
  last_sign_in_at,
  email_confirmed_at
FROM auth.users
WHERE email LIKE 'rajsainaredla114+test%@gmail.com'
ORDER BY created_at DESC;

-- ── 2. List test rows in paid_users ─────────────────────────────────────────
SELECT
  id,
  email,
  full_name,
  created_at,
  selected_tier,
  consultation_status
FROM paid_users
WHERE email LIKE 'rajsainaredla114+test%@gmail.com'
ORDER BY created_at DESC;

-- ── 3. Commented-out deletions — uncomment after reviewing results above ────

-- Step A: Remove from paid_users first (foreign key safety)
-- DELETE FROM paid_users
-- WHERE email LIKE 'rajsainaredla114+test%@gmail.com';

-- Step B: Remove auth users (Supabase cascade handles auth.identities)
-- DELETE FROM auth.users
-- WHERE email LIKE 'rajsainaredla114+test%@gmail.com';
