import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(_request: NextRequest) {
  // 🚧 임시: 모든 보호 기능 비활성화 (개발용)
  // 원인: 백엔드에서 쿠키를 Path=/auth로 설정하여 다른 경로에서 접근 불가
  // TODO: 백엔드 쿠키 Path를 '/'로 수정 후 아래 주석 해제하고 이 return 제거
  return NextResponse.next()

  /* 
  // 원본 보호 로직 (백엔드 쿠키 Path 수정 후 복원 예정)
  const { pathname } = _request.nextUrl

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
    const refreshToken = _request.cookies.get('refresh')?.value?.trim()

    if (!refreshToken) {
      return NextResponse.redirect(new URL('/signin', _request.url))
    }
  }

  return NextResponse.next()
  */
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
