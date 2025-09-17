'use client'

import { useState } from 'react'
import type { ChatMessage, ChatReturn } from '@/features/chat/types/client'
import { ChatPanel } from '@/features/chat/ui/chat-panel'

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
        name: user || 'Unknown User',
      },
      timestamp,
    })
  }

  return messages
}

export default function ChatTestPage() {
  const [messages, setMessages] = useState(generateMockMessages(50))
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const loadMore = () => {
    if (isLoadingMore || !hasMore) return

    setIsLoadingMore(true)

    // 1.5초 후에 새로운 메시지 추가
    setTimeout(() => {
      const newMessages = generateMockMessages(20)
      setMessages(prev => [...newMessages, ...prev])
      setIsLoadingMore(false)

      // 200개 메시지가 되면 더 이상 로드하지 않음
      if (messages.length + 20 >= 200) {
        setHasMore(false)
      }
    }, 1500)
  }

  const sendMessage = (content: string) => {
    const newMessage: ChatMessage = {
      id: `new-${Date.now()}`,
      content,
      type: 'TALK',
      user: {
        name: 'Current User',
      },
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, newMessage])
  }

  const chatData: ChatReturn = {
    messages,
    isLoading: false,
    sendMessage,
    hasMore,
    loadMore,
    isLoadingMore,
  }

  return (
    <div className="h-screen w-full">
      <div className="flex h-full flex-col">
        <div className="border-b bg-gray-50 p-4">
          <h1 className="font-bold text-xl">Chat Panel Test</h1>
          <p className="text-gray-600 text-sm">
            Messages: {messages.length} | Has More: {hasMore ? 'Yes' : 'No'} |
            Loading: {isLoadingMore ? 'Yes' : 'No'}
          </p>
        </div>
        <div className="flex-1">
          <ChatPanel chatData={chatData} currentUserName="jaeyeopme" />
        </div>
      </div>
    </div>
  )
}
