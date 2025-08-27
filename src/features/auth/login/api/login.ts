import type { LoginPayload, User } from '@/features/auth/types'

/**
 * 로그인을 수행합니다.
 * @param payload 로그인 요청 데이터 (이메일, 비밀번호)
 * @returns 사용자 정보
 * @throws 로그인 실패 시 에러
 */
export const login = async (
  payload: LoginPayload,
): Promise<{ user: User; accessToken: string }> => {
  // 프록시를 통해 same-origin으로 요청
  const response = await fetch(`/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    credentials: 'include', // refreshToken을 HttpOnly 쿠키로 받기 위해
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error?.message || 'Login failed')
  }

  const data = await response.json()

  if (!data.success || !data.data) {
    throw new Error(data.error?.message || 'Login failed')
  }

  const { userId, name, accessToken } = data.data

  // accessToken을 LocalStorage에 저장
  localStorage.setItem('accessToken', accessToken)

  const user: User = {
    id: userId.toString(),
    email: payload.email,
    name: name,
    profileImage: undefined,
  }

  return { user, accessToken }
}
