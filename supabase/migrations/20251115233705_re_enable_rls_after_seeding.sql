/*
  # Re-enable RLS After Seeding

  1. Changes
    - Re-enable RLS on buildings and rooms tables
    - Data security is restored after seeding is complete

  2. Security
    - All existing policies remain in effect
    - Buildings and rooms are now protected by RLS again
*/

-- Re-enable RLS after seeding
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
