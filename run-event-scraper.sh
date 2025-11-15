#!/bin/bash

echo "🚀 UVA Connections Event Scraper and Database Populator"
echo "========================================================"
echo ""

echo "📦 Checking Python dependencies..."
pip3 install -q -r requirements.txt

if [ $? -ne 0 ]; then
    echo "❌ Error installing dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

echo "Step 1: Scraping events from UVA Connections..."
echo "------------------------------------------------"
python3 scrape-connections-events.py

if [ $? -ne 0 ]; then
    echo "❌ Error scraping events"
    exit 1
fi

echo ""
echo "Step 2: Populating database with events..."
echo "-------------------------------------------"
python3 populate-events-database.py

if [ $? -ne 0 ]; then
    echo "❌ Error populating database"
    exit 1
fi

echo ""
echo "✨ All done! Check the Events section in USpot to see the new events."
