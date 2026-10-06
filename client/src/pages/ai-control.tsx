import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Bot, RefreshCw, CheckCircle, Clock, AlertCircle } from "lucide-react";
import type { AiRecommendation } from "@shared/schema";

export default function AIControl() {
  const [selectedJunction, setSelectedJunction] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: recommendations = [], isLoading } = useQuery<AiRecommendation[]>({
    queryKey: ['/api/ai/recommendations'],
  });

  const applyRecommendationMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('PUT', `/api/ai/recommendations/${id}/apply`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Recommendation Applied",
        description: "Signal timing has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/ai/recommendations'] });
      queryClient.invalidateQueries({ queryKey: ['/api/junctions'] });
    },
    onError: () => {
      toast({
        title: "Failed to Apply",
        description: "Could not apply the recommendation. Please try again.",
        variant: "destructive"
      });
    }
  });

  const refreshPredictionsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/ai/predict', { junctionId: selectedJunction });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Predictions Refreshed",
        description: "AI predictions have been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/ai/recommendations'] });
    },
    onError: () => {
      toast({
        title: "Refresh Failed",
        description: "Could not refresh predictions. Please try again.",
        variant: "destructive"
      });
    }
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 2 }).map((_, i) => (
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-foreground" data-testid="text-page-title">AI Control Panel</h1>
          <p className="text-muted-foreground">Smart signal optimization recommendations</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-600 font-medium">AI Active</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Recommendations */}
        <Card data-testid="card-recommendations">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              Current Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                <p>No active recommendations</p>
              </div>
            ) : (
              recommendations.slice(0, 5).map((recommendation) => (
                <div
                  key={recommendation.id}
                  className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg"
                  data-testid={`recommendation-${recommendation.id}`}
                >
                  <div>
                    <p className="font-medium text-sm">Junction {recommendation.junctionId.slice(0, 8)}</p>
                    <p className="text-xs text-muted-foreground">{recommendation.recommendation}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs text-muted-foreground">Confidence:</span>
                      <span className="text-xs font-medium">{(recommendation.confidenceScore * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                  {recommendation.applied ? (
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Applied
                    </Badge>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => applyRecommendationMutation.mutate(recommendation.id)}
                      disabled={applyRecommendationMutation.isPending}
                      data-testid={`button-apply-${recommendation.id}`}
                    >
                      Apply
                    </Button>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
        
        {/* Prediction Model Status */}
        <Card data-testid="card-model-status">
          <CardHeader>
            <CardTitle>Prediction Model Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Model Accuracy</span>
              <div className="flex items-center space-x-2">
                <Progress value={94} className="w-24" />
                <span className="text-sm font-medium">94%</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Data Freshness</span>
              <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                2 min ago
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Next Update</span>
              <span className="text-sm font-medium">5:47 min</span>
            </div>
            
            <Button 
              className="w-full mt-4" 
              variant="outline"
              onClick={() => refreshPredictionsMutation.mutate()}
              disabled={refreshPredictionsMutation.isPending}
              data-testid="button-refresh-predictions"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshPredictionsMutation.isPending ? 'animate-spin' : ''}`} />
              {refreshPredictionsMutation.isPending ? 'Refreshing...' : 'Refresh Predictions'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Model Performance Metrics */}
      <Card data-testid="card-performance-metrics">
        <CardHeader>
          <CardTitle>AI Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">+23%</div>
              <div className="text-sm text-muted-foreground">Traffic Flow Improvement</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">-34%</div>
              <div className="text-sm text-muted-foreground">Wait Time Reduction</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">98.2%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
