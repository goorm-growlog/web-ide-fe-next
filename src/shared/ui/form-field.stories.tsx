import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState } from 'react'
import FormField from './form-field'
import PasswordInput from './password-input'

const meta: Meta<typeof FormField> = {
  title: 'shared/ui/FormField',
  component: FormField,
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    type: { control: 'select', options: ['text', 'email', 'password'] },
    disabled: { control: 'boolean' },
  },
}
export default meta

type Story = StoryObj<typeof FormField>

export const Default: Story = {
  args: {
    id: 'email',
    label: '이메일',
    placeholder: 'your@email.com',
    type: 'email',
  },
}

export const WithPassword: Story = {
  args: {
    id: 'password',
    label: '비밀번호',
    placeholder: '비밀번호를 입력하세요',
    type: 'password',
  },
}

export const WithPasswordInput: Story = {
  render: () => {
    const [password, setPassword] = useState('')
    return (
      <FormField id="password" label="비밀번호">
        <PasswordInput
          id="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="비밀번호를 입력하세요"
        />
      </FormField>
    )
  },
}

export const Disabled: Story = {
  args: {
    id: 'disabled-input',
    label: '비활성 필드',
    placeholder: '수정할 수 없습니다',
    disabled: true,
  },
}
