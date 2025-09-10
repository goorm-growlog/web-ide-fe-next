import { z } from 'zod'
import { codeSchema, emailSchema } from '@/features/auth/lib/validation'

export const emailVerificationSchema = z.object({
  email: emailSchema,
  code: codeSchema.optional(),
})

export type EmailVerificationFormData = z.infer<typeof emailVerificationSchema>
