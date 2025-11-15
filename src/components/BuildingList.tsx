import { Building } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BuildingListProps {
  buildings: Building[];
  onBuildingClick: (building: Building) => void;
}

const getCategoryColor = (category?: string) => {
  switch (category) {
    case 'Library':
      return 'border-l-blue-500';
    case 'Academic':
      return 'border-l-green-500';
    case 'Student Life':
      return 'border-l-yellow-500';
    case 'Recreation':
      return 'border-l-red-500';
    default:
      return 'border-l-gray-500';
  }
};

export const BuildingList = ({ buildings, onBuildingClick }: BuildingListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {buildings.map((building) => (
        <Card
          key={building.id}
          onClick={() => onBuildingClick(building)}
          className={`p-6 cursor-pointer hover:shadow-lg transition-shadow border-l-4 ${
            getCategoryColor(building.category)
          } bg-white`}
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-bold text-foreground">{building.name}</h3>
            {building.category && (
              <Badge variant="secondary" className="text-xs">
                {building.category}
              </Badge>
            )}
          </div>
          {building.subArea && (
            <p className="text-sm text-muted-foreground mb-3">{building.subArea}</p>
          )}
          <div className="space-y-1">
            <p className="text-base text-muted-foreground">
              {building.totalRooms > 0 ? `${building.totalRooms} rooms total` : 'No rooms listed'}
            </p>
            {building.totalRooms > 0 && (
              <p className="text-base text-muted-foreground font-medium">
                {building.availableRooms} available now
              </p>
            )}
            <p className="text-sm text-muted-foreground mt-3">Hours: {building.hours}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};
