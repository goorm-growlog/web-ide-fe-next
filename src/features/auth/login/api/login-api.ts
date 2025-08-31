import type { LoginData, LoginFormData } from '../../model/types'

/**
 * 백엔드 로그인 API를 호출합니다.
 * @param data 로그인 폼 데이터
 * @returns 로그인 성공 시 사용자 데이터와 액세스 토큰
 */
export const loginApi = async (data: LoginFormData): Promise<LoginData> => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      email: data.email,
      password: data.password,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData?.error?.message || 'Login failed')
  }

  const loginData = await response.json()

  if (!loginData.success) {
    throw new Error(loginData?.error?.message || 'Login failed')
  }

  return loginData.data
}
