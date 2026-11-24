import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/tips')) {
    const gateToken = request.cookies.get('gate_token')?.value
    if (!gateToken) {
      return NextResponse.redirect(new URL('/gate', request.url))
    }
  }
}

export const config = {
  matcher: '/tips/:path*',
}
