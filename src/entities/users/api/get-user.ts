import type { User } from '@/features/auth/model/types'
import { authApi } from '@/shared/api/ky-client'

/**
 * 현재 사용자 정보를 조회합니다.
 * @returns 사용자 정보 객체
 * @throws 사용자 정보 조회 실패 시 에러
 */
export const getUser = async (): Promise<User> => {
  // 백엔드 API: GET /users/me (인증 필요)
  const response = await authApi.get('users/me').json<{
    success: boolean
    data?: {
      userId: number
      email: string
      name: string
      profileImage?: string
    }
    error?: string
  }>()

  if (!response.success || !response.data) {
    throw new Error(response.error || 'Failed to get user info')
  }

  // 간단한 인라인 변환
  return {
    id: response.data.userId.toString(),
    email: response.data.email,
    name: response.data.name,
    ...(response.data.profileImage && {
      profileImage: response.data.profileImage,
    }),
  }
}
