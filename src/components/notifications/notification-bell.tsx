"use client";

/**
 * Notification Bell Component
 * Hiển thị icon chuông thông báo với số lượng chưa đọc
 */

import { useState, useRef } from "react";
import { Bell } from "lucide-react";
import { NotificationList } from "./notification-list";
import { useNotifications } from "@/hooks/use-notifications";
import { getUserIdFromStorage } from "@/lib/utils/auth-utils";
import { cn } from "@/lib/utils/utils";
import { Button } from "@/components/ui/button";

export interface NotificationBellProps {
  className?: string;
  showBadge?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function NotificationBell({
  className = "",
  showBadge = true,
  autoRefresh = true,
  refreshInterval = 30000,
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const bellRef = useRef<HTMLButtonElement>(null);

  // Lấy userId từ localStorage
  const userId = getUserIdFromStorage();

  const { pendingCount } = useNotifications({
    userId: userId || undefined,
    autoRefresh,
    refreshInterval,
  });

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  const closeNotifications = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <Button
        variant={"golden"}
        ref={bellRef}
        size={"icon-sm"}
        onClick={toggleNotifications}
        className={cn("rounded-full", className)}
        aria-label="Thông báo"
      >
        <Bell className="text-xl" />

        {/* Badge */}
        {showBadge && pendingCount > 0 && (
          <span className="absolute top-[-4px] right-[-4px] w-5 h-5 px-1 flex items-center justify-center text-[12px] font-semibold text-white bg-[#FF0004] rounded-full">
            {pendingCount > 99 ? "99+" : pendingCount}
          </span>
        )}
      </Button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={closeNotifications} />

          {/* Notification Panel */}
          <div className="absolute right-0 mt-2 w-80 max-w-sm bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h3 className="text-sm font-medium text-gray-900">Thông báo</h3>
            </div>

            {/* Notification List */}
            <div className="overflow-y-auto max-h-80">
              <NotificationList
                userId={userId || undefined}
                autoRefresh={false} // Không auto refresh trong dropdown
                onNotificationClick={closeNotifications}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
