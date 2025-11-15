import { ViewMode } from '@/types';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ViewTabsProps {
  mode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}

export const ViewTabs = ({ mode, onModeChange }: ViewTabsProps) => {
  return (
    <div className="flex gap-3">
      <Button
        variant={mode === 'lock-in' ? 'default' : 'outline'}
        size="lg"
        onClick={() => onModeChange('lock-in')}
        className={cn(
          'px-6 py-3 rounded-lg font-medium transition-all',
          mode === 'lock-in'
            ? 'bg-white text-foreground border-2 border-blue-600 shadow-sm hover:bg-white'
            : 'bg-white text-muted-foreground border border-border hover:bg-muted'
        )}
      >
        <MapPin className="w-5 h-5 mr-2" />
        Lock-In
      </Button>
      <Button
        variant={mode === 'events' ? 'default' : 'outline'}
        size="lg"
        onClick={() => onModeChange('events')}
        className={cn(
          'px-6 py-3 rounded-lg font-medium transition-all',
          mode === 'events'
            ? 'bg-white text-foreground border-2 border-blue-600 shadow-sm hover:bg-white'
            : 'bg-white text-muted-foreground border border-border hover:bg-muted'
        )}
      >
        <Calendar className="w-5 h-5 mr-2" />
        Events
      </Button>
    </div>
  );
};
