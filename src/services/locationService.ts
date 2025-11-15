export interface GeolocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface GeolocationError {
  code: number;
  message: string;
}

type LocationSuccessCallback = (coords: GeolocationCoordinates) => void;
type LocationErrorCallback = (error: GeolocationError) => void;

class LocationService {
  private watchId: number | null = null;
  private isWatching: boolean = false;

  getCurrentPosition(): Promise<GeolocationCoordinates> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject({
          code: 0,
          message: 'Geolocation is not supported by your browser'
        });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          reject({
            code: error.code,
            message: this.getErrorMessage(error.code)
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  }

  startWatchingPosition(
    onSuccess: LocationSuccessCallback,
    onError: LocationErrorCallback
  ): void {
    if (!navigator.geolocation) {
      onError({
        code: 0,
        message: 'Geolocation is not supported by your browser'
      });
      return;
    }

    if (this.isWatching) {
      return;
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        onSuccess({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        onError({
          code: error.code,
          message: this.getErrorMessage(error.code)
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000
      }
    );

    this.isWatching = true;
  }

  stopWatchingPosition(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
      this.isWatching = false;
    }
  }

  isGeolocationSupported(): boolean {
    return 'geolocation' in navigator;
  }

  async checkPermissionStatus(): Promise<PermissionState | 'unsupported'> {
    if (!navigator.permissions) {
      return 'unsupported';
    }

    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      return result.state;
    } catch (error) {
      return 'unsupported';
    }
  }

  private getErrorMessage(code: number): string {
    switch (code) {
      case 1:
        return 'Location access denied. Please enable location permissions in your browser settings.';
      case 2:
        return 'Location information is unavailable. Please check your connection.';
      case 3:
        return 'Location request timed out. Please try again.';
      default:
        return 'An unknown error occurred while getting your location.';
    }
  }
}

export const locationService = new LocationService();
