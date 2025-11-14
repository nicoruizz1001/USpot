import { Building, Event } from '@/types';

export const mockBuildings: Building[] = [
  {
    id: 'alderman',
    name: 'Alderman Library',
    coordinates: [-78.5055, 38.0366],
    totalRooms: 18,
    availableRooms: 12,
    hours: '24/7',
    status: 'available',
    floors: [
      {
        number: 1,
        rooms: [
          { id: 'a101', number: '101', capacity: 4, type: 'Study Room', status: 'available', features: ['Whiteboard', 'Power Outlets'] },
          { id: 'a102', number: '102', capacity: 6, type: 'Study Room', status: 'in-use', features: ['TV Display', 'Whiteboard'] },
          { id: 'a103', number: '103', capacity: 8, type: 'Conference', status: 'available', features: ['Video Conferencing', 'Whiteboard'] },
        ]
      },
      {
        number: 2,
        rooms: [
          { id: 'a201', number: '201', capacity: 4, type: 'Study Room', status: 'available', features: ['Whiteboard'] },
          { id: 'a202', number: '202', capacity: 10, type: 'Seminar', status: 'reserved-soon', features: ['Projector', 'Whiteboard'], nextAvailable: '3:00 PM' },
          { id: 'a203', number: '203', capacity: 6, type: 'Study Room', status: 'available', features: ['Standing Desk', 'Whiteboard'] },
        ]
      },
      {
        number: 3,
        rooms: [
          { id: 'a301', number: '301', capacity: 20, type: 'Classroom', status: 'in-use', features: ['Projector', 'Sound System'] },
          { id: 'a302', number: '302', capacity: 4, type: 'Study Room', status: 'available', features: ['Quiet Space'] },
        ]
      }
    ]
  },
  {
    id: 'newcomb',
    name: 'Newcomb Hall',
    coordinates: [-78.5032, 38.0356],
    totalRooms: 12,
    availableRooms: 4,
    hours: '7 AM - 12 AM',
    status: 'limited',
    floors: [
      {
        number: 1,
        rooms: [
          { id: 'n101', number: '101', capacity: 8, type: 'Meeting Room', status: 'in-use', features: ['AV Equipment'] },
          { id: 'n102', number: '102', capacity: 6, type: 'Study Room', status: 'available', features: ['Whiteboard'] },
        ]
      },
      {
        number: 2,
        rooms: [
          { id: 'n201', number: '201', capacity: 15, type: 'Event Space', status: 'reserved-soon', features: ['Kitchen', 'Tables'], nextAvailable: '6:00 PM' },
          { id: 'n202', number: '202', capacity: 4, type: 'Study Room', status: 'available', features: ['Quiet Space'] },
        ]
      }
    ]
  },
  {
    id: 'rice',
    name: 'Rice Hall',
    coordinates: [-78.5085, 38.0315],
    totalRooms: 8,
    availableRooms: 0,
    hours: '8 AM - 10 PM',
    status: 'full',
    floors: [
      {
        number: 1,
        rooms: [
          { id: 'r101', number: '101', capacity: 30, type: 'Lecture Hall', status: 'in-use', features: ['Projector', 'Sound System'] },
          { id: 'r102', number: '102', capacity: 4, type: 'Study Room', status: 'in-use', features: ['Computers'] },
        ]
      },
      {
        number: 2,
        rooms: [
          { id: 'r201', number: '201', capacity: 25, type: 'Lab', status: 'in-use', features: ['Lab Equipment', 'Computers'] },
        ]
      }
    ]
  },
  {
    id: 'rotunda',
    name: 'The Rotunda',
    coordinates: [-78.5034, 38.0366],
    totalRooms: 6,
    availableRooms: 5,
    hours: '9 AM - 5 PM',
    status: 'available',
    floors: [
      {
        number: 1,
        rooms: [
          { id: 'rot101', number: 'Dome Room', capacity: 50, type: 'Event Space', status: 'available', features: ['Historic', 'Iconic Views'] },
        ]
      },
      {
        number: 2,
        rooms: [
          { id: 'rot201', number: '201', capacity: 12, type: 'Classroom', status: 'available', features: ['Oval Tables'] },
        ]
      }
    ]
  }
];

export const mockEvents: Event[] = [
  {
    id: 'evt1',
    title: 'Tech Talk: AI in Healthcare',
    building: 'Rice Hall',
    room: 'Auditorium',
    coordinates: [-78.5085, 38.0315],
    time: '6:00 PM',
    date: 'Today',
    category: 'Tech',
    description: 'Join us for an exciting discussion on artificial intelligence applications in modern healthcare.',
    organization: {
      name: 'CS Club',
      description: 'University Computer Science student organization',
      links: {
        instagram: 'https://instagram.com/uva_cs',
        website: 'https://csclub.virginia.edu'
      }
    }
  },
  {
    id: 'evt2',
    title: 'Open Mic Night',
    building: 'Newcomb Hall',
    room: 'Theater',
    coordinates: [-78.5032, 38.0356],
    time: '8:00 PM',
    date: 'Tonight',
    category: 'Entertainment',
    description: 'Showcase your talent! Poetry, music, comedy - all welcome.',
    organization: {
      name: 'Student Activities',
      description: 'Creating memorable experiences for the UVA community',
      links: {
        instagram: 'https://instagram.com/uva_activities'
      }
    }
  },
  {
    id: 'evt3',
    title: 'Study Session: Calc III',
    building: 'Alderman Library',
    room: '301',
    coordinates: [-78.5055, 38.0366],
    time: '4:00 PM',
    date: 'Today',
    category: 'Academic',
    description: 'Group study session for Calc III midterm prep. All levels welcome!',
    organization: {
      name: 'Math Study Group',
      description: 'Peer-led math tutoring and study sessions',
      links: {}
    }
  },
  {
    id: 'evt4',
    title: 'Sustainability Fair',
    building: 'The Rotunda',
    room: 'Lawn',
    coordinates: [-78.5034, 38.0366],
    time: '12:00 PM',
    date: 'Tomorrow',
    category: 'Community',
    description: 'Learn about campus sustainability initiatives and how to get involved.',
    organization: {
      name: 'Green Initiative',
      description: 'Leading sustainability efforts on Grounds',
      links: {
        website: 'https://sustainability.virginia.edu',
        instagram: 'https://instagram.com/uva_green'
      }
    }
  }
];
