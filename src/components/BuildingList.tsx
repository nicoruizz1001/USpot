import { Building } from '@/types';
import { Card } from '@/components/ui/card';

interface BuildingListProps {
  buildings: Building[];
  onBuildingClick: (building: Building) => void;
}

const borderColors = [
  'border-l-yellow-500',
  'border-l-green-500',
  'border-l-red-500',
  'border-l-green-500',
  'border-l-red-500',
  'border-l-blue-500',
];

export const BuildingList = ({ buildings, onBuildingClick }: BuildingListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {buildings.map((building, index) => (
        <Card
          key={building.id}
          onClick={() => onBuildingClick(building)}
          className={`p-6 cursor-pointer hover:shadow-lg transition-shadow border-l-4 ${
            borderColors[index % borderColors.length]
          } bg-white`}
        >
          <h3 className="text-xl font-bold text-foreground mb-3">{building.name}</h3>
          <div className="space-y-1">
            <p className="text-base text-muted-foreground">{building.totalRooms} rooms total</p>
            <p className="text-base text-muted-foreground font-medium">
              {building.availableRooms} available now
            </p>
            <p className="text-sm text-muted-foreground mt-3">Hours: {building.hours}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};
