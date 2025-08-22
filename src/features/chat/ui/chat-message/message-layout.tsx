import type { ReactNode } from 'react'
import type { ParsedChatMessage } from '@/features/chat/model/types'
import { getSystemMessageText } from '@/shared/lib/string-utils'
import { Badge } from '@/shared/ui/shadcn/badge'

/**
 * 채팅 메시지 레이아웃 관련 컴포넌트들
 *
 * 수정사항:
 * - 단순한 레이아웃 컴포넌트들을 한 파일로 통합
 * - CenteredContainer를 제거하고 직접 스타일 적용
 * - 코드 추적 경로 단순화 및 파일 수 최적화
 */

interface CenteredLayoutProps {
  children: ReactNode
  className?: string
}

/**
 * 중앙 정렬 레이아웃 컴포넌트
 * 날짜 헤더와 시스템 메시지에서 공통 사용
 */
const CenteredLayout = ({ children, className = '' }: CenteredLayoutProps) => (
  <div className={`my-8 flex justify-center ${className}`}>{children}</div>
)

/**
 * 날짜 헤더 컴포넌트
 */
export const DateHeader = ({ date }: { date: string }) => (
  <CenteredLayout>
    <div className="text-center font-medium text-muted-foreground text-xs">
      {date}
    </div>
  </CenteredLayout>
)

/**
 * 시스템 메시지 컴포넌트 (입장/퇴장 알림)
 */
export const SystemMessage = ({ message }: { message: ParsedChatMessage }) => (
  <CenteredLayout>
    <Badge
      variant="secondary"
      className="px-2 py-1 text-muted-foreground text-xs"
    >
      {getSystemMessageText(message)}
    </Badge>
  </CenteredLayout>
)
