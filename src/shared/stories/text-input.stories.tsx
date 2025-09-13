import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { logger } from '@/shared/lib/logger'
import { TextInput } from '@/shared/ui/text-input'

const meta: Meta<typeof TextInput> = {
  title: 'Shared/TextInput',
  component: TextInput,
  parameters: {
    layout: 'centered',
  },
  args: {
    onSend: (message: string) => {
      logger.debug('TextInput onSend:', message)
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
