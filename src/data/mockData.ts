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
    title: 'CS Department Mixer',
    building: 'Rice Hall',
    room: 'Auditorium',
    coordinates: [-78.5085, 38.0315],
    time: '6:00 PM',
    date: 'Today',
    category: 'Social',
    description: 'Join us for networking and mingling with CS faculty and students.',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop',
    organization: {
      name: 'CS Club',
      description: 'University Computer Science student organization',
      logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=csclub&backgroundColor=3b82f6',
      links: {
        instagram: 'https://instagram.com/uva_cs',
        website: 'https://csclub.virginia.edu'
      }
    }
  },
  {
    id: 'evt2',
    title: 'Live Jazz Night',
    building: 'Newcomb Hall',
    room: 'Theater',
    coordinates: [-78.5032, 38.0356],
    time: '8:00 PM',
    date: 'Tonight',
    category: 'Entertainment',
    description: 'Enjoy an evening of live jazz performances by student musicians.',
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&h=600&fit=crop',
    organization: {
      name: 'Student Activities',
      description: 'Creating memorable experiences for the UVA community',
      logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=studentactivities&backgroundColor=ec4899',
      links: {
        instagram: 'https://instagram.com/uva_activities'
      }
    }
  },
  {
    id: 'evt3',
    title: 'Basketball Watch Party',
    building: 'Memorial Gym',
    room: 'Main Hall',
    coordinates: [-78.5055, 38.0366],
    time: '7:00 PM',
    date: 'Today',
    category: 'Sports',
    description: 'Watch the big game with fellow students. Food and drinks provided!',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=600&fit=crop',
    organization: {
      name: 'Student Union',
      description: 'Bringing the student community together',
      logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=studentunion&backgroundColor=10b981',
      links: {}
    }
  },
  {
    id: 'evt4',
    title: 'Study Break: Free Coffee',
    building: 'Alderman Library',
    room: 'Main Lobby',
    coordinates: [-78.5034, 38.0366],
    time: '2:00 PM',
    date: 'Today',
    category: 'Academic',
    description: 'Take a break from studying with free coffee and snacks.',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop',
    organization: {
      name: 'Library Services',
      description: 'Supporting student success',
      logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=library&backgroundColor=8b5cf6',
      links: {
        website: 'https://library.virginia.edu'
      }
    }
  },
  {
    id: 'evt5',
    title: 'Poetry Slam',
    building: 'Newcomb Hall',
    room: 'Small Theater',
    coordinates: [-78.5032, 38.0356],
    time: '5:00 PM',
    date: 'Today',
    category: 'Arts',
    description: 'Share your poetry or enjoy performances from talented student poets.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
    organization: {
      name: 'Creative Writing Club',
      description: 'Fostering literary arts on campus',
      logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=poetry&backgroundColor=f97316',
      links: {
        instagram: 'https://instagram.com/uva_poetry'
      }
    }
  }
];
