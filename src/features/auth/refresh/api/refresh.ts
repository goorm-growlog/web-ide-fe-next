import { handleApiError } from '@/shared/lib/api-error'
import type { RefreshTokenResponse } from '../../model/types'

/**
 * 토큰을 갱신합니다.
 * @returns 새로운 access token
 * @throws 토큰 갱신 실패 시 에러
 */
export const refreshToken = async (): Promise<string> => {
  // 순환 의존성 방지를 위해 직접 fetch 사용
  const response = await fetch('/auth/refresh', {
    method: 'POST',
    credentials: 'include', // refreshToken 쿠키 자동 전송
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    await handleApiError(response, 'Token refresh failed')
  }

  const data: RefreshTokenResponse = await response.json()

  if (!data.success || !data.data) {
    throw new Error(data.error || 'Token refresh failed')
  }

  return data.data.accessToken
}
