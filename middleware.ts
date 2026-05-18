import { NextResponse } from "next/server";

export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/hiring/:path*",
    "/jobs/:path*",
    "/applicants/:path*",
    "/interviews/:path*",
    "/reports",
    "/settings",
    "/settings/:path*",
    "/candidates/:path*",
    "/compare",
    "/roles/:path*",
    "/meet/:path*",
  ],
};
