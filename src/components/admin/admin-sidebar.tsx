"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/utils";
import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  Settings,
  BarChart3,
  Home,
  ChevronRight,
} from "lucide-react";

const menuItems = [
  {
    title: "Tổng quan",
    href: "/admin/statistics",
    icon: LayoutDashboard,
    description: "Dashboard và thống kê",
  },
  {
    title: "Người dùng",
    href: "/admin/users",
    icon: Users,
    description: "Quản lý người dùng",
  },
  {
    title: "Bất động sản",
    href: "/admin/property-approval",
    icon: Building2,
    description: "Duyệt BĐS",
  },
  {
    title: "Hợp đồng",
    href: "/admin/contracts",
    icon: FileText,
    description: "Quản lý hợp đồng",
  },
  {
    title: "Báo cáo",
    href: "/admin/reports",
    icon: BarChart3,
    description: "Xem báo cáo",
  },
  {
    title: "Cài đặt",
    href: "/admin/settings",
    icon: Settings,
    description: "Cấu hình hệ thống",
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 border-r  min-h-screen">
      <div className="sticky top-0 p-6 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20">
            <div className="p-2 rounded-lg bg-primary">
              <Home className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-bold text-base">Quản trị</h2>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Menu
          </p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all relative",
                  "hover:bg-accent hover:shadow-sm",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{item.title}</div>
                  <div
                    className={cn(
                      "text-xs truncate",
                      isActive
                        ? "text-primary-foreground/80"
                        : "text-muted-foreground"
                    )}
                  >
                    {item.description}
                  </div>
                </div>
                <ChevronRight
                  className={cn(
                    "h-4 w-4 flex-shrink-0 transition-transform",
                    isActive
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  )}
                />
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
