import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// List of paths that don't require authentication
const publicPaths = ['/auth/signin', '/auth/error', '/auth/signout', '/api/auth'];

// NextAuth files and static assets do not need to be protected
const isNextAuthPath = (path: string) => {
  return path.includes('/_next/') || path.includes('/favicon.ico') || path.startsWith('/api/auth');
};

const isPublicPath = (path: string) => {
  return publicPaths.some(publicPath => {
    return path === publicPath || path.startsWith(`${publicPath}/`);
  });
};

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Allow access to NextAuth paths and static assets without authentication check
  if (isNextAuthPath(path)) {
    return NextResponse.next();
  }

  // Allow access to public paths without authentication
  if (isPublicPath(path)) {
    return NextResponse.next();
  }

  // Check if the user is authenticated by verifying the JWT token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-do-not-use-in-production',
    secureCookie: process.env.NODE_ENV === 'production',
  });

  // If not authenticated and not on a public path, redirect to signin
  if (!token) {
    const signinUrl = new URL('/auth/signin', request.url);
    signinUrl.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(signinUrl);
  }

  // User is authenticated, allow access
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
