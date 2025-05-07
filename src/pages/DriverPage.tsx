
import React from "react";
import DriverPanel from "@/components/DriverPanel";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const DriverPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">BRTC Driver Panel</h1>
        <Button variant="outline" asChild>
          <Link to="/">Switch to Student View</Link>
        </Button>
      </div>
      
      <div className="flex justify-center">
        <DriverPanel />
      </div>
    </div>
  );
};

export default DriverPage;
