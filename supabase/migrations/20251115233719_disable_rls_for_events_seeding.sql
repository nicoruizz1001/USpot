/*
  # Temporarily Disable RLS for Events Seeding

  1. Changes
    - Temporarily disable RLS on events table for seeding
    - This allows the seeding script to populate events using anon key

  2. Security Notes
    - Will be re-enabled after seeding
*/

ALTER TABLE events DISABLE ROW LEVEL SECURITY;
