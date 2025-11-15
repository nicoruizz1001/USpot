import { supabase } from '@/lib/supabase';

const uvaBuildings = [
  {
    category: 'Academic',
    subArea: 'Central Grounds / Academical Village',
    building: 'The Rotunda',
    latitude: 38.03553866033144,
    longitude: -78.50352772467265,
    hours: '9 AM - 5 PM',
    rooms: []
  },
  {
    category: 'Academic',
    subArea: 'Central Grounds / Academical Village',
    building: 'The Lawn',
    latitude: 38.03450061864367,
    longitude: -78.50407072849711,
    hours: '24/7',
    rooms: []
  },
  {
    category: 'Academic',
    subArea: 'Central Grounds / Academical Village',
    building: 'Old Cabell Hall',
    latitude: 38.03292692995411,
    longitude: -78.50502000484506,
    hours: '8 AM - 10 PM',
    rooms: []
  },
  {
    category: 'Academic',
    subArea: 'Central Grounds / Academical Village',
    building: 'New Cabell Hall',
    latitude: 38.03256162854506,
    longitude: -78.50523237464387,
    hours: '8 AM - 10 PM',
    rooms: []
  },
  {
    category: 'Academic',
    subArea: 'Engineering & Applied Science',
    building: 'Thornton Hall (A Wing)',
    latitude: 38.03327374135683,
    longitude: -78.50974080923635,
    hours: '8 AM - 10 PM',
    rooms: []
  },
  {
    category: 'Academic',
    subArea: 'Engineering & Applied Science',
    building: 'Thornton Hall (B Wing)',
    latitude: 38.033044961758335,
    longitude: -78.51025495129218,
    hours: '8 AM - 10 PM',
    rooms: []
  },
  {
    category: 'Academic',
    subArea: 'Engineering & Applied Science',
    building: 'Thornton Hall (C Wing)',
    latitude: 38.03279778963328,
    longitude: -78.50951377268181,
    hours: '8 AM - 10 PM',
    rooms: []
  },
  {
    category: 'Academic',
    subArea: 'Engineering & Applied Science',
    building: 'Thornton Hall (D Wing)',
    latitude: 38.032734108225114,
    longitude: -78.51039887839875,
    hours: '8 AM - 10 PM',
    rooms: []
  },
  {
    category: 'Academic',
    subArea: 'Engineering & Applied Science',
    building: 'Thornton Hall (E Wing)',
    latitude: 38.03226954704992,
    longitude: -78.51006001878888,
    hours: '8 AM - 10 PM',
    rooms: []
  },
  {
    category: 'Academic',
    subArea: 'Engineering & Applied Science',
    building: 'Rice Hall',
    latitude: 38.031607791965385,
    longitude: -78.51064557137143,
    hours: '8 AM - 10 PM',
    rooms: [
      { roomName: 'Rice 120 - Auditorium', capacity: 120, floor: '1' },
      { roomName: 'Rice 242 - Computer Lab', capacity: 40, floor: '2' },
      { roomName: 'Rice 340 - Conference Room', capacity: 16, floor: '3' },
      { roomName: 'Rice 415 - Study Room', capacity: 8, floor: '4' }
    ]
  },
  {
    category: 'Academic',
    subArea: 'Engineering & Applied Science',
    building: 'Olsson Hall',
    latitude: 38.03200243623313,
    longitude: -78.51033021960984,
    hours: '24/7',
    rooms: [
      { roomName: 'Olsson 001 - Computer Lab', capacity: 50, floor: 'G' },
      { roomName: 'Olsson 005 - Turing Lab', capacity: 30, floor: 'G' },
      { roomName: 'Olsson 109 - Study Room', capacity: 8, floor: '1' },
      { roomName: 'Olsson 210 - Collaboration Room', capacity: 10, floor: '2' }
    ]
  },
  {
    category: 'Academic',
    subArea: 'Engineering & Applied Science',
    building: 'Mechanical Engineering Building',
    latitude: 38.03258580660301,
    longitude: -78.51106304625662,
    hours: '8 AM - 10 PM',
    rooms: [
      { roomName: 'MEB 104 - Study Room', capacity: 6, floor: '1' },
      { roomName: 'MEB 121 - CAD Lab', capacity: 24, floor: '1' },
      { roomName: 'MEB 205 - Group Room', capacity: 10, floor: '2' },
      { roomName: 'MEB 310 - Collaboration Room', capacity: 12, floor: '3' }
    ]
  },
  {
    category: 'Academic',
    subArea: 'Engineering & Applied Science',
    building: 'Materials Science Building (MSB)',
    latitude: 38.033174148575576,
    longitude: -78.51082330214192,
    hours: '8 AM - 10 PM',
    rooms: [
      { roomName: 'MSB 101 - Study Lounge', capacity: 12, floor: '1' },
      { roomName: 'MSB 120 - Group Room', capacity: 8, floor: '1' },
      { roomName: 'MSB 205 - Collaboration Room', capacity: 10, floor: '2' },
      { roomName: 'MSB 315 - Conference Room', capacity: 16, floor: '3' }
    ]
  },
  {
    category: 'Academic',
    subArea: 'Sciences',
    building: 'Chemistry Building',
    latitude: 38.03370771323216,
    longitude: -78.51173520325852,
    hours: '8 AM - 10 PM',
    rooms: [
      { roomName: 'CHM 140 - Study Room', capacity: 14, floor: '1' },
      { roomName: 'CHM 156 - Help Center', capacity: 20, floor: '1' },
      { roomName: 'CHM 215 - Group Study Room', capacity: 8, floor: '2' },
      { roomName: 'CHM 310 - Quiet Study Room', capacity: 4, floor: '3' }
    ]
  },
  {
    category: 'Academic',
    subArea: 'Sciences',
    building: 'Physics Building',
    latitude: 38.034278896732935,
    longitude: -78.51031958528318,
    hours: '8 AM - 10 PM',
    rooms: [
      { roomName: 'PHY 203 - Help Room', capacity: 20, floor: '2' },
      { roomName: 'PHY 210 - Study Room', capacity: 6, floor: '2' },
      { roomName: 'PHY 245 - Group Room', capacity: 8, floor: '2' },
      { roomName: 'PHY 310 - Collaboration Room', capacity: 10, floor: '3' }
    ]
  },
  {
    category: 'Academic',
    subArea: 'McIntire',
    building: 'Rouss-Robertson Hall (McIntire)',
    latitude: 38.03283344496467,
    longitude: -78.50390501152641,
    hours: '8 AM - 10 PM',
    rooms: [
      { roomName: 'RRH 120 - Lecture Hall', capacity: 80, floor: '1' },
      { roomName: 'RRH 245 - Computer Lab', capacity: 40, floor: '2' },
      { roomName: 'RRH 301 - Career Services Suite', capacity: 12, floor: '3' },
      { roomName: 'RRH 350 - Group Room', capacity: 8, floor: '3' }
    ]
  },
  {
    category: 'Academic',
    subArea: 'McIntire',
    building: 'Cobb Hall',
    latitude: 38.032410309544495,
    longitude: -78.50317052910772,
    hours: '8 AM - 10 PM',
    rooms: [
      { roomName: 'Cobb 110 - Study Room', capacity: 6, floor: '1' },
      { roomName: 'Cobb 145 - Collaboration Room', capacity: 10, floor: '1' },
      { roomName: 'Cobb 201 - Seminar Room', capacity: 20, floor: '2' },
      { roomName: 'Cobb 240 - Team Room', capacity: 8, floor: '2' }
    ]
  },
  {
    category: 'Library',
    subArea: 'Libraries',
    building: 'Shannon Library',
    latitude: 38.036434596346574,
    longitude: -78.50528830938514,
    hours: '24/7',
    rooms: [
      { roomName: '134 - Conference Room', capacity: 14, floor: '1' },
      { roomName: '318 C', capacity: 6, floor: '3' },
      { roomName: '318 D', capacity: 6, floor: '3' },
      { roomName: '318 F', capacity: 6, floor: '3' },
      { roomName: '318 G', capacity: 6, floor: '3' },
      { roomName: '318 H', capacity: 6, floor: '3' },
      { roomName: '318 I', capacity: 6, floor: '3' },
      { roomName: '318 K', capacity: 6, floor: '3' },
      { roomName: '318 L', capacity: 6, floor: '3' }
    ]
  },
  {
    category: 'Library',
    subArea: 'Libraries',
    building: 'Clemons Library',
    latitude: 38.03664591473261,
    longitude: -78.50586021335577,
    hours: '24/7',
    rooms: [
      { roomName: 'Clemons 4th Floor Lobby Table', capacity: 2, floor: '4' },
      { roomName: '112', capacity: 6, floor: '1' },
      { roomName: 'Clemons 220', capacity: 10, floor: '2' },
      { roomName: 'Clemons 221', capacity: 5, floor: '2' },
      { roomName: 'Clemons 222', capacity: 5, floor: '2' },
      { roomName: 'Clemons 224', capacity: 5, floor: '2' },
      { roomName: 'Clemons 226', capacity: 4, floor: '2' },
      { roomName: 'Clemons 227', capacity: 5, floor: '2' },
      { roomName: 'Clemons 230', capacity: 5, floor: '2' },
      { roomName: 'Clemons 234', capacity: 3, floor: '2' },
      { roomName: 'Clemons 237', capacity: 5, floor: '2' },
      { roomName: 'Clemons 238', capacity: 5, floor: '2' },
      { roomName: 'Clemons 241', capacity: 6, floor: '2' },
      { roomName: 'Clemons 245', capacity: 6, floor: '2' },
      { roomName: 'Clemons 202', capacity: 12, floor: '2' },
      { roomName: 'Clemons 203', capacity: 12, floor: '2' },
      { roomName: 'Clemons 204', capacity: 24, floor: '2' }
    ]
  },
  {
    category: 'Library',
    subArea: 'Libraries',
    building: 'Brown Science & Engineering Library',
    latitude: 38.032984064254755,
    longitude: -78.50805504594531,
    hours: '24/7',
    rooms: [
      { roomName: 'Brown 145 - Sensory Room', capacity: 4, floor: '1' },
      { roomName: 'Brown 147', capacity: 6, floor: '1' },
      { roomName: 'Brown 148', capacity: 20, floor: '1' },
      { roomName: 'Brown 155', capacity: 10, floor: '1' },
      { roomName: 'Brown 156', capacity: 14, floor: '1' },
      { roomName: 'Brown G-046', capacity: 6, floor: 'G' },
      { roomName: 'Table A', capacity: 6, floor: 'G' },
      { roomName: 'Table B', capacity: 6, floor: 'G' }
    ]
  },
  {
    category: 'Library',
    subArea: 'Libraries',
    building: 'Music Library (Old Cabell)',
    latitude: 38.03281592876404,
    longitude: -78.50500298585439,
    hours: '8 AM - 10 PM',
    rooms: [
      { roomName: 'ML 110 - Listening Room', capacity: 6, floor: '1' },
      { roomName: 'ML 132 - Quiet Study', capacity: 8, floor: '1' },
      { roomName: 'ML 221 - Piano Practice Room', capacity: 2, floor: '2' },
      { roomName: 'ML 260 - Collaboration Room', capacity: 10, floor: '2' }
    ]
  },
  {
    category: 'Student Life',
    subArea: 'Student Centers',
    building: 'Newcomb Hall',
    latitude: 38.03600739797473,
    longitude: -78.50666398463837,
    hours: '7 AM - 12 AM',
    rooms: [
      { roomName: 'Newcomb 170 - Gallery', capacity: 50, floor: '1' },
      { roomName: 'Newcomb 180 - Ballroom', capacity: 200, floor: '1' },
      { roomName: 'Newcomb 298 - Student Org Room', capacity: 12, floor: '2' },
      { roomName: 'Newcomb 310 - Study Room', capacity: 8, floor: '3' }
    ]
  },
  {
    category: 'Student Life',
    subArea: 'Student Centers',
    building: "O'Hill Dining Hall",
    latitude: 38.03482181020502,
    longitude: -78.51539269822621,
    hours: '7 AM - 8 PM',
    rooms: []
  },
  {
    category: 'Student Life',
    subArea: 'Student Centers',
    building: 'Runk Dining Hall',
    latitude: 38.02898896917399,
    longitude: -78.51866586526464,
    hours: '7 AM - 8 PM',
    rooms: []
  },
  {
    category: 'Recreation',
    subArea: 'Athletics',
    building: 'John Paul Jones Arena',
    latitude: 38.04581716444111,
    longitude: -78.50684417957821,
    hours: '6 AM - 10 PM',
    rooms: []
  },
  {
    category: 'Recreation',
    subArea: 'Athletics',
    building: 'Scott Stadium',
    latitude: 38.03087141406391,
    longitude: -78.51361124959018,
    hours: 'Varies',
    rooms: []
  }
];

export async function seedBuildings() {
  console.log('Starting to seed buildings...');

  for (const buildingData of uvaBuildings) {
    const { data: building, error: buildingError } = await supabase
      .from('buildings')
      .insert({
        name: buildingData.building,
        category: buildingData.category,
        sub_area: buildingData.subArea,
        latitude: buildingData.latitude,
        longitude: buildingData.longitude,
        hours: buildingData.hours
      })
      .select()
      .single();

    if (buildingError) {
      console.error(`Error inserting building ${buildingData.building}:`, buildingError);
      continue;
    }

    console.log(`Inserted building: ${buildingData.building}`);

    if (buildingData.rooms && buildingData.rooms.length > 0) {
      const roomsToInsert = buildingData.rooms.map(room => ({
        building_id: building.id,
        room_name: room.roomName,
        capacity: room.capacity,
        floor: room.floor,
        available: true
      }));

      const { error: roomsError } = await supabase
        .from('rooms')
        .insert(roomsToInsert);

      if (roomsError) {
        console.error(`Error inserting rooms for ${buildingData.building}:`, roomsError);
      } else {
        console.log(`Inserted ${buildingData.rooms.length} rooms for ${buildingData.building}`);
      }
    }
  }

  console.log('Seeding complete!');
}
