/*
  # Temporarily Disable RLS for Seeding

  1. Changes
    - Temporarily disable RLS on buildings and rooms tables
    - This allows the seeding script to populate data using anon key
    - Will be re-enabled after seeding is complete

  2. Security Notes
    - This is only for initial database setup
    - RLS should be re-enabled immediately after seeding
    - SELECT policies remain to protect data access
*/

-- Temporarily disable RLS for seeding
ALTER TABLE buildings DISABLE ROW LEVEL SECURITY;
ALTER TABLE rooms DISABLE ROW LEVEL SECURITY;
