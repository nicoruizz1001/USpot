#!/usr/bin/env python3
"""
Populate USpot database with scraped UVA Connections events
Matches events to existing buildings and randomly assigns rooms
"""

import json
import os
import random
from pathlib import Path
from difflib import SequenceMatcher

try:
    from supabase import create_client, Client
except ImportError:
    print("❌ Error: supabase-py not installed")
    print("   Install it with: pip install supabase")
    exit(1)

def load_env():
    """Load environment variables from .env file"""
    env_path = Path(__file__).parent / '.env'
    env_vars = {}

    try:
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    env_vars[key.strip()] = value.strip().strip('"').strip("'")
    except FileNotFoundError:
        print(f"❌ Error: .env file not found at {env_path}")
        return None

    return env_vars

def normalize_building_name(name):
    """Normalize building name for matching"""
    if not name:
        return ""

    name = name.lower().strip()

    replacements = {
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
    }

    for key, value in replacements.items():
        if key in name:
            return value

    return name

def similarity_score(a, b):
    """Calculate similarity score between two strings"""
    return SequenceMatcher(None, a, b).ratio()

def match_building(location_name, buildings):
    """
    Match location name to existing building in database
    Returns (building, match_confidence) or (None, 0)
    """
    if not location_name or not buildings:
        return None, 0

    normalized_location = normalize_building_name(location_name)

    best_match = None
    best_score = 0

    for building in buildings:
        building_name = normalize_building_name(building['name'])

        if normalized_location in building_name or building_name in normalized_location:
            score = 0.95
        else:
            score = similarity_score(normalized_location, building_name)

        if score > best_score:
            best_score = score
            best_match = building

    if best_score >= 0.6:
        return best_match, best_score

    return None, 0

def get_random_building(buildings, exclude_categories=None):
    """Get a random building from the list, optionally excluding certain categories"""
    if exclude_categories:
        filtered = [b for b in buildings if b['category'] not in exclude_categories]
        return random.choice(filtered) if filtered else random.choice(buildings)
    return random.choice(buildings)

def get_or_create_system_user(supabase: Client):
    """
    Get or create a system user for automated event creation
    Returns user ID
    """
    try:
        response = supabase.auth.sign_in_with_password({
            "email": "system@uspot.app",
            "password": "SystemUser2024!"
        })
        return response.user.id
    except Exception:
        try:
            response = supabase.auth.sign_up({
                "email": "system@uspot.app",
                "password": "SystemUser2024!"
            })
            return response.user.id
        except Exception as e:
            print(f"⚠️  Warning: Could not create system user: {e}")
            print("   Events will be created without user attribution")
            return None

def populate_database(events_file="uva_connections_events.json"):
    """Main function to populate database with events"""
    print("🚀 Starting database population...\n")

    env_vars = load_env()
    if not env_vars:
        return

    supabase_url = env_vars.get('VITE_SUPABASE_URL')
    supabase_key = env_vars.get('VITE_SUPABASE_ANON_KEY')

    if not supabase_url or not supabase_key:
        print("❌ Error: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not found in .env")
        return

    supabase: Client = create_client(supabase_url, supabase_key)
    print("✅ Connected to Supabase")

    print("📥 Loading scraped events...")
    try:
        with open(events_file, 'r', encoding='utf-8') as f:
            scraped_events = json.load(f)
    except FileNotFoundError:
        print(f"❌ Error: {events_file} not found. Run scrape-connections-events.py first")
        return

    print(f"✅ Loaded {len(scraped_events)} events from {events_file}")

    print("📥 Fetching buildings from database...")
    try:
        response = supabase.table('buildings').select('*').execute()
        buildings = response.data
        print(f"✅ Found {len(buildings)} buildings in database")
    except Exception as e:
        print(f"❌ Error fetching buildings: {e}")
        return

    if not buildings:
        print("❌ No buildings found in database. Run seed-database.js first")
        return

    print("\n📥 Fetching rooms from database...")
    try:
        response = supabase.table('rooms').select('*').execute()
        rooms = response.data
        rooms_by_building = {}
        for room in rooms:
            building_id = room['building_id']
            if building_id not in rooms_by_building:
                rooms_by_building[building_id] = []
            rooms_by_building[building_id].append(room)
        print(f"✅ Found {len(rooms)} rooms across buildings")
    except Exception as e:
        print(f"❌ Error fetching rooms: {e}")
        rooms_by_building = {}

    print("\n🔄 Matching events to buildings...")
    events_to_insert = []
    match_stats = {
        'high_confidence': 0,
        'medium_confidence': 0,
        'low_confidence': 0,
        'random_assignment': 0,
        'skipped': 0
    }

    for i, event in enumerate(scraped_events, 1):
        if not event.get('date') or not event.get('title'):
            match_stats['skipped'] += 1
            continue

        matched_building, confidence = match_building(event.get('location_name'), buildings)

        if matched_building and confidence >= 0.8:
            building = matched_building
            match_stats['high_confidence'] += 1
            match_type = "✅ High"
        elif matched_building and confidence >= 0.6:
            building = matched_building
            match_stats['medium_confidence'] += 1
            match_type = "⚠️  Med"
        else:
            building = get_random_building(buildings)
            match_stats['random_assignment'] += 1
            match_type = "🎲 Random"

        building_rooms = rooms_by_building.get(building['id'], [])
        if building_rooms:
            room = random.choice(building_rooms)
            room_name = room['room_name']
        elif event.get('room'):
            room_name = event['room']
        else:
            room_name = f"Room {random.randint(100, 399)}"

        links = event.get('links', [])
        instagram_link = None
        website_link = None
        doorlist_link = None

        for link in links:
            if 'instagram.com' in link:
                instagram_link = link
            elif 'doorlist' in link.lower() or 'eventbrite' in link.lower():
                doorlist_link = link
            elif not website_link:
                website_link = link

        custom_links = []
        for link in links:
            if link not in [instagram_link, website_link, doorlist_link]:
                custom_links.append({"name": "Event Link", "url": link})

        event_data = {
            'title': event['title'],
            'description': event['description'] or '',
            'location_name': building['name'],
            'room': room_name,
            'latitude': float(building['latitude']),
            'longitude': float(building['longitude']),
            'event_date': event['date'],
            'event_time': event['time_24h'],
            'category': event['category'],
            'organization_name': event.get('organization_name') or '',
            'organization_description': event.get('organization_description') or '',
            'instagram_link': instagram_link,
            'website_link': website_link,
            'doorlist_link': doorlist_link,
            'custom_links': json.dumps(custom_links) if custom_links else '[]',
            'created_by': '00000000-0000-0000-0000-000000000000'
        }

        events_to_insert.append(event_data)

        if i <= 5:
            print(f"   {match_type} | {event['title'][:40]:<40} -> {building['name']}")

    print(f"\n📊 Matching Statistics:")
    print(f"   High confidence matches: {match_stats['high_confidence']}")
    print(f"   Medium confidence matches: {match_stats['medium_confidence']}")
    print(f"   Random assignments: {match_stats['random_assignment']}")
    print(f"   Skipped (invalid data): {match_stats['skipped']}")

    print(f"\n💾 Inserting {len(events_to_insert)} events into database...")

    inserted_count = 0
    error_count = 0

    for event_data in events_to_insert:
        try:
            response = supabase.table('events').insert(event_data).execute()
            inserted_count += 1
        except Exception as e:
            error_count += 1
            if error_count <= 3:
                print(f"   ⚠️  Error inserting event '{event_data['title'][:40]}': {str(e)[:80]}")

    print(f"\n✨ Database population complete!")
    print(f"📊 Final Summary:")
    print(f"   Events inserted: {inserted_count}")
    print(f"   Errors: {error_count}")
    print(f"   Total processed: {len(events_to_insert)}")

    if inserted_count > 0:
        print(f"\n🎉 Success! {inserted_count} events are now available in USpot!")

if __name__ == "__main__":
    populate_database()
