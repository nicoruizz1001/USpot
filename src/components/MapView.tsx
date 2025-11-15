import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ViewMode, Building, Event } from '@/types';
import { NavigationOverlay } from '@/components/NavigationOverlay';

interface MapViewProps {
  mode: ViewMode;
  buildings: Building[];
  events: Event[];
  onBuildingClick: (building: Building) => void;
  onEventClick: (event: Event) => void;
  userLocation?: { latitude: number; longitude: number } | null;
  navigationDestination?: { coordinates: [number, number]; name: string } | null;
  onExitNavigation?: () => void;
}

export const MapView = ({ mode, buildings, events, onBuildingClick, onEventClick, userLocation, navigationDestination, onExitNavigation }: MapViewProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  const destinationMarker = useRef<mapboxgl.Marker | null>(null);
  const routeLayerId = 'navigation-route';
  const apiKey = 'pk.eyJ1Ijoibmljb3J1aXp6MTAwMSIsImEiOiJjbWh6aXozeXAwbTFtMmlvaTYzZXA0cnZ0In0.WOsJcjx468DrPXKYOcTCxg';
  const [navigationInfo, setNavigationInfo] = useState<{
    distance: string;
    duration: string;
    instruction?: string;
  } | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    try {
      mapboxgl.accessToken = apiKey;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-78.5055, 38.0355],
        zoom: 15,
        pitch: 45,
      });

      map.current.addControl(
        new mapboxgl.NavigationControl({ visualizePitch: true }),
        'top-right'
      );
    } catch (error) {
      console.error('Error initializing map:', error);
    }

    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
      userMarker.current?.remove();
      destinationMarker.current?.remove();
      if (map.current) {
        if (map.current.getLayer(routeLayerId)) {
          map.current.removeLayer(routeLayerId);
        }
        if (map.current.getSource(routeLayerId)) {
          map.current.removeSource(routeLayerId);
        }
      }
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!map.current || !userLocation) return;

    if (userMarker.current) {
      userMarker.current.remove();
    }

    const el = document.createElement('div');
    el.className = 'cursor-default';
    el.innerHTML = `
      <div class="relative">
        <div class="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-lg animate-pulse"></div>
        <div class="absolute inset-0 w-4 h-4 rounded-full bg-blue-400 opacity-30 animate-ping"></div>
      </div>
    `;

    userMarker.current = new mapboxgl.Marker({ element: el })
      .setLngLat([userLocation.longitude, userLocation.latitude])
      .setPopup(
        new mapboxgl.Popup({ offset: 15 })
          .setHTML('<div class="p-2"><p class="font-medium">Your Location</p></div>')
      )
      .addTo(map.current);
  }, [userLocation]);

  useEffect(() => {
    if (!map.current) return;

    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    if (mode === 'lock-in') {
      buildings.forEach(building => {
        const el = document.createElement('div');
        el.className = 'cursor-pointer';
        el.innerHTML = `
          <div class="relative">
            <div class="w-8 h-8 rounded-full shadow-lg flex items-center justify-center text-white font-bold text-sm ${
              building.status === 'available' ? 'bg-success' :
              building.status === 'limited' ? 'bg-warning' :
              'bg-destructive'
            }">
              ${building.availableRooms}
            </div>
            <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-3 ${
              building.status === 'available' ? 'bg-success' :
              building.status === 'limited' ? 'bg-warning' :
              'bg-destructive'
            }"></div>
          </div>
        `;

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat(building.coordinates)
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(`
                <div class="p-2">
                  <h3 class="font-bold">${building.name}</h3>
                  <p class="text-sm">${building.availableRooms}/${building.totalRooms} rooms available</p>
                </div>
              `)
          )
          .addTo(map.current!);

        el.addEventListener('click', () => onBuildingClick(building));
        markers.current.push(marker);
      });
    } else {
      events.forEach(event => {
        const el = document.createElement('div');
        el.className = 'cursor-pointer';
        el.innerHTML = `
          <div class="relative">
            <div class="w-10 h-10 rounded-full bg-accent shadow-lg flex items-center justify-center text-accent-foreground">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-3 bg-accent"></div>
          </div>
        `;

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat(event.coordinates)
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(`
                <div class="p-2">
                  <h3 class="font-bold">${event.title}</h3>
                  <p class="text-sm">${event.time} • ${event.building}</p>
                </div>
              `)
          )
          .addTo(map.current!);

        el.addEventListener('click', () => onEventClick(event));
        markers.current.push(marker);
      });
    }
  }, [mode, buildings, events, onBuildingClick, onEventClick]);

  useEffect(() => {
    if (!map.current || !navigationDestination || !userLocation) {
      if (map.current && navigationDestination === null) {
        if (map.current.getLayer(routeLayerId)) {
          map.current.removeLayer(routeLayerId);
        }
        if (map.current.getSource(routeLayerId)) {
          map.current.removeSource(routeLayerId);
        }
        destinationMarker.current?.remove();
        destinationMarker.current = null;
        setNavigationInfo(null);
      }
      return;
    }

    const fetchRoute = async () => {
      try {
        const [startLng, startLat] = [userLocation.longitude, userLocation.latitude];
        const [endLng, endLat] = navigationDestination.coordinates;

        const response = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/walking/${startLng},${startLat};${endLng},${endLat}?steps=true&geometries=geojson&access_token=${apiKey}`
        );

        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const routeGeometry = route.geometry;

          const distanceInMiles = (route.distance * 0.000621371).toFixed(2);
          const durationInMinutes = Math.ceil(route.duration / 60);

          setNavigationInfo({
            distance: `${distanceInMiles} mi`,
            duration: `${durationInMinutes} min`,
            instruction: route.legs[0]?.steps[0]?.maneuver?.instruction || 'Head towards destination'
          });

          if (map.current.getSource(routeLayerId)) {
            (map.current.getSource(routeLayerId) as mapboxgl.GeoJSONSource).setData(routeGeometry);
          } else {
            map.current.addSource(routeLayerId, {
              type: 'geojson',
              data: routeGeometry
            });

            map.current.addLayer({
              id: routeLayerId,
              type: 'line',
              source: routeLayerId,
              layout: {
                'line-join': 'round',
                'line-cap': 'round'
              },
              paint: {
                'line-color': '#3b82f6',
                'line-width': 5,
                'line-opacity': 0.8
              }
            });
          }

          if (destinationMarker.current) {
            destinationMarker.current.remove();
          }

          const destEl = document.createElement('div');
          destEl.className = 'cursor-pointer';
          destEl.innerHTML = `
            <div class="relative">
              <div class="w-10 h-10 rounded-full bg-red-500 shadow-lg flex items-center justify-center text-white">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          `;

          destinationMarker.current = new mapboxgl.Marker({ element: destEl })
            .setLngLat(navigationDestination.coordinates)
            .setPopup(
              new mapboxgl.Popup({ offset: 25 })
                .setHTML(`
                  <div class="p-2">
                    <h3 class="font-bold">${navigationDestination.name}</h3>
                    <p class="text-sm">Destination</p>
                  </div>
                `)
            )
            .addTo(map.current);

          const bounds = new mapboxgl.LngLatBounds();
          bounds.extend([startLng, startLat]);
          bounds.extend([endLng, endLat]);
          map.current.fitBounds(bounds, {
            padding: { top: 100, bottom: 100, left: 50, right: 50 },
            duration: 1000
          });
        }
      } catch (error) {
        console.error('Error fetching route:', error);
      }
    };

    fetchRoute();
  }, [navigationDestination, userLocation, apiKey]);

  const handleRecenter = () => {
    if (map.current && userLocation) {
      map.current.flyTo({
        center: [userLocation.longitude, userLocation.latitude],
        zoom: 16,
        duration: 1000
      });
    }
  };

  const handleExitNavigation = () => {
    if (onExitNavigation) {
      onExitNavigation();
    }
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0" />
      {navigationInfo && navigationDestination && (
        <NavigationOverlay
          distance={navigationInfo.distance}
          duration={navigationInfo.duration}
          currentInstruction={navigationInfo.instruction}
          onExit={handleExitNavigation}
          onRecenter={handleRecenter}
        />
      )}
    </div>
  );
};
