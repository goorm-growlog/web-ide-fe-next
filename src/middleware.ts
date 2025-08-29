import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 프록시 경로는 우회
  if (pathname.startsWith('/api') || pathname.startsWith('/auth')) {
    return NextResponse.next()
  }

  // 공개 페이지는 접근 허용
  if (
    pathname === '/' ||
    pathname.startsWith('/signin') ||
    pathname.startsWith('/signup')
  ) {
    return NextResponse.next()
  }

  // 보호된 페이지는 인증 확인
  if (pathname.startsWith('/account') || pathname.startsWith('/project')) {
    const refreshToken = request.cookies.get('refresh')?.value?.trim()

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
