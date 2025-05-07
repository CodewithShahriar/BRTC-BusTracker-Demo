
import React from "react";
import StudentView from "@/components/StudentView";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const StudentPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">University Bus Tracker</h1>
        <Button variant="outline" asChild>
          <Link to="/driver">Switch to Driver Panel</Link>
        </Button>
      </div>
      
      <StudentView />
    </div>
  );
};

export default StudentPage;
