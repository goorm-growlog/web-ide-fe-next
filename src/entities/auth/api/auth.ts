import type {
  LoginFormData,
  SignupFormData,
} from '@/features/auth/lib/validation'
import type { PasswordResetData } from '@/features/verification/password-reset/model/schema'
import { api, apiHelpers, authApi } from '@/shared/api/ky-client'
import type { ApiResponse } from '@/shared/types/api'

// Auth 관련 API 응답 타입들 - API 문서에 맞춰 수정
export interface LoginData {
  userId: number
  name: string
  accessToken: string
}

export interface SignupData {
  userId: number
  email: string
  name: string
}

/**
 * 로그인 API
 */
export const loginApi = async (data: LoginFormData): Promise<LoginData> => {
  const response = await api
    .post('auth/login', {
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
export const signupApi = async (data: SignupFormData): Promise<SignupData> => {
  const response = await api
    .post('users/signup', {
      json: {
        email: data.email,
        password: data.password,
        name: data.name,
      },
    })
    .json<ApiResponse<SignupData>>()

  return apiHelpers.extractData(response)
}

/**
 * 비밀번호 재설정 요청 API
 */
export const resetPasswordApi = async (
  data: PasswordResetData,
): Promise<void> => {
  const response = await api
    .post('auth/reset-password', {
      json: {
        name: data.name,
        email: data.email,
      },
    })
    .json<ApiResponse<void>>()

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
  const response = await api
    .post('auth/login/github', {
      json: {
        id: data.id,
        name: data.name,
        email: data.email,
        avatarUrl: data.avatarUrl,
      },
    })
    .json<ApiResponse<{ accessToken: string }>>()

  return apiHelpers.extractData(response)
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
    .post('auth/login/kakao', {
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
  const response = await authApi.post('auth/logout').json<ApiResponse<null>>()

  apiHelpers.checkSuccess(response)
}
