import type { Meta, StoryObj } from '@storybook/nextjs'
import { TextInput } from './text-input'

const meta: Meta<typeof TextInput> = {
  title: 'Shared/TextInput',
  component: TextInput,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof TextInput>

export const Default: Story = {
  args: {
    onSend: (message: string) => {
      console.log('Message sent:', message)
    },
  },
}

export const CustomPlaceholder: Story = {
  args: {
    placeholder: 'Enter your comment...',
    buttonText: 'Post Comment',
    onSend: (message: string) => {
      console.log('Comment posted:', message)
    },
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    onSend: (message: string) => {
      console.log('Message sent:', message)
    },
  },
}

export const SearchInput: Story = {
  args: {
    placeholder: 'Enter search term...',
    buttonText: 'Search',
    onSend: (message: string) => {
      console.log('Search query:', message)
    },
  },
}
