import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Plus, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'lock-in', label: 'Lock-in', icon: MapPin, path: '/lock-in' },
    { id: 'create', label: 'Create', icon: Plus, path: '/create' },
    { id: 'events', label: 'Events', icon: Calendar, path: '/events' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border shadow-lg lg:hidden">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;

          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full transition-colors',
                isActive
                  ? 'text-blue-600'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className={cn('w-6 h-6', isActive && 'scale-110')} />
              <span className={cn('text-xs mt-1 font-medium', isActive && 'font-semibold')}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
