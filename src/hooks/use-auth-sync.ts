import { useEffect } from "react";
import { setCookie } from "@/lib/utils/cookie-utils";

export function useAuthSync() {
  useEffect(() => {
    // Lắng nghe custom event khi token được refresh tự động
    const handleTokenUpdate = (e: CustomEvent) => {
      const { accessToken, refreshToken } = e.detail;

      if (accessToken) {
        // Sync accessToken vào cookie
        setCookie("accessToken", accessToken, {
          expires: 1,
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
      }

      if (refreshToken) {
        // Sync refreshToken vào cookie
        setCookie("refreshToken", refreshToken, {
          expires: 7,
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
      }
    };

    window.addEventListener(
      "auth-token-updated",
      handleTokenUpdate as EventListener
    );

    return () => {
      window.removeEventListener(
        "auth-token-updated",
        handleTokenUpdate as EventListener
      );
    };
  }, []);
}
