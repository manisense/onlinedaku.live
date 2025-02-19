import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add this line to use Node.js runtime instead of Edge
export const runtime = 'nodejs';

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname;

  // Check if it's an admin path (excluding login)
  if (path.startsWith('/admin') && path !== '/admin/login') {
    const token = request.cookies.get('adminToken');

    // If no token found, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

// Update the matcher to be more specific
export const config = {
  matcher: [
    '/admin/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
};
