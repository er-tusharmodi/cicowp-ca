"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Users, FolderOpen, TrendingUp, Search } from "lucide-react";

interface AnalyticsData {
  stats: {
    todayVisitors: number;
    weekVisitors: number;
    monthVisitors: number;
    totalCases: number;
    casesByStatus: Array<{ _id: string; count: number }>;
  };
  charts: {
    dailyVisitors: Array<{ _id: string; count: number }>;
    topPages: Array<{ _id: string; count: number }>;
  };
  recentSearches: Array<{ timestamp: string; ip: string }>;
}

export default function AdminDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/analytics");
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-3">
                <div className="h-4 bg-muted rounded w-24" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              Failed to load analytics data
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statCards = [
    {
      title: "Today Visitors",
      value: data.stats.todayVisitors,
      icon: Users,
      description: "Visitors today",
    },
    {
      title: "Weekly Visitors",
      value: data.stats.weekVisitors,
      icon: TrendingUp,
      description: "Last 7 days",
    },
    {
      title: "Monthly Visitors",
      value: data.stats.monthVisitors,
      icon: TrendingUp,
      description: "Last 30 days",
    },
    {
      title: "Total Cases",
      value: data.stats.totalCases,
      icon: FolderOpen,
      description: "All time",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your system analytics and statistics
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="animate-in">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {stat.value.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Daily Visitors Chart */}
        <Card className="animate-in">
          <CardHeader>
            <CardTitle>Daily Visitors</CardTitle>
            <CardDescription>
              Visitor traffic for the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.charts.dailyVisitors}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="_id"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) =>
                    new Date(value).getDate().toString()
                  }
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-CA", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Pages Chart */}
        <Card className="animate-in">
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
            <CardDescription>Most visited pages this month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.charts.topPages}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="_id"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Cases by Status */}
      <Card className="animate-in">
        <CardHeader>
          <CardTitle>Cases by Status</CardTitle>
          <CardDescription>
            Distribution of cases across statuses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.stats.casesByStatus.map((status) => (
              <div
                key={status._id}
                className="p-4 bg-muted rounded-lg text-center"
              >
                <div className="text-2xl font-bold">{status.count}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {status._id}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Searches */}
      <Card className="animate-in">
        <CardHeader>
          <CardTitle>Recent Searches</CardTitle>
          <CardDescription>
            Latest status check searches (last 7 days)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.recentSearches.length > 0 ? (
            <div className="space-y-2">
              {data.recentSearches.map((search, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-mono">{search.ip}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(search.timestamp).toLocaleString("en-CA")}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No searches recorded yet
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
