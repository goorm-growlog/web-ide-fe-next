import type { ChatMessage } from '@/features/chat/types/client'

/**
 * 메시지를 시간순으로 정렬하는 함수
 * 히스토리 로드 시에만 사용
 */
export const sortMessagesByTimestamp = (
  messages: ChatMessage[],
): ChatMessage[] => {
  return [...messages].sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
  )
}

/**
 * 새로운 메시지를 올바른 위치에 삽입하는 함수
 * 전체 배열을 정렬하지 않고 효율적으로 삽입
 */
export const insertMessageInOrder = (
  messages: ChatMessage[],
  newMessage: ChatMessage,
): ChatMessage[] => {
  // 빈 배열이면 바로 추가
  if (messages.length === 0) {
    return [newMessage]
  }

  const newTimestamp = newMessage.timestamp.getTime()

  // 새 메시지가 가장 늦은 시간이면 맨 뒤에 추가
  const lastMessage = messages[messages.length - 1]
  if (lastMessage && newTimestamp >= lastMessage.timestamp.getTime()) {
    return [...messages, newMessage]
  }

  // 새 메시지가 가장 빠른 시간이면 맨 앞에 추가
  const firstMessage = messages[0]
  if (firstMessage && newTimestamp <= firstMessage.timestamp.getTime()) {
    return [newMessage, ...messages]
  }

  // 중간 위치에 삽입할 인덱스 찾기
  const insertIndex = messages.findIndex(
    msg => msg.timestamp.getTime() > newTimestamp,
  )

  if (insertIndex === -1) {
    // 찾지 못한 경우 맨 뒤에 추가
    return [...messages, newMessage]
  }

  // 올바른 위치에 삽입
  return [
    ...messages.slice(0, insertIndex),
    newMessage,
    ...messages.slice(insertIndex),
  ]
}
