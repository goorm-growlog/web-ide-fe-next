import { z } from 'zod'
import { emailSchema, loginPasswordSchema } from '../../model/validation-schema'

export const loginSchema = z.object({
  email: emailSchema,
  password: loginPasswordSchema,
})

export type LoginFormData = z.infer<typeof loginSchema>

export interface LoginResult {
  success: boolean
  message?: string
  token?: string
  user?: {
    id: string
    email: string
    name?: string
  }
  errorCode?: string
}
