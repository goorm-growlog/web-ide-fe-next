import type {
  LoginData,
  LoginRequest,
  SignupRequest,
} from '@/entities/auth/model/types'
import { api, authApi } from '@/shared/api/ky-client'
import { apiHelpers } from '@/shared/lib/api-helpers'
import type { ApiResponse } from '@/shared/types/api'

/**
 * 로그인 API
 */
export const loginApi = async (data: LoginRequest): Promise<LoginData> => {
  const response = await api
    .post('/auth/login', {
      json: {
        email: data.email,
        password: data.password,
      },
    })
    .json<ApiResponse<LoginData>>()

  return apiHelpers.extractData(response)
}

/**
 * 회원가입 API
 */
export const signupApi = async (data: SignupRequest): Promise<void> => {
  const response = await api
    .post('/api/users/signup', {
      json: {
        email: data.email,
        password: data.password,
        username: data.name, // API 문서에서는 username 필드 사용
      },
    })
    .json<ApiResponse<Record<string, boolean>>>()

  apiHelpers.checkSuccess(response)
}

/**
 * 깃헙 소셜 로그인 API
 */
export const githubLoginApi = async (data: {
  id: string
  name: string | null
  email: string | null
  avatarUrl: string | null
}): Promise<{ accessToken: string }> => {
  // 서버는 절대 URL, 클라이언트는 상대 경로
  const baseUrl =
    typeof window === 'undefined'
      ? process.env.NEXTAUTH_URL || 'http://localhost:3000'
      : ''

  const response = await fetch(`${baseUrl}/auth/login/github`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      id: data.id,
      name: data.name,
      email: data.email,
      avatarUrl: data.avatarUrl,
    }),
  })

  if (!response.ok) {
    throw new Error(`GitHub login failed: ${response.status}`)
  }

  const result = (await response.json()) as ApiResponse<{ accessToken: string }>
  return apiHelpers.extractData(result)
}

/**
 * 카카오 소셜 로그인 API
 */
export const kakaoLoginApi = async (data: {
  userId: number
  name: string
  accessToken: string
}): Promise<{ accessToken: string }> => {
  const response = await api
    .post('/auth/login/kakao', {
      json: {
        userId: data.userId,
        name: data.name,
        accessToken: data.accessToken,
      },
    })
    .json<ApiResponse<{ accessToken: string }>>()

  return apiHelpers.extractData(response)
}

/**
 * 로그아웃 API
 */
export const logoutApi = async (): Promise<void> => {
  const response = await authApi.post('/auth/logout').json<ApiResponse<null>>()

  apiHelpers.checkSuccess(response)
}
