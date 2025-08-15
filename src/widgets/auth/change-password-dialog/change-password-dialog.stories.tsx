import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState } from 'react'
import ChangePasswordDialog from './index'

const meta: Meta<typeof ChangePasswordDialog> = {
  title: 'Widgets/Auth/ChangePasswordDialog',
  component: ChangePasswordDialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '비밀번호 변경 다이얼로그 위젯. 이메일 인증 후 새 비밀번호를 입력할 수 있습니다.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(true)
    return (
      <ChangePasswordDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={async data => {
          alert(`비밀번호 변경: ${JSON.stringify(data, null, 2)}`)
        }}
      />
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          '이메일 인증 → 새 비밀번호 입력 → Submit 흐름을 테스트할 수 있습니다.',
      },
    },
  },
}
