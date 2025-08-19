import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { mockMessages } from '@/features/chat/fixtures/mock-data'
import SecondarySidebar from './secondary-sidebar'

const meta: Meta<typeof SecondarySidebar> = {
  title: 'Widgets/Sidebar/SecondarySidebar',
  component: SecondarySidebar,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof SecondarySidebar>

// Secondary Sidebar (Right)
export const Right: Story = {
  args: {
    messages: mockMessages,
    currentUserId: 1,
    onSendMessage: (_message: string) => {
      console.debug('Message sent')
    },
    position: 'right',
  },
}

// Secondary Sidebar (Left)
export const Left: Story = {
  args: {
    messages: mockMessages,
    currentUserId: 1,
    onSendMessage: (_message: string) => {
      console.debug('Message sent')
    },
    position: 'left',
  },
}
