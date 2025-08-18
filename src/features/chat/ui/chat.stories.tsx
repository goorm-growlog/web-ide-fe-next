import type { Meta, StoryObj } from '@storybook/react'
import { mockMessages } from '../model/mock-data'
import { Chat } from './chat'

const meta: Meta<typeof Chat> = {
  title: 'Features/Chat',
  component: Chat,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    Story => (
      <div
        style={{
          width: '400px',
          height: '600px',
          border: '1px solid #ccc',
        }}
      >
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    messages: mockMessages,
    currentUserId: 2,
    onSendMessage: (message: string) => {
      console.log('Message sent:', message)
    },
  },
}

export const EmptyChat: Story = {
  args: {
    messages: [],
    currentUserId: 2,
    onSendMessage: (message: string) => {
      console.log('Message sent:', message)
    },
  },
}

export const ManyMessages: Story = {
  args: {
    messages: mockMessages,
    currentUserId: 2,
    onSendMessage: (message: string) => {
      console.log('Message sent:', message)
    },
  },
}
