import { useState, useEffect } from 'react';
import { Event } from '@/types';
import { mockEvents } from '@/data/mockData';
import { EventDetailModal } from '@/components/EventDetailModal';
import { EventList } from '@/components/EventList';
import { AppHeader } from '@/components/AppHeader';
import { BottomNavigation } from '@/components/BottomNavigation';
import { SecondaryBottomNav } from '@/components/SecondaryBottomNav';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useLocation } from '@/contexts/LocationContext';
import { LocationPermissionDialog } from '@/components/LocationPermissionDialog';
import { toast } from 'sonner';
import { deleteEvent } from '@/services/eventsService';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const EventsList = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [allEvents, setAllEvents] = useState<Event[]>(mockEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { isLocationEnabled, enableLocation } = useLocation();

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
    if (view === 'map') {
      navigate('/events/map');
    }
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleNavigate = async (event: Event) => {
    if (!isLocationEnabled) {
      setShowLocationDialog(true);
      return;
    }

    navigate('/events/map', {
      state: {
        navigationDestination: {
          coordinates: event.coordinates,
          name: event.title
        }
      }
    });
  };

  const handleEnableLocation = async () => {
    try {
      await enableLocation();
      setShowLocationDialog(false);
      if (selectedEvent) {
        handleNavigate(selectedEvent);
      }
    } catch (error) {
      toast.error('Unable to access location. Please enable location permissions in your browser settings.');
    }
  };

  const handleDeleteClick = (eventId: string) => {
    setEventToDelete(eventId);
  };

  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;

    setIsDeleting(true);
    const result = await deleteEvent(eventToDelete);

    if (result.success) {
      setAllEvents((prev) => prev.filter((event) => event.id !== eventToDelete));
      toast.success('Event deleted successfully');

      if (selectedEvent?.id === eventToDelete) {
        setIsModalOpen(false);
        setSelectedEvent(null);
      }
    } else {
      toast.error(result.error || 'Failed to delete event');
    }

    setIsDeleting(false);
    setEventToDelete(null);
  };

  const handleCancelDelete = () => {
    setEventToDelete(null);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <AppHeader showNavTabs />

      <div className="flex-1 overflow-auto pb-28 md:pb-0">
        <div className="container mx-auto px-6 py-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-foreground">Campus Events</h2>
          </div>

          <EventList events={allEvents} onEventClick={handleEventClick} onDeleteEvent={handleDeleteClick} />
        </div>

        <EventDetailModal
          event={selectedEvent}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEvent(null);
          }}
          onNavigate={handleNavigate}
          onDelete={handleDeleteClick}
        />

        <LocationPermissionDialog
          open={showLocationDialog}
          onOpenChange={setShowLocationDialog}
          onEnable={handleEnableLocation}
        />
      </div>

      <SecondaryBottomNav viewType="list" onViewChange={handleViewChange} />
      <BottomNavigation />

      <AlertDialog open={!!eventToDelete} onOpenChange={(open) => !open && handleCancelDelete()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this event? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete} disabled={isDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EventsList;
