"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/utils";
import { useRole } from "@/hooks/use-role";
import { useAuth } from "@/contexts/auth-context";

export function MainMenu() {
  const pathname = usePathname();
  const { isLandlord, isAdmin } = useRole();
  const { isAuthenticated } = useAuth();

  const menuItems = [
    {
      label: "Trang chủ",
      href: "/",
      show: true,
    },
    {
      label: "Hợp đồng của tôi",
      href: "/contracts",
      show: isAuthenticated, // Cả Tenant và Landlord đều có thể xem
    },
    {
      label: "Bất động sản của tôi",
      href: "/my-properties",
      show: isLandlord, // Chỉ Landlord
    },
    {
      label: "Yêu cầu thuê",
      href: "/rental-requests",
      show: isLandlord, // Chỉ Landlord
    },
    {
      label: "Duyệt bất động sản",
      href: "/property-approval",
      show: isAdmin, // Chỉ Admin
    },
  ];

  return (
    <nav className="flex gap-8 items-center text-[16px] font-medium text-primary">
      {menuItems
        .filter((item) => item.show)
        .map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              className={cn(
                "p-2 relative group cursor-pointer flex items-center font-medium hover:text-primary/80",
                // Only transition specific properties to avoid performance issues
                "transition-colors duration-200",
                isActive && "text-primary"
              )}
              style={
                isActive
                  ? {
                      textShadow:
                        "0.3px 0 0 currentColor, -0.3px 0 0 currentColor",
                    }
                  : undefined
              }
            >
              {item.label}
              {/* Optimized underline animation */}
              <div
                className={cn(
                  "absolute bottom-[-6px] left-1/2 h-0.5 bg-primary rounded-full",
                  // Use transform for better performance than width animation
                  "origin-center transition-transform duration-200 ease-out",
                  isActive
                    ? "w-full scale-x-100 -translate-x-1/2"
                    : "w-full scale-x-0 -translate-x-1/2"
                )}
              ></div>
            </Link>
          );
        })}
    </nav>
  );
}
