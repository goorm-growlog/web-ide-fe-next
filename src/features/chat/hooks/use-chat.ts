import { useCallback, useEffect, useMemo, useState } from 'react'
import { useWebSocketClient } from '@/entities/websocket/stores/websocket-client'
import {
  type ChatHistoryMessage,
  getChatHistory,
} from '@/features/chat/api/chat-history'
import { CHAT_WEBSOCKET_CONFIG } from '@/features/chat/config/websocket-config'
import { createChatMessageHandlers } from '@/features/chat/lib/chat-message-handlers'
import { sortMessagesByTimestamp } from '@/features/chat/lib/message-sorting-utils'
import {
  CHAT_MESSAGE_TYPES,
  type ChatServerMessage,
} from '@/features/chat/types/api'
import type { ChatMessage, ChatReturn } from '@/features/chat/types/client'
import { logger } from '@/shared/lib/logger'

interface UseChatProps {
  projectId: string
  isConnected: boolean
}

/**
 * 채팅 상태 관리 훅
 * WebSocket 구독을 통해 실시간 채팅 메시지 업데이트를 처리합니다.
 * WebSocket 연결은 외부에서 관리됩니다.
 */
const useChat = ({ projectId, isConnected }: UseChatProps): ChatReturn => {
  const { subscribe, unsubscribe, publish } = useWebSocketClient()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  /**
   * 서버 히스토리를 클라이언트 메시지로 변환
   * 입장/퇴장 메시지는 필터링하여 제외
   */
  const transformHistoryToMessages = useCallback(
    (historyItems: ChatHistoryMessage[]) => {
      return sortMessagesByTimestamp(
        historyItems
          .filter(msg => msg.messageType === CHAT_MESSAGE_TYPES.TALK)
          .map(msg => ({
            id: `${msg.projectId}-${msg.sentAt}`,
            content: msg.content,
            type: msg.messageType,
            user: {
              id: msg.username,
              name: msg.username,
            },
            timestamp: new Date(msg.sentAt),
          })),
      )
    },
    [],
  )

  /**
   * 채팅 메시지 발송
   */
  const sendMessage = useCallback(
    (content: string) => {
      if (!isConnected || !projectId || !content.trim()) return

      publish({
        destination: CHAT_WEBSOCKET_CONFIG.DESTINATIONS.PUBLISH_TALK(projectId),
        body: content.trim(),
      })
    },
    [isConnected, projectId, publish],
  )

  /**
   * 채팅 히스토리 불러오기
   */
  const loadChatHistory = useCallback(async () => {
    if (!projectId) {
      logger.debug('🔄 loadChatHistory: projectId is null, skipping')
      return
    }

    if (isLoading) {
      logger.debug('🔄 loadChatHistory: Already loading, skipping')
      return
    }

    try {
      logger.debug('🔄 loadChatHistory: Starting to load chat history', {
        projectId,
        currentPage,
        hasMore,
        isLoading,
      })

      const history = await getChatHistory(Number(projectId), {
        page: 0,
        size: 20,
      })

      const historyMessages = transformHistoryToMessages(history.content)

      logger.debug('✅ loadChatHistory: Successfully loaded chat history', {
        projectId,
        messageCount: historyMessages.length,
        totalElements: history.totalElements,
        pageNumber: history.pageNumber,
        totalPages: history.totalPages,
        hasMoreCalculation: `${history.pageNumber} < ${history.totalPages - 1} = ${history.pageNumber < history.totalPages - 1}`,
        willSetHasMore: history.pageNumber < history.totalPages - 1,
      })

      setMessages(historyMessages)
      setCurrentPage(0)
      const hasMoreMessages = history.pageNumber < history.totalPages - 1
      setHasMore(hasMoreMessages)

      logger.debug('📝 loadChatHistory: State updated', {
        messagesCount: historyMessages.length,
        currentPage: 0,
        hasMore: hasMoreMessages,
      })
    } catch (error) {
      logger.error('❌ loadChatHistory: Failed to load chat history', error)
    }
  }, [projectId, transformHistoryToMessages, isLoading, currentPage, hasMore]) // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * 추가 채팅 히스토리 불러오기 실행 함수
   */
  const executeLoadMore = useCallback(async () => {
    try {
      logger.debug('🚀 loadMoreHistory: Starting to load more history', {
        projectId,
        currentPage,
        nextPage: currentPage + 1,
      })

      setIsLoadingMore(true)

      const nextPage = currentPage + 1
      const history = await getChatHistory(Number(projectId), {
        page: nextPage,
        size: 5,
      })

      const newMessages = transformHistoryToMessages(history.content)

      logger.debug('✅ loadMoreHistory: Successfully loaded more history', {
        projectId,
        page: nextPage,
        messageCount: newMessages.length,
        totalElements: history.totalElements,
        totalPages: history.totalPages,
        hasMoreCalculation: `${nextPage} < ${history.totalPages - 1} = ${nextPage < history.totalPages - 1}`,
        willSetHasMore: nextPage < history.totalPages - 1,
      })

      // 과거 메시지를 앞쪽에 추가
      setMessages(prev => {
        const updated = [...newMessages, ...prev]
        logger.debug('📝 loadMoreHistory: Messages updated', {
          previousCount: prev.length,
          newCount: newMessages.length,
          totalCount: updated.length,
        })
        return updated
      })

      setCurrentPage(nextPage)
      const hasMoreMessages = nextPage < history.totalPages - 1
      setHasMore(hasMoreMessages)

      logger.debug('📝 loadMoreHistory: State updated', {
        currentPage: nextPage,
        hasMore: hasMoreMessages,
      })
    } catch (error) {
      logger.error(
        '❌ loadMoreHistory: Failed to load more chat history',
        error,
      )
    } finally {
      setIsLoadingMore(false)
      logger.debug('🏁 loadMoreHistory: Finished loading', {
        isLoadingMore: false,
      })
    }
  }, [projectId, currentPage, transformHistoryToMessages])

  /**
   * 추가 채팅 히스토리 불러오기 (무한 스크롤)
   */
  const loadMoreHistory = useCallback(async () => {
    logger.debug('🔄 loadMoreHistory: Function called', {
      projectId,
      hasMore,
      isLoading,
      isLoadingMore,
      currentPage,
    })

    if (!projectId || !hasMore || isLoading || isLoadingMore) {
      logger.debug('⏭️ loadMoreHistory: Skipping due to conditions', {
        projectId: !!projectId,
        hasMore,
        isLoading,
        isLoadingMore,
        reason: !projectId
          ? 'no projectId'
          : !hasMore
            ? 'no more data'
            : isLoading
              ? 'already loading'
              : 'loading more',
      })
      return
    }

    await executeLoadMore()
  }, [
    projectId,
    hasMore,
    isLoading,
    isLoadingMore,
    currentPage,
    executeLoadMore,
  ])

  /**
   * 채팅방 입장
   */
  const enterChat = useCallback(() => {
    if (!isConnected || !projectId) return

    publish({
      destination: CHAT_WEBSOCKET_CONFIG.DESTINATIONS.PUBLISH_ENTER(projectId),
      body: JSON.stringify({}),
    })
  }, [isConnected, projectId, publish])

  /**
   * 메시지 핸들러들 (한 번만 생성하여 안정성 확보)
   */
  const messageHandlers = useMemo(() => {
    return createChatMessageHandlers({
      setMessages,
      setIsLoading,
    })
  }, [])

  /**
   * 메시지 디스패처 함수 (안정적인 핸들러 사용)
   */
  const messageDispatcher = useCallback(
    (message: { body: string }) => {
      try {
        const data: ChatServerMessage = JSON.parse(message.body)

        switch (data.messageType) {
          case CHAT_MESSAGE_TYPES.ENTER:
            messageHandlers.handleEnterMessage(data)
            break
          case CHAT_MESSAGE_TYPES.TALK:
            messageHandlers.handleTalkMessage(data)
            break
          case CHAT_MESSAGE_TYPES.LEAVE:
            messageHandlers.handleLeaveMessage(data)
            break
          default:
            logger.warn(`Unknown chat message type: ${String(data)}`)
        }
      } catch (parseError) {
        logger.error('Chat message parsing failed:', parseError)
      }
    },
    [messageHandlers],
  )

  /**
   * WebSocket 연결 상태 변경 시 로딩 상태 업데이트
   */
  useEffect(() => {
    if (isConnected && messages.length >= 0) {
      // WebSocket 연결되고 메시지가 로드되었으면 로딩 완료
      setIsLoading(false)
    } else if (!isConnected) {
      // WebSocket 연결이 끊어지면 로딩 상태로
      setIsLoading(true)
    }
  }, [isConnected, messages.length])

  /**
   * 프로젝트 변경 시 채팅 히스토리 불러오기
   */
  useEffect(() => {
    if (projectId) {
      loadChatHistory()
    }
  }, [projectId, loadChatHistory])

  /**
   * WebSocket 연결 시 채팅 구독 설정
   */
  useEffect(() => {
    if (!isConnected || !projectId) return

    logger.debug('Setting up chat subscription for project:', projectId)

    // 채팅방 입장
    enterChat()

    // 채팅 구독
    const chatSubId = subscribe(
      CHAT_WEBSOCKET_CONFIG.DESTINATIONS.SUBSCRIBE(projectId),
      messageDispatcher,
    )

    logger.debug('Chat subscription created:', chatSubId)

    return () => {
      logger.debug('Cleaning up chat subscription:', chatSubId)
      if (chatSubId) {
        unsubscribe(chatSubId)
      }
    }
  }, [
    isConnected,
    projectId,
    subscribe,
    unsubscribe,
    messageDispatcher,
    enterChat,
  ])

  return useMemo(
    () => ({
      messages,
      isLoading,
      sendMessage,
      hasMore,
      loadMore: loadMoreHistory,
      isLoadingMore,
    }),
    [messages, isLoading, sendMessage, hasMore, loadMoreHistory, isLoadingMore],
  )
}

export default useChat
