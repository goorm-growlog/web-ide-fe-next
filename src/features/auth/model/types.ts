import { z } from 'zod'
import type { ApiResponse } from '@/shared/types/api'
import {
  emailSchema,
  loginPasswordSchema,
  type passwordResetSchema,
  type signupFormSchema,
} from './validation-schema'

// 폼 관련 타입
export const loginSchema = z.object({
  email: emailSchema,
  password: loginPasswordSchema,
})

export type LoginFormData = z.infer<typeof loginSchema>
export type PasswordResetFormData = z.infer<typeof passwordResetSchema>
export type SignupFormData = z.infer<typeof signupFormSchema>

// API 요청 타입
export type LoginPayload = LoginFormData
export type PasswordResetPayload = PasswordResetFormData
// 회원가입 API에는 passwordConfirm, profileImage 필드가 필요 없음 (email은 별도 관리)
export type SignupPayload = Omit<
  SignupFormData,
  'passwordConfirm' | 'profileImage'
> & {
  email: string // 이메일은 EmailVerificationForm에서 가져옴
}

// API 응답 데이터 타입
export interface LoginData {
  userId: number
  name: string
  accessToken: string
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

// 회원가입 응답 데이터 타입
export interface SignupData {
  userId: number
  name: string
  email: string
  profileImage?: string
}

// API 응답 타입 (일관된 구조)
export type LoginResponse = ApiResponse<LoginData>
export type RefreshTokenResponse = ApiResponse<RefreshTokenData>
export type UserInfoResponse = ApiResponse<UserInfoData>
export type SignupResponse = ApiResponse<SignupData>

// 사용자 타입 (전역에서 사용)
export interface User {
  id: string
  email: string
  name?: string
  profileImage: string | undefined
}
