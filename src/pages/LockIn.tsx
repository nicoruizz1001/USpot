import { useState, useEffect } from 'react';
import { Building } from '@/types';
import { fetchBuildings } from '@/services/buildingsService';
import { MapView } from '@/components/MapView';
import { BuildingPanel } from '@/components/BuildingPanel';
import { RoomBookingModal } from '@/components/RoomBookingModal';
import { AppHeader } from '@/components/AppHeader';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, MapPin, Users, ChevronDown, X, Menu } from 'lucide-react';

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

  const FilterSection = () => (
    <div className="p-4 border-b border-border space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search buildings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex-1 justify-between">
              <span className="truncate">
                {subAreaFilters.length === 0
                  ? 'Area'
                  : `${subAreaFilters.length} selected`}
              </span>
              <ChevronDown className="ml-2 h-4 w-4 shrink-0" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3" align="start">
            <div className="space-y-3">
              <div className="font-medium text-sm">Sub-Area</div>
              <ScrollArea className="h-48">
                {uniqueSubAreas.map((subArea) => (
                  <div key={subArea} className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      id={`subarea-${subArea}-filter`}
                      checked={subAreaFilters.includes(subArea!)}
                      onCheckedChange={() => toggleSubAreaFilter(subArea!)}
                    />
                    <label
                      htmlFor={`subarea-${subArea}-filter`}
                      className="text-sm cursor-pointer"
                    >
                      {subArea}
                    </label>
                  </div>
                ))}
              </ScrollArea>
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex-1 justify-between">
              <span className="truncate">
                {categoryFilters.length === 0
                  ? 'Category'
                  : `${categoryFilters.length} selected`}
              </span>
              <ChevronDown className="ml-2 h-4 w-4 shrink-0" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3" align="start">
            <div className="space-y-3">
              <div className="font-medium text-sm">Category</div>
              {uniqueCategories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}-filter`}
                    checked={categoryFilters.includes(category!)}
                    onCheckedChange={() => toggleCategoryFilter(category!)}
                  />
                  <label
                    htmlFor={`category-${category}-filter`}
                    className="text-sm cursor-pointer"
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {filteredBuildings.length} results
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
          >
            Clear filters
          </Button>
        )}
      </div>

      {(subAreaFilters.length > 0 || categoryFilters.length > 0) && (
        <div className="flex flex-wrap gap-2">
          {subAreaFilters.map((filter) => (
            <Badge key={filter} variant="secondary" className="gap-1">
              {filter}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => toggleSubAreaFilter(filter)}
              />
            </Badge>
          ))}
          {categoryFilters.map((filter) => (
            <Badge key={filter} variant="secondary" className="gap-1">
              {filter}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => toggleCategoryFilter(filter)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <AppHeader showNavTabs />

      <div className="flex-1 flex overflow-hidden pb-16 md:pb-0">
        <div className="hidden md:flex w-96 border-r border-border bg-background flex-col">
          <FilterSection />

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading buildings...
                </div>
              ) : filteredBuildings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No buildings found matching your filters
                </div>
              ) : (
                filteredBuildings.map((building) => (
                <Card
                  key={building.id}
                  className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedBuilding?.id === building.id ? 'ring-2 ring-blue-600' : ''
                  }`}
                  onClick={() => setSelectedBuilding(building)}
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">
                        {building.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          <Users className="w-3 h-3 mr-1" />
                          {building.rooms?.length || 0} rooms
                        </Badge>
                        <Badge
                          variant={
                            (building.rooms?.filter((r) => r.available).length || 0) > 0
                              ? 'default'
                              : 'secondary'
                          }
                          className="text-xs"
                        >
                          {building.rooms?.filter((r) => r.available).length || 0} available
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
              )}
            </div>
          </ScrollArea>
        </div>

        <div className="md:hidden flex-1 flex flex-col">
          <div className="border-b border-border bg-background">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full py-3 flex items-center justify-between px-4 hover:bg-accent"
            >
              <div className="flex items-center gap-2">
                <Menu className="w-5 h-5" />
                <span className="font-medium">
                  {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
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
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              isFilterOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
            }`}
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
              <div className="p-4 space-y-3">
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading buildings...
                  </div>
                ) : filteredBuildings.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No buildings found matching your filters
                  </div>
                ) : (
                  filteredBuildings.map((building) => (
                  <Card
                    key={building.id}
                    className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                      selectedBuilding?.id === building.id ? 'ring-2 ring-blue-600' : ''
                    }`}
                    onClick={() => {
                      setBuildingForBooking(building);
                      setShowBookingModal(true);
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">
                          {building.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            <Users className="w-3 h-3 mr-1" />
                            {building.rooms?.length || 0} rooms
                          </Badge>
                          <Badge
                            variant={
                              (building.rooms?.filter((r) => r.available).length || 0) > 0
                                ? 'default'
                                : 'secondary'
                            }
                            className="text-xs"
                          >
                            {building.rooms?.filter((r) => r.available).length || 0} available
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
                )}
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
              />

              {selectedBuilding && (
                <BuildingPanel
                  building={selectedBuilding}
                  onClose={() => setSelectedBuilding(null)}
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
          />

          {selectedBuilding && (
            <BuildingPanel
              building={selectedBuilding}
              onClose={() => setSelectedBuilding(null)}
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

      <BottomNavigation />
    </div>
  );
};

export default LockIn;
