import { generateMockStoriesResponse } from '@/features/stories/lib/mock-stories'
import { authApi } from '@/shared/api/ky-client'
import { apiHelpers } from '@/shared/lib/api-helpers'
import type { ApiResponse } from '@/shared/types/api'
import type { StoriesResponse, Story } from '../model/types'

export const storyApi = {
  // 스토리 목록 조회 (SWR용)
  getStories: async (
    page: number = 0,
    size: number = 10,
  ): Promise<StoriesResponse> => {
    // 실제 API 호출 시뮬레이션
    await new Promise(resolve =>
      setTimeout(resolve, 500 + Math.random() * 1000),
    )

    // 모킹 데이터 반환
    return generateMockStoriesResponse(page, size, 10)

    // 실제 API 호출 코드 (주석 처리)
    /*
    const response = await authApi
      .get('stories', {
        searchParams: { page, size },
      })
      .json<ApiResponse<StoriesResponse>>()

    return apiHelpers.extractData(response)
    */
  },

  // 스토리 상세 조회
  getStory: async (id: string): Promise<Story> => {
    const response = await authApi
      .get(`stories/${id}`)
      .json<ApiResponse<Story>>()

    return apiHelpers.extractData(response)
  },

  // 스토리 좋아요 토글
  toggleLike: async (
    id: string,
  ): Promise<{ isLiked: boolean; likes: number }> => {
    const response = await authApi
      .post(`stories/${id}/like`)
      .json<ApiResponse<{ isLiked: boolean; likes: number }>>()

    return apiHelpers.extractData(response)
  },
}
