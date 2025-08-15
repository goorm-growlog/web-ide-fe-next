import { FormProvider } from 'react-hook-form'
import FormField from '@/features/auth/ui/form-field'
import InputWithButton from '@/features/auth/ui/input-with-button'
import { useCodeVerification } from '../model/use-code-verification'
import { useEmailSend } from '../model/use-email-send'
import { useEmailVerificationForm } from '../model/use-email-verification-form'

interface Props {
  onSendCode?: (email: string) => Promise<void>
  onVerifyCode?: (code: string) => Promise<boolean>
}

const EmailVerificationForm = ({ onSendCode, onVerifyCode }: Props) => {
  const form = useEmailVerificationForm()
  const email = useEmailSend(onSendCode ? { onSendCode } : {})
  const code = useCodeVerification(onVerifyCode ? { onVerifyCode } : {})

  return (
    <FormProvider {...form}>
      <form className="space-y-4 w-full">
        <FormField name="email" control={form.control} label="Email">
          {field => (
            <InputWithButton
              {...field}
              placeholder="Enter a valid email"
              disabled={email.isSending || code.isVerified}
              buttonText={email.getButtonText()}
              buttonProps={{
                disabled: email.isSending || code.isVerified,
              }}
              onButtonClick={() => email.sendCode(form.getValues('email'))}
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
                disabled={code.isVerifying || code.isVerified}
                buttonText={code.getButtonText()}
                buttonProps={{
                  disabled: code.isVerifying || code.isVerified,
                }}
                onButtonClick={() => code.verifyCode(form.getValues('code'))}
              />
            )}
          </FormField>
        )}
      </form>
    </FormProvider>
  )
}
export default EmailVerificationForm
