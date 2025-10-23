// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoots = [
  "/user",
  "/orders",
  "/checkout",
  "/properties/create",
  "/contracts",
];
const authRoots = ["/signin", "/signup"];
const REDIRECT_PARAM = "from";

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;
  const isAuthed = !!token;

  // Protected only
  if (
    protectedRoots.some((p) => pathname === p || pathname.startsWith(p + "/"))
  ) {
    if (!isAuthed) {
      const url = new URL("/signin", request.url);
      url.searchParams.set(
        REDIRECT_PARAM,
        pathname + (request.nextUrl.search || "")
      );
      return NextResponse.redirect(url);
    }
  }

  // Auth pages
  if (authRoots.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    if (isAuthed) {
      const from = searchParams.get(REDIRECT_PARAM) || "/";
      return NextResponse.redirect(new URL(from, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // CHỈ match đúng các route cần thiết
  matcher: [
    "/user/:path*",
    "/orders/:path*",
    "/checkout/:path*",
    "/properties/create/:path*",
    "/contracts/:path*",
    "/signin",
    "/signup",
  ],
};
