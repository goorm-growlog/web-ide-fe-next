import { auth } from '@/lib/auth'

export default auth(req => {
  const { pathname } = req.nextUrl
  const isAuthenticated = !!req.auth

  // 프록시/공개 페이지는 통과
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/auth') ||
    pathname === '/' ||
    pathname.startsWith('/signin') ||
    pathname.startsWith('/signup')
  ) {
    return
  }

  // 보호된 페이지는 인증 확인
  if (
    (pathname.startsWith('/account') || pathname.startsWith('/project')) &&
    !isAuthenticated
  ) {
    const signInUrl = new URL('/signin', req.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return Response.redirect(signInUrl)
  }
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
