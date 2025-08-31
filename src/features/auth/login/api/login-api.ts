import type { LoginFormData } from '../../model/types'

/**
 * 백엔드 로그인 API를 호출합니다.
 */
export const loginApi = async (data: LoginFormData) => {
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
