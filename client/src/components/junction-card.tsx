import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Activity, Clock, Car } from "lucide-react";
import type { Junction } from "@shared/schema";

interface JunctionCardProps {
  junction: Junction;
  onViewDetails?: (id: string) => void;
}

export function JunctionCard({ junction, onViewDetails }: JunctionCardProps) {
  const getCongestionColor = (level: string) => {
    switch (level) {
      case "low": return "bg-green-100 text-green-800 hover:bg-green-100";
      case "medium": return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      case "high": return "bg-red-100 text-red-800 hover:bg-red-100";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getCongestionText = (level: string) => {
    switch (level) {
      case "low": return "Low Congestion";
      case "medium": return "Medium Congestion";
      case "high": return "High Congestion";
      default: return "Unknown";
    }
  };

  return (
    <Card data-testid={`card-junction-${junction.id}`} className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-medium text-card-foreground" data-testid={`text-junction-name-${junction.id}`}>
              {junction.name}
            </h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Junction ID: {junction.id.slice(0, 8)}
            </p>
          </div>
          <Badge 
            className={getCongestionColor(junction.congestionLevel)}
            data-testid={`badge-congestion-${junction.id}`}
          >
            {getCongestionText(junction.congestionLevel)}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Car className="w-3 h-3" />
              Vehicle Count
            </p>
            <p className="font-semibold text-card-foreground" data-testid={`text-vehicle-count-${junction.id}`}>
              {junction.vehicleCount}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Activity className="w-3 h-3" />
              Avg Speed
            </p>
            <p className="font-semibold text-card-foreground" data-testid={`text-avg-speed-${junction.id}`}>
              {junction.avgSpeed} km/h
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Green Time
            </p>
            <p className="font-semibold text-green-600" data-testid={`text-green-time-${junction.id}`}>
              {junction.greenTime}s
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Red Time
            </p>
            <p className="font-semibold text-red-600" data-testid={`text-red-time-${junction.id}`}>
              {junction.redTime}s
            </p>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
          {onViewDetails && (
            <Button 
              variant="link" 
              size="sm" 
              onClick={() => onViewDetails(junction.id)}
              className="text-primary hover:underline p-0"
              data-testid={`button-view-details-${junction.id}`}
            >
              View Details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
