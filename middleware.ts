import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Add paths that don't require authentication
const publicPaths = [
  '/',
  '/auth/login',
  '/auth/signup',
  '/explore',
  '/popular',
  '/search'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (publicPaths.some(path => pathname === path) || pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  // Check for auth token
  const token = request.cookies.get('auth-token');

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  try {
    verify(token.value, JWT_SECRET);
    return NextResponse.next();
  } catch (error) {
    // Invalid or expired token
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};