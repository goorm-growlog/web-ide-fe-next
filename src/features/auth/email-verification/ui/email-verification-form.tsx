import { FormProvider } from 'react-hook-form'
import FormField from '@/features/auth/ui/form-field'
import InputWithButton from '@/features/auth/ui/input-with-button'
import { useEmailVerification } from '../model/use-email-verification'
import { useEmailVerificationForm } from '../model/use-email-verification-form'

interface Props {
  onSendCode?: (email: string) => Promise<void>
  onVerifyCode?: (code: string) => Promise<boolean>
}

const EmailVerificationForm = ({ onSendCode, onVerifyCode }: Props) => {
  const form = useEmailVerificationForm()
  const emailVerification = useEmailVerification({
    ...(onSendCode && { onSendCode }),
    ...(onVerifyCode && { onVerifyCode }),
  })

  return (
    <FormProvider {...form}>
      <form className="space-y-4 w-80">
        <FormField name="email" control={form.control} label="Email">
          {field => (
            <InputWithButton
              inputProps={{
                ...field,
                type: 'email',
                placeholder: 'Enter a valid email',
                disabled:
                  emailVerification.isSending || emailVerification.isVerified,
              }}
              buttonProps={{
                type: 'button',
                onClick: () =>
                  emailVerification.sendCode(form.getValues('email')),
                disabled:
                  emailVerification.isSending || emailVerification.isVerified,
              }}
              buttonText={emailVerification.isSending ? 'Sending...' : 'Send'}
            />
          )}
        </FormField>
        {emailVerification.isCodeSent && (
          <FormField name="code" control={form.control} label="인증코드">
            {field => (
              <InputWithButton
                inputProps={{
                  ...field,
                  placeholder: '코드 6자리',
                  maxLength: 6,
                  disabled:
                    emailVerification.isVerifying ||
                    emailVerification.isVerified,
                }}
                buttonProps={{
                  type: 'button',
                  onClick: () =>
                    emailVerification.verifyCode(form.getValues('code')),
                  disabled:
                    emailVerification.isVerifying ||
                    emailVerification.isVerified,
                  variant: emailVerification.isVerified ? 'outline' : 'default',
                }}
                buttonText={
                  emailVerification.isVerifying
                    ? 'Verifying...'
                    : emailVerification.isVerified
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
