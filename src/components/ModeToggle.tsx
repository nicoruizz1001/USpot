import { ViewMode } from '@/types';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar } from 'lucide-react';

interface ModeToggleProps {
  mode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}

export const ModeToggle = ({ mode, onModeChange }: ModeToggleProps) => {
  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 bg-card rounded-full shadow-lg border border-border p-1 flex gap-1">
      <Button
        variant={mode === 'lock-in' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onModeChange('lock-in')}
        className="rounded-full px-6 transition-all"
      >
        <MapPin className="w-4 h-4 mr-2" />
        Lock-In
      </Button>
      <Button
        variant={mode === 'events' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onModeChange('events')}
        className="rounded-full px-6 transition-all"
      >
        <Calendar className="w-4 h-4 mr-2" />
        Events
      </Button>
    </div>
  );
};
