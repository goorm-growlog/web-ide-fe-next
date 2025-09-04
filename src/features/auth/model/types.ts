import { z } from 'zod'
import type { ApiResponse } from '@/shared/types/api'
import type { UserInfoData } from '@/shared/types/user'
import {
  emailSchema,
  loginPasswordSchema,
  type passwordResetSchema,
} from './validation-schema'

// 폼 관련 타입
export const loginSchema = z.object({
  email: emailSchema,
  password: loginPasswordSchema,
})

export type LoginFormData = z.infer<typeof loginSchema>
export type PasswordResetFormData = z.infer<typeof passwordResetSchema>

// API 요청 타입
export type LoginPayload = LoginFormData
export type PasswordResetPayload = PasswordResetFormData

// API 응답 데이터 타입
export interface LoginData {
  userId: number
  name: string
  accessToken: string
}

export interface RefreshTokenData {
  accessToken: string
}

// API 응답 타입 (일관된 구조)
export type LoginResponse = ApiResponse<LoginData>
export type RefreshTokenResponse = ApiResponse<RefreshTokenData>
export type UserInfoResponse = ApiResponse<UserInfoData>
