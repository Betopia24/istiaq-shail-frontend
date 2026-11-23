import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, homeFor, verifySession } from "@/lib/auth/session-token";

/**
 * Route protection (optimistic check, per the Next.js auth guide): reads the signed session cookie only,
 * never the database. Real authorisation is the API's, on every call; the admin and agent layouts check again
 * on the server.
 *
 * - Dashboards and onboarding need a signed-in user, else → /login?redirect=<path>.
 * - /admin-dashboard is for super admins; everyone else → their own dashboard.
 * - Agency pages are not for super admins (they belong to no agency) → /admin-dashboard.
 * - Signed-in users opening /login or /sign-up go to their dashboard.
 */
const AUTH_PAGES = ["/login", "/sign-up", "/forgot-password", "/reset-password"];

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const user = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);

  if (AUTH_PAGES.some((page) => pathname === page)) {
    return user ? NextResponse.redirect(new URL(homeFor(user), request.url)) : NextResponse.next();
  }

  if (!user) {
    const login = new URL("/login", request.url);
    login.searchParams.set("redirect", `${pathname}${search}`);
    const response = NextResponse.redirect(login);
    // A forged or expired cookie: drop it so the next request is clean.
    if (request.cookies.has(SESSION_COOKIE)) response.cookies.delete(SESSION_COOKIE);
    return response;
  }

  const admin = user.role === "super_admin";
  if (pathname.startsWith("/admin-dashboard") && !admin) return NextResponse.redirect(new URL(homeFor(user), request.url));
  if ((pathname.startsWith("/agent-dashboard") || pathname.startsWith("/onboarding")) && admin) {
    return NextResponse.redirect(new URL("/admin-dashboard", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/agent-dashboard/:path*",
    "/admin-dashboard/:path*",
    "/dashboard/:path*",
    "/onboarding/:path*",
    "/login",
    "/sign-up",
    "/forgot-password",
    "/reset-password",
  ],
};
