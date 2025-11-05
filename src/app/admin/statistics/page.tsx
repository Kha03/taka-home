"use client";

import { StatisticsOverviewCard, AdminHeader } from "@/components/admin";
import { useStatisticsOverview } from "@/hooks/use-statistics";
import { Activity, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StatisticsPage() {
  const { statistics, loading, error, refetch } = useStatisticsOverview();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="space-y-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <AdminHeader
          title="Thống kê tổng quan"
          description="Xem tổng quan về hoạt động của hệ thống"
        />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
            <div>
              <h3 className="font-semibold text-lg">Không thể tải dữ liệu</h3>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
            </div>
            <Button onClick={refetch} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Thử lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!statistics) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <AdminHeader
        title="Thống kê tổng quan"
        description="Xem tổng quan về hoạt động của hệ thống"
      />

      <div className="p-6 space-y-6">
        {/* Statistics Cards */}
        <StatisticsOverviewCard statistics={statistics} />
      </div>
    </div>
  );
}
