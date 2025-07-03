
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminMetrics } from "../hooks/useAdminData";

export const SystemMetrics = () => {
  const { systemMetrics } = useAdminMetrics();

  return (
    <Card className="bg-gradient-to-br from-card to-card/50 border-border/30">
      <CardHeader>
        <CardTitle>System Metrics</CardTitle>
        <CardDescription>Real-time system performance indicators</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {systemMetrics.map((metric, index) => (
            <Card 
              key={index} 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-background to-background/50 border-border/30"
              onClick={() => console.log("System metric clicked:", metric.metric)}
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{metric.metric}</p>
                    <p className="text-2xl font-bold">{metric.value}%</p>
                  </div>
                  <div className={`h-3 w-3 rounded-full ${
                    metric.value<50 ? "bg-green-500" :
                    metric.value<80 ? "bg-yellow-500" : "bg-red-500"
                  }`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
