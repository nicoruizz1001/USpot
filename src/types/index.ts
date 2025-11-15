export type ViewMode = 'lock-in' | 'events';

export type AvailabilityStatus = 'available' | 'limited' | 'full';

export interface Building {
  id: string;
  name: string;
  coordinates: [number, number];
  totalRooms: number;
  availableRooms: number;
  hours: string;
  status: AvailabilityStatus;
  floors: Floor[];
  category?: string;
  subArea?: string;
  rooms?: BuildingRoom[];
}

export interface Floor {
  number: number;
  rooms: Room[];
}

export interface Room {
  id: string;
  number: string;
  capacity: number;
  type: string;
  status: 'available' | 'in-use' | 'reserved-soon';
  features: string[];
  nextAvailable?: string;
}

export interface BuildingRoom {
  roomName: string;
  capacity: number;
  floor: string;
  available?: boolean;
}

export interface DBBuilding {
  id: string;
  name: string;
  category: string;
  sub_area: string;
  latitude: number;
  longitude: number;
  hours: string;
  created_at: string;
  updated_at: string;
}

export interface DBRoom {
  id: string;
  building_id: string;
  room_name: string;
  capacity: number;
  floor: string;
  available: boolean;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  building: string;
  room: string;
  coordinates: [number, number];
  time: string;
  date: string;
  category: string;
  description: string;
  organization: Organization;
  image?: string;
  distance?: number;
}

export interface Organization {
  name: string;
  description: string;
  logo?: string;
  links: {
    instagram?: string;
    website?: string;
    doorlist?: string;
  };
}

export type BookingStatus = 'confirmed' | 'cancelled' | 'completed' | 'no-show';

export interface Booking {
  id: string;
  user_id: string;
  room_id: string;
  building_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  status: BookingStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
  room?: DBRoom;
  building?: DBBuilding;
}

export interface CreateBookingInput {
  room_id: string;
  building_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  notes?: string;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface RoomWithAvailability extends DBRoom {
  timeSlots?: TimeSlot[];
  isFullyBooked?: boolean;
}
