import { Event } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface EventListProps {
  events: Event[];
  onEventClick: (event: Event) => void;
  onDeleteEvent?: (eventId: string) => void;
}

const borderColors = [
  'border-l-blue-500',
  'border-l-pink-500',
  'border-l-red-500',
  'border-l-yellow-500',
  'border-l-green-500',
  'border-l-purple-500',
];

export const EventList = ({ events, onEventClick, onDeleteEvent }: EventListProps) => {
  const handleDelete = (e: React.MouseEvent, eventId: string) => {
    e.stopPropagation();
    if (onDeleteEvent) {
      onDeleteEvent(eventId);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {events.map((event, index) => (
        <Card
          key={event.id}
          onClick={() => onEventClick(event)}
          className={`p-6 cursor-pointer hover:shadow-lg transition-shadow border-l-4 overflow-hidden relative group ${
            borderColors[index % borderColors.length]
          } bg-white`}
        >
          {onDeleteEvent && (
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 z-10"
              onClick={(e) => handleDelete(e, event.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2 break-words">{event.title}</h3>
          <div className="space-y-1 min-w-0">
            <p className="text-base text-muted-foreground truncate">{event.building}</p>
            <p className="text-base text-muted-foreground truncate">{event.time}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};
