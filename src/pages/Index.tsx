import { useState } from 'react';
import { ViewMode, Building, Event } from '@/types';
import { mockBuildings, mockEvents } from '@/data/mockData';
import { MapView } from '@/components/MapView';
import { BuildingPanel } from '@/components/BuildingPanel';
import { EventPanel } from '@/components/EventPanel';
import { AppHeader } from '@/components/AppHeader';
import { ViewTabs } from '@/components/ViewTabs';
import { EventList } from '@/components/EventList';
import { BuildingList } from '@/components/BuildingList';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

type ViewType = 'map' | 'list';

const Index = () => {
  const [mode, setMode] = useState<ViewMode>('events');
  const [viewType, setViewType] = useState<ViewType>('list');
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleModeChange = (newMode: ViewMode) => {
    setMode(newMode);
    setSelectedBuilding(null);
    setSelectedEvent(null);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <AppHeader />

      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-6 py-6 space-y-6">
          <div className="flex justify-end">
            <ViewTabs mode={mode} onModeChange={handleModeChange} />
          </div>

          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-800" />
            <AlertDescription className="text-yellow-800">
              The interactive map couldn't load. Showing {mode === 'lock-in' ? 'buildings' : 'events'} list instead.
            </AlertDescription>
          </Alert>

          {mode === 'events' ? (
            <EventList events={mockEvents} onEventClick={setSelectedEvent} />
          ) : (
            <BuildingList buildings={mockBuildings} onBuildingClick={setSelectedBuilding} />
          )}
        </div>
      </div>

      {selectedBuilding && (
        <BuildingPanel
          building={selectedBuilding}
          onClose={() => setSelectedBuilding(null)}
        />
      )}

      {selectedEvent && (
        <EventPanel
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      <div className="fixed bottom-6 left-6 bg-white rounded-lg shadow-lg p-4 max-w-xs border border-border">
        <h3 className="font-bold text-foreground mb-1">
          {mode === 'events' ? 'Events Mode' : 'Lock-In Mode'}
        </h3>
        <p className="text-sm text-muted-foreground">
          {mode === 'lock-in'
            ? 'Click buildings to see available rooms'
            : 'Click pins to see event details'}
        </p>
      </div>
    </div>
  );
};

export default Index;
