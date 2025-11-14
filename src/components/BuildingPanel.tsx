import { Building } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Clock, Users, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BuildingPanelProps {
  building: Building;
  onClose: () => void;
}

export const BuildingPanel = ({ building, onClose }: BuildingPanelProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case 'in-use':
        return <Circle className="w-4 h-4 text-destructive" />;
      case 'reserved-soon':
        return <AlertCircle className="w-4 h-4 text-warning" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-success text-success-foreground';
      case 'limited':
        return 'bg-warning text-warning-foreground';
      case 'full':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="absolute top-0 right-0 w-full md:w-96 h-full bg-background shadow-lg z-20 overflow-y-auto">
      <Card className="m-0 rounded-none border-0 shadow-none h-full">
        <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{building.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={cn('text-xs', getStatusColor(building.status))}>
                {building.status.toUpperCase()}
              </Badge>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {building.hours}
              </span>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-4 space-y-4">
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Availability</span>
              <span className="font-semibold text-foreground">
                {building.availableRooms}/{building.totalRooms} rooms
              </span>
            </div>
            <div className="w-full bg-background rounded-full h-2 overflow-hidden">
              <div
                className={cn(
                  'h-full transition-all',
                  building.status === 'available' && 'bg-success',
                  building.status === 'limited' && 'bg-warning',
                  building.status === 'full' && 'bg-destructive'
                )}
                style={{ width: `${(building.availableRooms / building.totalRooms) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Users className="w-4 h-4" />
              Floors & Rooms
            </h3>
            {building.floors.map((floor) => (
              <div key={floor.number} className="border border-border rounded-lg overflow-hidden">
                <div className="bg-secondary px-4 py-2 font-medium text-secondary-foreground">
                  Floor {floor.number}
                </div>
                <div className="divide-y divide-border">
                  {floor.rooms.map((room) => (
                    <div key={room.id} className="p-3 hover:bg-muted transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(room.status)}
                            <span className="font-medium text-foreground">Room {room.number}</span>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {room.type} • Capacity: {room.capacity}
                          </div>
                        </div>
                        <Badge
                          variant={room.status === 'available' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {room.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      {room.features.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {room.features.map((feature) => (
                            <span
                              key={feature}
                              className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      )}
                      {room.nextAvailable && (
                        <div className="text-xs text-warning mt-2">
                          Next available: {room.nextAvailable}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
