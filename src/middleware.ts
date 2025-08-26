
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './lib/auth';

export async function middleware(req: NextRequest) {
  const session = await auth();
  const url = req.nextUrl;

  const protectedPaths = ['/admin', '/client', '/jobseeker'];
  const isProtected = protectedPaths.some(p => url.pathname.startsWith(p));

  if (!isProtected) return NextResponse.next();

  if (!session?.user) return NextResponse.redirect(new URL('/signin', req.url));

  // Role gates
  if (url.pathname.startsWith('/admin') && session.user.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', req.url));
  }
  if (url.pathname.startsWith('/client') && session.user.role !== 'CLIENT' && session.user.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', req.url));
  }
  if (url.pathname.startsWith('/jobseeker') && session.user.role !== 'JOBSEEKER' && session.user.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/client/:path*', '/jobseeker/:path*']
};
