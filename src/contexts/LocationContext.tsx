import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { locationService, GeolocationCoordinates, GeolocationError } from '@/services/locationService';

interface LocationContextType {
  userLocation: GeolocationCoordinates | null;
  locationError: GeolocationError | null;
  isLocationEnabled: boolean;
  isLoading: boolean;
  enableLocation: () => Promise<void>;
  disableLocation: () => Promise<void>;
  refreshLocation: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const { user, profile, updateProfile } = useAuth();
  const [userLocation, setUserLocation] = useState<GeolocationCoordinates | null>(null);
  const [locationError, setLocationError] = useState<GeolocationError | null>(null);
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const lastUpdateRef = useRef<number>(0);

  useEffect(() => {
    if (profile?.location_enabled && profile.latitude && profile.longitude) {
      setUserLocation({
        latitude: parseFloat(profile.latitude.toString()),
        longitude: parseFloat(profile.longitude.toString())
      });
      setIsLocationEnabled(true);
      startWatchingLocation();
    }

    return () => {
      locationService.stopWatchingPosition();
    };
  }, [profile?.location_enabled]);

  const updateLocationInDatabase = useCallback(async (coords: GeolocationCoordinates) => {
    if (!user) return;

    const now = Date.now();
    if (now - lastUpdateRef.current < 30000) {
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          latitude: coords.latitude,
          longitude: coords.longitude,
          last_location_update: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (!error) {
        lastUpdateRef.current = now;
      }
    } catch (error) {
      console.error('Error updating location in database:', error);
    }
  }, [user]);

  const startWatchingLocation = useCallback(() => {
    locationService.startWatchingPosition(
      (coords) => {
        setUserLocation(coords);
        setLocationError(null);
        updateLocationInDatabase(coords);
      },
      (error) => {
        setLocationError(error);
      }
    );
  }, [updateLocationInDatabase]);

  const enableLocation = useCallback(async () => {
    setIsLoading(true);
    setLocationError(null);

    try {
      const coords = await locationService.getCurrentPosition();
      setUserLocation(coords);
      setIsLocationEnabled(true);

      await updateProfile({
        location_enabled: true,
        location_permission_asked: true,
        latitude: coords.latitude,
        longitude: coords.longitude,
        last_location_update: new Date().toISOString()
      });

      startWatchingLocation();
    } catch (error) {
      setLocationError(error as GeolocationError);
      await updateProfile({
        location_enabled: false,
        location_permission_asked: true
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [updateProfile, startWatchingLocation]);

  const disableLocation = useCallback(async () => {
    locationService.stopWatchingPosition();
    setUserLocation(null);
    setIsLocationEnabled(false);
    setLocationError(null);

    await updateProfile({
      location_enabled: false,
      latitude: null,
      longitude: null,
      last_location_update: null
    });
  }, [updateProfile]);

  const refreshLocation = useCallback(async () => {
    if (!isLocationEnabled) return;

    setIsLoading(true);
    setLocationError(null);

    try {
      const coords = await locationService.getCurrentPosition();
      setUserLocation(coords);
      await updateLocationInDatabase(coords);
    } catch (error) {
      setLocationError(error as GeolocationError);
    } finally {
      setIsLoading(false);
    }
  }, [isLocationEnabled, updateLocationInDatabase]);

  return (
    <LocationContext.Provider value={{
      userLocation,
      locationError,
      isLocationEnabled,
      isLoading,
      enableLocation,
      disableLocation,
      refreshLocation
    }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
