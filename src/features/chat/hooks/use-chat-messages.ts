import { useCallback, useState } from 'react'
import { mockMessages } from '@/features/chat/fixtures/mock-data'
import type { ChatMessage } from '@/features/chat/model/types'

interface UseChatMessagesReturn {
  messages: ChatMessage[]
  currentUserId: number
  sendMessage: (content: string) => void
  addMessage: (message: ChatMessage) => void
  clearMessages: () => void
}

export const useChatMessages = (
  initialUserId = 1,
  initialProjectId = 1,
): UseChatMessagesReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages)
  const [currentUserId] = useState(initialUserId)

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages(prev => [...prev, message])
  }, [])

  const sendMessage = useCallback(
    (content: string) => {
      const newMessage: ChatMessage = {
        projectId: initialProjectId,
        messageType: 'TALK',
        userId: currentUserId,
        username: `User ${currentUserId}`,
        content,
        sentAt: new Date().toISOString(),
      }
      addMessage(newMessage)
    },
    [currentUserId, initialProjectId, addMessage],
  )

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  return {
    messages,
    currentUserId,
    sendMessage,
    addMessage,
    clearMessages,
  }
}
