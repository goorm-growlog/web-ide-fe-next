import {
  MESSAGE_TYPES,
  type Message,
  type SystemMessage,
} from '@/features/chat/types/message-types'

/**
 * 날짜 헤더 표시 여부를 결정하는 함수
 *
 * @param messages - 채팅 메시지 배열
 * @param currentIndex - 현재 메시지의 인덱스
 * @returns 날짜 헤더를 표시해야 하는지 여부
 */
export const shouldShowDateHeader = (
  messages: Message[],
  currentIndex: number,
): boolean => {
  if (currentIndex === 0) return true

  const currentMessage = messages[currentIndex]
  const previousMessage = messages[currentIndex - 1]

  if (!currentMessage || !previousMessage) return true

  const currentDate = new Date(currentMessage.sentAt).toDateString()
  const previousDate = new Date(previousMessage.sentAt).toDateString()

  return currentDate !== previousDate
}

export const getSystemMessageText = ({
  messageType,
  username,
  content,
}: SystemMessage): string => {
  if (messageType === MESSAGE_TYPES.ENTER) {
    return `${username} joined this chatroom.`
  }
  if (messageType === MESSAGE_TYPES.LEAVE) {
    return `${username} left this chatroom.`
  }
  return content || 'System message'
}
