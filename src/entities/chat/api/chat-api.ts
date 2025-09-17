import { authApi } from '@/shared/api/ky-client'
import { apiHelpers } from '@/shared/lib/api-helpers'
import type { ApiResponse } from '@/shared/types/api'
import type { ChatMessage, ChatResponse, ChatRoom } from '../model/types'

export const chatApi = {
  // 채팅 메시지 목록 조회 (무한 스크롤용)
  getMessages: async (
    _roomId: string,
    page: number = 0,
    size: number = 20,
  ): Promise<ChatResponse> => {
    // 실제 API 호출 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 100))

    // 모킹 데이터 생성
    const mockMessages = generateMockMessages(size, page)

    return {
      content: mockMessages,
      pageNumber: page,
      pageSize: size,
      totalElements: 1000, // 임의의 총 메시지 수
      totalPages: Math.ceil(1000 / size),
      hasNext: (page + 1) * size < 1000,
      hasPrevious: page > 0,
    }

    // 실제 API 호출 코드 (주석 처리)
    /*
    const response = await authApi
      .get(`chat/rooms/${roomId}/messages`, {
        searchParams: { page, size },
      })
      .json<ApiResponse<ChatResponse>>()

    return apiHelpers.extractData(response)
    */
  },

  // 새 메시지 전송
  sendMessage: async (
    _roomId: string,
    content: string,
    type: 'TEXT' | 'IMAGE' | 'FILE' = 'TEXT',
  ): Promise<ChatMessage> => {
    // 실제 API 호출 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 100))

    // 모킹 데이터 생성 (사용자 메시지)
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      content,
      sender: {
        id: 'user1', // 현재 사용자 ID
        name: '나',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
      },
      timestamp: new Date().toISOString(),
      type,
      isEdited: false,
      editedAt: undefined,
    }

    return newMessage

    // 실제 API 호출 코드 (주석 처리)
    /*
    const response = await authApi
      .post(`chat/rooms/${roomId}/messages`, {
        json: { content, type },
      })
      .json<ApiResponse<ChatMessage>>()

    return apiHelpers.extractData(response)
    */
  },

  // 채팅방 목록 조회
  getRooms: async (): Promise<ChatRoom[]> => {
    const response = await authApi
      .get('chat/rooms')
      .json<ApiResponse<ChatRoom[]>>()

    return apiHelpers.extractData(response)
  },

  // 메시지 수정
  editMessage: async (
    roomId: string,
    messageId: string,
    content: string,
  ): Promise<ChatMessage> => {
    const response = await authApi
      .put(`chat/rooms/${roomId}/messages/${messageId}`, {
        json: { content },
      })
      .json<ApiResponse<ChatMessage>>()

    return apiHelpers.extractData(response)
  },

  // 메시지 삭제
  deleteMessage: async (roomId: string, messageId: string): Promise<void> => {
    await authApi.delete(`chat/rooms/${roomId}/messages/${messageId}`)
  },
}

// 모킹 데이터 생성 함수
const generateMockMessages = (count: number, page: number): ChatMessage[] => {
  const users = [
    {
      id: 'user1',
      name: 'Alice',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
    },
    {
      id: 'user2',
      name: 'Bob',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
    },
    {
      id: 'user3',
      name: 'Charlie',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=charlie',
    },
    {
      id: 'user4',
      name: 'Diana',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=diana',
    },
  ]

  return Array.from({ length: count }, (_, index) => {
    const globalIndex = page * count + index
    const user = users[globalIndex % users.length]

    if (!user) {
      throw new Error('User not found')
    }

    return {
      id: `msg-${globalIndex}`,
      content: `메시지 내용 ${globalIndex + 1}: 이것은 테스트 메시지입니다. 무한 스크롤 테스트를 위한 샘플 텍스트입니다.`,
      sender: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
      },
      timestamp: new Date(
        Date.now() - globalIndex * 1000 * 60 * 5,
      ).toISOString(), // 5분 간격
      type: 'TEXT' as const,
      isEdited: Math.random() > 0.9,
      editedAt:
        Math.random() > 0.9
          ? new Date(Date.now() - globalIndex * 1000 * 60 * 3).toISOString()
          : undefined,
    }
  })
}
