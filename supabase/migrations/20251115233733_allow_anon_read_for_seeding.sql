/*
  # Allow Anonymous Reads for Seeding

  1. Changes
    - Add SELECT policies for public role on buildings and rooms
    - This allows seeding scripts to read existing data

  2. Security Notes
    - Temporary for seeding operations
*/

DROP POLICY IF EXISTS "Allow public select buildings" ON buildings;
DROP POLICY IF EXISTS "Allow public select rooms" ON rooms;

CREATE POLICY "Allow public select buildings"
  ON buildings
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public select rooms"
  ON rooms
  FOR SELECT
  TO public
  USING (true);
