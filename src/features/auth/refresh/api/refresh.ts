import type { RefreshTokenResponse } from '@/features/auth/types'
import { AUTH_BASE, requestApi } from '@/shared/api/config'

/**
 * 토큰을 갱신합니다.
 * @returns 새로운 access token
 * @throws 토큰 갱신 실패 시 에러
 */
export const refreshToken = async (): Promise<string> => {
  const response = await requestApi<RefreshTokenResponse>(
    `${AUTH_BASE}/refresh`,
    {
      method: 'POST',
      credentials: 'include', // refreshToken 쿠키 자동 전송
    },
  )

  if (!response.success || !response.data) {
    throw new Error(response.error || 'Token refresh failed')
  }

  return response.data.accessToken
}
