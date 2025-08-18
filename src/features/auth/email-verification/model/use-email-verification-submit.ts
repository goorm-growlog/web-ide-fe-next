import type { UseFormReturn } from 'react-hook-form'
import type { EmailVerificationFormData } from '@/features/auth/model/validation-schema'

export interface UseEmailVerificationSubmitOptions {
  form: UseFormReturn<EmailVerificationFormData>
  email: ReturnType<typeof import('./use-email-send').useEmailSend>
  code: ReturnType<typeof import('./use-code-verification').useCodeVerification>
}

export const useEmailVerificationSubmit = ({
  form,
  email,
  code,
}: UseEmailVerificationSubmitOptions) => {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email.isCodeSent) {
      const valid = await form.trigger('email')
      const value = form.getValues('email')
      if (valid && value) email.sendCode(value)
    } else {
      const valid = await form.trigger('code')
      const value = form.getValues('code')
      if (valid && value) code.verifyCode(value)
    }
  }
  return { handleSubmit }
}
