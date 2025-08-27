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
  // JSON body인 경우에만 Content-Type 추가
  const finalOptions = { ...defaultFetchOptions, ...options }
  if (options?.body && typeof options.body === 'string') {
    finalOptions.headers = {
      ...finalOptions.headers,
      'Content-Type': 'application/json',
    }
  }

  const res = await fetchWithAuth(url, finalOptions)

  if (!res.ok) {
    const errorText = await res.text().catch(() => 'Unknown error')

    // JSON 파싱 시도 (파싱 에러는 무시)
    let parsedMessage = errorText
    try {
      const errorJson = JSON.parse(errorText)
      parsedMessage = errorJson?.error?.message || errorText
    } catch {
      // JSON 파싱 실패 시 무시 (원본 errorText 사용)
    }

    throw new Error(parsedMessage)
  }

  return res.json()
}
