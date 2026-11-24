import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function proxy(request: NextRequest) {
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

  // 1. Protect the /tips route (Gatekeeping)
  if (request.nextUrl.pathname.startsWith('/tips')) {
    const gateToken = request.cookies.get('gate_token')?.value;
    
    let hasAccess = false;
    if (gateToken) {
      // Check if token is valid in DB
      const { data } = await supabase
        .from('gate_access')
        .select('id')
        .eq('session_token', gateToken)
        .gt('expires_at', new Date().toISOString())
        .single();
      
      hasAccess = !!data;
    }

    if (!hasAccess) {
      // Kick them to the gate form
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

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/'
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
  // Add '/tips' to the matcher
  matcher: ['/admin/:path*', '/login', '/tips/:path*'],
}
