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

// 조합 스키마
export const formSchema = z.object({
  email: emailSchema,
  name: nameSchema,
  password: signupPasswordSchema,
})

export const emailVerificationSchema = z.object({
  email: emailSchema,
  code: codeSchema.optional(),
})

export const passwordResetSchema = z.object({
  name: nameSchema,
  email: emailSchema,
})

export const profileEditSchema = z
  .object({
    name: nameSchema,
    currentPassword: z.string(),
    newPassword: z.string(),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    const newPassword = data.newPassword?.trim() || ''
    const currentPassword = data.currentPassword?.trim() || ''
    const confirmPassword = data.confirmPassword?.trim() || ''

    // 비밀번호 변경을 시도하지 않는 경우 (모두 비어있음) - 검증 통과
    if (!newPassword && !currentPassword && !confirmPassword) {
      return
    }

    // 새 비밀번호만 입력된 경우 - 현재 비밀번호 필수
    if (newPassword && !currentPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Current password is required when setting a new password',
        path: ['currentPassword'],
      })
    }

    // 새 비밀번호 길이 검증 (입력된 경우에만)
    if (newPassword && newPassword.length < 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: NEW_PASSWORD_REQUIRED_MSG,
        path: ['newPassword'],
      })
    }

    // 비밀번호 확인 검증
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      })
    }

    // 새 비밀번호가 있는데 확인 비밀번호가 없는 경우
    if (newPassword && !confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please confirm your new password',
        path: ['confirmPassword'],
      })
    }
  })

export type FormData = z.infer<typeof formSchema>
export type EmailVerificationFormData = z.infer<typeof emailVerificationSchema>
export type PasswordResetData = z.infer<typeof passwordResetSchema>
export type ProfileEditFormData = z.infer<typeof profileEditSchema>
