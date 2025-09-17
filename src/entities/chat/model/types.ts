export interface ChatMessage {
  id: string
  content: string
  sender: {
    id: string
    name: string
    avatar?: string
  }
  timestamp: string // ISO string
  type: 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM'
  isEdited?: boolean
  editedAt?: string | undefined
  replyTo?: {
    messageId: string
    content: string
    senderName: string
  }
}

export interface ChatResponse {
  content: ChatMessage[]
  pageNumber: number
  pageSize: number
  totalElements: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

export interface ChatRoom {
  id: string
  name: string
  type: 'DIRECT' | 'GROUP' | 'CHANNEL'
  participants: Array<{
    id: string
    name: string
    avatar?: string
    role: 'ADMIN' | 'MEMBER' | 'VIEWER'
  }>
  lastMessage?: ChatMessage
  unreadCount: number
  isMuted: boolean
}
