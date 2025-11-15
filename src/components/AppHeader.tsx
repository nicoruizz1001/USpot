import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MapPin, User, LogOut, Calendar, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppHeaderProps {
  hideActions?: boolean;
  showNavTabs?: boolean;
}

export const AppHeader = ({ hideActions = false, showNavTabs = false }: AppHeaderProps) => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isLockInActive = location.pathname.startsWith('/lock-in');
  const isEventsActive = location.pathname.startsWith('/events');
  const isCreateActive = location.pathname === '/create';

  return (
    <header className="w-full bg-background border-b border-border">
      <div className="container mx-auto h-20 px-6 flex items-center">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="bg-blue-600 text-white rounded-2xl p-3 shadow-md">
            <MapPin className="w-7 h-7" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-2xl font-bold text-foreground">Uspot</span>
            <span className="text-sm text-muted-foreground">Campus Navigation</span>
          </div>
        </button>

        {showNavTabs && (
          <nav className="hidden md:flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2">
            <Button
              variant={isLockInActive ? 'default' : 'ghost'}
              onClick={() => navigate('/lock-in')}
              className={cn(
                'px-6',
                isLockInActive && 'bg-blue-600 hover:bg-blue-700'
              )}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Lock-in
            </Button>
            <Button
              variant={isCreateActive ? 'default' : 'ghost'}
              onClick={() => navigate('/create')}
              className={cn(
                'px-6',
                isCreateActive && 'bg-blue-600 hover:bg-blue-700'
              )}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create
            </Button>
            <Button
              variant={isEventsActive ? 'default' : 'ghost'}
              onClick={() => navigate('/events')}
              className={cn(
                'px-6',
                isEventsActive && 'bg-blue-600 hover:bg-blue-700'
              )}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Events
            </Button>
          </nav>
        )}

        {!hideActions && (
          <div className="ml-auto flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {profile?.full_name ? getInitials(profile.full_name) : <User className="w-5 h-5" />}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{profile?.full_name || 'User'}</p>
                    <p className="text-xs leading-none text-muted-foreground break-all">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </header>
  );
};
