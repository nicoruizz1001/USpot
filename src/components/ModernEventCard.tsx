import { Event } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock } from 'lucide-react';

interface ModernEventCardProps {
  event: Event;
  onClick: () => void;
}

export const ModernEventCard = ({ event, onClick }: ModernEventCardProps) => {
  const getCategoryGradient = (category: string) => {
    const gradients: Record<string, string> = {
      Social: 'from-blue-500 to-cyan-500',
      Academic: 'from-purple-500 to-pink-500',
      Sports: 'from-green-500 to-emerald-500',
      Entertainment: 'from-pink-500 to-rose-500',
      Arts: 'from-orange-500 to-amber-500',
      'Free Food': 'from-red-500 to-orange-500',
    };
    return gradients[category] || 'from-gray-500 to-gray-600';
  };

  return (
    <div
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl w-full"
    >
      <div className="aspect-[4/5] relative overflow-hidden bg-gray-200 w-full">
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${getCategoryGradient(event.category)}`} />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute top-3 right-3 z-10">
          <Badge className={`bg-gradient-to-r ${getCategoryGradient(event.category)} text-white border-0 shadow-lg backdrop-blur-sm text-xs`}>
            {event.category}
          </Badge>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-white">
          <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3 min-w-0">
            {event.organization.logo && (
              <img
                src={event.organization.logo}
                alt={event.organization.name}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white shadow-lg shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg sm:text-xl leading-tight mb-1 line-clamp-2 break-words">
                {event.title}
              </h3>
              {event.organization.name && (
                <p className="text-xs sm:text-sm text-white/90 font-medium truncate">
                  {event.organization.name}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1 sm:space-y-1.5 text-xs sm:text-sm text-white/90">
            <div className="flex items-center gap-2 min-w-0">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="truncate">{event.date}</span>
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="truncate">{event.time}</span>
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="truncate">{event.building}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
