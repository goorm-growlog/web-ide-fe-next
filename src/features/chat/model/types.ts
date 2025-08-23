/**
 * 메시지 타입의 유니온 타입
 */

export const MESSAGE_TYPES = {
  ENTER: 'ENTER',
  LEAVE: 'LEAVE',
  TALK: 'TALK',
} as const

export type MessageType = (typeof MESSAGE_TYPES)[keyof typeof MESSAGE_TYPES]

/**
 * 시스템 메시지 타입
 */
export type SystemMessageType = Extract<MessageType, 'ENTER' | 'LEAVE'>

/**
 * 일반 채팅 메시지 타입
 */
export type ChatMessageType = Extract<MessageType, 'TALK'>

export interface ChatMessage {
  projectId: number
  messageType: MessageType
  userId: number
  username: string
  content: string
  sentAt: string
}

export interface ParsedChatMessage extends ChatMessage {
  parts: MessagePart[]
}

export interface MessagePart {
  originalText: string
  displayText: string
  link?: CodeLink
}

export interface CodeLink {
  fileName: string
  lineNumber: number
  url: string
}

/**
 * 메시지 스타일링을 위한 클래스명 인터페이스
 */
export interface MessageClassNames {
  item: string
  content: string
  bubble: string
}
