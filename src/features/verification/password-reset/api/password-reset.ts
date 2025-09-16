import type { PasswordResetData } from '@/features/verification/password-reset/model/schema'
import { api } from '@/shared/api/ky-client'
import { apiHelpers } from '@/shared/lib/api-helpers'
import type { ApiResponse } from '@/shared/types/api'

/**
 * 비밀번호 재설정 요청 API
 */
export const resetPasswordApi = async (
  data: PasswordResetData,
): Promise<void> => {
  const response = await api
    .post('/auth/reset-password', {
      json: {
        name: data.name,
        email: data.email,
      },
    })
    .json<ApiResponse<void>>()

  apiHelpers.checkSuccess(response)
}
