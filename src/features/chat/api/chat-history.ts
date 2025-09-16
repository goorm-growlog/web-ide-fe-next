import { authApi } from '@/shared/api/ky-client'

export interface ChatHistoryResponse {
  content: ChatHistoryMessage[]
  pageNumber: number
  totalElements: number
  totalPages: number
}

export interface ChatHistoryMessage {
  messageType: 'ENTER' | 'TALK' | 'LEAVE'
  projectId: number
  username: string
  content: string
  sentAt: string
}

export interface ChatHistoryParams {
  page?: number
  size?: number
}

/**
 * 채팅 히스토리를 가져오는 API 함수
 */
export async function getChatHistory(
  projectId: number,
  params: ChatHistoryParams = {},
): Promise<ChatHistoryResponse> {
  const { page = 0, size = 20 } = params

  const response = await authApi
    .get(`/api/projects/${projectId}/chat/history`, {
      searchParams: { page, size },
    })
    .json<ChatHistoryResponse>()

  return response
}
