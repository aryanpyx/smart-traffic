import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { JunctionCard } from "@/components/junction-card";
import { TrafficMap } from "@/components/traffic-map";
import { useWebSocket } from "@/hooks/use-websocket";
import { MapPin, Clock, TrendingUp, Bot, RefreshCw } from "lucide-react";
import type { Junction } from "@shared/schema";

interface DashboardStats {
  totalJunctions: number;
  avgWaitTime: string;
  trafficFlow: string;
  aiEfficiency: string;
  activeRecommendations: number;
}

export default function Dashboard() {
  const [aiMode, setAiMode] = useState(true);
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
  const queryClient = useQueryClient();
  const { isConnected, lastMessage } = useWebSocket('/ws');

  const { data: junctions = [], isLoading: junctionsLoading } = useQuery<Junction[]>({
    queryKey: ['/api/junctions'],
  });

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats'],
  });

  const handleRefreshData = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/junctions'] });
    queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
  };

  const handleViewDetails = (junctionId: string) => {
    console.log('View details for junction:', junctionId);
    // Navigate to junction details or open modal
  };

  const handleJunctionClick = (junction: Junction) => {
    console.log('Junction clicked on map:', junction.name);
    // Handle junction click from map
  };

  // Handle WebSocket messages
  useEffect(() => {
    if (lastMessage) {
      switch (lastMessage.type) {
        case 'junction_updated':
          queryClient.invalidateQueries({ queryKey: ['/api/junctions'] });
          break;
        case 'signal_updated':
          queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
          break;
        default:
          break;
      }
    }
  }, [lastMessage, queryClient]);

  if (junctionsLoading || statsLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-foreground" data-testid="text-page-title">Traffic Dashboard</h1>
          <p className="text-muted-foreground">Real-time traffic management system</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* WebSocket Status */}
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className="text-sm text-muted-foreground">
              {isConnected ? 'Live' : 'Offline'}
            </span>
          </div>
          
          {/* AI Mode Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">AI Mode</span>
            <Switch
              checked={aiMode}
              onCheckedChange={setAiMode}
              data-testid="switch-ai-mode"
            />
            <span className="text-sm text-muted-foreground">Manual</span>
          </div>
          
          <Button onClick={handleRefreshData} data-testid="button-refresh">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </header>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Junctions</p>
                <p className="text-2xl font-semibold text-foreground" data-testid="text-total-junctions">
                  {stats?.totalJunctions || 0}
                </p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full">
                <MapPin className="text-blue-600 dark:text-blue-400 w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Avg Wait Time</p>
                <p className="text-2xl font-semibold text-foreground" data-testid="text-avg-wait-time">
                  {stats?.avgWaitTime || "0s"}
                </p>
              </div>
              <div className="bg-orange-100 dark:bg-orange-900/20 p-3 rounded-full">
                <Clock className="text-orange-600 dark:text-orange-400 w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Traffic Flow</p>
                <p className="text-2xl font-semibold text-green-600" data-testid="text-traffic-flow">
                  {stats?.trafficFlow || "Unknown"}
                </p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full">
                <TrendingUp className="text-green-600 dark:text-green-400 w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">AI Efficiency</p>
                <p className="text-2xl font-semibold text-foreground" data-testid="text-ai-efficiency">
                  {stats?.aiEfficiency || "+0%"}
                </p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-full">
                <Bot className="text-purple-600 dark:text-purple-400 w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Junction Cards and Map View */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Junction Cards */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-foreground">Traffic Junctions</h2>
            <div className="flex space-x-2">
              <Button
                variant={viewMode === 'cards' ? 'default' : 'secondary'}
                size="sm"
                onClick={() => setViewMode('cards')}
                data-testid="button-view-cards"
              >
                Cards
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'secondary'}
                size="sm"
                onClick={() => setViewMode('list')}
                data-testid="button-view-list"
              >
                List
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" data-testid="grid-junctions">
            {junctions.map((junction) => (
              <JunctionCard
                key={junction.id}
                junction={junction}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        </div>

        {/* Map View */}
        <TrafficMap
          junctions={junctions}
          onJunctionClick={handleJunctionClick}
        />
      </div>
    </div>
  );
}
