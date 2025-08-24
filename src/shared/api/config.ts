const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string

// 각 feature별 api 파일에서 아래 baseUrl만 import해서 사용
export const API_BASE = API_BASE_URL

export const defaultFetchOptions: RequestInit = {
  credentials: 'include',
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

  const res = await fetch(url, finalOptions)

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
