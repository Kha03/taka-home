/**
 * Auth utilities for getting user information from localStorage
 */

import type { Account } from "@/lib/api/types";

/**
 * Lấy thông tin account từ localStorage
 */
export function getAccountFromStorage(): Account | null {
  if (typeof window === "undefined") return null;

  try {
    const accountInfo = localStorage.getItem("account_info");
    
    // Check if value is valid before parsing
    if (!accountInfo || accountInfo === "undefined" || accountInfo === "null") {
      return null;
    }

    return JSON.parse(accountInfo) as Account;
  } catch (error) {
    console.error("Error parsing account info from localStorage:", error);
    return null;
  }
}

/**
 * Lấy userId từ localStorage
 */
export function getUserIdFromStorage(): string | null {
  const account = getAccountFromStorage();
  return account?.user?.id || null;
}

/**
 * Lấy access token từ localStorage
 */
export function getAccessTokenFromStorage(): string | null {
  if (typeof window === "undefined") return null;

  return localStorage.getItem("accessToken");
}

/**
 * Kiểm tra user đã đăng nhập chưa
 */
export function isAuthenticated(): boolean {
  return !!getAccessTokenFromStorage() && !!getUserIdFromStorage();
}

/**
 * Xóa thông tin auth khỏi localStorage (logout)
 */
export function clearAuthFromStorage(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem("accessToken");
}
