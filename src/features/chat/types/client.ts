import type { ChatMessageType } from '@/features/chat/types/api'

/**
 * 클라이언트에서 사용하는 채팅 메시지 타입
 * 서버에서 받은 데이터를 클라이언트에서 사용하기 편한 형태로 변환
 */
/**
 * 클라이언트에서 사용하는 채팅 메시지 타입
 * 서버에서 받은 데이터를 클라이언트에서 사용하기 편한 형태로 변환
 */
/**
 * 클라이언트에서 사용하는 채팅 메시지 타입
 * 서버에서 받은 데이터를 클라이언트에서 사용하기 편한 형태로 변환
 */
export interface ChatMessage {
  id: string
  content: string
  type: ChatMessageType
  user: {
    name: string
    avatar?: string
  }
  timestamp: Date
}

/**
 * 채팅 훅의 반환 타입
 */
export interface ChatReturn {
  messages: ChatMessage[]
  isLoading: boolean
  sendMessage: (content: string) => void
  hasMore: boolean
  loadMore: () => void
  isLoadingMore: boolean
}

/**
 * 메시지 파트 (텍스트와 코드 링크)
 */
export interface MessagePart {
  text: string
  codeLink?: CodeLink
}

/**
 * 코드 링크 정보
 */
export interface CodeLink {
  fileName: string
  lineNumber: number
  url: string
}
