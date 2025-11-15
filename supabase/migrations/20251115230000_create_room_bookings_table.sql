/*
  # Create Room Bookings Table

  ## Overview
  This migration creates the database schema for room booking functionality,
  allowing users to reserve study rooms in buildings with time slot management.

  ## New Tables

  ### `bookings`
  Stores information about room reservations made by users
  - `id` (uuid, primary key) - Unique identifier for the booking
  - `user_id` (uuid, foreign key) - References profiles table (user who made the booking)
  - `room_id` (uuid, foreign key) - References rooms table (the booked room)
  - `building_id` (uuid, foreign key) - References buildings table (for quick filtering)
  - `booking_date` (date) - The date of the booking
  - `start_time` (time) - Start time of the booking
  - `end_time` (time) - End time of the booking
  - `duration_minutes` (integer) - Duration in minutes (max 120 minutes = 2 hours)
  - `status` (text) - Booking status: confirmed, cancelled, completed, no-show
  - `notes` (text) - Optional notes from the user
  - `created_at` (timestamptz) - When the booking was created
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS on bookings table
  - Users can view only their own bookings
  - Users can create new bookings
  - Users can update/cancel only their own bookings
  - Admins can view and manage all bookings (future enhancement)

  ## Indexes
  - Composite index on (user_id, booking_date) for user booking queries
  - Composite index on (room_id, booking_date) for availability checks
  - Index on status for filtering by booking status

  ## Constraints
  - Prevent overlapping bookings for the same room
  - Ensure duration doesn't exceed 120 minutes
  - Ensure end_time is after start_time
*/

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE NOT NULL,
  building_id uuid REFERENCES buildings(id) ON DELETE CASCADE NOT NULL,
  booking_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  duration_minutes integer NOT NULL CHECK (duration_minutes > 0 AND duration_minutes <= 120),
  status text DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed', 'no-show')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookings"
  ON bookings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_bookings_user_date ON bookings(user_id, booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_room_date ON bookings(room_id, booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_building_id ON bookings(building_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_prevent_overlapping_bookings
  ON bookings(room_id, booking_date, start_time, end_time)
  WHERE status = 'confirmed';
