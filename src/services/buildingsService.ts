import { supabase } from '@/lib/supabase';
import { Building, DBBuilding, DBRoom, BuildingRoom } from '@/types';

export async function fetchBuildings(): Promise<Building[]> {
  const { data: buildingsData, error: buildingsError } = await supabase
    .from('buildings')
    .select('*')
    .order('name');

  if (buildingsError) {
    console.error('Error fetching buildings:', buildingsError);
    return [];
  }

  const { data: roomsData, error: roomsError } = await supabase
    .from('rooms')
    .select('*');

  if (roomsError) {
    console.error('Error fetching rooms:', roomsError);
  }

  const buildings: Building[] = (buildingsData as DBBuilding[]).map(dbBuilding => {
    const buildingRooms = (roomsData as DBRoom[])?.filter(
      room => room.building_id === dbBuilding.id
    ) || [];

    const rooms: BuildingRoom[] = buildingRooms.map(room => ({
      roomName: room.room_name,
      capacity: room.capacity,
      floor: room.floor,
      available: room.available
    }));

    const availableRooms = rooms.filter(r => r.available).length;
    const totalRooms = rooms.length;

    let status: 'available' | 'limited' | 'full' = 'available';
    if (totalRooms === 0) {
      status = 'available';
    } else if (availableRooms === 0) {
      status = 'full';
    } else if (availableRooms < totalRooms * 0.5) {
      status = 'limited';
    }

    const floorMap = new Map<string, BuildingRoom[]>();
    rooms.forEach(room => {
      const floor = room.floor;
      if (!floorMap.has(floor)) {
        floorMap.set(floor, []);
      }
      floorMap.get(floor)!.push(room);
    });

    const floors = Array.from(floorMap.entries()).map(([floorNumber, floorRooms]) => ({
      number: parseFloat(floorNumber) || 0,
      rooms: floorRooms.map((room, idx) => ({
        id: `${dbBuilding.id}-${room.roomName}-${idx}`,
        number: room.roomName,
        capacity: room.capacity,
        type: 'Study Room',
        status: (room.available ? 'available' : 'in-use') as 'available' | 'in-use' | 'reserved-soon',
        features: []
      }))
    }));

    return {
      id: dbBuilding.id,
      name: dbBuilding.name,
      coordinates: [dbBuilding.longitude, dbBuilding.latitude],
      totalRooms,
      availableRooms,
      hours: dbBuilding.hours,
      status,
      floors,
      category: dbBuilding.category,
      subArea: dbBuilding.sub_area,
      rooms
    };
  });

  return buildings;
}

export async function fetchBuildingById(id: string): Promise<Building | null> {
  const buildings = await fetchBuildings();
  return buildings.find(b => b.id === id) || null;
}

export async function fetchBuildingsByCategory(category: string): Promise<Building[]> {
  const buildings = await fetchBuildings();
  return buildings.filter(b => b.category === category);
}

export async function fetchBuildingsBySubArea(subArea: string): Promise<Building[]> {
  const buildings = await fetchBuildings();
  return buildings.filter(b => b.subArea === subArea);
}
