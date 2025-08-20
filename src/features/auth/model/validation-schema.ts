import { z } from 'zod'

// 메시지 상수
export const EMAIL_REQUIRED_MSG = 'Please enter a valid email address'
export const NAME_REQUIRED_MSG = 'Name must be at least 2 characters'
export const PASSWORD_REQUIRED_MSG = 'Password must be at least 8 characters'
export const CODE_REQUIRED_MSG = 'Verification code must be 6 digits'

// 필드 단위 스키마
export const emailSchema = z.string().trim().email(EMAIL_REQUIRED_MSG)
export const nameSchema = z.string().trim().min(2, NAME_REQUIRED_MSG)
export const passwordSchema = z.string().min(8, PASSWORD_REQUIRED_MSG)
export const codeSchema = z
  .string()
  .length(6, CODE_REQUIRED_MSG)
  .regex(/^\d{6}$/, CODE_REQUIRED_MSG)

// 조합 스키마
export const formSchema = z.object({
  email: emailSchema,
  name: nameSchema,
  password: passwordSchema,
})

export const emailVerificationSchema = z.object({
  email: emailSchema,
  code: codeSchema.optional(),
})

export const passwordResetSchema = z.object({
  name: nameSchema,
  email: emailSchema,
})

export type FormData = z.infer<typeof formSchema>
export type EmailVerificationFormData = z.infer<typeof emailVerificationSchema>
export type PasswordResetData = z.infer<typeof passwordResetSchema>
