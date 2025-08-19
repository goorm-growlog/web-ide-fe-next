import type { ParsedChatMessage } from '../model/types'

/**
 * 날짜 헤더 표시 여부를 결정하는 함수
 *
 * @param parsedMessages - 파싱된 채팅 메시지 배열
 * @param currentIndex - 현재 메시지의 인덱스
 * @returns 날짜 헤더를 표시해야 하는지 여부
 */
export const shouldShowDateHeader = (
  parsedMessages: ParsedChatMessage[],
  currentIndex: number,
): boolean => {
  if (currentIndex === 0) return true

  const currentMessage = parsedMessages[currentIndex]
  const previousMessage = parsedMessages[currentIndex - 1]

  if (!currentMessage || !previousMessage) return true

  const currentDate = new Date(currentMessage.sentAt).toDateString()
  const previousDate = new Date(previousMessage.sentAt).toDateString()

  return currentDate !== previousDate
}

/**
 * 메시지의 고유 키를 생성하는 함수
 *
 * @param message - 채팅 메시지 객체
 * @param index - 메시지의 인덱스
 * @returns 메시지의 고유 키 문자열
 */
export const generateMessageKey = (
  message: ParsedChatMessage,
  index: number,
): string => {
  return `${message.userId}-${message.sentAt}-${index}`
}

/**
 * 메시지가 현재 사용자의 것인지 확인하는 함수
 *
 * @param message - 채팅 메시지 객체
 * @param currentUserId - 현재 사용자의 ID
 * @returns 메시지가 현재 사용자의 것인지 여부
 */
export const isOwnMessage = (
  message: ParsedChatMessage,
  currentUserId: number,
): boolean => {
  return currentUserId === message.userId
}

/**
 * 메시지가 시스템 메시지인지 확인하는 타입 가드
 *
 * @param message - 확인할 메시지
 * @returns 시스템 메시지인지 여부
 */
export const isSystemMessage = (
  message: ParsedChatMessage,
): message is ParsedChatMessage => {
  return message.messageType === 'ENTER' || message.messageType === 'LEAVE'
}

/**
 * 외부 링크인지 판별하는 함수
 *
 * @param url - 확인할 URL
 * @returns 외부 링크인지 여부
 */
export const isExternalLink = (url: string): boolean => {
  if (url.startsWith('/')) return false

  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    if (siteUrl) return new URL(url).origin !== new URL(siteUrl).origin
    return true
  } catch {
    return false
  }
}
