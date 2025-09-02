'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  type SignupFormData,
  signupFormSchema,
} from '../../model/validation-schema'

export const useSignupForm = () => {
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      password: '',
      passwordConfirm: '',
      username: '',
    },
    mode: 'onChange',
  })

  return { form }
}
