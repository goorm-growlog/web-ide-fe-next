import { authApi } from '@/shared/api/ky-client'
import type { ApiResponse } from '@/shared/types/api'

/**
 * 사용자 이름을 업데이트합니다 (개별 API 호출)
 */
export const updateUserName = async (name: string): Promise<void> => {
  await authApi.patch('users/me/name', { json: { name } })
}

/**
 * 비밀번호를 변경합니다 (개별 API 호출)
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
 * 프로필 이미지를 업로드합니다
 */
export const uploadProfileImage = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('profileImage', file) // 기존 프로젝트와 동일한 필드명 사용

  const response = await authApi
    .patch('users/profile-image', { body: formData }) // 기존과 동일한 엔드포인트와 메소드
    .json<ApiResponse<{ profileImageUrl: string }>>()

  if (!response.data?.profileImageUrl) {
    throw new Error('Failed to upload profile image')
  }

  return response.data.profileImageUrl
}

/**
 * 계정을 삭제합니다 (비밀번호 확인 필요)
 */
export const deleteAccount = async (password: string): Promise<void> => {
  await authApi.delete('users/me', {
    json: { password },
  })
}
