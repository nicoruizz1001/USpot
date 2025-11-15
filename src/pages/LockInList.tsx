import { useState, useEffect } from 'react';
import { Building } from '@/types';
import { fetchBuildings } from '@/services/buildingsService';
import { BuildingPanel } from '@/components/BuildingPanel';
import { BuildingList } from '@/components/BuildingList';
import { AppHeader } from '@/components/AppHeader';
import { BottomNavigation } from '@/components/BottomNavigation';
import { SecondaryBottomNav } from '@/components/SecondaryBottomNav';
import { useNavigate } from 'react-router-dom';

const LockInList = () => {
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadBuildings();
  }, []);

  const loadBuildings = async () => {
    setLoading(true);
    const data = await fetchBuildings();
    setBuildings(data);
    setLoading(false);
  };

  const handleViewChange = (view: 'map' | 'list') => {
    if (view === 'map') {
      navigate('/lock-in/map');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <AppHeader showNavTabs />

      <div className="flex-1 overflow-auto pb-28 md:pb-0">
        <div className="container mx-auto px-6 py-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-foreground">Available Rooms</h2>
          </div>

          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading buildings...
            </div>
          ) : (
            <BuildingList buildings={buildings} onBuildingClick={setSelectedBuilding} />
          )}
        </div>

        {selectedBuilding && (
          <BuildingPanel
            building={selectedBuilding}
            onClose={() => setSelectedBuilding(null)}
          />
        )}
      </div>

      <SecondaryBottomNav viewType="list" onViewChange={handleViewChange} />
      <BottomNavigation />
    </div>
  );
};

export default LockInList;
