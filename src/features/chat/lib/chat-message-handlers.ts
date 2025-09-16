import type React from 'react'
import type { ChatServerMessage } from '@/features/chat/types/api'
import type { ChatMessage } from '@/features/chat/types/client'
import { insertMessageInOrder } from './message-sorting-utils'

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
  handleEnterMessage: (payload: ChatServerMessage) => void
  handleTalkMessage: (payload: ChatServerMessage) => void
  handleLeaveMessage: (payload: ChatServerMessage) => void
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
   * 서버 메시지를 클라이언트 메시지로 변환하는 헬퍼 함수 (API 스펙에 맞게 수정)
   */
  const convertToClientMessage = (
    serverMessage: ChatServerMessage,
  ): ChatMessage => {
    return {
      id: `${serverMessage.projectId}-${serverMessage.sentAt}`, // ID 생성 로직
      content: serverMessage.content,
      type: serverMessage.messageType,
      user: {
        name: serverMessage.username,
      },
      timestamp: new Date(serverMessage.sentAt),
    }
  }

  /**
   * 사용자 입장 메시지 처리
   * 입장 메시지는 UI에 표시하지 않고 로딩 상태만 업데이트
   */
  const handleEnterMessage = (_payload: ChatServerMessage) => {
    setIsLoading(false)
  }

  /**
   * 일반 채팅 메시지 처리
   */
  const handleTalkMessage = (payload: ChatServerMessage) => {
    const message = convertToClientMessage(payload)
    setMessages(prev => insertMessageInOrder(prev, message))
  }

  /**
   * 사용자 퇴장 메시지 처리
   * 퇴장 메시지는 UI에 표시하지 않음
   */
  const handleLeaveMessage = (_payload: ChatServerMessage) => {
    // 퇴장 메시지는 UI에 표시하지 않음
  }

  return {
    handleEnterMessage,
    handleTalkMessage,
    handleLeaveMessage,
  }
}
