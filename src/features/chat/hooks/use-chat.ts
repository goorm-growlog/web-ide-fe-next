import { useCallback, useEffect, useState } from 'react'
import { useWebSocketClient } from '@/entities/websocket/stores/websocket-client'
import { CHAT_WEBSOCKET_CONFIG } from '@/features/chat/config/websocket-config'
import { createChatMessageHandlers } from '@/features/chat/lib/chat-message-handlers'
import { createChatMessageDispatcher } from '@/features/chat/lib/message-dispatcher'
import type { ChatMessage } from '@/features/chat/types/client'
import { logger } from '@/shared/lib/logger'

/**
 * 채팅을 관리하는 커스텀 훅
 * WebSocket을 통한 실시간 채팅 메시지 관리
 *
 * @param projectId 프로젝트 ID
 * @returns 채팅 메시지들과 관련 상태들
 */
const useChat = (projectId: string) => {
  const { subscribe, unsubscribe, publish, isConnected } = useWebSocketClient()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)

  /**
   * 채팅 상태 초기화
   */
  const clear = useCallback(() => {
    setMessages([])
    setIsLoading(true)
  }, [])

  /**
   * WebSocket 연결 시 채팅 구독 설정
   */
  useEffect(() => {
    if (!isConnected) return

    // 프로젝트 변경 시 이전 데이터 정리
    clear()

    const handlers = createChatMessageHandlers({
      setMessages,
      setIsLoading,
    })

    const messageDispatcher = createChatMessageDispatcher({
      handlers,
      onError: error => logger.error('Chat message error:', error),
    })

    const subId = subscribe(
      CHAT_WEBSOCKET_CONFIG.DESTINATIONS.SUBSCRIBE(projectId),
      messageDispatcher,
    )

    return () => {
      if (subId) unsubscribe(subId)
    }
  }, [isConnected, projectId, subscribe, unsubscribe, clear])

  /**
   * 채팅 메시지 발송
   */
  const sendMessage = useCallback(
    (content: string) => {
      if (!isConnected) return

      publish({
        destination: CHAT_WEBSOCKET_CONFIG.DESTINATIONS.PUBLISH_TALK(projectId),
        body: JSON.stringify({ content }),
      })
    },
    [isConnected, projectId, publish],
  )

  return {
    messages,
    sendMessage,
    isLoading,
    clear,
  }
}

export default useChat
