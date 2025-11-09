/**
 * Cookie Utility Functions
 * Quản lý việc đọc, ghi, xóa cookies
 */

export interface CookieOptions {
  expires?: number | Date; // Days hoặc Date object
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
}

/**
 * Set cookie
 * @param name - Tên cookie
 * @param value - Giá trị cookie
 * @param options - Các options cho cookie
 */
export function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {}
): void {
  if (typeof document === "undefined") return;

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  // Expires
  if (options.expires) {
    let expiresDate: Date;
    if (typeof options.expires === "number") {
      expiresDate = new Date();
      expiresDate.setTime(
        expiresDate.getTime() + options.expires * 24 * 60 * 60 * 1000
      );
    } else {
      expiresDate = options.expires;
    }
    cookieString += `; expires=${expiresDate.toUTCString()}`;
  }

  // Path
  cookieString += `; path=${options.path || "/"}`;

  // Domain
  if (options.domain) {
    cookieString += `; domain=${options.domain}`;
  }

  // Secure
  if (options.secure) {
    cookieString += "; secure";
  }

  // SameSite
  if (options.sameSite) {
    cookieString += `; samesite=${options.sameSite}`;
  }

  document.cookie = cookieString;
}

/**
 * Get cookie
 * @param name - Tên cookie
 * @returns Giá trị cookie hoặc null nếu không tìm thấy
 */
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const nameEQ = encodeURIComponent(name) + "=";
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }

  return null;
}

/**
 * Delete cookie
 * @param name - Tên cookie
 * @param options - Các options cho cookie (path, domain)
 */
export function deleteCookie(
  name: string,
  options: Pick<CookieOptions, "path" | "domain"> = {}
): void {
  setCookie(name, "", {
    ...options,
    expires: new Date(0),
  });
}

/**
 * Check if cookie exists
 * @param name - Tên cookie
 * @returns true nếu cookie tồn tại
 */
export function hasCookie(name: string): boolean {
  return getCookie(name) !== null;
}

/**
 * Get all cookies
 * @returns Object chứa tất cả cookies
 */
export function getAllCookies(): Record<string, string> {
  if (typeof document === "undefined") return {};

  const cookies: Record<string, string> = {};
  const cookieArray = document.cookie.split(";");

  for (const cookie of cookieArray) {
    const [name, value] = cookie.split("=").map((c) => c.trim());
    if (name && value) {
      cookies[decodeURIComponent(name)] = decodeURIComponent(value);
    }
  }

  return cookies;
}
