import type { Meta } from '@storybook/nextjs'
import { useState } from 'react'
import FormField from './form-field'
import PasswordInput from './password-input'

// 메타 설정과 적절한 타이핑
const meta: Meta<typeof FormField> = {
  title: 'Features/Auth/FormField',
  component: FormField,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Form field component - A reusable component that combines label and input field.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    id: {
      control: 'text',
      description: 'Unique ID for the input field',
    },
    label: {
      control: 'text',
      description: 'Label text for the field',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number'],
      description: 'Input field type',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the field is disabled',
    },
    children: {
      control: false,
      description: 'Custom input component (e.g., PasswordInput)',
    },
    containerClassName: {
      control: 'text',
      description: 'Additional CSS classes to apply to the container',
    },
  },
}

export default meta

// 커스텀 스토리 타입
interface CustomStoryObj {
  render?: () => React.ReactElement
  parameters?: Record<string, unknown>
}

export const Default: CustomStoryObj = {
  render: () => (
    <FormField
      id="email"
      label="Email"
      placeholder="your@email.com"
      type="email"
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Default email input field.',
      },
    },
  },
}

export const TextInput: CustomStoryObj = {
  render: () => (
    <FormField
      id="name"
      label="Name"
      placeholder="Enter your name"
      type="text"
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Text input field.',
      },
    },
  },
}

export const WithPasswordInput: CustomStoryObj = {
  render: () => {
    const [password, setPassword] = useState('')
    return (
      <FormField id="password" label="Password">
        <PasswordInput
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          placeholder="Enter your password"
        />
      </FormField>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of using PasswordInput component as children.',
      },
    },
  },
}

export const Disabled: CustomStoryObj = {
  render: () => (
    <FormField
      id="disabled-input"
      label="Disabled Field"
      placeholder="Cannot be modified"
      disabled={true}
      value="Read-only value"
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Disabled input field.',
      },
    },
  },
}

export const WithError: CustomStoryObj = {
  render: () => (
    <FormField
      id="error-field"
      label="Error State Field"
      placeholder="Enter your email"
      type="email"
      containerClassName="text-red-500"
      value="invalid-email"
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Field in error state. You can change styles using containerClassName.',
      },
    },
  },
}
