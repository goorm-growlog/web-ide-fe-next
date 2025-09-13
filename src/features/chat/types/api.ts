/**
 * 채팅 메시지 타입
 */
export type ChatMessageType = 'ENTER' | 'TALK' | 'LEAVE'

/**
 * 서버에서 받는 채팅 메시지 데이터 구조
 * @param id 메시지의 고유 식별자
 * @param content 메시지 내용
 * @param type 메시지 타입 (ENTER, TALK, LEAVE)
 * @param userId 사용자 ID
 * @param userName 사용자 이름
 * @param userAvatar 사용자 아바타 URL
 * @param timestamp 메시지 생성 시간
 */
export interface ChatMessageDto {
  id: string
  content: string
  type: ChatMessageType
  userId: string
  userName: string
  userAvatar?: string
  timestamp: string
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
 * 채팅 메시지 (서버에서 받는 형태)
 * @param type 메시지 타입
 * @param payload 메시지 데이터
 */
export interface ChatMessage {
  type: ChatMessageTypeEnum
  payload: ChatMessageDto
}
