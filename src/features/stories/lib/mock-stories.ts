import type { StoriesResponse, Story } from '@/entities/story/model/types'

export const generateMockStories = (
  count: number,
  page: number = 0,
): Story[] => {
  return Array.from({ length: count }, (_, index) => {
    const globalIndex = page * count + index
    return {
      id: `story-${globalIndex}`,
      title: `스토리 제목 ${globalIndex + 1}`,
      content: `이것은 ${globalIndex + 1}번째 스토리 내용입니다. 무한 스크롤 테스트를 위한 샘플 텍스트입니다. 이 스토리는 다양한 내용을 포함하고 있어서 테스트에 적합합니다.`,
      author: {
        id: `user-${(globalIndex % 5) + 1}`,
        name: `작성자 ${(globalIndex % 5) + 1}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${globalIndex}`,
      },
      createdAt: new Date(
        Date.now() - globalIndex * 1000 * 60 * 60,
      ).toISOString(),
      updatedAt: new Date(
        Date.now() - globalIndex * 1000 * 60 * 60,
      ).toISOString(),
      likes: Math.floor(Math.random() * 100),
      comments: Math.floor(Math.random() * 20),
      isLiked: Math.random() > 0.5,
    }
  })
}

export const generateMockStoriesResponse = (
  page: number = 0,
  size: number = 10,
  totalPages: number = 10,
): StoriesResponse => {
  const stories = generateMockStories(size, page)

  return {
    content: stories,
    pageNumber: page,
    pageSize: size,
    totalElements: totalPages * size,
    totalPages,
    hasNext: page < totalPages - 1,
    hasPrevious: page > 0,
  }
}
