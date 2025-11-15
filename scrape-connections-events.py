#!/usr/bin/env python3
"""
UVA Connections Events Scraper for USpot
Scrapes events from the UVA Connections newsletter and populates the USpot database
"""

import requests
from bs4 import BeautifulSoup
import re
import json
from datetime import datetime
import os
from pathlib import Path

URL = "https://studentaffairs.virginia.edu/connections#1a"

MONTH_MAP = {
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
}

DATE_LINE_REGEX = re.compile(
    r'^(Jan\.?|Feb\.?|Mar\.?|Apr\.?|May|Jun\.?|Jul\.?|Aug\.?|Sept\.?|Sep\.?|Oct\.?|Nov\.?|Dec\.?)\s+\d{1,2}'
)

SECTION_TITLES = {"ENGAGE", "LEARN", "BE WELL", "ARTS", "TALKS"}

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

def parse_date_time_location(line, default_year=None):
    """
    Parse date, time, and location from event line
    Example: "Nov. 16, 12 p.m., 1515 University Ave."
    Returns: (date_mmddyyyy, time_str, location_str)
    """
    if default_year is None:
        default_year = datetime.now().year

    parts = [p.strip() for p in line.split(",")]

    if not parts:
        return None, None, None

    date_part = parts[0]
    date_part = date_part.split("–")[0].strip()

    try:
        month_str, day_str = date_part.split()[:2]
        month = MONTH_MAP.get(month_str.rstrip("."), None)
        day_str = re.sub(r'\D', '', day_str)
        day = int(day_str) if day_str.isdigit() and month else None

        date_str = None
        if month and day:
            date_obj = datetime(default_year, month, day)
            date_str = date_obj.strftime("%m/%d/%Y")
    except (ValueError, IndexError):
        date_str = None

    time_str = None
    if len(parts) >= 2 and ("a.m." in parts[1].lower() or "p.m." in parts[1].lower()):
        time_str = parts[1]

    location_str = None
    if len(parts) >= 3:
        location_str = ", ".join(parts[2:]).strip()

    return date_str, time_str, location_str

def split_location(location_str):
    """
    Split location into building name and room
    Examples:
      "Gibson 141" -> ("Gibson", "141")
      "Old Cabell Hall" -> ("Old Cabell Hall", None)
    """
    if not location_str:
        return None, None

    loc = location_str.strip()

    keywords = ["Room", "Hall", "Theater", "Theatre"]
    for kw in keywords:
        if kw in loc:
            idx = loc.index(kw)
            building = loc[:idx].strip(" ,")
            room = loc[idx:].strip()
            if building:
                return building, room

    tokens = loc.split()
    if tokens and re.match(r"^\d+[A-Za-z]?$", tokens[-1]):
        room = tokens[-1]
        building = " ".join(tokens[:-1]).strip(" ,")
        return building or None, room

    return loc, None

def classify_categories(title, description):
    """Map event to USpot categories"""
    text = f"{title} {description}".lower()
    cats = []

    cats.append("Campus Events")

    if any(word in text for word in ["pizza", "bodo", "bagel", "food", "lunch", "dinner", "snacks", "feast"]):
        if "free" in text or "no cost" in text or "provided" in text:
            cats.append("Free Food")

    if any(word in text for word in ["5k", "run", "race", "game", "tournament", "intramural", "sports"]):
        cats.append("Sports")

    if any(word in text for word in ["concert", "showcase", "performance", "ensemble", "dance", "arts", "a cappella", "theater", "music"]):
        cats.append("Arts")
        cats.append("Entertainment")
    elif any(word in text for word in ["party", "social", "mixer", "movie"]):
        cats.append("Entertainment")

    if any(word in text for word in ["club", "council", "association", "student org", "@ uva", "at uva"]):
        cats.append("Club Events")

    return cats[0] if cats else "Campus Events"

def guess_org_name(title, description):
    """Extract organization name from title or description"""
    m = re.search(r"([A-Z][A-Za-z0-9 '&]+ @ UVA)", description)
    if m:
        return m.group(1)

    m = re.search(r"([A-Z][A-Za-z0-9 '&]+ at UVA)", description)
    if m:
        return m.group(1)

    if "UVA" in title:
        chop_words = ["Showcase", "Concert", "Competition", "Event", "Workshop"]
        part = title
        for w in chop_words:
            idx = part.find(w)
            if idx != -1:
                part = part[:idx]
                break
        return part.strip(" -:,")

    return None

def org_description_from_text(description):
    """Extract first sentence as organization description"""
    if not description:
        return None
    sentence = description.split(".")[0].strip()
    return sentence if sentence else None

def convert_time_to_24h(time_str):
    """
    Convert time string like "12 p.m." or "6 – 8:30 p.m." to 24-hour format
    Returns the start time in HH:MM:SS format
    """
    if not time_str:
        return "12:00:00"

    time_str = time_str.lower().strip()

    time_str = re.sub(r'[–—-].*', '', time_str).strip()

    match = re.search(r'(\d{1,2})(?::(\d{2}))?\s*(a\.?m\.?|p\.?m\.?)', time_str)
    if not match:
        return "12:00:00"

    hour = int(match.group(1))
    minute = int(match.group(2)) if match.group(2) else 0
    period = match.group(3)

    if 'p' in period and hour != 12:
        hour += 12
    elif 'a' in period and hour == 12:
        hour = 0

    return f"{hour:02d}:{minute:02d}:00"

def scrape_events():
    """Scrape events from UVA Connections page"""
    print("🌐 Fetching UVA Connections page...")

    headers = {
        "User-Agent": "Mozilla/5.0 (compatible; UVA-Connections-Scraper/1.0)"
    }

    try:
        resp = requests.get(URL, headers=headers, timeout=30)
        resp.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f"❌ Error fetching page: {e}")
        return []

    print("✅ Page fetched successfully")
    print("📖 Parsing events...")

    soup = BeautifulSoup(resp.text, "html.parser")
    main = soup.find("main") or soup
    text = main.get_text(separator="\n", strip=True)
    lines = [line for line in text.split("\n") if line.strip()]

    events = []
    current_section = None
    current_year = 2025

    i = 0
    while i < len(lines) - 2:
        line = lines[i].strip()

        if line in SECTION_TITLES:
            current_section = line
            i += 1
            continue

        next_line = lines[i + 1].strip()

        if DATE_LINE_REGEX.match(next_line):
            title = line
            dt_loc_line = next_line
            desc_line = lines[i + 2].strip() if i + 2 < len(lines) else ""

            date_str, time_str, location_str = parse_date_time_location(dt_loc_line, default_year=current_year)
            location_name, room = split_location(location_str)

            category = classify_categories(title, desc_line)
            org_name = guess_org_name(title, desc_line)
            org_description = org_description_from_text(desc_line)

            event = {
                "title": title,
                "description": desc_line,
                "location_name": location_name,
                "room": room,
                "date": date_str,
                "time": time_str,
                "time_24h": convert_time_to_24h(time_str),
                "category": category,
                "organization_name": org_name,
                "organization_description": org_description,
                "links": []
            }

            events.append(event)
            i += 3
        else:
            i += 1

    all_links = main.find_all("a")
    for event in events:
        matches = []
        for a in all_links:
            link_text = a.get_text(strip=True)
            if link_text and event["title"][:30] in link_text:
                href = a.get("href")
                if href and href not in matches:
                    matches.append(href)
        event["links"] = matches

    print(f"✅ Scraped {len(events)} events from the page")

    return events

def save_events_to_json(events, filename="uva_connections_events.json"):
    """Save scraped events to JSON file"""
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(events, f, indent=2, ensure_ascii=False)
    print(f"💾 Saved events to {filename}")

if __name__ == "__main__":
    print("🚀 Starting UVA Connections Events Scraper\n")

    env_vars = load_env()
    if not env_vars:
        exit(1)

    events = scrape_events()

    if events:
        save_events_to_json(events)
        print(f"\n✨ Scraping complete! Found {len(events)} events")
        print("\n📊 Sample event:")
        print(json.dumps(events[0], indent=2))
    else:
        print("❌ No events found")
