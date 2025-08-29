import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import EmailVerificationForm from './email-verification-form'

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
          alert(`인증코드가 ${email}로 발송되었습니다`)
        }}
        onVerifyCode={async code => {
          await new Promise(r => setTimeout(r, 500))
          return code === '123456'
        }}
      />
    </div>
  ),
}
