// 사용자 이니셜 추출
export const getInitials = (username: string) => {
  return username.charAt(0).toUpperCase()
}

// 시스템 메시지 텍스트 생성
export const getSystemMessageText = (message: {
  messageType: string
  username: string
  content: string
}) => {
  if (message.messageType === 'ENTER') {
    return `${message.username} joined this chatroom.`
  } else if (message.messageType === 'LEAVE') {
    return `${message.username} left this chatroom.`
  }
  return message.content
}
