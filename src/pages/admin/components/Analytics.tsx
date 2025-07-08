import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useAdminMetrics } from "../hooks/useAdminData";

export const Analytics = () => {
  const { userActivityData, contentModerationData } = useAdminMetrics();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-card to-card/50 border-border/30">
          <CardHeader>
            <CardTitle>User Activity Trends</CardTitle>
            <CardDescription>Daily active users and new registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                activeUsers: {
                  label: "Active Users",
                  color: "hsl(var(--chart-1))",
                },
                newUsers: {
                  label: "New Users",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userActivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area type="monotone" dataKey="activeUsers" stackId="1" stroke="var(--color-activeUsers)" fill="var(--color-activeUsers)" />
                  <Area type="monotone" dataKey="newUsers" stackId="1" stroke="var(--color-newUsers)" fill="var(--color-newUsers)" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-card to-card/50 border-border/30">
          <CardHeader>
            <CardTitle>Content Moderation</CardTitle>
            <CardDescription>Distribution of content status</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                approved: { label: "Approved", color: "#22c55e" },
                flagged: { label: "Flagged", color: "#ef4444" },
                pending: { label: "Pending", color: "#f59e0b" },
                deleted: { label: "Deleted", color: "#6b7280" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={contentModerationData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {contentModerationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
