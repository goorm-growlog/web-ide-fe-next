'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  type SignupFormData,
  signupSchema,
} from '@/features/auth/lib/validation'

export const useSignupForm = () => {
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    mode: 'onChange',
  })

  return { form }
}
