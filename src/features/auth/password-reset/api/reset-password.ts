import { api } from '@/shared/api/ky-client'
import { handleApiSuccess } from '@/shared/lib/api-response-handler'
import type { PasswordResetPayload } from '../../model/types'

/**
 * 비밀번호 재설정 요청을 수행합니다.
 * @param payload 비밀번호 재설정 요청 데이터
 * @throws 요청 실패 시 에러
 */
export const resetPassword = async (
  payload: PasswordResetPayload,
): Promise<void> => {
  // 백엔드 API: POST /auth/reset-password
  const response = await api
    .post('auth/reset-password', {
      json: {
        name: payload.name,
        email: payload.email,
      },
    })
    .json<{
      success: boolean
      error?: { code: string; message: string }
    }>()

  handleApiSuccess(response, 'Password reset failed')
}
