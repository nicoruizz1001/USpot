#!/usr/bin/env node

/**
 * Populate USpot database with mock UVA-style events
 * Creates realistic events across various categories and locations
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function loadEnv() {
  const envPath = join(__dirname, '.env');
  const env = {};

  try {
    const envContent = readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...values] = trimmedLine.split('=');
        if (key && values.length) {
          env[key.trim()] = values.join('=').trim().replace(/^["']|["']$/g, '');
        }
      }
    });
    return env;
  } catch (error) {
    console.error(`❌ Error reading .env file: ${error.message}`);
    return null;
  }
}

const mockEvents = [
  {
    title: "Axiom Thanksgiving Sunday",
    description: "Join us for Thanksgiving Sunday! Enjoy live music, a short talk on gratitude, and a delicious Thanksgiving feast. Everyone's welcome—come for the food, stay for the community.",
    category: "Free Food",
    organization_name: "Axiom @ UVA",
    organization_description: "Join us for Thanksgiving Sunday! Enjoy live music, a short talk on gratitude, and a delicious Thanksgiving feast",
    preferred_building: "Newcomb Hall",
    date_offset: 2,
    time: "12:00:00"
  },
  {
    title: "UVA A Cappella Showcase",
    description: "Experience the best of UVA's a cappella groups in one amazing night! Featuring the Hullabahoos, Sil'hooettes, Virginia Gentlemen, and more.",
    category: "Arts",
    organization_name: "A Cappella Council @ UVA",
    organization_description: "Experience the best of UVA's a cappella groups in one amazing night",
    preferred_building: "Old Cabell Hall",
    date_offset: 5,
    time: "20:00:00"
  },
  {
    title: "Bodo's Bagel Study Break",
    description: "Free Bodo's bagels and coffee for all students during finals week! Sponsored by Student Council. Come fuel up for your exams.",
    category: "Free Food",
    organization_name: "Student Council @ UVA",
    organization_description: "Free Bodo's bagels and coffee for all students during finals week",
    preferred_building: "Newcomb Hall",
    date_offset: 7,
    time: "10:00:00"
  },
  {
    title: "Thanksgiving 5K Turkey Trot",
    description: "Annual Turkey Trot 5K run around Grounds! All proceeds go to the Blue Ridge Area Food Bank. Registration includes a free t-shirt.",
    category: "Sports",
    organization_name: "Recreation & Wellbeing",
    organization_description: "Annual Turkey Trot 5K run around Grounds",
    preferred_building: "Scott Stadium",
    date_offset: 1,
    time: "09:00:00"
  },
  {
    title: "International Coffee Hour",
    description: "Meet students from around the world and enjoy free international snacks and beverages. Great opportunity to practice languages and make new friends!",
    category: "Club Events",
    organization_name: "International Student Union @ UVA",
    organization_description: "Meet students from around the world and enjoy free international snacks and beverages",
    preferred_building: "Newcomb Hall",
    date_offset: 3,
    time: "16:00:00"
  },
  {
    title: "CS Department Pizza Social",
    description: "Free pizza and networking with CS faculty and industry professionals. Learn about research opportunities and internships. All CS students welcome!",
    category: "Free Food",
    organization_name: "CS Department",
    organization_description: "Free pizza and networking with CS faculty and industry professionals",
    preferred_building: "Rice Hall",
    date_offset: 4,
    time: "18:00:00"
  },
  {
    title: "Madison House Community Service Fair",
    description: "Discover volunteer opportunities with over 20 local nonprofits. Make a difference in the Charlottesville community. Pizza and refreshments provided.",
    category: "Campus Events",
    organization_name: "Madison House",
    organization_description: "Discover volunteer opportunities with over 20 local nonprofits",
    preferred_building: "Newcomb Hall",
    date_offset: 6,
    time: "17:00:00"
  },
  {
    title: "UVA Symphony Orchestra Fall Concert",
    description: "Join us for an evening of classical music featuring works by Beethoven, Tchaikovsky, and Dvořák. Free admission for UVA students with ID.",
    category: "Arts",
    organization_name: "UVA Symphony Orchestra",
    organization_description: "An evening of classical music featuring works by Beethoven, Tchaikovsky, and Dvořák",
    preferred_building: "Old Cabell Hall",
    date_offset: 8,
    time: "19:30:00"
  },
  {
    title: "Late Night Trivia at Clemons",
    description: "Test your knowledge at our late-night trivia competition! Free snacks, prizes for winners, and study break fun. Teams of 4-6 welcome.",
    category: "Entertainment",
    organization_name: "UVA Libraries",
    organization_description: "Test your knowledge at our late-night trivia competition",
    preferred_building: "Clemons Library",
    date_offset: 2,
    time: "22:00:00"
  },
  {
    title: "McIntire Career Fair",
    description: "Connect with top employers recruiting for internships and full-time positions. Business casual attire required. Bring plenty of resumes!",
    category: "Campus Events",
    organization_name: "McIntire School of Commerce",
    organization_description: "Connect with top employers recruiting for internships and full-time positions",
    preferred_building: "Rouss-Robertson Hall (McIntire)",
    date_offset: 10,
    time: "14:00:00"
  },
  {
    title: "Engineering Design Expo",
    description: "See amazing student engineering projects from all disciplines. Fourth-year capstone presentations, innovative designs, and hands-on demos.",
    category: "Campus Events",
    organization_name: "School of Engineering",
    organization_description: "See amazing student engineering projects from all disciplines",
    preferred_building: "Thornton Hall (A Wing)",
    date_offset: 12,
    time: "13:00:00"
  },
  {
    title: "Women in Tech Networking Event",
    description: "Networking event for women in technology fields. Meet industry professionals, learn about career paths, and connect with peers. Dinner provided.",
    category: "Club Events",
    organization_name: "Women in Tech @ UVA",
    organization_description: "Networking event for women in technology fields",
    preferred_building: "Rice Hall",
    date_offset: 9,
    time: "18:30:00"
  },
  {
    title: "Lawn Snowball Fight",
    description: "Traditional first snow celebration on the Lawn! Join hundreds of students for an epic snowball battle. Hot chocolate provided afterward.",
    category: "Entertainment",
    organization_name: "UVA Traditions",
    organization_description: "Traditional first snow celebration on the Lawn",
    preferred_building: "The Lawn",
    date_offset: 15,
    time: "16:00:00"
  },
  {
    title: "Hack.UVA Hackathon",
    description: "24-hour coding competition! Build amazing projects, win prizes, attend workshops, and network with sponsors. All skill levels welcome. Free food all day!",
    category: "Campus Events",
    organization_name: "Hack.UVA",
    organization_description: "24-hour coding competition",
    preferred_building: "Olsson Hall",
    date_offset: 14,
    time: "09:00:00"
  },
  {
    title: "Sustainable Living Workshop",
    description: "Learn practical tips for reducing your environmental impact. Topics include composting, sustainable fashion, and zero-waste living. Free reusable bags for attendees!",
    category: "Campus Events",
    organization_name: "Green UVA",
    organization_description: "Learn practical tips for reducing your environmental impact",
    preferred_building: "Brown Science & Engineering Library",
    date_offset: 11,
    time: "17:30:00"
  },
  {
    title: "Open Mic Night at Newcomb",
    description: "Share your talents! Poetry, music, comedy, or anything creative. Supportive atmosphere for all performers. Sign up starts at 7 PM.",
    category: "Arts",
    organization_name: "Student Activities",
    organization_description: "Share your talents through poetry, music, comedy, or any creative performance",
    preferred_building: "Newcomb Hall",
    date_offset: 13,
    time: "19:00:00"
  },
  {
    title: "Physics Help Session",
    description: "Free tutoring for Physics 1425 and 1429. Bring your homework questions! Snacks and study materials provided.",
    category: "Campus Events",
    organization_name: "Physics Learning Center",
    organization_description: "Free tutoring for Physics courses",
    preferred_building: "Physics Building",
    date_offset: 3,
    time: "19:00:00"
  },
  {
    title: "Diwali Festival Celebration",
    description: "Celebrate the Festival of Lights with traditional Indian food, music, dance performances, and henna art. Everyone welcome to join the festivities!",
    category: "Arts",
    organization_name: "South Asian Student Association",
    organization_description: "Celebrate the Festival of Lights with traditional Indian food, music, and dance",
    preferred_building: "Newcomb Hall",
    date_offset: 16,
    time: "18:00:00"
  },
  {
    title: "Women's Basketball vs Duke",
    description: "Cheer on the Cavaliers as they take on Duke! Student tickets are free with student ID. Come early for the best seats!",
    category: "Sports",
    organization_name: "UVA Athletics",
    organization_description: "Cheer on the Cavaliers as they take on Duke",
    preferred_building: "John Paul Jones Arena",
    date_offset: 20,
    time: "19:00:00"
  },
  {
    title: "Mental Health Awareness Workshop",
    description: "Learn about mental health resources at UVA, stress management techniques, and how to support friends in crisis. Facilitated by CAPS counselors.",
    category: "Campus Events",
    organization_name: "CAPS (Counseling and Psychological Services)",
    organization_description: "Learn about mental health resources and stress management techniques",
    preferred_building: "Newcomb Hall",
    date_offset: 5,
    time: "17:00:00"
  }
];

async function populateEvents() {
  console.log("🚀 Starting Mock Events Database Population\n");

  const env = loadEnv();
  if (!env) return;

  const supabaseUrl = env.VITE_SUPABASE_URL;
  const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Error: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not found in .env");
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  console.log("✅ Connected to Supabase");

  console.log("📥 Fetching buildings from database...");
  const { data: buildings, error: buildingsError } = await supabase
    .from('buildings')
    .select('*');

  if (buildingsError) {
    console.error(`❌ Error fetching buildings: ${buildingsError.message}`);
    return;
  }

  console.log(`✅ Found ${buildings.length} buildings in database`);

  console.log("\n📥 Fetching rooms from database...");
  const { data: rooms, error: roomsError } = await supabase
    .from('rooms')
    .select('*');

  const roomsByBuilding = {};
  if (rooms) {
    for (const room of rooms) {
      if (!roomsByBuilding[room.building_id]) {
        roomsByBuilding[room.building_id] = [];
      }
      roomsByBuilding[room.building_id].push(room);
    }
    console.log(`✅ Found ${rooms.length} rooms across buildings`);
  }

  const buildingMap = {};
  for (const building of buildings) {
    buildingMap[building.name] = building;
  }

  console.log("\n🔄 Creating events...");

  const today = new Date();
  const eventsToInsert = [];

  for (const mockEvent of mockEvents) {
    const eventDate = new Date(today);
    eventDate.setDate(today.getDate() + mockEvent.date_offset);

    const building = buildingMap[mockEvent.preferred_building] || buildings[Math.floor(Math.random() * buildings.length)];

    const buildingRooms = roomsByBuilding[building.id] || [];
    let roomName;
    if (buildingRooms.length > 0) {
      const room = buildingRooms[Math.floor(Math.random() * buildingRooms.length)];
      roomName = room.room_name;
    } else {
      roomName = `Room ${Math.floor(Math.random() * 300) + 100}`;
    }

    const eventData = {
      title: mockEvent.title,
      description: mockEvent.description,
      location_name: building.name,
      room: roomName,
      latitude: parseFloat(building.latitude),
      longitude: parseFloat(building.longitude),
      event_date: eventDate.toISOString().split('T')[0],
      event_time: mockEvent.time,
      category: mockEvent.category,
      organization_name: mockEvent.organization_name,
      organization_description: mockEvent.organization_description,
      instagram_link: null,
      website_link: null,
      doorlist_link: null,
      custom_links: [],
      created_by: '00000000-0000-0000-0000-000000000000'
    };

    eventsToInsert.push(eventData);
  }

  console.log(`💾 Inserting ${eventsToInsert.length} events into database...`);

  let insertedCount = 0;
  let errorCount = 0;

  for (const eventData of eventsToInsert) {
    const { error } = await supabase
      .from('events')
      .insert(eventData);

    if (error) {
      errorCount++;
      if (errorCount <= 3) {
        console.log(`   ⚠️  Error: ${error.message.substring(0, 80)}`);
      }
    } else {
      insertedCount++;
      console.log(`   ✅ ${eventData.title}`);
    }
  }

  console.log(`\n✨ Database population complete!`);
  console.log(`📊 Final Summary:`);
  console.log(`   Events inserted: ${insertedCount}`);
  console.log(`   Errors: ${errorCount}`);

  if (insertedCount > 0) {
    console.log(`\n🎉 Success! ${insertedCount} events are now available in USpot!`);
  }
}

populateEvents()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
