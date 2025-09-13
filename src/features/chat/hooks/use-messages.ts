import { useCallback, useState } from 'react'
import {
  DEFAULT_USER_CONFIG,
  MESSAGE_CONFIG,
} from '@/features/chat/constants/chat-config'
import { mockMessages } from '@/features/chat/mocks/mock-messages'
import type { Message, TalkMessage } from '@/features/chat/types/message-types'

interface UseChatMessagesReturn {
  messages: Message[]
  sendMessage: (message: string) => void
}

/**
 * 메시지 전송 API 호출
 *
 * @todo 실제 API 엔드포인트로 교체 필요
 * @todo 에러 핸들링 및 재시도 로직 구현
 * @todo 사용자 정보를 동적으로 가져오기
 */
const onSendMessage = async (content: string): Promise<TalkMessage> => {
  await new Promise(resolve =>
    setTimeout(resolve, MESSAGE_CONFIG.SEND_MESSAGE_DELAY),
  )
  return {
    messageType: 'TALK',
    userId: DEFAULT_USER_CONFIG.DEFAULT_USER_ID,
    username: DEFAULT_USER_CONFIG.DEFAULT_USERNAME,
    content,
    sentAt: MESSAGE_CONFIG.DEFAULT_SENT_AT,
  }
}

export function useChatMessages(
  initialMessages: Message[] = mockMessages,
): UseChatMessagesReturn {
  const [messages, setMessages] = useState<Message[]>(initialMessages)

  const sendMessage = useCallback(async (message: string) => {
    try {
      const newMessage = await onSendMessage(message)
      setMessages(prev => [...prev, newMessage])
    } catch (error) {
      console.error('메시지 전송 실패:', error)
      throw error
    }
  }, [])

  return {
    messages,
    sendMessage,
  }
}
