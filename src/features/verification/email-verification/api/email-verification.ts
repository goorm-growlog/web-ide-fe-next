import { api } from '@/shared/api/ky-client'
import { apiHelpers } from '@/shared/lib/api-helpers'
import type { ApiResponse } from '@/shared/types/api'

/**
 * 이메일 인증코드 전송 API
 */
export const sendEmailVerificationCodeApi = async (
  email: string,
): Promise<void> => {
  const response = await api
    .post('/auth/email/send', {
      json: { email },
    })
    .json<ApiResponse<Record<string, string>>>()

  apiHelpers.checkSuccess(response)
}

/**
 * 이메일 인증코드 확인 API
 */
export const verifyEmailCodeApi = async (
  email: string,
  code: string,
): Promise<boolean> => {
  const response = await api
    .post('/auth/email/verify', {
      json: { email, code },
    })
    .json<ApiResponse<Record<string, boolean>>>()

  const data = apiHelpers.extractData(response)
  // API에서 반환하는 boolean 값을 추출 (키는 동적일 수 있음)
  return Object.values(data)[0] ?? false
}
