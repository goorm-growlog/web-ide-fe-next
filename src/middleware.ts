import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // API 요청은 우회시키기 (프록시가 처리)
  if (pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // 공개 페이지 (인증 불필요)
  const publicPaths = ['/signin', '/signup', '/']
  if (
    publicPaths.some(path => pathname === path || pathname.startsWith(path))
  ) {
    return NextResponse.next()
  }

  // 보호된 페이지 (인증 필요)
  const protectedPaths = ['/account', '/project']
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))

  if (isProtectedPath) {
    const refreshCookie = request.cookies.get('refresh')
    const refreshToken = refreshCookie?.value?.trim()

    if (!refreshToken) {
      return NextResponse.redirect(new URL('/signin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes) - 프록시가 처리
     * - auth (인증 API) - 프록시가 처리
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|auth|_next/static|_next/image|favicon.ico).*)',
  ],
}
