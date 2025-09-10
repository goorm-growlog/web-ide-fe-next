import { z } from 'zod'
import {
  NEW_PASSWORD_REQUIRED_MSG,
  nameSchema,
} from '@/features/core-auth/lib/validation'

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

export type ProfileEditFormData = z.infer<typeof profileEditSchema>
