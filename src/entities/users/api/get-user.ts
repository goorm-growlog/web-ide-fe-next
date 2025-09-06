import type { User } from '@/entities/users/model/types'
import { apiHelpers, authApi } from '@/shared/api/ky-client'
import type { ApiResponse } from '@/shared/types/api'

interface UserApiData {
  userId: number
  email: string
  name: string
  profileImage?: string
}

/**
 * 현재 사용자 정보를 조회합니다.
 * @returns 사용자 정보 객체
 * @throws 사용자 정보 조회 실패 시 에러
 */
export const getUser = async (): Promise<User> => {
  // 백엔드 API: GET /users/me (인증 필요)
  const response = await authApi
    .get('users/me')
    .json<ApiResponse<UserApiData>>()

  const userData = apiHelpers.extractData(response)

  // API 응답을 User 타입으로 변환
  return {
    id: userData.userId.toString(),
    email: userData.email,
    name: userData.name,
    ...(userData.profileImage && {
      profileImage: userData.profileImage,
    }),
  }
}
