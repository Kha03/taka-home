"use client";

import { AdminHeader } from "@/components/admin";
import { Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <AdminHeader
        title="Cài đặt hệ thống"
        description="Quản lý cấu hình và cài đặt của hệ thống"
      />

      <div className="p-6">
        <div className="flex items-center justify-center h-[400px] border rounded-lg ">
          <div className="text-center space-y-4">
            <SettingsIcon className="h-16 w-16 mx-auto text-muted-foreground" />
            <div>
              <h3 className="font-semibold text-lg">
                Tính năng đang phát triển
              </h3>
              <p className="text-sm text-muted-foreground">
                Chức năng cài đặt sẽ sớm được cập nhật
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
