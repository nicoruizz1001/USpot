import { Building } from '@/types';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Clock } from 'lucide-react';

interface ModernBuildingCardProps {
  building: Building;
  onClick: () => void;
}

export const ModernBuildingCard = ({ building, onClick }: ModernBuildingCardProps) => {
  const getCategoryGradient = (category?: string) => {
    const gradients: Record<string, string> = {
      Library: 'from-blue-500 to-cyan-500',
      Academic: 'from-purple-500 to-pink-500',
      'Student Life': 'from-green-500 to-emerald-500',
      Recreation: 'from-orange-500 to-amber-500',
    };
    return gradients[category || ''] || 'from-gray-500 to-gray-600';
  };

  const getCategoryColor = (category?: string) => {
    const colors: Record<string, string> = {
      Library: 'bg-blue-500',
      Academic: 'bg-purple-500',
      'Student Life': 'bg-green-500',
      Recreation: 'bg-orange-500',
    };
    return colors[category || ''] || 'bg-gray-500';
  };

  const availableRooms = building.rooms?.filter((r) => r.available).length || 0;
  const totalRooms = building.rooms?.length || 0;

  return (
    <div
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl bg-white dark:bg-gray-900 w-full"
    >
      <div className="aspect-[4/3] relative overflow-hidden bg-gray-200 dark:bg-gray-800 w-full">
        <div className={`w-full h-full bg-gradient-to-br ${getCategoryGradient(building.category)}`}>
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute top-3 right-3 z-10">
          <Badge className={`bg-gradient-to-r ${getCategoryGradient(building.category)} text-white border-0 shadow-lg backdrop-blur-sm text-xs`}>
            {building.category || 'Building'}
          </Badge>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-white">
          <div className="mb-2 sm:mb-3 min-w-0">
            <div className="flex items-center gap-2 mb-2 min-w-0">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${getCategoryColor(building.category)} flex items-center justify-center shadow-lg shrink-0`}>
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h3 className="font-bold text-lg sm:text-xl leading-tight flex-1 line-clamp-1 break-words min-w-0">
                {building.name}
              </h3>
            </div>
            {building.subArea && (
              <p className="text-xs sm:text-sm text-white/90 font-medium ml-10 sm:ml-12 truncate">
                {building.subArea}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-white/90 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="whitespace-nowrap">{totalRooms} rooms</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${availableRooms > 0 ? 'bg-green-400' : 'bg-red-400'} shadow-lg shrink-0`} />
              <span className="whitespace-nowrap">{availableRooms} available</span>
            </div>
            {building.hours && (
              <div className="flex items-center gap-1.5 min-w-0">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="truncate">{building.hours}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
