import { useState, useEffect } from 'react';
import { Building } from '@/types';
import { fetchBuildings } from '@/services/buildingsService';
import { MapView } from '@/components/MapView';
import { BuildingPanel } from '@/components/BuildingPanel';
import { LocationPermissionDialog } from '@/components/LocationPermissionDialog';
import { AppHeader } from '@/components/AppHeader';
import { BottomNavigation } from '@/components/BottomNavigation';
import { SecondaryBottomNav } from '@/components/SecondaryBottomNav';
import { useNavigate } from 'react-router-dom';
import { useLocation } from '@/contexts/LocationContext';
import { toast } from 'sonner';

const LockInMap = () => {
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [navigationDestination, setNavigationDestination] = useState<{
    coordinates: [number, number];
    name: string;
  } | null>(null);
  const navigate = useNavigate();
  const { userLocation, isLocationEnabled, enableLocation } = useLocation();

  useEffect(() => {
    loadBuildings();
  }, []);

  const loadBuildings = async () => {
    const data = await fetchBuildings();
    setBuildings(data);
  };

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
          buildings={buildings}
          events={[]}
          onBuildingClick={setSelectedBuilding}
          onEventClick={() => {}}
          userLocation={userLocation}
          navigationDestination={navigationDestination}
          onExitNavigation={() => setNavigationDestination(null)}
        />

        {selectedBuilding && !navigationDestination && (
          <BuildingPanel
            building={selectedBuilding}
            onClose={() => setSelectedBuilding(null)}
            onNavigate={(building) => {
              if (!isLocationEnabled) {
                setShowLocationDialog(true);
                return;
              }
              setNavigationDestination({
                coordinates: building.coordinates,
                name: building.name
              });
            }}
          />
        )}

        {!navigationDestination && (
          <div className="absolute bottom-32 left-6 bg-white rounded-lg shadow-lg p-4 max-w-xs z-10 border border-border md:bottom-6">
            <h3 className="font-bold text-foreground mb-1">Lock-In Mode</h3>
            <p className="text-sm text-muted-foreground">
              Click pins to see available rooms
            </p>
          </div>
        )}
      </div>

      <LocationPermissionDialog
        open={showLocationDialog}
        onOpenChange={setShowLocationDialog}
        onEnableLocation={async () => {
          try {
            await enableLocation();
            setShowLocationDialog(false);
            if (selectedBuilding) {
              setNavigationDestination({
                coordinates: selectedBuilding.coordinates,
                name: selectedBuilding.name
              });
            }
          } catch (error) {
            toast.error('Unable to access location. Please enable location permissions in your browser settings.');
          }
        }}
        onSkip={() => setShowLocationDialog(false)}
      />

      <SecondaryBottomNav viewType="map" onViewChange={handleViewChange} />
      <BottomNavigation />
    </div>
  );
};

export default LockInMap;
