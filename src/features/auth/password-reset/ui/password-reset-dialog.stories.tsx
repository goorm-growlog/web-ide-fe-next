import type { Meta, StoryObj } from '@storybook/react'
import PasswordResetDialog from './password-reset-dialog'

const meta = {
  title: 'Features/Auth/PasswordResetDialog',
  component: PasswordResetDialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '이름과 이메일을 입력하여 임시 비밀번호를 발급받는 다이얼로그 컴포넌트입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: '다이얼로그 표시 여부',
    },
    isLoading: {
      control: 'boolean',
      description: '로딩 상태',
    },
  },
} satisfies Meta<typeof PasswordResetDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    open: true,
    isLoading: false,
    onOpenChange: () => {
      // Dialog state change handler
    },
    onSubmit: async () => {
      // API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000))
    },
  },
}

export const Loading: Story = {
  args: {
    ...Default.args,
    isLoading: true,
  },
}
