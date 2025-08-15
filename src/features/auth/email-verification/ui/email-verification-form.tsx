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
  const emailSend = useEmailSend({ onSendCode })
  const codeVerification = useCodeVerification({ onVerifyCode })

  return (
    <FormProvider {...form}>
      <form className="space-y-4 w-full">
        <FormField name="email" control={form.control} label="Email">
          {field => (
            <InputWithButton
              inputProps={{
                ...field,
                placeholder: 'Enter a valid email',
                disabled: emailSend.isSending || codeVerification.isVerified,
              }}
              buttonProps={{
                onClick: () => emailSend.sendCode(form.getValues('email')),
                disabled: emailSend.isSending || codeVerification.isVerified,
              }}
              buttonText={emailSend.isSending ? 'Sending...' : 'Send'}
            />
          )}
        </FormField>
        {emailSend.isCodeSent && (
          <FormField
            name="code"
            control={form.control}
            label="Verification Code"
          >
            {field => (
              <InputWithButton
                inputProps={{
                  ...field,
                  placeholder: 'Enter code',
                  maxLength: 6,
                  disabled:
                    codeVerification.isVerifying || codeVerification.isVerified,
                }}
                buttonProps={{
                  onClick: () =>
                    codeVerification.verifyCode(form.getValues('code')),
                  disabled:
                    codeVerification.isVerifying || codeVerification.isVerified,
                  variant: codeVerification.isVerified ? 'outline' : 'default',
                }}
                buttonText={
                  codeVerification.isVerifying
                    ? 'Verifying...'
                    : codeVerification.isVerified
                      ? 'Verified'
                      : 'Confirm'
                }
              />
            )}
          </FormField>
        )}
      </form>
    </FormProvider>
  )
}
export default EmailVerificationForm
