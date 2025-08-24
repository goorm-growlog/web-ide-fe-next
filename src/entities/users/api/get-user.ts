import type { User, UserInfoResponse } from '@/features/auth/types'
import { API_BASE, requestApi } from '@/shared/api/config'

/**
 * 현재 사용자 정보를 조회합니다.
 * @returns 사용자 정보 객체
 * @throws 사용자 정보 조회 실패 시 에러
 */
export const getUser = async (): Promise<User> => {
  const url = `${API_BASE}/users/me`
  const response = await requestApi<UserInfoResponse>(url)

  if (!response.success || !response.data) {
    throw new Error(response.error || 'Failed to get user info')
  }

  return {
    id: response.data.userId.toString(),
    email: response.data.email,
    name: response.data.name,
    profileImage: response.data.profileImage, // 추가
  }
}
