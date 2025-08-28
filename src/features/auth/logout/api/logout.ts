import { AUTH_BASE, requestApi } from '@/shared/api/config'
import type { ApiResponse } from '@/shared/types/api'

/**
 * 로그아웃을 수행합니다.
 * @throws 로그아웃 실패 시 에러
 */
export const logout = async (): Promise<void> => {
  const response = await requestApi<ApiResponse<null>>(`${AUTH_BASE}/logout`, {
    method: 'POST',
    credentials: 'include', // refreshToken 쿠키 자동 전송
  })

  if (!response.success) {
    throw new Error(response.error || 'Logout failed')
  }
}
