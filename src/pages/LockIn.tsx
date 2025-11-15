import { useState } from 'react';
import { Building } from '@/types';
import { mockBuildings } from '@/data/mockData';
import { MapView } from '@/components/MapView';
import { BuildingPanel } from '@/components/BuildingPanel';
import { AppHeader } from '@/components/AppHeader';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, MapPin, Users, ChevronDown, X } from 'lucide-react';

const LockIn = () => {
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilters, setLocationFilters] = useState<string[]>([]);
  const [buildingTypeFilters, setBuildingTypeFilters] = useState<string[]>([]);
  const [activeView, setActiveView] = useState<'map' | 'list'>('list');

  const filteredBuildings = mockBuildings.filter((building) => {
    const matchesSearch = building.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLocation = locationFilters.length === 0 ||
      locationFilters.some(filter => building.name.toLowerCase().includes(filter.toLowerCase()));

    const matchesType = buildingTypeFilters.length === 0 ||
      buildingTypeFilters.some(filter => {
        if (filter === 'library') return building.name.toLowerCase().includes('library');
        if (filter === 'academic') return !building.name.toLowerCase().includes('library');
        return false;
      });

    return matchesSearch && matchesLocation && matchesType;
  });

  const toggleLocationFilter = (value: string) => {
    setLocationFilters(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const toggleBuildingTypeFilter = (value: string) => {
    setBuildingTypeFilters(prev =>
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
                {locationFilters.length === 0
                  ? 'Location'
                  : `${locationFilters.length} selected`}
              </span>
              <ChevronDown className="ml-2 h-4 w-4 shrink-0" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3" align="start">
            <div className="space-y-3">
              <div className="font-medium text-sm">Location</div>
              {['north', 'central', 'south'].map((location) => (
                <div key={location} className="flex items-center space-x-2">
                  <Checkbox
                    id={`location-${location}-filter`}
                    checked={locationFilters.includes(location)}
                    onCheckedChange={() => toggleLocationFilter(location)}
                  />
                  <label
                    htmlFor={`location-${location}-filter`}
                    className="text-sm cursor-pointer capitalize"
                  >
                    {location} Campus
                  </label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex-1 justify-between">
              <span className="truncate">
                {buildingTypeFilters.length === 0
                  ? 'Type'
                  : `${buildingTypeFilters.length} selected`}
              </span>
              <ChevronDown className="ml-2 h-4 w-4 shrink-0" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3" align="start">
            <div className="space-y-3">
              <div className="font-medium text-sm">Building Type</div>
              {['library', 'academic'].map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type}-filter`}
                    checked={buildingTypeFilters.includes(type)}
                    onCheckedChange={() => toggleBuildingTypeFilter(type)}
                  />
                  <label
                    htmlFor={`type-${type}-filter`}
                    className="text-sm cursor-pointer capitalize"
                  >
                    {type === 'library' ? 'Libraries' : 'Academic'}
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
        {(locationFilters.length > 0 || buildingTypeFilters.length > 0 || searchQuery) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setLocationFilters([]);
              setBuildingTypeFilters([]);
              setSearchQuery('');
            }}
          >
            Clear filters
          </Button>
        )}
      </div>

      {(locationFilters.length > 0 || buildingTypeFilters.length > 0) && (
        <div className="flex flex-wrap gap-2">
          {locationFilters.map((filter) => (
            <Badge key={filter} variant="secondary" className="gap-1">
              {filter} Campus
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => toggleLocationFilter(filter)}
              />
            </Badge>
          ))}
          {buildingTypeFilters.map((filter) => (
            <Badge key={filter} variant="secondary" className="gap-1">
              {filter === 'library' ? 'Libraries' : 'Academic'}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => toggleBuildingTypeFilter(filter)}
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
              {filteredBuildings.map((building) => (
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
              ))}

              {filteredBuildings.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No buildings found matching your filters
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        <div className="md:hidden flex-1 flex flex-col">
          <FilterSection />

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
                {filteredBuildings.map((building) => (
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
                ))}

                {filteredBuildings.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No buildings found matching your filters
                  </div>
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

      <BottomNavigation />
    </div>
  );
};

export default LockIn;
