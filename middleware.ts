import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Chỉ chặn các trang thực sự cần đăng nhập
const protectedPaths = [
  "/user",
  "/orders",
  "/checkout",
  "/properties/create",
  "/contracts",
];

// Auth pages
const authPaths = ["/signin", "/signup"];

const REDIRECT_PARAM = "from";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;
  const isAuthenticated = !!token;

  // Protected
  if (
    protectedPaths.some(
      (path) => pathname === path || pathname.startsWith(path + "/")
    )
  ) {
    if (!isAuthenticated) {
      const signInUrl = new URL("/signin", request.url);
      // giữ lại cả query gốc nếu có
      const rawPath = `${pathname}${search || ""}`;
      signInUrl.searchParams.set(REDIRECT_PARAM, rawPath);
      return NextResponse.redirect(signInUrl);
    }
  }

  // /signin, /signup
  if (
    authPaths.some(
      (path) => pathname === path || pathname.startsWith(path + "/")
    )
  ) {
    if (isAuthenticated) {
      const from = request.nextUrl.searchParams.get(REDIRECT_PARAM) || "/";
      const redirectUrl = new URL(from, request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // bỏ qua api, assets, next static…
    "/((?!api|_next/static|_next/image|favicon.ico|assets|public).*)",
  ],
};
