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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, MapPin, Users } from 'lucide-react';

const LockIn = () => {
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [buildingTypeFilter, setBuildingTypeFilter] = useState<string>('all');

  const filteredBuildings = mockBuildings.filter((building) => {
    const matchesSearch = building.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = locationFilter === 'all' || building.name.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesType = buildingTypeFilter === 'all' ||
      (buildingTypeFilter === 'library' && building.name.toLowerCase().includes('library')) ||
      (buildingTypeFilter === 'academic' && !building.name.toLowerCase().includes('library'));

    return matchesSearch && matchesLocation && matchesType;
  });

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <AppHeader showNavTabs />

      <div className="flex-1 flex overflow-hidden pb-16 md:pb-0">
        <div className="w-full md:w-96 border-r border-border bg-background flex flex-col">
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
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="north">North Campus</SelectItem>
                  <SelectItem value="central">Central Campus</SelectItem>
                  <SelectItem value="south">South Campus</SelectItem>
                </SelectContent>
              </Select>

              <Select value={buildingTypeFilter} onValueChange={setBuildingTypeFilter}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Buildings</SelectItem>
                  <SelectItem value="library">Libraries</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {filteredBuildings.length} results
              </span>
              {(locationFilter !== 'all' || buildingTypeFilter !== 'all' || searchQuery) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setLocationFilter('all');
                    setBuildingTypeFilter('all');
                    setSearchQuery('');
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          </div>

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
