// Next.js Middleware - Admin route koruması

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin route'larını koru
  if (pathname.startsWith("/admin")) {
    // Session kontrolü
    const session = await verifySession();

    if (!session) {
      // Giriş yapılmamış, login sayfasına yönlendir
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Login sayfasına giriş yapmış kullanıcıyı admin'e yönlendir
  if (pathname === "/login") {
    const session = await verifySession();
    if (session) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};

