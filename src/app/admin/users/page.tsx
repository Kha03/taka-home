"use client";

import { AdminHeader } from "@/components/admin";
import { Users as UsersIcon } from "lucide-react";

export default function UsersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <AdminHeader
        title="Quản lý người dùng"
        description="Xem và quản lý thông tin người dùng trong hệ thống"
      />

      <div className="p-6">
        <div className="flex items-center justify-center h-[400px] border rounded-lg ">
          <div className="text-center space-y-4">
            <UsersIcon className="h-16 w-16 mx-auto text-muted-foreground" />
            <div>
              <h3 className="font-semibold text-lg">
                Tính năng đang phát triển
              </h3>
              <p className="text-sm text-muted-foreground">
                Chức năng quản lý người dùng sẽ sớm được cập nhật
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
