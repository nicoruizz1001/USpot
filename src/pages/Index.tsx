import { useState } from 'react';
import { ViewMode, Building, Event } from '@/types';
import { mockBuildings, mockEvents } from '@/data/mockData';
import { MapView } from '@/components/MapView';
import { ModeToggle } from '@/components/ModeToggle';
import { BuildingPanel } from '@/components/BuildingPanel';
import { EventPanel } from '@/components/EventPanel';
import { AppHeader } from '@/components/AppHeader';

const Index = () => {
  const [mode, setMode] = useState<ViewMode>('lock-in');
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleModeChange = (newMode: ViewMode) => {
    setMode(newMode);
    setSelectedBuilding(null);
    setSelectedEvent(null);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <AppHeader />

      <div className="relative flex-1 overflow-hidden">
        <ModeToggle mode={mode} onModeChange={handleModeChange} />

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

        <div className="absolute bottom-6 left-6 bg-card rounded-lg shadow-lg p-4 max-w-xs z-10 border border-border">
          <h3 className="font-bold text-foreground mb-1">Uspot</h3>
          <p className="text-sm text-muted-foreground">
            {mode === 'lock-in'
              ? 'Find available study spaces and rooms across campus'
              : 'Discover events happening around Grounds'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
