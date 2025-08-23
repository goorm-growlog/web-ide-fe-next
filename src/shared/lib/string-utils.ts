import {
  MESSAGE_TYPES,
  type MessageType,
} from './../../features/chat/model/types'
// 사용자 이니셜 추출
export const getInitials = (username: string): string => {
  if (!username || typeof username !== 'string') return '?'

  const trimmed = username.trim()
  if (trimmed.length === 0) return '?'

  // 첫 번째 문자를 대문자로 변환
  return trimmed.charAt(0).toUpperCase()
}

// 시스템 메시지 텍스트 생성
export const getSystemMessageText = (message: {
  messageType: MessageType
  username: string
  content: string
}): string => {
  if (!message || !message.username) return 'System message'

  const { messageType, username, content } = message

  if (messageType === MESSAGE_TYPES.ENTER) {
    return `${username} joined this chatroom.`
  } else if (messageType === MESSAGE_TYPES.LEAVE) {
    return `${username} left this chatroom.`
  }

  return content || 'System message'
}
