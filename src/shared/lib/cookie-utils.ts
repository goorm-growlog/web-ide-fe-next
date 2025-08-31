import type { NextResponse } from 'next/server'

/**
 * 백엔드 응답의 Set-Cookie 헤더를 안전하게 NextResponse로 포워딩합니다.
 * RFC 6265 표준을 준수하여 expires 날짜 형식과 다중 쿠키를 올바르게 처리합니다.
 *
 * @param backendResponse 백엔드 fetch 응답
 * @param nextResponse 클라이언트로 보낼 NextResponse
 */
export function forwardSetCookieHeaders(
  backendResponse: Response,
  nextResponse: NextResponse,
): void {
  // 🔒 안전한 Set-Cookie 헤더 처리 (RFC 6265 준수)
  if (typeof backendResponse.headers.getSetCookie === 'function') {
    // 최신 브라우저: getSetCookie() 사용 (권장)
    const setCookieHeaders = backendResponse.headers.getSetCookie()
    setCookieHeaders.forEach(cookie => {
      nextResponse.headers.append('Set-Cookie', cookie)
    })
  } else {
    // 호환성: 수동 파싱 (쿠키별로 개별 Set-Cookie 헤더)
    const rawCookies = backendResponse.headers.get('set-cookie')
    if (rawCookies) {
      // expires 날짜 형식을 고려한 안전한 파싱
      // 정규식: expires=날짜 패턴 뒤의 쉼표는 무시하고 쿠키 구분자만 분할
      const cookieEntries = rawCookies.split(
        /(?<!expires=\w{3}),\s*(?=\w+\s*=)/,
      )
      cookieEntries.forEach(cookie => {
        if (cookie.trim()) {
          nextResponse.headers.append('Set-Cookie', cookie.trim())
        }
      })
    }
  }
}

/**
 * 지정된 쿠키들을 강제로 삭제합니다.
 * 백엔드에서 쿠키 삭제를 누락했을 경우의 안전장치입니다.
 *
 * @param nextResponse 클라이언트로 보낸 NextResponse
 * @param cookieNames 삭제할 쿠키명 배열
 */
export function deleteCookies(
  nextResponse: NextResponse,
  cookieNames: string[],
): void {
  cookieNames.forEach(cookieName => {
    nextResponse.cookies.delete(cookieName)
  })
}
