"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  Users,
  FileText,
  TrendingUp,
  DollarSign,
  Eye,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getAccountFromStorage } from "@/lib/utils/auth-utils";
import { cn } from "@/lib/utils/utils";

interface DashboardStats {
  totalProperties: number;
  activeContracts: number;
  pendingRequests: number;
  monthlyRevenue: number;
  occupancyRate: number;
  viewsThisMonth: number;
}

interface RecentActivity {
  id: string;
  type: "request" | "payment" | "contract" | "view";
  title: string;
  description: string;
  timestamp: Date;
  status?: "pending" | "completed" | "failed";
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("");
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    activeContracts: 0,
    pendingRequests: 0,
    monthlyRevenue: 0,
    occupancyRate: 0,
    viewsThisMonth: 0,
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(
    []
  );

  useEffect(() => {
    const account = getAccountFromStorage();
    if (account) {
      setUserRole(account.roles?.[0] || "TENANT");
    }

    // Load dashboard data
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // TODO: Call API to get dashboard stats
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data
      setStats({
        totalProperties: 5,
        activeContracts: 8,
        pendingRequests: 3,
        monthlyRevenue: 45000000,
        occupancyRate: 85,
        viewsThisMonth: 234,
      });

      setRecentActivities([
        {
          id: "1",
          type: "request",
          title: "Yêu cầu thuê mới",
          description: "Căn hộ Vinhomes Central Park - Studio",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          status: "pending",
        },
        {
          id: "2",
          type: "payment",
          title: "Thanh toán tiền thuê",
          description: "Căn hộ Times City - T1101",
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
          status: "completed",
        },
        {
          id: "3",
          type: "contract",
          title: "Hợp đồng sắp hết hạn",
          description: "Căn hộ Royal City - R502",
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          status: "pending",
        },
        {
          id: "4",
          type: "view",
          title: "Lượt xem tăng cao",
          description: "Căn hộ Masteri Thảo Điền - M2102",
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          status: "completed",
        },
      ]);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if not landlord
  if (userRole && userRole !== "LANDLORD") {
    return (
      <Card className="border-none shadow-sm">
        <CardContent className="py-12 text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Không có quyền truy cập
          </h3>
          <p className="text-gray-600 mb-6">
            Dashboard chỉ dành cho chủ nhà. Vui lòng liên hệ quản trị viên nếu
            bạn muốn trở thành chủ nhà.
          </p>
          <Link href="/profile">
            <Button>Quay lại trang cá nhân</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getActivityIcon = (type: RecentActivity["type"]) => {
    switch (type) {
      case "request":
        return <FileText className="w-5 h-5" />;
      case "payment":
        return <DollarSign className="w-5 h-5" />;
      case "contract":
        return <FileText className="w-5 h-5" />;
      case "view":
        return <Eye className="w-5 h-5" />;
    }
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return "Vừa xong";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} phút trước`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} giờ trước`;
    return `${Math.floor(seconds / 86400)} ngày trước`;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-primary mt-2 font-bold text-3xl">Dashboard</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Properties */}
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow bg-primary-foreground">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tổng tài sản</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalProperties}
                </p>
                <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +2 tháng này
                </p>
              </div>
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                <Building2 className="w-7 h-7 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Contracts */}
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow bg-primary-foreground">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  Hợp đồng đang hoạt động
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.activeContracts}
                </p>
                <Link href="/contracts">
                  <Button variant="link" className="p-0 h-auto text-xs mt-2">
                    Xem chi tiết →
                  </Button>
                </Link>
              </div>
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                <FileText className="w-7 h-7 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Requests */}
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow bg-primary-foreground">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Yêu cầu chờ xử lý</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.pendingRequests}
                </p>
                <Link href="/contracts">
                  <Button variant="link" className="p-0 h-auto text-xs mt-2">
                    Xem ngay →
                  </Button>
                </Link>
              </div>
              <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center">
                <AlertCircle className="w-7 h-7 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Revenue */}
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow bg-primary-foreground">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  Doanh thu tháng này
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.monthlyRevenue)}
                </p>
                <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +12% so với tháng trước
                </p>
              </div>
              <div className="w-14 h-14 rounded-full bg-[#DCBB87]/20 flex items-center justify-center">
                <DollarSign className="w-7 h-7 text-[#DCBB87]" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Occupancy Rate */}
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow bg-primary-foreground">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tỷ lệ lấp đầy</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.occupancyRate}%
                </p>
                <div className="w-32 h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{ width: `${stats.occupancyRate}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center">
                <Users className="w-7 h-7 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Views This Month */}
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow bg-primary-foreground">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Lượt xem tháng này</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.viewsThisMonth}
                </p>
                <p className="text-xs text-blue-600 mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +18% so với tháng trước
                </p>
              </div>
              <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center">
                <Eye className="w-7 h-7 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card className="border-none shadow-sm bg-primary-foreground">
        <CardHeader>
          <CardTitle>Hoạt động gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    activity.type === "request" &&
                      "bg-orange-100 text-orange-600",
                    activity.type === "payment" &&
                      "bg-green-100 text-green-600",
                    activity.type === "contract" && "bg-blue-100 text-blue-600",
                    activity.type === "view" && "bg-purple-100 text-purple-600"
                  )}
                >
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {activity.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {activity.description}
                      </p>
                    </div>
                    {activity.status && (
                      <span
                        className={cn(
                          "text-xs px-2 py-1 rounded-full",
                          activity.status === "pending" &&
                            "bg-yellow-100 text-yellow-700",
                          activity.status === "completed" &&
                            "bg-green-100 text-green-700",
                          activity.status === "failed" &&
                            "bg-red-100 text-red-700"
                        )}
                      >
                        {activity.status === "pending" && "Chờ xử lý"}
                        {activity.status === "completed" && "Hoàn thành"}
                        {activity.status === "failed" && "Thất bại"}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {getTimeAgo(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-none shadow-sm bg-primary-foreground">
        <CardHeader>
          <CardTitle>Thao tác nhanh</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/my-properties/new">
              <Button
                variant="outline"
                className="w-full h-auto py-4 flex-col gap-2 text-primary"
              >
                <Building2 className="w-6 h-6" />
                <span>Đăng tài sản mới</span>
              </Button>
            </Link>
            <Link href="/contracts">
              <Button
                variant="outline"
                className="w-full h-auto py-4 flex-col gap-2 text-primary"
              >
                <FileText className="w-6 h-6" />
                <span>Quản lý hợp đồng</span>
              </Button>
            </Link>
            <Link href="/my-properties">
              <Button
                variant="outline"
                className="w-full h-auto py-4 flex-col gap-2"
              >
                <Eye className="w-6 h-6" />
                <span>Xem tài sản</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
