import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import type { ChatMessage, ChatReturn } from '@/features/chat/types/client'
import { ChatPanel } from './chat-panel'

// 목 데이터 생성 함수
const generateMockMessages = (count: number): ChatMessage[] => {
  const messages: ChatMessage[] = []
  const users = ['Alice', 'Bob', 'Charlie', 'David', 'Eve']

  for (let i = 0; i < count; i++) {
    const user = users[i % users.length]
    const timestamp = new Date(Date.now() - (count - i) * 60000) // 1분 간격

    messages.push({
      id: `msg-${i}`,
      content: `This is message ${i + 1} from ${user}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
      type: 'TALK',
      user: {
        id: user.toLowerCase(),
        name: user,
      },
      timestamp,
    })
  }

  return messages
}

// 목 데이터로 ChatReturn 객체 생성
const createMockChatData = (
  messageCount: number,
  hasMore: boolean = true,
): ChatReturn => {
  const messages = generateMockMessages(messageCount)

  return {
    messages,
    isLoading: false,
    sendMessage: (content: string) => {
      console.log('Sending message:', content)
    },
    hasMore,
    loadMore: () => {
      console.log('Loading more messages...')
    },
    isLoadingMore: false,
  }
}

const meta: Meta<typeof ChatPanel> = {
  title: 'Features/Chat/ChatPanel',
  component: ChatPanel,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ChatPanel>

// 기본 스토리 - 적은 메시지
export const Default: Story = {
  args: {
    chatData: createMockChatData(10, true),
    currentUserId: 'alice',
  },
}

// 많은 메시지 - 무한 스크롤 테스트용
export const ManyMessages: Story = {
  args: {
    chatData: createMockChatData(50, true),
    currentUserId: 'alice',
  },
}

// 로딩 상태
export const Loading: Story = {
  args: {
    chatData: {
      messages: [],
      isLoading: true,
      sendMessage: () => {
        console.log('Send message called')
      },
      hasMore: true,
      loadMore: () => {
        console.log('Load more called')
      },
      isLoadingMore: false,
    },
    currentUserId: 'alice',
  },
}

// 더 이상 로드할 메시지가 없는 상태
export const NoMoreMessages: Story = {
  args: {
    chatData: createMockChatData(20, false),
    currentUserId: 'alice',
  },
}

// 무한 스크롤 테스트용 인터랙티브 스토리
export const InteractiveInfiniteScroll: Story = {
  render: () => {
    const [messages, setMessages] = useState(generateMockMessages(20))
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [hasMore, setHasMore] = useState(true)

    const loadMore = () => {
      if (isLoadingMore || !hasMore) return

      setIsLoadingMore(true)

      // 2초 후에 새로운 메시지 추가
      setTimeout(() => {
        const newMessages = generateMockMessages(10)
        setMessages(prev => [...newMessages, ...prev])
        setIsLoadingMore(false)

        // 100개 메시지가 되면 더 이상 로드하지 않음
        if (messages.length + 10 >= 100) {
          setHasMore(false)
        }
      }, 2000)
    }

    const chatData: ChatReturn = {
      messages,
      isLoading: false,
      sendMessage: (content: string) => {
        console.log('Sending message:', content)
        const newMessage: ChatMessage = {
          id: `new-${Date.now()}`,
          content,
          type: 'TALK',
          user: {
            id: 'current-user',
            name: 'Current User',
          },
          timestamp: new Date(),
        }
        setMessages(prev => [...prev, newMessage])
      },
      hasMore,
      loadMore,
      isLoadingMore,
    }

    return <ChatPanel chatData={chatData} currentUserId="alice" />
  },
}

// 스크롤 위치 테스트용 스토리
export const ScrollPositionTest: Story = {
  render: () => {
    const [messages, setMessages] = useState(generateMockMessages(100))
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [hasMore, setHasMore] = useState(true)

    const loadMore = () => {
      if (isLoadingMore || !hasMore) return

      setIsLoadingMore(true)

      setTimeout(() => {
        const newMessages = generateMockMessages(20)
        setMessages(prev => [...newMessages, ...prev])
        setIsLoadingMore(false)

        if (messages.length + 20 >= 200) {
          setHasMore(false)
        }
      }, 1500)
    }

    const chatData: ChatReturn = {
      messages,
      isLoading: false,
      sendMessage: (content: string) => {
        console.log('Sending message:', content)
      },
      hasMore,
      loadMore,
      isLoadingMore,
    }

    return <ChatPanel chatData={chatData} currentUserId="alice" />
  },
}

// 빈 메시지 상태
export const EmptyMessages: Story = {
  args: {
    chatData: {
      messages: [],
      isLoading: false,
      sendMessage: () => {
        console.log('Send message called')
      },
      hasMore: true,
      loadMore: () => {
        console.log('Load more called')
      },
      isLoadingMore: false,
    },
    currentUserId: 'alice',
  },
}

// 로딩 중인 무한 스크롤
export const LoadingMore: Story = {
  args: {
    chatData: {
      messages: generateMockMessages(20),
      isLoading: false,
      sendMessage: () => {
        console.log('Send message called')
      },
      hasMore: true,
      loadMore: () => {
        console.log('Load more called')
      },
      isLoadingMore: true,
    },
    currentUserId: 'alice',
  },
}
