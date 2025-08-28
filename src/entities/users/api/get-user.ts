import { api } from '@/entities/users/api-client'
import type { User, UserInfoData } from '@/features/auth/model/types'

/**
 * 현재 사용자 정보를 조회합니다.
 * @returns 사용자 정보 객체
 * @throws 사용자 정보 조회 실패 시 에러
 */
export const getUser = async (): Promise<User> => {
  const response = await api<UserInfoData>('/api/users/me')

  return {
    id: response.userId.toString(),
    email: response.email,
    name: response.name,
    profileImage: response.profileImage,
  }
}
