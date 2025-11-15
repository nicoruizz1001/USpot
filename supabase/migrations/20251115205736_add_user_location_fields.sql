/*
  # Add User Location Fields to Profiles

  1. New Columns
    - `latitude` (decimal) - User's current latitude coordinate
    - `longitude` (decimal) - User's current longitude coordinate  
    - `location_enabled` (boolean) - Whether user has opted into location tracking
    - `location_permission_asked` (boolean) - Whether user has been asked for location permission
    - `last_location_update` (timestamptz) - Timestamp of last location update

  2. Changes
    - Add new columns to profiles table with appropriate defaults
    - Create indexes on latitude and longitude for efficient spatial queries
    - No changes needed to existing RLS policies (users can already update their own profiles)

  3. Notes
    - location_enabled defaults to false (opt-in required)
    - location_permission_asked defaults to false (will be set true after onboarding prompt)
    - Latitude and longitude are nullable (null when location disabled or not yet obtained)
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'latitude'
  ) THEN
    ALTER TABLE profiles ADD COLUMN latitude decimal(10, 8);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'longitude'
  ) THEN
    ALTER TABLE profiles ADD COLUMN longitude decimal(11, 8);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'location_enabled'
  ) THEN
    ALTER TABLE profiles ADD COLUMN location_enabled boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'location_permission_asked'
  ) THEN
    ALTER TABLE profiles ADD COLUMN location_permission_asked boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'last_location_update'
  ) THEN
    ALTER TABLE profiles ADD COLUMN last_location_update timestamptz;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_profiles_latitude ON profiles(latitude) WHERE latitude IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_longitude ON profiles(longitude) WHERE longitude IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_location_enabled ON profiles(location_enabled) WHERE location_enabled = true;