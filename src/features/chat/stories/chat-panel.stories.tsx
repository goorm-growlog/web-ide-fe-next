import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { mockMessages } from '@/features/chat/fixtures/mock'
import { ChatPanel } from '@/features/chat/ui/chat-panel'

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

export const GroupedMessages: Story = {
  args: {
    messages: [
      {
        userId: 1,
        messageType: 'TALK',
        username: '김철수',
        content: '안녕하세요! 오늘 프로젝트 진행 상황을 공유드리겠습니다.',
        sentAt: '2024-01-15T10:00:00Z',
      },
      {
        userId: 1,
        messageType: 'TALK',
        username: '김철수',
        content: '백엔드 API 개발이 80% 정도 완료되었어요.',
        sentAt: '2024-01-15T10:00:30Z',
      },
      {
        userId: 1,
        messageType: 'TALK',
        username: '김철수',
        content: '다음 주까지 완전히 마무리할 예정입니다.',
        sentAt: '2024-01-15T10:01:00Z',
      },
      {
        userId: 2,
        messageType: 'TALK',
        username: '나',
        content: '좋은 소식이네요!',
        sentAt: '2024-01-15T10:02:00Z',
      },
      {
        userId: 2,
        messageType: 'TALK',
        username: '나',
        content: '저도 프론트엔드 개발 진행 중입니다.',
        sentAt: '2024-01-15T10:02:30Z',
      },
      {
        userId: 2,
        messageType: 'TALK',
        username: '나',
        content: 'UI 컴포넌트들을 하나씩 완성해가고 있어요.',
        sentAt: '2024-01-15T10:03:00Z',
      },
      {
        userId: 2,
        messageType: 'TALK',
        username: '나',
        content: '테스트 코드도 함께 작성하고 있습니다.',
        sentAt: '2024-01-15T10:03:30Z',
      },
      {
        userId: 3,
        messageType: 'TALK',
        username: '박영희',
        content: '두 분 모두 고생하고 계시네요.',
        sentAt: '2024-01-15T10:05:00Z',
      },
    ],
  },
}

export const MixedGroupsWithSystemMessages: Story = {
  args: {
    messages: [
      {
        userId: 1,
        messageType: 'ENTER',
        username: '김철수',
        content: '김철수님이 입장했습니다.',
        sentAt: '2024-01-15T09:00:00Z',
      },
      {
        userId: 1,
        messageType: 'TALK',
        username: '김철수',
        content: '안녕하세요! 회의 시작하겠습니다.',
        sentAt: '2024-01-15T09:01:00Z',
      },
      {
        userId: 1,
        messageType: 'TALK',
        username: '김철수',
        content: '오늘 안건은 다음과 같습니다.',
        sentAt: '2024-01-15T09:01:30Z',
      },
      {
        userId: 2,
        messageType: 'ENTER',
        username: '나',
        content: '나님이 입장했습니다.',
        sentAt: '2024-01-15T09:02:00Z',
      },
      {
        userId: 2,
        messageType: 'TALK',
        username: '나',
        content: '네, 준비되었습니다!',
        sentAt: '2024-01-15T09:03:00Z',
      },
      {
        userId: 2,
        messageType: 'TALK',
        username: '나',
        content: '자료도 미리 검토해두었어요.',
        sentAt: '2024-01-15T09:03:30Z',
      },
      {
        userId: 3,
        messageType: 'ENTER',
        username: '박영희',
        content: '박영희님이 입장했습니다.',
        sentAt: '2024-01-15T09:05:00Z',
      },
      {
        userId: 3,
        messageType: 'TALK',
        username: '박영희',
        content: '죄송합니다. 조금 늦었네요.',
        sentAt: '2024-01-15T09:06:00Z',
      },
    ],
  },
}
