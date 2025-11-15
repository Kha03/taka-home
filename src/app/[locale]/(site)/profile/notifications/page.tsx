"use client";

import { NotificationList } from "@/components/notifications";
import { getUserIdFromStorage } from "@/lib/utils/auth-utils";

export default function NotificationsPage() {
  const userId = getUserIdFromStorage();
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-primary mt-2 font-bold text-3xl">Thông báo</h2>
      </div>

      {/* Notifications List */}
      <NotificationList userId={userId || null} />
    </div>
  );
}
