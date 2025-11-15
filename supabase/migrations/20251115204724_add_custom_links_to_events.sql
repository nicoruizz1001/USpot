/*
  # Add Custom Links and Image Upload to Events

  1. Changes
    - Add `custom_links` (jsonb) column to store array of custom links with name and URL
    - Column will store data in format: [{"name": "Link Name", "url": "https://example.com"}]
    - Existing `instagram_link`, `website_link`, and `doorlist_link` columns remain for backward compatibility
    - `image_url` column already exists for event images

  2. Notes
    - Using JSONB for flexible link storage
    - Each link object contains: name (text) and url (text)
    - No schema changes to RLS policies needed
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'custom_links'
  ) THEN
    ALTER TABLE events ADD COLUMN custom_links jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;