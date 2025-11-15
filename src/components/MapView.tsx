import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ViewMode, Building, Event } from '@/types';

interface MapViewProps {
  mode: ViewMode;
  buildings: Building[];
  events: Event[];
  onBuildingClick: (building: Building) => void;
  onEventClick: (event: Event) => void;
}

export const MapView = ({ mode, buildings, events, onBuildingClick, onEventClick }: MapViewProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const apiKey = 'pk.eyJ1Ijoibmljb3J1aXp6MTAwMSIsImEiOiJjbWh6aXozeXAwbTFtMmlvaTYzZXA0cnZ0In0.WOsJcjx468DrPXKYOcTCxg';

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
      map.current?.remove();
    };
  }, []);

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

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};
