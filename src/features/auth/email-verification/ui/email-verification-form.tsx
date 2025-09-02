'use client'

import { FormProvider } from 'react-hook-form'
import { FormField, InputWithButton } from '@/features/auth'
import { useCodeVerification } from '../model/use-code-verification'
import { useEmailSend } from '../model/use-email-send'
import { useEmailVerificationForm } from '../model/use-email-verification-form'

interface EmailVerificationFormProps {
  onSendCode?: (email: string) => Promise<void>
  onVerifyCode?: (code: string) => Promise<boolean>
}

/**
 * 이메일 인증 컴포넌트
 * - 독립적인 상태 관리 (FormProvider 사용하지만 div로 래핑)
 * - form 중첩 문제 해결을 위해 div 사용
 */
const EmailVerificationForm = ({
  onSendCode,
  onVerifyCode,
}: EmailVerificationFormProps) => {
  const email = useEmailSend({ onSendCode })
  const code = useCodeVerification({ onVerifyCode })
  const form = useEmailVerificationForm()

  const handleSendCode = async () => {
    const ok = await form.trigger('email')
    if (ok) {
      await email.sendCode(form.getValues('email'))
    }
  }

  const handleVerifyCode = async () => {
    const codeValue = form.getValues('code')
    if (codeValue) {
      await code.verifyCode(codeValue)
    }
  }

  return (
    <FormProvider {...form}>
      <div className="w-full space-y-4">
        <FormField name="email" control={form.control} label="Email">
          {field => (
            <InputWithButton
              {...field}
              onChange={e => {
                // 이메일이 변경되면 코드 관련 상태를 초기화합니다.
                if (
                  email.isCodeSent ||
                  code.isVerified ||
                  form.getValues('code')
                ) {
                  email.resetCodeSent()
                  form.setValue('code', '')
                }
                field.onChange(e)
              }}
              placeholder="Enter a valid email"
              type="email"
              autoComplete="email"
              disabled={email.isSending || code.isVerified}
              buttonText={email.getButtonText()}
              buttonProps={{
                disabled:
                  email.isSending || email.isCodeSent || code.isVerified,
                type: 'button',
                onClick: handleSendCode,
              }}
            />
          )}
        </FormField>

        {email.isCodeSent && (
          <FormField
            name="code"
            control={form.control}
            label="Verification Code"
          >
            {field => (
              <InputWithButton
                {...field}
                placeholder="Enter code"
                maxLength={6}
                autoComplete="one-time-code"
                inputMode="numeric"
                pattern="^[0-9]{6}$"
                disabled={code.isVerifying || code.isVerified}
                buttonText={code.getButtonText()}
                buttonProps={{
                  disabled: code.isVerifying || code.isVerified,
                  type: 'button',
                  onClick: handleVerifyCode,
                }}
              />
            )}
          </FormField>
        )}
      </div>
    </FormProvider>
  )
}

export default EmailVerificationForm
