import { useState, useEffect } from 'react';
import { Event } from '@/types';
import { mockEvents } from '@/data/mockData';
import { MapView } from '@/components/MapView';
import { EventPanel } from '@/components/EventPanel';
import { AppHeader } from '@/components/AppHeader';
import { BottomNavigation } from '@/components/BottomNavigation';
import { SecondaryBottomNav } from '@/components/SecondaryBottomNav';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

const EventsMap = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [allEvents, setAllEvents] = useState<Event[]>(mockEvents);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) throw error;

      if (data) {
        const formattedEvents: Event[] = data.map((event) => ({
          id: event.id,
          title: event.title,
          building: event.location_name,
          room: event.room || '',
          coordinates: [event.longitude, event.latitude] as [number, number],
          time: event.event_time,
          date: event.event_date,
          category: event.category || 'Other',
          description: event.description,
          organization: {
            name: event.organization_name || '',
            description: event.organization_description || '',
            logo: event.organization_logo,
            links: {
              instagram: event.instagram_link,
              website: event.website_link,
              doorlist: event.doorlist_link,
            },
          },
          image: event.image_url,
        }));

        setAllEvents([...mockEvents, ...formattedEvents]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleViewChange = (view: 'map' | 'list') => {
    if (view === 'list') {
      navigate('/events/list');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <AppHeader showNavTabs />

      <div className="relative flex-1 overflow-hidden pb-28 md:pb-0">
        <MapView
          mode="events"
          buildings={[]}
          events={allEvents}
          onBuildingClick={() => {}}
          onEventClick={setSelectedEvent}
        />

        {selectedEvent && (
          <EventPanel
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}

        <div className="absolute bottom-32 left-6 bg-white rounded-lg shadow-lg p-4 max-w-xs z-10 border border-border md:bottom-6">
          <h3 className="font-bold text-foreground mb-1">Events Mode</h3>
          <p className="text-sm text-muted-foreground">
            Click pins to see event details
          </p>
        </div>
      </div>

      <SecondaryBottomNav viewType="map" onViewChange={handleViewChange} />
      <BottomNavigation />
    </div>
  );
};

export default EventsMap;
