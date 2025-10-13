"use client";

import { useEffect } from "react";
import { chatSocket } from "@/lib/socket/chat-socket";
import { useAuth } from "@/contexts/auth-context";

/**
 * Socket Provider
 * Kết nối socket ngay khi app khởi động và duy trì kết nối
 */
export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  useEffect(() => {
    // Chỉ connect khi user đã login
    if (user) {
      chatSocket.connect();

      // Cleanup: disconnect khi unmount hoặc user logout
      return () => {
        chatSocket.disconnect();
      };
    } else {
      // Disconnect nếu user logout
      if (chatSocket.isConnected()) {
        chatSocket.disconnect();
      }
    }
  }, [user]);

  return <>{children}</>;
}
