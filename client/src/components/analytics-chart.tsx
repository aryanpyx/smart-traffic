import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface AnalyticsChartProps {
  type: "performance" | "weekly" | "comparison";
  data?: any[];
  title: string;
}

export function AnalyticsChart({ type, data, title }: AnalyticsChartProps) {
  const performanceData = [
    { day: 'Mon', beforeAI: 68, afterAI: 45 },
    { day: 'Tue', beforeAI: 72, afterAI: 48 },
    { day: 'Wed', beforeAI: 65, afterAI: 42 },
    { day: 'Thu', beforeAI: 75, afterAI: 50 },
    { day: 'Fri', beforeAI: 80, afterAI: 52 },
    { day: 'Sat', beforeAI: 58, afterAI: 38 },
    { day: 'Sun', beforeAI: 62, afterAI: 40 },
  ];

  const weeklyData = [
    { time: '6AM', trafficVolume: 150, avgSpeed: 45 },
    { time: '9AM', trafficVolume: 450, avgSpeed: 25 },
    { time: '12PM', trafficVolume: 300, avgSpeed: 35 },
    { time: '3PM', trafficVolume: 280, avgSpeed: 38 },
    { time: '6PM', trafficVolume: 520, avgSpeed: 15 },
    { time: '9PM', trafficVolume: 200, avgSpeed: 42 },
    { time: '12AM', trafficVolume: 80, avgSpeed: 48 },
  ];

  const renderChart = () => {
    switch (type) {
      case "performance":
        return (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="beforeAI" stroke="#ef4444" name="Before AI" strokeWidth={2} />
              <Line type="monotone" dataKey="afterAI" stroke="#10b981" name="After AI" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case "weekly":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="trafficVolume" fill="hsl(var(--primary))" name="Traffic Volume" />
              <Line yAxisId="right" type="monotone" dataKey="avgSpeed" stroke="#10b981" name="Avg Speed (km/h)" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      default:
        return (
          <div className="h-48 flex items-center justify-center text-muted-foreground">
            Chart data loading...
          </div>
        );
    }
  };

  return (
    <Card data-testid={`card-analytics-${type}`}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  );
}
