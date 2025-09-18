import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyticsChart } from "@/components/analytics-chart";
import { TrendingDown, TrendingUp, Fuel, Leaf } from "lucide-react";
import type { TrafficAnalytics } from "@shared/schema";

export default function Analytics() {
  const { data: analytics = [], isLoading } = useQuery<TrafficAnalytics[]>({
    queryKey: ['/api/analytics'],
  });

  const currentAnalytics = analytics[0];

  const improvements = [
    {
      metric: "Average Wait Time",
      before: "68s",
      after: "45s",
      improvement: "-34%",
      icon: TrendingDown,
      color: "text-green-600"
    },
    {
      metric: "Average Commute Time",
      before: "12.5min",
      after: "9.8min",
      improvement: "-22%",
      icon: TrendingDown,
      color: "text-green-600"
    },
    {
      metric: "CO2 Emissions (daily)",
      before: "2.4t",
      after: "1.8t",
      improvement: "-25%",
      icon: Leaf,
      color: "text-green-600"
    },
    {
      metric: "Fuel Consumption (daily)",
      before: "850L",
      after: "645L",
      improvement: "-24%",
      icon: Fuel,
      color: "text-green-600"
    }
  ];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground" data-testid="text-page-title">Impact & Analytics</h1>
        <p className="text-muted-foreground">Performance insights and environmental impact analysis</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Metrics Chart */}
        <AnalyticsChart
          type="performance"
          title="Traffic Flow Improvement"
        />
        
        {/* Before vs After Comparison */}
        <Card data-testid="card-comparison">
          <CardHeader>
            <CardTitle>Before vs After AI Implementation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {improvements.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.metric} className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">{item.metric}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-semibold line-through text-red-500">
                        {item.before}
                      </span>
                      <TrendingUp className="w-4 h-4 text-muted-foreground" />
                      <span className="text-lg font-semibold text-green-600">
                        {item.after}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-1">
                    <Icon className={`w-4 h-4 ${item.color}`} />
                    <span className={`font-medium ${item.color}`}>{item.improvement}</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Current Statistics */}
      {currentAnalytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-foreground" data-testid="text-current-wait-time">
                {currentAnalytics.avgWaitTime}s
              </div>
              <div className="text-sm text-muted-foreground">Current Avg Wait Time</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-foreground" data-testid="text-current-commute-time">
                {currentAnalytics.avgCommuteTime} min
              </div>
              <div className="text-sm text-muted-foreground">Current Avg Commute</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600" data-testid="text-current-co2">
                {currentAnalytics.co2Emissions}kg
              </div>
              <div className="text-sm text-muted-foreground">Daily CO2 Emissions</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600" data-testid="text-current-fuel">
                {currentAnalytics.fuelConsumption}L
              </div>
              <div className="text-sm text-muted-foreground">Daily Fuel Consumption</div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Weekly Traffic Trends */}
      <AnalyticsChart
        type="weekly"
        title="Weekly Traffic Trends"
      />
      
      {/* Environmental Impact */}
      <Card data-testid="card-environmental-impact">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-green-600" />
            Environmental Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <div className="text-3xl font-bold text-green-600">25%</div>
              <div className="text-sm text-muted-foreground mt-2">Emission Reduction</div>
              <div className="text-xs text-green-600 mt-1">600kg CO2 saved daily</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">205L</div>
              <div className="text-sm text-muted-foreground mt-2">Fuel Saved Daily</div>
              <div className="text-xs text-blue-600 mt-1">Equivalent to 24% reduction</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">142</div>
              <div className="text-sm text-muted-foreground mt-2">Trees Equivalent</div>
              <div className="text-xs text-purple-600 mt-1">CO2 absorption per year</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
