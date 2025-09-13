import { FormProvider } from 'react-hook-form'
import { useCodeVerification } from '@/features/auth/email-verification/model/use-code-verification'
import { useEmailSend } from '@/features/auth/email-verification/model/use-email-send'
import { useEmailVerificationForm } from '@/features/auth/email-verification/model/use-email-verification-form'
import FormField from '@/features/auth/ui/form-field'
import InputWithButton from '@/features/auth/ui/input-with-button'

interface Props {
  onSendCode?: (email: string) => Promise<void>
  onVerifyCode?: (code: string) => Promise<boolean>
}

const EmailVerificationForm = ({ onSendCode, onVerifyCode }: Props) => {
  const email = useEmailSend({ onSendCode })
  const code = useCodeVerification({ onVerifyCode })
  const form = useEmailVerificationForm()

  const handleSubmit = form.handleSubmit(data => {
    // 제출은 코드 검증에만 사용
    if (!email.isCodeSent) return
    code.verifyCode(data.code ?? '')
  })

  const handleSendCode = async () => {
    // 이메일 필드만 유효성 검사 후 전송
    const ok = await form.trigger('email')
    if (ok) {
      await email.sendCode(form.getValues('email'))
    }
  }

  return (
    <FormProvider {...form}>
      <form className="w-full space-y-4" onSubmit={handleSubmit}>
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
                // react-hook-form의 상태 업데이트를 위해 field.onChange를 호출합니다.
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
                  type: 'submit',
                }}
              />
            )}
          </FormField>
        )}
      </form>
    </FormProvider>
  )
}
export default EmailVerificationForm
