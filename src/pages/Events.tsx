import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Event } from '@/types';
import { mockEvents } from '@/data/mockData';
import { MapView } from '@/components/MapView';
import { EventDetailModal } from '@/components/EventDetailModal';
import { LocationPermissionDialog } from '@/components/LocationPermissionDialog';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '@/components/AppHeader';
import { BottomNavigation } from '@/components/BottomNavigation';
import { DistanceBadge } from '@/components/DistanceBadge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Search, Calendar, Clock, MapPin, ChevronDown, X, ArrowUpDown, Navigation, Menu } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLocation } from '@/contexts/LocationContext';
import { calculateDistance, sortByDistance, filterByDistance } from '@/utils/distance';

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [allEvents, setAllEvents] = useState<Event[]>(mockEvents);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [activeView, setActiveView] = useState<'map' | 'list'>('list');
  const [sortBy, setSortBy] = useState<'date' | 'distance'>('date');
  const [maxDistance, setMaxDistance] = useState<number>(10);
  const [showDistanceFilter, setShowDistanceFilter] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [navigationDestination, setNavigationDestination] = useState<{
    coordinates: [number, number];
    name: string;
  } | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { userLocation, isLocationEnabled, enableLocation } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) throw error;

      if (data) {
        const formattedEvents: Event[] = data.map((event) => ({
          id: event.id,
          title: event.title,
          building: event.location_name,
          room: event.room || '',
          coordinates: [event.longitude, event.latitude] as [number, number],
          time: event.event_time,
          date: event.event_date,
          category: event.category || 'Other',
          description: event.description,
          organization: {
            name: event.organization_name || '',
            description: event.organization_description || '',
            logo: event.organization_logo,
            links: {
              instagram: event.instagram_link,
              website: event.website_link,
              doorlist: event.doorlist_link,
            },
          },
          image: event.image_url,
        }));

        setAllEvents([...mockEvents, ...formattedEvents]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const eventsWithDistance = useMemo(() => {
    if (!userLocation || !isLocationEnabled) {
      return allEvents;
    }

    return allEvents.map(event => ({
      ...event,
      distance: calculateDistance(
        { latitude: userLocation.latitude, longitude: userLocation.longitude },
        { latitude: event.coordinates[1], longitude: event.coordinates[0] }
      )
    }));
  }, [allEvents, userLocation, isLocationEnabled]);

  const filteredEvents = useMemo(() => {
    let events = eventsWithDistance.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.building.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilters.length === 0 ||
        categoryFilters.some(filter => event.category.toLowerCase() === filter.toLowerCase());

      return matchesSearch && matchesCategory;
    });

    if (showDistanceFilter && isLocationEnabled) {
      events = filterByDistance(events, maxDistance);
    }

    if (sortBy === 'distance' && isLocationEnabled) {
      events = sortByDistance(events);
    }

    return events;
  }, [eventsWithDistance, searchQuery, categoryFilters, sortBy, showDistanceFilter, maxDistance, isLocationEnabled]);

  const toggleCategoryFilter = (value: string) => {
    setCategoryFilters(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Social: 'bg-blue-100 text-blue-800',
      Academic: 'bg-purple-100 text-purple-800',
      Sports: 'bg-green-100 text-green-800',
      Entertainment: 'bg-pink-100 text-pink-800',
      Arts: 'bg-orange-100 text-orange-800',
      'Free Food': 'bg-red-100 text-red-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const FilterSection = memo(() => (
    <div className="p-4 border-b border-border space-y-4">
      {isLocationEnabled && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950 p-2 rounded-lg">
          <Navigation className="w-4 h-4 text-blue-600" />
          <span>Location enabled - showing distances</span>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search events..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-10"
        />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span className="truncate">
              {categoryFilters.length === 0
                ? 'Category'
                : `${categoryFilters.length} selected`}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3" align="start">
          <div className="space-y-3">
            <div className="font-medium text-sm">Category</div>
            {[
              { value: 'social', label: 'Club Events' },
              { value: 'free food', label: 'Free Food' },
              { value: 'academic', label: 'Campus Events' },
              { value: 'sports', label: 'Sports' },
              { value: 'entertainment', label: 'Entertainment' },
              { value: 'arts', label: 'Arts' },
            ].map((category) => (
              <div key={category.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.value}-filter`}
                  checked={categoryFilters.includes(category.value)}
                  onCheckedChange={() => toggleCategoryFilter(category.value)}
                />
                <label
                  htmlFor={`category-${category.value}-filter`}
                  className="text-sm cursor-pointer"
                >
                  {category.label}
                </label>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {isLocationEnabled && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortBy(sortBy === 'date' ? 'distance' : 'date')}
              className="flex items-center gap-2"
            >
              <ArrowUpDown className="w-4 h-4" />
              Sort by {sortBy === 'date' ? 'Distance' : 'Date'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDistanceFilter(!showDistanceFilter)}
            >
              <MapPin className="w-4 h-4 mr-1" />
              {showDistanceFilter ? 'Hide' : 'Show'} Distance Filter
            </Button>
          </div>

          {showDistanceFilter && (
            <div className="space-y-2 p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Max Distance</span>
                <span className="text-muted-foreground">{maxDistance} mi</span>
              </div>
              <Slider
                value={[maxDistance]}
                onValueChange={(value) => setMaxDistance(value[0])}
                min={0.5}
                max={20}
                step={0.5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0.5 mi</span>
                <span>20 mi</span>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {filteredEvents.length} results
        </span>
        {(categoryFilters.length > 0 || searchQuery || showDistanceFilter) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setCategoryFilters([]);
              setSearchQuery('');
              setShowDistanceFilter(false);
              setMaxDistance(10);
              setSortBy('date');
            }}
          >
            Clear filters
          </Button>
        )}
      </div>

      {categoryFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {categoryFilters.map((filter) => (
            <Badge key={filter} variant="secondary" className="gap-1">
              {filter === 'social'
                ? 'Club Events'
                : filter === 'free food'
                ? 'Free Food'
                : filter === 'academic'
                ? 'Campus Events'
                : filter.charAt(0).toUpperCase() + filter.slice(1)}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => toggleCategoryFilter(filter)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  ));

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <AppHeader showNavTabs />

      <div className="flex-1 flex overflow-hidden pb-16 md:pb-0">
        <ResizablePanelGroup direction="horizontal" className="hidden md:flex">
          <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
            <div className="flex flex-col h-full border-r border-border bg-background">
              <FilterSection />

              <ScrollArea className="flex-1">
                <div className="p-4 space-y-3">
                  {filteredEvents.map((event) => (
                    <Card
                      key={event.id}
                      className={`p-4 cursor-pointer transition-all hover:shadow-md overflow-hidden ${
                        selectedEvent?.id === event.id ? 'ring-2 ring-blue-600' : ''
                      }`}
                      onClick={() => {
                        setSelectedEvent(event);
                        setIsModalOpen(true);
                      }}
                    >
                      <div className="space-y-2 w-full min-w-0">
                        <div className="flex items-start justify-between gap-2 w-full">
                          <h3 className="font-semibold text-foreground line-clamp-2 flex-1 min-w-0 max-w-[calc(100%-80px)]">
                            {event.title}
                          </h3>
                          <Badge className={`${getCategoryColor(event.category)} text-xs shrink-0 whitespace-nowrap`}>
                            {event.category}
                          </Badge>
                        </div>

                        <div className="space-y-1 text-sm text-muted-foreground w-full">
                          <div className="flex items-center gap-2 w-full min-w-0">
                            <Calendar className="w-4 h-4 shrink-0" />
                            <span className="truncate flex-1">{new Date(event.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2 w-full min-w-0">
                            <Clock className="w-4 h-4 shrink-0" />
                            <span className="truncate flex-1">{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2 w-full min-w-0">
                            <MapPin className="w-4 h-4 shrink-0" />
                            <span className="truncate flex-1">
                              {event.building} {event.room && `- ${event.room}`}
                            </span>
                          </div>
                          {isLocationEnabled && event.distance !== undefined && (
                            <div className="flex items-center gap-2">
                              <DistanceBadge distance={event.distance} />
                            </div>
                          )}
                        </div>

                        {event.organization.name && (
                          <div className="pt-2 border-t border-border w-full min-w-0">
                            <p className="text-xs text-muted-foreground truncate">
                              by {event.organization.name}
                            </p>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}

                  {filteredEvents.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No events found matching your filters
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle className="hover:bg-blue-200 transition-colors" />

          <ResizablePanel defaultSize={70} minSize={50}>
            <div className="h-full relative">
              <MapView
                mode="events"
                buildings={[]}
                events={filteredEvents}
                onBuildingClick={() => {}}
                onEventClick={(event) => {
                  if (!navigationDestination) {
                    setSelectedEvent(event);
                    setIsModalOpen(true);
                  }
                }}
                userLocation={userLocation}
                navigationDestination={navigationDestination}
                onExitNavigation={() => setNavigationDestination(null)}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>

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
              {(categoryFilters.length > 0 || showDistanceFilter) && (
                <Badge variant="secondary" className="ml-2">
                  {categoryFilters.length + (showDistanceFilter ? 1 : 0)}
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
              <div className="p-4 space-y-3">
                {filteredEvents.map((event) => (
                  <Card
                    key={event.id}
                    className={`p-4 cursor-pointer transition-all hover:shadow-md overflow-hidden ${
                      selectedEvent?.id === event.id ? 'ring-2 ring-blue-600' : ''
                    }`}
                    onClick={() => {
                    setSelectedEvent(event);
                    setIsModalOpen(true);
                  }}
                  >
                    <div className="space-y-2 w-full min-w-0">
                      <div className="flex items-start justify-between gap-2 w-full">
                        <h3 className="font-semibold text-foreground line-clamp-2 flex-1 min-w-0 max-w-[calc(100%-80px)]">
                          {event.title}
                        </h3>
                        <Badge className={`${getCategoryColor(event.category)} text-xs shrink-0 whitespace-nowrap`}>
                          {event.category}
                        </Badge>
                      </div>

                      <div className="space-y-1 text-sm text-muted-foreground w-full">
                        <div className="flex items-center gap-2 w-full min-w-0">
                          <Calendar className="w-4 h-4 shrink-0" />
                          <span className="truncate flex-1">{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 w-full min-w-0">
                          <Clock className="w-4 h-4 shrink-0" />
                          <span className="truncate flex-1">{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2 w-full min-w-0">
                          <MapPin className="w-4 h-4 shrink-0" />
                          <span className="truncate flex-1">
                            {event.building} {event.room && `- ${event.room}`}
                          </span>
                        </div>
                        {isLocationEnabled && event.distance !== undefined && (
                          <div className="flex items-center gap-2">
                            <DistanceBadge distance={event.distance} />
                          </div>
                        )}
                      </div>

                      {event.organization.name && (
                        <div className="pt-2 border-t border-border w-full min-w-0">
                          <p className="text-xs text-muted-foreground truncate">
                            by {event.organization.name}
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}

                {filteredEvents.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No events found matching your filters
                  </div>
                )}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex-1 relative">
              <MapView
                mode="events"
                buildings={[]}
                events={filteredEvents}
                onBuildingClick={() => {}}
                onEventClick={(event) => {
                  if (!navigationDestination) {
                    setSelectedEvent(event);
                    setIsModalOpen(true);
                  }
                }}
                userLocation={userLocation}
                navigationDestination={navigationDestination}
                onExitNavigation={() => setNavigationDestination(null)}
              />
            </div>
          )}
        </div>

      </div>

      <EventDetailModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
        }}
        onNavigate={async (event) => {
          if (!isLocationEnabled) {
            setShowLocationDialog(true);
            return;
          }

          setIsModalOpen(false);
          setNavigationDestination({
            coordinates: event.coordinates,
            name: event.title
          });
          if (activeView === 'list') {
            setActiveView('map');
          }
        }}
      />

      <LocationPermissionDialog
        open={showLocationDialog}
        onOpenChange={setShowLocationDialog}
        onEnable={async () => {
          try {
            await enableLocation();
            setShowLocationDialog(false);
            if (selectedEvent) {
              setIsModalOpen(false);
              setNavigationDestination({
                coordinates: selectedEvent.coordinates,
                name: selectedEvent.title
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

export default Events;
