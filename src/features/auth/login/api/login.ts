import type { LoginPayload, LoginResponse, User } from '@/features/auth/types'
import { API_BASE, requestApi } from '@/shared/api/config'

/**
 * 로그인을 수행합니다.
 * @param payload 로그인 요청 데이터 (이메일, 비밀번호)
 * @returns 사용자 정보
 * @throws 로그인 실패 시 에러
 */
export const login = async (payload: LoginPayload): Promise<User> => {
  const url = `${API_BASE}/auth/login`
  const response = await requestApi<LoginResponse>(url, {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  // 성공 응답 처리 및 데이터 변환
  if (!response.success || !response.data) {
    throw new Error(response.error || 'Login failed')
  }

  return {
    id: response.data.userId.toString(),
    email: payload.email,
    name: response.data.name,
    profileImage: undefined, // 로그인 시에는 profileImage 없음
  }
}
