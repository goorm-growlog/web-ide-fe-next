import type React from 'react'
import type { ChatMessageDto } from '@/features/chat/types/api'
import type { ChatMessage } from '@/features/chat/types/client'

/**
 * 채팅 메시지 핸들러에 필요한 의존성
 * 채팅 메시지 작업을 위한 상태 관리 함수들을 제공
 */
export interface ChatMessageDependencies {
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

/**
 * WebSocket에서 오는 다양한 채팅 메시지 핸들러들
 * 각 핸들러는 특정 유형의 채팅 메시지를 처리
 */
export interface ChatMessageHandlers {
  handleEnterMessage: (payload: ChatMessageDto) => void
  handleTalkMessage: (payload: ChatMessageDto) => void
  handleLeaveMessage: (payload: ChatMessageDto) => void
}

/**
 * 채팅 메시지 핸들러를 생성하는 팩토리 함수
 * WebSocket 메시지를 채팅 상태 업데이트로 변환
 *
 * @param deps - 상태 관리 함수들을 포함하는 의존성
 * @returns 모든 채팅 메시지 핸들러를 포함하는 객체
 */
export const createChatMessageHandlers = (
  deps: ChatMessageDependencies,
): ChatMessageHandlers => {
  const { setMessages, setIsLoading } = deps

  /**
   * 서버 DTO를 클라이언트 메시지로 변환하는 헬퍼 함수
   */
  const convertToClientMessage = (dto: ChatMessageDto): ChatMessage => {
    const message: ChatMessage = {
      id: dto.id,
      content: dto.content,
      type: dto.type,
      userId: dto.userId,
      userName: dto.userName,
      timestamp: new Date(dto.timestamp),
    }

    if (dto.userAvatar !== undefined) {
      message.userAvatar = dto.userAvatar
    }

    return message
  }

  /**
   * 사용자 입장 메시지 처리
   */
  const handleEnterMessage = (payload: ChatMessageDto) => {
    const message = convertToClientMessage(payload)
    setMessages(prev => [...prev, message])
    setIsLoading(false)
  }

  /**
   * 일반 채팅 메시지 처리
   */
  const handleTalkMessage = (payload: ChatMessageDto) => {
    const message = convertToClientMessage(payload)
    setMessages(prev => [...prev, message])
  }

  /**
   * 사용자 퇴장 메시지 처리
   */
  const handleLeaveMessage = (payload: ChatMessageDto) => {
    const message = convertToClientMessage(payload)
    setMessages(prev => [...prev, message])
  }

  return {
    handleEnterMessage,
    handleTalkMessage,
    handleLeaveMessage,
  }
}
