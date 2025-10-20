"use client";

/**
 * Notification Item Component
 * Hiển thị một notification đơn lẻ
 */

import {
  Bell,
  CreditCard,
  FileText,
  Home,
  AlertCircle,
  X,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils/utils";
import type { NotificationResponse } from "@/lib/api/types";

export interface NotificationItemProps {
  notification: NotificationResponse;
  onMarkAsCompleted?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: () => void;
  className?: string;
}

const getNotificationIcon = (type: NotificationResponse["type"]) => {
  switch (type) {
    case "PAYMENT":
      return <CreditCard className="h-5 w-5 text-green-500" />;
    case "CONTRACT":
      return <FileText className="h-5 w-5 text-blue-500" />;
    case "GENERAL":
      return <Home className="h-5 w-5 text-purple-500" />;
    case "PENALTY":
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    case "SYSTEM":
    default:
      return <Bell className="h-5 w-5 text-gray-500" />;
  }
};

const getNotificationColor = (type: NotificationResponse["type"]) => {
  switch (type) {
    case "PAYMENT":
      return "border-l-green-500";
    case "CONTRACT":
      return "border-l-blue-500";
    case "GENERAL":
      return "border-l-purple-500";
    case "PENALTY":
      return "border-l-red-500";
    case "SYSTEM":
    default:
      return "border-l-gray-500";
  }
};

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "Vừa xong";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} phút trước`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} giờ trước`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ngày trước`;
  } else {
    return date.toLocaleDateString("vi-VN");
  }
};

export function NotificationItem({
  notification,
  onMarkAsCompleted,
  onDelete,
  onClick,
  className,
}: NotificationItemProps) {
  const isPending = notification.status === "PENDING";
  const timeAgo = formatTimeAgo(notification.createdAt);

  const handleMarkAsCompleted = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPending && onMarkAsCompleted) {
      onMarkAsCompleted(notification.id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(notification.id);
    }
  };

  const handleClick = () => {
    onClick?.();
  };

  return (
    <div
      className={cn(
        "relative p-4 border-l-4 bg-white hover:bg-gray-50 transition-colors cursor-pointer",
        getNotificationColor(notification.type),
        isPending && "bg-accent/10",
        className
      )}
      onClick={handleClick}
    >
      {/* Pending indicator */}
      {isPending && (
        <div className="absolute top-4 right-4 h-2 w-2 bg-blue-500 rounded-full" />
      )}

      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          {getNotificationIcon(notification.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4
            className={cn(
              "text-sm font-medium text-gray-900 line-clamp-1",
              isPending && "font-semibold"
            )}
          >
            {notification.title}
          </h4>

          <p className="mt-1 text-xs text-gray-600 line-clamp-4">
            {notification.content}
          </p>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-gray-500">{timeAgo}</span>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {isPending && onMarkAsCompleted && (
                <button
                  onClick={handleMarkAsCompleted}
                  className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                  title="Đánh dấu đã hoàn thành"
                >
                  <Check className="h-4 w-4" />
                </button>
              )}

              {onDelete && (
                <button
                  onClick={handleDelete}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  title="Xóa thông báo"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
