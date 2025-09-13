import { z } from 'zod'
import { emailSchema } from '@/shared/lib/validation/email'
import { nameSchema } from '@/shared/lib/validation/name'

export const passwordResetSchema = z.object({
  name: nameSchema,
  email: emailSchema,
})

export type PasswordResetData = z.infer<typeof passwordResetSchema>
