/*
  # Allow System-Generated Events

  1. Changes
    - Remove NOT NULL constraint from events.created_by to allow system-generated events
    - System events will have created_by set to a special UUID: 00000000-0000-0000-0000-000000000000

  2. Security
    - RLS policies remain unchanged
    - System events are readable by all authenticated users
*/

DO $$
BEGIN
  -- Drop the NOT NULL constraint if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' 
    AND column_name = 'created_by' 
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE events ALTER COLUMN created_by DROP NOT NULL;
  END IF;
END $$;

-- Update the default value to the system user UUID
ALTER TABLE events ALTER COLUMN created_by SET DEFAULT '00000000-0000-0000-0000-000000000000'::uuid;
