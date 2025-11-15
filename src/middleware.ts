// middleware.ts
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { hasRoutePermission, type UserRole } from "@/lib/auth/roles";
import { i18n } from "../i18n.config";

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

// Create the next-intl middleware
const intlMiddleware = createMiddleware({
  locales: i18n.locales,
  defaultLocale: i18n.defaultLocale,
  localePrefix: "always",
});

export function middleware(request: NextRequest) {
  // First, handle i18n routing
  const response = intlMiddleware(request);

  // Get pathname for auth checks
  const { pathname, searchParams } = request.nextUrl;

  // Extract locale from pathname
  const pathnameLocale = pathname.split("/")[1];
  const isValidLocale = i18n.locales.includes(pathnameLocale);

  // Get pathname without locale for permission checks
  const pathnameWithoutLocale = isValidLocale
    ? pathname.slice(pathnameLocale.length + 1) || "/"
    : pathname;

  const token = request.cookies.get("accessToken")?.value;

  // Check if token exists and is valid (not expired)
  const isValidToken = token && !isTokenExpired(token);
  const isAuthed = !!isValidToken;

  // Get user roles from valid token only
  const userRoles = isValidToken ? getUserRolesFromToken(token) : undefined;

  // Check route permission using pathname without locale
  const permission = hasRoutePermission(pathnameWithoutLocale, userRoles);

  // If route requires authentication and user is not authenticated
  if (permission.requireAuth && !isAuthed) {
    // If token exists but expired, let the request go through
    // The client-side interceptor will handle refresh token automatically
    if (token && isTokenExpired(token)) {
      return response;
    }

    // No token at all, redirect to signin (with locale)
    const locale = isValidLocale ? pathnameLocale : i18n.defaultLocale;
    const url = new URL(`/${locale}/signin`, request.url);
    url.searchParams.set(
      REDIRECT_PARAM,
      pathname + (request.nextUrl.search || "")
    );
    return NextResponse.redirect(url);
  }

  // If user doesn't have permission (authenticated but wrong role)
  if (!permission.hasPermission && isAuthed) {
    const locale = isValidLocale ? pathnameLocale : i18n.defaultLocale;
    const redirectUrl = permission.redirectTo || `/${locale}`;
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // Auth pages - redirect if already authenticated with VALID token
  if (
    authRoots.some(
      (p) =>
        pathnameWithoutLocale === p || pathnameWithoutLocale.startsWith(p + "/")
    )
  ) {
    if (isAuthed) {
      const locale = isValidLocale ? pathnameLocale : i18n.defaultLocale;
      const from = searchParams.get(REDIRECT_PARAM) || `/${locale}`;
      return NextResponse.redirect(new URL(from, request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - API routes
    // - _next (Next.js internals)
    // - static files (images, fonts, etc.)
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)",
  ],
};
