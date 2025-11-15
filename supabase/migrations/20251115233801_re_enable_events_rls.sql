/*
  # Re-enable RLS on Events

  1. Changes
    - Re-enable RLS on events table after seeding
    - Data security is restored

  2. Security
    - All existing policies remain in effect
    - Events are now protected by RLS
*/

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
