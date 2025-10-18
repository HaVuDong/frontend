import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname, origin } = request.nextUrl;
  const role = request.cookies.get("role")?.value;
  const token = request.cookies.get("jwt")?.value;

  // 🔒 Route admin
  if (pathname.startsWith("/admin")) {
    if (!token || role !== "admin") {
      const loginUrl = new URL("/site/auth/login", origin);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 🔒 Route user
  const publicPaths = ["/site", "/site/auth/login", "/site/auth/register"];
  const isPublic = publicPaths.some((p) => pathname.startsWith(p));
  if (!isPublic && !token) {
    const loginUrl = new URL("/site/auth/login", origin);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ✅ Nếu đã đăng nhập, tránh vào lại login/register
  if (
    token &&
    (pathname.startsWith("/site/auth/login") ||
      pathname.startsWith("/site/auth/register"))
  ) {
    return NextResponse.redirect(
      new URL(role === "admin" ? "/admin" : "/site", origin)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/site/auth/:path*"],
};
