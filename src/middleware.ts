// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { hasRoutePermission, type UserRole } from "@/lib/auth/roles";

const authRoots = ["/signin", "/signup"];
const REDIRECT_PARAM = "from";

/**
 * Decode JWT token to get user roles
 */
function getUserRolesFromToken(token: string): UserRole[] | undefined {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.roles || [];
  } catch {
    return undefined;
  }
}

/**
 * Check if token is expired
 */
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload.exp) return true;
    
    // Check if token is expired (exp is in seconds, Date.now() is in milliseconds)
    return payload.exp * 1000 < Date.now();
  } catch {
    return true; // If can't decode, consider it expired
  }
}

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;
  
  // Check if token exists and is valid (not expired)
  const isValidToken = token && !isTokenExpired(token);
  const isAuthed = !!isValidToken;

  // Get user roles from valid token only
  const userRoles = isValidToken ? getUserRolesFromToken(token) : undefined;

  // Check route permission
  const permission = hasRoutePermission(pathname, userRoles);

  // If route requires authentication and user is not authenticated
  if (permission.requireAuth && !isAuthed) {
    // If token exists but expired, let the request go through
    // The client-side interceptor will handle refresh token automatically
    if (token && isTokenExpired(token)) {
      return NextResponse.next();
    }
    
    // No token at all, redirect to signin
    const url = new URL("/signin", request.url);
    url.searchParams.set(
      REDIRECT_PARAM,
      pathname + (request.nextUrl.search || "")
    );
    return NextResponse.redirect(url);
  }

  // If user doesn't have permission (authenticated but wrong role)
  if (!permission.hasPermission && isAuthed) {
    const redirectUrl = permission.redirectTo || "/";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // Auth pages - redirect if already authenticated with VALID token
  if (authRoots.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    if (isAuthed) {
      const from = searchParams.get(REDIRECT_PARAM) || "/";
      return NextResponse.redirect(new URL(from, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Admin routes - highest priority
    "/admin",
    "/admin/:path*",
    // Specific routes to protect
    "/my-properties",
    "/my-properties/:path*",
    "/rental-requests",
    "/rental-requests/:path*",
    "/property-approval",
    "/property-approval/:path*",
    "/contracts",
    "/contracts/:path*",
    "/chat",
    "/chat/:path*",
    "/profile",
    "/profile/:path*",
    "/blockchain-history",
    "/blockchain-history/:path*",
    "/payment-result",
    "/payment-result/:path*",
    "/properties/create",
    "/properties/create/:path*",
    "/signin",
    "/signup",
  ],
};
