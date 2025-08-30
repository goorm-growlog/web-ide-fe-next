import { z } from 'zod'
import type { ApiResponse } from '@/shared/types/api'
import {
  emailSchema,
  loginPasswordSchema,
  nameSchema,
  type passwordResetSchema,
  signupPasswordSchema,
} from './validation-schema'

// 폼 관련 타입
export const loginSchema = z.object({
  email: emailSchema,
  password: loginPasswordSchema,
})

export const signupSchema = z.object({
  email: emailSchema,
  password: signupPasswordSchema,
  name: nameSchema,
})

export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>
export type PasswordResetFormData = z.infer<typeof passwordResetSchema>

// API 요청 타입
export type LoginPayload = LoginFormData
export type SignupPayload = SignupFormData
export type PasswordResetPayload = PasswordResetFormData

// API 응답 데이터 타입
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

export interface RefreshTokenData {
  accessToken: string
}

export interface UserInfoData {
  userId: number
  name: string
  email: string
  profileImage?: string
}

// API 응답 타입 (일관된 구조)
export type LoginResponse = ApiResponse<LoginData>
export type SignupResponse = ApiResponse<SignupData>
export type RefreshTokenResponse = ApiResponse<RefreshTokenData>
export type UserInfoResponse = ApiResponse<UserInfoData>

// 사용자 타입 (전역에서 사용)
export interface User {
  id: string
  email: string
  name?: string
  profileImage: string | undefined
}
