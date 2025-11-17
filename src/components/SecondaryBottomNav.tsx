import { Map, List } from 'lucide-react';
import { cn } from '@/lib/utils';

type ViewType = 'map' | 'list';

interface SecondaryBottomNavProps {
  viewType: ViewType;
  onViewChange: (view: ViewType) => void;
}

export const SecondaryBottomNav = ({ viewType, onViewChange }: SecondaryBottomNavProps) => {
  return (
    <div className="fixed bottom-16 left-0 right-0 z-40 bg-white border-t border-border shadow-md lg:hidden">
      <div className="flex items-center justify-around h-14">
        <button
          onClick={() => onViewChange('map')}
          className={cn(
            'flex flex-col items-center justify-center flex-1 h-full transition-colors',
            viewType === 'map'
              ? 'text-blue-600 bg-blue-50'
              : 'text-muted-foreground hover:text-foreground hover:bg-gray-50'
          )}
        >
          <Map className={cn('w-5 h-5', viewType === 'map' && 'scale-110')} />
          <span className={cn('text-xs mt-1', viewType === 'map' && 'font-semibold')}>
            Map
          </span>
        </button>
        <button
          onClick={() => onViewChange('list')}
          className={cn(
            'flex flex-col items-center justify-center flex-1 h-full transition-colors',
            viewType === 'list'
              ? 'text-blue-600 bg-blue-50'
              : 'text-muted-foreground hover:text-foreground hover:bg-gray-50'
          )}
        >
          <List className={cn('w-5 h-5', viewType === 'list' && 'scale-110')} />
          <span className={cn('text-xs mt-1', viewType === 'list' && 'font-semibold')}>
            List
          </span>
        </button>
      </div>
    </div>
  );
};
