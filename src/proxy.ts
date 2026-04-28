import { NextResponse } from "next/server";

// Auth has been removed -- all routes are open.
export function proxy() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
