import { z } from 'zod'
import { emailSchema, nameSchema } from '@/shared/lib/validation'

export const passwordResetSchema = z.object({
  name: nameSchema,
  email: emailSchema,
})

export type PasswordResetData = z.infer<typeof passwordResetSchema>
