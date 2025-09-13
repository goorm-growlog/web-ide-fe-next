import { FILE_EXPLORER_ERROR_MESSAGES } from '@/features/file-explorer/constants/error-constants'
import type { TreeMessageHandlers } from '@/features/file-explorer/lib/tree-message-handlers'
import {
  FILE_TREE_MESSAGE_TYPES,
  type FileTreeServerMessage,
} from '@/features/file-explorer/types/api'
import { logger } from '@/shared/lib/logger'

export interface MessageHandlerConfig {
  handlers: TreeMessageHandlers
  onError: (error: string) => void
}

export const createMessageDispatcher = ({
  handlers,
  onError,
}: MessageHandlerConfig) => {
  return (message: { body: string }) => {
    try {
      const data: FileTreeServerMessage = JSON.parse(message.body)

      switch (data.type) {
        case FILE_TREE_MESSAGE_TYPES.TREE_INIT:
          handlers.handleTreeInit(data.payload)
          break
        case FILE_TREE_MESSAGE_TYPES.TREE_ADD:
          handlers.handleTreeAdd(data.payload)
          break
        case FILE_TREE_MESSAGE_TYPES.TREE_REMOVE:
          handlers.handleTreeRemove(data.payload)
          break
        case FILE_TREE_MESSAGE_TYPES.TREE_MOVE:
          handlers.handleTreeMove(data.payload)
          break
        default: {
          const unknownError = `Unknown message type: ${String(data)}`
          logger.warn(unknownError)
          onError(FILE_EXPLORER_ERROR_MESSAGES.UNKNOWN_MESSAGE)
        }
      }
    } catch (parseError) {
      logger.error(
        `${FILE_EXPLORER_ERROR_MESSAGES.LOG_MESSAGE_PARSING_FAILED}`,
        parseError,
      )
      onError(FILE_EXPLORER_ERROR_MESSAGES.MESSAGE_PARSING)
    }
  }
}
