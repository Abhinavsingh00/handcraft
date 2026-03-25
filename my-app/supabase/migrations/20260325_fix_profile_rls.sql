-- ============================================
-- COMPLETE PROFILE RLS FIX
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================

-- 1. Enable RLS on profiles (if not already enabled)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies (if any)
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Profiles are publicly readable" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

-- 3. Create proper RLS policies

-- Public read access (anyone can view profiles)
CREATE POLICY "Profiles are publicly readable"
  ON profiles FOR SELECT
  USING (true);

-- Users can insert their own profile (during signup via client)
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can delete their own profile
CREATE POLICY "Users can delete own profile"
  ON profiles FOR DELETE
  USING (auth.uid() = id);

-- 4. Auto-create profile trigger (most reliable)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    'customer'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 5. Verify everything is set up
SELECT
  'Profiles table RLS enabled' as check,
  CASE WHEN relrowsecurity THEN '✓ PASS' ELSE '✗ FAIL' END as status
FROM pg_class WHERE relname = 'profiles';

SELECT 'Trigger created' as check,
  COUNT(*) as trigger_count
FROM pg_trigger WHERE tgname = 'on_auth_user_created';
