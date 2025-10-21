"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils/utils";
import {
  User,
  LayoutDashboard,
  Building2,
  FileText,
  Wallet,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAccountFromStorage } from "@/lib/utils/auth-utils";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles: ("TENANT" | "LANDLORD")[];
}

// Định nghĩa menu items cho từng role
const SIDEBAR_ITEMS: SidebarItem[] = [
  // Chung cho cả 2 role
  {
    label: "Thông tin cá nhân",
    href: "/profile",
    icon: <User className="w-5 h-5" />,
    roles: ["TENANT", "LANDLORD"],
  },
  // Chỉ cho Landlord
  {
    label: "Dashboard",
    href: "/profile/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    roles: ["LANDLORD"],
  },
  // Chung cho cả 2 role

  {
    label: "Ví điện tử",
    href: "/profile/wallet",
    icon: <Wallet className="w-5 h-5" />,
    roles: ["TENANT", "LANDLORD"],
  },
  {
    label: "Thông báo",
    href: "/profile/notifications",
    icon: <Bell className="w-5 h-5" />,
    roles: ["TENANT", "LANDLORD"],
  },
  {
    label: "Cài đặt",
    href: "/profile/settings",
    icon: <Settings className="w-5 h-5" />,
    roles: ["TENANT", "LANDLORD"],
  },
];

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<"TENANT" | "LANDLORD">("TENANT");
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const account = getAccountFromStorage();
    if (account) {
      // Lấy role đầu tiên của user, filter out ADMIN
      const role =
        account.roles?.find((r) => r === "LANDLORD" || r === "TENANT") ||
        "TENANT";
      setUserRole(role);
      setUserName(account.user?.fullName || account.email);
    }
  }, []);

  // Filter menu items dựa trên role
  const filteredMenuItems = SIDEBAR_ITEMS.filter((item) =>
    item.roles.includes(userRole)
  );

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("account_info");
    // Clear cookie
    document.cookie =
      "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    // Redirect to home
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-[#FFF7E9]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              {/* User Info Header */}
              <div className="text-center mb-6 pb-6 border-b">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#DCBB87] to-[#B8935A] mx-auto mb-3 flex items-center justify-center text-white text-2xl font-bold">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <h3 className="font-bold text-lg text-gray-900">{userName}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {userRole === "LANDLORD" ? "Chủ nhà" : "Người thuê"}
                </p>
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-1">
                {filteredMenuItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link key={item.href} href={item.href}>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start gap-3 text-gray-600 hover:text-accent hover:bg-accent/10 mb-1",
                          isActive && "text-accent bg-accent/10 font-semibold "
                        )}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Button>
                    </Link>
                  );
                })}

                {/* Logout Button */}
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 mt-4"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5" />
                  <span>Đăng xuất</span>
                </Button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9">{children}</main>
        </div>
      </div>
    </div>
  );
}
