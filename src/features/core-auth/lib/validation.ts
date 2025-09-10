import { z } from 'zod'

// 메시지 상수
export const EMAIL_REQUIRED_MSG = 'Please enter a valid email address'
export const NAME_REQUIRED_MSG = 'Name must be at least 2 characters'
export const LOGIN_PASSWORD_REQUIRED_MSG = 'Please enter your password.'
export const SIGNUP_PASSWORD_REQUIRED_MSG =
  'Password must be at least 8 characters.'
export const CODE_REQUIRED_MSG = 'Verification code must be 6 digits'
export const CURRENT_PASSWORD_REQUIRED_MSG =
  'Please enter your current password'
export const NEW_PASSWORD_REQUIRED_MSG =
  'New password must be at least 8 characters'

// 필드 단위 스키마
export const emailSchema = z.string().trim().email(EMAIL_REQUIRED_MSG)
export const nameSchema = z.string().trim().min(2, NAME_REQUIRED_MSG)
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
