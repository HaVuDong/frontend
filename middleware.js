import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('jwt')?.value;
  const role = request.cookies.get('role')?.value;
  const { pathname } = request.nextUrl;

  console.log('🔒 [Middleware] Path:', pathname);
  console.log('🎫 Token:', token ? '✅ Có' : '❌ Không có');
  console.log('👤 Role:', role || 'N/A');

  // ============================================
  // ADMIN AUTH ROUTES ONLY (login/register)
  // ============================================
  if (pathname === '/admin/auth/login' || pathname === '/admin/auth/register') {
    // Nếu đã login với role admin, redirect về dashboard
    if (token && role === 'admin') {
      console.log('✅ Already logged in as admin, redirect to dashboard');
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    console.log('✅ Allow access to admin auth page');
    return NextResponse.next();
  }

  // ============================================
  // ADMIN DASHBOARD ROUTES - CHECK TOKEN
  // ============================================
  if (pathname.startsWith('/admin') && pathname !== '/admin/auth/login' && pathname !== '/admin/auth/register') {
    if (!token) {
      console.log('❌ No token, redirect to admin login');
      return NextResponse.redirect(new URL('/admin/auth/login', request.url));
    }

    // ⭐ CHỈ CHECK TOKEN, KHÔNG CHECK ROLE
    // Vì backend sẽ check role qua API
    console.log('✅ Token exists, allow access to admin dashboard');
    return NextResponse.next();
  }

  // ============================================
  // USER AUTH ROUTES
  // ============================================
  if (pathname.startsWith('/site/auth')) {
    if (token) {
      if (role === 'admin') {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.redirect(new URL('/site', request.url));
    }
    return NextResponse.next();
  }

  // ============================================
  // PROTECTED USER ROUTES
  // ============================================
  const protectedUserRoutes = [
    '/site/profile',
    '/site/orders',
    '/site/cart/checkout',
    '/site/bookings/new',
  ];

  if (protectedUserRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      console.log('❌ Yêu cầu đăng nhập, redirect về login');
      const loginUrl = new URL('/site/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      loginUrl.searchParams.set('msg', 'needLogin');
      return NextResponse.redirect(loginUrl);
    }
    console.log('✅ User authenticated, allow access');
    return NextResponse.next();
  }

  // ============================================
  // PUBLIC ROUTES
  // ============================================
  console.log('✅ Public route, allow access');
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/site/auth/:path*',
    '/site/profile/:path*',
    '/site/orders/:path*',
    '/site/cart/checkout/:path*',
    '/site/bookings/new/:path*',
  ],
};