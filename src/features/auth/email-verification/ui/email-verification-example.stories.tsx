import type { Meta, StoryObj } from '@storybook/nextjs'
import FormField from '@/features/auth/ui/form-field'
import InputWithButton from '@/features/auth/ui/input-with-button'
import { Form } from '@/shared/ui/shadcn/form'
import { useEmailVerificationForm } from '../model/use-email-verification-form'

const meta: Meta = {
  title: 'Features/Auth/EmailVerification/Example',
  parameters: { layout: 'centered' },
}
export default meta

type Story = StoryObj

export const EmailVerification: Story = {
  render: () => {
    const { form, emailVerification } = useEmailVerificationForm({
      onSendCode: async email => {
        await new Promise(r => setTimeout(r, 500))
        alert(`인증코드가 ${email}로 발송되었습니다`)
      },
      onVerifyCode: async code => {
        await new Promise(r => setTimeout(r, 500))
        return code === '123456'
      },
    })
    return (
      <div style={{ width: 320 }}>
        <Form {...form}>
          <FormField name="email" control={form.control} label="Email">
            <InputWithButton
              inputProps={{
                type: 'email',
                placeholder: 'Enter a valid email',
                ...form.register('email'),
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
          </FormField>
          {emailVerification.isCodeSent && (
            <FormField name="code" control={form.control} label="인증코드">
              <InputWithButton
                inputProps={{
                  placeholder: '코드 6자리',
                  maxLength: 6,
                  ...form.register('code'),
                  disabled:
                    emailVerification.isVerifying ||
                    emailVerification.isVerified,
                }}
                buttonProps={{
                  type: 'button',
                  size: 'sm',
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
            </FormField>
          )}
        </Form>
      </div>
    )
  },
}
