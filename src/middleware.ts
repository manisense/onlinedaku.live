import { NextRequest, NextResponse } from 'next/server';

// Add this line to use Node.js runtime instead of Edge
export const runtime = 'nodejs';

export function middleware(req: NextRequest) {
  // Add security headers
  const response = NextResponse.next();
  
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Allow images from other domains
  response.headers.set('Access-Control-Allow-Origin', '*');
  
  // Get the pathname
  const path = req.nextUrl.pathname;

  // Check if it's an admin path (excluding login)
  if (path.startsWith('/admin') && path !== '/admin/login') {
    const token = req.cookies.get('adminToken');

    // If no token found, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  return response;
}

// Update the matcher to be more specific
export const config = {
  matcher: [
    '/admin/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/api/:path*'
  ]
};
