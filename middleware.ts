import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl;

  // Bypass middleware for API routes to avoid breaking fetch calls
  if (pathname.startsWith('/api')) {
    return response
  }

  // Legacy route redirects
  if (pathname === '/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  if (pathname === '/signup') {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/signup'
    return NextResponse.redirect(url)
  }

  if (pathname.startsWith('/admin')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.replace('/admin', '/owner')
    return NextResponse.redirect(url)
  }

  // Public routes
  const publicRoutes = ['/intro', '/auth/login', '/auth/signup']
  const isPublicRoute = publicRoutes.some((route) => pathname === route)

  // Demo lockdown flag (kept for clarity, behavior already enforces strict public routes)
  const demoLockdown = process.env.NEXT_PUBLIC_DEMO_LOCKDOWN === 'true'

  // Authentication status
  const isAuthenticated = Boolean(user)

  // Role helpers
  const role: string | undefined = (user as any)?.user_metadata?.role || (user as any)?.app_metadata?.role
  const isOwnerRoute = pathname.startsWith('/owner')
  const isSuperadminRoute = pathname.startsWith('/superadmin')

  // Enforce auth for all non-public routes
  if (!isAuthenticated && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  // Role-based protections (only after authenticated)
  if (isAuthenticated && isOwnerRoute && role !== 'owner') {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  if (isAuthenticated && isSuperadminRoute && role !== 'superadmin') {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  // Prevent accessing auth pages when logged in
  if (isAuthenticated && pathname.startsWith('/auth')) {
    const url = request.nextUrl.clone()
    url.pathname = '/owner/dashboard'
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from intro
  if (isAuthenticated && pathname === '/intro') {
    const url = request.nextUrl.clone()
    url.pathname = '/owner/dashboard'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 