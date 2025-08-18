import type { ParsedChatMessage } from '../model/types'

/**
 * 날짜 헤더 표시 여부를 결정하는 함수 생성기
 */
export const createDateHeaderVisibilityChecker = (
  parsedMessages: ParsedChatMessage[],
) => {
  return (currentIndex: number): boolean => {
    if (currentIndex === 0) return true

    const currentMessage = parsedMessages[currentIndex]
    const previousMessage = parsedMessages[currentIndex - 1]

    if (!currentMessage || !previousMessage) return true

    const currentDate = new Date(currentMessage.sentAt).toDateString()
    const previousDate = new Date(previousMessage.sentAt).toDateString()

    return currentDate !== previousDate
  }
}

/**
 * 메시지 키 생성을 담당하는 함수 생성기
 */
export const createMessageKeyGenerator = () => {
  return (message: ParsedChatMessage, index: number): string => {
    return `${message.userId}-${message.sentAt}-${index}`
  }
}
