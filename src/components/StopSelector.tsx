
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBusTracking } from "@/context/BusTrackingContext";
import { useMapContext } from "@/context/MapContext";
import BusIcon from "./BusIcon";

const StopSelector: React.FC = () => {
  const { busStops, routes, getNearestBusToStop, getBusById, getRouteById } = useBusTracking();
  const { selectedStop, setSelectedStop, selectedRoute, setSelectedRoute, setShowAllRoutes } = useMapContext();
  
  const handleStopChange = (stopId: string) => {
    setSelectedStop(stopId);
  };
  
  const handleRouteChange = (routeId: string) => {
    setSelectedRoute(routeId);
    setShowAllRoutes(false);
  };

  const handleShowAllRoutes = () => {
    setSelectedRoute(null);
    setShowAllRoutes(true);
  };
  
  const nearestBusInfo = selectedStop 
    ? getNearestBusToStop(selectedStop)
    : { bus: undefined, distance: undefined };
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="stops" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="stops">Bus Stops</TabsTrigger>
          <TabsTrigger value="routes">Bus Routes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="stops" className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="stop-select" className="font-medium">Select Bus Stop</label>
            <Select value={selectedStop || ""} onValueChange={handleStopChange}>
              <SelectTrigger id="stop-select">
                <SelectValue placeholder="Choose a stop to view details" />
              </SelectTrigger>
              <SelectContent>
                {busStops.map((stop) => (
                  <SelectItem key={stop.id} value={stop.id}>
                    {stop.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedStop && (
            <Card>
              <CardContent className="pt-4">
                <h3 className="font-bold">Stop Information</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {busStops.find(stop => stop.id === selectedStop)?.name}
                </p>
                
                {nearestBusInfo.bus ? (
                  <div className="flex items-center gap-2 mt-3">
                    <BusIcon animate />
                    <div>
                      <p className="font-medium">{getBusById(nearestBusInfo.bus.id)?.name}</p>
                      <p className="text-sm text-brtc-red">{nearestBusInfo.distance}</p>
                      <p className="text-xs text-muted-foreground">
                        {getRouteById(nearestBusInfo.bus.routeId)?.name}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No buses currently en route</p>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="routes" className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="route-select" className="font-medium">Select Bus Route</label>
            <Select value={selectedRoute || ""} onValueChange={handleRouteChange}>
              <SelectTrigger id="route-select">
                <SelectValue placeholder="Choose a route to view on map" />
              </SelectTrigger>
              <SelectContent>
                {routes.map((route) => (
                  <SelectItem key={route.id} value={route.id}>
                    {route.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <button 
              onClick={handleShowAllRoutes} 
              className="text-sm text-blue-500 hover:underline mt-2 block"
            >
              Show all routes
            </button>
          </div>
          
          {selectedRoute && (
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: getRouteById(selectedRoute)?.color }}
                  ></div>
                  <h3 className="font-bold">{getRouteById(selectedRoute)?.name}</h3>
                </div>
                
                <div className="mt-2 space-y-1 text-sm">
                  <p className="font-medium">Stops:</p>
                  <ul className="list-disc list-inside pl-2">
                    {getRouteById(selectedRoute)?.stopIds.map(stopId => {
                      const stop = busStops.find(s => s.id === stopId);
                      return stop ? (
                        <li key={stopId} className="text-sm">
                          {stop.name}
                        </li>
                      ) : null;
                    })}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StopSelector;
