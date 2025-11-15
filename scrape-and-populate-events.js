#!/usr/bin/env node

/**
 * UVA Connections Events Scraper and Database Populator for USpot
 * Scrapes events from the UVA Connections newsletter and populates the USpot database
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const URL = "https://studentaffairs.virginia.edu/connections#1a";

const MONTH_MAP = {
  "Jan": 1, "Jan.": 1,
  "Feb": 2, "Feb.": 2,
  "Mar": 3, "Mar.": 3,
  "Apr": 4, "Apr.": 4,
  "May": 5,
  "Jun": 6, "Jun.": 6,
  "Jul": 7, "Jul.": 7,
  "Aug": 8, "Aug.": 8,
  "Sept": 9, "Sept.": 9, "Sep.": 9,
  "Oct": 10, "Oct.": 10,
  "Nov": 11, "Nov.": 11,
  "Dec": 12, "Dec.": 12,
};

const DATE_LINE_REGEX = /^(Jan\.?|Feb\.?|Mar\.?|Apr\.?|May|Jun\.?|Jul\.?|Aug\.?|Sept\.?|Sep\.?|Oct\.?|Nov\.?|Dec\.?)\s+\d{1,2}/;

const SECTION_TITLES = new Set(["ENGAGE", "LEARN", "BE WELL", "ARTS", "TALKS"]);

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

function parseDateTimeLocation(line, defaultYear = new Date().getFullYear()) {
  const parts = line.split(',').map(p => p.trim());

  if (parts.length === 0) return [null, null, null];

  let datePart = parts[0].split('–')[0].trim();
  let dateStr = null;

  try {
    const tokens = datePart.split(/\s+/);
    const monthStr = tokens[0];
    const dayStr = tokens[1].replace(/\D/g, '');

    const month = MONTH_MAP[monthStr];
    const day = parseInt(dayStr);

    if (month && day) {
      const date = new Date(defaultYear, month - 1, day);
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      const yyyy = date.getFullYear();
      dateStr = `${mm}/${dd}/${yyyy}`;
    }
  } catch (error) {
    dateStr = null;
  }

  let timeStr = null;
  if (parts.length >= 2 && (parts[1].toLowerCase().includes('a.m.') || parts[1].toLowerCase().includes('p.m.'))) {
    timeStr = parts[1];
  }

  let locationStr = null;
  if (parts.length >= 3) {
    locationStr = parts.slice(2).join(', ').trim();
  }

  return [dateStr, timeStr, locationStr];
}

function splitLocation(locationStr) {
  if (!locationStr) return [null, null];

  const loc = locationStr.trim();

  const keywords = ["Room", "Hall", "Theater", "Theatre"];
  for (const kw of keywords) {
    if (loc.includes(kw)) {
      const idx = loc.indexOf(kw);
      const building = loc.substring(0, idx).trim().replace(/,$/, '');
      const room = loc.substring(idx).trim();
      if (building) {
        return [building, room];
      }
    }
  }

  const tokens = loc.split(/\s+/);
  if (tokens.length > 1 && /^\d+[A-Za-z]?$/.test(tokens[tokens.length - 1])) {
    const room = tokens[tokens.length - 1];
    const building = tokens.slice(0, -1).join(' ').trim().replace(/,$/, '');
    return [building || null, room];
  }

  return [loc, null];
}

function classifyCategories(title, description) {
  const text = `${title} ${description}`.toLowerCase();

  if (/pizza|bodo|bagel|food|lunch|dinner|snacks|feast/.test(text)) {
    if (/free|no cost|provided/.test(text)) {
      return "Free Food";
    }
  }

  if (/5k|run|race|game|tournament|intramural|sports/.test(text)) {
    return "Sports";
  }

  if (/concert|showcase|performance|ensemble|dance|arts|a cappella|theater|music/.test(text)) {
    return "Arts";
  }

  if (/party|social|mixer|movie/.test(text)) {
    return "Entertainment";
  }

  if (/club|council|association|student org|@ uva|at uva/.test(text)) {
    return "Club Events";
  }

  return "Campus Events";
}

function guessOrgName(title, description) {
  let m = description.match(/([A-Z][A-Za-z0-9 '&]+ @ UVA)/);
  if (m) return m[1];

  m = description.match(/([A-Z][A-Za-z0-9 '&]+ at UVA)/);
  if (m) return m[1];

  if (title.includes("UVA")) {
    const chopWords = ["Showcase", "Concert", "Competition", "Event", "Workshop"];
    let part = title;
    for (const w of chopWords) {
      const idx = part.indexOf(w);
      if (idx !== -1) {
        part = part.substring(0, idx);
        break;
      }
    }
    return part.trim().replace(/[-:,]+$/, '');
  }

  return null;
}

function orgDescriptionFromText(description) {
  if (!description) return null;
  const sentence = description.split('.')[0].trim();
  return sentence || null;
}

function convertTimeTo24h(timeStr) {
  if (!timeStr) return "12:00:00";

  timeStr = timeStr.toLowerCase().trim();
  timeStr = timeStr.replace(/[–—-].*/,'').trim();

  const match = timeStr.match(/(\d{1,2})(?::(\d{2}))?\s*(a\.?m\.?|p\.?m\.?)/);
  if (!match) return "12:00:00";

  let hour = parseInt(match[1]);
  const minute = match[2] ? parseInt(match[2]) : 0;
  const period = match[3];

  if (period.includes('p') && hour !== 12) {
    hour += 12;
  } else if (period.includes('a') && hour === 12) {
    hour = 0;
  }

  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;
}

async function scrapeEvents() {
  console.log("🌐 Fetching UVA Connections page...");

  try {
    const response = await fetch(URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; UVA-Connections-Scraper/1.0)'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    console.log("✅ Page fetched successfully");
    console.log("📖 Parsing events...");

    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, '\n')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"');

    const lines = textContent.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const events = [];
    let currentSection = null;
    const currentYear = 2025;

    for (let i = 0; i < lines.length - 2; i++) {
      const line = lines[i].trim();

      if (SECTION_TITLES.has(line)) {
        currentSection = line;
        continue;
      }

      const nextLine = lines[i + 1].trim();

      if (DATE_LINE_REGEX.test(nextLine)) {
        const title = line;
        const dtLocLine = nextLine;
        const descLine = i + 2 < lines.length ? lines[i + 2].trim() : '';

        const [dateStr, timeStr, locationStr] = parseDateTimeLocation(dtLocLine, currentYear);
        const [locationName, room] = splitLocation(locationStr);

        const category = classifyCategories(title, descLine);
        const orgName = guessOrgName(title, descLine);
        const orgDescription = orgDescriptionFromText(descLine);

        const event = {
          title,
          description: descLine,
          location_name: locationName,
          room,
          date: dateStr,
          time: timeStr,
          time_24h: convertTimeTo24h(timeStr),
          category,
          organization_name: orgName,
          organization_description: orgDescription,
          links: []
        };

        events.push(event);
        i += 2;
      }
    }

    const linkMatches = html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([^<]+)<\/a>/gi);
    for (const match of linkMatches) {
      const href = match[1];
      const linkText = match[2].trim();

      for (const event of events) {
        if (linkText && event.title.substring(0, 30).includes(linkText.substring(0, 30))) {
          if (!event.links.includes(href)) {
            event.links.push(href);
          }
        }
      }
    }

    console.log(`✅ Scraped ${events.length} events from the page`);
    return events;

  } catch (error) {
    console.error(`❌ Error fetching page: ${error.message}`);
    return [];
  }
}

function normalizeBuildingName(name) {
  if (!name) return "";

  name = name.toLowerCase().trim();

  const replacements = {
    "shannon lib": "shannon library",
    "clemons lib": "clemons library",
    "brown lib": "brown science & engineering library",
    "ohill": "o'hill dining hall",
    "o hill": "o'hill dining hall",
    "newcomb": "newcomb hall",
    "rotunda": "the rotunda",
    "lawn": "the lawn",
    "old cabell": "old cabell hall",
    "new cabell": "new cabell hall",
    "rice": "rice hall",
    "olsson": "olsson hall",
    "thornton": "thornton hall",
    "jpa": "john paul jones arena",
    "jpj": "john paul jones arena",
    "scott": "scott stadium",
    "cobb": "cobb hall",
    "rouss": "rouss-robertson hall (mcintire)",
    "robertson": "rouss-robertson hall (mcintire)",
    "physics": "physics building",
    "chemistry": "chemistry building",
    "meb": "mechanical engineering building",
    "msb": "materials science building (msb)",
  };

  for (const [key, value] of Object.entries(replacements)) {
    if (name.includes(key)) {
      return value;
    }
  }

  return name;
}

function similarityScore(a, b) {
  const longer = a.length > b.length ? a : b;
  const shorter = a.length > b.length ? b : a;

  if (longer.length === 0) return 1.0;

  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(a, b) {
  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

function matchBuilding(locationName, buildings) {
  if (!locationName || !buildings.length) return [null, 0];

  const normalizedLocation = normalizeBuildingName(locationName);

  let bestMatch = null;
  let bestScore = 0;

  for (const building of buildings) {
    const buildingName = normalizeBuildingName(building.name);

    let score;
    if (normalizedLocation.includes(buildingName) || buildingName.includes(normalizedLocation)) {
      score = 0.95;
    } else {
      score = similarityScore(normalizedLocation, buildingName);
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = building;
    }
  }

  if (bestScore >= 0.6) {
    return [bestMatch, bestScore];
  }

  return [null, 0];
}

function getRandomBuilding(buildings) {
  return buildings[Math.floor(Math.random() * buildings.length)];
}

async function populateDatabase(events) {
  console.log("\n🚀 Starting database population...\n");

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

  console.log("\n🔄 Matching events to buildings...");

  const eventsToInsert = [];
  const matchStats = {
    highConfidence: 0,
    mediumConfidence: 0,
    randomAssignment: 0,
    skipped: 0
  };

  for (let i = 0; i < events.length; i++) {
    const event = events[i];

    if (!event.date || !event.title) {
      matchStats.skipped++;
      continue;
    }

    const [matchedBuilding, confidence] = matchBuilding(event.location_name, buildings);

    let building, matchType;
    if (matchedBuilding && confidence >= 0.8) {
      building = matchedBuilding;
      matchStats.highConfidence++;
      matchType = "✅ High";
    } else if (matchedBuilding && confidence >= 0.6) {
      building = matchedBuilding;
      matchStats.mediumConfidence++;
      matchType = "⚠️  Med";
    } else {
      building = getRandomBuilding(buildings);
      matchStats.randomAssignment++;
      matchType = "🎲 Random";
    }

    const buildingRooms = roomsByBuilding[building.id] || [];
    let roomName;
    if (buildingRooms.length > 0) {
      const room = buildingRooms[Math.floor(Math.random() * buildingRooms.length)];
      roomName = room.room_name;
    } else if (event.room) {
      roomName = event.room;
    } else {
      roomName = `Room ${Math.floor(Math.random() * 300) + 100}`;
    }

    const links = event.links || [];
    let instagramLink = null;
    let websiteLink = null;
    let doorlistLink = null;

    for (const link of links) {
      if (link.includes('instagram.com')) {
        instagramLink = link;
      } else if (link.toLowerCase().includes('doorlist') || link.toLowerCase().includes('eventbrite')) {
        doorlistLink = link;
      } else if (!websiteLink) {
        websiteLink = link;
      }
    }

    const customLinks = [];
    for (const link of links) {
      if (link !== instagramLink && link !== websiteLink && link !== doorlistLink) {
        customLinks.push({ name: "Event Link", url: link });
      }
    }

    const eventData = {
      title: event.title,
      description: event.description || '',
      location_name: building.name,
      room: roomName,
      latitude: parseFloat(building.latitude),
      longitude: parseFloat(building.longitude),
      event_date: event.date,
      event_time: event.time_24h,
      category: event.category,
      organization_name: event.organization_name || '',
      organization_description: event.organization_description || '',
      instagram_link: instagramLink,
      website_link: websiteLink,
      doorlist_link: doorlistLink,
      custom_links: customLinks,
      created_by: '00000000-0000-0000-0000-000000000000'
    };

    eventsToInsert.push(eventData);

    if (i < 5) {
      console.log(`   ${matchType} | ${event.title.substring(0, 40).padEnd(40)} -> ${building.name}`);
    }
  }

  console.log(`\n📊 Matching Statistics:`);
  console.log(`   High confidence matches: ${matchStats.highConfidence}`);
  console.log(`   Medium confidence matches: ${matchStats.mediumConfidence}`);
  console.log(`   Random assignments: ${matchStats.randomAssignment}`);
  console.log(`   Skipped (invalid data): ${matchStats.skipped}`);

  console.log(`\n💾 Inserting ${eventsToInsert.length} events into database...`);

  let insertedCount = 0;
  let errorCount = 0;

  for (const eventData of eventsToInsert) {
    const { error } = await supabase
      .from('events')
      .insert(eventData);

    if (error) {
      errorCount++;
      if (errorCount <= 3) {
        console.log(`   ⚠️  Error inserting event '${eventData.title.substring(0, 40)}': ${error.message.substring(0, 80)}`);
      }
    } else {
      insertedCount++;
    }
  }

  console.log(`\n✨ Database population complete!`);
  console.log(`📊 Final Summary:`);
  console.log(`   Events inserted: ${insertedCount}`);
  console.log(`   Errors: ${errorCount}`);
  console.log(`   Total processed: ${eventsToInsert.length}`);

  if (insertedCount > 0) {
    console.log(`\n🎉 Success! ${insertedCount} events are now available in USpot!`);
  }
}

async function main() {
  console.log("🚀 UVA Connections Events Scraper for USpot\n");
  console.log("=============================================\n");

  const events = await scrapeEvents();

  if (events.length > 0) {
    await populateDatabase(events);
  } else {
    console.log("❌ No events found");
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
