import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const { pathname } = request.nextUrl;

  // login page only "/"
  const isAuthPage = pathname === "/";

  // protected routes
  const isProtectedRoute =
    pathname.startsWith("/work-track") ||
    pathname.startsWith("/hr");

  // If not logged in → redirect to login
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If logged in → prevent going to login page
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/work-track", request.url));
  }

  return NextResponse.next();
}