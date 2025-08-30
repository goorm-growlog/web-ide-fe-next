import type { User, UserInfoResponse } from '@/features/auth/model/types'
import { authApi } from '@/shared/api/ky-client'
import { handleApiResponse } from '@/shared/lib/api-response-handler'

/**
 * 현재 사용자 정보를 조회합니다.
 * @returns 사용자 정보 객체
 * @throws 사용자 정보 조회 실패 시 에러
 */
export const getUser = async (): Promise<User> => {
  // 백엔드 API: GET /users/me (인증 필요)
  const response = await authApi.get('users/me').json<UserInfoResponse>()

  const data = handleApiResponse(response, 'Failed to get user info')

  return {
    id: data.userId.toString(),
    email: data.email,
    name: data.name,
    profileImage: data.profileImage,
  }
}
