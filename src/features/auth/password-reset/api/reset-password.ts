import type { PasswordResetPayload } from '@/features/auth/types'
import { API_BASE, requestApi } from '@/shared/api/config'

/**
 * 비밀번호 재설정 요청을 수행합니다.
 * @param payload 비밀번호 재설정 요청 데이터
 * @throws 요청 실패 시 에러
 */
export const resetPassword = async (
  payload: PasswordResetPayload,
): Promise<void> => {
  const url = `${API_BASE}/reset-password`
  await requestApi(url, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
