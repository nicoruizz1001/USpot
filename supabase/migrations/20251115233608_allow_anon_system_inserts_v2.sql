/*
  # Allow Anonymous System Inserts

  1. Changes
    - Allow anon (public) role to insert buildings and rooms for seeding scripts
    - Allow anon (public) role to insert events for system-generated events
    - These are needed for automated scripts that use the anon key

  2. Security Notes
    - This is safe for initial seeding operations
    - In production, you may want to use service role key instead
    - All data is still readable only by authenticated users via existing SELECT policies
*/

-- Drop existing policies if they exist to recreate them
DROP POLICY IF EXISTS "Allow public inserts for buildings" ON buildings;
DROP POLICY IF EXISTS "Allow public inserts for rooms" ON rooms;
DROP POLICY IF EXISTS "Allow public inserts for events" ON events;

-- Allow public inserts for buildings (for seeding)
CREATE POLICY "Allow public inserts for buildings"
  ON buildings
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow public inserts for rooms (for seeding)
CREATE POLICY "Allow public inserts for rooms"
  ON rooms
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow public inserts for events (for system-generated events)
CREATE POLICY "Allow public inserts for events"
  ON events
  FOR INSERT
  TO public
  WITH CHECK (true);
