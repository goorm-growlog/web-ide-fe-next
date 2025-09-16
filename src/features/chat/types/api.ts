/**
 * 채팅 메시지 타입
 */
export type ChatMessageType = 'ENTER' | 'TALK' | 'LEAVE'

/**
 * 서버에서 받는 채팅 메시지 데이터 구조 (API 스펙에 맞게 수정)
 * @param messageType 메시지 타입 (ENTER, TALK, LEAVE)
 * @param projectId 프로젝트 ID
 * @param username 사용자 이름
 * @param content 메시지 내용
 * @param sentAt 메시지 생성 시간
 */
export interface ChatMessageDto {
  messageType: ChatMessageType
  projectId: number
  username: string
  content: string
  sentAt: string
}

/**
 * 채팅 메시지 발송 페이로드
 * @param content 메시지 내용
 */
export interface ChatTalkPayload {
  content: string
}

export const CHAT_MESSAGE_TYPES = {
  ENTER: 'ENTER',
  TALK: 'TALK',
  LEAVE: 'LEAVE',
} as const

export type ChatMessageTypeEnum =
  (typeof CHAT_MESSAGE_TYPES)[keyof typeof CHAT_MESSAGE_TYPES]

/**
 * 서버에서 받는 채팅 메시지 형태 (API 스펙에 맞게 수정)
 * 서버에서 직접 받는 메시지 구조
 */
export interface ChatServerMessage {
  messageType: ChatMessageType
  projectId: number
  username: string
  content: string
  sentAt: string
}
