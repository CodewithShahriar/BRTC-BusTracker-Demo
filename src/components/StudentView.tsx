
import React from "react";
import BusMap from "./BusMap";
import StopSelector from "./StopSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BusIcon from "./BusIcon";

const StudentView: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BusIcon />
            <div>
              <CardTitle>Metropolitan University Bus Tracker</CardTitle>
              <p className="text-sm text-muted-foreground">Sylhet, Bangladesh</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <BusMap />
            </div>
            <div>
              <StopSelector />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentView;
