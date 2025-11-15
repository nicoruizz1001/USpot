import { useState } from 'react';
import { Building } from '@/types';
import { mockBuildings } from '@/data/mockData';
import { MapView } from '@/components/MapView';
import { BuildingPanel } from '@/components/BuildingPanel';
import { AppHeader } from '@/components/AppHeader';
import { BottomNavigation } from '@/components/BottomNavigation';
import { SecondaryBottomNav } from '@/components/SecondaryBottomNav';
import { useNavigate } from 'react-router-dom';

const LockInMap = () => {
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const navigate = useNavigate();

  const handleViewChange = (view: 'map' | 'list') => {
    if (view === 'list') {
      navigate('/lock-in/list');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <AppHeader showNavTabs />

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

      <SecondaryBottomNav viewType="map" onViewChange={handleViewChange} />
      <BottomNavigation />
    </div>
  );
};

export default LockInMap;
