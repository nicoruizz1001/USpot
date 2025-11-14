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
