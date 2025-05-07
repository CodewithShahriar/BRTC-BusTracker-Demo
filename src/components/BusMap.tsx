
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useBusTracking } from '@/context/BusTrackingContext';
import { useMapContext } from '@/context/MapContext';
import { Route } from '@/data/busData';

// Fix for Leaflet default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

const BusMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const routeLinesRef = useRef<{ [key: string]: L.Polyline }>({});
  const { busStops, buses, getBusById, routes, getStopsForRoute, getRouteById } = useBusTracking();
  const { selectedStop, selectedRoute, showAllRoutes } = useMapContext();
  
  // Initialize map centered on Sylhet
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Create the map centered on Metropolitan University, Sylhet
    map.current = L.map(mapContainer.current).setView(
      [24.8940, 91.8963], // Metropolitan University coordinates
      14
    );
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map.current);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Draw routes on the map
  useEffect(() => {
    if (!map.current) return;

    // Clear existing route lines
    Object.values(routeLinesRef.current).forEach(line => {
      line.remove();
    });
    routeLinesRef.current = {};

    const drawRoute = (route: Route) => {
      const stops = getStopsForRoute(route.id);
      if (stops.length < 2) return;

      const coordinates = stops.map(stop => [stop.latitude, stop.longitude]);
      const polyline = L.polyline(coordinates as [number, number][], {
        color: route.color,
        weight: 4,
        opacity: 0.7,
        dashArray: '10, 10',
        lineJoin: 'round'
      }).addTo(map.current!);

      polyline.bindTooltip(route.name, { 
        permanent: false, 
        direction: 'center',
        className: 'route-tooltip' 
      });

      routeLinesRef.current[route.id] = polyline;
    };

    if (selectedRoute) {
      const route = getRouteById(selectedRoute);
      if (route) drawRoute(route);
    } else if (showAllRoutes) {
      routes.forEach(drawRoute);
    }
  }, [selectedRoute, showAllRoutes, routes, getStopsForRoute, getRouteById]);

  // Add markers for bus stops
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => {
      marker.remove();
    });
    markersRef.current = {};

    // Filter stops based on selected route if needed
    const stopsToShow = selectedRoute 
      ? getStopsForRoute(selectedRoute)
      : busStops;

    // Add markers for stops
    stopsToShow.forEach(stop => {
      // Create custom icon
      const routeIds = stop.routeIds || [];
      const isUniversity = stop.id === "university";
      
      // Create custom icon - highlight university as a special icon
      const busStopIcon = L.divIcon({
        className: 'custom-bus-stop-marker',
        html: `
          <div 
            style="
              width: ${isUniversity ? '40px' : '30px'}; 
              height: ${isUniversity ? '40px' : '30px'}; 
              background-color: ${stop.id === selectedStop ? '#ea384c' : isUniversity ? '#33cc66' : '#4a89f3'}; 
              border-radius: 50%; 
              border: 3px solid white;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
              display: flex;
              justify-content: center;
              align-items: center;
              ${isUniversity ? 'z-index: 1000;' : ''}
            "
          >
            ${isUniversity ? `
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 9v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9"/>
                <path d="M9 22V12h6v10M2 10.6L12 2l10 8.6"/>
              </svg>
            ` : ''}
            ${stop.lastBus ? `
              <div style="
                position: absolute;
                top: -10px;
                right: -10px;
                background-color: #ea384c;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1001;
              ">
                <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fill="none" stroke="white" stroke-width="2" d="M5,8 L19,8 L19,19 L5,19 L5,8 Z M7,8 L7,5 C7,2.791 9.791,1 12,1 C14.209,1 17,2.791 17,5 L17,8 M7,13 L17,13 M9,16 L15,16"/>
                </svg>
              </div>
            ` : ''}
          </div>
        `,
        iconSize: [isUniversity ? 40 : 30, isUniversity ? 40 : 30],
        iconAnchor: [isUniversity ? 20 : 15, isUniversity ? 40 : 30],
      });

      // List of routes this stop belongs to
      const routesList = routeIds.map(id => {
        const route = getRouteById(id);
        return route ? `<span style="color: ${route.color};"> • ${route.name}</span>` : '';
      }).join('');

      // Create popup content
      const popupContent = `
        <div class="p-2">
          <h3 class="font-bold">${stop.name}</h3>
          <p class="text-sm">Routes: ${routesList}</p>
          ${stop.lastBus ? 
            `<p class="text-sm font-medium">Last Bus: ${getBusById(stop.lastBus)?.name || 'Unknown'}</p>
             <p class="text-sm text-muted-foreground">Updated: ${stop.lastUpdateTime ? new Date(stop.lastUpdateTime).toLocaleTimeString() : 'N/A'}</p>`
            : 
            '<p class="text-sm">No recent buses</p>'
          }
        </div>
      `;

      // Create marker with popup
      const marker = L.marker([stop.latitude, stop.longitude], { icon: busStopIcon })
        .bindPopup(popupContent)
        .addTo(map.current!);

      markersRef.current[stop.id] = marker;
      
      // Auto-open popup for selected stop
      if (stop.id === selectedStop && marker) {
        marker.openPopup();
        map.current!.setView([stop.latitude, stop.longitude], 15);
      }
    });
    
    // If this is first render and no stop is selected, center on university
    if (!selectedStop && busStops.length > 0) {
      const university = busStops.find(stop => stop.id === "university");
      if (university && map.current) {
        map.current.setView([university.latitude, university.longitude], 14);
      }
    }
  }, [busStops, selectedStop, selectedRoute, getBusById, getStopsForRoute, getRouteById]);

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-lg">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default BusMap;
