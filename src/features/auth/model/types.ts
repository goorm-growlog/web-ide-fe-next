import { z } from 'zod'
import {
  emailSchema,
  loginPasswordSchema,
  nameSchema,
  signupPasswordSchema,
} from './validation-schema'

export const loginSchema = z.object({
  email: emailSchema,
  password: loginPasswordSchema,
})

export const signupSchema = z.object({
  email: emailSchema,
  password: signupPasswordSchema,
  name: nameSchema,
})

export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>

export interface LoginData {
  userId: number
  name: string
  accessToken: string
}

export interface SignupData {
  userId: number
  email: string
  name: string
}
