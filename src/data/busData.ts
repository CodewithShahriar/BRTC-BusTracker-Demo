
export interface BusStop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  routeIds: string[];
  lastBus?: string;
  lastUpdateTime?: Date;
}

export interface Bus {
  id: string;
  name: string;
  routeId: string;
  currentStopId?: string;
  lastUpdateTime?: Date;
}

export interface Route {
  id: string;
  name: string;
  color: string;
  stopIds: string[];
}

// Bus stops data for Sylhet with approximate coordinates
export const busStops: BusStop[] = [
  // University (destination for all routes)
  { 
    id: "university", 
    name: "Metropolitan University", 
    latitude: 24.8940, 
    longitude: 91.8963, 
    routeIds: ["route1", "route2", "route3", "route4"] 
  },
  
  // Route 1 stops
  { 
    id: "kazirbazar", 
    name: "Kazirbazar", 
    latitude: 24.8864, 
    longitude: 91.8711, 
    routeIds: ["route1"] 
  },
  { 
    id: "rikabibazar", 
    name: "Rikabibazar", 
    latitude: 24.8950, 
    longitude: 91.8716, 
    routeIds: ["route1"] 
  },
  { 
    id: "chouhatta", 
    name: "Chouhatta", 
    latitude: 24.8993, 
    longitude: 91.8720, 
    routeIds: ["route1"] 
  },
  { 
    id: "noyasharak", 
    name: "Noyasharak", 
    latitude: 24.8993, 
    longitude: 91.8634, 
    routeIds: ["route1"] 
  },
  { 
    id: "kumarpara", 
    name: "Kumarpara", 
    latitude: 24.8957, 
    longitude: 91.8570, 
    routeIds: ["route1"] 
  },
  { 
    id: "naiorpul", 
    name: "Naiorpul", 
    latitude: 24.9028, 
    longitude: 91.8516, 
    routeIds: ["route1", "route4"] 
  },
  { 
    id: "mirabazar", 
    name: "Mirabazar", 
    latitude: 24.9062, 
    longitude: 91.8550, 
    routeIds: ["route1", "route4"] 
  },
  { 
    id: "shibganj", 
    name: "Shibganj", 
    latitude: 24.9105, 
    longitude: 91.8627, 
    routeIds: ["route1", "route4"] 
  },
  { 
    id: "tilagor1", 
    name: "Tilagor", 
    latitude: 24.9010, 
    longitude: 91.8930, 
    routeIds: ["route1", "route2", "route3", "route4"] 
  },
  
  // Route 2 stops
  { 
    id: "temukhi", 
    name: "Temukhi", 
    latitude: 24.9047, 
    longitude: 91.8381, 
    routeIds: ["route2"] 
  },
  { 
    id: "modinamarket", 
    name: "Modina Market", 
    latitude: 24.9091, 
    longitude: 91.8494, 
    routeIds: ["route2"] 
  },
  { 
    id: "subidbazar", 
    name: "Subidbazar", 
    latitude: 24.9109, 
    longitude: 91.8584, 
    routeIds: ["route2", "route3"] 
  },
  { 
    id: "amborkhana", 
    name: "Amborkhana", 
    latitude: 24.9043, 
    longitude: 91.8675, 
    routeIds: ["route2", "route3"] 
  },
  { 
    id: "shahieidgah", 
    name: "Shahi Eidgah", 
    latitude: 24.9016, 
    longitude: 91.8807, 
    routeIds: ["route2", "route3"] 
  },
  
  // Route 4 specific stops
  { 
    id: "humayunrashid", 
    name: "Humayun Rashid Chattar", 
    latitude: 24.9173, 
    longitude: 91.8332, 
    routeIds: ["route4"] 
  },
  { 
    id: "upashahar", 
    name: "Upashahar", 
    latitude: 24.9151, 
    longitude: 91.8398, 
    routeIds: ["route4"] 
  },
  { 
    id: "subhanighat", 
    name: "Subhanighat", 
    latitude: 24.9082, 
    longitude: 91.8458, 
    routeIds: ["route4"] 
  }
];

// Routes data
export const routes: Route[] = [
  {
    id: "route1",
    name: "Route 1",
    color: "#ea384c",
    stopIds: [
      "kazirbazar", "rikabibazar", "chouhatta", "noyasharak", 
      "kumarpara", "naiorpul", "mirabazar", "shibganj", "tilagor1", "university"
    ]
  },
  {
    id: "route2",
    name: "Route 2",
    color: "#4a89f3",
    stopIds: [
      "temukhi", "modinamarket", "subidbazar", "amborkhana", 
      "shahieidgah", "tilagor1", "university"
    ]
  },
  {
    id: "route3",
    name: "Route 3",
    color: "#33cc66",
    stopIds: [
      "subidbazar", "amborkhana", "shahieidgah", "tilagor1", "university"
    ]
  },
  {
    id: "route4",
    name: "Route 4",
    color: "#ff9900",
    stopIds: [
      "humayunrashid", "upashahar", "subhanighat", "naiorpul", 
      "mirabazar", "shibganj", "tilagor1", "university"
    ]
  }
];

// Initial buses data
export const buses: Bus[] = [
  { id: "bus1", name: "BRTC-001", routeId: "route1" },
  { id: "bus2", name: "BRTC-002", routeId: "route1" },
  { id: "bus3", name: "BRTC-003", routeId: "route2" },
  { id: "bus4", name: "BRTC-004", routeId: "route3" },
  { id: "bus5", name: "BRTC-005", routeId: "route4" }
];

// Helper function to get stops for a specific route
export const getStopsForRoute = (routeId: string): BusStop[] => {
  const route = routes.find(r => r.id === routeId);
  if (!route) return [];
  
  return route.stopIds
    .map(stopId => busStops.find(stop => stop.id === stopId))
    .filter((stop): stop is BusStop => !!stop);
};

// Helper function to get route by ID
export const getRouteById = (routeId: string): Route | undefined => {
  return routes.find(route => route.id === routeId);
};
