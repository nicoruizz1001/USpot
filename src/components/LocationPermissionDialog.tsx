import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, TrendingUp, X } from 'lucide-react';
import { toast } from 'sonner';

interface LocationPermissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEnableLocation: () => Promise<void>;
  onSkip: () => void;
}

export const LocationPermissionDialog = ({
  open,
  onOpenChange,
  onEnableLocation,
  onSkip
}: LocationPermissionDialogProps) => {
  const [loading, setLoading] = useState(false);

  const handleEnable = async () => {
    setLoading(true);
    try {
      await onEnableLocation();
      toast.success('Location enabled! You\'ll now see events near you.');
      onOpenChange(false);
    } catch (error: any) {
      if (error?.code === 1) {
        toast.error('Location access denied. You can enable it later in your profile settings.');
      } else {
        toast.error('Unable to get your location. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    onSkip();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Enable Location Services</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSkip}
              disabled={loading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            Discover events happening near you by enabling location services
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-blue-100 p-2">
              <MapPin className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-sm">Find Nearby Events</h4>
              <p className="text-sm text-muted-foreground">
                See events happening close to your current location
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="rounded-full bg-green-100 p-2">
              <Navigation className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-sm">Real-Time Updates</h4>
              <p className="text-sm text-muted-foreground">
                Get suggestions that update as you move around campus
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="rounded-full bg-orange-100 p-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h4 className="font-medium text-sm">Sort by Distance</h4>
              <p className="text-sm text-muted-foreground">
                Filter and sort events based on how close they are to you
              </p>
            </div>
          </div>

          <div className="bg-muted p-3 rounded-lg">
            <p className="text-xs text-muted-foreground">
              Your location data is private and secure. We only use it to suggest nearby events. You can disable this anytime in your profile settings.
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleSkip}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            Skip for Now
          </Button>
          <Button
            onClick={handleEnable}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? 'Enabling...' : 'Enable Location'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
