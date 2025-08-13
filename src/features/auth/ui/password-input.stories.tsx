import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState } from 'react'
import PasswordInput from './password-input'

const meta: Meta<typeof PasswordInput> = {
  title: 'features/auth/PasswordInput',
  component: PasswordInput,
}
export default meta

type Story = StoryObj<typeof PasswordInput>

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <div style={{ width: 320 }}>
        <PasswordInput
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="비밀번호를 입력하세요"
        />
      </div>
    )
  },
}
