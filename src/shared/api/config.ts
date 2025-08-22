const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string

// 각 feature별 api 파일에서 아래 baseUrl만 import해서 사용
export const API_BASE = API_BASE_URL

export const defaultFetchOptions: RequestInit = {
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
}

export async function requestApi<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(url, { ...defaultFetchOptions, ...options })

  if (!res.ok) {
    const errorText = await res.text().catch(() => 'Unknown error')

    // JSON 파싱해서 에러 메시지만 추출
    try {
      const errorJson = JSON.parse(errorText)
      throw new Error(errorJson?.error?.message || errorText)
    } catch (parseError) {
      // JSON 파싱 실패 시 원본 텍스트 사용
      if (parseError instanceof Error && parseError.message !== errorText) {
        throw parseError // 이미 추출된 에러 메시지 re-throw
      }
      throw new Error(errorText)
    }
  }

  return res.json()
}
