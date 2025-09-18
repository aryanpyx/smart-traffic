import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Expand, Layers } from "lucide-react";
import type { Junction } from "@shared/schema";

interface TrafficMapProps {
  junctions: Junction[];
  onJunctionClick?: (junction: Junction) => void;
}

export function TrafficMap({ junctions, onJunctionClick }: TrafficMapProps) {
  const getMarkerColor = (congestionLevel: string) => {
    switch (congestionLevel) {
      case "low": return "bg-green-500";
      case "medium": return "bg-orange-500";
      case "high": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getJunctionPosition = (index: number) => {
    // Mock positioning for demonstration
    const positions = [
      { top: "16%", left: "20%" },
      { top: "32%", right: "24%" },
      { bottom: "20%", left: "32%" },
      { bottom: "32%", right: "20%" },
    ];
    return positions[index] || positions[0];
  };

  return (
    <Card data-testid="card-traffic-map">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">City Traffic Map</CardTitle>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" data-testid="button-expand-map">
              <Expand className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" data-testid="button-layers-map">
              <Layers className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Map placeholder with color-coded junctions */}
        <div className="relative bg-slate-100 dark:bg-slate-800 h-96 rounded-lg overflow-hidden">
          {/* City street layout background */}
          <div className="absolute inset-0 p-4">
            <svg viewBox="0 0 300 300" className="w-full h-full opacity-20">
              {/* Street grid lines */}
              <line x1="0" y1="75" x2="300" y2="75" stroke="currentColor" strokeWidth="2"/>
              <line x1="0" y1="150" x2="300" y2="150" stroke="currentColor" strokeWidth="2"/>
              <line x1="0" y1="225" x2="300" y2="225" stroke="currentColor" strokeWidth="2"/>
              <line x1="75" y1="0" x2="75" y2="300" stroke="currentColor" strokeWidth="2"/>
              <line x1="150" y1="0" x2="150" y2="300" stroke="currentColor" strokeWidth="2"/>
              <line x1="225" y1="0" x2="225" y2="300" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          
          {/* Junction markers with status colors */}
          {junctions.slice(0, 4).map((junction, index) => {
            const position = getJunctionPosition(index);
            return (
              <div
                key={junction.id}
                className="absolute cursor-pointer"
                style={position}
                title={`${junction.name} - ${junction.congestionLevel} Congestion`}
                onClick={() => onJunctionClick?.(junction)}
                data-testid={`marker-junction-${junction.id}`}
              >
                <div
                  className={`w-4 h-4 ${getMarkerColor(junction.congestionLevel)} rounded-full border-2 border-white shadow-lg hover:scale-110 transition-transform`}
                />
              </div>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex justify-center space-x-6" data-testid="map-legend">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs text-muted-foreground">Low</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-xs text-muted-foreground">Medium</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-xs text-muted-foreground">High</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
