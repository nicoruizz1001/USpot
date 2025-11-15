import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from '@/contexts/LocationContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { User, Mail, Calendar, MapPin, Navigation, RefreshCw, CalendarCheck } from 'lucide-react';
import { toast } from 'sonner';
import { AppHeader } from '@/components/AppHeader';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, profile, updateProfile } = useAuth();
  const { userLocation, isLocationEnabled, isLoading: locationLoading, enableLocation, disableLocation, refreshLocation } = useLocation();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile({ full_name: fullName });
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLocationToggle = async (enabled: boolean) => {
    try {
      if (enabled) {
        await enableLocation();
        toast.success('Location enabled successfully!');
      } else {
        await disableLocation();
        toast.success('Location disabled');
      }
    } catch (error: any) {
      if (error?.code === 1) {
        toast.error('Location permission denied. Please enable it in your browser settings.');
      } else {
        toast.error('Failed to update location settings');
      }
    }
  };

  const handleRefreshLocation = async () => {
    try {
      await refreshLocation();
      toast.success('Location updated!');
    } catch (error) {
      toast.error('Failed to refresh location');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <div className="container max-w-4xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your account settings</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="w-24 h-24">
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {profile?.full_name ? getInitials(profile.full_name) : <User className="w-10 h-10" />}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle>{profile?.full_name || 'User'}</CardTitle>
              <CardDescription className="break-all">{user?.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span className="break-all">{user?.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Joined {new Date(profile?.created_at || '').toLocaleDateString()}</span>
              </div>
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => navigate('/bookings')}
              >
                <CalendarCheck className="w-4 h-4 mr-2" />
                My Bookings
              </Button>
            </CardContent>
          </Card>

          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>Update your profile information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed
                    </p>
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location Services</CardTitle>
                <CardDescription>
                  Enable location to discover events near you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="location-toggle" className="text-base">
                      Enable Location Tracking
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Allow the app to access your location
                    </p>
                  </div>
                  <Switch
                    id="location-toggle"
                    checked={isLocationEnabled}
                    onCheckedChange={handleLocationToggle}
                    disabled={locationLoading}
                  />
                </div>

                {isLocationEnabled && userLocation && (
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-blue-100 p-2">
                        <Navigation className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">Current Location</p>
                        <p className="text-xs text-muted-foreground">
                          Lat: {userLocation.latitude.toFixed(6)}, Lon: {userLocation.longitude.toFixed(6)}
                        </p>
                        {profile?.last_location_update && (
                          <p className="text-xs text-muted-foreground">
                            Last updated: {new Date(profile.last_location_update).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={handleRefreshLocation}
                      disabled={locationLoading}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${locationLoading ? 'animate-spin' : ''}`} />
                      Refresh Location
                    </Button>

                    <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
                        <p className="text-xs text-muted-foreground">
                          Your location is updated automatically as you move to provide accurate event suggestions.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {!isLocationEnabled && (
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground">
                      Enable location services to see events near you and filter by distance.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
