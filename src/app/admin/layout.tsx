"use client";

import Header from "@/components/header";
import { AdminSidebar } from "@/components/admin";
import { RoleGuard } from "@/components/auth/role-guard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard
      allowedRoles={["ADMIN"]}
      redirectTo="/access-denied"
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground">
              Đang kiểm tra quyền truy cập...
            </p>
          </div>
        </div>
      }
    >
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex flex-1">
          <AdminSidebar />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </RoleGuard>
  );
}
