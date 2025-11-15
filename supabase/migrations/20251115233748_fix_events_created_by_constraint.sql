/*
  # Fix Events Created By Constraint

  1. Changes
    - Drop foreign key constraint on events.created_by
    - This allows system-generated events with special UUID
    - created_by can now be null or any UUID value

  2. Security Notes
    - System events use 00000000-0000-0000-0000-000000000000
    - User-created events still store the actual user ID
*/

-- Drop the foreign key constraint
ALTER TABLE events DROP CONSTRAINT IF EXISTS events_created_by_fkey;

-- Ensure created_by can be null
ALTER TABLE events ALTER COLUMN created_by DROP NOT NULL;
