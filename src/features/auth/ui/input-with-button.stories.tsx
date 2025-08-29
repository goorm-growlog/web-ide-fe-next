import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import InputWithButton from './input-with-button'

const meta: Meta<typeof InputWithButton> = {
  title: 'Features/Auth/InputWithButton',
  component: InputWithButton,
  parameters: { layout: 'centered' },
}
export default meta

type Story = StoryObj<typeof InputWithButton>

export const Basic: Story = {
  args: {
    inputProps: { placeholder: '입력 예시' },
    buttonText: '확인',
  },
}
