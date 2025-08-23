import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { mockMessages } from '@/features/chat/fixtures/mock-data'
import { ChatPanel } from './chat-panel'

const meta: Meta<typeof ChatPanel> = {
  title: 'Features/ChatPanel',
  component: ChatPanel,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    currentUserId: 2,
    onSendMessage: (_message: string) => {
      console.debug('Message sent')
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    messages: mockMessages,
  },
}

export const Empty: Story = {
  args: { messages: [] },
}

export const CodeLinksOnly: Story = {
  args: {
    messages: mockMessages.filter(msg => {
      if (!msg.content) return false

      const bracketPattern = /\[.*?\]/
      const fileTokenPattern = /#file:\S+/

      return (
        bracketPattern.test(msg.content) || fileTokenPattern.test(msg.content)
      )
    }),
  },
}

export const CodeLinksWithText: Story = {
  args: {
    messages: [
      {
        userId: 1,
        projectId: 1,
        messageType: 'TALK',
        username: 'John Doe',
        content:
          '이 파일을 확인해보세요: [Button.tsx:25](https://github.com/example/Button.tsx#L25) 그리고 여기서도 문제가 있어요: [App.tsx:10](https://github.com/example/App.tsx#L10)',
        sentAt: '2024-01-15T10:30:00Z',
      },
      {
        userId: 2,
        projectId: 1,
        messageType: 'TALK',
        username: 'Jane Doe',
        content:
          '네, [Button.tsx:25](https://github.com/example/Button.tsx#L25) 부분을 수정했습니다. [styles.module.css:15](https://github.com/example/styles.module.css#L15)도 함께 업데이트했어요.',
        sentAt: '2024-01-15T10:35:00Z',
      },
    ],
  },
}
