import { NextResponse } from 'next/server';
export function middleware(request) {

// Lấy role từ cookie
const role = request.cookies.get('role')?.value;
// URL hiện tại
const url = request.nextUrl;
// Kiểm tra nếu người dùng truy cập vào các route admin
if (url.pathname.startsWith('/admin')) {
if (!role || role !== 'admin-web') {
return NextResponse.redirect(new URL('/login', request.url));
}
}
// Nếu hợp lệ, cho phép tiếp tục
return NextResponse.next();
}

export const config ={
    matcher: ['/admin/:path*']
};