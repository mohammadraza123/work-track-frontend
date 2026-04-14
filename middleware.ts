import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const isHR = request.cookies.get("isHR")?.value;

  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === "/";

  const isHRPage = pathname.startsWith("/hr");
  const isWorkTrackPage =
    pathname.startsWith("/work-track") || pathname.startsWith("/leave");

  // 🔴 Protect HR routes → only HR allowed
  if (isHRPage && !isHR) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 🔴 Protect WorkTrack routes → only logged-in users
  if (isWorkTrackPage && !token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 🟢 Handle login page redirect
  if (isAuthPage) {
    if (isHR) {
      return NextResponse.redirect(new URL("/hr", request.url));
    }
    if (token) {
      return NextResponse.redirect(new URL("/work-track", request.url));
    }
  }

  return NextResponse.next();
}
