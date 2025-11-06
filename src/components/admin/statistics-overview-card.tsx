"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StatisticsOverview } from "@/lib/api/types";
import { Building2, Home, Users, TrendingUp, ArrowUpRight } from "lucide-react";

interface StatisticsOverviewCardProps {
  statistics: StatisticsOverview;
}

export function StatisticsOverviewCard({
  statistics,
}: StatisticsOverviewCardProps) {
  const statsCards = [
    {
      title: "Tổng số bất động sản",
      value: statistics.totalProperties,
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      darkBgColor: "dark:bg-blue-950",
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Tổng số phòng",
      value: statistics.totalRooms,
      icon: Home,
      color: "text-green-600",
      bgColor: "bg-green-100",
      darkBgColor: "dark:bg-green-950",
      trend: "+8%",
      trendUp: true,
    },
    {
      title: "BĐS đang cho thuê",
      value: statistics.propertiesForRent,
      icon: Building2,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      darkBgColor: "dark:bg-purple-950",
      trend: "+5%",
      trendUp: true,
    },
    {
      title: "Phòng đang cho thuê",
      value: statistics.roomsForRent,
      icon: Home,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      darkBgColor: "dark:bg-orange-950",
      trend: "+15%",
      trendUp: true,
    },
    {
      title: "BĐS mới tháng này",
      value: statistics.newPropertiesThisMonth,
      icon: TrendingUp,
      color: "text-teal-600",
      bgColor: "bg-teal-100",
      darkBgColor: "dark:bg-teal-950",
      trend: "Tháng này",
      trendUp: false,
    },
    {
      title: "Phòng mới tháng này",
      value: statistics.newRoomsThisMonth,
      icon: TrendingUp,
      color: "text-pink-600",
      bgColor: "bg-pink-100",
      darkBgColor: "dark:bg-pink-950",
      trend: "Tháng này",
      trendUp: false,
    },
    {
      title: "Tổng số người dùng",
      value: statistics.totalUsers,
      icon: Users,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
      darkBgColor: "dark:bg-indigo-950",
      trend: "+20%",
      trendUp: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {statsCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className="hover:shadow-lg transition-all gap-2 hover:scale-[1.02] duration-200 bg-primary-foreground"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div
                className={`p-2 rounded-lg ${stat.bgColor} ${stat.darkBgColor}`}
              >
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div className="text-3xl font-bold">{stat.value}</div>
                {stat.trendUp && (
                  <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    {stat.trend}
                  </div>
                )}
                {!stat.trendUp && (
                  <div className="text-xs text-muted-foreground">
                    {stat.trend}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
