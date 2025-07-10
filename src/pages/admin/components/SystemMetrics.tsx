import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminMetrics } from "../hooks/useAdminData";
import { Skeleton } from "@/components/ui/skeleton";

export const SystemMetrics = () => {
  const { systemMetrics } = useAdminMetrics();
  const isLoading = !systemMetrics || systemMetrics.length === 0;

  return (
    <Card className="bg-gradient-to-br from-card to-card/50 border-border/30">
      <CardHeader>
        <CardTitle>System Metrics</CardTitle>
        <CardDescription>Real-time system performance indicators</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="bg-gradient-to-br from-background to-background/50 border-border/30 animate-pulse">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Skeleton className="h-4 w-24 mb-2 rounded" />
                      <Skeleton className="h-8 w-16 rounded" />
                    </div>
                    <Skeleton className="h-3 w-3 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : systemMetrics.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground col-span-3">
              <span className="text-2xl font-bold">0%</span>
              <span>No system metrics data</span>
            </div>
          ) : (
            systemMetrics.map((metric, index) => (
              <Card 
                key={index} 
                className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-background to-background/50 border-border/30"
                onClick={() => console.log("System metric clicked:", metric.metric)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{metric.metric}</p>
                      <p className="text-2xl font-bold">{metric.value ?? 0}%</p>
                    </div>
                    <div className={`h-3 w-3 rounded-full ${
                      metric.value<50 ? "bg-green-500" :
                      metric.value<80 ? "bg-yellow-500" : "bg-red-500"
                    }`} />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
