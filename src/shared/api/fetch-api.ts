import { handleApiError } from '../lib/api-error'

/**
 * 비인증 API 클라이언트 (회원가입, 로그인 등)
 * - Authorization 헤더 없음
 * - 401 에러 시 토큰 갱신 시도 없음
 * - JSON 응답 자동 파싱
 * - 일관된 에러 처리
 */
export const fetchApi = async <T = unknown>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<T> => {
  // 기본 헤더 설정
  const headers = new Headers(init?.headers)
  headers.set('Accept', 'application/json')
  if (typeof init?.body === 'string') {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(input, {
    ...init,
    headers,
  })

  // 에러 처리
  if (!response.ok) {
    await handleApiError(response, 'API request failed')
  }

  return response.json()
}
