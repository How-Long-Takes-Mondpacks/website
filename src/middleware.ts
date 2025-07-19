import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  publicRoutes,
  adminRoutes,
  moderatorRoutes
} from '@/routes'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth, signIn } from '@/auth'

export default async function middleware(request: NextRequest) {
  const { nextUrl } = request
  const session = await auth()
  const isLoggedIn = session && session.user

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isModeratorRoute = moderatorRoutes.some(route => nextUrl.pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some(route => nextUrl.pathname.startsWith(route))

  if (isApiAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    if (isPublicRoute) return NextResponse.next()
    if (!isAdminRoute && !isModeratorRoute)
      return NextResponse.redirect(await signIn('discord', { redirect: false, redirectTo: nextUrl.pathname }))
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|server|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|).*)',
    '/admin/:path*',
    '/account/:path*',
    '/buy/:path*',
    '/analytics/:path*',
    '/api/anaytics/:path*'
  ],
  unstable_allowDynamic: [
    '**/models/**',
    '**/node_modules/**'
  ]
}