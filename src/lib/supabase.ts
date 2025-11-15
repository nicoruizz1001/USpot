import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  latitude?: number;
  longitude?: number;
  location_enabled?: boolean;
  location_permission_asked?: boolean;
  last_location_update?: string;
  created_at: string;
  updated_at: string;
};

export type Building = {
  id: string;
  name: string;
  category: string;
  sub_area: string;
  latitude: number;
  longitude: number;
  hours: string;
  created_at: string;
  updated_at: string;
};

export type Room = {
  id: string;
  building_id: string;
  room_name: string;
  capacity: number;
  floor: string;
  available: boolean;
  created_at: string;
  updated_at: string;
};
