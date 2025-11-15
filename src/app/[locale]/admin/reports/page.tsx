"use client";

import { AdminHeader } from "@/components/admin";
import { BarChart3 } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <AdminHeader
        title="Báo cáo"
        description="Xem các báo cáo chi tiết về hoạt động của hệ thống"
      />

      <div className="p-6">
        <div className="flex items-center justify-center h-[400px] border rounded-lg ">
          <div className="text-center space-y-4">
            <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground" />
            <div>
              <h3 className="font-semibold text-lg">
                Tính năng đang phát triển
              </h3>
              <p className="text-sm text-muted-foreground">
                Chức năng báo cáo sẽ sớm được cập nhật
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
