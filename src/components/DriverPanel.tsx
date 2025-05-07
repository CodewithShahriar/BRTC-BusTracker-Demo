
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBusTracking } from "@/context/BusTrackingContext";
import { useToast } from "@/components/ui/use-toast";
import BusIcon from "./BusIcon";

const DriverPanel: React.FC = () => {
  const { buses, busStops, routes, updateBusLocation, getRouteById } = useBusTracking();
  const [selectedBus, setSelectedBus] = useState<string>("");
  const [selectedStop, setSelectedStop] = useState<string>("");
  const [filteredStops, setFilteredStops] = useState<typeof busStops>([]);
  const { toast } = useToast();

  // Filter stops based on selected bus route
  useEffect(() => {
    if (!selectedBus) {
      setFilteredStops(busStops);
      return;
    }

    const bus = buses.find(bus => bus.id === selectedBus);
    if (!bus) {
      setFilteredStops(busStops);
      return;
    }

    const route = getRouteById(bus.routeId);
    if (!route) {
      setFilteredStops(busStops);
      return;
    }

    const stopsOnRoute = busStops.filter(stop => 
      stop.routeIds.includes(bus.routeId)
    );
    
    setFilteredStops(stopsOnRoute);
  }, [selectedBus, buses, busStops, getRouteById]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBus || !selectedStop) {
      toast({
        title: "Error",
        description: "Please select both a bus and a stop.",
        variant: "destructive"
      });
      return;
    }

    updateBusLocation(selectedBus, selectedStop);
    
    toast({
      title: "Location Updated",
      description: `Bus location has been updated successfully.`,
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <BusIcon />
          <div>
            <CardTitle>Metropolitan University Bus Tracker</CardTitle>
            <CardDescription>
              Driver Panel - Update your current bus location
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="bus-select" className="font-medium">Select Bus</label>
            <Select value={selectedBus} onValueChange={(value) => {
              setSelectedBus(value);
              setSelectedStop(""); // Clear selected stop when bus changes
            }}>
              <SelectTrigger id="bus-select">
                <SelectValue placeholder="Select a bus" />
              </SelectTrigger>
              <SelectContent>
                {buses.map((bus) => {
                  const route = getRouteById(bus.routeId);
                  return (
                    <SelectItem key={bus.id} value={bus.id}>
                      {bus.name} - {route?.name || "Unknown Route"}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="stop-select" className="font-medium">Current Stop</label>
            <Select 
              value={selectedStop} 
              onValueChange={setSelectedStop}
              disabled={!selectedBus}
            >
              <SelectTrigger id="stop-select">
                <SelectValue placeholder={selectedBus ? "Select a stop" : "Select a bus first"} />
              </SelectTrigger>
              <SelectContent>
                {filteredStops.map((stop) => (
                  <SelectItem key={stop.id} value={stop.id}>
                    {stop.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} className="w-full bg-brtc-red hover:bg-brtc-dark">
          Update Location
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DriverPanel;
