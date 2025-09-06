import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { Button } from '@/shared/ui/shadcn'
import PasswordResetDialog from './password-reset-dialog'

const meta = {
  title: 'Features/Auth/PasswordResetDialog',
  component: PasswordResetDialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'A password reset dialog component following the shadcn Dialog standard structure.',
          '',
          '- **Dialog structure**: Dialog > DialogContent > DialogHeader > PasswordResetForm > DialogFooter',
          '- **Separation of form fields and buttons**: Form handles only fields, buttons are managed in DialogFooter',
          '- **Test real interaction in the Canvas tab**',
          '- **Docs tab is for visual preview only**',
          '',
          '---',
          '### Usage Example',
          '```tsx',
          '<PasswordResetDialog open={open} onOpenChange={setOpen} onSubmit={...} />',
          '```',
        ].join('\n'),
      },
      source: {
        language: 'tsx',
        type: 'dynamic',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    isLoading: {
      control: 'boolean',
      description: 'Loading state',
    },
    open: {
      control: 'boolean',
      description: 'Dialog open state',
    },
  },
} satisfies Meta<typeof PasswordResetDialog>

export default meta
type Story = StoryObj

// 버튼 클릭으로 Dialog를 여는 컴포넌트
const DialogWithTrigger = ({ isLoading = false }: { isLoading?: boolean }) => {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <Button onClick={() => setOpen(true)}>비밀번호 재설정</Button>
      <PasswordResetDialog
        open={open}
        onOpenChange={setOpen}
        isLoading={isLoading}
        onSubmit={async () => {
          // API 호출 시뮬레이션
          await new Promise(resolve => setTimeout(resolve, 1000))
        }}
      />
    </div>
  )
}

export const Default: Story = {
  render: () => <DialogWithTrigger />,
  parameters: {
    docs: {
      description: {
        story: [
          'Click the button to open the password reset dialog.',
          '',
          '- **Canvas tab**: You can test the dialog by clicking the button.',
          '- **Docs tab**: See a visual preview and usage details.',
        ].join('\n'),
      },
      source: {
        type: 'dynamic',
      },
    },
  },
}

export const Loading: Story = {
  render: () => <DialogWithTrigger isLoading={true} />,
  parameters: {
    docs: {
      description: {
        story: [
          'Dialog in loading (Processing...) state.',
          '',
          '- **Canvas tab**: Click the button to see the loading state.',
        ].join('\n'),
      },
    },
  },
}
