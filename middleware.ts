import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // For admin routes (except login), we'll handle auth check on the server side
  // This middleware just allows the request to pass through
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
