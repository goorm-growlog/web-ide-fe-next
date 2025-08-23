import { CHAT_MESSAGE_STYLES } from '@/features/chat/ui/constants/chat-styles'
import type { MessageClassNames, ParsedChatMessage } from '../model/types'

// ============================================================================
// 날짜 및 시간 관련 유틸리티
// ============================================================================

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

// ============================================================================
// 사용자 및 메시지 타입 관련 유틸리티
// ============================================================================

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
export const isSystemMessage = (message: ParsedChatMessage): boolean => {
  return message.messageType === 'ENTER' || message.messageType === 'LEAVE'
}

// ============================================================================
// 링크 및 타입 관련 유틸리티
// ============================================================================

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
    if (!siteUrl) return false

    return new URL(url).origin !== new URL(siteUrl).origin
  } catch {
    return false
  }
}

// ============================================================================
// 스타일링 및 접근성 관련 유틸리티
// ============================================================================

/**
 * 메시지 타입에 따른 CSS 클래스명들을 생성하는 함수
 *
 * @param isOwnMessage - 내 메시지 여부
 * @returns 메시지 렌더링에 필요한 클래스명 객체
 *
 * @example
 * ```tsx
 * const classes = getMessageClasses(true)
 * ```
 */
export const getMessageClasses = (isOwnMessage: boolean): MessageClassNames => {
  const baseItem = CHAT_MESSAGE_STYLES.baseMessage
  const baseContent = CHAT_MESSAGE_STYLES.contentBase
  const baseBubble = CHAT_MESSAGE_STYLES.bubbleBase

  if (isOwnMessage) {
    return {
      item: `${baseItem} ${CHAT_MESSAGE_STYLES.ownMessage}`,
      content: `${baseContent} ${CHAT_MESSAGE_STYLES.ownContent}`,
      bubble: `${baseBubble} ${CHAT_MESSAGE_STYLES.ownBubble}`,
    }
  }

  return {
    item: `${baseItem} ${CHAT_MESSAGE_STYLES.otherMessage}`,
    content: `${baseContent} ${CHAT_MESSAGE_STYLES.otherContent}`,
    bubble: `${baseBubble} ${CHAT_MESSAGE_STYLES.otherBubble}`,
  }
}

/**
 * 메시지에 대한 접근성 라벨을 생성하는 함수
 *
 * @param isOwnMessage - 내 메시지 여부
 * @param username - 사용자명 (다른 사용자 메시지인 경우)
 * @param timestamp - 메시지 전송 시간
 * @returns 스크린 리더용 접근성 라벨
 */
export const getMessageAriaLabel = (
  isOwnMessage: boolean,
  username: string,
  timestamp: string,
): string => {
  return isOwnMessage
    ? `Your message sent at ${timestamp}`
    : `Message from ${username} sent at ${timestamp}`
}
