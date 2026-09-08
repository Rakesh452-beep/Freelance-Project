import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE = "sb-sqjdbtfizmtshqftxmzy-auth-token";

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const isLoggedIn = request.cookies.has(AUTH_COOKIE);

  if (!isLoggedIn) {
    const target = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
    const loginUrl = new URL("/login", request.url);
    if (target !== "/") loginUrl.searchParams.set("next", target);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Gate every page except:
     * - /login (sign-in page itself)
     * - /auth/* (OAuth callback exchange)
     * - /admin/* (has its own email/password + Google auth)
     * - /api/* (API routes)
     * - static assets, metadata files
     */
    "/((?!login|auth|admin|api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)",
  ],
};