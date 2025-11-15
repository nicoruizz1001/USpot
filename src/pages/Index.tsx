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
import { Button } from '@/components/ui/button';
import { Map, List } from 'lucide-react';
import { cn } from '@/lib/utils';

type ViewType = 'map' | 'list';

const Index = () => {
  const [mode, setMode] = useState<ViewMode>('events');
  const [viewType, setViewType] = useState<ViewType>('map');
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

      {viewType === 'map' ? (
        <div className="relative flex-1 overflow-hidden">
          <div className="absolute top-6 right-6 z-20 flex gap-3">
            <ViewTabs mode={mode} onModeChange={handleModeChange} />
          </div>

          <div className="absolute top-6 left-6 z-20 flex gap-2 bg-white rounded-lg shadow-md p-1">
            <Button
              variant={viewType === 'map' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewType('map')}
              className={cn(
                'px-4',
                viewType === 'map' && 'bg-blue-600 hover:bg-blue-700'
              )}
            >
              <Map className="w-4 h-4 mr-2" />
              Map
            </Button>
            <Button
              variant={viewType === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewType('list')}
            >
              <List className="w-4 h-4 mr-2" />
              List
            </Button>
          </div>

          <MapView
            mode={mode}
            buildings={mockBuildings}
            events={mockEvents}
            onBuildingClick={setSelectedBuilding}
            onEventClick={setSelectedEvent}
          />

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

          <div className="absolute bottom-6 left-6 bg-white rounded-lg shadow-lg p-4 max-w-xs z-10 border border-border">
            <h3 className="font-bold text-foreground mb-1">
              {mode === 'events' ? 'Events Mode' : 'Lock-In Mode'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {mode === 'lock-in'
                ? 'Click pins to see available rooms'
                : 'Click pins to see event details'}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto px-6 py-6 space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex gap-2 bg-white rounded-lg shadow-md p-1">
                <Button
                  variant={viewType === 'map' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewType('map')}
                >
                  <Map className="w-4 h-4 mr-2" />
                  Map
                </Button>
                <Button
                  variant={viewType === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewType('list')}
                  className={cn(
                    'px-4',
                    viewType === 'list' && 'bg-blue-600 hover:bg-blue-700'
                  )}
                >
                  <List className="w-4 h-4 mr-2" />
                  List
                </Button>
              </div>

              <ViewTabs mode={mode} onModeChange={handleModeChange} />
            </div>

            {mode === 'events' ? (
              <EventList events={mockEvents} onEventClick={setSelectedEvent} />
            ) : (
              <BuildingList buildings={mockBuildings} onBuildingClick={setSelectedBuilding} />
            )}
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
        </div>
      )}
    </div>
  );
};

export default Index;
