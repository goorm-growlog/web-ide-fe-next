import { z } from 'zod'
import {
  emailSchema,
  nameSchema,
  signupPasswordSchema,
} from '@/features/auth/lib/validation'

export const signupSchema = z.object({
  email: emailSchema,
  password: signupPasswordSchema,
  name: nameSchema,
})

export type SignupFormData = z.infer<typeof signupSchema>
