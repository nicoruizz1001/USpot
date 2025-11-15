/*
  # Create Events Table

  1. New Tables
    - `events`
      - `id` (uuid, primary key) - Unique identifier for each event
      - `title` (text) - Event title/name
      - `description` (text) - Detailed event description
      - `location_name` (text) - Name of the location/building
      - `room` (text) - Specific room or area within the location
      - `coordinates` (point) - Geographic coordinates for map display
      - `latitude` (decimal) - Latitude coordinate
      - `longitude` (decimal) - Longitude coordinate
      - `event_date` (date) - Date of the event
      - `event_time` (time) - Time of the event
      - `category` (text) - Event category (Social, Academic, Sports, etc.)
      - `organization_name` (text) - Name of organizing entity
      - `organization_description` (text) - Description of the organization
      - `organization_logo` (text) - URL to organization logo
      - `instagram_link` (text) - Instagram link for organization
      - `website_link` (text) - Website link for organization
      - `doorlist_link` (text) - Doorlist/registration link
      - `image_url` (text) - URL to event image
      - `created_by` (uuid, foreign key) - User who created the event
      - `created_at` (timestamptz) - Timestamp of creation
      - `updated_at` (timestamptz) - Timestamp of last update

  2. Security
    - Enable RLS on `events` table
    - Add policy for authenticated users to read all events
    - Add policy for authenticated users to create their own events
    - Add policy for users to update their own events
    - Add policy for users to delete their own events
*/

CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  location_name text NOT NULL,
  room text DEFAULT '',
  latitude decimal(10, 8) NOT NULL,
  longitude decimal(11, 8) NOT NULL,
  event_date date NOT NULL,
  event_time time NOT NULL,
  category text DEFAULT 'Other',
  organization_name text DEFAULT '',
  organization_description text DEFAULT '',
  organization_logo text,
  instagram_link text,
  website_link text,
  doorlist_link text,
  image_url text,
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view events"
  ON events
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create events"
  ON events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own events"
  ON events
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete own events"
  ON events
  FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

CREATE INDEX IF NOT EXISTS idx_events_created_by ON events(created_by);
CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
