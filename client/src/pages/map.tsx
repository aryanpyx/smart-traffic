import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrafficMap } from "@/components/traffic-map";
import { Expand, Filter, MapPin, Activity } from "lucide-react";
import type { Junction } from "@shared/schema";

export default function MapView() {
  const [selectedJunction, setSelectedJunction] = useState<Junction | null>(null);
  const [filterLevel, setFilterLevel] = useState<string>('all');

  const { data: junctions = [], isLoading } = useQuery<Junction[]>({
    queryKey: ['/api/junctions'],
  });

  const filteredJunctions = junctions.filter(junction => 
    filterLevel === 'all' || junction.congestionLevel === filterLevel
  );

  const handleJunctionClick = (junction: Junction) => {
    setSelectedJunction(junction);
  };

  const getCongestionColor = (level: string) => {
    switch (level) {
      case "low": return "text-green-600 bg-green-100";
      case "medium": return "text-orange-600 bg-orange-100";
      case "high": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
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

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-foreground" data-testid="text-page-title">Live Traffic Map</h1>
          <p className="text-muted-foreground">Real-time city traffic visualization with congestion heatmap</p>
        </div>
        
        {/* Filter Controls */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Button
            variant={filterLevel === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterLevel('all')}
            data-testid="button-filter-all"
          >
            All ({junctions.length})
          </Button>
          <Button
            variant={filterLevel === 'low' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterLevel('low')}
            className="text-green-600 border-green-200 hover:bg-green-50"
            data-testid="button-filter-low"
          >
            Low ({junctions.filter(j => j.congestionLevel === 'low').length})
          </Button>
          <Button
            variant={filterLevel === 'medium' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterLevel('medium')}
            className="text-orange-600 border-orange-200 hover:bg-orange-50"
            data-testid="button-filter-medium"
          >
            Medium ({junctions.filter(j => j.congestionLevel === 'medium').length})
          </Button>
          <Button
            variant={filterLevel === 'high' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterLevel('high')}
            className="text-red-600 border-red-200 hover:bg-red-50"
            data-testid="button-filter-high"
          >
            High ({junctions.filter(j => j.congestionLevel === 'high').length})
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Full-width Map */}
        <div className={selectedJunction ? "xl:col-span-3" : "xl:col-span-4"}>
          <Card className="h-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  City Traffic Map
                </CardTitle>
                <Button variant="outline" size="sm" data-testid="button-fullscreen">
                  <Expand className="w-4 h-4" />
                  Fullscreen
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-96 lg:h-[500px]">
                <TrafficMap
                  junctions={filteredJunctions}
                  onJunctionClick={handleJunctionClick}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Junction Details Sidebar */}
        {selectedJunction && (
          <Card data-testid="card-junction-details">
            <CardHeader>
              <CardTitle className="text-lg">Junction Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-foreground">{selectedJunction.name}</h3>
                <p className="text-sm text-muted-foreground">
                  ID: {selectedJunction.id.slice(0, 8)}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge className={getCongestionColor(selectedJunction.congestionLevel)}>
                    {getCongestionText(selectedJunction.congestionLevel)}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Vehicle Count</span>
                  <span className="font-medium" data-testid="text-selected-vehicle-count">
                    {selectedJunction.vehicleCount}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Average Speed</span>
                  <span className="font-medium" data-testid="text-selected-avg-speed">
                    {selectedJunction.avgSpeed} km/h
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Green Time</span>
                  <span className="font-medium text-green-600">
                    {selectedJunction.greenTime}s
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Red Time</span>
                  <span className="font-medium text-red-600">
                    {selectedJunction.redTime}s
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Last Updated</span>
                  <span className="text-sm">
                    {selectedJunction.lastUpdated ? 
                      new Date(selectedJunction.lastUpdated).toLocaleTimeString() : 
                      'Unknown'
                    }
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Live Status</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Real-time traffic monitoring active. Data updates every 30 seconds.
                </p>
              </div>

              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => setSelectedJunction(null)}
                data-testid="button-close-details"
              >
                Close Details
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Map Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">
              {junctions.filter(j => j.congestionLevel === 'low').length}
            </div>
            <div className="text-sm text-muted-foreground">Low Congestion</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {junctions.filter(j => j.congestionLevel === 'medium').length}
            </div>
            <div className="text-sm text-muted-foreground">Medium Congestion</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-red-600">
              {junctions.filter(j => j.congestionLevel === 'high').length}
            </div>
            <div className="text-sm text-muted-foreground">High Congestion</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-foreground">
              {Math.round(junctions.reduce((sum, j) => sum + j.vehicleCount, 0) / junctions.length)}
            </div>
            <div className="text-sm text-muted-foreground">Avg Vehicles/Junction</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
