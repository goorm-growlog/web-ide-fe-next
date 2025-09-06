import { api, apiHelpers } from '@/shared/api/ky-client'
import type { ApiResponse } from '@/shared/types/api'

/**
 * 백엔드 로그아웃 API를 호출합니다.
 * Redis의 RefreshToken 삭제 및 쿠키 삭제 처리
 */
export const logoutApi = async (): Promise<void> => {
  const response = await api.post('auth/logout').json<ApiResponse<null>>()

  apiHelpers.checkSuccess(response)
}
