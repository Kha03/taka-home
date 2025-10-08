"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function MainMenu() {
  const pathname = usePathname();

  const menuItems = [
    {
      label: "Trang chủ",
      href: "/",
    },
    {
      label: "Hợp đồng của tôi",
      href: "/contracts",
    },
    {
      label: "Bất động sản của tôi",
      href: "/my-properties",
    },
    {
      label: "Yêu cầu thuê",
      href: "/rental-requests",
    },
  ];

  return (
    <nav className="flex gap-8 items-center text-[16px] font-medium text-primary">
      {menuItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
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
