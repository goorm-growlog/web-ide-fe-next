import type { LoginPayload, LoginResponse, User } from '@/features/auth/types'
import { AUTH_BASE, requestApi } from '@/shared/api/config'

/**
 * 로그인을 수행합니다.
 * @param payload 로그인 요청 데이터 (이메일, 비밀번호)
 * @returns 사용자 정보와 액세스 토큰
 * @throws 로그인 실패 시 에러
 */
export const login = async (
  payload: LoginPayload,
): Promise<{ user: User; accessToken: string }> => {
  const response = await requestApi<LoginResponse>(`${AUTH_BASE}/login`, {
    method: 'POST',
    body: JSON.stringify(payload),
    credentials: 'include', // refreshToken을 HttpOnly 쿠키로 받기 위해
  })

  if (!response.success || !response.data) {
    throw new Error(response.error || 'Login failed')
  }

  const { userId, name, accessToken } = response.data

  const user: User = {
    id: userId.toString(),
    email: payload.email,
    name: name,
    profileImage: undefined,
  }

  return { user, accessToken }
}
