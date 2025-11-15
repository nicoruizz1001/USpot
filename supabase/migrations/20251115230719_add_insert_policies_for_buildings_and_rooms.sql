/*
  # Add Insert Policies for Buildings and Rooms

  ## Overview
  This migration adds INSERT policies to allow authenticated users to insert
  buildings and rooms data. This is needed for the seeding script and future
  admin functionality.

  ## Changes
  - Add INSERT policy for buildings table
  - Add INSERT policy for rooms table
  - These policies allow authenticated users to insert data
  - Future enhancement: restrict to admin users only

  ## Security Notes
  - Currently allows any authenticated user to insert
  - In production, should be restricted to admin users via app_metadata check
  - RLS is still enabled, preventing unauthorized access
*/

CREATE POLICY "Authenticated users can insert buildings"
  ON buildings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert rooms"
  ON rooms
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
