import { apiHelpers, authApi } from '@/shared/api/ky-client'
import type { ApiResponse } from '@/shared/types/api'
import type { User } from '@/shared/types/user'

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
    profileImage: userData.profileImage,
  }
}

/**
 * 사용자 이름을 업데이트합니다.
 */
export const updateUserName = async (name: string): Promise<void> => {
  await authApi.patch('users/me/name', { json: { name } })
}

/**
 * 비밀번호를 변경합니다.
 */
export const updatePassword = async (
  currentPassword: string,
  newPassword: string,
): Promise<void> => {
  await authApi.patch('users/me/password', {
    json: { currentPassword, newPassword },
  })
}

/**
 * 프로필 이미지를 업로드합니다.
 */
export const uploadProfileImage = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('profileImage', file)

  const response = await authApi
    .patch('users/profile-image', { body: formData })
    .json<ApiResponse<{ profileImageUrl: string }>>()

  if (!response.data?.profileImageUrl) {
    throw new Error('Failed to upload profile image')
  }

  return response.data.profileImageUrl
}

/**
 * 계정을 삭제합니다.
 */
export const deleteAccount = async (password: string): Promise<void> => {
  await authApi.delete('users/me', {
    json: { password },
  })
}
