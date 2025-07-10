import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useAdminMetrics } from "../hooks/useAdminData";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpRight, ArrowDownRight, Users, Flag, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";

const donutColors = ["#22c55e", "#ef4444", "#f59e0b", "#6b7280"];
const donutLabels = ["Approved", "Flagged", "Pending", "Deleted"];

function getPercentChange(current: number, previous: number) {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

export const Analytics = () => {
  const { userActivityData, contentModerationData } = useAdminMetrics();
  const [range, setRange] = useState<'week' | 'month' | 'year'>('month');

  // Simulate loading state
  const loading = !userActivityData || userActivityData.length === 0;

  // Filter data by range (simulate for now)
  const filteredData = userActivityData;

  // Stat summary (simulate with first/last data)
  const totalActive = filteredData.length ? filteredData[filteredData.length - 1].activeUsers : 0;
  const prevActive = filteredData.length > 1 ? filteredData[filteredData.length - 2].activeUsers : 0;
  const totalNew = filteredData.length ? filteredData[filteredData.length - 1].newUsers : 0;
  const prevNew = filteredData.length > 1 ? filteredData[filteredData.length - 2].newUsers : 0;
  const percentActive = getPercentChange(totalActive, prevActive);
  const percentNew = getPercentChange(totalNew, prevNew);

  // Top 3 days
  const topDays = [...filteredData].sort((a, b) => b.activeUsers - a.activeUsers).slice(0, 3);

  // Content moderation totals
  const totalModeration = contentModerationData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="space-y-8">
      {/* Stat summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="bg-gradient-to-br from-card to-card/50 border-border/30 animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-24 mb-2 rounded" />
                <Skeleton className="h-4 w-32 rounded" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <Card className="bg-gradient-to-br from-card to-card/50 border-border/30 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2"><Users className="h-4 w-4 text-primary" />Active Users</CardTitle>
                {percentActive >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalActive}</div>
                <p className="text-xs text-muted-foreground">
                  {percentActive >= 0 ? '+' : ''}{percentActive.toFixed(1)}% from prev
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-card to-card/50 border-border/30 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />New Users</CardTitle>
                {percentNew >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalNew}</div>
                <p className="text-xs text-muted-foreground">
                  {percentNew >= 0 ? '+' : ''}{percentNew.toFixed(1)}% from prev
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-card to-card/50 border-border/30 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2"><Flag className="h-4 w-4 text-red-500" />Flagged Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{contentModerationData.find(d => d.name === 'Flagged')?.value ?? 0}</div>
                <p className="text-xs text-muted-foreground">of {totalModeration} total</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-card to-card/50 border-border/30 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2"><Clock className="h-4 w-4 text-yellow-500" />Pending Review</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{contentModerationData.find(d => d.name === 'Pending')?.value ?? 0}</div>
                <p className="text-xs text-muted-foreground">of {totalModeration} total</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Chart and donut row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Activity Chart */}
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-card to-card/50 border-border/30">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>User Activity Trends</CardTitle>
              <CardDescription>Daily active users and new registrations</CardDescription>
            </div>
            <div className="flex gap-2">
              {['week', 'month', 'year'].map(opt => (
                <button
                  key={opt}
                  className={`px-2 py-1 rounded text-xs font-medium border transition-colors ${range === opt ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border text-muted-foreground hover:bg-accent'}`}
                  onClick={() => setRange(opt as typeof range)}
                >
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[300px] flex items-center justify-center"><Skeleton className="h-48 w-full rounded" /></div>
            ) : filteredData.length === 0 ? (
              <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground">
                <Users className="h-10 w-10 mb-2" />
                <span>No activity data</span>
              </div>
            ) : (
              <ChartContainer
                config={{
                  activeUsers: {
                    label: "Active Users",
                    color: "#3b82f6",
                  },
                  newUsers: {
                    label: "New Users",
                    color: "#22c55e",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={filteredData} margin={{ top: 16, right: 24, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend verticalAlign="top" height={36} />
                    <Line type="monotone" dataKey="activeUsers" stroke="#3b82f6" fillOpacity={1} fill="url(#colorActive)" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 6 }} name="Active Users" />
                    <Line type="monotone" dataKey="newUsers" stroke="#22c55e" fillOpacity={1} fill="url(#colorNew)" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 6 }} name="New Users" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
            {/* Top 3 days */}
            {!loading && filteredData.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs font-semibold text-muted-foreground">Top 3 days:</span>
                {topDays.map((d, i) => (
                  <span key={i} className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-medium">
                    {d.date}: {d.activeUsers} users
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Donut Chart for Content Moderation */}
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-card to-card/50 border-border/30">
          <CardHeader>
            <CardTitle>Content Moderation</CardTitle>
            <CardDescription>Distribution of content status</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[300px] flex items-center justify-center"><Skeleton className="h-48 w-full rounded" /></div>
            ) : contentModerationData.length === 0 ? (
              <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground">
                <Flag className="h-10 w-10 mb-2" />
                <span>No moderation data</span>
              </div>
            ) : (
              <ChartContainer
                config={{
                  Approved: { label: "Approved", color: "#22c55e" },
                  Flagged: { label: "Flagged", color: "#ef4444" },
                  Pending: { label: "Pending", color: "#f59e0b" },
                  Deleted: { label: "Deleted", color: "#6b7280" },
                }}
                className="h-[300px]"
              >
                <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                  <ResponsiveContainer width={220} height={220}>
                    <PieChart>
                      <Pie
                        data={contentModerationData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        fill="#8884d8"
                        dataKey="value"
                        isAnimationActive
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {contentModerationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={donutColors[index % donutColors.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Custom legend */}
                  <div className="flex flex-col gap-2">
                    {contentModerationData.map((entry, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <span className="inline-block w-3 h-3 rounded-full" style={{ background: donutColors[i % donutColors.length] }} />
                        <span className="font-medium">{entry.name}</span>
                        <span className="ml-2 text-muted-foreground">{entry.value}</span>
                        <span className="ml-2 text-xs">{((entry.value / totalModeration) * 100).toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
