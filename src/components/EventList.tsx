import { Event } from '@/types';
import { Card } from '@/components/ui/card';

interface EventListProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

const borderColors = [
  'border-l-blue-500',
  'border-l-pink-500',
  'border-l-red-500',
  'border-l-yellow-500',
  'border-l-green-500',
  'border-l-purple-500',
];

export const EventList = ({ events, onEventClick }: EventListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {events.map((event, index) => (
        <Card
          key={event.id}
          onClick={() => onEventClick(event)}
          className={`p-6 cursor-pointer hover:shadow-lg transition-shadow border-l-4 overflow-hidden ${
            borderColors[index % borderColors.length]
          } bg-white`}
        >
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
