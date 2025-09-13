import { z } from 'zod'
import { codeSchema } from '@/features/auth/lib/validation'
import { emailSchema } from '@/shared/lib/validation/email'

export const emailVerificationSchema = z.object({
  email: emailSchema,
  code: codeSchema.optional(),
})

export type EmailVerificationFormData = z.infer<typeof emailVerificationSchema>
