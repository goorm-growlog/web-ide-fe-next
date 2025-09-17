export interface Story {
  id: string
  title: string
  content: string
  author: {
    id: string
    name: string
    avatar?: string
  }
  createdAt: string // ISO string
  updatedAt: string
  likes: number
  comments: number
  isLiked: boolean
}

export interface StoriesResponse {
  content: Story[]
  pageNumber: number
  pageSize: number
  totalElements: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}
