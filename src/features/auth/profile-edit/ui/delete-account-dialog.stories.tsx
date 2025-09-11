import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { Button } from '@/shared/ui/shadcn'
import DeleteAccountDialog from './delete-account-dialog'

const meta = {
  title: 'Features/Auth/DeleteAccountDialog',
  component: DeleteAccountDialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'A delete account confirmation dialog with different behaviors for social login vs regular login users.',
          '',
          '- **Social Login**: Shows warning message with direct confirmation',
          '- **Regular Login**: Requires password input for confirmation',
          '- **Error handling**: Shows toast messages on API errors',
          '- **Loading states**: Disables buttons and shows loading text during deletion',
          '',
          '---',
          '### Usage Example',
          '```tsx',
          '<DeleteAccountDialog',
          '  open={open}',
          '  onOpenChange={setOpen}',
          '  onConfirm={handleDeleteAccount}',
          '  isSocialLogin={user.isSocialLogin}',
          '/>',
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
    isSocialLogin: {
      control: 'boolean',
      description: 'Whether the user is logged in via social provider',
    },
    open: {
      control: 'boolean',
      description: 'Dialog open state',
    },
  },
} satisfies Meta<typeof DeleteAccountDialog>

export default meta
type Story = StoryObj

// 일반 로그인 사용자용 Dialog
const RegularLoginDialog = ({
  simulateError = false,
}: {
  simulateError?: boolean
}) => {
  const [open, setOpen] = useState(false)

  const handleDeleteAccount = async (password: string) => {
    // API 호출 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1500))

    if (simulateError) {
      throw new Error('Failed to delete account. Please try again.')
    }

    console.log('Account deleted with password:', password)
  }

  return (
    <div>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        Delete Account (Regular Login)
      </Button>
      <DeleteAccountDialog
        open={open}
        onOpenChange={setOpen}
        onConfirm={handleDeleteAccount}
        isSocialLogin={false}
      />
    </div>
  )
}

// 소셜 로그인 사용자용 Dialog
const SocialLoginDialog = ({
  simulateError = false,
}: {
  simulateError?: boolean
}) => {
  const [open, setOpen] = useState(false)

  const handleDeleteAccount = async () => {
    // API 호출 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1500))

    if (simulateError) {
      throw new Error('Failed to delete social account. Please try again.')
    }

    console.log('Social account deleted')
  }

  return (
    <div>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        Delete Account (Social Login)
      </Button>
      <DeleteAccountDialog
        open={open}
        onOpenChange={setOpen}
        onConfirm={handleDeleteAccount}
        isSocialLogin={true}
      />
    </div>
  )
}

export const RegularLogin: Story = {
  render: () => <RegularLoginDialog />,
  parameters: {
    docs: {
      description: {
        story: [
          'Delete account dialog for regular login users.',
          '',
          '- **Requires password**: User must enter their current password',
          '- **Form validation**: Password field is required',
          '- **Canvas tab**: Click the button to test the password input flow',
        ].join('\n'),
      },
    },
  },
}

export const SocialLogin: Story = {
  render: () => <SocialLoginDialog />,
  parameters: {
    docs: {
      description: {
        story: [
          'Delete account dialog for social login users (GitHub, Kakao, etc.).',
          '',
          '- **Direct confirmation**: No password required',
          '- **Warning message**: Shows permanent action warning',
          '- **Canvas tab**: Click the button to test the direct confirmation flow',
        ].join('\n'),
      },
    },
  },
}

export const RegularLoginWithError: Story = {
  render: () => <RegularLoginDialog simulateError={true} />,
  parameters: {
    docs: {
      description: {
        story: [
          'Regular login dialog with simulated API error.',
          '',
          '- **Error handling**: Shows toast error message',
          '- **Dialog remains open**: User can retry after error',
          '- **Canvas tab**: Enter any password and submit to see error handling',
        ].join('\n'),
      },
    },
  },
}

export const SocialLoginWithError: Story = {
  render: () => <SocialLoginDialog simulateError={true} />,
  parameters: {
    docs: {
      description: {
        story: [
          'Social login dialog with simulated API error.',
          '',
          '- **Error handling**: Shows toast error message',
          '- **Dialog remains open**: User can retry after error',
          '- **Canvas tab**: Click Delete Account to see error handling',
        ].join('\n'),
      },
    },
  },
}

// 비교를 위한 Side-by-Side 스토리 (문서용)
export const Comparison: Story = {
  render: () => (
    <div className="flex gap-4">
      <RegularLoginDialog />
      <SocialLoginDialog />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: [
          'Side-by-side comparison of both dialog types.',
          '',
          '- **Left**: Regular login (password required)',
          '- **Right**: Social login (direct confirmation)',
          '- **Canvas tab**: Test both flows to see the differences',
        ].join('\n'),
      },
    },
  },
}
