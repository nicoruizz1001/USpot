import { useState, useEffect } from 'react';
import { Building } from '@/types';
import { fetchBuildings } from '@/services/buildingsService';
import { MapView } from '@/components/MapView';
import { BuildingPanel } from '@/components/BuildingPanel';
import { RoomBookingModal } from '@/components/RoomBookingModal';
import { LocationPermissionDialog } from '@/components/LocationPermissionDialog';
import { ModernBuildingCard } from '@/components/ModernBuildingCard';
import { AppHeader } from '@/components/AppHeader';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, X, SlidersHorizontal, Navigation } from 'lucide-react';
import { useLocation } from '@/contexts/LocationContext';
import { toast } from 'sonner';

const LockIn = () => {
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [subAreaFilters, setSubAreaFilters] = useState<string[]>([]);
  const [activeView, setActiveView] = useState<'map' | 'list'>('list');
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [buildingForBooking, setBuildingForBooking] = useState<Building | null>(null);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [navigationDestination, setNavigationDestination] = useState<{
    coordinates: [number, number];
    name: string;
  } | null>(null);
  const { userLocation, isLocationEnabled, enableLocation } = useLocation();

  useEffect(() => {
    loadBuildings();
  }, []);

  const loadBuildings = async () => {
    setLoading(true);
    const data = await fetchBuildings();
    setBuildings(data);
    setLoading(false);
  };

  const uniqueSubAreas = Array.from(new Set(buildings.map(b => b.subArea).filter(Boolean)));
  const uniqueCategories = Array.from(new Set(buildings.map(b => b.category).filter(Boolean)));

  const filteredBuildings = buildings.filter((building) => {
    const matchesSearch = building.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSubArea = subAreaFilters.length === 0 ||
      subAreaFilters.some(filter => building.subArea === filter);

    const matchesCategory = categoryFilters.length === 0 ||
      categoryFilters.some(filter => building.category === filter);

    return matchesSearch && matchesSubArea && matchesCategory;
  });

  const toggleSubAreaFilter = (value: string) => {
    setSubAreaFilters(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const toggleCategoryFilter = (value: string) => {
    setCategoryFilters(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const [inputValue, setInputValue] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(inputValue);
    }, 0);
    return () => clearTimeout(timer);
  }, [inputValue]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const FilterSection = () => (
    <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
      {isLocationEnabled && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950 p-3 rounded-xl">
          <Navigation className="w-4 h-4 text-blue-600" />
          <span>Location enabled - ready for navigation</span>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-muted-foreground" />
        <Input
          placeholder="Search buildings..."
          value={inputValue}
          onChange={handleSearchChange}
          className="pl-10 sm:pl-12 h-10 sm:h-12 rounded-2xl border-2 focus:border-blue-500 transition-colors text-sm sm:text-base"
        />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 px-1">Categories</h3>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {uniqueCategories.map((category) => {
            const isActive = categoryFilters.includes(category!);
            const gradients: Record<string, string> = {
              Library: 'from-blue-500 to-cyan-500',
              Academic: 'from-purple-500 to-pink-500',
              'Student Life': 'from-green-500 to-emerald-500',
              Recreation: 'from-orange-500 to-amber-500',
            };
            const gradient = gradients[category || ''] || 'from-gray-500 to-gray-600';
            return (
              <button
                key={category}
                onClick={() => toggleCategoryFilter(category!)}
                className={`
                  flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium
                  transition-all duration-200 whitespace-nowrap shrink-0
                  ${
                    isActive
                      ? `bg-gradient-to-r ${gradient} text-white shadow-md scale-105`
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }
                `}
              >
                {category}
                {isActive && <X className="w-3 sm:w-3.5 h-3 sm:h-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm pt-2">
        <span className="text-muted-foreground font-medium">
          {filteredBuildings.length} building{filteredBuildings.length !== 1 ? 's' : ''}
        </span>
        {(subAreaFilters.length > 0 || categoryFilters.length > 0 || searchQuery) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSubAreaFilters([]);
              setCategoryFilters([]);
              setSearchQuery('');
            }}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            Clear all
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <AppHeader showNavTabs />

      <div className="flex-1 flex overflow-hidden pb-16 md:pb-0">
        <div className="hidden md:flex w-96 border-r border-border bg-background flex-col">
          <FilterSection />

          <ScrollArea className="flex-1">
            <div className="p-3 sm:p-4">
              <div className="space-y-3 sm:space-y-4">
              {loading ? (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  <p className="text-lg font-medium">Loading buildings...</p>
                </div>
              ) : filteredBuildings.length === 0 ? (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  <p className="text-lg font-medium mb-2">No buildings found</p>
                  <p className="text-sm">Try adjusting your filters</p>
                </div>
              ) : (
                filteredBuildings.map((building) => (
                  <ModernBuildingCard
                    key={building.id}
                    building={building}
                    onClick={() => {
                      setBuildingForBooking(building);
                      setShowBookingModal(true);
                    }}
                  />
                ))
              )}
              </div>
            </div>
          </ScrollArea>
        </div>

        <div className="md:hidden flex-1 flex flex-col overflow-hidden max-w-full">
          <div className="border-b border-border bg-background">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full py-3 flex items-center justify-between px-4 hover:bg-accent"
            >
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5" />
                <span className="font-medium">
                  Filters
                </span>
              </div>
              {(categoryFilters.length > 0 || subAreaFilters.length > 0) && (
                <Badge variant="secondary" className="ml-2">
                  {categoryFilters.length + subAreaFilters.length}
                </Badge>
              )}
            </Button>
          </div>

          <div
            className={`transition-all duration-300 ease-in-out ${
              isFilterOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
            } overflow-hidden`}
          >
            <FilterSection />
          </div>

          <div className="flex border-b border-border bg-background">
            <button
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeView === 'list'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveView('list')}
            >
              List
            </button>
            <button
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeView === 'map'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveView('map')}
            >
              Map
            </button>
          </div>

          {activeView === 'list' ? (
            <ScrollArea className="flex-1">
              <div className="p-3 sm:p-4 max-w-full">
                <div className="space-y-3 sm:space-y-4 w-full">
                {loading ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p className="text-lg font-medium">Loading buildings...</p>
                  </div>
                ) : filteredBuildings.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p className="text-lg font-medium mb-2">No buildings found</p>
                    <p className="text-sm">Try adjusting your filters</p>
                  </div>
                ) : (
                  filteredBuildings.map((building) => (
                    <ModernBuildingCard
                      key={building.id}
                      building={building}
                      onClick={() => {
                        setBuildingForBooking(building);
                        setShowBookingModal(true);
                      }}
                    />
                  ))
                )}
                </div>
              </div>
            </ScrollArea>
          ) : (
            <div className="flex-1 relative">
              <MapView
                mode="lock-in"
                buildings={filteredBuildings}
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
            </div>
          )}
        </div>

        <div className="hidden md:block flex-1 relative">
          <MapView
            mode="lock-in"
            buildings={filteredBuildings}
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
        </div>
      </div>

      <RoomBookingModal
        building={buildingForBooking}
        open={showBookingModal}
        onClose={() => {
          setShowBookingModal(false);
          setBuildingForBooking(null);
        }}
        onBookingSuccess={() => {
          loadBuildings();
        }}
      />

      <LocationPermissionDialog
        open={showLocationDialog}
        onOpenChange={setShowLocationDialog}
        onEnable={async () => {
          try {
            await enableLocation();
            setShowLocationDialog(false);
            if (selectedBuilding) {
              setNavigationDestination({
                coordinates: selectedBuilding.coordinates,
                name: selectedBuilding.name
              });
              if (activeView === 'list') {
                setActiveView('map');
              }
            }
          } catch (error) {
            toast.error('Unable to access location. Please enable location permissions in your browser settings.');
          }
        }}
      />

      <BottomNavigation />
    </div>
  );
};

export default LockIn;
