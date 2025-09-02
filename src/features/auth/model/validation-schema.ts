import { z } from 'zod'

// 메시지 상수
export const EMAIL_REQUIRED_MSG = 'Please enter a valid email address'
export const NAME_REQUIRED_MSG = 'Name must be at least 2 characters'
export const LOGIN_PASSWORD_REQUIRED_MSG = 'Please enter your password.'
export const SIGNUP_PASSWORD_REQUIRED_MSG =
  'Password must be at least 8 characters.'
export const PASSWORD_CONFIRM_REQUIRED_MSG = 'Please confirm your password.'
export const PASSWORD_MISMATCH_MSG = 'Passwords do not match.'
export const CODE_REQUIRED_MSG = 'Verification code must be 6 digits'

// 필드 단위 스키마
export const emailSchema = z.string().trim().email(EMAIL_REQUIRED_MSG)
export const nameSchema = z.string().trim().min(2, NAME_REQUIRED_MSG)
export const loginPasswordSchema = z
  .string()
  .min(1, LOGIN_PASSWORD_REQUIRED_MSG)
export const signupPasswordSchema = z
  .string()
  .min(8, SIGNUP_PASSWORD_REQUIRED_MSG)
export const passwordConfirmSchema = z
  .string()
  .min(1, PASSWORD_CONFIRM_REQUIRED_MSG)
export const codeSchema = z
  .string()
  .length(6, CODE_REQUIRED_MSG)
  .regex(/^\d{6}$/, CODE_REQUIRED_MSG)

// 조합 스키마 (사용되지 않는 formSchema 제거됨)

// 회원가입 폼 스키마 (이미지 UI 기준)
export const signupFormSchema = z
  .object({
    password: signupPasswordSchema,
    passwordConfirm: passwordConfirmSchema, // 비밀번호 확인
    username: nameSchema, // Name 필드
    profileImage: z.string().optional(), // 프로필 이미지 URL
  })
  .refine(data => data.password === data.passwordConfirm, {
    message: PASSWORD_MISMATCH_MSG,
    path: ['passwordConfirm'], // 에러를 passwordConfirm 필드에 표시
  })

export const emailVerificationSchema = z.object({
  email: emailSchema,
  code: codeSchema.optional(),
})

export const passwordResetSchema = z.object({
  name: nameSchema,
  email: emailSchema,
})

export type SignupFormData = z.infer<typeof signupFormSchema>
export type EmailVerificationFormData = z.infer<typeof emailVerificationSchema>
export type PasswordResetData = z.infer<typeof passwordResetSchema>
