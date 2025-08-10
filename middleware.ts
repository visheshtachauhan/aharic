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

  // Handle legacy route redirects
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

  // Define public routes in normal mode
  const publicRoutes = [
    '/',
    '/intro',
    '/menu',
    '/restaurants',
    '/restaurant',
    '/checkout',
    '/orders',
    '/auth/login',
    '/auth/signup',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/logout'
  ]

  const demoLockdown = process.env.NEXT_PUBLIC_DEMO_LOCKDOWN === 'true'

  const isPublicRoute = publicRoutes.some(route => {
    if (route === '/restaurant') {
      return pathname.startsWith('/restaurant')
    }
    return pathname === route || pathname.startsWith(route + '/')
  })

  const hasDemoOwner = request.cookies.get('demoOwner')?.value === '1'
  const isAuthenticated = Boolean(user) || (demoLockdown && hasDemoOwner)

  if (demoLockdown) {
    // During demo, only allow auth pages and intro without login
    const isAuthRoute = pathname.startsWith('/auth')
    const isIntro = pathname === '/intro' || pathname === '/'
    if (!isAuthRoute && !isIntro && isPublicRoute && !isAuthenticated) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth/login'
      return NextResponse.redirect(url)
    }
  }

  // If no user and trying to access protected route, redirect to login
  if (!isAuthenticated && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  // If user is logged in and trying to access auth pages, redirect to dashboard
  if (isAuthenticated && pathname.startsWith('/auth')) {
    const url = request.nextUrl.clone()
    url.pathname = '/owner/dashboard'
    return NextResponse.redirect(url)
  }

  // If user is logged in and trying to access intro page, redirect to dashboard
  if (isAuthenticated && pathname === '/intro') {
    const url = request.nextUrl.clone()
    url.pathname = '/owner/dashboard'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 