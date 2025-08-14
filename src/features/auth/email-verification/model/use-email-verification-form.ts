import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useEmailVerification } from '../model/use-email-verification'

const schema = z.object({
  email: z.string().email('올바른 이메일을 입력해주세요'),
  code: z.string().min(6, '인증코드는 6자리입니다'),
})

export type EmailVerificationFormData = z.infer<typeof schema>

export function useEmailVerificationForm(options?: {
  onSendCode?: (email: string) => Promise<void>
  onVerifyCode?: (code: string) => Promise<boolean>
}) {
  const form = useForm<EmailVerificationFormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', code: '' },
  })
  const emailVerification = useEmailVerification({
    ...(options?.onSendCode ? { onSendCode: options.onSendCode } : {}),
    ...(options?.onVerifyCode ? { onVerifyCode: options.onVerifyCode } : {}),
  })
  return { form, emailVerification }
}
