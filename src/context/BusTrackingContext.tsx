
import React, { createContext, useState, useContext, ReactNode } from "react";
import { 
  BusStop, Bus, Route,
  busStops as initialBusStops, 
  buses as initialBuses,
  routes as initialRoutes,
  getStopsForRoute,
  getRouteById
} from "../data/busData";

interface BusTrackingContextType {
  busStops: BusStop[];
  buses: Bus[];
  routes: Route[];
  updateBusLocation: (busId: string, stopId: string) => void;
  getStopById: (stopId: string) => BusStop | undefined;
  getBusById: (busId: string) => Bus | undefined;
  getRouteById: (routeId: string) => Route | undefined;
  getStopsForRoute: (routeId: string) => BusStop[];
  getNearestBusToStop: (stopId: string) => { bus: Bus | undefined, distance: string | undefined };
}

const BusTrackingContext = createContext<BusTrackingContextType | undefined>(undefined);

export const useBusTracking = () => {
  const context = useContext(BusTrackingContext);
  if (!context) {
    throw new Error("useBusTracking must be used within a BusTrackingProvider");
  }
  return context;
};

interface BusTrackingProviderProps {
  children: ReactNode;
}

export const BusTrackingProvider: React.FC<BusTrackingProviderProps> = ({ children }) => {
  const [busStops, setBusStops] = useState<BusStop[]>(initialBusStops);
  const [buses, setBuses] = useState<Bus[]>(initialBuses);
  const [routes] = useState<Route[]>(initialRoutes);

  const updateBusLocation = (busId: string, stopId: string) => {
    const now = new Date();
    
    // Update the bus's current stop
    setBuses(prevBuses => 
      prevBuses.map(bus => 
        bus.id === busId 
          ? { ...bus, currentStopId: stopId, lastUpdateTime: now }
          : bus
      )
    );
    
    // Update the stop's last bus and time
    setBusStops(prevStops => 
      prevStops.map(stop => 
        stop.id === stopId 
          ? { ...stop, lastBus: busId, lastUpdateTime: now }
          : stop
      )
    );
  };

  const getStopById = (stopId: string) => {
    return busStops.find(stop => stop.id === stopId);
  };

  const getBusById = (busId: string) => {
    return buses.find(bus => bus.id === busId);
  };

  // Simulate calculation of nearest bus to a stop
  const getNearestBusToStop = (stopId: string) => {
    const stop = getStopById(stopId);
    if (!stop) return { bus: undefined, distance: undefined };
    
    // Find buses on routes that include this stop
    const routeIds = stop.routeIds || [];
    const eligibleBuses = buses.filter(bus => 
      bus.currentStopId && routeIds.includes(bus.routeId)
    );
    
    if (eligibleBuses.length === 0) return { bus: undefined, distance: undefined };
    
    // For demo, select a random bus from eligible buses and calculate a realistic distance
    const randomIndex = Math.floor(Math.random() * eligibleBuses.length);
    const randomBus = eligibleBuses[randomIndex];
    const randomDistance = Math.floor(Math.random() * 10) + 5; // 5-15 minutes away
    
    return { 
      bus: randomBus, 
      distance: `${randomDistance} minutes away` 
    };
  };

  const value = {
    busStops,
    buses,
    routes,
    updateBusLocation,
    getStopById,
    getBusById,
    getRouteById,
    getStopsForRoute,
    getNearestBusToStop
  };

  return (
    <BusTrackingContext.Provider value={value}>
      {children}
    </BusTrackingContext.Provider>
  );
};
