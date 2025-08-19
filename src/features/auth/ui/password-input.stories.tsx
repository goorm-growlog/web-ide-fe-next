import type { Meta } from '@storybook/nextjs'
import type { JSX } from 'react'
import { useState } from 'react'
import PasswordInput from './password-input'

// 메타 설정과 적절한 타이핑
const meta: Meta<typeof PasswordInput> = {
  title: 'Features/Auth/PasswordInput',
  component: PasswordInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Password input component - Password input field with show/hide toggle functionality.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the field is disabled',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply to the input field',
    },
    value: {
      control: false,
      description: 'Input value (for controlled component)',
    },
    onChange: {
      control: false,
      description: 'Value change handler',
    },
  },
}

export default meta

// value와 onChange가 필요하지 않은 커스텀 스토리 타입
interface CustomStoryObj {
  render?: () => JSX.Element
  parameters?: Record<string, unknown>
}

export const Default: CustomStoryObj = {
  render: () => {
    const [password, setPassword] = useState('')
    return (
      <PasswordInput
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Enter your password"
      />
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Default password input field. Click the eye icon to show or hide the password.',
      },
    },
  },
}

export const Disabled: CustomStoryObj = {
  render: () => {
    const [password, setPassword] = useState('')
    return (
      <PasswordInput
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Enter your password"
        disabled={true}
      />
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled password input field.',
      },
    },
  },
}
