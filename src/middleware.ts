import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export function middleware(request: NextRequest) {
  // Add security headers
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  const path = request.nextUrl.pathname;

  // Handle admin routes
  if (path.startsWith('/admin')) {
    // Allow access to login page
    if (path === '/admin/login') {
      return response;
    }

    // Check for admin token
    const token = request.cookies.get('adminToken');
    
    // If no token and not already on login page, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // If on root admin path, redirect to dashboard
    if (path === '/admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/api/:path*'
  ]
};
