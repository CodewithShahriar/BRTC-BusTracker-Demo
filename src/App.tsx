
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BusTrackingProvider } from "./context/BusTrackingContext";
import { MapProvider } from "./context/MapContext";
import StudentPage from "./pages/StudentPage";
import DriverPage from "./pages/DriverPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BusTrackingProvider>
      <MapProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<StudentPage />} />
              <Route path="/driver" element={<DriverPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </MapProvider>
    </BusTrackingProvider>
  </QueryClientProvider>
);

export default App;
