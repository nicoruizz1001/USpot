# UVA Buildings & Rooms Setup

This document explains the new real data integration for the Lock-In feature with actual UVA building and room information.

## Overview

The Lock-In feature now uses real UVA campus building data stored in Supabase, replacing the previous mock data. The system includes 27 buildings across 4 categories with detailed room information.

## Database Schema

### Buildings Table
- **id**: UUID primary key
- **name**: Building name (e.g., "Shannon Library")
- **category**: Building category (Library, Academic, Student Life, Recreation)
- **sub_area**: Campus sub-area (e.g., "Libraries", "Engineering & Applied Science")
- **latitude**: Geographic latitude for map display
- **longitude**: Geographic longitude for map display
- **hours**: Operating hours (e.g., "24/7", "8 AM - 10 PM")
- **created_at**: Record creation timestamp
- **updated_at**: Last update timestamp

### Rooms Table
- **id**: UUID primary key
- **building_id**: Foreign key to buildings table
- **room_name**: Room identifier (e.g., "318 C", "Rice 120 - Auditorium")
- **capacity**: Maximum occupancy
- **floor**: Floor location (e.g., "1", "G", "3")
- **available**: Current availability status (boolean)
- **created_at**: Record creation timestamp
- **updated_at**: Last update timestamp

## Building Categories

### Library (4 buildings)
- Shannon Library - 24/7
- Clemons Library - 24/7
- Brown Science & Engineering Library - 24/7
- Music Library (Old Cabell) - 8 AM - 10 PM

### Academic (18 buildings)
**Central Grounds / Academical Village:**
- The Rotunda
- The Lawn
- Old Cabell Hall
- New Cabell Hall

**Engineering & Applied Science:**
- Thornton Hall (A, B, C, D, E Wings)
- Rice Hall
- Olsson Hall
- Mechanical Engineering Building
- Materials Science Building

**Sciences:**
- Chemistry Building
- Physics Building

**McIntire:**
- Rouss-Robertson Hall
- Cobb Hall

### Student Life (3 buildings)
- Newcomb Hall
- O'Hill Dining Hall
- Runk Dining Hall

### Recreation (2 buildings)
- John Paul Jones Arena
- Scott Stadium

## Seeding the Database

### Option 1: Using the Web Interface
1. Log in to the application
2. Navigate to `/seed-data`
3. Click "Seed Database" button
4. Wait for confirmation message
5. Navigate to Lock-In section to view buildings

### Option 2: Using the Console
```typescript
import { seedBuildings } from '@/data/seedBuildings';
await seedBuildings();
```

## Features

### Filtering
Users can filter buildings by:
- **Category**: Library, Academic, Student Life, Recreation
- **Sub-Area**: Libraries, Engineering & Applied Science, Sciences, McIntire, Student Centers, Athletics, Central Grounds
- **Search**: Text search by building name

### Map Display
- Real UVA coordinates for accurate positioning
- Color-coded pins by availability status:
  - Green: Available rooms
  - Yellow: Limited availability
  - Red: Full
- Interactive markers with building information

### Room Information
- Room name and capacity
- Floor location
- Availability status
- Study room features (for buildings with detailed data)

## File Structure

```
src/
├── data/
│   ├── seedBuildings.ts        # Seed script with real UVA data
│   └── mockData.ts             # Legacy mock data (can be removed)
├── services/
│   └── buildingsService.ts     # Database queries and data transformation
├── types/
│   └── index.ts                # TypeScript interfaces
├── pages/
│   ├── LockIn.tsx              # Main Lock-In page with filters
│   ├── LockInMap.tsx           # Map view
│   ├── LockInList.tsx          # List view
│   └── SeedData.tsx            # Database seeding utility
└── lib/
    └── supabase.ts             # Supabase client and types

supabase/
└── migrations/
    └── 20251115220000_create_buildings_and_rooms.sql
```

## Security

Row Level Security (RLS) is enabled on both tables:
- **Read**: All authenticated users can view buildings and rooms
- **Write**: Currently restricted (will be managed through admin interface)

## Future Enhancements

1. **Real-time Availability**: Implement live room availability tracking
2. **Room Reservations**: Allow users to reserve study rooms
3. **Admin Interface**: Create admin panel for managing buildings and rooms
4. **Room Features**: Add detailed amenities (whiteboards, projectors, etc.)
5. **Capacity Indicators**: Show current occupancy vs. maximum capacity
6. **Opening Hours**: Add detailed daily schedules for each building
7. **Photos**: Add building and room photos
8. **Favorites**: Let users bookmark favorite study spaces

## Maintenance

### Updating Building Data
To update building information, use Supabase dashboard or create migration files:

```sql
UPDATE buildings
SET hours = '24/7'
WHERE name = 'Olsson Hall';
```

### Adding New Buildings
New buildings can be added through:
1. The seeding script (`seedBuildings.ts`)
2. Direct database insertion
3. Future admin interface

## Notes

- All coordinates are in decimal degrees format (latitude, longitude)
- Hours are stored as text strings for flexibility
- Room availability defaults to `true` when seeded
- Buildings without room data show "No rooms listed"
