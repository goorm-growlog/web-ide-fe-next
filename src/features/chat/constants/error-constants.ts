/**
 * 채팅 관련 에러 메시지 상수
 */
export const CHAT_ERROR_MESSAGES = {
  UNKNOWN_MESSAGE: 'Unknown chat message type',
  MESSAGE_PARSING: 'Failed to parse chat message',
  LOG_MESSAGE_PARSING_FAILED: 'Chat message parsing failed',
  SUBSCRIPTION_FAILED: 'Failed to subscribe to chat',
  MESSAGE_SEND_FAILED: 'Failed to send chat message',
} as const
