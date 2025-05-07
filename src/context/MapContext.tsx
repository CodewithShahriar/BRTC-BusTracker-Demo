
import React, { createContext, useState, useContext, ReactNode } from "react";

interface MapContextType {
  selectedStop: string | null;
  setSelectedStop: (stopId: string | null) => void;
  selectedRoute: string | null;
  setSelectedRoute: (routeId: string | null) => void;
  showAllRoutes: boolean;
  setShowAllRoutes: (show: boolean) => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const useMapContext = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMapContext must be used within a MapProvider");
  }
  return context;
};

interface MapProviderProps {
  children: ReactNode;
}

export const MapProvider: React.FC<MapProviderProps> = ({ children }) => {
  const [selectedStop, setSelectedStop] = useState<string | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [showAllRoutes, setShowAllRoutes] = useState<boolean>(true);

  const value = {
    selectedStop,
    setSelectedStop,
    selectedRoute,
    setSelectedRoute,
    showAllRoutes,
    setShowAllRoutes
  };

  return (
    <MapContext.Provider value={value}>
      {children}
    </MapContext.Provider>
  );
};
