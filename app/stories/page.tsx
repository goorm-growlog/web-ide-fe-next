import { Suspense } from 'react'
import { StoriesPage } from '@/widgets/stories/ui/stories-page'
import { LoadingSpinner } from '@/shared/ui/loading-skeleton'

export default function Stories() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    }>
      <StoriesPage />
    </Suspense>
  )
}

export const metadata = {
  title: '스토리 - SWR 무한 스크롤',
  description: 'SWR 기반 무한 스크롤 테스트 페이지',
}
