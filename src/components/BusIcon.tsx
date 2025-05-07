
import React from "react";
import { BusFront } from "lucide-react";
import { cn } from "@/lib/utils";

interface BusIconProps {
  className?: string;
  animate?: boolean;
}

const BusIcon: React.FC<BusIconProps> = ({ className, animate = false }) => {
  return (
    <div className={cn(
      "flex items-center justify-center",
      animate ? "animate-bus-bounce" : "",
      className
    )}>
      <BusFront
        size={24}
        className="text-brtc-red fill-brtc-red stroke-white"
      />
    </div>
  );
};

export default BusIcon;
