import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ChatPanel } from '@/features/chat/ui/chat-panel'

const meta: Meta<typeof ChatPanel> = {
  title: 'Features/ChatPanel',
  component: ChatPanel,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="flex border">
      <ChatPanel />
    </div>
  ),
}
