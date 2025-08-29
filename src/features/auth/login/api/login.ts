import { api } from '../../api/api-client'
import type { LoginPayload, LoginResponse, User } from '../../model/types'

/**
 * 로그인을 수행합니다.
 * @param payload 로그인 요청 데이터 (이메일, 비밀번호)
 * @returns 사용자 정보와 액세스 토큰
 * @throws 로그인 실패 시 에러
 */
export const login = async (
  payload: LoginPayload,
): Promise<{ user: User; accessToken: string }> => {
  const response = await api<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
    credentials: 'include', // refreshToken을 HttpOnly 쿠키로 받기 위해
  })

  // API 응답 검증
  if (!response.success || !response.data) {
    throw new Error(response.error || 'Login failed')
  }

  const { userId, name, accessToken } = response.data

  // userId가 undefined이거나 null인 경우 안전하게 처리
  if (userId == null) {
    throw new Error('Invalid user data: userId is missing')
  }

  const user: User = {
    id: String(userId), // toString() 대신 String() 사용으로 더 안전하게
    email: payload.email,
    name: name || '', // name도 안전하게 처리
    profileImage: undefined,
  }

  return { user, accessToken }
}
