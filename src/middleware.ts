import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decrypt, updateSession } from './lib/session';

// 1. Specify protected and public routes
const protectedRoutes = ['/dashboard'];
const publicRoutes = ['/auth/login', '/auth/signup', '/', '/new-verification'];
const AdminRoutes = ['/admin, /admin/*'];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);
  const isAdminRoute = AdminRoutes.includes(path);

  const cookie = cookies().get('session')?.value;
  const session = await decrypt(cookie);


  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/auth/login', req.nextUrl));
  }

  if (
    isPublicRoute &&
    session?.userId &&
    !req.nextUrl.pathname.startsWith('/dashboard')
  ) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }

  if (isAdminRoute && session?.role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }

  return NextResponse.next();
}
