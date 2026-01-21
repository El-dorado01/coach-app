import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;

  const { nextUrl } = req;
  const isDashboard = nextUrl.pathname.startsWith('/dashboard');
  const isHome = nextUrl.pathname === '/';

  // Redirect /dashboard to /
  if (isDashboard) {
    return NextResponse.redirect(new URL('/', nextUrl));
  }

  // Protect /
  if (isHome && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', nextUrl));
  }
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
