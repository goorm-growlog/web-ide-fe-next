import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { TextInput } from './text-input'

const meta: Meta<typeof TextInput> = {
  title: 'Shared/TextInput',
  component: TextInput,
  parameters: {
    layout: 'centered',
  },
  args: {
    onSend: (_message: string) => {
      console.debug('Message sent')
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof TextInput>

export const Default: Story = {
  args: {},
}

export const CustomPlaceholder: Story = {
  args: {
    placeholder: 'Enter your comment...',
    buttonText: 'Post Comment',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

export const SearchInput: Story = {
  args: {
    placeholder: 'Enter search term...',
    buttonText: 'Search',
  },
}
