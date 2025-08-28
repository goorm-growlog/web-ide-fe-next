import { handleApiError } from '../lib/api-error'
import { fetchWithAuth } from './fetch-with-auth'

// 모든 API를 프록시를 통해 호출
export const API_BASE = '/api'

// fetchWithAuth가 토큰을 자동으로 처리하므로 기본 옵션에서 제거
export const defaultFetchOptions: RequestInit = {
  headers: {
    Accept: 'application/json',
  },
}

export async function requestApi<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  // 기본 옵션과 전달받은 옵션 병합
  const finalOptions = { ...defaultFetchOptions, ...options }

  // 문자열 body인 경우 Content-Type이 없으면 JSON으로 설정
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
