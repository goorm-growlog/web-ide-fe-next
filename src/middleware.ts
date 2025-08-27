import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // API 요청은 우회시키기 (중요!)
  if (pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // 로그인, 회원가입 페이지는 접근 허용
  if (pathname.startsWith('/signin') || pathname.startsWith('/signup')) {
    return NextResponse.next()
  }

  // 계정 페이지는 인증 필요
  if (pathname.startsWith('/account')) {
    const token = request.cookies.get('refresh')

    if (!token) {
      return NextResponse.redirect(new URL('/signin', request.url))
    }
  }

  // 프로젝트 페이지는 일단 접근 허용 (기존 로직 유지)
  if (pathname.startsWith('/project')) {
    return NextResponse.next()
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
