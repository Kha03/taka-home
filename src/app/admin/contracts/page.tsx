"use client";

import { AdminHeader } from "@/components/admin";
import { FileText } from "lucide-react";

export default function ContractsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <AdminHeader
        title="Quản lý hợp đồng"
        description="Xem và quản lý các hợp đồng thuê trong hệ thống"
      />

      <div className="p-6">
        <div className="flex items-center justify-center h-[400px] border rounded-lg">
          <div className="text-center space-y-4">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
            <div>
              <h3 className="font-semibold text-lg">
                Tính năng đang phát triển
              </h3>
              <p className="text-sm text-muted-foreground">
                Chức năng quản lý hợp đồng sẽ sớm được cập nhật
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
