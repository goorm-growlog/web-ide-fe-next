import { fetchApi } from '@/shared/api/fetch-api'
import type { PasswordResetPayload } from '../../model/types'

/**
 * 비밀번호 재설정 요청을 수행합니다.
 * @param payload 비밀번호 재설정 요청 데이터
 * @throws 요청 실패 시 에러
 */
export const resetPassword = async (
  payload: PasswordResetPayload,
): Promise<void> => {
  await fetchApi('/api/reset-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
