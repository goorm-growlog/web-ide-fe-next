import { z } from 'zod'
import { emailSchema } from '@/shared/lib/validation/email'
import { nameSchema } from '@/shared/lib/validation/name'

// Auth 관련 메시지 상수
export const LOGIN_PASSWORD_REQUIRED_MSG = 'Please enter your password.'
export const SIGNUP_PASSWORD_REQUIRED_MSG =
  'Password must be at least 8 characters.'
export const CODE_REQUIRED_MSG = 'Verification code must be 6 digits'
export const CURRENT_PASSWORD_REQUIRED_MSG =
  'Please enter your current password'
export const NEW_PASSWORD_REQUIRED_MSG =
  'New password must be at least 8 characters'

// Auth 관련 필드 스키마
export const loginPasswordSchema = z
  .string()
  .min(1, LOGIN_PASSWORD_REQUIRED_MSG)
export const signupPasswordSchema = z
  .string()
  .min(8, SIGNUP_PASSWORD_REQUIRED_MSG)
export const codeSchema = z
  .string()
  .length(6, CODE_REQUIRED_MSG)
  .regex(/^\d{6}$/, CODE_REQUIRED_MSG)
export const currentPasswordSchema = z
  .string()
  .min(1, CURRENT_PASSWORD_REQUIRED_MSG)
export const newPasswordSchema = z.string().min(8, NEW_PASSWORD_REQUIRED_MSG)

// 로그인 스키마
export const loginSchema = z.object({
  email: emailSchema,
  password: loginPasswordSchema,
})

// 회원가입 스키마
export const signupSchema = z.object({
  email: emailSchema,
  name: nameSchema,
  password: signupPasswordSchema,
})

// 타입 정의
export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>

// 공통 스키마 재수출 (편의성을 위해)
export { emailSchema, nameSchema }
