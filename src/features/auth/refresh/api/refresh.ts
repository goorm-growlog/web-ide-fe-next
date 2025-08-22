import type { RefreshTokenResponse } from '@/features/auth/types'
import { API_BASE, requestApi } from '@/shared/api/config'

/**
 * 액세스 토큰을 갱신합니다.
 * @returns 새로운 액세스 토큰
 * @throws 토큰 갱신 실패 시 에러
 */
export const refreshAccessToken = async (): Promise<string> => {
  const url = `${API_BASE}/auth/refresh`
  const response = await requestApi<RefreshTokenResponse>(url, {
    method: 'POST',
  })

  if (!response.success || !response.data) {
    throw new Error(response.error || 'Token refresh failed')
  }

  return response.data.accessToken
}
