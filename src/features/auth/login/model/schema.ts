import { z } from 'zod'
import {
  emailSchema,
  loginPasswordSchema,
} from '@/features/auth/lib/validation'

export const loginSchema = z.object({
  email: emailSchema,
  password: loginPasswordSchema,
})

export type LoginFormData = z.infer<typeof loginSchema>
