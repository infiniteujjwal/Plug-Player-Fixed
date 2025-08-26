import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Role } from './types';

export function middleware(request: NextRequest) {
  const userCookie = request.cookies.get('plugplayers-user');
  const user = userCookie ? JSON.parse(userCookie.value) : null;
  const { pathname } = request.nextUrl;

  // If user is not logged in and tries to access a protected route, redirect to login
  if (!user && (pathname.startsWith('/admin') || pathname.startsWith('/client') || pathname.startsWith('/candidate') || pathname === '/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If user is logged in, handle role-based access
  if (user) {
    // If user is trying to access login/register, redirect them to their dashboard
    if (pathname === '/login' || pathname === '/register') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    const roleRedirects: { [key in Role]?: string } = {
      [Role.ADMIN]: '/admin',
      [Role.CLIENT_ADMIN]: '/client',
      [Role.CLIENT_MEMBER]: '/client',
      [Role.CANDIDATE]: '/candidate'
    };
    
    const requiredPrefix = roleRedirects[user.role];

    // If user is on a path that doesn't match their role, redirect them
    if (requiredPrefix && !pathname.startsWith(requiredPrefix)) {
        // Allow access to the generic dashboard redirector
        if (pathname === '/dashboard') {
            return NextResponse.next();
        }
       return NextResponse.redirect(new URL(requiredPrefix, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/client/:path*',
    '/candidate/:path*',
    '/dashboard',
    '/login',
    '/register',
  ],
};
