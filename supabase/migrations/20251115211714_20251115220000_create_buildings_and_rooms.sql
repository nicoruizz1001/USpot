/*
  # Create Buildings and Rooms Tables for Lock-In Feature

  ## Overview
  This migration creates the database schema for storing UVA building and room information
  used in the Lock-In feature for finding available study spaces.

  ## New Tables

  ### `buildings`
  Stores information about UVA buildings that have study spaces
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Building name (e.g., "Shannon Library")
  - `category` (text) - Building category (Library, Academic, Student Life, Recreation)
  - `sub_area` (text) - Campus sub-area (e.g., "Libraries", "Engineering & Applied Science")
  - `latitude` (decimal) - Latitude coordinate for map display
  - `longitude` (decimal) - Longitude coordinate for map display
  - `hours` (text) - Operating hours (e.g., "24/7", "8 AM - 10 PM")
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `rooms`
  Stores information about individual study rooms within buildings
  - `id` (uuid, primary key) - Unique identifier
  - `building_id` (uuid, foreign key) - References buildings table
  - `room_name` (text) - Room identifier (e.g., "318 C", "Rice 120 - Auditorium")
  - `capacity` (integer) - Maximum occupancy
  - `floor` (text) - Floor location (e.g., "1", "G", "3")
  - `available` (boolean) - Current availability status
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS on both tables
  - Allow public read access for authenticated users
  - Restrict write access (will be managed through admin interface later)

  ## Indexes
  - Index on building category for filtering
  - Index on building sub_area for filtering
  - Index on room building_id for efficient joins
  - Index on room availability for quick availability queries
*/

CREATE TABLE IF NOT EXISTS buildings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  sub_area text NOT NULL,
  latitude decimal(10, 8) NOT NULL,
  longitude decimal(11, 8) NOT NULL,
  hours text DEFAULT '8 AM - 10 PM',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id uuid REFERENCES buildings(id) ON DELETE CASCADE NOT NULL,
  room_name text NOT NULL,
  capacity integer DEFAULT 0,
  floor text DEFAULT '1',
  available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view buildings"
  ON buildings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view rooms"
  ON rooms
  FOR SELECT
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_buildings_category ON buildings(category);
CREATE INDEX IF NOT EXISTS idx_buildings_sub_area ON buildings(sub_area);
CREATE INDEX IF NOT EXISTS idx_rooms_building_id ON rooms(building_id);
CREATE INDEX IF NOT EXISTS idx_rooms_available ON rooms(available);
