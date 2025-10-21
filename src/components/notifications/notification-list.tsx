"use client";

/**
 * Notification List Component
 * Hiển thị danh sách thông báo
 */

import { Bell, CheckCircle2 } from "lucide-react";
import { NotificationItem } from "./notification-item";
import { useNotifications } from "@/hooks/use-notifications";
import type { NotificationResponse } from "@/lib/api/types";
import { Button } from "../ui/button";
import { LoadingSpinner } from "../ui/loading-spinner";

export interface NotificationListProps {
  userId?: string | null;
  autoRefresh?: boolean;
  refreshInterval?: number;
  onNotificationClick?: (notification: NotificationResponse) => void;
  className?: string;
}

export function NotificationList({
  userId,
  autoRefresh = true,
  refreshInterval = 30000,
  onNotificationClick,
  className = "",
}: NotificationListProps) {
  const {
    notifications,
    pendingCount,
    loading,
    error,
    refetch,
    markAsCompleted,
    markAllAsCompleted,
    deleteNotification,
  } = useNotifications({
    userId: userId || undefined,
    autoRefresh,
    refreshInterval,
  });

  const handleNotificationClick = (notification: NotificationResponse) => {
    // Đánh dấu đã hoàn thành khi click nếu đang pending
    if (notification.status === "PENDING") {
      markAsCompleted(notification.id);
    }

    // Gọi callback nếu có
    onNotificationClick?.(notification);
  };

  if (loading && notifications.length === 0) {
    return (
      <div className={`p-8 text-center ${className}`}>
        <LoadingSpinner text="Đang tải thông báo..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-8 text-center ${className}`}>
        <Bell className="h-12 w-12 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-red-500 mb-4">{error}</p>
        <Button onClick={refetch}>Thử lại</Button>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className={`p-8 text-center ${className}`}>
        <Bell className="h-12 w-12 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-500">Không có thông báo nào</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header with actions */}
      {pendingCount > 0 && (
        <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {pendingCount} thông báo
          </span>
          <Button
            variant={"outline"}
            onClick={markAllAsCompleted}
            className="flex items-center gap-1 px-2 py-1  text-primary text-xs hover:bg-primary/10"
          >
            <CheckCircle2 className="h-2 w-2" />
            Đã đọc tất cả
          </Button>
        </div>
      )}

      {/* Notification list */}
      <div className="divide-y divide-gray-200">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onMarkAsCompleted={markAsCompleted}
            onDelete={deleteNotification}
            className="hover:bg-gray-50 cursor-pointer"
            onClick={() => handleNotificationClick(notification)}
          />
        ))}
      </div>

      {/* Load more or refresh button */}
      <div className="p-4 border-t bg-gray-50 text-center">
        <Button
          variant={"outline"}
          onClick={refetch}
          disabled={loading}
          className="text-sm w-full text-accent hover:text-accent border-accent hover:bg-accent/20"
        >
          {loading ? "Đang tải..." : "Làm mới"}
        </Button>
      </div>
    </div>
  );
}
