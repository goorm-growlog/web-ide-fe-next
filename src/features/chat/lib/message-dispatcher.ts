import { CHAT_ERROR_MESSAGES } from '@/features/chat/constants/error-constants'
import type { ChatMessageHandlers } from '@/features/chat/lib/chat-message-handlers'
import {
  CHAT_MESSAGE_TYPES,
  type ChatServerMessage,
} from '@/features/chat/types/api'
import { logger } from '@/shared/lib/logger'

export interface ChatMessageHandlerConfig {
  handlers: ChatMessageHandlers
  onError: (error: string) => void
}

export const createChatMessageDispatcher = ({
  handlers,
  onError,
}: ChatMessageHandlerConfig) => {
  return (message: { body: string }) => {
    try {
      const data: ChatServerMessage = JSON.parse(message.body)

      switch (data.type) {
        case CHAT_MESSAGE_TYPES.ENTER:
          handlers.handleEnterMessage(data.payload)
          break
        case CHAT_MESSAGE_TYPES.TALK:
          handlers.handleTalkMessage(data.payload)
          break
        case CHAT_MESSAGE_TYPES.LEAVE:
          handlers.handleLeaveMessage(data.payload)
          break
        default: {
          const unknownError = `Unknown chat message type: ${String(data)}`
          logger.warn(unknownError)
          onError(CHAT_ERROR_MESSAGES.UNKNOWN_MESSAGE)
        }
      }
    } catch (parseError) {
      logger.error(
        `${CHAT_ERROR_MESSAGES.LOG_MESSAGE_PARSING_FAILED}`,
        parseError,
      )
      onError(CHAT_ERROR_MESSAGES.MESSAGE_PARSING)
    }
  }
}
