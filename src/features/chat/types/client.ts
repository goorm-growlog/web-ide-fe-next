import type { ChatMessageType } from './api'

/**
 * 클라이언트에서 사용하는 채팅 메시지 타입
 * 서버에서 받은 데이터를 클라이언트에서 사용하기 편한 형태로 변환
 */
export interface ChatMessage {
  id: string
  content: string
  type: ChatMessageType
  userId: string
  userName: string
  userAvatar?: string
  timestamp: Date
}

/**
 * 채팅 훅의 반환 타입
 */
export interface ChatReturn {
  messages: ChatMessage[]
  sendMessage: (content: string) => void
  isLoading: boolean
  error: string | null
}
