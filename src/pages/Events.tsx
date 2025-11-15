import { useState, useEffect } from 'react';
import { Event } from '@/types';
import { mockEvents } from '@/data/mockData';
import { MapView } from '@/components/MapView';
import { EventPanel } from '@/components/EventPanel';
import { AppHeader } from '@/components/AppHeader';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Calendar, Clock, MapPin, ChevronDown, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [allEvents, setAllEvents] = useState<Event[]>(mockEvents);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [activeView, setActiveView] = useState<'map' | 'list'>('list');

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

  const filteredEvents = allEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.building.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilters.length === 0 ||
      categoryFilters.some(filter => event.category.toLowerCase() === filter.toLowerCase());

    return matchesSearch && matchesCategory;
  });

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

  const FilterSection = () => (
    <div className="p-4 border-b border-border space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {filteredEvents.length} results
        </span>
        {(categoryFilters.length > 0 || searchQuery) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setCategoryFilters([]);
              setSearchQuery('');
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
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <AppHeader showNavTabs />

      <div className="flex-1 flex overflow-hidden pb-16 md:pb-0">
        <div className="hidden md:flex w-96 border-r border-border bg-background flex-col">
          <FilterSection />

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3">
              {filteredEvents.map((event) => (
                <Card
                  key={event.id}
                  className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedEvent?.id === event.id ? 'ring-2 ring-blue-600' : ''
                  }`}
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-foreground line-clamp-2">
                        {event.title}
                      </h3>
                      <Badge className={`${getCategoryColor(event.category)} text-xs shrink-0`}>
                        {event.category}
                      </Badge>
                    </div>

                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">
                          {event.building} {event.room && `- ${event.room}`}
                        </span>
                      </div>
                    </div>

                    {event.organization.name && (
                      <div className="pt-2 border-t border-border">
                        <p className="text-xs text-muted-foreground">
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
                {filteredEvents.map((event) => (
                  <Card
                    key={event.id}
                    className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                      selectedEvent?.id === event.id ? 'ring-2 ring-blue-600' : ''
                    }`}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-foreground line-clamp-2">
                          {event.title}
                        </h3>
                        <Badge className={`${getCategoryColor(event.category)} text-xs shrink-0`}>
                          {event.category}
                        </Badge>
                      </div>

                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">
                            {event.building} {event.room && `- ${event.room}`}
                          </span>
                        </div>
                      </div>

                      {event.organization.name && (
                        <div className="pt-2 border-t border-border">
                          <p className="text-xs text-muted-foreground">
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
                onEventClick={setSelectedEvent}
              />

              {selectedEvent && (
                <EventPanel
                  event={selectedEvent}
                  onClose={() => setSelectedEvent(null)}
                />
              )}
            </div>
          )}
        </div>

        <div className="hidden md:block flex-1 relative">
          <MapView
            mode="events"
            buildings={[]}
            events={filteredEvents}
            onBuildingClick={() => {}}
            onEventClick={setSelectedEvent}
          />

          {selectedEvent && (
            <EventPanel
              event={selectedEvent}
              onClose={() => setSelectedEvent(null)}
            />
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Events;
