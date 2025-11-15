import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Navigation2, MapPin } from 'lucide-react';

interface NavigationOverlayProps {
  distance: string;
  duration: string;
  currentInstruction?: string;
  onExit: () => void;
  onRecenter: () => void;
}

export const NavigationOverlay = ({
  distance,
  duration,
  currentInstruction,
  onExit,
  onRecenter
}: NavigationOverlayProps) => {
  return (
    <>
      <Card className="absolute top-4 left-4 right-4 z-10 p-4 shadow-lg md:left-auto md:right-4 md:w-96">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Navigation2 className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Navigating</h3>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="font-medium">{distance}</span>
              <span>•</span>
              <span>{duration}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onExit}
            className="h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {currentInstruction && (
          <div className="bg-muted rounded-lg p-3">
            <p className="text-sm text-foreground">{currentInstruction}</p>
          </div>
        )}
      </Card>

      <Button
        size="icon"
        onClick={onRecenter}
        className="absolute bottom-28 right-4 z-10 h-12 w-12 rounded-full shadow-lg md:bottom-4"
      >
        <MapPin className="w-5 h-5" />
      </Button>
    </>
  );
};
