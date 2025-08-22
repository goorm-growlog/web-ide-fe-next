import type { Meta, StoryObj } from '@storybook/nextjs'
import { SOCIAL_PROVIDERS } from '@/features/auth/login/model/social-login'
import SocialButton from './social-button'

const meta: Meta<typeof SocialButton> = {
  title: 'Features/Auth/SocialButton',
  component: SocialButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    provider: {
      control: { type: 'select' },
      options: [SOCIAL_PROVIDERS.KAKAO, SOCIAL_PROVIDERS.GITHUB],
    },
    onClick: { action: 'clicked' },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Kakao: Story = {
  args: {
    provider: SOCIAL_PROVIDERS.KAKAO,
  },
}

export const GitHub: Story = {
  args: {
    provider: SOCIAL_PROVIDERS.GITHUB,
  },
}

export const AllButtons: Story = {
  render: () => (
    <div className="flex space-x-4">
      <SocialButton provider="github" />
      <SocialButton provider="kakao" />
    </div>
  ),
}
