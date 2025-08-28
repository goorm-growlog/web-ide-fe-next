import { handleApiError } from '../lib/api-error'
import { fetchWithAuth } from './fetch-with-auth'

// API 베이스 URL
export const API_BASE = '/api'
export const AUTH_BASE = '/auth'

// 기본 fetch 옵션
export const defaultFetchOptions: RequestInit = {
  headers: {
    Accept: 'application/json',
  },
}

/**
 * 통합 API 요청 함수
 * - 자동 토큰 갱신 (fetchWithAuth)
 * - 일관된 에러 처리
 * - credentials 옵션 지원
 */
export async function requestApi<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  // 기본 옵션과 전달받은 옵션 병합
  const finalOptions = { ...defaultFetchOptions, ...options }

  // 문자열 body인 경우 Content-Type 설정
  if (typeof options?.body === 'string') {
    finalOptions.headers = {
      ...finalOptions.headers,
      'Content-Type': 'application/json',
    }
  }

  const res = await fetchWithAuth(url, finalOptions)

  if (!res.ok) {
    await handleApiError(res, 'API request failed')
  }

  return res.json()
}
