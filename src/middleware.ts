import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 1. Protect /tips route (Gatekeeping)
  if (request.nextUrl.pathname.startsWith('/tips')) {
    const isReviewing = request.nextUrl.searchParams.get("reviewing") === "true";
    const gateToken = request.cookies.get('gate_token')?.value;

    // If they are in the middle of reviewing, let them see the page
    if (isReviewing) {
      return supabaseResponse;
    }

    // If they are NOT reviewing, they MUST have a valid gate_token
    if (!gateToken) {
      return NextResponse.redirect(new URL('/gate', request.url));
    }
  }

  // 2. Protect Admin Routes
  const { data: { user } } = await supabase.auth.getUser()

  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    // Check if the user is actually an admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/' // Kick non-admins back to homepage
      return NextResponse.redirect(url)
    }
  }

  // 3. Redirect logged-in Admins away from the Login page
  if (request.nextUrl.pathname === '/login' && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  // Matcher ensures middleware only runs on these specific paths
  matcher: ['/admin/:path*', '/login', '/tips/:path*'],
}
