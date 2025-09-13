import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import SocialButton from '@/shared/ui/auth/social-button'

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
      options: ['kakao', 'github'],
    },
    onClick: { action: 'clicked' },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Kakao: Story = {
  args: {
    provider: 'kakao',
  },
}

export const GitHub: Story = {
  args: {
    provider: 'github',
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
