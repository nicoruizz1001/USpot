import { useState } from 'react';
import { Building } from '@/types';
import { mockBuildings } from '@/data/mockData';
import { MapView } from '@/components/MapView';
import { BuildingPanel } from '@/components/BuildingPanel';
import { BuildingList } from '@/components/BuildingList';
import { AppHeader } from '@/components/AppHeader';
import { BottomNavigation } from '@/components/BottomNavigation';
import { SecondaryBottomNav } from '@/components/SecondaryBottomNav';

type ViewType = 'map' | 'list';

const LockIn = () => {
  const [viewType, setViewType] = useState<ViewType>('map');
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <AppHeader />

      {viewType === 'map' ? (
        <div className="relative flex-1 overflow-hidden pb-28 md:pb-0">
          <MapView
            mode="lock-in"
            buildings={mockBuildings}
            events={[]}
            onBuildingClick={setSelectedBuilding}
            onEventClick={() => {}}
          />

          {selectedBuilding && (
            <BuildingPanel
              building={selectedBuilding}
              onClose={() => setSelectedBuilding(null)}
            />
          )}

          <div className="absolute bottom-32 left-6 bg-white rounded-lg shadow-lg p-4 max-w-xs z-10 border border-border md:bottom-6">
            <h3 className="font-bold text-foreground mb-1">Lock-In Mode</h3>
            <p className="text-sm text-muted-foreground">
              Click pins to see available rooms
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-auto pb-28 md:pb-0">
          <div className="container mx-auto px-6 py-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">Available Rooms</h2>
            </div>

            <BuildingList buildings={mockBuildings} onBuildingClick={setSelectedBuilding} />
          </div>

          {selectedBuilding && (
            <BuildingPanel
              building={selectedBuilding}
              onClose={() => setSelectedBuilding(null)}
            />
          )}
        </div>
      )}

      <SecondaryBottomNav viewType={viewType} onViewChange={setViewType} />
      <BottomNavigation />
    </div>
  );
};

export default LockIn;
