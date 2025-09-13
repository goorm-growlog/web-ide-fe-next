import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import EmailVerificationForm from '@/features/verification/email-verification/ui/email-verification-form'
import { logger } from '@/shared/lib/logger'

const meta: Meta = {
  title: 'Features/Auth/EmailVerification/Example',
  parameters: { layout: 'centered' },
}
export default meta

type Story = StoryObj

export const EmailVerification: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <EmailVerificationForm
        onSendCode={async email => {
          await new Promise(r => setTimeout(r, 500))
          logger.debug('Code sent to:', email)
        }}
        onVerifyCode={async code => {
          await new Promise(r => setTimeout(r, 500))
          return code === '123456'
        }}
      />
    </div>
  ),
}
