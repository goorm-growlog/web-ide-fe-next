import type { ChatMessage } from '@/features/chat/types/client'

/**
 * 날짜 헤더 표시 여부를 결정하는 함수
 *
 * @param messages - 채팅 메시지 배열
 * @param currentIndex - 현재 메시지의 인덱스
 * @returns 날짜 헤더를 표시해야 하는지 여부
 */
export const shouldShowDateHeader = (
  messages: ChatMessage[],
  currentIndex: number,
): boolean => {
  if (currentIndex === 0) return true

  const currentMessage = messages[currentIndex]
  const previousMessage = messages[currentIndex - 1]

  if (!currentMessage || !previousMessage) return true

  const currentDate = currentMessage.timestamp.toDateString()
  const previousDate = previousMessage.timestamp.toDateString()

  return currentDate !== previousDate
}

export const getSystemMessageText = ({
  type,
  userName,
  content,
}: ChatMessage): string => {
  if (type === 'ENTER') {
    return `${userName} joined this chatroom.`
  }
  if (type === 'LEAVE') {
    return `${userName} left this chatroom.`
  }
  return content || 'System message'
}
