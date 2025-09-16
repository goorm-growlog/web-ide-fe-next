import { auth } from '@/shared/config/auth'

export default auth(req => {
  const { pathname } = req.nextUrl
  const isAuthenticated = !!req.auth

  // 로그인한 사용자가 랜딩페이지 접근 시 프로젝트 리스트로 리다이렉트
  if (isAuthenticated && pathname === '/') {
    return Response.redirect(new URL('/project', req.url))
  }

  // 공개 페이지는 통과
  if (
    pathname === '/' ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/auth')
  ) {
    return
  }

  // 이미 로그인한 사용자 → 로그인/회원가입 페이지 접근 시 프로젝트로 리다이렉트
  // 단, 로그아웃 중인 경우(callbackUrl 파라미터 있음)는 예외
  if (
    isAuthenticated &&
    (pathname.startsWith('/signin') || pathname.startsWith('/signup')) &&
    !req.nextUrl.searchParams.has('callbackUrl')
  ) {
    return Response.redirect(new URL('/project', req.url))
  }

  // 미인증 사용자 → 보호된 페이지 접근 시 로그인으로 리다이렉트
  if (
    !isAuthenticated &&
    (pathname.startsWith('/account') || pathname.startsWith('/project'))
  ) {
    const signInUrl = new URL('/signin', req.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return Response.redirect(signInUrl)
  }
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
