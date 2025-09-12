import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  type EmailVerificationFormData,
  emailVerificationSchema,
} from './schema'

export function useEmailVerificationForm() {
  return useForm<EmailVerificationFormData>({
    resolver: zodResolver(emailVerificationSchema),
    defaultValues: { email: '', code: '' },
    mode: 'onChange',
  })
}
